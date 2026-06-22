'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/data/types';
import { useLanguage } from '@/context/LanguageContext';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const { t } = useLanguage();
  const thumbs = property.gallery.cardThumbs;

  const slideGallery = (dir: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFading(true);
    setTimeout(() => {
      setImgIndex((prev) => ((prev + dir + thumbs.length) % thumbs.length));
      setFading(false);
    }, 200);
  };

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="property-card animate-in"
      data-type={property.type}
    >
      <div className="card-gallery">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbs[imgIndex]}
          alt={property.name}
          loading="lazy"
          decoding="async"
          style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.2s ease' }}
        />
        <span className={`card-badge${property.type === 'sale' ? ' sale' : ''}`}>
          {t(property.badge)}
        </span>
        <button
          className="card-nav prev"
          aria-label="Previous photo"
          onClick={(e) => slideGallery(-1, e)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <use href="#i-chevron-left" />
          </svg>
        </button>
        <button
          className="card-nav next"
          aria-label="Next photo"
          onClick={(e) => slideGallery(1, e)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <use href="#i-chevron-right" />
          </svg>
        </button>
        <div className="card-dots">
          {thumbs.map((_, i) => (
            <span key={i} className={`card-dot${i === imgIndex ? ' active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="card-info">
        <h3 className="card-title">{property.name}</h3>
        <div className="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <use href="#i-pin" />
          </svg>
          {property.location}
        </div>
        <div className="card-amenities">
          <span className="card-amenity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="#i-bed" />
            </svg>{' '}
            <span>{property.bedrooms}</span>
          </span>
          <span className="card-amenity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="#i-bath" />
            </svg>{' '}
            <span>{property.bathrooms}</span>
          </span>
          <span className="card-amenity">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="#i-pool" />
            </svg>{' '}
            {t('Pool')}
          </span>
        </div>
        <p className="card-desc">{t(property.shortDescription)}</p>
        <div className="card-footer">
          <span className="card-link">
            {t('View Details')}{' '}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <use href="#i-arrow-right" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
