// ============================================================================
// REFLECTION ANALYZER
// Extracts meaningful insights, contrasts, and growth patterns from reflections.
// ============================================================================

import { ReflectionForStory, WordData } from '@/types/story';
import { resolveStoryLocale, type StoryLocale, joinStorySentences } from './storyLocale';
import {
  STRUGGLE_INDICATORS,
  GROWTH_INDICATORS,
  AGENCY_INDICATORS,
  INTROSPECTION_INDICATORS,
  FIRST_PERSON_MARKERS,
  MEANINGFUL_WORDS,
  STOP_WORDS,
  THEME_KEYWORDS,
} from './storyLexicon';

export interface ReflectionAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  struggleScore: number;
  growthScore: number;
  agencyScore: number;
  introspectionScore: number;
  overallSentiment: 'struggling' | 'neutral' | 'growing' | 'thriving';
  emotionalDepth: 'surface' | 'moderate' | 'deep' | 'profound';
  keyPhrases: string[];
  themes: string[];
}

export interface ReflectionContrast {
  before: ReflectionForStory;
  after: ReflectionForStory;
  contrastScore: number;
  beforeAnalysis: ReflectionAnalysis;
  afterAnalysis: ReflectionAnalysis;
  growthNarrative: string;
  contrastType: 'struggle_to_growth' | 'confusion_to_clarity' | 'passive_to_active' | 'surface_to_deep';
}

const GROWTH_NARRATIVE_COPY: Record<StoryLocale, {
  struggleToGrowth: string;
  agency: string;
  depth: string;
  acceptance: string;
  fallback: string;
}> = {
  en: {
    struggleToGrowth: 'You moved from struggle to growth.',
    agency: 'You found your agency and power to act.',
    depth: 'Your self-reflection deepened profoundly.',
    acceptance: 'You learned to accept what you cannot control.',
    fallback: 'Your perspective has evolved meaningfully.',
  },
  fr: {
    struggleToGrowth: "Vous êtes passé de la lutte à la progression.",
    agency: "Vous avez retrouvé votre pouvoir d'agir.",
    depth: "Votre introspection s'est approfondie de façon nette.",
    acceptance: "Vous avez appris à accepter ce qui ne dépend pas de vous.",
    fallback: "Votre regard sur les choses a évolué avec sens.",
  },
  ar: {
    struggleToGrowth: 'انتقلت من الصراع إلى النمو.',
    agency: 'استعدت قدرتك على الفعل والاختيار.',
    depth: 'تعمق تأملك الذاتي بشكل واضح.',
    acceptance: 'تعلمت أن تتقبل ما لا يقع تحت سيطرتك.',
    fallback: 'لقد تطور منظورك بشكل ملموس.',
  },
};

export function analyzeReflection(text: string): ReflectionAnalysis {
  const normalizedText = normalizeText(text);
  const words = tokenize(text);
  const sentences = splitSentences(text);

  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);

  const struggleScore = calculateIndicatorScore(normalizedText, STRUGGLE_INDICATORS, wordCount);
  const growthScore = calculateIndicatorScore(normalizedText, GROWTH_INDICATORS, wordCount);
  const agencyScore = calculateIndicatorScore(normalizedText, AGENCY_INDICATORS, wordCount);
  const introspectionScore = calculateIndicatorScore(normalizedText, INTROSPECTION_INDICATORS, wordCount);

  const sentimentDelta = growthScore - struggleScore;
  let overallSentiment: ReflectionAnalysis['overallSentiment'];
  if (sentimentDelta > 0.3) overallSentiment = 'thriving';
  else if (sentimentDelta > 0.1) overallSentiment = 'growing';
  else if (sentimentDelta < -0.2) overallSentiment = 'struggling';
  else overallSentiment = 'neutral';

  const depthScore = introspectionScore + (agencyScore * 0.5) + (wordCount > 100 ? 0.2 : 0);
  let emotionalDepth: ReflectionAnalysis['emotionalDepth'];
  if (depthScore > 0.5) emotionalDepth = 'profound';
  else if (depthScore > 0.3) emotionalDepth = 'deep';
  else if (depthScore > 0.15) emotionalDepth = 'moderate';
  else emotionalDepth = 'surface';

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
    keyPhrases: extractKeyPhrases(sentences),
    themes: identifyThemes(normalizedText),
  };
}

function calculateIndicatorScore(text: string, indicators: string[], totalWords: number): number {
  if (totalWords === 0) return 0;

  let matchCount = 0;
  for (const indicator of indicators) {
    matchCount += countOccurrences(text, normalizeText(indicator));
  }

  const rawScore = matchCount / totalWords;
  return Math.min(rawScore * 10, 1);
}

function extractKeyPhrases(sentences: string[]): string[] {
  const allIndicators = [...GROWTH_INDICATORS, ...INTROSPECTION_INDICATORS, ...AGENCY_INDICATORS];

  const scored = sentences.map((sentence) => {
    const normalized = normalizeText(sentence);
    let score = 0;

    for (const indicator of allIndicators) {
      if (normalized.includes(normalizeText(indicator))) score += 1;
    }

    for (const marker of FIRST_PERSON_MARKERS) {
      if (normalized.includes(normalizeText(marker))) {
        score += 0.5;
        break;
      }
    }

    if (tokenize(sentence).length < 5) score -= 1;

    return { sentence: sentence.trim(), score };
  });

  return scored
    .filter((item) => item.score > 0.5 && item.sentence.length > 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.sentence);
}

function identifyThemes(text: string): string[] {
  const themes: string[] = [];

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(normalizeText(keyword)))) {
      themes.push(theme);
    }
  }

  return themes;
}

export function findBestContrast(
  reflections: ReflectionForStory[],
  locale: StoryLocale = 'en'
): ReflectionContrast | null {
  if (reflections.length < 2) return null;

  const safeLocale = resolveStoryLocale(locale);
  const sorted = [...reflections].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const analyzed = sorted.map((reflection) => ({
    reflection,
    analysis: analyzeReflection(reflection.text),
  }));

  let bestContrast: ReflectionContrast | null = null;
  let bestScore = 0;

  const earlyReflections = analyzed.slice(0, Math.ceil(analyzed.length * 0.3));
  const lateReflections = analyzed.slice(Math.floor(analyzed.length * 0.7));

  for (const early of earlyReflections) {
    for (const late of lateReflections) {
      const contrast = calculateContrastScore(early.analysis, late.analysis);
      const isPositiveGrowth =
        late.analysis.growthScore > early.analysis.growthScore ||
        late.analysis.agencyScore > early.analysis.agencyScore ||
        (late.analysis.emotionalDepth !== 'surface' && early.analysis.emotionalDepth === 'surface');

      if (contrast > bestScore && isPositiveGrowth) {
        bestScore = contrast;
        bestContrast = {
          before: early.reflection,
          after: late.reflection,
          contrastScore: contrast,
          beforeAnalysis: early.analysis,
          afterAnalysis: late.analysis,
          growthNarrative: generateGrowthNarrative(early.analysis, late.analysis, safeLocale),
          contrastType: determineContrastType(early.analysis, late.analysis),
        };
      }
    }
  }

  return bestContrast;
}

function calculateContrastScore(before: ReflectionAnalysis, after: ReflectionAnalysis): number {
  const growthDelta = after.growthScore - before.growthScore;
  const struggleDelta = before.struggleScore - after.struggleScore;
  const agencyDelta = after.agencyScore - before.agencyScore;
  const depthMap = { surface: 0, moderate: 1, deep: 2, profound: 3 };
  const depthDelta = depthMap[after.emotionalDepth] - depthMap[before.emotionalDepth];

  const score = (
    Math.max(0, growthDelta) * 0.3 +
    Math.max(0, struggleDelta) * 0.3 +
    Math.max(0, agencyDelta) * 0.2 +
    Math.max(0, depthDelta) * 0.2
  );

  return Math.min(score, 1);
}

function generateGrowthNarrative(
  before: ReflectionAnalysis,
  after: ReflectionAnalysis,
  locale: StoryLocale
): string {
  const copy = GROWTH_NARRATIVE_COPY[locale];
  const parts: string[] = [];

  if (before.struggleScore > 0.3 && after.growthScore > before.struggleScore) {
    parts.push(copy.struggleToGrowth);
  }

  if (after.agencyScore > before.agencyScore + 0.2) {
    parts.push(copy.agency);
  }

  if (after.emotionalDepth === 'profound' && before.emotionalDepth === 'surface') {
    parts.push(copy.depth);
  }

  if (after.themes.includes('acceptance') && before.themes.includes('control')) {
    parts.push(copy.acceptance);
  }

  if (parts.length === 0) {
    parts.push(copy.fallback);
  }

  return joinStorySentences(parts);
}

function determineContrastType(
  before: ReflectionAnalysis,
  after: ReflectionAnalysis
): ReflectionContrast['contrastType'] {
  const struggleDelta = before.struggleScore - after.struggleScore;
  const growthDelta = after.growthScore - before.growthScore;
  const agencyDelta = after.agencyScore - before.agencyScore;
  const depthOrder: ReflectionAnalysis['emotionalDepth'][] = ['surface', 'moderate', 'deep', 'profound'];
  const depthDelta = depthOrder.indexOf(after.emotionalDepth) - depthOrder.indexOf(before.emotionalDepth);

  if (struggleDelta > 0.2 && growthDelta > 0.2) return 'struggle_to_growth';
  if (depthDelta >= 2) return 'surface_to_deep';
  if (agencyDelta > 0.3) return 'passive_to_active';
  return 'confusion_to_clarity';
}

export function analyzeWordFrequency(reflections: ReflectionForStory[]): WordData[] {
  const wordCounts = new Map<string, number>();
  const stopWords = new Set(STOP_WORDS.map(normalizeText));
  const meaningfulWords = new Set(MEANINGFUL_WORDS.map(normalizeText));

  for (const reflection of reflections) {
    const words = tokenize(reflection.text)
      .map(normalizeText)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  if (wordCounts.size === 0) return [];

  const wordDataArray: WordData[] = [];
  const maxCount = Math.max(1, ...Array.from(wordCounts.values()));
  const colors = ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  for (const [word, count] of wordCounts.entries()) {
    if (count < 2 && !meaningfulWords.has(word)) continue;

    const normalizedCount = count / maxCount;
    let size: WordData['size'];
    if (normalizedCount > 0.7) size = 'hero';
    else if (normalizedCount > 0.4) size = 'large';
    else if (normalizedCount > 0.2) size = 'medium';
    else size = 'small';

    if (meaningfulWords.has(word) && size === 'small') {
      size = 'medium';
    }

    wordDataArray.push({
      word,
      count,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return wordDataArray
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

export function findBreakthroughReflection(reflections: ReflectionForStory[]): ReflectionForStory | null {
  if (reflections.length === 0) return null;

  let bestReflection: ReflectionForStory | null = null;
  let bestScore = 0;

  for (const reflection of reflections) {
    const analysis = analyzeReflection(reflection.text);
    const score =
      analysis.growthScore * 0.3 +
      analysis.introspectionScore * 0.3 +
      analysis.agencyScore * 0.2 +
      (analysis.emotionalDepth === 'profound' ? 0.2 : analysis.emotionalDepth === 'deep' ? 0.1 : 0);

    if (analysis.wordCount >= 30 && score > bestScore) {
      bestScore = score;
      bestReflection = reflection;
    }
  }

  return bestReflection;
}

export function calculateTotalWordsWritten(reflections: ReflectionForStory[]): number {
  return reflections.reduce((total, reflection) => total + reflection.wordCount, 0);
}

export function findLongestReflection(reflections: ReflectionForStory[]): ReflectionForStory | null {
  if (reflections.length === 0) return null;
  return reflections.reduce((longest, current) =>
    current.wordCount > longest.wordCount ? current : longest
  );
}

export function getReflectionStats(reflections: ReflectionForStory[]) {
  if (reflections.length === 0) {
    return {
      total: 0,
      totalWords: 0,
      averageLength: 0,
      longestLength: 0,
      shortestLength: 0,
    };
  }

  const totalWords = calculateTotalWordsWritten(reflections);
  const lengths = reflections.map((reflection) => reflection.wordCount);

  return {
    total: reflections.length,
    totalWords,
    averageLength: Math.round(totalWords / reflections.length),
    longestLength: Math.max(...lengths),
    shortestLength: Math.min(...lengths),
  };
}

function tokenize(text: string): string[] {
  return text
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?؟]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countOccurrences(text: string, indicator: string): number {
  if (!indicator) return 0;
  const pattern = new RegExp(escapeRegExp(indicator), 'gu');
  return text.match(pattern)?.length || 0;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
