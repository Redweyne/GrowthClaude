// ============================================================================
// INSIGHT GENERATOR
// Determines which transformation insights matter most and how to present them.
// ============================================================================

import {
  StoryGenerationContext,
  TransformationInsight,
  InsightType,
  StoryMood,
  SlideType,
} from '@/types/story';
import {
  analyzeReflection,
  findBestContrast,
  findBreakthroughReflection,
  getReflectionStats,
} from './reflectionAnalyzer';
import { analyzePatternEvolution } from './patternAnalyzer';
import {
  ASSESSMENT_DIMENSION_LABELS,
  CONTRAST_TYPE_LABELS,
  LEVEL_TITLES,
  formatStory,
  formatStoryDate,
  formatStoryNumber,
  resolveStoryLocale,
  type StoryLocale,
} from './storyLocale';

interface ScoredInsight extends TransformationInsight {
  priority: number;
  impactScore: number;
}

const COPY = {
  en: {
    transformation: 'Your Transformation',
    contrastEvidence: '{days} days between these reflections',
    contrastType: 'Contrast: {type}',
    momentOfClarity: 'A Moment of Clarity',
    profoundRealization: 'A profound realization emerged.',
    reflectionOn: 'From your reflection on "{lesson}"',
    whoBecoming: "Who You're Becoming",
    createdOn: 'Created {date}',
    identityCount: '{count} identity statements',
    identityEvolution: 'Identity Evolution',
    identityEvolutionDesc: 'From "{first}" to "{latest}"',
    identityJourney: '{count} identity statements across your journey',
    dayMilestone: '{count} Day Milestone',
    consistencyTitle: 'Your Consistency',
    currentStreak: 'Current streak: {count} days',
    longestStreak: 'Longest streak: {count} days',
    consistencyRate: '{count}% consistency rate',
    consistency: {
      d30: '{count} days of showing up. That is no longer luck. It is who you are now.',
      d14: '{count} days strong. You are building something real.',
      d7: 'A full week of consistency. The foundation is set.',
      short: '{count} days and counting. Every day matters.',
    },
    assessmentGrowth: '{label} Growth',
    assessmentDesc: 'Your {label} grew from {from}/10 to {to}/10.',
    assessmentPoints: '+{count} points',
    assessmentImprovement: '{count}% improvement',
    assessmentCount: 'Across {count} assessments',
    lessonsComplete: '{count} Lessons Complete',
    lessonsCompleteDesc: 'You completed {count} lessons on your transformation journey.',
    lessonsTotal: '{count} total lessons completed',
    reflectionsWritten: '{count} Reflections Written',
    reflectionsDesc: '{count} moments of honest self-reflection.',
    totalWords: '{count} total words written',
    smallBook: 'That is a small book about your growth.',
    levelTitle: 'Level {level}: {title}',
    levelDesc: 'You reached the {title} level.',
    xpEarned: '{count} XP earned',
    wisdomApplied: 'Wisdom Applied',
    wisdomDesc: 'You applied {principle} in real life: "{situation}"',
    wisdomOutcome: 'Outcome: {outcome}',
    wisdomCount: '{count} wisdom applications',
    advancedFallback: 'Advanced',
  },
  fr: {
    transformation: "Votre transformation",
    contrastEvidence: "{days} jours entre ces deux réflexions",
    contrastType: "Contraste : {type}",
    momentOfClarity: "Un moment de clarté",
    profoundRealization: "Une prise de conscience profonde a émergé.",
    reflectionOn: "Depuis votre réflexion sur \"{lesson}\"",
    whoBecoming: "La personne que vous devenez",
    createdOn: "Créé le {date}",
    identityCount: "{count} affirmations identitaires",
    identityEvolution: "Évolution identitaire",
    identityEvolutionDesc: "De \"{first}\" à \"{latest}\"",
    identityJourney: "{count} affirmations identitaires sur votre parcours",
    dayMilestone: "Cap des {count} jours",
    consistencyTitle: "Votre constance",
    currentStreak: "Série actuelle : {count} jours",
    longestStreak: "Meilleure série : {count} jours",
    consistencyRate: "{count}% de régularité",
    consistency: {
      d30: "{count} jours à vous présenter. Ce n'est plus de la chance, c'est devenu vous.",
      d14: "{count} jours de suite. Vous construisez quelque chose de solide.",
      d7: "Une semaine complète de constance. La base est posée.",
      short: "{count} jours et cela continue. Chaque jour compte.",
    },
    assessmentGrowth: "Progression en {label}",
    assessmentDesc: "Votre {label} est passée de {from}/10 à {to}/10.",
    assessmentPoints: "+{count} points",
    assessmentImprovement: "{count}% de progression",
    assessmentCount: "Sur {count} évaluations",
    lessonsComplete: "{count} leçons terminées",
    lessonsCompleteDesc: "Vous avez complété {count} leçons sur votre parcours de transformation.",
    lessonsTotal: "{count} leçons terminées au total",
    reflectionsWritten: "{count} réflexions écrites",
    reflectionsDesc: "{count} moments de réflexion sincère sur vous-même.",
    totalWords: "{count} mots écrits au total",
    smallBook: "C'est presque un petit livre sur votre progression.",
    levelTitle: "Niveau {level} : {title}",
    levelDesc: "Vous avez atteint le niveau {title}.",
    xpEarned: "{count} XP gagnés",
    wisdomApplied: "Sagesse appliquée",
    wisdomDesc: "Vous avez appliqué {principle} dans la vraie vie : \"{situation}\"",
    wisdomOutcome: "Résultat : {outcome}",
    wisdomCount: "{count} applications concrètes de sagesse",
    advancedFallback: 'avance',
  },
  ar: {
    transformation: 'تحولك',
    contrastEvidence: '{days} يوما بين هذين التأملين',
    contrastType: 'نوع التحول: {type}',
    momentOfClarity: 'لحظة وضوح',
    profoundRealization: 'ظهرت قناعة عميقة في هذه اللحظة.',
    reflectionOn: 'من تأملك حول "{lesson}"',
    whoBecoming: 'الشخص الذي تصبحه',
    createdOn: 'تمت كتابته في {date}',
    identityCount: '{count} عبارة هوية',
    identityEvolution: 'تطور الهوية',
    identityEvolutionDesc: 'من "{first}" إلى "{latest}"',
    identityJourney: '{count} عبارة هوية عبر رحلتك',
    dayMilestone: 'إنجاز {count} يوم',
    consistencyTitle: 'ثباتك',
    currentStreak: 'السلسلة الحالية: {count} يوم',
    longestStreak: 'أطول سلسلة: {count} يوم',
    consistencyRate: 'معدل الثبات {count}%',
    consistency: {
      d30: '{count} يوما من الحضور المستمر. هذا لم يعد حظا، بل أصبح جزءا منك.',
      d14: '{count} يوما بقوة. أنت تبني شيئا حقيقيا.',
      d7: 'أسبوع كامل من الثبات. الأساس بدأ يترسخ.',
      short: '{count} يوما وما زالت السلسلة مستمرة. كل يوم مهم.',
    },
    assessmentGrowth: 'نمو {label}',
    assessmentDesc: 'ارتفع {label} لديك من {from}/10 إلى {to}/10.',
    assessmentPoints: '+{count} نقاط',
    assessmentImprovement: 'تحسن بنسبة {count}%',
    assessmentCount: 'عبر {count} تقييمات',
    lessonsComplete: 'إكمال {count} درسا',
    lessonsCompleteDesc: 'أكملت {count} درسا في رحلة تحولك.',
    lessonsTotal: '{count} درسا مكتملًا في المجموع',
    reflectionsWritten: 'كتبت {count} تأملا',
    reflectionsDesc: '{count} لحظة من التأمل الصادق مع الذات.',
    totalWords: '{count} كلمة مكتوبة في المجموع',
    smallBook: 'هذا يشبه كتابا صغيرا عن نموك.',
    levelTitle: 'المستوى {level}: {title}',
    levelDesc: 'وصلت إلى مستوى {title}.',
    xpEarned: 'اكتسبت {count} XP',
    wisdomApplied: 'حكمة مطبقة',
    wisdomDesc: 'طبقت {principle} في الحياة الواقعية: "{situation}"',
    wisdomOutcome: 'النتيجة: {outcome}',
    wisdomCount: '{count} تطبيقات للحكمة',
    advancedFallback: 'متقدم',
  },
} as const;

export function generateInsights(context: StoryGenerationContext): TransformationInsight[] {
  const allInsights: ScoredInsight[] = [];

  const contrastInsight = generateContrastInsight(context);
  if (contrastInsight) allInsights.push(contrastInsight);

  const patternInsights = generatePatternInsights(context);
  allInsights.push(...patternInsights);

  const breakthroughInsight = generateBreakthroughInsight(context);
  if (breakthroughInsight) allInsights.push(breakthroughInsight);

  const identityInsights = generateIdentityInsights(context);
  allInsights.push(...identityInsights);

  const consistencyInsight = generateConsistencyInsight(context);
  if (consistencyInsight) allInsights.push(consistencyInsight);

  const assessmentInsights = generateAssessmentInsights(context);
  allInsights.push(...assessmentInsights);

  const milestoneInsights = generateMilestoneInsights(context);
  allInsights.push(...milestoneInsights);

  const wisdomInsight = generateWisdomInsight(context);
  if (wisdomInsight) allInsights.push(wisdomInsight);

  allInsights.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.impactScore - a.impactScore;
  });

  return selectDiverseInsights(allInsights);
}

function selectDiverseInsights(insights: ScoredInsight[], maxCount: number = 8): TransformationInsight[] {
  const selected: TransformationInsight[] = [];
  const typeCount = new Map<InsightType, number>();

  for (const insight of insights) {
    const currentCount = typeCount.get(insight.type) || 0;
    if (currentCount >= 2) continue;

    selected.push({
      type: insight.type,
      title: insight.title,
      description: insight.description,
      evidence: insight.evidence,
      emotionalWeight: insight.emotionalWeight,
      suggestedSlide: insight.suggestedSlide,
    });

    typeCount.set(insight.type, currentCount + 1);
    if (selected.length >= maxCount) break;
  }

  return selected;
}

function generateContrastInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.reflections.length < 3) return null;

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const contrast = findBestContrast(context.reflections, locale);
  if (!contrast || contrast.contrastScore < 0.3) return null;

  const daysBetween = Math.floor(
    (new Date(contrast.after.date).getTime() - new Date(contrast.before.date).getTime())
    / (1000 * 60 * 60 * 24)
  );

  return {
    type: 'first_vs_latest',
    title: copy.transformation,
    description: contrast.growthNarrative,
    evidence: [
      formatStory(copy.contrastEvidence, { days: daysBetween }),
      formatStory(copy.contrastType, { type: CONTRAST_TYPE_LABELS[locale][contrast.contrastType] }),
    ],
    emotionalWeight: contrast.contrastScore > 0.6 ? 'profound' : 'medium',
    suggestedSlide: 'contrast',
    priority: 1,
    impactScore: contrast.contrastScore,
  };
}

function generatePatternInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.patternHistory.length < 2) return [];

  const locale = resolveStoryLocale(context.locale);
  const evolution = analyzePatternEvolution(context.patternHistory, locale);
  const insights: ScoredInsight[] = [];

  for (const shift of evolution.significantShifts) {
    insights.push({
      type: 'pattern_evolution',
      title: `${shift.fromLabel} -> ${shift.toLabel}`,
      description: shift.narrative,
      evidence: [shift.timespan],
      emotionalWeight: shift.significance === 'major' ? 'profound' : shift.significance === 'moderate' ? 'medium' : 'light',
      suggestedSlide: 'pattern_shift',
      priority: 2,
      impactScore: shift.significance === 'major' ? 0.9 : shift.significance === 'moderate' ? 0.7 : 0.4,
    });
  }

  return insights;
}

function generateBreakthroughInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.reflections.length < 5) return null;

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const breakthrough = findBreakthroughReflection(context.reflections);
  if (!breakthrough) return null;

  const analysis = analyzeReflection(breakthrough.text);
  if (analysis.emotionalDepth === 'surface' || analysis.emotionalDepth === 'moderate') return null;

  return {
    type: 'breakthrough_moment',
    title: copy.momentOfClarity,
    description: analysis.keyPhrases[0] || copy.profoundRealization,
    evidence: [
      formatStory(copy.reflectionOn, { lesson: breakthrough.lessonTitle }),
      formatStoryDate(breakthrough.date, locale, { month: 'long', day: 'numeric' }),
    ],
    emotionalWeight: 'profound',
    suggestedSlide: 'reflection_now',
    priority: 3,
    impactScore: analysis.introspectionScore + analysis.growthScore,
  };
}

function generateIdentityInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.identityStatements.length === 0) return [];

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const insights: ScoredInsight[] = [];
  const latest = context.identityStatements[context.identityStatements.length - 1];

  insights.push({
    type: 'identity_formation',
    title: copy.whoBecoming,
    description: latest.statement,
    evidence: [
      formatStory(copy.createdOn, { date: formatStoryDate(latest.date, locale) }),
      formatStory(copy.identityCount, { count: context.identityStatements.length }),
    ],
    emotionalWeight: context.identityStatements.length >= 5 ? 'profound' : 'medium',
    suggestedSlide: 'identity_moment',
    priority: 4,
    impactScore: Math.min(context.identityStatements.length / 10, 1),
  });

  if (context.identityStatements.length >= 3) {
    const first = context.identityStatements[0];
    insights.push({
      type: 'identity_formation',
      title: copy.identityEvolution,
      description: formatStory(copy.identityEvolutionDesc, {
        first: first.statement,
        latest: latest.statement,
      }),
      evidence: [formatStory(copy.identityJourney, { count: context.identityStatements.length })],
      emotionalWeight: 'medium',
      suggestedSlide: 'identity_moment',
      priority: 5,
      impactScore: context.identityStatements.length / 10,
    });
  }

  return insights;
}

function generateConsistencyInsight(context: StoryGenerationContext): ScoredInsight | null {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const { currentStreak, longestStreak, consistencyPercentage } = context.metrics;

  if (currentStreak < 3 && longestStreak < 7) return null;

  const isMilestone = [7, 14, 21, 30, 60, 90, 180, 365].includes(currentStreak);
  let description: string;
  let emotionalWeight: TransformationInsight['emotionalWeight'];

  if (currentStreak >= 30) {
    description = formatStory(copy.consistency.d30, { count: currentStreak });
    emotionalWeight = 'profound';
  } else if (currentStreak >= 14) {
    description = formatStory(copy.consistency.d14, { count: currentStreak });
    emotionalWeight = 'medium';
  } else if (currentStreak >= 7) {
    description = copy.consistency.d7;
    emotionalWeight = 'medium';
  } else {
    description = formatStory(copy.consistency.short, { count: currentStreak });
    emotionalWeight = 'light';
  }

  return {
    type: 'consistency_story',
    title: isMilestone ? formatStory(copy.dayMilestone, { count: currentStreak }) : copy.consistencyTitle,
    description,
    evidence: [
      formatStory(copy.currentStreak, { count: currentStreak }),
      formatStory(copy.longestStreak, { count: longestStreak }),
      formatStory(copy.consistencyRate, { count: Math.round(consistencyPercentage) }),
    ],
    emotionalWeight,
    suggestedSlide: 'streak_highlight',
    priority: isMilestone ? 2 : 5,
    impactScore: Math.min(currentStreak / 30, 1),
  };
}

function generateAssessmentInsights(context: StoryGenerationContext): ScoredInsight[] {
  if (context.assessments.length < 2) return [];

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const labels = ASSESSMENT_DIMENSION_LABELS[locale];
  const insights: ScoredInsight[] = [];
  const first = context.assessments[0];
  const last = context.assessments[context.assessments.length - 1];
  const dimensions = ['emotionalMastery', 'discipline', 'perspective', 'selfAwareness', 'growth'];

  for (const dimension of dimensions) {
    const firstScore = first.scores[dimension] || 0;
    const lastScore = last.scores[dimension] || 0;
    const growth = lastScore - firstScore;

    if (growth >= 2) {
      const growthPercentage = Math.round((growth / Math.max(firstScore, 1)) * 100);
      insights.push({
        type: 'growth_dimension',
        title: formatStory(copy.assessmentGrowth, { label: labels[dimension] }),
        description: formatStory(copy.assessmentDesc, {
          label: labels[dimension].toLowerCase(),
          from: firstScore,
          to: lastScore,
        }),
        evidence: [
          formatStory(copy.assessmentPoints, { count: growth }),
          formatStory(copy.assessmentImprovement, { count: growthPercentage }),
          formatStory(copy.assessmentCount, { count: context.assessments.length }),
        ],
        emotionalWeight: growth >= 4 ? 'profound' : 'medium',
        suggestedSlide: 'assessment_growth',
        priority: 4,
        impactScore: growth / 10,
      });
    }
  }

  return insights.slice(0, 2);
}

function generateMilestoneInsights(context: StoryGenerationContext): ScoredInsight[] {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const levelTitles = LEVEL_TITLES[locale];
  const insights: ScoredInsight[] = [];
  const { lessonsCompleted, totalReflections, totalXpEarned, currentLevel } = context.metrics;

  for (const milestone of [10, 25, 50, 100]) {
    if (lessonsCompleted >= milestone && lessonsCompleted < milestone * 2) {
      insights.push({
        type: 'milestone_reached',
        title: formatStory(copy.lessonsComplete, { count: milestone }),
        description: formatStory(copy.lessonsCompleteDesc, { count: milestone }),
        evidence: [formatStory(copy.lessonsTotal, { count: lessonsCompleted })],
        emotionalWeight: milestone >= 50 ? 'profound' : 'medium',
        suggestedSlide: 'milestone',
        priority: 6,
        impactScore: milestone / 100,
      });
      break;
    }
  }

  for (const milestone of [25, 50, 100, 250]) {
    if (totalReflections >= milestone && totalReflections < milestone * 2) {
      const totalWords = getReflectionStats(context.reflections).totalWords;
      insights.push({
        type: 'milestone_reached',
        title: formatStory(copy.reflectionsWritten, { count: milestone }),
        description: formatStory(copy.reflectionsDesc, { count: milestone }),
        evidence: [
          formatStory(copy.totalWords, { count: formatStoryNumber(totalWords, locale) }),
          copy.smallBook,
        ],
        emotionalWeight: milestone >= 100 ? 'profound' : 'medium',
        suggestedSlide: 'stat_reveal',
        priority: 6,
        impactScore: milestone / 250,
      });
      break;
    }
  }

  if (currentLevel >= 5) {
    const title = levelTitles[currentLevel] || copy.advancedFallback;
    insights.push({
      type: 'milestone_reached',
      title: formatStory(copy.levelTitle, { level: currentLevel, title }),
      description: formatStory(copy.levelDesc, { title }),
      evidence: [formatStory(copy.xpEarned, { count: formatStoryNumber(totalXpEarned, locale) })],
      emotionalWeight: currentLevel >= 7 ? 'profound' : 'medium',
      suggestedSlide: 'milestone',
      priority: 7,
      impactScore: currentLevel / 10,
    });
  }

  return insights;
}

function generateWisdomInsight(context: StoryGenerationContext): ScoredInsight | null {
  if (context.wisdomLogs.length === 0) return null;

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];

  const best = context.wisdomLogs.reduce((selected, current) => {
    const currentScore = current.outcome.length + current.situation.length;
    const selectedScore = selected ? selected.outcome.length + selected.situation.length : 0;
    return currentScore > selectedScore ? current : selected;
  }, context.wisdomLogs[0]);

  return {
    type: 'wisdom_in_action',
    title: copy.wisdomApplied,
    description: formatStory(copy.wisdomDesc, {
      principle: best.principle,
      situation: best.situation,
    }),
    evidence: [
      formatStory(copy.wisdomOutcome, { outcome: best.outcome }),
      formatStory(copy.wisdomCount, { count: context.wisdomLogs.length }),
    ],
    emotionalWeight: context.wisdomLogs.length >= 5 ? 'profound' : 'medium',
    suggestedSlide: 'wisdom_applied',
    priority: 5,
    impactScore: Math.min(context.wisdomLogs.length / 10, 1),
  };
}

export function determineStoryMood(insights: TransformationInsight[]): StoryMood {
  const profoundCount = insights.filter((insight) => insight.emotionalWeight === 'profound').length;
  const hasContrast = insights.some((insight) => insight.type === 'first_vs_latest');
  const hasPattern = insights.some((insight) => insight.type === 'pattern_evolution');
  const hasIdentity = insights.some((insight) => insight.type === 'identity_formation');

  if (hasIdentity && hasPattern && profoundCount >= 2) return 'transformative';
  if (profoundCount >= 3 || insights.some((insight) => insight.type === 'milestone_reached' && insight.emotionalWeight === 'profound')) {
    return 'triumphant';
  }
  if (insights.some((insight) => insight.type === 'consistency_story' && insight.emotionalWeight !== 'light')) return 'resilient';
  if (hasContrast && insights.length <= 4) return 'awakening';
  return 'reflective';
}

export function suggestSlideTypes(insights: TransformationInsight[]): SlideType[] {
  const slides: SlideType[] = ['opening'];
  slides.push('journey_start');

  for (const insight of insights) {
    if (!slides.includes(insight.suggestedSlide)) {
      slides.push(insight.suggestedSlide);
    }
  }

  if (!slides.includes('stat_reveal')) {
    slides.push('stat_reveal');
  }

  slides.push('closing');
  slides.push('call_to_action');
  return slides;
}
