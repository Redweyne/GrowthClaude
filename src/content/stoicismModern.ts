// ═══════════════════════════════════════════════════════════════════════════
// STOICISM - WORLD OF ANCIENT WISDOM
// ═══════════════════════════════════════════════════════════════════════════
//
// The philosophy that has guided emperors, prisoners, and leaders for 2,000 years.
// Now modernized with the flexible step system for maximum engagement.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleWorld } from '@/types/lessons';
import { type Locale } from '@/i18n';
import { stoic_chapter1_Perception } from './stoicismChapter1';
import { stoic_chapter2_Action } from './stoicismChapter2';
import { stoic_chapter3_Will } from './stoicismChapter3';

const STOICISM_WORLD_BY_LOCALE: Record<Locale, Pick<FlexibleWorld, 'name' | 'subtitle' | 'description'>> = {
  en: {
    name: 'Stoicism',
    subtitle: 'The Art of Inner Freedom',
    description: 'Master the ancient philosophy that has guided emperors, prisoners, and leaders for over 2,000 years. Learn to control what you can, accept what you cannot, and find peace in any circumstance.',
  },
  fr: {
    name: 'Stoïcisme',
    subtitle: 'L’art de la liberté intérieure',
    description: 'Maîtrisez la philosophie ancienne qui a guidé empereurs, prisonniers et leaders depuis plus de 2 000 ans. Apprenez à contrôler ce que vous pouvez, à accepter ce que vous ne pouvez pas, et à trouver la paix en toute circonstance.',
  },
  ar: {
    name: 'الرواقية',
    subtitle: 'فن الحرية الداخلية',
    description: 'أتقِن الفلسفة القديمة التي وجّهت الأباطرة والسجناء والقادة لأكثر من 2000 عام. تعلّم أن تتحكم فيما تستطيع، وأن تقبل ما لا تستطيع، وأن تجد السلام في أي ظرف.',
  },
};

export const stoicismWorld: FlexibleWorld = {
  id: 'world-stoicism',
  slug: 'stoicism',
  name: STOICISM_WORLD_BY_LOCALE.en.name,
  subtitle: STOICISM_WORLD_BY_LOCALE.en.subtitle,
  description: STOICISM_WORLD_BY_LOCALE.en.description,
    iconName: 'Flame',
    color: '#6366f1',
    order: 2, // Second world (Modern Wisdom is first)
    isPremium: false,
    estimatedDays: 15,
    totalLessons: 15,
    chapters: [
        stoic_chapter1_Perception,
        stoic_chapter2_Action,
        stoic_chapter3_Will,
    ],
};

export function getStoicismWorld(locale: Locale): FlexibleWorld {
  const localized = STOICISM_WORLD_BY_LOCALE[locale] || STOICISM_WORLD_BY_LOCALE.en;
  return {
    ...stoicismWorld,
    name: localized.name,
    subtitle: localized.subtitle,
    description: localized.description,
  };
}

export default stoicismWorld;
