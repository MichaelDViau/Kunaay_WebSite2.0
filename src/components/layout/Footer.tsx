'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Image src="/assets/img/logo.png" alt="Ku Náay" width={348} height={90} />
          <p className="footer-tagline">{t('Where Coastal Beauty Meets Timeless Luxury')}</p>
        </div>
        <div className="footer-nav">
          <div className="footer-col">
            <h3>{t('Navigation')}</h3>
            <Link href="/">{t('Home')}</Link>
            <Link href="/rentals">{t('Rentals')}</Link>
            <Link href="/sales">{t('Sales')}</Link>
            <Link href="/about">{t('About Us')}</Link>
          </div>
          <div className="footer-col">
            <h3>{t('Company')}</h3>
            <Link href="/about">{t('About Us')}</Link>
            <Link href="/contact">{t('Contact')}</Link>
          </div>
          <div className="footer-col">
            <h3>{t('Locations')}</h3>
            <Link href="/rentals">{t('Playa Del Carmen')}</Link>
            <Link href="/sales">{t('Tulum')}</Link>
            <Link href="/rentals">{t('Riviera Maya')}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t('© 2026 Ku Náay Real Estate. All rights reserved.')}</span>
        <span>{t('Designed with care in the Riviera Maya')}</span>
      </div>
    </footer>
  );
}
