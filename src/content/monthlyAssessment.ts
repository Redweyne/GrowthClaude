// Monthly Self-Assessment Questions
// These 5 questions measure growth across key dimensions
// Users rate themselves 1-10 on each dimension

export interface AssessmentQuestion {
  id: string;
  dimension: 'emotionalMastery' | 'discipline' | 'perspective' | 'selfAwareness' | 'growth';
  title: string;
  question: string;
  lowLabel: string;  // Label for 1
  highLabel: string; // Label for 10
  description: string;
  stoicContext: string;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'emotional-mastery',
    dimension: 'emotionalMastery',
    title: 'Emotional Mastery',
    question: 'How well did you manage difficult emotions this month?',
    lowLabel: 'Constantly overwhelmed',
    highLabel: 'Complete composure',
    description: 'Consider moments of anger, frustration, anxiety, or fear. How well did you respond rather than react?',
    stoicContext: '"You have power over your mind - not outside events. Realize this, and you will find strength." — Marcus Aurelius',
  },
  {
    id: 'discipline',
    dimension: 'discipline',
    title: 'Discipline',
    question: 'How consistent were you with your commitments this month?',
    lowLabel: 'Rarely followed through',
    highLabel: 'Rock solid consistency',
    description: 'Think about your daily practices, promises to yourself, and habits. How often did you show up when it mattered?',
    stoicContext: '"No man is free who is not master of himself." — Epictetus',
  },
  {
    id: 'perspective',
    dimension: 'perspective',
    title: 'Perspective',
    question: 'How well did you maintain wisdom during challenges?',
    lowLabel: 'Lost in problems',
    highLabel: 'Clear-headed always',
    description: 'When difficulties arose, could you step back and see the bigger picture? Did you remember what truly matters?',
    stoicContext: '"It\'s not what happens to you, but how you react to it that matters." — Epictetus',
  },
  {
    id: 'self-awareness',
    dimension: 'selfAwareness',
    title: 'Self-Awareness',
    question: 'How aware were you of your thought patterns?',
    lowLabel: 'Running on autopilot',
    highLabel: 'Fully conscious',
    description: 'Did you notice when negative thoughts arose? Could you observe your mind without being controlled by it?',
    stoicContext: '"Begin at once to live, and count each separate day as a separate life." — Seneca',
  },
  {
    id: 'growth',
    dimension: 'growth',
    title: 'Growth',
    question: 'How much did you grow and learn this month?',
    lowLabel: 'Stagnant',
    highLabel: 'Transformed',
    description: 'Consider insights gained, behaviors changed, and wisdom integrated. Are you a different person than 30 days ago?',
    stoicContext: '"The whole future lies in uncertainty: live immediately." — Seneca',
  },
];

// Final reflection prompt
export const FINAL_REFLECTION_PROMPT = {
  title: 'Monthly Reflection',
  prompt: 'Looking back at this month, what was your greatest victory and your greatest lesson?',
  placeholder: 'Reflect on a moment you\'re proud of and something that challenged you to grow...',
};

// Get dimension color for UI
export function getDimensionColor(dimension: AssessmentQuestion['dimension']): string {
  const colors: Record<AssessmentQuestion['dimension'], string> = {
    emotionalMastery: '#8B5CF6', // Purple
    discipline: '#F59E0B',       // Amber
    perspective: '#10B981',      // Emerald
    selfAwareness: '#3B82F6',    // Blue
    growth: '#EC4899',           // Pink
  };
  return colors[dimension];
}

// Get dimension icon name
export function getDimensionIcon(dimension: AssessmentQuestion['dimension']): string {
  const icons: Record<AssessmentQuestion['dimension'], string> = {
    emotionalMastery: 'Heart',
    discipline: 'Target',
    perspective: 'Eye',
    selfAwareness: 'Brain',
    growth: 'TrendingUp',
  };
  return icons[dimension];
}
