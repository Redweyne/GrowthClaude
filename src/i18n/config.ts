// ═══════════════════════════════════════════════════════════════════════════
// I18N CONFIGURATION
// Multilingual support for English, French, and Arabic
// ═══════════════════════════════════════════════════════════════════════════

export const locales = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language metadata for the selector
export const languageConfig: Record<Locale, {
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
  },
};

// Check if locale is RTL
export const isRTL = (locale: Locale): boolean => {
  return languageConfig[locale].dir === 'rtl';
};

// Get direction for locale
export const getDirection = (locale: Locale): 'ltr' | 'rtl' => {
  return languageConfig[locale].dir;
};
