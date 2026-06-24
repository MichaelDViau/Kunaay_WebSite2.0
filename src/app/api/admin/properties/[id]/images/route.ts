import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { processAndSave } from '@/lib/image-utils';

type Params = { params: Promise<{ id: string }> };

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB per file
const MAX_FILES_PER_REQUEST = 30;
const MAX_REQUEST_BYTES = 200 * 1024 * 1024; // hard cap on the whole upload

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // Reject obviously oversized uploads before reading the body into memory.
  const contentLength = Number(req.headers.get('content-length') ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Upload is too large.' }, { status: 413 });
  }

  // Verify property exists
  const prop = await prisma.property.findUnique({ where: { id }, select: { id: true } });
  if (!prop) return NextResponse.json({ error: 'Property not found.' }, { status: 404 });

  try {
    const formData = await req.formData();
    const files = formData.getAll('files').filter((f): f is File => f instanceof File);

    if (!files.length) return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Too many files. Upload at most ${MAX_FILES_PER_REQUEST} images at a time.` },
        { status: 400 }
      );
    }

    // Validate the declared type/size of each file before processing. The MIME
    // type is client-supplied, so it is treated only as a first-pass filter —
    // the authoritative check is decoding the bytes with sharp below.
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
      let result;
      try {
        // processAndSave decodes the bytes with sharp, which rejects anything
        // that is not a genuine, supported image (defeating spoofed MIME types
        // and disguised payloads).
        result = await processAndSave(buf, id, file.name);
      } catch {
        return NextResponse.json(
          { error: `File "${file.name}" could not be processed as a valid image.` },
          { status: 400 }
        );
      }
      const img = await prisma.propertyImage.create({
        data: { propertyId: id, url: result.url, thumbUrl: result.thumbUrl, sortOrder: order++ },
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
  } catch (err) {
    console.error('[POST /api/admin/properties/[id]/images]', err);
    return NextResponse.json({ error: 'Failed to upload images.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
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
