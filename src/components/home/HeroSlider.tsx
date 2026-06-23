'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const slides = [
  '/assets/img/photos/rentals/casavioleta/full/casavi6.webp',
  '/assets/img/photos/rentals/casasecretomaya/full/casasm6.webp',
  '/assets/img/photos/rentals/casamayette/full/casamy24.webp',
  '/assets/img/photos/rentals/casaricardo/full/casari7.webp',
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([true, false, false, false]);
  const { t } = useLanguage();

  const goTo = useCallback((n: number) => {
    const next = ((n % slides.length) + slides.length) % slides.length;
    setLoaded((prev) => {
      const updated = [...prev];
      updated[next] = true;
      return updated;
    });
    setCurrent(next);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  // Preload remaining slides after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded([true, true, true, true]);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-slider" id="heroSlider">
        {slides.map((src, i) => (
          <div
            key={i}
            className={`hero-slide${i === current ? ' active' : ''}`}
            style={loaded[i] ? { backgroundImage: `url('${src}')` } : undefined}
          />
        ))}
      </div>
      <div className="hero-overlay" />

      <div className="hero-slider-dots" id="heroSliderDots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-slider-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Show slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="hero-content">
        <span className="hero-badge">{t('Cancun · Playa del Carmen · Tulum')}</span>
        <h1>
          {t('Where Coastal Beauty Meets')}
          <br />
          <em>{t('Timeless Luxury')}</em>
        </h1>
        <p className="hero-sub">
          {t(
            'Discover a carefully curated portfolio of extraordinary residences and investment opportunities available for rent and sale, defined by timeless elegance, exceptional quality, and the finest locations across the Riviera Maya.'
          )}
        </p>
        <Link href="#properties" className="btn-primary" scroll={false}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {t('Explore Properties')}{' '}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <use href="#i-arrow-right" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
