import { prisma } from '@/lib/prisma';
import type { Property, PropertyType, PropertyStatus } from '@/data/types';

const include = {
  descriptions: { orderBy: { sortOrder: 'asc' as const } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  highlights: { orderBy: { sortOrder: 'asc' as const } },
  features: { orderBy: { sortOrder: 'asc' as const } },
  amenities: { include: { amenity: true }, orderBy: { id: 'asc' as const } },
  bookedDates: true,
  relatedTo: { orderBy: { sortOrder: 'asc' as const } },
} as const;

type DbProperty = NonNullable<Awaited<ReturnType<typeof prisma.property.findFirst>>>;
type DbPropertyFull = DbProperty & {
  descriptions: { text: string; sortOrder: number }[];
  images: { url: string; thumbUrl: string; isHero: boolean; isCover: boolean; sortOrder: number }[];
  highlights: { icon: string; label: string; sortOrder: number }[];
  features: { text: string; sortOrder: number }[];
  amenities: { amenity: { name: string } }[];
  bookedDates: { date: string }[];
  relatedTo: { slug: string; name: string; location: string; image: string; sortOrder: number }[];
};

function mapProperty(p: DbPropertyFull): Property {
  const sorted = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const hero = sorted.find((i) => i.isHero) ?? sorted[0];
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    type: p.type as PropertyType,
    status: p.status as PropertyStatus,
    badge: p.badge,
    location: p.location,
    subtitle: p.subtitle,
    heroLabel: p.heroLabel,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    highlights: p.highlights.map((h) => ({ icon: h.icon, label: h.label })),
    shortDescription: p.shortDescription,
    longDescriptions: p.descriptions.map((d) => d.text),
    features: p.features.map((f) => f.text),
    gallery: {
      cardThumbs: sorted.slice(0, 3).map((i) => i.url),
      heroImage: hero?.url ?? '',
      gridThumbs: sorted.slice(0, 4).map((i) => i.url),
      lightbox: sorted.map((i) => i.url),
    },
    bookedDays: [],
    bookedDates: p.bookedDates.map((d) => d.date),
    relatedProperties: p.relatedTo.map((r) => ({
      slug: r.slug,
      name: r.name,
      location: r.location,
      image: r.image,
    })),
    whatsappUrl: p.whatsappUrl,
    seo: {
      title: p.seoTitle || p.name,
      description: p.seoDescription || p.shortDescription,
      ogImage: p.seoOgImage || hero?.url || '',
      canonical: p.seoCanonical || `https://www.kunaay.com/properties/${p.slug}`,
    },
  };
}

export async function getAllProperties(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { status: 'published' },
    orderBy: { displayOrder: 'asc' },
    include,
  });
  return (rows as DbPropertyFull[]).map(mapProperty);
}

export async function getRentalPropertiesDB(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { type: 'rental', status: 'published' },
    orderBy: { displayOrder: 'asc' },
    include,
  });
  return (rows as DbPropertyFull[]).map(mapProperty);
}

export async function getSalePropertiesDB(): Promise<Property[]> {
  const rows = await prisma.property.findMany({
    where: { type: 'sale', status: 'published' },
    orderBy: { displayOrder: 'asc' },
    include,
  });
  return (rows as DbPropertyFull[]).map(mapProperty);
}

export async function getPropertyBySlugDB(slug: string): Promise<Property | null> {
  const p = await prisma.property.findUnique({ where: { slug }, include });
  if (!p) return null;
  return mapProperty(p as DbPropertyFull);
}
