import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { prisma } from '@/lib/prisma';
import { deleteFile } from '@/lib/image-utils';

type Params = { params: Promise<{ id: string; imageId: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, imageId } = await params;
  const body = await req.json() as { title?: string; isHero?: boolean; isCover?: boolean };

  if (body.isHero) {
    await prisma.propertyImage.updateMany({ where: { propertyId: id }, data: { isHero: false } });
  }
  if (body.isCover !== undefined) {
    await prisma.propertyImage.updateMany({ where: { propertyId: id }, data: { isCover: false } });
  }

  const img = await prisma.propertyImage.update({
    where: { id: imageId, propertyId: id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.isHero !== undefined && { isHero: body.isHero }),
      ...(body.isCover !== undefined && { isCover: body.isCover }),
    },
  });

  return NextResponse.json(img);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
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
