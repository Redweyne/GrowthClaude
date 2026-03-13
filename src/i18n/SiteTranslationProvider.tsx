'use client';

import React, { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react';
import { type Locale, languageConfig, isRTL, locales, defaultLocale } from './config';
import { createT } from './shared';
import { getLocaleCookie, setLocaleCookie } from './localeCookie';

interface SiteTranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
}

const SiteTranslationContext = createContext<SiteTranslationContextType | null>(null);

/** Detect browser language and match to supported locales */
function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale;
  const lang = navigator.language.toLowerCase();
  for (const loc of locales) {
    if (lang === loc || lang.startsWith(`${loc}-`)) return loc;
  }
  return defaultLocale;
}

export function SiteTranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // On mount: read cookie, fallback to browser language
  useEffect(() => {
    const cookieLocale = getLocaleCookie();
    const resolved = cookieLocale ?? detectBrowserLocale();
    setLocaleState(resolved);
    if (!cookieLocale) setLocaleCookie(resolved);
    document.documentElement.dir = languageConfig[resolved].dir;
    document.documentElement.lang = resolved;
  }, []);

  // Update document when locale changes
  useEffect(() => {
    document.documentElement.dir = languageConfig[locale].dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);
  }, []);

  const contextValue = useMemo<SiteTranslationContextType>(() => ({
    t: createT(locale),
    locale,
    dir: languageConfig[locale].dir,
    isRTL: isRTL(locale),
    setLocale,
  }), [locale, setLocale]);

  return (
    <SiteTranslationContext.Provider value={contextValue}>
      {children}
    </SiteTranslationContext.Provider>
  );
}

export function useSiteTranslation() {
  const context = useContext(SiteTranslationContext);
  if (!context) {
    throw new Error('useSiteTranslation must be used within a SiteTranslationProvider');
  }
  return context;
}
