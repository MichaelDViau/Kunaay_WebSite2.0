'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';

interface PropertyGalleryProps {
  heroImage: string;
  gridThumbs: string[];
  lightbox: string[];
  name: string;
}

export default function PropertyGallery({ heroImage, gridThumbs, lightbox, name }: PropertyGalleryProps) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const openAt = (i: number) => setLbIndex(i);
  const close = () => setLbIndex(null);
  const nav = (dir: number) =>
    setLbIndex((prev) => prev === null ? 0 : ((prev + dir + lightbox.length) % lightbox.length));

  const extraCount = lightbox.length - 4;

  return (
    <>
      <div className="detail-gallery" id="galleryGrid">
        <div className="detail-gallery-inner">
          <div className="detail-gallery-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lb-img"
              src={heroImage}
              alt={name}
              fetchPriority="high"
              decoding="async"
              onClick={() => openAt(0)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="detail-gallery-right">
            {gridThumbs.slice(1, 4).map((src, i) => {
              const isLast = i === 2 && extraCount > 0;
              return isLast ? (
                <div key={i} className="gallery-more" onClick={() => openAt(3)} style={{ cursor: 'pointer' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={name} loading="lazy" />
                  <div className="gallery-more-overlay">
                    <span className="gallery-more-label">+{extraCount}</span>
                    <span className="gallery-more-sub">View All Photos</span>
                  </div>
                </div>
              ) : (
                <div key={i} className="gallery-thumb" onClick={() => openAt(i + 1)} style={{ cursor: 'pointer' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="lb-img" src={src} alt={name} decoding="async" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {lbIndex !== null && (
        <Lightbox images={lightbox} index={lbIndex} onClose={close} onNav={nav} />
      )}
    </>
  );
}
