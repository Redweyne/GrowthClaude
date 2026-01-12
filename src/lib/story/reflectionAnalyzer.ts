// ============================================================================
// REFLECTION ANALYZER
// Extracts meaningful insights, contrasts, and growth patterns from reflections.
// This is where we find the "before and after" that makes people emotional.
// ============================================================================

import { ReflectionForStory, TransformationInsight, WordData } from '@/types/story';

// ----------------------------------------------------------------------------
// SENTIMENT & THEME DETECTION
// ----------------------------------------------------------------------------

// Words that indicate struggle, challenge, or difficulty
const STRUGGLE_INDICATORS = [
  'struggle', 'struggling', 'difficult', 'hard', 'challenging', 'frustrated',
  'frustrated', 'anxious', 'anxiety', 'worried', 'worry', 'stressed', 'stress',
  'overwhelmed', 'confused', 'lost', 'stuck', 'fail', 'failed', 'failing',
  'can\'t', 'cannot', 'unable', 'fear', 'afraid', 'scared', 'doubt', 'doubting',
  'angry', 'anger', 'upset', 'discouraged', 'hopeless', 'helpless', 'weak',
  'impossible', 'never', 'always', 'terrible', 'awful', 'hate', 'worst'
];

// Words that indicate growth, acceptance, or mastery
const GROWTH_INDICATORS = [
  'realize', 'realized', 'understand', 'understood', 'learn', 'learned', 'learning',
  'accept', 'accepted', 'accepting', 'peace', 'peaceful', 'calm', 'calmer',
  'control', 'controlled', 'choose', 'chose', 'chosen', 'notice', 'noticed',
  'aware', 'awareness', 'present', 'moment', 'breathe', 'breath', 'pause',
  'paused', 'respond', 'responded', 'instead', 'growth', 'growing', 'progress',
  'better', 'improved', 'improving', 'grateful', 'gratitude', 'appreciate',
  'strong', 'stronger', 'courage', 'courageous', 'confident', 'confidence',
  'clarity', 'clear', 'focused', 'discipline', 'disciplined', 'patient',
  'patience', 'wisdom', 'wise', 'perspective', 'let go', 'release', 'released'
];

// Words that indicate action and agency
const AGENCY_INDICATORS = [
  'decided', 'decide', 'chose', 'choose', 'took', 'take', 'made', 'make',
  'started', 'start', 'began', 'begin', 'committed', 'commit', 'acted',
  'act', 'created', 'create', 'built', 'build', 'changed', 'change',
  'transformed', 'transform', 'practiced', 'practice', 'applied', 'apply',
  'implemented', 'implement', 'tried', 'try', 'experimented', 'experiment'
];

// Words that indicate self-reflection and introspection
const INTROSPECTION_INDICATORS = [
  'i realize', 'i noticed', 'i understand', 'i see', 'i feel', 'i am',
  'i\'ve been', 'i have been', 'i\'ve learned', 'i have learned',
  'myself', 'my mind', 'my thoughts', 'my feelings', 'my emotions',
  'my reaction', 'my response', 'my behavior', 'my pattern', 'my habit'
];

export interface ReflectionAnalysis {
  // Basic metrics
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;

  // Sentiment scoring (0-1)
  struggleScore: number;
  growthScore: number;
  agencyScore: number;
  introspectionScore: number;

  // Derived metrics
  overallSentiment: 'struggling' | 'neutral' | 'growing' | 'thriving';
  emotionalDepth: 'surface' | 'moderate' | 'deep' | 'profound';

  // Key phrases extracted
  keyPhrases: string[];

  // Themes present
  themes: string[];
}

export interface ReflectionContrast {
  before: ReflectionForStory;
  after: ReflectionForStory;
  contrastScore: number; // 0-1, higher = more dramatic contrast
  beforeAnalysis: ReflectionAnalysis;
  afterAnalysis: ReflectionAnalysis;
  growthNarrative: string;
  contrastType: 'struggle_to_growth' | 'confusion_to_clarity' | 'passive_to_active' | 'surface_to_deep';
}

// ----------------------------------------------------------------------------
// ANALYSIS FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Analyzes a single reflection for sentiment and depth
 */
export function analyzeReflection(text: string): ReflectionAnalysis {
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);

  // Calculate scores
  const struggleScore = calculateIndicatorScore(lowerText, STRUGGLE_INDICATORS, wordCount);
  const growthScore = calculateIndicatorScore(lowerText, GROWTH_INDICATORS, wordCount);
  const agencyScore = calculateIndicatorScore(lowerText, AGENCY_INDICATORS, wordCount);
  const introspectionScore = calculateIndicatorScore(lowerText, INTROSPECTION_INDICATORS, wordCount);

  // Determine overall sentiment
  const sentimentDelta = growthScore - struggleScore;
  let overallSentiment: ReflectionAnalysis['overallSentiment'];
  if (sentimentDelta > 0.3) overallSentiment = 'thriving';
  else if (sentimentDelta > 0.1) overallSentiment = 'growing';
  else if (sentimentDelta < -0.2) overallSentiment = 'struggling';
  else overallSentiment = 'neutral';

  // Determine emotional depth
  const depthScore = introspectionScore + (agencyScore * 0.5) + (wordCount > 100 ? 0.2 : 0);
  let emotionalDepth: ReflectionAnalysis['emotionalDepth'];
  if (depthScore > 0.5) emotionalDepth = 'profound';
  else if (depthScore > 0.3) emotionalDepth = 'deep';
  else if (depthScore > 0.15) emotionalDepth = 'moderate';
  else emotionalDepth = 'surface';

  // Extract key phrases (sentences with high indicator density)
  const keyPhrases = extractKeyPhrases(sentences);

  // Identify themes
  const themes = identifyThemes(lowerText);

  return {
    wordCount,
    sentenceCount,
    averageWordsPerSentence: wordCount / sentenceCount,
    struggleScore,
    growthScore,
    agencyScore,
    introspectionScore,
    overallSentiment,
    emotionalDepth,
    keyPhrases,
    themes
  };
}

/**
 * Calculates how prevalent certain indicator words are in the text
 */
function calculateIndicatorScore(text: string, indicators: string[], totalWords: number): number {
  if (totalWords === 0) return 0;

  let matchCount = 0;
  for (const indicator of indicators) {
    // Count occurrences of each indicator
    const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      matchCount += matches.length;
    }
  }

  // Normalize by word count, with diminishing returns
  const rawScore = matchCount / totalWords;
  return Math.min(rawScore * 10, 1); // Scale up but cap at 1
}

/**
 * Extracts the most meaningful sentences from the text
 */
function extractKeyPhrases(sentences: string[]): string[] {
  const allIndicators = [...GROWTH_INDICATORS, ...INTROSPECTION_INDICATORS, ...AGENCY_INDICATORS];

  const scoredSentences = sentences.map(sentence => {
    const lower = sentence.toLowerCase();
    let score = 0;
    for (const indicator of allIndicators) {
      if (lower.includes(indicator)) score++;
    }
    // Bonus for "I" statements
    if (lower.includes('i ')) score += 0.5;
    // Penalty for very short sentences
    if (sentence.split(/\s+/).length < 5) score -= 1;
    return { sentence: sentence.trim(), score };
  });

  return scoredSentences
    .filter(s => s.score > 0.5 && s.sentence.length > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.sentence);
}

/**
 * Identifies major themes present in the reflection
 */
function identifyThemes(text: string): string[] {
  const themes: string[] = [];

  const themePatterns: [string, string[]][] = [
    ['acceptance', ['accept', 'let go', 'release', 'surrender', 'peace with']],
    ['control', ['control', 'can\'t control', 'within my control', 'outside my control']],
    ['patience', ['patient', 'patience', 'wait', 'time', 'rushing']],
    ['courage', ['courage', 'brave', 'fear', 'afraid', 'scared', 'face']],
    ['gratitude', ['grateful', 'thankful', 'appreciate', 'gratitude', 'blessed']],
    ['perspective', ['perspective', 'view', 'realize', 'see now', 'understand now']],
    ['presence', ['present', 'moment', 'now', 'here', 'mindful', 'aware']],
    ['growth', ['grow', 'growth', 'learn', 'improve', 'better', 'progress']],
    ['discipline', ['discipline', 'habit', 'routine', 'consistent', 'commit']],
    ['resilience', ['bounce back', 'overcome', 'despite', 'anyway', 'still']]
  ];

  for (const [theme, keywords] of themePatterns) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        themes.push(theme);
        break;
      }
    }
  }

  return themes;
}

// ----------------------------------------------------------------------------
// CONTRAST FINDING - The magic of "before and after"
// ----------------------------------------------------------------------------

/**
 * Finds the most compelling "before and after" contrast in reflections
 */
export function findBestContrast(reflections: ReflectionForStory[]): ReflectionContrast | null {
  if (reflections.length < 2) return null;

  // Sort by date
  const sorted = [...reflections].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Analyze all reflections
  const analyzed = sorted.map(r => ({
    reflection: r,
    analysis: analyzeReflection(r.text)
  }));

  let bestContrast: ReflectionContrast | null = null;
  let bestScore = 0;

  // Find pairs with maximum contrast
  // Prioritize early reflections vs late reflections
  const earlyReflections = analyzed.slice(0, Math.ceil(analyzed.length * 0.3));
  const lateReflections = analyzed.slice(Math.floor(analyzed.length * 0.7));

  for (const early of earlyReflections) {
    for (const late of lateReflections) {
      const contrast = calculateContrastScore(early.analysis, late.analysis);

      // We want: struggle→growth, passive→active, surface→deep
      const isPositiveGrowth =
        (late.analysis.growthScore > early.analysis.growthScore) ||
        (late.analysis.agencyScore > early.analysis.agencyScore) ||
        (late.analysis.emotionalDepth !== 'surface' && early.analysis.emotionalDepth === 'surface');

      if (contrast > bestScore && isPositiveGrowth) {
        bestScore = contrast;
        bestContrast = {
          before: early.reflection,
          after: late.reflection,
          contrastScore: contrast,
          beforeAnalysis: early.analysis,
          afterAnalysis: late.analysis,
          growthNarrative: generateGrowthNarrative(early.analysis, late.analysis),
          contrastType: determineContrastType(early.analysis, late.analysis)
        };
      }
    }
  }

  return bestContrast;
}

/**
 * Calculates how different two reflections are
 */
function calculateContrastScore(before: ReflectionAnalysis, after: ReflectionAnalysis): number {
  // Growth improvement
  const growthDelta = after.growthScore - before.growthScore;

  // Struggle reduction
  const struggleDelta = before.struggleScore - after.struggleScore;

  // Agency increase
  const agencyDelta = after.agencyScore - before.agencyScore;

  // Depth increase
  const depthMap = { 'surface': 0, 'moderate': 1, 'deep': 2, 'profound': 3 };
  const depthDelta = depthMap[after.emotionalDepth] - depthMap[before.emotionalDepth];

  // Combine scores (all positive = good contrast)
  const score = (
    Math.max(0, growthDelta) * 0.3 +
    Math.max(0, struggleDelta) * 0.3 +
    Math.max(0, agencyDelta) * 0.2 +
    Math.max(0, depthDelta) * 0.2
  );

  return Math.min(score, 1);
}

/**
 * Generates a human-readable narrative about the growth
 */
function generateGrowthNarrative(before: ReflectionAnalysis, after: ReflectionAnalysis): string {
  const narratives: string[] = [];

  if (before.struggleScore > 0.3 && after.growthScore > before.struggleScore) {
    narratives.push('You moved from struggle to growth.');
  }

  if (after.agencyScore > before.agencyScore + 0.2) {
    narratives.push('You found your agency and power to act.');
  }

  if (after.emotionalDepth === 'profound' && before.emotionalDepth === 'surface') {
    narratives.push('Your self-reflection deepened profoundly.');
  }

  if (after.themes.includes('acceptance') && before.themes.includes('control')) {
    narratives.push('You learned to accept what you cannot control.');
  }

  if (narratives.length === 0) {
    narratives.push('Your perspective has evolved meaningfully.');
  }

  return narratives.join(' ');
}

/**
 * Determines what type of transformation the contrast represents
 */
function determineContrastType(
  before: ReflectionAnalysis,
  after: ReflectionAnalysis
): ReflectionContrast['contrastType'] {
  const struggleDelta = before.struggleScore - after.struggleScore;
  const growthDelta = after.growthScore - before.growthScore;
  const agencyDelta = after.agencyScore - before.agencyScore;
  const depthDelta =
    ['surface', 'moderate', 'deep', 'profound'].indexOf(after.emotionalDepth) -
    ['surface', 'moderate', 'deep', 'profound'].indexOf(before.emotionalDepth);

  if (struggleDelta > 0.2 && growthDelta > 0.2) return 'struggle_to_growth';
  if (depthDelta >= 2) return 'surface_to_deep';
  if (agencyDelta > 0.3) return 'passive_to_active';
  return 'confusion_to_clarity';
}

// ----------------------------------------------------------------------------
// WORD ANALYSIS - Finding meaningful vocabulary
// ----------------------------------------------------------------------------

/**
 * Extracts meaningful words and their frequencies
 */
export function analyzeWordFrequency(reflections: ReflectionForStory[]): WordData[] {
  const wordCounts = new Map<string, number>();

  // Common words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
    'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'it', 'its', 'my', 'your', 'his', 'her', 'their', 'our', 'me', 'him',
    'them', 'us', 'what', 'which', 'who', 'whom', 'when', 'where', 'why',
    'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too', 'very',
    'just', 'also', 'now', 'here', 'there', 'then', 'if', 'about', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'under', 'again', 'further', 'once', 'i', 'i\'m', 'i\'ve', 'i\'ll', 'i\'d',
    'don\'t', 'doesn\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'couldn\'t',
    'shouldn\'t', 'haven\'t', 'hasn\'t', 'hadn\'t', 'isn\'t', 'aren\'t',
    'wasn\'t', 'weren\'t', 'being', 'having', 'doing', 'going', 'get', 'got',
    'think', 'know', 'see', 'come', 'go', 'make', 'take', 'want', 'use',
    'find', 'give', 'tell', 'say', 'said', 'thing', 'things', 'way', 'even',
    'new', 'because', 'good', 'much', 'really', 'like', 'felt', 'feel',
    'feeling', 'thought', 'today', 'day', 'time', 'something', 'anything',
    'everything', 'nothing', 'someone', 'anyone', 'everyone', 'one', 'two'
  ]);

  // Meaningful words we want to highlight
  const meaningfulWords = new Set([
    ...GROWTH_INDICATORS,
    ...AGENCY_INDICATORS,
    'journey', 'transformation', 'growth', 'peace', 'calm', 'strength',
    'wisdom', 'courage', 'discipline', 'patience', 'gratitude', 'mindful',
    'present', 'awareness', 'clarity', 'purpose', 'meaning', 'stoic',
    'virtue', 'character', 'resilience', 'acceptance', 'perspective'
  ]);

  for (const reflection of reflections) {
    const words = reflection.text.toLowerCase()
      .replace(/[^a-z\s']/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  // Convert to WordData array
  const wordDataArray: WordData[] = [];
  const maxCount = Math.max(...wordCounts.values());

  // Color palette for words
  const colors = [
    '#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981',
    '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'
  ];

  for (const [word, count] of wordCounts) {
    // Only include words that appear multiple times or are meaningful
    if (count >= 2 || meaningfulWords.has(word)) {
      const normalizedCount = count / maxCount;
      let size: WordData['size'];
      if (normalizedCount > 0.7) size = 'hero';
      else if (normalizedCount > 0.4) size = 'large';
      else if (normalizedCount > 0.2) size = 'medium';
      else size = 'small';

      // Boost size for meaningful words
      if (meaningfulWords.has(word) && size === 'small') {
        size = 'medium';
      }

      wordDataArray.push({
        word,
        count,
        size,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  // Sort by count and return top words
  return wordDataArray
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

/**
 * Finds a breakthrough reflection - one that shows significant insight
 */
export function findBreakthroughReflection(reflections: ReflectionForStory[]): ReflectionForStory | null {
  if (reflections.length === 0) return null;

  let bestReflection: ReflectionForStory | null = null;
  let bestScore = 0;

  for (const reflection of reflections) {
    const analysis = analyzeReflection(reflection.text);

    // Calculate breakthrough score
    const score =
      analysis.growthScore * 0.3 +
      analysis.introspectionScore * 0.3 +
      analysis.agencyScore * 0.2 +
      (analysis.emotionalDepth === 'profound' ? 0.2 :
       analysis.emotionalDepth === 'deep' ? 0.1 : 0);

    // Must be at least moderate length
    if (analysis.wordCount >= 30 && score > bestScore) {
      bestScore = score;
      bestReflection = reflection;
    }
  }

  return bestReflection;
}

/**
 * Calculates total words written across all reflections
 */
export function calculateTotalWordsWritten(reflections: ReflectionForStory[]): number {
  return reflections.reduce((total, r) => total + r.wordCount, 0);
}

/**
 * Finds the longest reflection
 */
export function findLongestReflection(reflections: ReflectionForStory[]): ReflectionForStory | null {
  if (reflections.length === 0) return null;
  return reflections.reduce((longest, current) =>
    current.wordCount > longest.wordCount ? current : longest
  );
}

/**
 * Gets reflection statistics
 */
export function getReflectionStats(reflections: ReflectionForStory[]) {
  if (reflections.length === 0) {
    return {
      total: 0,
      totalWords: 0,
      averageLength: 0,
      longestLength: 0,
      shortestLength: 0
    };
  }

  const totalWords = calculateTotalWordsWritten(reflections);
  const lengths = reflections.map(r => r.wordCount);

  return {
    total: reflections.length,
    totalWords,
    averageLength: Math.round(totalWords / reflections.length),
    longestLength: Math.max(...lengths),
    shortestLength: Math.min(...lengths)
  };
}
