// ============================================================================
// MILESTONE SYSTEM - Honoring the Journey
// ============================================================================
//
// These are not "achievements" in the gaming sense. These are milestones -
// quiet acknowledgments of real human effort, transformation, and growth.
//
// Each milestone is tied to a Stoic virtue:
// - Wisdom (σοφία) - Understanding oneself and the world
// - Courage (ἀνδρεία) - Facing difficulty with resolve
// - Temperance (σωφροσύνη) - Self-mastery and moderation
// - Justice (δικαιοσύνη) - Right action toward self and others
//
// We don't celebrate points. We honor transformation.
// ============================================================================

export type MilestoneCategory =
  | 'consistency'   // Showing up, day after day
  | 'learning'      // Absorbing wisdom
  | 'reflection'    // Looking inward
  | 'identity'      // Becoming who you're meant to be
  | 'integration'   // Making wisdom part of life
  | 'depth';        // Going deeper

export type Virtue = 'wisdom' | 'courage' | 'temperance' | 'justice';

// How significant is this milestone?
export type MilestoneWeight =
  | 'stepping-stone'   // Early steps, foundational
  | 'marker'           // Notable progress
  | 'cornerstone'      // Significant commitment
  | 'monument'         // Exceptional dedication
  | 'legacy';          // Rare, transformative

export interface Milestone {
  id: string;

  // The name should feel earned, not cute
  name: string;

  // What this milestone really means
  meaning: string;

  // A personal message for when they unlock it
  message: string;

  // Wisdom that relates to this accomplishment
  wisdom: {
    text: string;
    author: string;
  };

  // Visual
  symbol: string;

  // Categorization
  category: MilestoneCategory;
  virtue: Virtue;
  weight: MilestoneWeight;

  // Technical
  requirement: MilestoneRequirement;

  // For sharing (if they choose to)
  affirmation: string;

  // ============================================
  // Legacy property aliases for compatibility
  // ============================================
  /** @deprecated Use `meaning` instead */
  description?: string;
  /** @deprecated Use `symbol` instead */
  icon?: string;
  /** @deprecated Use `affirmation` instead */
  shareMessage?: string;
  /** @deprecated Use `weight` instead */
  rarity?: MilestoneWeight;
  /** @deprecated Use requirement for unlock conditions */
  condition?: string;
  /** @deprecated XP system replaced with virtue-based growth */
  xpBonus?: number;
}

export interface MilestoneRequirement {
  type: 'streak' | 'lessons' | 'reflections' | 'identity' | 'xp' | 'special';
  value: number;
  specialCondition?: string;
}

export interface MilestoneUnlock {
  achievementId: string;  // Legacy name for store compatibility
  unlockedAt: string;
  celebrated: boolean;    // Legacy name for store compatibility (honored)
}

// Legacy aliases for compatibility
export type AchievementCategory = MilestoneCategory;
export type AchievementRarity = MilestoneWeight;
export type Achievement = Milestone;
export type AchievementRequirement = MilestoneRequirement;
export type AchievementUnlock = MilestoneUnlock;

// ============================================================================
// MILESTONE DEFINITIONS
// ============================================================================
// Each milestone tells a story of transformation

export const MILESTONES: Milestone[] = [
  // ============================================================================
  // CONSISTENCY MILESTONES - The Practice of Showing Up
  // ============================================================================

  {
    id: 'streak-3',
    name: 'The Seed',
    meaning: 'Three days of choosing yourself',
    message: 'You planted something today. Most people never do. These three days are the beginning of everything.',
    wisdom: {
      text: 'Well begun is half done.',
      author: 'Aristotle',
    },
    symbol: '🌱',
    category: 'consistency',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'streak', value: 3 },
    affirmation: 'I chose myself for three days straight. The seed is planted.',
  },

  {
    id: 'streak-7',
    name: 'First Roots',
    meaning: 'A full week of daily practice',
    message: 'Seven days. You showed up every single one. The roots are taking hold. This is how change begins.',
    wisdom: {
      text: 'No great thing is created suddenly.',
      author: 'Epictetus',
    },
    symbol: '🌿',
    category: 'consistency',
    virtue: 'temperance',
    weight: 'stepping-stone',
    requirement: { type: 'streak', value: 7 },
    affirmation: 'One week of daily practice. My roots are forming.',
  },

  {
    id: 'streak-14',
    name: 'Taking Hold',
    meaning: 'Two weeks of unwavering commitment',
    message: 'Fourteen days. This is no longer luck or novelty. This is you, choosing growth, again and again.',
    wisdom: {
      text: 'First say to yourself what you would be; then do what you have to do.',
      author: 'Epictetus',
    },
    symbol: '🌳',
    category: 'consistency',
    virtue: 'temperance',
    weight: 'marker',
    requirement: { type: 'streak', value: 14 },
    affirmation: 'Two weeks. This is becoming who I am.',
  },

  {
    id: 'streak-21',
    name: 'The Forming',
    meaning: 'Three weeks - a habit is born',
    message: 'They say twenty-one days forges a habit. But you know the truth: it forges identity. You are becoming.',
    wisdom: {
      text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      author: 'Aristotle',
    },
    symbol: '⚡',
    category: 'consistency',
    virtue: 'temperance',
    weight: 'marker',
    requirement: { type: 'streak', value: 21 },
    affirmation: 'Twenty-one days. I am becoming who I practice being.',
  },

  {
    id: 'streak-30',
    name: 'One Moon',
    meaning: 'A full month of daily devotion',
    message: 'Thirty days. A complete lunar cycle of choosing wisdom over comfort. You have changed.',
    wisdom: {
      text: 'Begin at once to live, and count each separate day as a separate life.',
      author: 'Seneca',
    },
    symbol: '🌙',
    category: 'consistency',
    virtue: 'courage',
    weight: 'cornerstone',
    requirement: { type: 'streak', value: 30 },
    affirmation: 'One month. Thirty days of transformation.',
  },

  {
    id: 'streak-60',
    name: 'Deep Roots',
    meaning: 'Sixty days of steadfast practice',
    message: 'Two months. The practice is no longer separate from you. It is woven into the fabric of your days.',
    wisdom: {
      text: 'The soul becomes dyed with the color of its thoughts.',
      author: 'Marcus Aurelius',
    },
    symbol: '🪨',
    category: 'consistency',
    virtue: 'temperance',
    weight: 'cornerstone',
    requirement: { type: 'streak', value: 60 },
    affirmation: 'Sixty days. The practice and I are becoming one.',
  },

  {
    id: 'streak-90',
    name: 'A Season',
    meaning: 'Ninety days - a full season of growth',
    message: 'Three months. An entire season of devotion. The world has cycled through, and you have grown with it.',
    wisdom: {
      text: 'Difficulties strengthen the mind, as labor does the body.',
      author: 'Seneca',
    },
    symbol: '🏔️',
    category: 'consistency',
    virtue: 'courage',
    weight: 'monument',
    requirement: { type: 'streak', value: 90 },
    affirmation: 'Ninety days. A full season of becoming.',
  },

  {
    id: 'streak-180',
    name: 'Half the Journey',
    meaning: 'Six months of daily practice',
    message: 'One hundred eighty days. Half a year. This is extraordinary. You are extraordinary.',
    wisdom: {
      text: 'It is not the man who has too little, but the man who craves more, that is poor.',
      author: 'Seneca',
    },
    symbol: '☀️',
    category: 'consistency',
    virtue: 'wisdom',
    weight: 'monument',
    requirement: { type: 'streak', value: 180 },
    affirmation: 'Half a year. What seemed impossible became inevitable.',
  },

  {
    id: 'streak-365',
    name: 'The Circle Complete',
    meaning: 'One full year of daily wisdom',
    message: 'Three hundred sixty-five days. The earth has completed its journey around the sun, and you have completed yours around your true self. This is rare. You are rare.',
    wisdom: {
      text: 'The whole future lies in uncertainty: live immediately.',
      author: 'Seneca',
    },
    symbol: '🌟',
    category: 'consistency',
    virtue: 'wisdom',
    weight: 'legacy',
    requirement: { type: 'streak', value: 365 },
    affirmation: 'One year. I showed up for myself every single day.',
  },

  // ============================================================================
  // LEARNING MILESTONES - Absorbing Wisdom
  // ============================================================================

  {
    id: 'lessons-1',
    name: 'The First Step',
    meaning: 'You began',
    message: 'You took the first step. Most people spend their whole lives thinking about it. You did it.',
    wisdom: {
      text: 'The journey of a thousand miles begins with a single step.',
      author: 'Lao Tzu',
    },
    symbol: '👣',
    category: 'learning',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'lessons', value: 1 },
    affirmation: 'I took the first step. The journey has begun.',
  },

  {
    id: 'lessons-5',
    name: 'The Curious Mind',
    meaning: 'Five lessons completed',
    message: 'Five lessons. You are asking the questions that matter. Curiosity is the beginning of wisdom.',
    wisdom: {
      text: 'Wisdom begins in wonder.',
      author: 'Socrates',
    },
    symbol: '🔍',
    category: 'learning',
    virtue: 'wisdom',
    weight: 'stepping-stone',
    requirement: { type: 'lessons', value: 5 },
    affirmation: 'Five lessons. My curiosity is leading me somewhere beautiful.',
  },

  {
    id: 'lessons-10',
    name: 'The Student',
    meaning: 'Ten lessons absorbed',
    message: 'Ten lessons. You have earned the title of student. Not by sitting in a classroom, but by showing up for yourself.',
    wisdom: {
      text: 'Education is not the filling of a pail, but the lighting of a fire.',
      author: 'W.B. Yeats',
    },
    symbol: '📚',
    category: 'learning',
    virtue: 'wisdom',
    weight: 'marker',
    requirement: { type: 'lessons', value: 10 },
    affirmation: 'Ten lessons. I am a student of life.',
  },

  {
    id: 'lessons-25',
    name: 'The Seeker',
    meaning: 'Twenty-five lessons of wisdom',
    message: 'Twenty-five lessons. You are not just learning - you are seeking. There is a difference.',
    wisdom: {
      text: 'The only true wisdom is in knowing you know nothing.',
      author: 'Socrates',
    },
    symbol: '🧭',
    category: 'learning',
    virtue: 'wisdom',
    weight: 'marker',
    requirement: { type: 'lessons', value: 25 },
    affirmation: 'Twenty-five lessons. I seek wisdom with intention.',
  },

  {
    id: 'lessons-50',
    name: 'The Devoted',
    meaning: 'Fifty lessons completed',
    message: 'Fifty lessons. This is devotion. You have committed yourself to growth in a way few ever do.',
    wisdom: {
      text: 'The happiness of your life depends upon the quality of your thoughts.',
      author: 'Marcus Aurelius',
    },
    symbol: '🏛️',
    category: 'learning',
    virtue: 'temperance',
    weight: 'cornerstone',
    requirement: { type: 'lessons', value: 50 },
    affirmation: 'Fifty lessons of ancient wisdom are now part of me.',
  },

  {
    id: 'lessons-100',
    name: 'The Philosopher',
    meaning: 'One hundred lessons - a life examined',
    message: 'One hundred lessons. You have walked with Seneca, Marcus Aurelius, and Epictetus. Their wisdom flows through you now.',
    wisdom: {
      text: 'The unexamined life is not worth living.',
      author: 'Socrates',
    },
    symbol: '🦉',
    category: 'learning',
    virtue: 'wisdom',
    weight: 'monument',
    requirement: { type: 'lessons', value: 100 },
    affirmation: 'One hundred lessons. I walk with the philosophers.',
  },

  // ============================================================================
  // REFLECTION MILESTONES - Looking Inward
  // ============================================================================

  {
    id: 'reflections-5',
    name: 'The Mirror',
    meaning: 'Five reflections written',
    message: 'Five times you looked inward and wrote what you saw. This is the beginning of self-knowledge.',
    wisdom: {
      text: 'Know thyself.',
      author: 'Delphic Maxim',
    },
    symbol: '🪞',
    category: 'reflection',
    virtue: 'wisdom',
    weight: 'stepping-stone',
    requirement: { type: 'reflections', value: 5 },
    affirmation: 'I am learning to see myself clearly.',
  },

  {
    id: 'reflections-10',
    name: 'The Honest Voice',
    meaning: 'Ten honest reflections',
    message: 'Ten times you told yourself the truth. Honesty with oneself is the hardest kind. You are doing it.',
    wisdom: {
      text: 'We suffer more often in imagination than in reality.',
      author: 'Seneca',
    },
    symbol: '✍️',
    category: 'reflection',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'reflections', value: 10 },
    affirmation: 'Ten reflections. I am honest with myself.',
  },

  {
    id: 'reflections-25',
    name: 'The Observer',
    meaning: 'Twenty-five reflections',
    message: 'Twenty-five times you observed your own mind. You are developing the skill the Stoics called "prosoche" - attention.',
    wisdom: {
      text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
      author: 'Marcus Aurelius',
    },
    symbol: '👁️',
    category: 'reflection',
    virtue: 'wisdom',
    weight: 'marker',
    requirement: { type: 'reflections', value: 25 },
    affirmation: 'I observe my own mind with clarity.',
  },

  {
    id: 'reflections-50',
    name: 'The Chronicle',
    meaning: 'Fifty reflections written',
    message: 'Fifty reflections. You have created a chronicle of your inner life. This is a rare and precious thing.',
    wisdom: {
      text: 'The things you think about determine the quality of your mind.',
      author: 'Marcus Aurelius',
    },
    symbol: '📖',
    category: 'reflection',
    virtue: 'temperance',
    weight: 'cornerstone',
    requirement: { type: 'reflections', value: 50 },
    affirmation: 'Fifty reflections. A chronicle of transformation.',
  },

  {
    id: 'reflections-100',
    name: 'The Archivist',
    meaning: 'One hundred reflections',
    message: 'One hundred windows into your soul. Like Marcus Aurelius with his Meditations, you have created something precious.',
    wisdom: {
      text: 'When you arise in the morning, think of what a precious privilege it is to be alive.',
      author: 'Marcus Aurelius',
    },
    symbol: '📜',
    category: 'reflection',
    virtue: 'wisdom',
    weight: 'monument',
    requirement: { type: 'reflections', value: 100 },
    affirmation: 'One hundred reflections. My own Meditations.',
  },

  // ============================================================================
  // IDENTITY MILESTONES - Becoming
  // ============================================================================

  {
    id: 'identity-1',
    name: 'The Declaration',
    meaning: 'Your first identity statement',
    message: 'You declared who you are becoming. This is not wishful thinking - it is architecture. You are building yourself.',
    wisdom: {
      text: 'First say to yourself what you would be; then do what you have to do.',
      author: 'Epictetus',
    },
    symbol: '🔥',
    category: 'identity',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'identity', value: 1 },
    affirmation: 'I declared who I am becoming.',
  },

  {
    id: 'identity-3',
    name: 'The Facets',
    meaning: 'Three aspects of your identity defined',
    message: 'Three facets of who you are becoming. You are not one thing - you are many. And you are shaping them all.',
    wisdom: {
      text: 'No man is free who is not master of himself.',
      author: 'Epictetus',
    },
    symbol: '💎',
    category: 'identity',
    virtue: 'wisdom',
    weight: 'marker',
    requirement: { type: 'identity', value: 3 },
    affirmation: 'I am shaping multiple facets of who I am.',
  },

  {
    id: 'identity-5',
    name: 'The Sculptor',
    meaning: 'Five dimensions of your becoming',
    message: 'You are sculpting yourself like marble. Five strokes of the chisel. The figure is emerging.',
    wisdom: {
      text: 'The soul is dyed the color of its thoughts.',
      author: 'Marcus Aurelius',
    },
    symbol: '🗿',
    category: 'identity',
    virtue: 'temperance',
    weight: 'cornerstone',
    requirement: { type: 'identity', value: 5 },
    affirmation: 'I am the sculptor of my own becoming.',
  },

  {
    id: 'identity-10',
    name: 'The Architect',
    meaning: 'Ten pillars of who you are',
    message: 'Ten pillars. You have designed the architecture of your soul. Few people ever attempt this. You are building it.',
    wisdom: {
      text: 'Make the best use of what is in your power, and take the rest as it happens.',
      author: 'Epictetus',
    },
    symbol: '🏗️',
    category: 'identity',
    virtue: 'wisdom',
    weight: 'monument',
    requirement: { type: 'identity', value: 10 },
    affirmation: 'I am the architect of my own soul.',
  },

  // ============================================================================
  // INTEGRATION MILESTONES - Living the Wisdom
  // ============================================================================

  {
    id: 'first-practice',
    name: 'Wisdom in Action',
    meaning: 'You practiced what you learned',
    message: 'You moved from knowing to doing. This is the gap most people never cross. You crossed it.',
    wisdom: {
      text: 'It is not the man who has too little, but the man who craves more, that is poor.',
      author: 'Seneca',
    },
    symbol: '⚔️',
    category: 'integration',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'special', value: 1, specialCondition: 'first-practice' },
    affirmation: 'I practice what I learn. Wisdom becomes action.',
  },

  {
    id: 'first-checkin',
    name: 'The Pause',
    meaning: 'Your first weekly reflection',
    message: 'You paused to look back at your week. In a world of constant forward motion, you chose reflection.',
    wisdom: {
      text: 'Begin at once to live, and count each separate day as a separate life.',
      author: 'Seneca',
    },
    symbol: '⏸️',
    category: 'integration',
    virtue: 'temperance',
    weight: 'stepping-stone',
    requirement: { type: 'special', value: 1, specialCondition: 'first-checkin' },
    affirmation: 'I pause to reflect. This is wisdom.',
  },

  {
    id: 'first-assessment',
    name: 'The Measure',
    meaning: 'Your first monthly assessment',
    message: 'You measured your progress. Not to judge, but to understand. Self-awareness is the foundation of all growth.',
    wisdom: {
      text: 'The unexamined life is not worth living.',
      author: 'Socrates',
    },
    symbol: '📊',
    category: 'integration',
    virtue: 'wisdom',
    weight: 'marker',
    requirement: { type: 'special', value: 1, specialCondition: 'first-assessment' },
    affirmation: 'I measure my growth to understand my journey.',
  },

  {
    id: 'wisdom-action-1',
    name: 'The Application',
    meaning: 'You applied wisdom to real life',
    message: 'You took ancient wisdom and applied it to a modern moment. This is what the Stoics meant by philosophy as a way of life.',
    wisdom: {
      text: 'Waste no more time arguing about what a good man should be. Be one.',
      author: 'Marcus Aurelius',
    },
    symbol: '💫',
    category: 'integration',
    virtue: 'justice',
    weight: 'marker',
    requirement: { type: 'special', value: 1, specialCondition: 'first-wisdom-action' },
    affirmation: 'I apply wisdom in real life moments.',
  },

  // ============================================================================
  // DEPTH MILESTONES - The Journey Deepens
  // ============================================================================

  {
    id: 'xp-100',
    name: 'The Awakening',
    meaning: 'Your journey has begun',
    message: 'One hundred points of growth. But more than points - one hundred moments of choosing wisdom. You are awakening.',
    wisdom: {
      text: 'How long are you going to wait before you demand the best for yourself?',
      author: 'Epictetus',
    },
    symbol: '🌅',
    category: 'depth',
    virtue: 'courage',
    weight: 'stepping-stone',
    requirement: { type: 'xp', value: 100 },
    affirmation: 'I am awakening to my own potential.',
  },

  {
    id: 'xp-500',
    name: 'The Rising',
    meaning: 'Substantial growth',
    message: 'Five hundred points of dedicated practice. You are rising. Not above others - above your former self.',
    wisdom: {
      text: 'The impediment to action advances action. What stands in the way becomes the way.',
      author: 'Marcus Aurelius',
    },
    symbol: '🌄',
    category: 'depth',
    virtue: 'courage',
    weight: 'marker',
    requirement: { type: 'xp', value: 500 },
    affirmation: 'I am rising above who I used to be.',
  },

  {
    id: 'xp-1000',
    name: 'The Threshold',
    meaning: 'A thousand steps on the path',
    message: 'One thousand points. You have crossed a threshold few ever reach. The view from here is different.',
    wisdom: {
      text: 'It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.',
      author: 'Seneca',
    },
    symbol: '🚪',
    category: 'depth',
    virtue: 'wisdom',
    weight: 'cornerstone',
    requirement: { type: 'xp', value: 1000 },
    affirmation: 'I crossed a threshold. There is no going back.',
  },

  {
    id: 'xp-2500',
    name: 'The Deepening',
    meaning: 'Your practice runs deep',
    message: 'Two thousand five hundred points. Your practice has depth now. It reaches down to the roots of who you are.',
    wisdom: {
      text: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.',
      author: 'Marcus Aurelius',
    },
    symbol: '🌊',
    category: 'depth',
    virtue: 'wisdom',
    weight: 'monument',
    requirement: { type: 'xp', value: 2500 },
    affirmation: 'My practice has become deep and true.',
  },

  {
    id: 'xp-5000',
    name: 'The Transcending',
    meaning: 'Beyond ordinary practice',
    message: 'Five thousand points. You have transcended ordinary practice. You are not just learning wisdom - you are becoming it.',
    wisdom: {
      text: 'There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.',
      author: 'Epictetus',
    },
    symbol: '✨',
    category: 'depth',
    virtue: 'wisdom',
    weight: 'legacy',
    requirement: { type: 'xp', value: 5000 },
    affirmation: 'I have transcended. Wisdom is not what I do - it is who I am.',
  },
];

// Legacy compatibility
export const ACHIEVEMENTS = MILESTONES;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getMilestoneById(id: string): Milestone | undefined {
  return MILESTONES.find(m => m.id === id);
}

// Legacy alias
export function getAchievementById(id: string): Milestone | undefined {
  return getMilestoneById(id);
}

export function getMilestonesByCategory(category: MilestoneCategory): Milestone[] {
  return MILESTONES.filter(m => m.category === category);
}

export function getAchievementsByCategory(category: MilestoneCategory): Milestone[] {
  return getMilestonesByCategory(category);
}

export function getMilestonesByVirtue(virtue: Virtue): Milestone[] {
  return MILESTONES.filter(m => m.virtue === virtue);
}

export function getMilestonesByWeight(weight: MilestoneWeight): Milestone[] {
  return MILESTONES.filter(m => m.weight === weight);
}

// Legacy alias
export function getAchievementsByRarity(weight: MilestoneWeight): Milestone[] {
  return getMilestonesByWeight(weight);
}

// ============================================================================
// VISUAL STYLING
// ============================================================================

export function getVirtueColor(virtue: Virtue): string {
  switch (virtue) {
    case 'wisdom': return 'from-indigo-400 to-purple-500';
    case 'courage': return 'from-amber-400 to-orange-500';
    case 'temperance': return 'from-emerald-400 to-teal-500';
    case 'justice': return 'from-sky-400 to-blue-500';
  }
}

export function getVirtueGlow(virtue: Virtue): string {
  switch (virtue) {
    case 'wisdom': return 'shadow-purple-500/40';
    case 'courage': return 'shadow-orange-500/40';
    case 'temperance': return 'shadow-emerald-500/40';
    case 'justice': return 'shadow-blue-500/40';
  }
}

export function getVirtueLabel(virtue: Virtue): string {
  switch (virtue) {
    case 'wisdom': return 'Wisdom';
    case 'courage': return 'Courage';
    case 'temperance': return 'Temperance';
    case 'justice': return 'Justice';
  }
}

export function getVirtueGreek(virtue: Virtue): string {
  switch (virtue) {
    case 'wisdom': return 'σοφία';
    case 'courage': return 'ἀνδρεία';
    case 'temperance': return 'σωφροσύνη';
    case 'justice': return 'δικαιοσύνη';
  }
}

export function getWeightColor(weight: MilestoneWeight): string {
  switch (weight) {
    case 'stepping-stone': return 'from-zinc-400 to-zinc-500';
    case 'marker': return 'from-slate-300 to-slate-500';
    case 'cornerstone': return 'from-amber-300 to-amber-500';
    case 'monument': return 'from-purple-400 to-indigo-500';
    case 'legacy': return 'from-amber-200 via-yellow-300 to-amber-400';
  }
}

export function getWeightLabel(weight: MilestoneWeight): string {
  switch (weight) {
    case 'stepping-stone': return 'Stepping Stone';
    case 'marker': return 'Marker';
    case 'cornerstone': return 'Cornerstone';
    case 'monument': return 'Monument';
    case 'legacy': return 'Legacy';
  }
}

// Legacy compatibility functions
export function getRarityColor(weight: MilestoneWeight | string): string {
  // Map old rarity names to new weight names
  const mapping: Record<string, MilestoneWeight> = {
    'common': 'stepping-stone',
    'uncommon': 'marker',
    'rare': 'cornerstone',
    'epic': 'monument',
    'legendary': 'legacy',
  };
  const actualWeight = mapping[weight] || weight as MilestoneWeight;
  return getWeightColor(actualWeight);
}

export function getRarityGlow(weight: MilestoneWeight | string): string {
  const mapping: Record<string, string> = {
    'common': 'shadow-zinc-500/20',
    'uncommon': 'shadow-slate-500/30',
    'rare': 'shadow-amber-500/40',
    'epic': 'shadow-purple-500/50',
    'legendary': 'shadow-yellow-500/60',
    'stepping-stone': 'shadow-zinc-500/20',
    'marker': 'shadow-slate-500/30',
    'cornerstone': 'shadow-amber-500/40',
    'monument': 'shadow-purple-500/50',
    'legacy': 'shadow-yellow-500/60',
  };
  return mapping[weight] || 'shadow-zinc-500/20';
}

export function getRarityLabel(weight: MilestoneWeight | string): string {
  const mapping: Record<string, string> = {
    'common': 'Stepping Stone',
    'uncommon': 'Marker',
    'rare': 'Cornerstone',
    'epic': 'Monument',
    'legendary': 'Legacy',
  };
  return mapping[weight] || getWeightLabel(weight as MilestoneWeight);
}

// ============================================================================
// LEGACY PROPERTY POPULATION
// ============================================================================
// Adds backward-compatible aliases to all milestones

function withLegacyProps(milestone: Milestone): Milestone {
  // Map weight to XP bonus for backward compatibility
  const xpBonusMap: Record<MilestoneWeight, number> = {
    'stepping-stone': 25,
    'marker': 50,
    'cornerstone': 100,
    'monument': 200,
    'legacy': 500,
  };

  // Generate a human-readable condition string
  const conditionMap: Record<string, (val: number) => string> = {
    streak: (v) => `${v}-day streak`,
    lessons: (v) => `Complete ${v} lesson${v === 1 ? '' : 's'}`,
    reflections: (v) => `Write ${v} reflection${v === 1 ? '' : 's'}`,
    identity: (v) => `Create ${v} identity statement${v === 1 ? '' : 's'}`,
    xp: (v) => `Earn ${v.toLocaleString()} XP`,
    special: () => milestone.meaning,
  };

  return {
    ...milestone,
    // Legacy aliases
    description: milestone.meaning,
    icon: milestone.symbol,
    shareMessage: milestone.affirmation,
    rarity: milestone.weight,
    condition: conditionMap[milestone.requirement.type]?.(milestone.requirement.value) || milestone.meaning,
    xpBonus: xpBonusMap[milestone.weight],
  };
}

// Apply legacy properties to all milestones
MILESTONES.forEach((m, i) => {
  const enhanced = withLegacyProps(m);
  Object.assign(MILESTONES[i], enhanced);
});

// Update ACHIEVEMENTS reference
export { MILESTONES as ACHIEVEMENTS_ENHANCED };
