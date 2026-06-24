import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { describeError } from '@/lib/api-errors';
import { validateAndNormalizeProperty } from '@/lib/property-validation';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const properties = await prisma.property.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      images: { where: { isHero: true }, take: 1 },
      _count: { select: { images: true, bookedDates: true } },
    },
  });
  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const result = validateAndNormalizeProperty(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const d = result.data;

    // Ensure slug is unique
    const existing = await prisma.property.findUnique({ where: { slug: d.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A property with this slug already exists.' }, { status: 409 });
    }

    const property = await prisma.property.create({
      data: {
        slug: d.slug,
        name: d.name,
        type: d.type,
        status: d.status,
        badge: d.badge,
        location: d.location,
        subtitle: d.subtitle,
        heroLabel: d.heroLabel,
        bedrooms: d.bedrooms,
        bathrooms: d.bathrooms,
        guests: d.guests,
        squareFeet: d.squareFeet,
        price: d.price,
        shortDescription: d.shortDescription,
        whatsappUrl: d.whatsappUrl,
        seoTitle: d.seoTitle,
        seoDescription: d.seoDescription,
        seoOgImage: d.seoOgImage,
        seoCanonical: d.seoCanonical,
        displayOrder: d.displayOrder,
        descriptions: { create: d.descriptions },
        highlights: { create: d.highlights },
        features: { create: d.features },
        amenities: { create: d.amenityIds.map((amenityId) => ({ amenityId })) },
        relatedTo: { create: d.relatedProperties },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/properties]', err);
    const { message, detail } = describeError(err);
    return NextResponse.json(
      { error: 'Failed to create property.', reason: message, detail },
      { status: 500 }
    );
  }
}
