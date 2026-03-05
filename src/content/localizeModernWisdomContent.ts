import type { Locale } from '@/i18n';
import frTranslations from './translations/modernWisdomContent.fr.json';
import arTranslations from './translations/modernWisdomContent.ar.json';

const CONTENT_TRANSLATIONS_BY_LOCALE: Record<'fr' | 'ar', Record<string, string>> = {
  fr: frTranslations as Record<string, string>,
  ar: arTranslations as Record<string, string>,
};

const DIRECT_TRANSLATABLE_KEYS = new Set([
  'name',
  'title',
  'subtitle',
  'description',
  'teaserText',
  'narrative',
  'subtext',
  'bridgeQuestion',
  'continueLabel',
  'prompt',
  'instruction',
  'question',
  'label',
  'text',
  'lowLabel',
  'highLabel',
  'preText',
  'statement',
  'confirmLabel',
  'closingText',
  'followUp',
  'forgeMessage',
  'completionMessage',
  'insight',
  'wisdomNudge',
]);

const NEVER_TRANSLATE_KEYS = new Set([
  'id',
  'slug',
  'type',
  'icon',
  'color',
  'iconName',
  'coreConceptTag',
  'style',
  'storeAs',
  'nextStepId',
  'agreeTag',
  'disagreeTag',
  'trait',
  'traitPattern',
  'tagPattern',
  'emoji',
  'category',
]);

function shouldTranslatePath(path: string[]): boolean {
  const leaf = path[path.length - 1];
  if (!leaf || NEVER_TRANSLATE_KEYS.has(leaf)) return false;

  if (DIRECT_TRANSLATABLE_KEYS.has(leaf)) return true;

  if (path.includes('instructions')) return true;

  if (path.includes('default') || path.includes('byChoice')) return true;

  if (path.includes('responsesByRange') && ['low', 'mid', 'high'].includes(leaf)) return true;

  if (path.includes('quadrantInsights')) return true;

  if (path.includes('insightsByTopChoice')) return true;

  if ((path.includes('xAxis') || path.includes('yAxis')) && ['low', 'high'].includes(leaf)) return true;

  return false;
}

function deepLocalize<T>(value: T, translations: Record<string, string>, path: string[] = []): T {
  if (typeof value === 'string') {
    if (!shouldTranslatePath(path)) return value;
    return (translations[value] ?? value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepLocalize(item, translations, path)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
      result[key] = deepLocalize(nestedValue, translations, [...path, key]);
    });

    return result as T;
  }

  return value;
}

export function localizeModernWisdomContent<T>(value: T, locale: Locale): T {
  if (locale === 'en') return value;

  const translations = CONTENT_TRANSLATIONS_BY_LOCALE[locale as 'fr' | 'ar'];
  if (!translations) return value;

  return deepLocalize(value, translations);
}
