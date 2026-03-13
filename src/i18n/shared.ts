import { type Locale } from './config';
import en from './locales/en';
import fr from './locales/fr';
import ar from './locales/ar';

type TranslationsType = Record<string, unknown>;

export const translations: Record<Locale, TranslationsType> = { en, fr, ar };

/** Resolve dot-notation key path from nested object */
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let value: unknown = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof value === 'string' ? value : path;
}

/** Replace {param} placeholders in translation string */
export function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => params[key]?.toString() ?? `{${key}}`);
}

/** Create a t() function for a given locale */
export function createT(locale: Locale) {
  return (key: string, params?: Record<string, string | number>): string => {
    const translationObj = translations[locale] || translations.en;
    const value = getNestedValue(translationObj as Record<string, unknown>, key);
    return interpolate(value, params);
  };
}
