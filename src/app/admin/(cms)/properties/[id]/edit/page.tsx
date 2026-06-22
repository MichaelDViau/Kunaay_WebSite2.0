import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PropertyForm from '@/components/admin/PropertyForm';
import ImageManager from '@/components/admin/ImageManager';
import CalendarManager from '@/components/admin/CalendarManager';

export const dynamic = 'force-dynamic';

type Params = { id: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const p = await prisma.property.findUnique({ where: { id }, select: { name: true } });
  return { title: p ? `Edit — ${p.name}` : 'Edit Property' };
}

export default async function EditPropertyPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const [property, amenities] = await Promise.all([
    prisma.property.findUnique({
      where: { id },
      include: {
        descriptions: { orderBy: { sortOrder: 'asc' } },
        images: { orderBy: { sortOrder: 'asc' } },
        highlights: { orderBy: { sortOrder: 'asc' } },
        features: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } },
        bookedDates: { orderBy: { date: 'asc' } },
        relatedTo: { orderBy: { sortOrder: 'asc' } },
      },
    }),
    prisma.amenity.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!property) notFound();

  const initialData = {
    slug: property.slug,
    name: property.name,
    type: property.type,
    status: property.status,
    badge: property.badge,
    location: property.location,
    subtitle: property.subtitle,
    heroLabel: property.heroLabel,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    guests: property.guests,
    squareFeet: property.squareFeet,
    shortDescription: property.shortDescription,
    whatsappUrl: property.whatsappUrl,
    displayOrder: property.displayOrder,
    seoTitle: property.seoTitle,
    seoDescription: property.seoDescription,
    seoOgImage: property.seoOgImage,
    seoCanonical: property.seoCanonical,
    descriptions: property.descriptions.map((d) => d.text),
    highlights: property.highlights.map((h) => ({ icon: h.icon, label: h.label })),
    features: property.features.map((f) => f.text),
    selectedAmenityIds: property.amenities.map((pa) => pa.amenityId),
    relatedProperties: property.relatedTo.map((r) => ({
      slug: r.slug, name: r.name, location: r.location, image: r.image,
    })),
  };

  const bookedDates = property.bookedDates.map((d) => ({
    id: d.id, date: d.date, note: d.note, dateType: d.dateType,
  }));

  const images = property.images.map((img) => ({
    id: img.id, url: img.url, thumbUrl: img.thumbUrl, title: img.title,
    isHero: img.isHero, isCover: img.isCover, sortOrder: img.sortOrder,
  }));

  return (
    <div className="a-page">
      <div className="a-page-header">
        <div>
          <h1 className="a-page-title">{property.name}</h1>
          <p className="a-page-sub">Edit property details, images, and availability.</p>
        </div>
        <a href={`/properties/${property.slug}`} target="_blank" className="btn-a btn-ghost-a">
          View Live →
        </a>
      </div>

      <div className="a-edit-sections">
        <section className="a-edit-section">
          <h2 className="a-section-title">Property Details</h2>
          <PropertyForm propertyId={id} amenities={amenities} initialData={initialData} />
        </section>

        <section className="a-edit-section">
          <h2 className="a-section-title">Images</h2>
          <ImageManager propertyId={id} initialImages={images} />
        </section>

        {property.type === 'rental' && (
          <section className="a-edit-section">
            <h2 className="a-section-title">Availability Calendar</h2>
            <CalendarManager propertyId={id} initialDates={bookedDates} />
          </section>
        )}
      </div>
    </div>
  );
}
