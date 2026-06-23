import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
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
      <LanguageProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </LanguageProvider>
    </>
  );
}
