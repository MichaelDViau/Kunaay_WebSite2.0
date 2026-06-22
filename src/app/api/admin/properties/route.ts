import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
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
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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

    // Ensure slug is unique
    const existing = await prisma.property.findUnique({ where: { slug: slug.trim() } });
    if (existing) {
      return NextResponse.json({ error: 'A property with this slug already exists.' }, { status: 409 });
    }

    const property = await prisma.property.create({
      data: {
        slug: slug.trim(),
        name: name.trim(),
        type,
        status: status || 'draft',
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

    return NextResponse.json(property, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/properties]', err);
    return NextResponse.json({ error: 'Failed to create property.' }, { status: 500 });
  }
}
