// The Mentor: Sage
// A wise, warm, but serious guide who speaks with authority earned through experience.
// Not a cheerleader. Not a critic. A mentor who sees who you could become.

export interface MentorPersonality {
  name: string;
  title: string;
  description: string;
  voiceTraits: string[];
  avatarDescription: string;
}

export const MENTOR: MentorPersonality = {
  name: 'Sage',
  title: 'Your Guide',
  description:
    'Sage is a mentor who speaks with the calm authority of someone who has walked the path before you. Not overly warm, not cold—grounded. Sage believes in your potential but will not flatter you. Sage celebrates genuine effort and gently challenges excuses.',
  voiceTraits: [
    'Calm and grounded—never rushed or excitable',
    'Uses "you" language to speak directly to the user',
    'Draws on wisdom traditions without being preachy',
    'Celebrates effort, not just results',
    'Asks questions that provoke reflection',
    'Never uses empty affirmations like "Great job!" or "You\'re amazing!"',
    'Speaks as if they have seen the user\'s future and know they will succeed',
  ],
  avatarDescription:
    'A calm, androgynous figure with knowing eyes. Simple robes suggesting timelessness. An expression that is kind but not soft—the face of someone who has seen struggle and emerged wiser.',
};

// Mentor response templates by context
export const MENTOR_RESPONSES = {
  // After completing a lesson
  lessonComplete: [
    "You showed up. That's the first victory. The second is what you do tomorrow.",
    'The lesson is not what you learned—it is who you are becoming by showing up.',
    "Small acts, done consistently, create the person you're building. Today's act counts.",
    'You just practiced what most people only read about. That distinction matters.',
    'The gap between knowing and doing is where transformation happens. You crossed it today.',
  ],

  // After writing a reflection
  reflectionWritten: [
    'Your words capture something important. Return to them when you need reminding.',
    'Writing is thinking made visible. What you wrote reveals what you already knew.',
    'The reflection is a mirror. What you see is already inside you.',
    'Most people never stop to examine their thoughts. You just did. That is rare.',
    'These words are seeds. Some will grow into understanding you cannot yet imagine.',
  ],

  // Streak milestones
  streakMilestones: {
    3: "Three days. The hardest part is behind you. Now it's about maintaining, not starting.",
    7: "A full week. You've proven this is not a whim. It's becoming who you are.",
    14: 'Two weeks of showing up. This is no longer an experiment—it is a practice.',
    21: "They say 21 days builds a habit. But you're not building a habit. You're building an identity.",
    30: 'Thirty days. A month of becoming. The person who started this journey is not the person here now.',
    60: 'Two months. Most never reach here. Remember this when others talk about wanting to change.',
    90: 'Ninety days. You have crossed the threshold that separates wishers from doers.',
    180: 'Half a year of daily practice. You are no longer practicing discipline. You are discipline.',
    365: 'One year. What you have built cannot be taken from you. It is now part of who you are.',
  },

  // When user returns after missing days (using grace day)
  returnAfterMiss: [
    'You returned. That is what matters. The path is not about perfection—it is about returning.',
    'The warrior is not the one who never falls. It is the one who always rises.',
    'You used a grace day. There is no shame in this. Grace exists to be used.',
    'The streak is a tool, not a master. You are still here. That is what counts.',
  ],

  // When streak actually breaks (no grace days left)
  streakBroken: [
    'The streak ended. But the practice does not end unless you decide it ends. Begin again.',
    'A broken streak is not failure. Staying broken is failure. You are here now. That is not failure.',
    'Today is day one again. But you are not the same person who started at day one before. You carry everything you learned.',
  ],

  // Level up
  levelUp: [
    'You have risen to a new level. This is not given—it is earned through consistent action.',
    'Each level represents commitment made visible. Wear it as proof of who you are becoming.',
    'Levels are milestones, not destinations. The journey continues.',
  ],

  // Achievement unlocked
  achievementUnlocked: [
    'You have unlocked something that marks your path. Let it remind you of what you are capable of.',
    'Achievements are not trophies. They are witnesses to your journey.',
    'This achievement was always waiting for you. You finally arrived.',
  ],

  // Morning greeting
  morningGreeting: [
    'A new day. A new opportunity to become who you are meant to be. Are you ready?',
    'The day is unwritten. Your lesson awaits. What will you practice today?',
    'You are here again. That simple act of returning is the foundation of all transformation.',
  ],

  // After completing a chapter
  chapterComplete: [
    'A chapter closes. But the teaching lives on in how you live, not in what you remember.',
    'You have completed a chapter of your transformation. The next awaits when you are ready.',
    'This chapter is complete. But mastery comes from returning to these lessons again and again.',
  ],

  // After completing a world
  worldComplete: [
    'You have walked an entire path of wisdom. Few complete what they begin. You are one of the few.',
    'This world is now part of you. Its teachings will surface when you need them most.',
    'Completion is not the end. It is the beginning of integration. Now you must live what you have learned.',
  ],

  // Weekly check-in
  weeklyCheckIn: [
    'Another week of practice. Take a moment to see how far you have traveled.',
    'The weekly review is not about judgment. It is about awareness. What do you notice?',
    'Pause and reflect. The unexamined week is not worth repeating.',
  ],

  // Identity statement created
  identityStatement: [
    '"I am someone who..." These are the most powerful words you can speak. You just claimed something.',
    'Identity precedes behavior. By naming who you are, you shape what you will do.',
    'Write it. Believe it. Become it. You just began that cycle.',
  ],

  // Practice/review session
  practiceSession: [
    'Practice makes permanent. Revisiting old lessons deepens their roots.',
    "You're not learning again. You're strengthening what is already there.",
    'Spaced repetition is how wisdom becomes instinct. You just made a teaching more permanent.',
  ],
};

// Helper to get random response from array
export function getRandomMentorResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Get streak milestone message if applicable
export function getStreakMilestoneMessage(streak: number): string | null {
  const milestones = MENTOR_RESPONSES.streakMilestones;
  return milestones[streak as keyof typeof milestones] || null;
}

export default MENTOR;
