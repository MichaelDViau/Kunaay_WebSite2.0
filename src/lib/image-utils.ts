import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function processAndSave(
  buffer: Buffer,
  propertyId: string,
  originalName: string
): Promise<{ url: string; thumbUrl: string }> {
  const dir = path.join(process.cwd(), 'public', 'uploads', propertyId);
  await fs.mkdir(dir, { recursive: true });

  const ts = Date.now();
  const safe = originalName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const base = `${ts}-${safe}`;

  await sharp(buffer)
    .resize(1920, undefined, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(path.join(dir, `${base}.webp`));

  await sharp(buffer)
    .resize(600, undefined, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(dir, `thumb-${base}.webp`));

  return {
    url: `/uploads/${propertyId}/${base}.webp`,
    thumbUrl: `/uploads/${propertyId}/thumb-${base}.webp`,
  };
}

export async function deleteFile(relativePath: string) {
  try {
    const abs = path.join(process.cwd(), 'public', relativePath);
    await fs.unlink(abs);
  } catch {
    // file may not exist on disk (external URL etc.)
  }
}
