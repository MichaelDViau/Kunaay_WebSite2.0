import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyBySlugDB } from '@/lib/property-service';
import PageHero from '@/components/ui/PageHero';
import PropertyGallery from '@/components/properties/PropertyGallery';
import BookingSidebar from '@/components/properties/BookingSidebar';
import AvailabilityCalendar from '@/components/properties/AvailabilityCalendar';
import RelatedProperties from '@/components/properties/RelatedProperties';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlugDB(slug);
  if (!property) return {};
  return {
    title: property.seo.title,
    description: property.seo.description,
    alternates: { canonical: property.seo.canonical },
    openGraph: {
      title: property.seo.title,
      description: property.seo.description,
      url: property.seo.canonical,
      images: [{ url: property.seo.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: property.seo.title,
      description: property.seo.description,
      images: [property.seo.ogImage],
    },
  };
}

const iconMap: Record<string, string> = {
  bed: '#i-bed',
  bath: '#i-bath',
  waves: '#i-waves',
  pool: '#i-pool',
  kitchen: '#i-kitchen',
  parking: '#i-parking',
  home: '#i-home',
  coffee: '#i-coffee',
};

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlugDB(slug);
  if (!property) notFound();

  return (
    <>
      <PageHero
        label={property.heroLabel}
        title={property.name}
        backgroundImage={property.gallery.heroImage}
        height="55vh"
      />

      <PropertyGallery
        heroImage={property.gallery.heroImage}
        gridThumbs={property.gallery.gridThumbs}
        lightbox={property.gallery.lightbox}
        name={property.name}
      />

      <div className="detail-content">
        <div className="detail-grid">
          <div>
            <h2 className="detail-title">{property.name}</h2>
            <div className="detail-subtitle">{property.subtitle}</div>

            <div className="detail-highlights">
              {property.highlights.map((h) => (
                <div key={h.label} className="highlight-item">
                  <div className="highlight-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <use href={iconMap[h.icon] ?? `#i-${h.icon}`} />
                    </svg>
                  </div>
                  <div className="highlight-label">{h.label}</div>
                </div>
              ))}
            </div>

            {property.longDescriptions.map((para, i) => (
              <p key={i} className="detail-desc">{para}</p>
            ))}

            <div className="detail-features">
              <h3>Property Features</h3>
              <div className="features-list">
                {property.features.map((f) => (
                  <div key={f} className="feature-item">{f}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-sidebar">
            <BookingSidebar whatsappUrl={property.whatsappUrl} type={property.type} />
            {property.type === 'rental' && (
              <AvailabilityCalendar bookedDates={property.bookedDates ?? []} />
            )}
          </div>
        </div>
      </div>

      <RelatedProperties properties={property.relatedProperties} />
    </>
  );
}
