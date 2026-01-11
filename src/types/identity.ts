// ============================================
// PHASE 3: IDENTITY TRANSFORMATION SYSTEM
// ============================================

export interface IdentityStatement {
  id: string;
  statement: string; // The "I am someone who..." statement
  createdAt: string; // ISO date string
  context: IdentityContext; // What triggered this identity claim
  tags: string[]; // Related concepts (e.g., "discipline", "patience")
}

export interface IdentityContext {
  type: 'milestone' | 'lesson' | 'reflection' | 'manual';
  trigger: string; // e.g., "7-day-streak", "lesson-xyz", "manual"
  description: string; // Human-readable context
}

// Prompts to help users create identity statements
export interface IdentityPrompt {
  id: string;
  prompt: string;
  category: 'character' | 'habit' | 'mindset' | 'relationship' | 'growth';
  example: string;
}

export const IDENTITY_PROMPTS: IdentityPrompt[] = [
  // Character traits
  {
    id: 'character-calm',
    prompt: "When facing chaos, I am someone who...",
    category: 'character',
    example: "I am someone who stays calm when others panic",
  },
  {
    id: 'character-discipline',
    prompt: "When temptation strikes, I am someone who...",
    category: 'character',
    example: "I am someone who chooses long-term gains over short-term pleasure",
  },
  {
    id: 'character-courage',
    prompt: "When fear appears, I am someone who...",
    category: 'character',
    example: "I am someone who acts despite fear, not in its absence",
  },
  {
    id: 'character-integrity',
    prompt: "When no one is watching, I am someone who...",
    category: 'character',
    example: "I am someone who keeps their word even when it's inconvenient",
  },

  // Habits
  {
    id: 'habit-daily',
    prompt: "Every day, without fail, I am someone who...",
    category: 'habit',
    example: "I am someone who reflects on their day before sleeping",
  },
  {
    id: 'habit-morning',
    prompt: "Before the world wakes up, I am someone who...",
    category: 'habit',
    example: "I am someone who invests in themselves every morning",
  },
  {
    id: 'habit-consistency',
    prompt: "Even when motivation fades, I am someone who...",
    category: 'habit',
    example: "I am someone who shows up regardless of how they feel",
  },

  // Mindset
  {
    id: 'mindset-growth',
    prompt: "When I fail, I am someone who...",
    category: 'mindset',
    example: "I am someone who sees failure as feedback, not finality",
  },
  {
    id: 'mindset-gratitude',
    prompt: "When facing what I have, I am someone who...",
    category: 'mindset',
    example: "I am someone who appreciates what is, not what could be",
  },
  {
    id: 'mindset-present',
    prompt: "In this moment, I am someone who...",
    category: 'mindset',
    example: "I am someone who lives fully in the present",
  },

  // Relationships
  {
    id: 'relationship-others',
    prompt: "When dealing with difficult people, I am someone who...",
    category: 'relationship',
    example: "I am someone who responds with patience, not reaction",
  },
  {
    id: 'relationship-listen',
    prompt: "When others speak, I am someone who...",
    category: 'relationship',
    example: "I am someone who listens to understand, not to respond",
  },

  // Growth
  {
    id: 'growth-learning',
    prompt: "When challenged, I am someone who...",
    category: 'growth',
    example: "I am someone who embraces discomfort as a teacher",
  },
  {
    id: 'growth-change',
    prompt: "When change comes, I am someone who...",
    category: 'growth',
    example: "I am someone who adapts while staying true to their values",
  },
];

// Milestones that trigger identity prompts
export interface IdentityMilestone {
  id: string;
  trigger: {
    type: 'streak' | 'lessons' | 'reflections' | 'achievement';
    value: number | string;
  };
  promptMessage: string;
  suggestedPrompt?: string;
}

export const IDENTITY_MILESTONES: IdentityMilestone[] = [
  {
    id: 'first-lesson',
    trigger: { type: 'lessons', value: 1 },
    promptMessage: "You took your first step. Who is the person who takes that first step?",
    suggestedPrompt: "I am someone who begins, even when the path is unclear",
  },
  {
    id: 'streak-7',
    trigger: { type: 'streak', value: 7 },
    promptMessage: "A week of showing up. What does that say about who you are?",
    suggestedPrompt: "I am someone who honors my commitments to myself",
  },
  {
    id: 'lessons-10',
    trigger: { type: 'lessons', value: 10 },
    promptMessage: "10 lessons of wisdom. You're becoming a student of life.",
    suggestedPrompt: "I am someone who invests in my own growth",
  },
  {
    id: 'streak-21',
    trigger: { type: 'streak', value: 21 },
    promptMessage: "21 days - they say this builds habits. But you're building identity.",
    suggestedPrompt: "I am someone who keeps promises to themselves",
  },
  {
    id: 'streak-30',
    trigger: { type: 'streak', value: 30 },
    promptMessage: "A full month. This is no longer what you do - it's who you are.",
    suggestedPrompt: "I am someone who shows up every single day",
  },
  {
    id: 'reflections-25',
    trigger: { type: 'reflections', value: 25 },
    promptMessage: "25 reflections. You've built a practice of self-examination.",
    suggestedPrompt: "I am someone who examines their life with honesty",
  },
  {
    id: 'streak-60',
    trigger: { type: 'streak', value: 60 },
    promptMessage: "60 days of practice. You are discipline embodied.",
    suggestedPrompt: "I am someone who has mastered consistency",
  },
  {
    id: 'streak-90',
    trigger: { type: 'streak', value: 90 },
    promptMessage: "A quarter year. You are proof that transformation is possible.",
    suggestedPrompt: "I am someone who proves what's possible through action",
  },
];

// Get a random identity prompt from a category
export function getRandomIdentityPrompt(category?: IdentityPrompt['category']): IdentityPrompt {
  const prompts = category
    ? IDENTITY_PROMPTS.filter(p => p.category === category)
    : IDENTITY_PROMPTS;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Check if an identity milestone has been triggered
export function getTriggeredMilestone(
  streak: number,
  lessons: number,
  reflections: number,
  existingStatements: IdentityStatement[]
): IdentityMilestone | null {
  // Get IDs of milestones we've already prompted for
  const triggeredMilestoneIds = existingStatements
    .filter(s => s.context.type === 'milestone')
    .map(s => s.context.trigger);

  // Find the first untriggered milestone that matches current progress
  for (const milestone of IDENTITY_MILESTONES) {
    if (triggeredMilestoneIds.includes(milestone.id)) continue;

    const { type, value } = milestone.trigger;
    let triggered = false;

    switch (type) {
      case 'streak':
        triggered = streak >= (value as number);
        break;
      case 'lessons':
        triggered = lessons >= (value as number);
        break;
      case 'reflections':
        triggered = reflections >= (value as number);
        break;
    }

    if (triggered) return milestone;
  }

  return null;
}

export function getCategoryLabel(category: IdentityPrompt['category']): string {
  switch (category) {
    case 'character': return 'Character';
    case 'habit': return 'Daily Habits';
    case 'mindset': return 'Mindset';
    case 'relationship': return 'Relationships';
    case 'growth': return 'Growth';
  }
}

export function getCategoryIcon(category: IdentityPrompt['category']): string {
  switch (category) {
    case 'character': return '🦁';
    case 'habit': return '🔄';
    case 'mindset': return '🧠';
    case 'relationship': return '🤝';
    case 'growth': return '🌱';
  }
}
