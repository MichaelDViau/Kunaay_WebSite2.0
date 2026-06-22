import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const src = await prisma.property.findUnique({
    where: { id },
    include: {
      descriptions: true,
      images: true,
      highlights: true,
      features: true,
      amenities: true,
      relatedTo: true,
    },
  });

  if (!src) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const newSlug = `${src.slug}-copy-${Date.now()}`;
  const copy = await prisma.property.create({
    data: {
      slug: newSlug,
      name: `${src.name} (Copy)`,
      type: src.type,
      status: 'draft',
      badge: src.badge,
      location: src.location,
      subtitle: src.subtitle,
      heroLabel: src.heroLabel,
      bedrooms: src.bedrooms,
      bathrooms: src.bathrooms,
      guests: src.guests,
      squareFeet: src.squareFeet,
      price: src.price,
      shortDescription: src.shortDescription,
      whatsappUrl: src.whatsappUrl,
      seoTitle: `${src.seoTitle} (Copy)`,
      seoDescription: src.seoDescription,
      seoOgImage: src.seoOgImage,
      seoCanonical: `https://www.kunaay.com/properties/${newSlug}`,
      displayOrder: src.displayOrder,
      descriptions: {
        create: src.descriptions.map((d) => ({ text: d.text, sortOrder: d.sortOrder })),
      },
      images: {
        create: src.images.map((i) => ({
          url: i.url,
          thumbUrl: i.thumbUrl,
          title: i.title,
          isCover: i.isCover,
          isHero: i.isHero,
          sortOrder: i.sortOrder,
        })),
      },
      highlights: {
        create: src.highlights.map((h) => ({ icon: h.icon, label: h.label, sortOrder: h.sortOrder })),
      },
      features: {
        create: src.features.map((f) => ({ text: f.text, sortOrder: f.sortOrder })),
      },
      amenities: {
        create: src.amenities.map((a) => ({ amenityId: a.amenityId })),
      },
      relatedTo: {
        create: src.relatedTo.map((r) => ({
          slug: r.slug,
          name: r.name,
          location: r.location,
          image: r.image,
          sortOrder: r.sortOrder,
        })),
      },
    },
  });

  return NextResponse.json(copy, { status: 201 });
}
