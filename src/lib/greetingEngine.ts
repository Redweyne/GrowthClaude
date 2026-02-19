// ═══════════════════════════════════════════════════════════════════════════
// CONTEXTUAL GREETING ENGINE
// ═══════════════════════════════════════════════════════════════════════════
//
// Dynamic greetings based on:
// - Time of day (morning/afternoon/evening/night)
// - Streak length (new user, building, strong, legendary)
// - Recent lesson topic (personalized callbacks)
// - Day of week (weekend vs weekday energy)
// - Comeback detection (returning after absence)
//
// ═══════════════════════════════════════════════════════════════════════════

export interface GreetingContext {
  name: string;
  streak: number;
  longestStreak: number;
  totalLessons: number;
  lastLessonDate: string | null;
  lastLessonTitle?: string;
  lastLessonCoreTag?: string;
  transformationGoal?: string | null;
}

export interface GreetingResult {
  greeting: string;      // e.g. "Good morning"
  message: string;       // e.g. "Your 7-day streak is on fire"
  subMessage?: string;   // Optional secondary line
  mood: 'warm' | 'motivating' | 'celebratory' | 'gentle' | 'fierce';
}

// ─────────────────────────────────────────────────────────────────────────────
// TIME-BASED GREETINGS
// ─────────────────────────────────────────────────────────────────────────────

type TimeOfDay = 'earlyMorning' | 'morning' | 'afternoon' | 'evening' | 'lateNight';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return 'earlyMorning';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'lateNight';
}

const TIME_GREETINGS: Record<TimeOfDay, string[]> = {
  earlyMorning: [
    'The world is still quiet',
    'Up before the noise',
    'Early riser',
  ],
  morning: [
    'Good morning',
    'A new day begins',
    'Fresh start',
  ],
  afternoon: [
    'Good afternoon',
    'Still going strong',
    'Midday momentum',
  ],
  evening: [
    'Good evening',
    'Winding down wisely',
    'Evening reflection',
  ],
  lateNight: [
    'Night owl',
    'The quiet hours',
    'Still awake, still growing',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// STREAK-BASED MESSAGES
// ─────────────────────────────────────────────────────────────────────────────

function getStreakMessage(streak: number, longestStreak: number): { message: string; mood: GreetingResult['mood'] } {
  // First-ever session
  if (streak === 0) {
    return {
      message: 'Your journey begins with a single step.',
      mood: 'warm',
    };
  }

  // Streak milestones
  if (streak === 1) {
    return {
      message: 'Day 1. Every transformation starts here.',
      mood: 'motivating',
    };
  }

  if (streak === 3) {
    return {
      message: '3 days strong. A habit is taking shape.',
      mood: 'motivating',
    };
  }

  if (streak === 7) {
    return {
      message: 'One full week. You earned a Streak Shield.',
      mood: 'celebratory',
    };
  }

  if (streak === 14) {
    return {
      message: '2 weeks of relentless growth. Respect.',
      mood: 'fierce',
    };
  }

  if (streak === 21) {
    return {
      message: '21 days. They say this is when habits become identity.',
      mood: 'celebratory',
    };
  }

  if (streak === 30) {
    return {
      message: '30 days. You are no longer the person who started.',
      mood: 'celebratory',
    };
  }

  if (streak >= 50) {
    return {
      message: `${streak} days. Legendary discipline.`,
      mood: 'fierce',
    };
  }

  // About to beat longest streak
  if (longestStreak > 0 && streak === longestStreak) {
    return {
      message: `You just matched your longest streak. Tomorrow you break it.`,
      mood: 'fierce',
    };
  }

  if (longestStreak > 0 && streak === longestStreak + 1) {
    return {
      message: `New personal record: ${streak} days. You just surpassed your best.`,
      mood: 'celebratory',
    };
  }

  // General streak ranges
  if (streak >= 2 && streak < 7) {
    const messages = [
      `${streak}-day streak. Building momentum.`,
      `Day ${streak}. The compound effect is working.`,
      `${streak} days and counting. Keep stacking.`,
    ];
    return {
      message: messages[streak % messages.length],
      mood: 'motivating',
    };
  }

  if (streak >= 7 && streak < 14) {
    const messages = [
      `${streak}-day streak burning bright.`,
      `Week ${Math.floor(streak / 7)}+. Consistency is your superpower.`,
      `${streak} days of choosing growth over comfort.`,
    ];
    return {
      message: messages[streak % messages.length],
      mood: 'motivating',
    };
  }

  // 14+
  const messages = [
    `${streak} days of relentless growth.`,
    `Day ${streak}. This is who you are now.`,
    `${streak}-day streak. Unstoppable.`,
  ];
  return {
    message: messages[streak % messages.length],
    mood: 'fierce',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMEBACK DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function getDaysSinceLastLesson(lastLessonDate: string | null): number {
  if (!lastLessonDate) return -1;
  const last = new Date(lastLessonDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getComebackMessage(daysSince: number): string | null {
  if (daysSince <= 1) return null;

  if (daysSince === 2) return 'Welcome back. Yesterday was a rest day — today is a growth day.';
  if (daysSince <= 4) return `${daysSince} days away. But you came back. That matters more than the gap.`;
  if (daysSince <= 7) return 'A week away, but not a week wasted. Every return is a choice to grow.';
  if (daysSince <= 14) return 'You disappeared for a bit. But here you are. The best comebacks are quiet ones.';
  if (daysSince <= 30) return 'It\'s been a while. No judgment. Just growth. Let\'s begin again.';
  return 'You\'re back. That took courage. Let\'s pick up where you left off.';
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC CALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

function getTopicCallback(coreTag?: string, title?: string): string | undefined {
  if (!coreTag) return undefined;

  const callbacks: Record<string, string[]> = {
    control: [
      'Remember: focus on what you can control.',
      'The weight you carried yesterday — is it lighter today?',
    ],
    habits: [
      'Your tiny habit from yesterday — did you do it?',
      'Small steps. Big transformation.',
    ],
    obstacles: [
      'That obstacle you named — has it started teaching you yet?',
      'The gift hides inside the struggle.',
    ],
    preparation: [
      'Did you own your morning today?',
      'The day is yours to shape.',
    ],
    gratitude: [
      'What are you grateful for right now?',
      'The temporary gift of this moment.',
    ],
    resilience: [
      'Setbacks build comebacks.',
      'The comeback formula is working.',
    ],
    growth: [
      'Struggle is the path, not the obstacle.',
      'You\'re getting stronger in the broken places.',
    ],
    courage: [
      'Fear is the compass. Follow it.',
      'On the other side of fear is everything you want.',
    ],
    antifragile: [
      'Disorder makes you stronger.',
      'You don\'t just survive chaos — you feed on it.',
    ],
    projection: [
      'What triggers you teaches you.',
      'The mirror doesn\'t lie.',
    ],
    honesty: [
      'Radical truth is radical freedom.',
      'Honesty with yourself first.',
    ],
    boundaries: [
      'Your boundaries protect your peace.',
      'Saying no is saying yes to yourself.',
    ],
    empathy: [
      'Understanding others starts with understanding yourself.',
      'Empathy is strength, not weakness.',
    ],
    forgiveness: [
      'Forgiveness frees the forgiver.',
      'Letting go is the ultimate power move.',
    ],
  };

  const options = callbacks[coreTag];
  if (!options) return undefined;

  // Consistent daily rotation
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return options[dayOfYear % options.length];
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export function generateGreeting(ctx: GreetingContext): GreetingResult {
  const timeOfDay = getTimeOfDay();
  const daysSince = getDaysSinceLastLesson(ctx.lastLessonDate);
  const comebackMessage = getComebackMessage(daysSince);

  // Pick time greeting
  const timeGreetings = TIME_GREETINGS[timeOfDay];
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const greeting = timeGreetings[dayOfYear % timeGreetings.length];

  // Comeback takes priority
  if (comebackMessage) {
    return {
      greeting,
      message: comebackMessage,
      subMessage: getTopicCallback(ctx.lastLessonCoreTag, ctx.lastLessonTitle),
      mood: 'gentle',
    };
  }

  // Streak-based message
  const streakResult = getStreakMessage(ctx.streak, ctx.longestStreak);

  // Topic callback as sub-message
  const topicCallback = getTopicCallback(ctx.lastLessonCoreTag, ctx.lastLessonTitle);

  return {
    greeting,
    message: streakResult.message,
    subMessage: topicCallback,
    mood: streakResult.mood,
  };
}

// Weekend-aware greeting adjustment
export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}
