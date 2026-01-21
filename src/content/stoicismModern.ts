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
import { stoic_chapter2_Action } from './stoicismChapter2';
import { stoic_chapter3_Will } from './stoicismChapter3';

export const stoicismWorld: FlexibleWorld = {
    id: 'world-stoicism',
    slug: 'stoicism',
    name: 'Stoicism',
    subtitle: 'The Art of Inner Freedom',
    description: 'Master the ancient philosophy that has guided emperors, prisoners, and leaders for over 2,000 years. Learn to control what you can, accept what you cannot, and find peace in any circumstance.',
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

export default stoicismWorld;
