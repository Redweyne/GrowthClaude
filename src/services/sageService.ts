import type { ReflectionEntry } from '@/store/useStore';
import { isLowEffortReflection } from '@/lib/reflection';

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
  insight: string;
  direction: string;
  fullMessage: string;
  isAI: boolean; // true if from AI, false if fallback
  isLowEffort: boolean; // true if user gave garbage - lesson should FAIL
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
// These give WISDOM and DIRECTION - NOT questions
const FALLBACK_RESPONSES = {
  firstLesson: [
    "You've taken your first step on this path. The Stoics believed that the beginning is half of every action. The hardest part is now behind you.",
    "Welcome to the practice. Seneca wrote that we learn not for school, but for life. Today, you chose to learn for life.",
    "You've begun. That single act puts you ahead of countless others who only think about starting. Carry this momentum forward.",
  ],
  earlyJourney: [
    "You're building a foundation. Each reflection is a brick in the fortress of your mind. Keep laying bricks.",
    "Three lessons in and you're still here. Consistency is the mother of mastery. You're proving that to yourself right now.",
    "The early days require the most discipline. You're showing up when it matters most. That's the mark of character.",
  ],
  midJourney: [
    "You're developing a practice now, not just doing exercises. The Stoics would be proud of your consistency.",
    "Halfway through a journey is where most quit. You're still here. That says everything about who you're becoming.",
    "The Stoics practiced daily. So do you now. This wisdom is becoming part of who you are.",
  ],
  deepPractice: [
    "Your reflections have depth now. You're not just completing lessons - you're integrating them into your life.",
    "Marcus Aurelius journaled for himself alone, never expecting others to read his words. Like him, you write for your own transformation.",
    "The practice has become part of you. You carry ancient wisdom into modern challenges. That is the way.",
  ],
  streakMilestones: {
    7: "A week of practice. The habit is forming. You're rewiring how you respond to the world.",
    14: "Two weeks of daily presence. You're building something real. The compound effect of wisdom is beginning.",
    30: "A month of practice. You're no longer trying Stoicism - you're living it. This is who you are now.",
    60: "Two months of daily practice. This is no longer an experiment - it's your philosophy. You've earned this.",
    90: "Ninety days. You've proven your commitment to yourself. The ancient philosophers would recognize you as a fellow practitioner.",
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
    insight: '',
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
      insight: '',
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
    const { observation, insight, direction } = data;
    let fullMessage = '';

    if (observation) fullMessage += observation;
    if (insight) fullMessage += (fullMessage ? '\n\n' : '') + insight;
    if (direction) fullMessage += (fullMessage ? '\n\n' : '') + direction;

    // Personalize with name if not already included
    if (userName && !fullMessage.toLowerCase().includes(userName.toLowerCase())) {
      fullMessage = `${userName}, ${fullMessage.charAt(0).toLowerCase()}${fullMessage.slice(1)}`;
    }

    return {
      observation: observation || '',
      insight: insight || '',
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
