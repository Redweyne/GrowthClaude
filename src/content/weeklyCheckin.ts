// Weekly check-in prompts for self-reflection and growth tracking

export interface CheckinPrompt {
  id: string;
  category: 'progress' | 'challenges' | 'insights' | 'intentions';
  prompt: string;
  followUp?: string;
}

export const CHECKIN_PROMPTS: CheckinPrompt[] = [
  // Progress reflection
  {
    id: 'progress-1',
    category: 'progress',
    prompt: "What moment this week are you most proud of?",
    followUp: "How did your learning contribute to that moment?",
  },
  {
    id: 'progress-2',
    category: 'progress',
    prompt: "When did you catch yourself applying something you learned?",
    followUp: "What was different about how you responded?",
  },
  {
    id: 'progress-3',
    category: 'progress',
    prompt: "What's one way you showed up differently this week?",
    followUp: "How did that feel?",
  },

  // Challenges faced
  {
    id: 'challenges-1',
    category: 'challenges',
    prompt: "What was your biggest challenge this week?",
    followUp: "How might your learning help you face it?",
  },
  {
    id: 'challenges-2',
    category: 'challenges',
    prompt: "When did you struggle to apply what you've learned?",
    followUp: "What got in the way? What might help next time?",
  },
  {
    id: 'challenges-3',
    category: 'challenges',
    prompt: "What situation tested your patience or peace this week?",
    followUp: "Looking back, what would the wisest version of you have done?",
  },

  // Key insights
  {
    id: 'insights-1',
    category: 'insights',
    prompt: "What did you learn about yourself this week?",
    followUp: "How will you use this self-knowledge?",
  },
  {
    id: 'insights-2',
    category: 'insights',
    prompt: "What truth became clearer to you this week?",
    followUp: "How does this change how you see things?",
  },
  {
    id: 'insights-3',
    category: 'insights',
    prompt: "What pattern did you notice in your thoughts or actions?",
    followUp: "Is this serving you? What might you change?",
  },

  // Future intentions
  {
    id: 'intentions-1',
    category: 'intentions',
    prompt: "What's one thing you want to practice more next week?",
    followUp: "How will you create opportunities to practice it?",
  },
  {
    id: 'intentions-2',
    category: 'intentions',
    prompt: "What habit do you want to strengthen in the coming week?",
    followUp: "What's the smallest step you can take tomorrow?",
  },
  {
    id: 'intentions-3',
    category: 'intentions',
    prompt: "Who in your life might benefit from what you've learned?",
    followUp: "How might you share this wisdom with them?",
  },
];

// Get a random prompt from each category
export function getWeeklyCheckinPrompts(): CheckinPrompt[] {
  const categories: Array<'progress' | 'challenges' | 'insights' | 'intentions'> = [
    'progress',
    'challenges',
    'insights',
    'intentions'
  ];

  return categories.map(category => {
    const prompts = CHECKIN_PROMPTS.filter(p => p.category === category);
    return prompts[Math.floor(Math.random() * prompts.length)];
  });
}

// Mentor closing messages for weekly check-in
export const CHECKIN_MENTOR_MESSAGES = [
  "Your commitment to reflection is itself a form of growth. The unexamined life may not be worth living, but you are living fully.",
  "This weekly pause creates space for wisdom to settle. You're not just learning—you're becoming.",
  "Most people rush through life without stopping to reflect. You're doing the work that matters.",
  "Self-awareness is the foundation of all change. You're building something lasting.",
  "Another week of intentional growth. The compound effect of these reflections will transform you.",
  "Remember: progress isn't always visible in the moment. Trust the process you've committed to.",
];

export function getRandomCheckinMessage(): string {
  return CHECKIN_MENTOR_MESSAGES[Math.floor(Math.random() * CHECKIN_MENTOR_MESSAGES.length)];
}

export interface CheckinResponse {
  promptId: string;
  mainResponse: string;
  followUpResponse?: string;
}

export interface WeeklyCheckin {
  id: string;
  date: string;
  weekNumber: number;
  responses: CheckinResponse[];
  xpEarned: number;
}

export default CHECKIN_PROMPTS;
