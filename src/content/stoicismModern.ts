// ═══════════════════════════════════════════════════════════════════════════
// STOICISM - WORLD OF ANCIENT WISDOM
// ═══════════════════════════════════════════════════════════════════════════
//
// The philosophy that has guided emperors, prisoners, and leaders for 2,000 years.
// Now modernized with the flexible step system for maximum engagement.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleWorld } from '@/types/lessons';
import { stoic_chapter1_Perception } from './stoicismChapter1';
import { stoicChapter2_PhilosophersFire } from './stoicismChapter2';
import { stoicChapter3_CitizenOfCosmos } from './stoicismChapter3';

export const stoicismWorld: FlexibleWorld = {
  id: 'world-stoicism',
  slug: 'stoicism',
  name: 'Stoicism',
  subtitle: 'The Art of Inner Freedom',
  description: 'Master the ancient philosophy that has guided emperors, prisoners, and leaders for over 2,000 years. Learn to control what you can, accept what you cannot, and find peace in any circumstance.',
  iconName: 'Flame',
  color: '#6366f1',
  order: 2,
  isPremium: false,
  estimatedDays: 15,
  totalLessons: 15,
  chapters: [
    stoic_chapter1_Perception,
    stoicChapter2_PhilosophersFire,
    stoicChapter3_CitizenOfCosmos,
  ],
};

export function getStoicismWorld(): FlexibleWorld {
  return stoicismWorld;
}

export default stoicismWorld;
