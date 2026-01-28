'use client';

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATION PROVIDER
// Context provider for translations throughout the app
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { type Locale, languageConfig, isRTL } from './config';

// Import all translations
import en from './locales/en';
import fr from './locales/fr';
import ar from './locales/ar';

// Use a more flexible type that allows different string values
type TranslationsType = Record<string, unknown>;

// Nested key path type for type-safe translations
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

const translations: Record<Locale, TranslationsType> = {
  en,
  fr,
  ar,
};

// Helper to get nested value from object
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }

  return typeof value === 'string' ? value : path;
}

// Replace params in string like "Hello, {name}" with values
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;

  return str.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() ?? `{${key}}`;
  });
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useStore();
  const locale = language as Locale;

  // Update document direction when language changes
  useEffect(() => {
    const dir = languageConfig[locale].dir;
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const contextValue = useMemo<TranslationContextType>(() => ({
    t: (key: string, params?: Record<string, string | number>) => {
      const translationObj = translations[locale] || translations.en;
      const value = getNestedValue(translationObj as Record<string, unknown>, key);
      return interpolate(value, params);
    },
    locale,
    dir: languageConfig[locale].dir,
    isRTL: isRTL(locale),
    setLocale: setLanguage,
  }), [locale, setLanguage]);

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
