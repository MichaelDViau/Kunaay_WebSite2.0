import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { describeError } from '@/lib/api-errors';
import { validateAndNormalizeProperty } from '@/lib/property-validation';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const property = await prisma.property.findUnique({
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
  });

  if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
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

    // Check slug uniqueness (excluding this property)
    const slugConflict = await prisma.property.findFirst({
      where: { slug: d.slug, NOT: { id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: 'A property with this slug already exists.' }, { status: 409 });
    }

    // Delete relations and recreate in a single transaction
    const property = await prisma.$transaction(async (tx) => {
      await tx.propertyDescription.deleteMany({ where: { propertyId: id } });
      await tx.propertyHighlight.deleteMany({ where: { propertyId: id } });
      await tx.propertyFeature.deleteMany({ where: { propertyId: id } });
      await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });
      await tx.relatedProperty.deleteMany({ where: { propertyId: id } });

      return tx.property.update({
        where: { id },
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
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error('[PUT /api/admin/properties/[id]]', err);
    const { message, detail } = describeError(err);
    return NextResponse.json(
      { error: 'Failed to update property.', reason: message, detail },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/properties/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete property.' }, { status: 500 });
  }
}
