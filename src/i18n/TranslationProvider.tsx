'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATION PROVIDER
// Context provider for translations throughout the app
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { type Locale, languageConfig, isRTL, locales } from './config';
import { createT } from './shared';
import { getLocaleCookie, setLocaleCookie } from './localeCookie';

// Nested key path type for type-safe translations
type TranslationsType = Record<string, unknown>;
type NestedKeyOf<T, K = keyof T> = K extends keyof T & string
  ? T[K] extends Record<string, unknown>
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K
  : never;
type TranslationKey = NestedKeyOf<TranslationsType>;

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useStore();
  const locale = language as Locale;

  // On mount: sync from cookie if it differs from Zustand
  useEffect(() => {
    const cookieLocale = getLocaleCookie();
    if (cookieLocale && cookieLocale !== locale && (locales as readonly string[]).includes(cookieLocale)) {
      setLanguage(cookieLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document direction + cookie when language changes
  useEffect(() => {
    const dir = languageConfig[locale].dir;
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    setLocaleCookie(locale);
  }, [locale]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLanguage(newLocale);
    setLocaleCookie(newLocale);
  }, [setLanguage]);

  const contextValue = useMemo<TranslationContextType>(() => ({
    t: createT(locale),
    locale,
    dir: languageConfig[locale].dir,
    isRTL: isRTL(locale),
    setLocale: handleSetLocale,
  }), [locale, handleSetLocale]);

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Export types
export type { TranslationKey, TranslationsType };
