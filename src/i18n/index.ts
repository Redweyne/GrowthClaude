// ═══════════════════════════════════════════════════════════════════════════
// I18N MODULE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export { TranslationProvider, useTranslation } from './TranslationProvider';
export { SiteTranslationProvider, useSiteTranslation } from './SiteTranslationProvider';
export { locales, defaultLocale, languageConfig, isRTL, getDirection } from './config';
export { createT, getNestedValue, interpolate } from './shared';
export { getLocaleCookie, setLocaleCookie, getLocaleFromCookieHeader } from './localeCookie';
export type { Locale } from './config';
