'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface BookingSidebarProps {
  whatsappUrl: string;
  type: 'rental' | 'sale';
}

export default function BookingSidebar({ whatsappUrl, type }: BookingSidebarProps) {
  const { t } = useLanguage();

  return (
    <div className="sidebar-card">
        <h3>{type === 'rental' ? t('Book Your Stay') : t('Request Information')}</h3>
        <p>
          {type === 'rental'
            ? t('Contact us directly for the best rates and personalized service for your Riviera Maya vacation.')
            : t('Contact our team for pricing, availability, and to schedule a private viewing.')}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          {type === 'rental' ? t('Book via WhatsApp') : t('Inquire via WhatsApp')}
        </a>
        <Link href="/contact" className="btn-outline">
          {t('Request Info')}
        </Link>
    </div>
  );
}
