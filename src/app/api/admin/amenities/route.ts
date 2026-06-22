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

  const { name, icon } = await req.json() as { name: string; icon?: string };
  const amenity = await prisma.amenity.create({
    data: { name, icon: icon || 'home' },
  });
  return NextResponse.json(amenity, { status: 201 });
}
