import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { deleteFile } from '@/lib/image-utils';

type Params = { params: Promise<{ id: string; imageId: string }> };

const MAX_TITLE_LEN = 300;

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, imageId } = await params;
  try {
    let body: { title?: string; isHero?: boolean; isCover?: boolean };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const title = typeof body.title === 'string' ? body.title.slice(0, MAX_TITLE_LEN) : undefined;

    if (body.isHero) {
      await prisma.propertyImage.updateMany({ where: { propertyId: id }, data: { isHero: false } });
    }
    if (body.isCover !== undefined) {
      await prisma.propertyImage.updateMany({ where: { propertyId: id }, data: { isCover: false } });
    }

    const img = await prisma.propertyImage.update({
      where: { id: imageId, propertyId: id },
      data: {
        ...(title !== undefined && { title }),
        ...(body.isHero !== undefined && { isHero: body.isHero }),
        ...(body.isCover !== undefined && { isCover: body.isCover }),
      },
    });

    return NextResponse.json(img);
  } catch (err) {
    console.error('[PUT /api/admin/properties/[id]/images/[imageId]]', err);
    return NextResponse.json({ error: 'Failed to update image.' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, imageId } = await params;
  const img = await prisma.propertyImage.findUnique({ where: { id: imageId, propertyId: id } });
  if (!img) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.propertyImage.delete({ where: { id: imageId } });

  if (img.url.startsWith('/uploads/')) await deleteFile(img.url);
  if (img.thumbUrl?.startsWith('/uploads/')) await deleteFile(img.thumbUrl);

  // If we deleted the hero, promote next image
  if (img.isHero) {
    const next = await prisma.propertyImage.findFirst({
      where: { propertyId: id },
      orderBy: { sortOrder: 'asc' },
    });
    if (next) await prisma.propertyImage.update({ where: { id: next.id }, data: { isHero: true } });
  }

  return NextResponse.json({ ok: true });
}
