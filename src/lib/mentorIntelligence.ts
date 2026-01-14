// ============================================================================
// MENTOR INTELLIGENCE - THE SOUL OF SAGE
// This is not a random message picker. This is an intelligence system that:
// - Deeply analyzes what the user actually wrote
// - Extracts meaningful phrases to reflect back
// - Detects emotional tone and responds appropriately
// - Integrates lesson wisdom into personalized guidance
// - Never repeats itself within a session
// - Speaks to who the user is becoming, not just what they did
// ============================================================================

import type { Lesson } from '@/types';
import type { TransformationGoal } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

export interface ReflectionInsight {
  // Core analysis
  themes: string[];
  emotionalTone: 'struggling' | 'processing' | 'growing' | 'breakthrough';
  depth: 'surface' | 'moderate' | 'deep' | 'profound';

  // Extracted content
  keyPhrases: string[];
  actionMentioned: boolean;
  selfAwareness: boolean;

  // Sentiment markers
  showsVulnerability: boolean;
  showsGrowth: boolean;
  showsResistance: boolean;
  showsFrustration: boolean;
  showsHope: boolean;

  // Word metrics
  wordCount: number;
}

export interface MentorContext {
  // User identity
  userName: string | null;
  transformationGoal: TransformationGoal | null;
  whyStatement: string | null;

  // Journey progress
  reflectionCount: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceStart: number;

  // Current lesson
  lesson: Lesson;

  // Anti-repetition
  recentResponseHashes: string[];
}

export interface MentorResponse {
  message: string;
  mood: 'encouraging' | 'proud' | 'thoughtful' | 'challenging' | 'celebrating' | 'compassionate';
  hash: string;
}

// ============================================================================
// THEME DETECTION
// ============================================================================

const THEME_PATTERNS: Record<string, { keywords: string[]; weight: number }> = {
  control: {
    keywords: ['control', 'controlling', 'can\'t control', 'out of my control', 'within my control', 'let go', 'release', 'grip', 'hold on'],
    weight: 1.0
  },
  acceptance: {
    keywords: ['accept', 'accepting', 'acceptance', 'resist', 'resistance', 'fighting', 'peace with', 'come to terms', 'surrender'],
    weight: 1.0
  },
  patience: {
    keywords: ['patient', 'patience', 'impatient', 'waiting', 'rushing', 'slow down', 'hurry', 'time'],
    weight: 0.8
  },
  courage: {
    keywords: ['courage', 'brave', 'fear', 'afraid', 'scared', 'anxious', 'anxiety', 'worry', 'face my'],
    weight: 1.0
  },
  discipline: {
    keywords: ['discipline', 'consistent', 'habit', 'routine', 'follow through', 'commitment', 'show up', 'every day'],
    weight: 0.9
  },
  gratitude: {
    keywords: ['grateful', 'thankful', 'appreciate', 'gratitude', 'blessed', 'fortune', 'lucky'],
    weight: 0.8
  },
  perspective: {
    keywords: ['perspective', 'reframe', 'see differently', 'realize', 'understood', 'bigger picture', 'point of view'],
    weight: 1.0
  },
  anger: {
    keywords: ['angry', 'anger', 'frustrated', 'frustration', 'irritated', 'annoyed', 'rage', 'mad'],
    weight: 1.0
  },
  growth: {
    keywords: ['growing', 'growth', 'progress', 'better', 'improving', 'changing', 'becoming', 'learning'],
    weight: 1.0
  },
  struggle: {
    keywords: ['struggle', 'struggling', 'hard', 'difficult', 'challenging', 'tough', 'can\'t', 'impossible'],
    weight: 1.0
  },
  relationships: {
    keywords: ['relationship', 'family', 'friend', 'partner', 'spouse', 'parent', 'child', 'colleague', 'boss'],
    weight: 0.7
  },
  identity: {
    keywords: ['who i am', 'becoming', 'person i', 'identity', 'self', 'myself', 'the person'],
    weight: 1.0
  }
};

// ============================================================================
// EMOTIONAL TONE MARKERS
// ============================================================================

const TONE_MARKERS = {
  vulnerability: [
    'admit', 'honest', 'truth is', 'ashamed', 'embarrassed', 'weak', 'scared',
    'afraid to say', 'hard to admit', 'vulnerable', 'open up', 'never told'
  ],
  growth: [
    'realize', 'understood', 'learned', 'growing', 'progress', 'better than',
    'finally', 'breakthrough', 'clicked', 'see now', 'get it now', 'makes sense'
  ],
  resistance: [
    'but', 'however', 'still', 'can\'t', 'won\'t', 'don\'t want to', 'hard to',
    'not sure if', 'skeptical', 'doubt', 'seems like', 'supposedly'
  ],
  frustration: [
    'frustrated', 'annoying', 'why can\'t', 'sick of', 'tired of', 'hate',
    'unfair', 'wrong', 'stupid', 'waste', 'pointless', 'nothing works'
  ],
  hope: [
    'hope', 'maybe', 'possible', 'trying', 'want to', 'going to', 'will',
    'believe', 'can do', 'excited', 'looking forward', 'ready to'
  ]
};

// ============================================================================
// KEY PHRASE EXTRACTION
// ============================================================================

function extractKeyPhrases(text: string): string[] {
  const phrases: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

  // Patterns that indicate meaningful statements
  const meaningfulPatterns = [
    /i (?:realize|realized|understand|understood|learned|noticed|see now|get it)/i,
    /(?:the truth is|honestly|to be honest|i admit)/i,
    /i (?:want to|need to|have to|must|should|will) (?:\w+\s?){1,4}/i,
    /(?:this|that|it) (?:made me|helped me|showed me|taught me)/i,
    /i (?:feel|felt) (?:\w+\s?){1,5}/i,
    /(?:for the first time|finally|now i)/i,
    /(?:what if|maybe|i think|i believe)/i
  ];

  for (const sentence of sentences) {
    const trimmed = sentence.trim();

    // Check if sentence matches meaningful patterns
    for (const pattern of meaningfulPatterns) {
      if (pattern.test(trimmed)) {
        // Clean up and add the phrase
        const cleaned = trimmed
          .replace(/^[,\s]+/, '')
          .replace(/[,\s]+$/, '');

        if (cleaned.length > 15 && cleaned.length < 200) {
          phrases.push(cleaned);
          break;
        }
      }
    }
  }

  // If no patterns matched, find the most substantive sentence
  if (phrases.length === 0 && sentences.length > 0) {
    // Score sentences by word count and "I" statements
    const scored = sentences.map(s => {
      const words = s.trim().split(/\s+/).length;
      const hasI = /\bi\b/i.test(s) ? 2 : 0;
      return { sentence: s.trim(), score: words + hasI };
    });

    scored.sort((a, b) => b.score - a.score);
    if (scored[0] && scored[0].sentence.length > 20) {
      phrases.push(scored[0].sentence);
    }
  }

  // Return top 2 phrases max
  return phrases.slice(0, 2);
}

// ============================================================================
// ANALYZE REFLECTION
// ============================================================================

export function analyzeReflection(text: string): ReflectionInsight {
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Detect themes
  const themes: string[] = [];
  const themeScores: Record<string, number> = {};

  for (const [theme, config] of Object.entries(THEME_PATTERNS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        score += config.weight;
      }
    }
    if (score > 0) {
      themeScores[theme] = score;
    }
  }

  // Sort themes by score and take top 3
  const sortedThemes = Object.entries(themeScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);

  themes.push(...sortedThemes);

  // Detect sentiment markers
  const countMarkers = (markers: string[]): number =>
    markers.filter(m => lowerText.includes(m)).length;

  const vulnerabilityCount = countMarkers(TONE_MARKERS.vulnerability);
  const growthCount = countMarkers(TONE_MARKERS.growth);
  const resistanceCount = countMarkers(TONE_MARKERS.resistance);
  const frustrationCount = countMarkers(TONE_MARKERS.frustration);
  const hopeCount = countMarkers(TONE_MARKERS.hope);

  // Determine emotional tone
  let emotionalTone: ReflectionInsight['emotionalTone'] = 'processing';

  if (growthCount >= 2 || (growthCount >= 1 && vulnerabilityCount >= 1)) {
    emotionalTone = 'breakthrough';
  } else if (growthCount >= 1 || hopeCount >= 2) {
    emotionalTone = 'growing';
  } else if (frustrationCount >= 2 || (resistanceCount >= 2 && growthCount === 0)) {
    emotionalTone = 'struggling';
  }

  // Determine depth
  let depth: ReflectionInsight['depth'] = 'surface';
  const depthScore =
    (vulnerabilityCount * 2) +
    (growthCount * 1.5) +
    (wordCount > 50 ? 1 : 0) +
    (wordCount > 100 ? 1 : 0) +
    (themes.length * 0.5);

  if (depthScore >= 5) depth = 'profound';
  else if (depthScore >= 3) depth = 'deep';
  else if (depthScore >= 1.5) depth = 'moderate';

  // Check for action mention
  const actionMentioned = /i (?:did|tried|practiced|applied|used|acted|started|began|made)/i.test(text);

  // Check for self-awareness
  const selfAwareness = /i (?:notice|noticed|realize|realized|see|saw|understand|understood) (?:that |how )?(?:i|my)/i.test(text);

  // Extract key phrases
  const keyPhrases = extractKeyPhrases(text);

  return {
    themes,
    emotionalTone,
    depth,
    keyPhrases,
    actionMentioned,
    selfAwareness,
    showsVulnerability: vulnerabilityCount >= 1,
    showsGrowth: growthCount >= 1,
    showsResistance: resistanceCount >= 2,
    showsFrustration: frustrationCount >= 1,
    showsHope: hopeCount >= 1,
    wordCount
  };
}

// ============================================================================
// RESPONSE COMPONENTS
// ============================================================================

// Openers that acknowledge what they wrote
const REFLECTION_OPENERS: Record<ReflectionInsight['emotionalTone'], string[]> = {
  breakthrough: [
    'I can feel the shift in your words.',
    'Something just clicked for you.',
    'This is what the work looks like.',
    'You found something real here.',
    'That realization you just had? That\'s transformation.',
  ],
  growing: [
    'You\'re building on solid ground.',
    'I see the progress in your words.',
    'This is exactly the kind of thinking that creates change.',
    'You\'re asking the right questions.',
    'The person who wrote this is not the same person who started.',
  ],
  processing: [
    'You\'re sitting with this.',
    'There\'s honesty in what you wrote.',
    'You\'re doing the real work here.',
    'Processing takes courage.',
    'This is what genuine reflection looks like.',
  ],
  struggling: [
    'The struggle you\'re describing is real.',
    'I hear you.',
    'What you\'re facing isn\'t easy.',
    'Naming the difficulty is the first step.',
    'The fact that you\'re still here, still writing - that matters.',
  ]
};

// Depth acknowledgment
const DEPTH_RESPONSES: Record<ReflectionInsight['depth'], string[]> = {
  profound: [
    'What you\'ve written here goes deep.',
    'This is the kind of reflection that changes lives.',
    'You\'re not just completing a lesson - you\'re doing real inner work.',
  ],
  deep: [
    'You went beneath the surface.',
    'This shows real self-examination.',
    'You\'re engaging with this at a meaningful level.',
  ],
  moderate: [
    'You\'re engaging genuinely.',
    'There\'s real thought here.',
  ],
  surface: [
    'You showed up.',
    'You wrote something true.',
  ]
};

// Theme-specific responses
const THEME_RESPONSES: Record<string, string[]> = {
  control: [
    'The distinction between what you can and cannot control - that\'s the foundation of everything.',
    'Learning to release what isn\'t yours to hold is one of the hardest lessons.',
    'You\'re beginning to see where your power actually lives.',
  ],
  acceptance: [
    'Acceptance isn\'t giving up. It\'s choosing where to spend your energy.',
    'Fighting reality exhausts us. Accepting it frees us.',
    'What you\'re learning about acceptance will serve you in every area of life.',
  ],
  courage: [
    'Courage isn\'t the absence of fear. It\'s action despite fear.',
    'The fact that you\'re facing this instead of running from it - that\'s courage.',
    'Fear loses power when you name it. You just named yours.',
  ],
  growth: [
    'You\'re proof that people can change. Hold onto that.',
    'Growth isn\'t linear, but it\'s undeniable in your words.',
    'The person you\'re becoming is taking shape, one reflection at a time.',
  ],
  struggle: [
    'Struggle is part of the path. The Stoics knew that transformation doesn\'t come easy.',
    'What you\'re experiencing is the friction of growth.',
    'This difficulty is not a sign you\'re failing. It\'s a sign you\'re pushing limits.',
  ],
  anger: [
    'Anger is information. It\'s telling you something matters.',
    'The Stoics didn\'t suppress anger - they understood it.',
    'Noticing your anger is the first step toward choosing your response.',
  ],
  patience: [
    'Patience is a skill, not a personality trait. You\'re building it.',
    'The ability to wait without anxiety - that\'s what you\'re developing.',
  ],
  gratitude: [
    'Gratitude shifts everything. You\'re rewiring how you see the world.',
    'Noticing what you have changes what you need.',
  ],
  perspective: [
    'Seeing differently is the beginning of living differently.',
    'A shift in perspective is worth more than any external change.',
  ],
  identity: [
    'You\'re not just doing different things - you\'re becoming a different person.',
    'Identity drives behavior. You\'re changing at the deepest level.',
  ],
  relationships: [
    'How we show up for others is shaped by how we show up for ourselves.',
    'The work you\'re doing here will transform your relationships.',
  ],
  discipline: [
    'Discipline is proving to yourself that your word means something.',
    'Every time you follow through, you build trust with yourself.',
  ]
};

// Goal-specific encouragement
const GOAL_ENCOURAGEMENT: Record<TransformationGoal, string[]> = {
  calmer: [
    'Every reflection like this is training your mind to respond instead of react.',
    'The calm you\'re building isn\'t passive - it\'s powerful.',
    'You\'re creating space between stimulus and response. That\'s where peace lives.',
  ],
  disciplined: [
    'Discipline is forged in moments exactly like this.',
    'You\'re not just building a habit - you\'re building character.',
    'The person who follows through is the person you\'re becoming.',
  ],
  confident: [
    'Confidence comes from evidence. You\'re creating that evidence.',
    'Every time you examine yourself honestly, you earn your own trust.',
    'Self-assurance is built through self-knowledge. You\'re gaining both.',
  ],
  leader: [
    'Leaders are made in private before they emerge in public.',
    'The self-mastery you\'re developing is the foundation of all leadership.',
    'To lead others, you must first lead yourself. That\'s what you\'re doing.',
  ],
  focused: [
    'The ability to focus your attention is the ability to focus your life.',
    'By training your mind here, you\'re training it for everything.',
    'Concentration is a superpower. You\'re developing it.',
  ],
  resilient: [
    'Resilience is built in the practice, not just the theory.',
    'What doesn\'t break you is making you stronger.',
    'You\'re building the kind of strength that circumstances can\'t touch.',
  ]
};

// Lesson wisdom integrations
function getLessonWisdomResponse(lesson: Lesson, insight: ReflectionInsight): string | null {
  // Only include if the reflection seems related to the lesson
  const lessonTag = lesson.coreConceptTag?.toLowerCase();
  const reflectionRelatedToLesson = insight.themes.some(t =>
    lessonTag?.includes(t) || t.includes(lessonTag || '')
  );

  if (!reflectionRelatedToLesson && Math.random() > 0.4) {
    return null; // Don't force connection if not natural
  }

  // Build a response that connects their reflection to the lesson
  const responses = [
    `Today's teaching was about ${lesson.coreConceptTag}. Your reflection shows you're already applying it.`,
    `The wisdom you practiced today - "${lesson.wisdomSource ? lesson.wisdomSource : 'today\'s lesson'}" - is coming alive in your words.`,
    `You're not just understanding the concept - you're integrating it into how you think.`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Journey stage responses
function getJourneyStageResponse(context: MentorContext): string | null {
  const { reflectionCount, currentStreak, longestStreak } = context;

  // First reflection
  if (reflectionCount === 0) {
    return 'This is your first reflection. The hardest step is now behind you. Everything that follows builds on this moment.';
  }

  // Early journey (1-5 reflections)
  if (reflectionCount < 5) {
    const early = [
      'You\'re laying the foundation. Every reflection adds another brick.',
      'These early days are when the habit forms. You\'re in the crucible.',
      'Most people never start. You started. Keep going.',
    ];
    return early[Math.floor(Math.random() * early.length)];
  }

  // Building momentum (5-15 reflections)
  if (reflectionCount < 15) {
    return null; // Let other components shine, don't always mention journey
  }

  // Deep practice (15+ reflections)
  if (reflectionCount >= 15 && Math.random() > 0.7) {
    const deep = [
      'You\'ve written over fifteen reflections. This is no longer an experiment - it\'s a practice.',
      'The depth in your writing now would be impossible without the work you\'ve put in.',
    ];
    return deep[Math.floor(Math.random() * deep.length)];
  }

  // Streak milestones (only exact matches)
  if (currentStreak === 7) {
    return 'A full week. The habit is becoming part of who you are.';
  }
  if (currentStreak === 14) {
    return 'Two weeks of daily practice. You\'ve proven this isn\'t a whim.';
  }
  if (currentStreak === 30) {
    return 'Thirty days. A month of transformation. The person who started this journey is not the person here now.';
  }

  return null;
}

// Closing responses
const CLOSERS: string[] = [
  'Carry this forward.',
  'Until tomorrow.',
  'The work continues.',
  'Keep going.',
  'You\'re on the path.',
  'This is the way.',
  'Tomorrow, we continue.',
];

// Quote-back templates
function createQuoteBack(phrase: string): string | null {
  if (!phrase || phrase.length < 20) return null;

  // Clean the phrase
  const cleaned = phrase
    .replace(/^[,.\s]+/, '')
    .replace(/[,.\s]+$/, '')
    .replace(/^i /i, 'I ');

  if (cleaned.length < 20 || cleaned.length > 150) return null;

  const templates = [
    `You wrote: "${cleaned}" - that's insight.`,
    `"${cleaned}" - hold onto that.`,
    `When you said "${cleaned}" - that's the real work.`,
    `"${cleaned}" - this shows you're paying attention to what matters.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// Why statement integration
function integrateWhyStatement(why: string | null, insight: ReflectionInsight): string | null {
  if (!why || Math.random() > 0.25) return null; // Only use 25% of the time

  // Only integrate if the reflection shows struggle or breakthrough
  if (insight.emotionalTone !== 'struggling' && insight.emotionalTone !== 'breakthrough') {
    return null;
  }

  const responses = [
    `Remember why you started: "${why.slice(0, 100)}${why.length > 100 ? '...' : ''}"`,
    'Your why hasn\'t changed. The person you\'re becoming still needs this.',
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================================================
// MAIN RESPONSE BUILDER
// ============================================================================

export function buildMentorResponse(
  reflection: string,
  context: MentorContext
): MentorResponse {
  const insight = analyzeReflection(reflection);
  const components: string[] = [];

  // 1. Personalized opener (with name if available)
  let opener = REFLECTION_OPENERS[insight.emotionalTone][
    Math.floor(Math.random() * REFLECTION_OPENERS[insight.emotionalTone].length)
  ];

  if (context.userName && Math.random() > 0.3) {
    opener = `${context.userName}, ${opener.charAt(0).toLowerCase()}${opener.slice(1)}`;
  }
  components.push(opener);

  // 2. Quote back their words (if we found meaningful phrases)
  if (insight.keyPhrases.length > 0 && Math.random() > 0.4) {
    const quoteback = createQuoteBack(insight.keyPhrases[0]);
    if (quoteback) {
      components.push(quoteback);
    }
  }

  // 3. Theme-specific response (primary theme)
  if (insight.themes.length > 0) {
    const primaryTheme = insight.themes[0];
    const themeResponses = THEME_RESPONSES[primaryTheme];
    if (themeResponses && themeResponses.length > 0) {
      components.push(themeResponses[Math.floor(Math.random() * themeResponses.length)]);
    }
  }

  // 4. Goal-specific encouragement (if relevant)
  if (context.transformationGoal && Math.random() > 0.5) {
    const goalResponses = GOAL_ENCOURAGEMENT[context.transformationGoal];
    if (goalResponses) {
      components.push(goalResponses[Math.floor(Math.random() * goalResponses.length)]);
    }
  }

  // 5. Lesson wisdom integration (occasionally)
  const wisdomResponse = getLessonWisdomResponse(context.lesson, insight);
  if (wisdomResponse && Math.random() > 0.6) {
    components.push(wisdomResponse);
  }

  // 6. Journey stage acknowledgment (contextual)
  const journeyResponse = getJourneyStageResponse(context);
  if (journeyResponse) {
    components.push(journeyResponse);
  }

  // 7. Why statement integration (rare, for struggling/breakthrough)
  const whyResponse = integrateWhyStatement(context.whyStatement, insight);
  if (whyResponse) {
    components.push(whyResponse);
  }

  // 8. Depth acknowledgment (for deep/profound reflections)
  if ((insight.depth === 'deep' || insight.depth === 'profound') && Math.random() > 0.5) {
    const depthResponses = DEPTH_RESPONSES[insight.depth];
    components.push(depthResponses[Math.floor(Math.random() * depthResponses.length)]);
  }

  // 9. Closer (occasional)
  if (Math.random() > 0.6) {
    components.push(CLOSERS[Math.floor(Math.random() * CLOSERS.length)]);
  }

  // Combine components (max 4-5 for natural flow)
  const maxComponents = insight.depth === 'profound' ? 5 : 4;
  const selectedComponents = components.slice(0, maxComponents);

  // Join with appropriate spacing
  const message = selectedComponents.join('\n\n');

  // Determine mood
  let mood: MentorResponse['mood'] = 'encouraging';
  if (insight.emotionalTone === 'breakthrough') {
    mood = Math.random() > 0.5 ? 'celebrating' : 'proud';
  } else if (insight.emotionalTone === 'struggling') {
    mood = 'compassionate';
  } else if (insight.depth === 'profound') {
    mood = 'proud';
  } else if (insight.showsGrowth) {
    mood = 'encouraging';
  } else {
    mood = 'thoughtful';
  }

  // Generate hash for anti-repetition
  const hash = generateResponseHash(message);

  return {
    message,
    mood,
    hash
  };
}

// ============================================================================
// LOW EFFORT RESPONSES
// ============================================================================

export function buildLowEffortResponse(
  reflection: string,
  context: MentorContext
): MentorResponse {
  const responses = [
    {
      message: `${context.userName ? `${context.userName}, ` : ''}What you wrote doesn't reflect genuine engagement. The practice only works if you bring yourself to it. What's actually on your mind right now?`,
      mood: 'challenging' as const
    },
    {
      message: `This isn't reflection - it's just characters on a screen. The Stoics didn't practice half-measures. What would you write if you meant it?`,
      mood: 'challenging' as const
    },
    {
      message: `${context.userName ? `${context.userName}, I` : 'I'} can see you're here, but I don't see you engaging. Seneca wrote that we suffer more in imagination than reality. What are you avoiding by not writing truthfully?`,
      mood: 'compassionate' as const
    },
    {
      message: `The reflection is where the transformation happens. Without it, this is just going through motions. Try again - what did today's lesson actually stir in you?`,
      mood: 'challenging' as const
    },
    {
      message: `Half-hearted practice yields half-hearted results. ${context.transformationGoal ? `You said you wanted to become ${context.transformationGoal}. That requires showing up fully.` : 'You have to meet this work halfway.'} What's really going on?`,
      mood: 'challenging' as const
    }
  ];

  const selected = responses[Math.floor(Math.random() * responses.length)];

  return {
    message: selected.message,
    mood: selected.mood,
    hash: generateResponseHash(selected.message)
  };
}

// ============================================================================
// STREAK MILESTONE RESPONSES
// ============================================================================

export function getStreakMilestoneResponse(
  streak: number,
  context: MentorContext
): string | null {
  const milestones: Record<number, string[]> = {
    7: [
      `${context.userName ? `${context.userName}, ` : ''}A full week. Seven days of choosing to show up. The habit is forming - protect it.`,
      'Seven days. This is no longer a whim. It\'s becoming who you are.',
    ],
    14: [
      'Two weeks of daily practice. You\'ve crossed the threshold where most people quit.',
      `${context.userName ? `${context.userName}, fourteen` : 'Fourteen'} days. The neural pathways are rewiring. You\'re literally changing your brain.`,
    ],
    21: [
      'Twenty-one days. They say this is when habits form. But you\'re not building a habit - you\'re building an identity.',
    ],
    30: [
      `${context.userName ? `${context.userName}, ` : ''}Thirty days. A full month. The person who started this journey one month ago is not the person here now.`,
      'One month of transformation. What began as an experiment is now a practice. What was practice is becoming character.',
    ],
    60: [
      'Two months. Sixty days of showing up. Most people will never understand what this took. But you know.',
    ],
    90: [
      `${context.userName ? `${context.userName}, ninety` : 'Ninety'} days. The ancient philosophers practiced for decades. You\'ve proven you can do the same.`,
    ],
    180: [
      'Half a year of daily practice. You are no longer practicing Stoicism. You are living it.',
    ],
    365: [
      `${context.userName ? `${context.userName}, ` : ''}One year. 365 days. What you\'ve built cannot be taken from you. This wisdom is now part of who you are.`,
    ]
  };

  const responses = milestones[streak];
  if (!responses) return null;

  return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================================================
// ANTI-REPETITION
// ============================================================================

function generateResponseHash(message: string): string {
  // Simple hash based on first 50 chars and length
  const sample = message.slice(0, 50).toLowerCase().replace(/\s+/g, '');
  let hash = 0;
  for (let i = 0; i < sample.length; i++) {
    const char = sample.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${hash}-${message.length}`;
}

export function checkRepetition(hash: string, recentHashes: string[]): boolean {
  return recentHashes.includes(hash);
}

// ============================================================================
// MOOD MAPPING
// ============================================================================

export function mapMoodToSageMood(mood: MentorResponse['mood']): string {
  const mapping: Record<MentorResponse['mood'], string> = {
    encouraging: 'encouraging',
    proud: 'proud',
    thoughtful: 'thinking',
    challenging: 'disappointed',
    celebrating: 'celebrating',
    compassionate: 'encouraging'
  };
  return mapping[mood];
}
