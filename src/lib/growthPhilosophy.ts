// ============================================================================
// GROWTH PHILOSOPHY - The Soul of Transformation
// ============================================================================
//
// This file contains the emotional and philosophical core of the app.
// Every reward, milestone, and celebration draws from this well.
//
// The goal: Make users feel seen, acknowledged, and inspired.
// Not gamified. Not manipulated. Genuinely supported on their journey.
// ============================================================================

// ============================================================================
// STOIC WISDOM - Quotes that resonate with growth
// ============================================================================

export const WISDOM_QUOTES = {
  // For lesson completion - acknowledging the work
  completion: [
    { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
    { text: "No man is free who is not master of himself.", author: "Epictetus" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
    { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
    { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
    { text: "First say to yourself what you would be; then do what you have to do.", author: "Epictetus" },
    { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  ],

  // For streaks - celebrating consistency
  consistency: [
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "No great thing is created suddenly.", author: "Epictetus" },
    { text: "The more we value things outside our control, the less control we have.", author: "Epictetus" },
    { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
    { text: "He who fears death will never do anything worthy of a living man.", author: "Seneca" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  ],

  // For level ups - acknowledging growth
  growth: [
    { text: "The whole future lies in uncertainty: live immediately.", author: "Seneca" },
    { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
    { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
    { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
    { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
    { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus" },
  ],

  // For milestones - acknowledging the journey
  milestone: [
    { text: "It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult.", author: "Seneca" },
    { text: "The object of life is not to be on the side of the majority, but to escape finding oneself in the ranks of the insane.", author: "Marcus Aurelius" },
    { text: "There is only one way to happiness and that is to cease worrying about things which are beyond the power of our will.", author: "Epictetus" },
    { text: "He suffers more than necessary, who suffers before it is necessary.", author: "Seneca" },
    { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  ],
};

// ============================================================================
// MEANINGFUL LEVEL SYSTEM
// ============================================================================
// Not fantasy game ranks, but actual stages of philosophical practice

export interface GrowthLevel {
  level: number;
  title: string;
  subtitle: string;
  description: string;
  minXp: number;
  maxXp: number;
  virtue: 'wisdom' | 'courage' | 'temperance' | 'justice';
  unlockMessage: string;
}

export const GROWTH_LEVELS: GrowthLevel[] = [
  {
    level: 1,
    title: "The Beginning",
    subtitle: "Every journey starts with a single step",
    description: "You've chosen to walk the path of wisdom. That choice itself is profound.",
    minXp: 0,
    maxXp: 100,
    virtue: 'courage',
    unlockMessage: "You've taken the first step. Most people never do.",
  },
  {
    level: 2,
    title: "The Questioning",
    subtitle: "Wisdom begins in wonder",
    description: "You're asking the questions that matter. This is where growth begins.",
    minXp: 100,
    maxXp: 250,
    virtue: 'wisdom',
    unlockMessage: "You're learning to question what you once accepted without thought.",
  },
  {
    level: 3,
    title: "The Practicing",
    subtitle: "Knowledge without practice is sterile",
    description: "You're moving from knowing to doing. This is where philosophy becomes life.",
    minXp: 250,
    maxXp: 500,
    virtue: 'temperance',
    unlockMessage: "You're no longer just learning - you're practicing.",
  },
  {
    level: 4,
    title: "The Deepening",
    subtitle: "The unexamined life is not worth living",
    description: "Your reflections are becoming richer. You're seeing patterns in yourself.",
    minXp: 500,
    maxXp: 850,
    virtue: 'wisdom',
    unlockMessage: "Your self-awareness is deepening. You see yourself more clearly now.",
  },
  {
    level: 5,
    title: "The Integrating",
    subtitle: "Making philosophy a way of life",
    description: "The lessons are becoming part of who you are, not just what you know.",
    minXp: 850,
    maxXp: 1300,
    virtue: 'temperance',
    unlockMessage: "The wisdom is becoming woven into your daily life.",
  },
  {
    level: 6,
    title: "The Living",
    subtitle: "Be the change you wish to see",
    description: "You don't just know these truths - you live them. Others notice.",
    minXp: 1300,
    maxXp: 1900,
    virtue: 'justice',
    unlockMessage: "You're not just studying philosophy. You're living it.",
  },
  {
    level: 7,
    title: "The Guiding",
    subtitle: "The best way to learn is to teach",
    description: "Your journey now lights the way for others. Your growth ripples outward.",
    minXp: 1900,
    maxXp: 2700,
    virtue: 'justice',
    unlockMessage: "Your journey is becoming a light for others to follow.",
  },
  {
    level: 8,
    title: "The Embodying",
    subtitle: "You become what you practice",
    description: "The boundaries between you and the wisdom have blurred. This is who you are.",
    minXp: 2700,
    maxXp: 3800,
    virtue: 'wisdom',
    unlockMessage: "You don't just practice wisdom. You embody it.",
  },
  {
    level: 9,
    title: "The Transcending",
    subtitle: "Beyond the self",
    description: "Your practice has taken you beyond ordinary concerns. A rare achievement.",
    minXp: 3800,
    maxXp: 5200,
    virtue: 'courage',
    unlockMessage: "You've transcended the ordinary. Few reach this place.",
  },
  {
    level: 10,
    title: "The Complete",
    subtitle: "The path and the walker are one",
    description: "There is no longer a path to walk - you are the path. Complete integration.",
    minXp: 5200,
    maxXp: Infinity,
    virtue: 'wisdom',
    unlockMessage: "The journey and the traveler have become one.",
  },
];

// ============================================================================
// PERSONALIZED REWARD MESSAGES
// ============================================================================
// These acknowledge the person, not just the action

// Deterministic hash helper
function getStableIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) % length;
}

export function getCompletionMessage(name: string | null, lessonTitle: string, streak: number): string {
  const messages = [
    `You showed up today${name ? `, ${name}` : ''}. That's what matters most.`,
    `Another step forward${name ? `, ${name}` : ''}. This is how transformation happens.`,
    `${name ? `${name}, you` : 'You'} chose growth today. That choice compounds.`,
    `The work you just did${name ? `, ${name}` : ''} - it matters. Even when it doesn't feel like it.`,
    `${name ? `${name}, this` : 'This'} quiet moment of practice is building something extraordinary.`,
  ];

  // Add streak-specific messages
  if (streak >= 30) {
    return `${name ? `${name}, ` : ''}${streak} days of choosing yourself. That's not discipline - that's devotion.`;
  } else if (streak >= 14) {
    return `${name ? `${name}, ` : ''}Two weeks of consistency. You're proving who you're becoming.`;
  } else if (streak >= 7) {
    return `${name ? `${name}, ` : ''}A full week of showing up. The habit is taking root.`;
  }

  // Use deterministic selection based on lesson title
  const index = getStableIndex(lessonTitle, messages.length);
  return messages[index];
}

export function getStreakMessage(streak: number): { title: string; subtitle: string } {
  if (streak === 1) {
    return {
      title: "Day One",
      subtitle: "Every journey begins here"
    };
  } else if (streak < 7) {
    return {
      title: `${streak} Days`,
      subtitle: "Building momentum"
    };
  } else if (streak === 7) {
    return {
      title: "One Week",
      subtitle: "The habit is forming"
    };
  } else if (streak < 14) {
    return {
      title: `${streak} Days`,
      subtitle: "Consistency is taking hold"
    };
  } else if (streak === 14) {
    return {
      title: "Two Weeks",
      subtitle: "This is who you're becoming"
    };
  } else if (streak < 21) {
    return {
      title: `${streak} Days`,
      subtitle: "Commitment deepening"
    };
  } else if (streak === 21) {
    return {
      title: "Three Weeks",
      subtitle: "They say this forges habits"
    };
  } else if (streak < 30) {
    return {
      title: `${streak} Days`,
      subtitle: "Remarkable dedication"
    };
  } else if (streak === 30) {
    return {
      title: "One Month",
      subtitle: "You've changed"
    };
  } else if (streak < 60) {
    return {
      title: `${streak} Days`,
      subtitle: "Extraordinary commitment"
    };
  } else if (streak < 90) {
    return {
      title: `${streak} Days`,
      subtitle: "This is rare. You are rare."
    };
  } else if (streak < 180) {
    return {
      title: `${streak} Days`,
      subtitle: "A testament to your will"
    };
  } else if (streak < 365) {
    return {
      title: `${streak} Days`,
      subtitle: "Approaching a year of transformation"
    };
  } else {
    return {
      title: `${streak} Days`,
      subtitle: "You've built something permanent"
    };
  }
}

// ============================================================================
// LEVEL HELPERS
// ============================================================================

export function getGrowthLevel(xp: number): GrowthLevel {
  return GROWTH_LEVELS.find(l => xp >= l.minXp && xp < l.maxXp) || GROWTH_LEVELS[GROWTH_LEVELS.length - 1];
}

export function getGrowthProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getGrowthLevel(xp);
  if (level.maxXp === Infinity) {
    return { current: xp - level.minXp, needed: 0, percentage: 100 };
  }
  const current = xp - level.minXp;
  const needed = level.maxXp - level.minXp;
  const percentage = Math.min((current / needed) * 100, 100);
  return { current, needed, percentage };
}

// ============================================================================
// WISDOM PICKER (Deterministic based on seed)
// ============================================================================

export function getRandomQuote(category: keyof typeof WISDOM_QUOTES, seed?: string): { text: string; author: string } {
  const quotes = WISDOM_QUOTES[category];
  // Use deterministic selection if seed provided, otherwise use category + current date for daily variation
  const effectiveSeed = seed || `${category}-${new Date().toISOString().split('T')[0]}`;
  const index = getStableIndex(effectiveSeed, quotes.length);
  return quotes[index];
}

// ============================================================================
// TIME SPENT CALCULATION
// ============================================================================

export function formatTimeSpent(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  return hours === 1 ? `1 hour ${remainingMinutes}m` : `${hours} hours ${remainingMinutes}m`;
}
