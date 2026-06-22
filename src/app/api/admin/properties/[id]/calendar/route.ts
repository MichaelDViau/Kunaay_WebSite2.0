import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateDate(date: unknown): date is string {
  return typeof date === 'string' && ISO_DATE_RE.test(date) && !isNaN(Date.parse(date));
}

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
  try {
    const body = await req.json() as { date?: string; note?: string; dateType?: string };
    const { date, note, dateType } = body;

    if (!validateDate(date)) {
      return NextResponse.json({ error: 'Invalid date. Expected format: YYYY-MM-DD.' }, { status: 400 });
    }

    const entry = await prisma.bookedDate.upsert({
      where: { propertyId_date: { propertyId: id, date } },
      update: { note: note || '', dateType: dateType || 'blocked' },
      create: { propertyId: id, date, note: note || '', dateType: dateType || 'blocked' },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/properties/[id]/calendar]', err);
    return NextResponse.json({ error: 'Failed to save date.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json() as { date?: string };
    const { date } = body;

    if (!validateDate(date)) {
      return NextResponse.json({ error: 'Invalid date. Expected format: YYYY-MM-DD.' }, { status: 400 });
    }

    await prisma.bookedDate.deleteMany({ where: { propertyId: id, date } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/admin/properties/[id]/calendar]', err);
    return NextResponse.json({ error: 'Failed to remove date.' }, { status: 500 });
  }
}
