// ═══════════════════════════════════════════════════════════════════════════
// LESSON THEME COLORS
// ═══════════════════════════════════════════════════════════════════════════
//
// Each chapter has its own color spectrum:
//   Chapter 1 (Foundations): Amber/Gold
//   Chapter 2 (Resilience): Rose/Crimson  
//   Chapter 3 (Relationships): Violet/Indigo
//
// Each lesson within a chapter gets a unique shade within that spectrum.
//
// ═══════════════════════════════════════════════════════════════════════════

export interface LessonThemeColor {
  primary: string;    // Main accent color
  glow: string;       // Glow/shadow with alpha
  gradient: string;   // Background tint with alpha
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1: FOUNDATIONS — Amber/Gold spectrum
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_1_THEMES: Record<string, LessonThemeColor> = {
  'modern-1-instant-reframe': {
    primary: '#f59e0b',  // Amber-500
    glow: 'rgba(245, 158, 11, 0.3)',
    gradient: 'rgba(245, 158, 11, 0.08)',
  },
  'modern-2-power-of-tiny': {
    primary: '#d97706',  // Amber-600
    glow: 'rgba(217, 119, 6, 0.3)',
    gradient: 'rgba(217, 119, 6, 0.08)',
  },
  'modern-3-obstacle-opportunity': {
    primary: '#f97316',  // Orange-500
    glow: 'rgba(249, 115, 22, 0.3)',
    gradient: 'rgba(249, 115, 22, 0.08)',
  },
  'modern-4-morning-mindset': {
    primary: '#ea580c',  // Orange-600
    glow: 'rgba(234, 88, 12, 0.3)',
    gradient: 'rgba(234, 88, 12, 0.08)',
  },
  'modern-5-gratitude-shift': {
    primary: '#eab308',  // Yellow-500
    glow: 'rgba(234, 179, 8, 0.3)',
    gradient: 'rgba(234, 179, 8, 0.08)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2: RESILIENCE — Rose/Crimson spectrum
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_2_THEMES: Record<string, LessonThemeColor> = {
  'modern-6-comeback-formula': {
    primary: '#ec4899',  // Pink-500
    glow: 'rgba(236, 72, 153, 0.3)',
    gradient: 'rgba(236, 72, 153, 0.08)',
  },
  'modern-7-embrace-struggle': {
    primary: '#f43f5e',  // Rose-500
    glow: 'rgba(244, 63, 94, 0.3)',
    gradient: 'rgba(244, 63, 94, 0.08)',
  },
  'modern-8-fear-setting': {
    primary: '#e11d48',  // Rose-600
    glow: 'rgba(225, 29, 72, 0.3)',
    gradient: 'rgba(225, 29, 72, 0.08)',
  },
  'modern-9-antifragile-mind': {
    primary: '#dc2626',  // Red-600
    glow: 'rgba(220, 38, 38, 0.3)',
    gradient: 'rgba(220, 38, 38, 0.08)',
  },
  'modern-10-future-self': {
    primary: '#fb7185',  // Rose-400
    glow: 'rgba(251, 113, 133, 0.3)',
    gradient: 'rgba(251, 113, 133, 0.08)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3: RELATIONSHIPS — Violet/Indigo spectrum
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_3_THEMES: Record<string, LessonThemeColor> = {
  'modern-11-mirror-effect': {
    primary: '#a855f7',  // Purple-500
    glow: 'rgba(168, 85, 247, 0.3)',
    gradient: 'rgba(168, 85, 247, 0.08)',
  },
  'modern-12-radical-honesty': {
    primary: '#8b5cf6',  // Violet-500
    glow: 'rgba(139, 92, 246, 0.3)',
    gradient: 'rgba(139, 92, 246, 0.08)',
  },
  'modern-13-boundaries': {
    primary: '#7c3aed',  // Violet-600
    glow: 'rgba(124, 58, 237, 0.3)',
    gradient: 'rgba(124, 58, 237, 0.08)',
  },
  'modern-14-empathy-shift': {
    primary: '#6366f1',  // Indigo-500
    glow: 'rgba(99, 102, 241, 0.3)',
    gradient: 'rgba(99, 102, 241, 0.08)',
  },
  'modern-15-forgiveness': {
    primary: '#818cf8',  // Indigo-400
    glow: 'rgba(129, 140, 248, 0.3)',
    gradient: 'rgba(129, 140, 248, 0.08)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// COMBINED LOOKUP
// ─────────────────────────────────────────────────────────────────────────────

const ALL_THEMES: Record<string, LessonThemeColor> = {
  ...CHAPTER_1_THEMES,
  ...CHAPTER_2_THEMES,
  ...CHAPTER_3_THEMES,
};

/**
 * Get the theme color for a lesson by its ID.
 * Returns a default amber theme if not found.
 */
export function getLessonThemeColor(lessonId: string): LessonThemeColor {
  return ALL_THEMES[lessonId] || {
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.3)',
    gradient: 'rgba(245, 158, 11, 0.08)',
  };
}

/**
 * Get the chapter color family for a lesson ID.
 */
export function getChapterColorFamily(lessonId: string): 'amber' | 'rose' | 'violet' {
  if (lessonId in CHAPTER_1_THEMES) return 'amber';
  if (lessonId in CHAPTER_2_THEMES) return 'rose';
  if (lessonId in CHAPTER_3_THEMES) return 'violet';
  return 'amber';
}
