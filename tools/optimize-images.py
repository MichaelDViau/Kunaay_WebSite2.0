#!/usr/bin/env python3
"""
Ku Náay — photo optimization pipeline.

Converts the original camera JPGs into the WebP files the site serves:

  assets/img/photos/<section>/<casa>/full/<name>.webp   max 1920px, q80
        → lightbox images and page-hero backgrounds
  assets/img/photos/<section>/<casa>/thumb/<name>.webp  max 900px,  q75
        → card sliders, gallery grids, related-property tiles

Usage:
  1. Drop new original JPG/JPEG/PNG photos into
     assets/img/photos/<rentals|sales>/<casa>/originals/
  2. Run:  python3 tools/optimize-images.py
  3. Reference the generated full/ and thumb/ paths from the HTML.

Filenames are lowercased so URLs stay consistent. Requires Pillow
(`pip install pillow`). Existing outputs are skipped unless the
source is newer, so the script is safe to re-run.
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "assets" / "img" / "photos"

FULL_MAX = 1920   # px, longest edge — lightbox / hero quality
FULL_Q = 80
THUMB_MAX = 900   # px, longest edge — 2× the largest rendered card size
THUMB_Q = 75


def convert(src: Path, dest: Path, max_px: int, quality: int) -> int:
    """Resize + encode one image to WebP. Returns output size in bytes."""
    if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
        return dest.stat().st_size
    im = Image.open(src)
    im = im.convert("RGB")
    im.thumbnail((max_px, max_px), Image.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)
    return dest.stat().st_size


def main() -> None:
    sources = [
        p for p in PHOTOS.rglob("*")
        if p.suffix.lower() in (".jpg", ".jpeg", ".png")
        and "full" not in p.parts and "thumb" not in p.parts
    ]
    if not sources:
        print("No original images found — nothing to do.")
        return

    in_total = out_total = 0
    for src in sorted(sources):
        rel_dir = src.parent.relative_to(PHOTOS)
        name = src.stem.lower() + ".webp"
        in_b = src.stat().st_size
        out_b = convert(src, PHOTOS / rel_dir / "full" / name, FULL_MAX, FULL_Q)
        out_b += convert(src, PHOTOS / rel_dir / "thumb" / name, THUMB_MAX, THUMB_Q)
        in_total += in_b
        out_total += out_b
        print(f"{src.relative_to(PHOTOS)}  {in_b // 1024:4d}KB → {out_b // 1024:4d}KB")

    print(f"\nTotal: {in_total // 1048576}MB originals → "
          f"{out_total // 1048576}MB optimized (full + thumb)")


if __name__ == "__main__":
    main()
