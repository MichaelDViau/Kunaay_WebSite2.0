import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const dates = await prisma.bookedDate.findMany({
    where: { propertyId: id },
    orderBy: { date: 'asc' },
  });
  return NextResponse.json(dates);
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { date, note, dateType } = await req.json() as {
    date: string;
    note?: string;
    dateType?: string;
  };

  const entry = await prisma.bookedDate.upsert({
    where: { propertyId_date: { propertyId: id, date } },
    update: { note: note || '', dateType: dateType || 'blocked' },
    create: { propertyId: id, date, note: note || '', dateType: dateType || 'blocked' },
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { date } = await req.json() as { date: string };

  await prisma.bookedDate.deleteMany({ where: { propertyId: id, date } });
  return NextResponse.json({ ok: true });
}
