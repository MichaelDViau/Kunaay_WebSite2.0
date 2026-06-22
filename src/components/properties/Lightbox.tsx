'use client';

import { useEffect, useCallback } from 'react';

interface LightboxProps {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}

export default function Lightbox({ images, index, onClose, onNav }: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    },
    [onClose, onNav]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div className="lightbox" style={{ display: 'flex' }} onClick={onClose}>
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <use href="#i-close" />
        </svg>
      </button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        aria-label="Previous image"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <use href="#i-chevron-left" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt="Gallery"
        id="lightboxImg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        aria-label="Next image"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <use href="#i-chevron-right" />
        </svg>
      </button>
    </div>
  );
}
