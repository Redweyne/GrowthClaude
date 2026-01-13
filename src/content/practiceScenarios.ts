// Practice scenarios for spaced repetition
// These resurface lessons in new, real-world contexts

export interface PracticeScenario {
  lessonId: string;
  coreConceptTag: string;
  scenario: string;
  question: string;
  reflectionPrompt: string;
  xpReward: number;
}

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  // Dichotomy of Control
  {
    lessonId: 'lesson-1',
    coreConceptTag: 'control',
    scenario: "Your flight has been delayed by 3 hours. Other passengers are yelling at the gate agent. You feel your frustration rising.",
    question: "What is within your control in this situation? What isn't?",
    reflectionPrompt: "How did applying the dichotomy of control change how you feel about this scenario?",
    xpReward: 10,
  },
  {
    lessonId: 'lesson-1',
    coreConceptTag: 'control',
    scenario: "You submitted your best work on a project, but your manager gave the credit to someone else in the team meeting.",
    question: "Apply the dichotomy: What can you control here? What must you accept?",
    reflectionPrompt: "What action, if any, would be worth taking? What would be wasted energy?",
    xpReward: 10,
  },
  {
    lessonId: 'lesson-1',
    coreConceptTag: 'control',
    scenario: "You've been trying to help a friend change a destructive habit, but they keep falling back into it despite your efforts.",
    question: "What is truly within your control when trying to help others?",
    reflectionPrompt: "How does accepting the limits of your influence feel?",
    xpReward: 10,
  },

  // Perception is Everything
  {
    lessonId: 'lesson-2',
    coreConceptTag: 'perception',
    scenario: "A colleague sends you a curt, one-line email response to a question you spent 20 minutes carefully writing.",
    question: "What's your first interpretation? Now, what are two alternative interpretations?",
    reflectionPrompt: "Which interpretation serves you better? Why do we default to the negative?",
    xpReward: 10,
  },
  {
    lessonId: 'lesson-2',
    coreConceptTag: 'perception',
    scenario: "You overhear two coworkers laughing right after you walk by. They stop when they see you.",
    question: "Notice your first thought. Now challenge it: What else could explain this?",
    reflectionPrompt: "How much of our suffering comes from stories we tell ourselves?",
    xpReward: 10,
  },

  // View From Above
  {
    lessonId: 'lesson-3',
    coreConceptTag: 'perspective',
    scenario: "You just made an embarrassing mistake in front of your entire team during a presentation.",
    question: "Zoom out: How important will this be in one week? One year? Ten years?",
    reflectionPrompt: "What shifted when you took the long view?",
    xpReward: 10,
  },
  {
    lessonId: 'lesson-3',
    coreConceptTag: 'perspective',
    scenario: "You're stuck in traffic and will be late to an important meeting. Your stress is building.",
    question: "Rise above: From space, what does this moment look like? What actually matters?",
    reflectionPrompt: "How can the cosmic perspective become a daily tool?",
    xpReward: 10,
  },

  // Morning Preparation
  {
    lessonId: 'lesson-4',
    coreConceptTag: 'preparation',
    scenario: "You're about to start a challenging day: back-to-back meetings, a difficult conversation with your boss, and a deadline.",
    question: "What difficulties should you expect today? How will you respond to each with grace?",
    reflectionPrompt: "How does pre-accepting challenges change your relationship with them?",
    xpReward: 10,
  },

  // Removing Judgment
  {
    lessonId: 'lesson-5',
    coreConceptTag: 'judgment',
    scenario: "Someone cuts you off aggressively in traffic, nearly causing an accident.",
    question: "Describe what happened using only neutral facts. No judgments, no story.",
    reflectionPrompt: "What's the difference between 'that jerk cut me off' and 'a car changed lanes in front of me'?",
    xpReward: 10,
  },

  // Do The Work
  {
    lessonId: 'lesson-6',
    coreConceptTag: 'action',
    scenario: "You've been thinking about starting a side project for months. Every weekend you plan to begin, but don't.",
    question: "What is the smallest possible action you could take in the next 5 minutes?",
    reflectionPrompt: "What stops us from acting? What does it feel like to simply begin?",
    xpReward: 10,
  },

  // Obstacle is the Way
  {
    lessonId: 'lesson-7',
    coreConceptTag: 'obstacles',
    scenario: "You didn't get the promotion you were counting on. Someone with less experience got it instead.",
    question: "How could this obstacle become your advantage? What opportunity is hidden here?",
    reflectionPrompt: "What would it mean to truly embrace this setback as fuel?",
    xpReward: 10,
  },
  {
    lessonId: 'lesson-7',
    coreConceptTag: 'obstacles',
    scenario: "Your startup's main product just failed publicly. Users are complaining on social media.",
    question: "What does this failure teach you that success never could?",
    reflectionPrompt: "How do you turn public failure into private growth?",
    xpReward: 10,
  },

  // Reserve Clause
  {
    lessonId: 'lesson-8',
    coreConceptTag: 'reserve-clause',
    scenario: "You're preparing for a job interview at your dream company next week.",
    question: "How do you give 100% effort while holding the outcome loosely?",
    reflectionPrompt: "What's the difference between attachment and commitment?",
    xpReward: 10,
  },

  // Act Immediately
  {
    lessonId: 'lesson-9',
    coreConceptTag: 'focus',
    scenario: "You sit down to do important work. Within 2 minutes, you've checked your phone twice.",
    question: "What would total presence look like for the next 10 minutes?",
    reflectionPrompt: "What pulls us away from presence? What brings us back?",
    xpReward: 10,
  },

  // Voluntary Discomfort
  {
    lessonId: 'lesson-10',
    coreConceptTag: 'discomfort',
    scenario: "You have the option to take a cold shower this morning or a warm one. You always choose warm.",
    question: "What would choosing discomfort teach you about yourself?",
    reflectionPrompt: "How does voluntary hardship prepare you for involuntary hardship?",
    xpReward: 10,
  },

  // Amor Fati
  {
    lessonId: 'lesson-11',
    coreConceptTag: 'amor-fati',
    scenario: "You just learned that a project you spent 6 months on is being cancelled due to budget cuts.",
    question: "What would it mean to not just accept this, but to embrace it as necessary?",
    reflectionPrompt: "Can you find a way to say 'this had to happen exactly this way'?",
    xpReward: 10,
  },

  // Memento Mori
  {
    lessonId: 'lesson-12',
    coreConceptTag: 'memento-mori',
    scenario: "You're scrolling social media, mildly bored, killing time on a Sunday afternoon.",
    question: "If you had one year left, would you spend this hour this way?",
    reflectionPrompt: "What does death teach us about how to spend our limited time?",
    xpReward: 10,
  },

  // Premeditatio Malorum
  {
    lessonId: 'lesson-13',
    coreConceptTag: 'negative-visualization',
    scenario: "You're anxious about a presentation you have to give next week.",
    question: "Visualize the worst case in full detail. You freeze, forget your words, people laugh. Now: could you survive that?",
    reflectionPrompt: "How did looking directly at your fear change it?",
    xpReward: 10,
  },

  // Eternal Recurrence
  {
    lessonId: 'lesson-14',
    coreConceptTag: 'eternal-recurrence',
    scenario: "It's a typical Tuesday. Nothing special planned. You'll work, eat, sleep.",
    question: "If this exact day repeated forever, what one thing would you change right now?",
    reflectionPrompt: "What does the eternal recurrence reveal about how you want to live?",
    xpReward: 10,
  },

  // Inner Citadel
  {
    lessonId: 'lesson-15',
    coreConceptTag: 'inner-citadel',
    scenario: "Everyone around you is panicking about a crisis at work. The energy is chaotic and fearful.",
    question: "Can you find your inner citadel right now? What does it feel like to retreat there?",
    reflectionPrompt: "How do you maintain inner peace when external chaos surrounds you?",
    xpReward: 10,
  },
];

// Get random practice scenarios for completed lessons
export function getPracticeScenarios(completedLessonIds: string[], count: number = 3): PracticeScenario[] {
  const availableScenarios = PRACTICE_SCENARIOS.filter(s =>
    completedLessonIds.includes(s.lessonId)
  );

  // Shuffle and take requested count
  const shuffled = [...availableScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get scenarios for a specific lesson
export function getScenariosForLesson(lessonId: string): PracticeScenario[] {
  return PRACTICE_SCENARIOS.filter(s => s.lessonId === lessonId);
}

export default PRACTICE_SCENARIOS;
