'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { translations } from '@/data/translations';

type Lang = 'en' | 'es';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggle: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('preferredLanguage') as Lang | null;
      if (stored === 'es') setLang('es');
    } catch {
      // localStorage not available
    }
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'en' ? 'es' : 'en';
      try {
        localStorage.setItem('preferredLanguage', next);
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string): string => {
      if (lang === 'es') {
        return translations[key] ?? key;
      }
      return key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
