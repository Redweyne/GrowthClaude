export type StoryLocale = 'en' | 'fr' | 'ar';

export const STORY_LOCALE_TAGS: Record<StoryLocale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar',
};

export const ASSESSMENT_DIMENSION_LABELS: Record<StoryLocale, Record<string, string>> = {
  en: {
    emotionalMastery: 'Emotional Mastery',
    discipline: 'Discipline',
    perspective: 'Perspective',
    selfAwareness: 'Self-Awareness',
    growth: 'Growth Mindset',
  },
  fr: {
    emotionalMastery: 'Maitrise emotionnelle',
    discipline: 'Discipline',
    perspective: 'Perspective',
    selfAwareness: 'Conscience de soi',
    growth: 'Esprit de croissance',
  },
  ar: {
    emotionalMastery: 'التمكن العاطفي',
    discipline: 'الانضباط',
    perspective: 'المنظور',
    selfAwareness: 'الوعي الذاتي',
    growth: 'عقلية النمو',
  },
};

export const LEVEL_TITLES: Record<StoryLocale, Record<number, string>> = {
  en: {
    5: 'Adept',
    6: 'Journeyman',
    7: 'Master',
    8: 'Sage',
    9: 'Elder',
    10: 'Enlightened',
  },
  fr: {
    5: 'Adepte',
    6: 'Compagnon',
    7: 'Maitre',
    8: 'Sage',
    9: 'Ancien',
    10: 'Eveille',
  },
  ar: {
    5: 'متمرس',
    6: 'رحالة',
    7: 'متمكن',
    8: 'حكيم',
    9: 'شيخ',
    10: 'مستنير',
  },
};

export const CONTRAST_TYPE_LABELS: Record<StoryLocale, Record<string, string>> = {
  en: {
    struggle_to_growth: 'struggle to growth',
    confusion_to_clarity: 'confusion to clarity',
    passive_to_active: 'passive to active',
    surface_to_deep: 'surface to depth',
  },
  fr: {
    struggle_to_growth: 'de la lutte a la croissance',
    confusion_to_clarity: 'de la confusion a la clarte',
    passive_to_active: 'du passif a l action',
    surface_to_deep: 'de la surface a la profondeur',
  },
  ar: {
    struggle_to_growth: 'من الصراع إلى النمو',
    confusion_to_clarity: 'من التشوش إلى الوضوح',
    passive_to_active: 'من السكون إلى الفعل',
    surface_to_deep: 'من السطح إلى العمق',
  },
};

export function resolveStoryLocale(locale?: string): StoryLocale {
  if (locale === 'fr' || locale === 'ar' || locale === 'en') return locale;
  return 'en';
}

export function formatStory(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? `{${key}}`}`);
}

export function formatStoryDate(
  value: Date | string,
  locale: StoryLocale,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(STORY_LOCALE_TAGS[locale], options).format(date);
}

export function formatStoryNumber(value: number, locale: StoryLocale): string {
  return new Intl.NumberFormat(STORY_LOCALE_TAGS[locale]).format(value);
}

export function formatStoryMonthLabel(
  monthKey: string,
  locale: StoryLocale,
  month: 'short' | 'long' = 'short'
): string {
  const [year, monthPart] = monthKey.split('-');
  const date = new Date(Number(year), Number(monthPart) - 1, 1);
  return formatStoryDate(date, locale, { month, year: 'numeric' });
}

export function joinStorySentences(parts: string[]): string {
  return parts.filter(Boolean).join(' ');
}
