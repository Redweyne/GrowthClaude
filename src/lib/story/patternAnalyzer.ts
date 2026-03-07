// ============================================================================
// PATTERN EVOLUTION ANALYZER
// Tracks how thought patterns shift over time.
// ============================================================================

import {
  MonthlyPatternForStory,
  PatternData,
  TransformationInsight,
} from '@/types/story';
import { formatStory, formatStoryMonthLabel, joinStorySentences, resolveStoryLocale, type StoryLocale } from './storyLocale';

export const CHALLENGE_PATTERNS = {
  control: { color: '#EF4444', category: 'challenge' as const },
  judgment: { color: '#F97316', category: 'challenge' as const },
  anger: { color: '#DC2626', category: 'challenge' as const },
  fear: { color: '#7C3AED', category: 'challenge' as const },
  comparison: { color: '#EC4899', category: 'challenge' as const },
  procrastination: { color: '#F59E0B', category: 'challenge' as const },
};

export const GROWTH_PATTERNS = {
  acceptance: { color: '#10B981', category: 'growth' as const },
  patience: { color: '#06B6D4', category: 'growth' as const },
  courage: { color: '#8B5CF6', category: 'growth' as const },
  discipline: { color: '#3B82F6', category: 'growth' as const },
  gratitude: { color: '#F59E0B', category: 'growth' as const },
  perspective: { color: '#6366F1', category: 'growth' as const },
  presence: { color: '#14B8A6', category: 'growth' as const },
  resilience: { color: '#22C55E', category: 'growth' as const },
};

export const ALL_PATTERNS = { ...CHALLENGE_PATTERNS, ...GROWTH_PATTERNS };
export type PatternKey = keyof typeof ALL_PATTERNS;

const PATTERN_LABELS: Record<StoryLocale, Record<PatternKey, string>> = {
  en: {
    control: 'Control',
    judgment: 'Judgment',
    anger: 'Anger',
    fear: 'Fear',
    comparison: 'Comparison',
    procrastination: 'Procrastination',
    acceptance: 'Acceptance',
    patience: 'Patience',
    courage: 'Courage',
    discipline: 'Discipline',
    gratitude: 'Gratitude',
    perspective: 'Perspective',
    presence: 'Presence',
    resilience: 'Resilience',
  },
  fr: {
    control: 'Controle',
    judgment: 'Jugement',
    anger: 'Colere',
    fear: 'Peur',
    comparison: 'Comparaison',
    procrastination: 'Procrastination',
    acceptance: 'Acceptation',
    patience: 'Patience',
    courage: 'Courage',
    discipline: 'Discipline',
    gratitude: 'Gratitude',
    perspective: 'Perspective',
    presence: 'Presence',
    resilience: 'Resilience',
  },
  ar: {
    control: 'التحكم',
    judgment: 'الحكم',
    anger: 'الغضب',
    fear: 'الخوف',
    comparison: 'المقارنة',
    procrastination: 'التسويف',
    acceptance: 'التقبل',
    patience: 'الصبر',
    courage: 'الشجاعة',
    discipline: 'الانضباط',
    gratitude: 'الامتنان',
    perspective: 'المنظور',
    presence: 'الحضور',
    resilience: 'المرونة',
  },
};

const COPY = {
  en: {
    beginning: 'Your journey is just beginning.',
    waiting: 'Your transformation story is waiting to be written.',
    oneMonthGrowth: 'Your reflections show a foundation of growth-oriented thinking.',
    oneMonthChallenge: 'You are honestly facing your challenges. That is where growth begins.',
    oneMonthBalanced: 'Your journey has begun with honest self-reflection.',
    trajectory: {
      improving: 'Your thought patterns have shifted remarkably.',
      stable: 'You have maintained consistent growth in your thinking.',
      mixed: 'Your journey shows the natural ebb and flow of growth.',
      declining: 'You are working through challenges right now. That is part of the journey.',
    },
    challengeToGrowth: 'Where challenges once dominated your thoughts, growth now leads the way.',
    upwardTitle: 'Upward Trajectory',
    upwardDescription: 'Your overall thought patterns are shifting toward growth.',
    trackedAcross: 'Tracked across {count} months',
    timespan: '{from} to {to}',
    amplified: 'Your {label} has deepened significantly.',
    shift: {
      major: [
        'A profound shift: where {from} once dominated, {to} has taken root.',
        'Your relationship with {from} has transformed into {to}.',
        'From {from} to {to}. This is real transformation.',
      ],
      moderate: [
        '{from} is giving way to {to} in your reflections.',
        'You are finding more {to} where {from} used to be.',
        'The shift from {from} to {to} is becoming clear.',
      ],
      minor: [
        'Seeds of {to} are growing where {from} once was.',
        '{to} is beginning to replace {from}.',
      ],
    },
  },
  fr: {
    beginning: "Votre chemin commence à peine.",
    waiting: "Votre histoire de transformation attend encore de se révéler.",
    oneMonthGrowth: "Vos réflexions montrent déjà une base tournée vers la progression.",
    oneMonthChallenge: "Vous regardez vos difficultés avec honnêteté. C'est là que la progression commence.",
    oneMonthBalanced: "Votre chemin a commencé par une vraie réflexion sur vous-même.",
    trajectory: {
      improving: "Vos schémas de pensée ont nettement évolué.",
      stable: "Vous avez maintenu une progression régulière dans votre façon de penser.",
      mixed: "Votre parcours montre le mouvement naturel de toute progression.",
      declining: "Vous traversez une phase de difficulté. Cela fait partie du parcours.",
    },
    challengeToGrowth: "Là où les difficultés dominaient avant, la progression prend maintenant la place centrale.",
    upwardTitle: "Trajectoire ascendante",
    upwardDescription: "Votre façon de penser s'oriente de plus en plus vers la croissance.",
    trackedAcross: "Observé sur {count} mois",
    timespan: "De {from} à {to}",
    amplified: "Votre {label} s'est renforcée de façon nette.",
    shift: {
      major: [
        "Un basculement profond : là où {from} dominait, {to} a pris racine.",
        "Votre relation à {from} s'est transformée en {to}.",
        "Passer de {from} à {to}, c'est une vraie transformation.",
      ],
      moderate: [
        "{from} laisse progressivement place à {to} dans vos réflexions.",
        "Vous trouvez davantage de {to} là où {from} dominait avant.",
        "Le passage de {from} à {to} devient de plus en plus clair.",
      ],
      minor: [
        "Des graines de {to} apparaissent là où {from} était plus présente.",
        "{to} commence à remplacer {from}.",
      ],
    },
  },
  ar: {
    beginning: 'رحلتك ما زالت في بدايتها.',
    waiting: 'قصة تحولك ما زالت تنتظر أن تُكتب.',
    oneMonthGrowth: 'تعكس تأملاتك أساسا واضحا من التفكير المتجه نحو النمو.',
    oneMonthChallenge: 'أنت تواجه تحدياتك بصدق، ومن هنا يبدأ النمو.',
    oneMonthBalanced: 'بدأت رحلتك بتأمل صادق في الذات.',
    trajectory: {
      improving: 'أنماط تفكيرك تغيرت بشكل ملحوظ.',
      stable: 'حافظت على نمو ثابت في طريقة تفكيرك.',
      mixed: 'رحلتك تعكس المد والجزر الطبيعي لأي نمو حقيقي.',
      declining: 'أنت تمر بمرحلة تعمل فيها عبر التحديات، وهذا جزء من الرحلة.',
    },
    challengeToGrowth: 'بعد أن كانت التحديات تهيمن على أفكارك، أصبح النمو يقود الطريق الآن.',
    upwardTitle: 'مسار صاعد',
    upwardDescription: 'أنماط تفكيرك العامة تتحرك أكثر نحو النمو.',
    trackedAcross: 'تم تتبعها عبر {count} أشهر',
    timespan: 'من {from} إلى {to}',
    amplified: 'لقد تعمق {label} لديك بشكل واضح.',
    shift: {
      major: [
        'تحول عميق: بعد أن كان {from} مهيمنا، ترسخ {to}.',
        'علاقتك مع {from} تحولت إلى {to}.',
        'الانتقال من {from} إلى {to} هو تحول حقيقي.',
      ],
      moderate: [
        'يبدأ {from} في التراجع بينما يظهر {to} أكثر في تأملاتك.',
        'أصبحت تجد {to} أكثر حيث كان {from} يسيطر من قبل.',
        'التحول من {from} إلى {to} أصبح أكثر وضوحا.',
      ],
      minor: [
        'بذور {to} تنمو حيث كان {from} حاضرا من قبل.',
        'بدأ {to} يحل محل {from}.',
      ],
    },
  },
} as const;

export interface PatternEvolutionResult {
  currentDominantPatterns: PatternData[];
  patternHistory: MonthlyPatternSnapshot[];
  significantShifts: PatternShift[];
  trajectory: 'improving' | 'stable' | 'mixed' | 'declining';
  evolutionNarrative: string;
  insights: TransformationInsight[];
}

export interface MonthlyPatternSnapshot {
  month: string;
  monthLabel: string;
  challengePatterns: PatternData[];
  growthPatterns: PatternData[];
  dominantCategory: 'challenge' | 'growth' | 'balanced';
  totalMentions: number;
}

export interface PatternShift {
  from: PatternKey;
  to: PatternKey;
  fromLabel: string;
  toLabel: string;
  shiftType: 'challenge_to_growth' | 'growth_amplified' | 'challenge_reduced';
  significance: 'minor' | 'moderate' | 'major';
  timespan: string;
  narrative: string;
}

export function analyzePatternEvolution(
  monthlyData: MonthlyPatternForStory[],
  locale: StoryLocale = 'en'
): PatternEvolutionResult {
  const safeLocale = resolveStoryLocale(locale);

  if (monthlyData.length === 0) {
    return {
      currentDominantPatterns: [],
      patternHistory: [],
      significantShifts: [],
      trajectory: 'stable',
      evolutionNarrative: COPY[safeLocale].beginning,
      insights: [],
    };
  }

  const sorted = [...monthlyData].sort((a, b) => a.month.localeCompare(b.month));
  const patternHistory = sorted.map((data) => createMonthlySnapshot(data, safeLocale));
  const currentSnapshot = patternHistory[patternHistory.length - 1];
  const currentDominantPatterns = [
    ...currentSnapshot.growthPatterns.slice(0, 3),
    ...currentSnapshot.challengePatterns.slice(0, 2),
  ].sort((a, b) => b.count - a.count).slice(0, 5);

  const significantShifts = detectPatternShifts(patternHistory, safeLocale);
  const trajectory = determineTrajectory(patternHistory);
  const evolutionNarrative = generateEvolutionNarrative(patternHistory, significantShifts, trajectory, safeLocale);
  const insights = generatePatternInsights(patternHistory, significantShifts, safeLocale);

  return {
    currentDominantPatterns,
    patternHistory,
    significantShifts,
    trajectory,
    evolutionNarrative,
    insights,
  };
}

function createMonthlySnapshot(data: MonthlyPatternForStory, locale: StoryLocale): MonthlyPatternSnapshot {
  const labels = PATTERN_LABELS[locale];
  const challengePatterns: PatternData[] = [];
  const growthPatterns: PatternData[] = [];

  let challengeTotal = 0;
  let growthTotal = 0;

  for (const [key, count] of Object.entries(data.themes)) {
    if (count === 0) continue;

    const pattern = ALL_PATTERNS[key as PatternKey];
    if (!pattern) continue;

    const patternData: PatternData = {
      theme: key,
      label: labels[key as PatternKey],
      count,
      trend: 'stable',
      color: pattern.color,
    };

    if (pattern.category === 'challenge') {
      challengePatterns.push(patternData);
      challengeTotal += count;
    } else {
      growthPatterns.push(patternData);
      growthTotal += count;
    }
  }

  challengePatterns.sort((a, b) => b.count - a.count);
  growthPatterns.sort((a, b) => b.count - a.count);

  let dominantCategory: MonthlyPatternSnapshot['dominantCategory'];
  if (growthTotal > challengeTotal * 1.5) dominantCategory = 'growth';
  else if (challengeTotal > growthTotal * 1.5) dominantCategory = 'challenge';
  else dominantCategory = 'balanced';

  return {
    month: data.month,
    monthLabel: formatStoryMonthLabel(data.month, locale),
    challengePatterns,
    growthPatterns,
    dominantCategory,
    totalMentions: challengeTotal + growthTotal,
  };
}

function detectPatternShifts(history: MonthlyPatternSnapshot[], locale: StoryLocale): PatternShift[] {
  if (history.length < 2) return [];

  const copy = COPY[locale];
  const shifts: PatternShift[] = [];
  const first = history[0];
  const last = history[history.length - 1];

  const firstChallenges = new Map(first.challengePatterns.map((pattern) => [pattern.theme, pattern.count]));
  const firstGrowth = new Map(first.growthPatterns.map((pattern) => [pattern.theme, pattern.count]));
  const lastChallenges = new Map(last.challengePatterns.map((pattern) => [pattern.theme, pattern.count]));
  const lastGrowth = new Map(last.growthPatterns.map((pattern) => [pattern.theme, pattern.count]));

  for (const challengeKey of Object.keys(CHALLENGE_PATTERNS) as PatternKey[]) {
    const firstCount = firstChallenges.get(challengeKey) || 0;
    const lastCount = lastChallenges.get(challengeKey) || 0;

    if (firstCount >= 3 && lastCount < firstCount * 0.5) {
      for (const growthKey of Object.keys(GROWTH_PATTERNS) as PatternKey[]) {
        const firstGrowthCount = firstGrowth.get(growthKey) || 0;
        const lastGrowthCount = lastGrowth.get(growthKey) || 0;

        if (lastGrowthCount > firstGrowthCount + 2) {
          const significance = lastGrowthCount - firstGrowthCount >= 5
            ? 'major'
            : lastGrowthCount - firstGrowthCount >= 3
              ? 'moderate'
              : 'minor';

          shifts.push({
            from: challengeKey,
            to: growthKey,
            fromLabel: PATTERN_LABELS[locale][challengeKey],
            toLabel: PATTERN_LABELS[locale][growthKey],
            shiftType: 'challenge_to_growth',
            significance,
            timespan: formatStory(copy.timespan, { from: first.monthLabel, to: last.monthLabel }),
            narrative: generateShiftNarrative(challengeKey, growthKey, significance, locale),
          });
          break;
        }
      }
    }
  }

  for (const growthKey of Object.keys(GROWTH_PATTERNS) as PatternKey[]) {
    const firstCount = firstGrowth.get(growthKey) || 0;
    const lastCount = lastGrowth.get(growthKey) || 0;

    if (lastCount >= firstCount + 4) {
      const significance = lastCount - firstCount >= 8 ? 'major' : lastCount - firstCount >= 5 ? 'moderate' : 'minor';
      shifts.push({
        from: growthKey,
        to: growthKey,
        fromLabel: PATTERN_LABELS[locale][growthKey],
        toLabel: PATTERN_LABELS[locale][growthKey],
        shiftType: 'growth_amplified',
        significance,
        timespan: formatStory(copy.timespan, { from: first.monthLabel, to: last.monthLabel }),
        narrative: formatStory(copy.amplified, { label: PATTERN_LABELS[locale][growthKey].toLowerCase() }),
      });
    }
  }

  const significanceOrder = { major: 0, moderate: 1, minor: 2 };
  shifts.sort((a, b) => significanceOrder[a.significance] - significanceOrder[b.significance]);
  return shifts.slice(0, 3);
}

function generateShiftNarrative(
  from: PatternKey,
  to: PatternKey,
  significance: PatternShift['significance'],
  locale: StoryLocale
): string {
  const options = COPY[locale].shift[significance];
  const template = options[Math.floor(Math.random() * options.length)];
  return formatStory(template, {
    from: PATTERN_LABELS[locale][from].toLowerCase(),
    to: PATTERN_LABELS[locale][to].toLowerCase(),
  });
}

function determineTrajectory(history: MonthlyPatternSnapshot[]): PatternEvolutionResult['trajectory'] {
  if (history.length < 2) return 'stable';

  const recentHalf = history.slice(Math.floor(history.length / 2));
  const earlierHalf = history.slice(0, Math.floor(history.length / 2));

  const getGrowthRatio = (snapshots: MonthlyPatternSnapshot[]) => {
    let growthTotal = 0;
    let challengeTotal = 0;

    for (const snapshot of snapshots) {
      growthTotal += snapshot.growthPatterns.reduce((sum, pattern) => sum + pattern.count, 0);
      challengeTotal += snapshot.challengePatterns.reduce((sum, pattern) => sum + pattern.count, 0);
    }

    return challengeTotal === 0 ? 1 : growthTotal / Math.max(challengeTotal, 1);
  };

  const earlierRatio = getGrowthRatio(earlierHalf);
  const recentRatio = getGrowthRatio(recentHalf);
  const improvement = recentRatio - earlierRatio;

  if (improvement > 0.5) return 'improving';
  if (improvement < -0.3) return 'declining';
  if (Math.abs(improvement) < 0.1) return 'stable';
  return 'mixed';
}

function generateEvolutionNarrative(
  history: MonthlyPatternSnapshot[],
  shifts: PatternShift[],
  trajectory: PatternEvolutionResult['trajectory'],
  locale: StoryLocale
): string {
  const copy = COPY[locale];

  if (history.length === 0) return copy.waiting;

  if (history.length === 1) {
    const snapshot = history[0];
    if (snapshot.dominantCategory === 'growth') return copy.oneMonthGrowth;
    if (snapshot.dominantCategory === 'challenge') return copy.oneMonthChallenge;
    return copy.oneMonthBalanced;
  }

  const first = history[0];
  const last = history[history.length - 1];
  const parts: string[] = [copy.trajectory[trajectory]];

  if (shifts.length > 0 && shifts[0].significance !== 'minor') {
    parts.push(shifts[0].narrative);
  }

  if (first.dominantCategory !== last.dominantCategory) {
    if (first.dominantCategory === 'challenge' && last.dominantCategory === 'growth') {
      parts.push(copy.challengeToGrowth);
    }
  }

  return joinStorySentences(parts);
}

function generatePatternInsights(
  history: MonthlyPatternSnapshot[],
  shifts: PatternShift[],
  locale: StoryLocale
): TransformationInsight[] {
  const insights: TransformationInsight[] = [];
  const copy = COPY[locale];

  for (const shift of shifts) {
    if (shift.shiftType === 'challenge_to_growth') {
      insights.push({
        type: 'pattern_evolution',
        title: `${shift.fromLabel} -> ${shift.toLabel}`,
        description: shift.narrative,
        evidence: [shift.timespan],
        emotionalWeight: shift.significance === 'major' ? 'profound' : 'medium',
        suggestedSlide: 'pattern_shift',
      });
    }
  }

  if (history.length >= 2 && determineTrajectory(history) === 'improving') {
    insights.push({
      type: 'pattern_evolution',
      title: copy.upwardTitle,
      description: copy.upwardDescription,
      evidence: [formatStory(copy.trackedAcross, { count: history.length })],
      emotionalWeight: 'medium',
      suggestedSlide: 'pattern_shift',
    });
  }

  return insights;
}

export function getMostSignificantShift(
  monthlyData: MonthlyPatternForStory[],
  locale: StoryLocale = 'en'
): PatternShift | null {
  const analysis = analyzePatternEvolution(monthlyData, locale);
  return analysis.significantShifts[0] || null;
}

export function formatPatternsForSlide(
  earlierMonth: MonthlyPatternForStory,
  laterMonth: MonthlyPatternForStory,
  locale: StoryLocale = 'en'
): { fromPatterns: PatternData[]; toPatterns: PatternData[] } {
  const safeLocale = resolveStoryLocale(locale);
  const earlier = createMonthlySnapshot(earlierMonth, safeLocale);
  const later = createMonthlySnapshot(laterMonth, safeLocale);

  const fromPatterns = earlier.challengePatterns.slice(0, 3).map((pattern) => ({
    ...pattern,
    trend: 'down' as const,
  }));

  const toPatterns = later.growthPatterns.slice(0, 3).map((pattern) => ({
    ...pattern,
    trend: 'up' as const,
  }));

  return { fromPatterns, toPatterns };
}
