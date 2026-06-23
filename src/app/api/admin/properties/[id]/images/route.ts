import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { processAndSave } from '@/lib/image-utils';

type Params = { params: Promise<{ id: string }> };

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB per file

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Verify property exists
  const prop = await prisma.property.findUnique({ where: { id }, select: { id: true } });
  if (!prop) return NextResponse.json({ error: 'Property not found.' }, { status: 404 });

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) return NextResponse.json({ error: 'No files provided.' }, { status: 400 });

  // Validate each file before processing
  for (const file of files) {
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `File "${file.name}" is not a supported image format. Use JPEG, PNG, WebP, GIF, or AVIF.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds the 20 MB limit.` },
        { status: 400 }
      );
    }
  }

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

  // Auto-set first image as hero if none exists yet
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
  try {
    const body = await req.json() as { orderedIds: string[] };
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array.' }, { status: 400 });
    }

    await prisma.$transaction(
      orderedIds.map((imgId, i) =>
        prisma.propertyImage.update({ where: { id: imgId, propertyId: id }, data: { sortOrder: i } })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/admin/properties/[id]/images]', err);
    return NextResponse.json({ error: 'Failed to reorder images.' }, { status: 500 });
  }
}
