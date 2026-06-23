import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(amenities);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let parsed: { name?: string; icon?: string };
    try {
      parsed = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const { name, icon } = parsed;

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
      data: { name: name.trim(), icon: (icon?.trim() || 'home').slice(0, 60) },
    });
    return NextResponse.json(amenity, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/amenities]', err);
    return NextResponse.json({ error: 'Failed to create amenity.' }, { status: 500 });
  }
}
