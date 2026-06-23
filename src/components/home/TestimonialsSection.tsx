'use client';

import { useRef, useState } from 'react';
import { testimonials } from '@/data/testimonials';
import { useLanguage } from '@/context/LanguageContext';

function ReviewCard({ text, authorName, authorAvatar }: { text: string; authorName: string; authorAvatar: string }) {
  const [expanded, setExpanded] = useState(false);
  const [baseHeight, setBaseHeight] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMount = (el: HTMLDivElement | null) => {
    if (el && !baseHeight) {
      requestAnimationFrame(() => {
        const h = el.getBoundingClientRect().height;
        if (h > 0) setBaseHeight(`${h}px`);
      });
    }
  };

  const toggle = () => {
    if (!baseHeight && cardRef.current) {
      setBaseHeight(`${cardRef.current.getBoundingClientRect().height}px`);
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div
      ref={(el) => {
        cardRef.current = el;
        handleMount(el);
      }}
      className={`review-card${expanded ? ' expanded' : ''}`}
      onClick={toggle}
      style={!expanded && baseHeight ? { height: baseHeight } : undefined}
    >
      <div className="review-stars">★ ★ ★ ★ ★</div>
      <p className={`review-text${expanded ? ' full' : ''}`}>{text}</p>
      <button className="review-toggle">{expanded ? 'Show less' : 'Read more'}</button>
      <div className="review-author">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorAvatar}
          alt={authorName}
          className="review-avatar"
          loading="lazy"
          decoding="async"
        />
        <div>
          <div className="review-name">{authorName}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const slide = (dir: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.review-card');
    if (!card) return;
    const gap = parseInt(getComputedStyle(track).gap || '32', 10);
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <section className="reviews">
      <div className="reviews-header">
        <span className="section-label">{t('Testimonials')}</span>
        <h2 className="section-title">{t('A Reputation Built on Excellence')}</h2>
      </div>
      <div className="reviews-wrapper">
        <button
          className="reviews-slider-btn reviews-slider-prev"
          onClick={() => slide(-1)}
          aria-label="Previous review"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <use href="#i-caret-left" />
          </svg>
        </button>

        <div className="reviews-track" ref={trackRef}>
          {testimonials.map((t) => (
            <ReviewCard key={t.id} text={t.text} authorName={t.authorName} authorAvatar={t.authorAvatar} />
          ))}
        </div>

        <button
          className="reviews-slider-btn reviews-slider-next"
          onClick={() => slide(1)}
          aria-label="Next review"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <use href="#i-caret-right" />
          </svg>
        </button>
      </div>
    </section>
  );
}
