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
  // ═══════════════════════════════════════════════════════════════════════════
  // MODERN WISDOM SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════

  // Lesson 1: The Instant Reframe
  {
    lessonId: 'modern-1-instant-reframe',
    coreConceptTag: 'control',
    scenario: "Your flight has been delayed by 3 hours. Other passengers are yelling at the gate agent. You feel your frustration rising.",
    question: "Is the weather delay within your control? Is your reaction within your control?",
    reflectionPrompt: "How did applying the dichotomy of control change how you feel about this scenario?",
    xpReward: 10,
  },
  {
    lessonId: 'modern-1-instant-reframe',
    coreConceptTag: 'control',
    scenario: "You submitted your best work, but your manager gave the credit to someone else in the team meeting.",
    question: "What specific action can you take right now? If none, what must you accept?",
    reflectionPrompt: "What energy is saved by focusing only on your response?",
    xpReward: 10,
  },

  // Lesson 2: The Power of Tiny
  {
    lessonId: 'modern-2-power-of-tiny',
    coreConceptTag: 'habits',
    scenario: "You want to start reading more, but you 'don't have time' for an hour of reading.",
    question: "What is the 2-minute version of this habit? Can you read one page?",
    reflectionPrompt: "Why does the tiny version feel 'too small' to count? Challenge that thought.",
    xpReward: 10,
  },
  {
    lessonId: 'modern-2-power-of-tiny',
    coreConceptTag: 'habits',
    scenario: "You've missed the gym for 3 weeks. The idea of a full workout feels overwhelming.",
    question: "What is the 1% version? Can you do 5 pushups right now?",
    reflectionPrompt: "How does lowering the bar actually help you jump over it?",
    xpReward: 10,
  },

  // Lesson 3: The Hidden Gift (Obstacles)
  {
    lessonId: 'modern-3-obstacle-opportunity',
    coreConceptTag: 'obstacles',
    scenario: "You didn't get the funding for your project. It feels like a dead end.",
    question: "How could this specific 'no' force you to create a better model?",
    reflectionPrompt: "What did this obstacle teach you that success never could?",
    xpReward: 10,
  },
  {
    lessonId: 'modern-3-obstacle-opportunity',
    coreConceptTag: 'obstacles',
    scenario: "A difficult client is making your life miserable with constant changes.",
    question: "What skill is this person forcing you to master?",
    reflectionPrompt: "How is this person an accidental teacher?",
    xpReward: 10,
  },

  // Lesson 4: Own Your Morning
  {
    lessonId: 'modern-4-morning-mindset',
    coreConceptTag: 'preparation',
    scenario: "You have a high-stakes presentation this afternoon. You wake up feeling anxious.",
    question: "Pre-accept the nervousness. How do you WANT to respond when it hits?",
    reflectionPrompt: "How does expecting the challenge change your relationship to it?",
    xpReward: 10,
  },

  // Lesson 5: The Gratitude Shift
  {
    lessonId: 'modern-5-gratitude-shift',
    coreConceptTag: 'gratitude',
    scenario: "You're frustrated with your partner's messy habits.",
    question: "Imagine they were gone tomorrow. Would you miss the mess?",
    reflectionPrompt: "How does the lens of loss clarify what matters?",
    xpReward: 10,
  },

  // Lesson 6: The Comeback Formula
  {
    lessonId: 'modern-6-comeback-formula',
    coreConceptTag: 'resilience',
    scenario: "You failed a public commitment. The shame is keeping you hidden.",
    question: "Feel it fully for 60 seconds. Then: what is the 48-hour comeback plan?",
    reflectionPrompt: "What is the difference between wallowing and processing?",
    xpReward: 10,
  },

  // Lesson 7: Embrace the Struggle
  {
    lessonId: 'modern-7-embrace-struggle',
    coreConceptTag: 'discomfort',
    scenario: "You have a choice: take the easy route or the hard one that teaches you more.",
    question: "Which path builds the muscle you want to have next year?",
    reflectionPrompt: "Why do we fear the very thing that makes us strong?",
    xpReward: 10,
  },

  // Lesson 8: Fear-Setting
  {
    lessonId: 'modern-8-fear-setting',
    coreConceptTag: 'fear',
    scenario: "You want to quit your job to start a business, but you're paralyzed.",
    question: "Define the absolute worst case. Is it survivable?",
    reflectionPrompt: "What is the hidden cost of inaction?",
    xpReward: 10,
  },

  // Lesson 9: The Antifragile Mind
  {
    lessonId: 'modern-9-antifragile-mind',
    coreConceptTag: 'antifragile',
    scenario: "Everything is chaotic at work. Plans are changing hourly.",
    question: "How can you not just survive this chaos, but gain from it?",
    reflectionPrompt: "What systems grow stronger under stress?",
    xpReward: 10,
  },

  // Lesson 10: Letter to Future Self
  {
    lessonId: 'modern-10-future-self',
    coreConceptTag: 'vision',
    scenario: "You're tempted to compromise your values for a quick win.",
    question: "What would your future self—one year from now—say about this choice?",
    reflectionPrompt: "Who are you becoming with this decision?",
    xpReward: 10,
  },

  // Lesson 11: The Mirror Effect
  {
    lessonId: 'modern-11-mirror-effect',
    coreConceptTag: 'projection',
    scenario: "Someone's arrogance is driving you crazy.",
    question: "Where does arrogance live in you? Or the fear of it?",
    reflectionPrompt: "The world is a mirror. What are you seeing?",
    xpReward: 10,
  },

  // Lesson 12: Radical Honesty
  {
    lessonId: 'modern-12-radical-honesty',
    coreConceptTag: 'honesty',
    scenario: "You're about to tell a small white lie to avoid an awkward moment.",
    question: "What prison are you building with this small brick?",
    reflectionPrompt: "What is the price of keeping up appearances?",
    xpReward: 10,
  },

  // Lesson 13: Boundaries with Grace
  {
    lessonId: 'modern-13-boundaries-grace',
    coreConceptTag: 'boundaries',
    scenario: "A friend asks for a favor you don't have the energy to give.",
    question: "Can you say no clearly, without over-explaining or apologizing?",
    reflectionPrompt: "Why does protecting your energy feel like selfishness?",
    xpReward: 10,
  },

  // Lesson 14: The Empathy Shift
  {
    lessonId: 'modern-14-empathy-shift',
    coreConceptTag: 'empathy',
    scenario: "You're in a heated argument. You know you're right.",
    question: "Stop. Can you articulate their position so well they say 'that's exactly it'?",
    reflectionPrompt: "What happens when you seek to understand before being understood?",
    xpReward: 10,
  },

  // Lesson 15: Forgiveness is Freedom
  {
    lessonId: 'modern-15-forgiveness-freedom',
    coreConceptTag: 'forgiveness',
    scenario: "An old memory of betrayal surfaces. You feel the anger fresh again.",
    question: "Who is drinking the poison right now? You or them?",
    reflectionPrompt: "What would you do with the energy you're using to hold this grudge?",
    xpReward: 10,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STOICISM SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════

  // Lesson 1: Dichotomy of Control
  {
    lessonId: 'stoic-1-dichotomy-control',
    coreConceptTag: 'control',
    scenario: "The weather ruins your outdoor event plans.",
    question: "Is this within your control?",
    reflectionPrompt: "How much suffering comes from fighting reality?",
    xpReward: 10,
  },

  // Lesson 2: Perception is Everything
  {
    lessonId: 'stoic-2-perception-everything',
    coreConceptTag: 'perception',
    scenario: "Someone insults you online.",
    question: "Is the insult painful, or is it your judgment about the insult?",
    reflectionPrompt: "Facts vs Stories. Can you separate them?",
    xpReward: 10,
  },

  // Lesson 3: The View From Above
  {
    lessonId: 'stoic-3-view-from-above',
    coreConceptTag: 'perspective',
    scenario: "You're stressed about a deadline.",
    question: "Zoom out to earth orbit. Zoom forward 100 years. Where is this deadline?",
    reflectionPrompt: "Does this matter to the cosmos?",
    xpReward: 10,
  },

  // Lesson 4: Morning Preparation
  {
    lessonId: 'stoic-4-morning-preparation',
    coreConceptTag: 'preparation',
    scenario: "You wake up hoping for an easy day.",
    question: "Instead, anticipate the difficulties. How will you meet them?",
    reflectionPrompt: "Why is an expected blow lighter than an unexpected one?",
    xpReward: 10,
  },

  // Lesson 5: Removing Judgment
  {
    lessonId: 'stoic-5-removing-judgment',
    coreConceptTag: 'judgment',
    scenario: "You lose your wallet. You think 'This is a disaster'.",
    question: "Describe it neutrally: 'I placed my wallet somewhere and cannot find it.'",
    reflectionPrompt: "Where did the 'disaster' quality come from?",
    xpReward: 10,
  },

  // Lesson 6: Do The Work
  {
    lessonId: 'stoic-6-do-the-work',
    coreConceptTag: 'action',
    scenario: "You know you should exercise, but you're just thinking about it.",
    question: "Stop thinking. Move your body. Now.",
    reflectionPrompt: "What is the gap between philosophy and action?",
    xpReward: 10,
  },

  // Lesson 7: The Obstacle Is The Way
  {
    lessonId: 'stoic-7-obstacle-way',
    coreConceptTag: 'obstacles',
    scenario: "You get rejected from a job you wanted.",
    question: "How does this rejection point the way to a better path?",
    reflectionPrompt: "The impediment to action advances action.",
    xpReward: 10,
  },

  // Lesson 8: Reserve Clause
  {
    lessonId: 'stoic-8-reserve-clause',
    coreConceptTag: 'reserve-clause',
    scenario: "You're working hard on a presentation, desperate for approval.",
    question: "Add the clause: 'I will do my best, if nothing prevents me.'",
    reflectionPrompt: "Can you commit fully without attaching to the outcome?",
    xpReward: 10,
  },

  // Lesson 9: Act Immediately
  {
    lessonId: 'stoic-9-act-immediately',
    coreConceptTag: 'focus',
    scenario: "You're checking your phone while talking to a friend.",
    question: "Where is your attention? Bring it back fully.",
    reflectionPrompt: "How much life do we miss by being half-present?",
    xpReward: 10,
  },

  // Lesson 10: Voluntary Discomfort
  {
    lessonId: 'stoic-10-voluntary-discomfort',
    coreConceptTag: 'discomfort',
    scenario: "You're hungry but dinner is an hour away.",
    question: "Don't snack. Observe the hunger. Can you handle it?",
    reflectionPrompt: "Is this the condition I feared?",
    xpReward: 10,
  },

  // Lesson 11: Amor Fati
  {
    lessonId: 'stoic-11-amor-fati',
    coreConceptTag: 'amor-fati',
    scenario: "You get stuck in traffic and will be late.",
    question: "Don't just accept it. Love it. This is your life right now.",
    reflectionPrompt: "What happens when you stop arguing with reality?",
    xpReward: 10,
  },

  // Lesson 12: Memento Mori
  {
    lessonId: 'stoic-12-memento-mori',
    coreConceptTag: 'memento-mori',
    scenario: "You're angry about a petty household chore.",
    question: "If this were your last day on earth, would you care?",
    reflectionPrompt: "Death strips away the inessential.",
    xpReward: 10,
  },

  // Lesson 13: Premeditatio Malorum
  {
    lessonId: 'stoic-13-premeditatio-malorum',
    coreConceptTag: 'negative-visualization',
    scenario: "You're worried about money.",
    question: "Imagine you lost it all. Could you survive? Yes.",
    reflectionPrompt: "The fear is often worse than the reality.",
    xpReward: 10,
  },

  // Lesson 14: Eternal Recurrence
  {
    lessonId: 'stoic-14-eternal-recurrence',
    coreConceptTag: 'eternal-recurrence',
    scenario: "You're bored and scrolling aimlessly.",
    question: "If you had to live this moment forever, would you choose this?",
    reflectionPrompt: "Live so you would wish for the eternal return.",
    xpReward: 10,
  },

  // Lesson 15: Inner Citadel
  {
    lessonId: 'stoic-15-inner-citadel',
    coreConceptTag: 'inner-citadel',
    scenario: "The news is terrifying. People are panicking.",
    question: "Retreat to your inner fortress. What is safe there?",
    reflectionPrompt: "The mind can be a place of peace in a world of war.",
    xpReward: 10,
  },
];

// Get random practice scenarios for completed lessons
export function getPracticeScenarios(completedLessonIds: string[], count: number = 3): PracticeScenario[] {
  const availableScenarios = PRACTICE_SCENARIOS.filter(s =>
    completedLessonIds.includes(s.lessonId)
  );

  // If no available scenarios match completed lessons, fallback to generic or unlocked ones
  // or return empty (UI handles empty state)
  if (availableScenarios.length === 0) return [];

  // Shuffle and take requested count
  const shuffled = [...availableScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get scenarios for a specific lesson
export function getScenariosForLesson(lessonId: string): PracticeScenario[] {
  return PRACTICE_SCENARIOS.filter(s => s.lessonId === lessonId);
}

export default PRACTICE_SCENARIOS;
