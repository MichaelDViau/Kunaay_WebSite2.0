import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import IconSprite from '@/components/ui/IconSprite';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kunaay.com'),
  title: {
    default: 'Ku Náay Real Estate — Riviera Maya',
    template: '%s — Ku Náay Real Estate',
  },
  description:
    'Ku Náay Real Estate — Luxury vacation rentals and property sales in the Riviera Maya, Playa del Carmen and Tulum.',
  robots: { index: true, follow: true },
  authors: [{ name: 'Ku Náay Real Estate' }],
  openGraph: {
    type: 'website',
    siteName: 'Ku Náay Real Estate',
    locale: 'en_US',
    alternateLocale: ['es_MX'],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/assets/img/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/img/logo.png' },
    ],
    apple: '/assets/img/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0C0C0C" />
        <link rel="preconnect" href="https://i.ibb.co" />
        <link
          rel="preload"
          href="/assets/fonts/cormorant-garamond-300.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/fonts/manrope-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/assets/css/main.min.css" />
      </head>
      <body>
        <IconSprite />
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
