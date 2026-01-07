import type { ReflectionEntry } from '@/store/useStore';

interface SageRequest {
  reflections: {
    lessonTitle: string;
    coreConceptTag: string;
    reflection: string;
    actionCompleted: boolean;
    date: string;
  }[];
  currentLessonTitle: string;
  currentReflection: string;
  userName: string;
  transformationGoal: string;
  currentStreak: number;
}

interface SageResponse {
  observation: string;
  question: string;
  direction: string;
  fullMessage: string;
  isAI: boolean; // true if from AI, false if fallback
  isLowEffort: boolean; // true if user gave garbage - lesson should FAIL
}

// Detect if a reflection is low-effort or nonsense
function isLowEffortReflection(text: string): boolean {
  const trimmed = text.trim().toLowerCase();

  // Too short to be meaningful
  if (trimmed.length < 10) return true;

  // Common low-effort patterns
  const lowEffortPatterns = [
    /^[a-z]{1,5}$/,           // Single short word
    /^(idk|ok|whatever|test|asdf|qwer|nothing|none|na|n\/a|\.+|no|yes|meh|lol|lmao)$/i,
    /^[^a-zA-Z]*$/,           // No letters at all
    /^(.)\1{3,}$/,            // Repeated single character
    /^[a-z]+$/i,              // Single word with no spaces (unless it's long and meaningful)
    /asdf|qwer|zxcv/i,        // Keyboard mashing
    /^[0-9\s]+$/,             // Only numbers
    /(.{1,3})\1{2,}/,         // Repeated short patterns like "aaaa" or "abcabcabc"
  ];

  // Check if less than 3 words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  if (words.length < 3 && trimmed.length < 30) return true;

  return lowEffortPatterns.some(pattern => pattern.test(trimmed));
}

// Responses for when user gives low effort
const LOW_EFFORT_RESPONSES = [
  "Random keystrokes don't count as reflection. You showed up - that's something. But showing up without presence is just going through motions. What would you write if you meant it?",
  "I can see you're here, but I don't see you engaging. The Stoics didn't practice half-measures. What's actually on your mind right now?",
  "This practice only works if you bring yourself to it. A half-hearted reflection yields half-hearted growth. What's really going on today?",
  "You typed something, but you didn't reflect. Try again - what did today's lesson actually stir in you?",
  "I can't guide you if you won't meet me halfway. Seneca wrote that we suffer more in imagination than reality. What are you avoiding by not engaging?",
];

// Fallback responses when AI is unavailable
// These are pattern-aware templates that can be customized
const FALLBACK_RESPONSES = {
  firstLesson: [
    "You've taken your first step on this path. The Stoics believed that the beginning is half of every action. Where do you want this journey to take you?",
    "Welcome to the practice. Seneca wrote that we learn not for school, but for life. What drew you to begin this exploration today?",
    "You've begun. That single act puts you ahead of countless others who only think about starting. What will you carry forward from today's lesson?",
  ],
  earlyJourney: [
    "You're building a foundation. Each reflection is a brick in the fortress of your mind. What pattern do you notice in your practice so far?",
    "Three lessons in and you're still here. Consistency is the mother of mastery. What concept has resonated most deeply with you?",
    "The early days require the most discipline. You're proving something to yourself. What have you discovered about your own thinking?",
  ],
  midJourney: [
    "You're developing a practice now, not just doing exercises. I notice you return each day with intention. What's keeping you committed?",
    "Halfway through a journey is where most quit. You're still here. What has this practice revealed about your relationship with challenge?",
    "The Stoics practiced daily. So do you now. What wisdom is becoming second nature to you?",
  ],
  deepPractice: [
    "Your reflections have depth now. You're not just completing lessons - you're integrating them. What principle guides your days most often?",
    "Marcus Aurelius journaled for himself alone, never expecting others to read his words. You're doing the same. What truth have you discovered in the writing?",
    "The practice has become part of you. What would you tell someone just beginning this journey?",
  ],
  streakMilestones: {
    7: "A week of practice. The habit is forming. What's different about how you see challenges now?",
    14: "Two weeks of daily presence. You're building something real. What pattern in your thinking has shifted?",
    30: "A month. You're no longer trying Stoicism - you're practicing it. What wisdom do you carry that you didn't have before?",
    60: "Two months of daily practice. This is no longer an experiment - it's who you are becoming. What mastery have you noticed?",
    90: "Ninety days. You've proven your commitment to yourself. The ancient philosophers would recognize you as a fellow practitioner. What have you become?",
  },
};

// Select a fallback response based on context
function getFallbackResponse(
  reflectionCount: number,
  currentStreak: number,
  lessonTitle: string,
  userName: string | null
): SageResponse {
  let message: string;

  // Check for streak milestones first
  const milestones = [7, 14, 30, 60, 90] as const;
  const milestone = milestones.find(m => currentStreak === m);
  if (milestone) {
    message = FALLBACK_RESPONSES.streakMilestones[milestone];
  } else if (reflectionCount === 0) {
    // First lesson
    message = FALLBACK_RESPONSES.firstLesson[Math.floor(Math.random() * FALLBACK_RESPONSES.firstLesson.length)];
  } else if (reflectionCount < 5) {
    // Early journey (1-4 reflections)
    message = FALLBACK_RESPONSES.earlyJourney[Math.floor(Math.random() * FALLBACK_RESPONSES.earlyJourney.length)];
  } else if (reflectionCount < 10) {
    // Mid journey (5-9 reflections)
    message = FALLBACK_RESPONSES.midJourney[Math.floor(Math.random() * FALLBACK_RESPONSES.midJourney.length)];
  } else {
    // Deep practice (10+ reflections)
    message = FALLBACK_RESPONSES.deepPractice[Math.floor(Math.random() * FALLBACK_RESPONSES.deepPractice.length)];
  }

  // Personalize with name if available
  if (userName) {
    message = `${userName}, ${message.charAt(0).toLowerCase()}${message.slice(1)}`;
  }

  return {
    observation: '',
    question: '',
    direction: '',
    fullMessage: message,
    isAI: false,
    isLowEffort: false,
  };
}

// Main function to get Sage's response
export async function getSageResponse(
  reflections: ReflectionEntry[],
  currentLessonTitle: string,
  currentReflection: string,
  userName: string | null,
  transformationGoal: string | null,
  currentStreak: number
): Promise<SageResponse> {
  // FIRST: Check for low-effort/nonsense reflection
  // This runs before even trying the API - no free passes for lazy input
  if (isLowEffortReflection(currentReflection)) {
    const lowEffortMessage = LOW_EFFORT_RESPONSES[Math.floor(Math.random() * LOW_EFFORT_RESPONSES.length)];
    const personalizedMessage = userName
      ? `${userName}, ${lowEffortMessage.charAt(0).toLowerCase()}${lowEffortMessage.slice(1)}`
      : lowEffortMessage;

    return {
      observation: '',
      question: '',
      direction: '',
      fullMessage: personalizedMessage,
      isAI: false,
      isLowEffort: true, // FAIL THE LESSON
    };
  }

  // Prepare request for AI
  const request: SageRequest = {
    reflections: reflections.map(r => ({
      lessonTitle: r.lessonTitle,
      coreConceptTag: r.coreConceptTag,
      reflection: r.reflection,
      actionCompleted: r.actionCompleted,
      date: r.date,
    })),
    currentLessonTitle,
    currentReflection,
    userName: userName || 'Student',
    transformationGoal: transformationGoal || 'Personal growth',
    currentStreak,
  };

  try {
    const response = await fetch('/api/sage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Sage API error, using fallback:', errorData);
      return getFallbackResponse(reflections.length, currentStreak, currentLessonTitle, userName);
    }

    const data = await response.json();

    // Check if we got a fallback indicator from the server
    if (data.fallback) {
      return getFallbackResponse(reflections.length, currentStreak, currentLessonTitle, userName);
    }

    // Format the full message with proper structure
    const { observation, question, direction } = data;
    let fullMessage = '';

    if (observation) fullMessage += observation;
    if (question) fullMessage += (fullMessage ? '\n\n' : '') + question;
    if (direction) fullMessage += (fullMessage ? '\n\n' : '') + direction;

    // Personalize with name if not already included
    if (userName && !fullMessage.toLowerCase().includes(userName.toLowerCase())) {
      fullMessage = `${userName}, ${fullMessage.charAt(0).toLowerCase()}${fullMessage.slice(1)}`;
    }

    return {
      observation: observation || '',
      question: question || '',
      direction: direction || '',
      fullMessage,
      isAI: true,
      isLowEffort: false,
    };

  } catch (error) {
    console.error('Failed to get Sage response:', error);
    return getFallbackResponse(reflections.length, currentStreak, currentLessonTitle, userName);
  }
}

export type { SageResponse };
