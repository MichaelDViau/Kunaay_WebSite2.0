import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { processAndSave } from '@/lib/image-utils';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });

  const maxOrder = await prisma.propertyImage.aggregate({
    where: { propertyId: id },
    _max: { sortOrder: true },
  });
  let order = (maxOrder._max.sortOrder ?? -1) + 1;

  const created = [];
  for (const file of files) {
    const buf = Buffer.from(await file.arrayBuffer());
    const { url, thumbUrl } = await processAndSave(buf, id, file.name);
    const img = await prisma.propertyImage.create({
      data: { propertyId: id, url, thumbUrl, sortOrder: order++ },
    });
    created.push(img);
  }

  // Auto-set first image as hero if none exists
  const hasHero = await prisma.propertyImage.count({ where: { propertyId: id, isHero: true } });
  if (!hasHero && created[0]) {
    await prisma.propertyImage.update({ where: { id: created[0].id }, data: { isHero: true } });
    created[0].isHero = true;
  }

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { orderedIds } = await req.json() as { orderedIds: string[] };

  await prisma.$transaction(
    orderedIds.map((imgId, i) =>
      prisma.propertyImage.update({ where: { id: imgId, propertyId: id }, data: { sortOrder: i } })
    )
  );

  return NextResponse.json({ ok: true });
}
