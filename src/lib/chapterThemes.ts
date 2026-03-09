// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER THEMES
// Visual mood definitions for each chapter in a world
// ═══════════════════════════════════════════════════════════════════════════

export interface ChapterTheme {
  id: string;
  colors: {
    primary: string;
    glow: string;
    gradientFrom: string;
    gradientVia: string;
    gradientTo: string;
    fog: string;
    accent: string;
    text: string;
    mutedText: string;
    nodeBg: string;
    nodeActiveBorder: string;
  };
  backgroundImage: string;
}

// Chapter themes for Modern Wisdom
export const modernWisdomChapterThemes: ChapterTheme[] = [
  {
    // Chapter 1: Foundations — warm gold, temple atmosphere
    id: 'foundations',
    colors: {
      primary: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.4)',
      gradientFrom: 'rgba(120, 53, 15, 0.6)',
      gradientVia: 'rgba(60, 30, 8, 0.4)',
      gradientTo: 'rgba(10, 8, 6, 0.9)',
      fog: 'rgba(251, 191, 36, 0.06)',
      accent: '#f59e0b',
      text: '#fef3c7',
      mutedText: '#a8a29e',
      nodeBg: 'rgba(251, 191, 36, 0.12)',
      nodeActiveBorder: '#fbbf24',
    },
    backgroundImage: '/images/journey/ch-foundations.png',
  },
  {
    // Chapter 2: Resilience — stormy blue-steel
    id: 'resilience',
    colors: {
      primary: '#60a5fa',
      glow: 'rgba(96, 165, 250, 0.4)',
      gradientFrom: 'rgba(30, 58, 138, 0.6)',
      gradientVia: 'rgba(15, 30, 70, 0.4)',
      gradientTo: 'rgba(5, 5, 15, 0.9)',
      fog: 'rgba(96, 165, 250, 0.05)',
      accent: '#3b82f6',
      text: '#dbeafe',
      mutedText: '#94a3b8',
      nodeBg: 'rgba(96, 165, 250, 0.12)',
      nodeActiveBorder: '#60a5fa',
    },
    backgroundImage: '/images/journey/ch-resilience.png',
  },
  {
    // Chapter 3: Relationships — warm golden-rose (garden atmosphere)
    id: 'relationships',
    colors: {
      primary: '#f9a8d4',
      glow: 'rgba(249, 168, 212, 0.35)',
      gradientFrom: 'rgba(120, 60, 20, 0.5)',
      gradientVia: 'rgba(80, 40, 15, 0.35)',
      gradientTo: 'rgba(10, 6, 4, 0.9)',
      fog: 'rgba(251, 191, 36, 0.04)',
      accent: '#fb923c',
      text: '#fef3c7',
      mutedText: '#d6d3d1',
      nodeBg: 'rgba(249, 168, 212, 0.12)',
      nodeActiveBorder: '#f9a8d4',
    },
    backgroundImage: '/images/journey/ch-relationships.png',
  },
];

// Chapter themes for Stoicism
export const stoicismChapterThemes: ChapterTheme[] = [
  {
    // Chapter 1: Perception — deep indigo, temple of the mind
    id: 'perception',
    colors: {
      primary: '#818cf8',
      glow: 'rgba(129, 140, 248, 0.4)',
      gradientFrom: 'rgba(49, 46, 129, 0.6)',
      gradientVia: 'rgba(30, 27, 75, 0.4)',
      gradientTo: 'rgba(5, 5, 20, 0.9)',
      fog: 'rgba(129, 140, 248, 0.06)',
      accent: '#6366f1',
      text: '#e0e7ff',
      mutedText: '#94a3b8',
      nodeBg: 'rgba(129, 140, 248, 0.12)',
      nodeActiveBorder: '#818cf8',
    },
    backgroundImage: '/images/journey/ch-foundations.png',
  },
  {
    // Chapter 2: The Philosopher's Fire — ember orange-red
    id: 'philosophers-fire',
    colors: {
      primary: '#f97316',
      glow: 'rgba(249, 115, 22, 0.4)',
      gradientFrom: 'rgba(124, 45, 18, 0.6)',
      gradientVia: 'rgba(65, 25, 10, 0.4)',
      gradientTo: 'rgba(10, 5, 3, 0.9)',
      fog: 'rgba(249, 115, 22, 0.06)',
      accent: '#ea580c',
      text: '#ffedd5',
      mutedText: '#a8a29e',
      nodeBg: 'rgba(249, 115, 22, 0.12)',
      nodeActiveBorder: '#f97316',
    },
    backgroundImage: '/images/journey/ch-resilience.png',
  },
  {
    // Chapter 3: Citizen of the Cosmos — cosmic violet-blue
    id: 'citizen-of-cosmos',
    colors: {
      primary: '#a78bfa',
      glow: 'rgba(167, 139, 250, 0.35)',
      gradientFrom: 'rgba(76, 29, 149, 0.5)',
      gradientVia: 'rgba(40, 15, 80, 0.35)',
      gradientTo: 'rgba(5, 3, 15, 0.9)',
      fog: 'rgba(167, 139, 250, 0.05)',
      accent: '#8b5cf6',
      text: '#ede9fe',
      mutedText: '#c4b5fd',
      nodeBg: 'rgba(167, 139, 250, 0.12)',
      nodeActiveBorder: '#a78bfa',
    },
    backgroundImage: '/images/journey/ch-relationships.png',
  },
];

// Get chapter themes for a given world
export function getChapterThemesForWorld(worldSlug: string): ChapterTheme[] {
  switch (worldSlug) {
    case 'stoicism':
      return stoicismChapterThemes;
    case 'modern-wisdom':
    default:
      return modernWisdomChapterThemes;
  }
}
