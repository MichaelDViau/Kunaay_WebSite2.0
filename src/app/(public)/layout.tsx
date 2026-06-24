import { LanguageProvider } from '@/context/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        These tags are rendered directly (not wrapped in <head>): only the root
        layout may render <html>/<head>/<body>. React 19 automatically hoists
        these <link> elements into the document <head>, while keeping them scoped
        to the public layout (so admin pages don't load main.min.css).
      */}
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
      <link rel="stylesheet" href="/assets/css/main.min.css" precedence="default" />
      <LanguageProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </LanguageProvider>
    </>
  );
}
