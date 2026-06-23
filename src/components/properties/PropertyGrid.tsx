'use client';

import { useState } from 'react';
import type { Property } from '@/data/types';
import PropertyCard from './PropertyCard';
import { useLanguage } from '@/context/LanguageContext';

interface PropertyGridProps {
  properties: Property[];
  /**
   * When false, hides the "Exclusive Collection / Curated Luxury Properties"
   * heading and the All/Rentals/Sales filter. Dedicated rental and sales pages
   * pass `false` because the page itself already scopes the listings; the
   * homepage relies on the default (`true`) and is therefore unchanged.
   */
  showHeader?: boolean;
}

type Filter = 'all' | 'rental' | 'sale';

export default function PropertyGrid({ properties, showHeader = true }: PropertyGridProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const { t } = useLanguage();

  const visible = filter === 'all' ? properties : properties.filter((p) => p.type === filter);

  return (
    <section id="properties" style={{ paddingTop: '2rem' }}>
      {showHeader && (
        <div className="properties-header">
          <div>
            <span className="section-label">{t('Exclusive Collection')}</span>
            <h2 className="section-title">{t('Curated Luxury Properties')}</h2>
          </div>
          <div className="property-filters">
            {(['all', 'rental', 'sale'] as Filter[]).map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {t(f === 'all' ? 'All' : f === 'rental' ? 'Rentals' : 'Sales')}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="properties-grid">
        {visible.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
