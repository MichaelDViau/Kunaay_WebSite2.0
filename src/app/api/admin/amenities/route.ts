import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(amenities);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { name, icon } = await req.json() as { name?: string; icon?: string };

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Amenity name is required.' }, { status: 400 });
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Amenity name must be 100 characters or fewer.' }, { status: 400 });
    }

    // Prevent exact duplicates
    const existing = await prisma.amenity.findFirst({
      where: { name: name.trim() },
    });
    if (existing) return NextResponse.json(existing); // return existing rather than erroring

    const amenity = await prisma.amenity.create({
      data: { name: name.trim(), icon: icon?.trim() || 'home' },
    });
    return NextResponse.json(amenity, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/amenities]', err);
    return NextResponse.json({ error: 'Failed to create amenity.' }, { status: 500 });
  }
}
