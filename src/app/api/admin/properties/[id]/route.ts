import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const {
      slug, name, type, status, badge, location, subtitle, heroLabel,
      bedrooms, bathrooms, guests, squareFeet, price, shortDescription,
      whatsappUrl, seoTitle, seoDescription, seoOgImage, seoCanonical,
      displayOrder, descriptions, highlights, features, amenityIds,
      relatedProperties,
    } = body;

    if (!slug?.trim() || !name?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 });
    }

    // Check slug uniqueness (excluding this property)
    const slugConflict = await prisma.property.findFirst({
      where: { slug: slug.trim(), NOT: { id } },
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
          slug: slug.trim(),
          name: name.trim(),
          type,
          status,
          badge: badge || (type === 'rental' ? 'Rental' : 'For Sale'),
          location: location || '',
          subtitle: subtitle || '',
          heroLabel: heroLabel || '',
          bedrooms: Number(bedrooms) || 0,
          bathrooms: Number(bathrooms) || 0,
          guests: guests ? Number(guests) : null,
          squareFeet: squareFeet ? Number(squareFeet) : null,
          price: price || '',
          shortDescription: shortDescription || '',
          whatsappUrl: whatsappUrl || '',
          seoTitle: seoTitle || name.trim(),
          seoDescription: seoDescription || shortDescription || '',
          seoOgImage: seoOgImage || '',
          seoCanonical: seoCanonical || `https://www.kunaay.com/properties/${slug.trim()}`,
          displayOrder: Number(displayOrder) || 0,
          descriptions: {
            create: (descriptions || []).map((d: { text: string }, i: number) => ({
              text: d.text,
              sortOrder: i,
            })),
          },
          highlights: {
            create: (highlights || []).map((h: { icon: string; label: string }, i: number) => ({
              icon: h.icon,
              label: h.label,
              sortOrder: i,
            })),
          },
          features: {
            create: (features || []).map((f: string, i: number) => ({
              text: f,
              sortOrder: i,
            })),
          },
          amenities: {
            create: (amenityIds || []).map((amenityId: string) => ({ amenityId })),
          },
          relatedTo: {
            create: (relatedProperties || []).map(
              (r: { slug: string; name: string; location: string; image: string }, i: number) => ({
                slug: r.slug,
                name: r.name,
                location: r.location,
                image: r.image,
                sortOrder: i,
              })
            ),
          },
        },
      });
    });

    return NextResponse.json(property);
  } catch (err) {
    console.error('[PUT /api/admin/properties/[id]]', err);
    return NextResponse.json({ error: 'Failed to update property.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
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
