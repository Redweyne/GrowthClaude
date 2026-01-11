// ============================================
// PHASE 3: COMPREHENSIVE ACHIEVEMENT SYSTEM
// ============================================

export type AchievementCategory =
  | 'streak'      // Consistency achievements
  | 'lessons'     // Lesson completion
  | 'reflections' // Reflection depth
  | 'identity'    // Identity transformation
  | 'milestones'  // Special moments
  | 'mastery';    // Deep practice

export type AchievementRarity =
  | 'common'      // Easy to get
  | 'uncommon'    // Takes some effort
  | 'rare'        // Significant commitment
  | 'epic'        // Major achievement
  | 'legendary';  // Exceptional dedication

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  xpBonus: number;
  requirement: AchievementRequirement;
  condition: string; // Human-readable unlock condition
  shareMessage: string; // For shareable cards
}

export interface AchievementRequirement {
  type: 'streak' | 'lessons' | 'reflections' | 'identity' | 'xp' | 'special';
  value: number;
  specialCondition?: string; // For special achievements
}

export interface AchievementUnlock {
  achievementId: string;
  unlockedAt: string;
  celebrated: boolean; // Has user seen the unlock animation?
}

// ============================================
// ACHIEVEMENT DEFINITIONS
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  // ========== STREAK ACHIEVEMENTS ==========
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: '3 days of consistent practice',
    icon: '🌱',
    category: 'streak',
    rarity: 'common',
    xpBonus: 25,
    requirement: { type: 'streak', value: 3 },
    condition: '3-day streak',
    shareMessage: "I've practiced Stoic wisdom for 3 days straight!",
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: '7 days of unbroken dedication',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    xpBonus: 50,
    requirement: { type: 'streak', value: 7 },
    condition: '7-day streak',
    shareMessage: "One week of daily Stoic practice complete!",
  },
  {
    id: 'streak-14',
    name: 'Fortnight Fighter',
    description: '14 days - the habit is forming',
    icon: '⚡',
    category: 'streak',
    rarity: 'uncommon',
    xpBonus: 100,
    requirement: { type: 'streak', value: 14 },
    condition: '14-day streak',
    shareMessage: "Two weeks of daily wisdom. The habit is real.",
  },
  {
    id: 'streak-21',
    name: 'Habit Forged',
    description: '21 days - they say this builds habits',
    icon: '🔨',
    category: 'streak',
    rarity: 'uncommon',
    xpBonus: 150,
    requirement: { type: 'streak', value: 21 },
    condition: '21-day streak',
    shareMessage: "21 days of Stoic practice. This is who I am now.",
  },
  {
    id: 'streak-30',
    name: 'Month Master',
    description: 'A full month of daily practice',
    icon: '🌙',
    category: 'streak',
    rarity: 'rare',
    xpBonus: 250,
    requirement: { type: 'streak', value: 30 },
    condition: '30-day streak',
    shareMessage: "30 days of transformation. One month of becoming.",
  },
  {
    id: 'streak-60',
    name: 'Discipline Embodied',
    description: '60 days - discipline becomes identity',
    icon: '💎',
    category: 'streak',
    rarity: 'rare',
    xpBonus: 400,
    requirement: { type: 'streak', value: 60 },
    condition: '60-day streak',
    shareMessage: "60 days of daily Stoic practice. I am discipline.",
  },
  {
    id: 'streak-90',
    name: 'Quarter Champion',
    description: '90 days of unwavering commitment',
    icon: '👑',
    category: 'streak',
    rarity: 'epic',
    xpBonus: 600,
    requirement: { type: 'streak', value: 90 },
    condition: '90-day streak',
    shareMessage: "90 days. A quarter year of philosophical practice.",
  },
  {
    id: 'streak-180',
    name: 'Half-Year Hero',
    description: '180 days - you are extraordinary',
    icon: '🏆',
    category: 'streak',
    rarity: 'epic',
    xpBonus: 1000,
    requirement: { type: 'streak', value: 180 },
    condition: '180-day streak',
    shareMessage: "Half a year of daily practice. Extraordinary commitment.",
  },
  {
    id: 'streak-365',
    name: 'Year of Wisdom',
    description: 'A full year of daily practice',
    icon: '🌟',
    category: 'streak',
    rarity: 'legendary',
    xpBonus: 2000,
    requirement: { type: 'streak', value: 365 },
    condition: '365-day streak',
    shareMessage: "365 days. One year of becoming who I was meant to be.",
  },

  // ========== LESSON ACHIEVEMENTS ==========
  {
    id: 'lessons-1',
    name: 'First Step',
    description: 'Complete your first lesson',
    icon: '👣',
    category: 'lessons',
    rarity: 'common',
    xpBonus: 25,
    requirement: { type: 'lessons', value: 1 },
    condition: 'Complete 1 lesson',
    shareMessage: "I took my first step on the path of Stoic wisdom.",
  },
  {
    id: 'lessons-5',
    name: 'Curious Mind',
    description: 'Complete 5 lessons',
    icon: '🧠',
    category: 'lessons',
    rarity: 'common',
    xpBonus: 50,
    requirement: { type: 'lessons', value: 5 },
    condition: 'Complete 5 lessons',
    shareMessage: "5 lessons into my journey of self-mastery.",
  },
  {
    id: 'lessons-10',
    name: 'Student',
    description: 'Complete 10 lessons',
    icon: '📚',
    category: 'lessons',
    rarity: 'uncommon',
    xpBonus: 100,
    requirement: { type: 'lessons', value: 10 },
    condition: 'Complete 10 lessons',
    shareMessage: "10 lessons of ancient wisdom, now part of me.",
  },
  {
    id: 'lessons-25',
    name: 'Dedicated Learner',
    description: 'Complete 25 lessons',
    icon: '🎓',
    category: 'lessons',
    rarity: 'uncommon',
    xpBonus: 200,
    requirement: { type: 'lessons', value: 25 },
    condition: 'Complete 25 lessons',
    shareMessage: "25 lessons. Dedicated to the path of wisdom.",
  },
  {
    id: 'lessons-50',
    name: 'Scholar',
    description: 'Complete 50 lessons',
    icon: '🏛️',
    category: 'lessons',
    rarity: 'rare',
    xpBonus: 350,
    requirement: { type: 'lessons', value: 50 },
    condition: 'Complete 50 lessons',
    shareMessage: "50 lessons of Stoic philosophy completed.",
  },
  {
    id: 'lessons-100',
    name: 'Philosopher',
    description: 'Complete 100 lessons',
    icon: '🦉',
    category: 'lessons',
    rarity: 'epic',
    xpBonus: 600,
    requirement: { type: 'lessons', value: 100 },
    condition: 'Complete 100 lessons',
    shareMessage: "100 lessons. I am a student of the ancient philosophers.",
  },

  // ========== REFLECTION ACHIEVEMENTS ==========
  {
    id: 'reflections-5',
    name: 'Inner Voice',
    description: 'Write 5 reflections',
    icon: '✍️',
    category: 'reflections',
    rarity: 'common',
    xpBonus: 30,
    requirement: { type: 'reflections', value: 5 },
    condition: 'Write 5 reflections',
    shareMessage: "5 reflections written. Finding my inner voice.",
  },
  {
    id: 'reflections-10',
    name: 'Deep Thinker',
    description: 'Write 10 reflections',
    icon: '💭',
    category: 'reflections',
    rarity: 'common',
    xpBonus: 50,
    requirement: { type: 'reflections', value: 10 },
    condition: 'Write 10 reflections',
    shareMessage: "10 reflections. Thinking deeply about life.",
  },
  {
    id: 'reflections-25',
    name: 'Journeyer',
    description: 'Write 25 reflections',
    icon: '📖',
    category: 'reflections',
    rarity: 'uncommon',
    xpBonus: 100,
    requirement: { type: 'reflections', value: 25 },
    condition: 'Write 25 reflections',
    shareMessage: "25 reflections on my journey of growth.",
  },
  {
    id: 'reflections-50',
    name: 'Self-Observer',
    description: 'Write 50 reflections',
    icon: '🔮',
    category: 'reflections',
    rarity: 'rare',
    xpBonus: 200,
    requirement: { type: 'reflections', value: 50 },
    condition: 'Write 50 reflections',
    shareMessage: "50 reflections. I observe myself with clarity.",
  },
  {
    id: 'reflections-100',
    name: 'Chronicler',
    description: 'Write 100 reflections',
    icon: '📜',
    category: 'reflections',
    rarity: 'epic',
    xpBonus: 400,
    requirement: { type: 'reflections', value: 100 },
    condition: 'Write 100 reflections',
    shareMessage: "100 reflections. A chronicle of transformation.",
  },

  // ========== IDENTITY ACHIEVEMENTS ==========
  {
    id: 'identity-1',
    name: 'Self-Definition',
    description: 'Create your first identity statement',
    icon: '🪞',
    category: 'identity',
    rarity: 'common',
    xpBonus: 50,
    requirement: { type: 'identity', value: 1 },
    condition: 'Create 1 identity statement',
    shareMessage: "I defined who I am becoming.",
  },
  {
    id: 'identity-3',
    name: 'Identity Explorer',
    description: 'Create 3 identity statements',
    icon: '🧭',
    category: 'identity',
    rarity: 'uncommon',
    xpBonus: 100,
    requirement: { type: 'identity', value: 3 },
    condition: 'Create 3 identity statements',
    shareMessage: "Exploring the many facets of who I am.",
  },
  {
    id: 'identity-5',
    name: 'Identity Architect',
    description: 'Create 5 identity statements',
    icon: '🏗️',
    category: 'identity',
    rarity: 'rare',
    xpBonus: 150,
    requirement: { type: 'identity', value: 5 },
    condition: 'Create 5 identity statements',
    shareMessage: "Architecting the person I am becoming.",
  },
  {
    id: 'identity-10',
    name: 'Transformed',
    description: 'Create 10 identity statements',
    icon: '🦋',
    category: 'identity',
    rarity: 'epic',
    xpBonus: 300,
    requirement: { type: 'identity', value: 10 },
    condition: 'Create 10 identity statements',
    shareMessage: "Transformed. I am not who I was.",
  },

  // ========== MILESTONE ACHIEVEMENTS ==========
  {
    id: 'first-practice',
    name: 'Practice Begins',
    description: 'Complete your first practice session',
    icon: '🎯',
    category: 'milestones',
    rarity: 'common',
    xpBonus: 30,
    requirement: { type: 'special', value: 1, specialCondition: 'first-practice' },
    condition: 'Complete a practice session',
    shareMessage: "Started practicing what I'm learning.",
  },
  {
    id: 'first-checkin',
    name: 'Weekly Wisdom',
    description: 'Complete your first weekly check-in',
    icon: '📅',
    category: 'milestones',
    rarity: 'common',
    xpBonus: 30,
    requirement: { type: 'special', value: 1, specialCondition: 'first-checkin' },
    condition: 'Complete a weekly check-in',
    shareMessage: "Completed my first weekly reflection.",
  },
  {
    id: 'first-assessment',
    name: 'Self-Aware',
    description: 'Complete your first monthly assessment',
    icon: '📊',
    category: 'milestones',
    rarity: 'uncommon',
    xpBonus: 50,
    requirement: { type: 'special', value: 1, specialCondition: 'first-assessment' },
    condition: 'Complete a monthly assessment',
    shareMessage: "Took my first monthly self-assessment.",
  },
  {
    id: 'wisdom-action-1',
    name: 'Wisdom Applied',
    description: 'Log your first real-world application',
    icon: '⚔️',
    category: 'milestones',
    rarity: 'uncommon',
    xpBonus: 50,
    requirement: { type: 'special', value: 1, specialCondition: 'first-wisdom-action' },
    condition: 'Log a wisdom in action entry',
    shareMessage: "Applied Stoic wisdom in real life.",
  },

  // ========== XP/MASTERY ACHIEVEMENTS ==========
  {
    id: 'xp-100',
    name: 'Awakening',
    description: 'Earn your first 100 XP',
    icon: '🌅',
    category: 'mastery',
    rarity: 'common',
    xpBonus: 25,
    requirement: { type: 'xp', value: 100 },
    condition: 'Earn 100 XP',
    shareMessage: "100 XP earned. My awakening begins.",
  },
  {
    id: 'xp-500',
    name: 'Rising',
    description: 'Earn 500 XP',
    icon: '🌄',
    category: 'mastery',
    rarity: 'uncommon',
    xpBonus: 50,
    requirement: { type: 'xp', value: 500 },
    condition: 'Earn 500 XP',
    shareMessage: "500 XP. Rising on the path of wisdom.",
  },
  {
    id: 'xp-1000',
    name: 'Ascending',
    description: 'Earn 1,000 XP',
    icon: '🏔️',
    category: 'mastery',
    rarity: 'rare',
    xpBonus: 100,
    requirement: { type: 'xp', value: 1000 },
    condition: 'Earn 1,000 XP',
    shareMessage: "1,000 XP earned through dedication.",
  },
  {
    id: 'xp-2500',
    name: 'Mastering',
    description: 'Earn 2,500 XP',
    icon: '⛰️',
    category: 'mastery',
    rarity: 'epic',
    xpBonus: 200,
    requirement: { type: 'xp', value: 2500 },
    condition: 'Earn 2,500 XP',
    shareMessage: "2,500 XP. Mastering the art of living.",
  },
  {
    id: 'xp-5000',
    name: 'Transcendent',
    description: 'Earn 5,000 XP',
    icon: '✨',
    category: 'mastery',
    rarity: 'legendary',
    xpBonus: 500,
    requirement: { type: 'xp', value: 5000 },
    condition: 'Earn 5,000 XP',
    shareMessage: "5,000 XP. Transcendent dedication to growth.",
  },
];

// Helper functions
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

export function getAchievementsByRarity(rarity: AchievementRarity): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity);
}

export function getRarityColor(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return 'from-zinc-400 to-zinc-600';
    case 'uncommon': return 'from-emerald-400 to-emerald-600';
    case 'rare': return 'from-blue-400 to-blue-600';
    case 'epic': return 'from-purple-400 to-purple-600';
    case 'legendary': return 'from-amber-400 to-orange-500';
  }
}

export function getRarityGlow(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return 'shadow-zinc-500/20';
    case 'uncommon': return 'shadow-emerald-500/30';
    case 'rare': return 'shadow-blue-500/40';
    case 'epic': return 'shadow-purple-500/50';
    case 'legendary': return 'shadow-amber-500/60';
  }
}

export function getRarityLabel(rarity: AchievementRarity): string {
  switch (rarity) {
    case 'common': return 'Common';
    case 'uncommon': return 'Uncommon';
    case 'rare': return 'Rare';
    case 'epic': return 'Epic';
    case 'legendary': return 'Legendary';
  }
}
