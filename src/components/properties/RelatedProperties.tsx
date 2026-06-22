'use client';

import Link from 'next/link';
import type { RelatedProperty } from '@/data/types';
import { useLanguage } from '@/context/LanguageContext';

interface RelatedPropertiesProps {
  properties: RelatedProperty[];
}

export default function RelatedProperties({ properties }: RelatedPropertiesProps) {
  const { t } = useLanguage();

  if (!properties.length) return null;

  return (
    <section className="related">
      <span className="section-label">{t('You May Also Like')}</span>
      <h2 className="section-title">{t('Similar Properties')}</h2>
      <div className="related-grid">
        {properties.map((p) => (
          <Link key={p.slug} href={`/properties/${p.slug}`} className="related-item">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} loading="lazy" decoding="async" />
            <div className="related-item-info">
              <h3>{p.name}</h3>
              <span>{p.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
