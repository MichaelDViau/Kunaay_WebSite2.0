'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/rentals', label: 'Rentals' },
  { href: '/sales', label: 'Sales' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggle, t } = useLanguage();

  const updateNav = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateNav();
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateNav]);

  useEffect(() => {
    // Non-home pages always look scrolled (dark nav)
    if (pathname !== '/') {
      setScrolled(true);
    }
  }, [pathname]);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const toggleMenu = () => {
    if (menuOpen) closeMenu();
    else openMenu();
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <Link href="/" className="nav-logo">
          <Image
            src="/assets/img/logo.png"
            alt="Ku Náay"
            width={348}
            height={90}
            priority
          />
        </Link>

        <ul className="nav-links">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={isActive(href) ? 'active' : ''}>
                {t(label)}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="nav-cta"
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          aria-label={
            lang === 'es'
              ? 'English. Switch site language to English.'
              : 'Español. Switch site language to Spanish.'
          }
        >
          {lang === 'es' ? 'English' : 'Español'}
        </a>

        <button
          className={`mobile-toggle${menuOpen ? ' open' : ''}`}
          id="mobileToggle"
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobileMenu">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} onClick={closeMenu}>
            {t(label)}
          </Link>
        ))}
        <a
          href="#"
          className="mob-cta"
          onClick={(e) => {
            e.preventDefault();
            toggle();
            closeMenu();
          }}
        >
          {lang === 'es' ? 'English' : 'Español'}
        </a>
      </div>
    </>
  );
}
