'use client';

// ============================================================================
// USE TRANSFORMATION STORY HOOK
// Bridges the store with the story generation system.
// ============================================================================

import { useMemo, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import {
  StoryGenerationContext,
  StoryMetrics,
  TransformationStory,
  StoryType,
  ReflectionForStory,
  IdentityForStory,
  AssessmentForStory,
  WisdomLogForStory,
  MonthlyPatternForStory,
} from '@/types/story';
import { buildTransformationStory } from '@/lib/story';
import { formatStory, resolveStoryLocale, type StoryLocale } from '@/lib/story/storyLocale';
import { PATTERN_HISTORY_KEYS, THEME_KEYWORDS } from '@/lib/story/storyLexicon';

const COPY = {
  en: {
    personalReflection: 'Personal reflection',
    minutes: '{count} minutes',
    hours: '{count} hours',
    days: '{count} days',
    demoUser: 'Demo User',
    whyStatement: 'I want to find calm in the chaos and become the best version of myself.',
    lessons: [
      'Introduction to Stoicism',
      'The Dichotomy of Control',
      'The Stoic Morning',
      'Negative Visualization',
      'The Obstacle Is the Way',
      'Living in the Present',
    ],
    reflections: [
      'I keep trying to control everything around me and it is exhausting. My boss made a decision I disagree with, and I spent the whole night stressed about it. I realize now that I waste so much energy fighting battles I cannot win.',
      'Today I caught myself getting angry about traffic. Then I remembered that this is outside my control. For the first time, I felt my shoulders drop. I cannot control traffic, but I can control my response.',
      'I started my morning with ten quiet minutes before checking my phone. It felt strange at first, but by the end my mind was clearer than usual. It was a small win, but it mattered.',
      'I imagined losing the things I love. Instead of feeling empty, I felt grateful for what I still have. My problems suddenly felt smaller, and I called my mother just to tell her I love her.',
      'I was rejected from a job I really wanted. The old me would have spiraled. This time I asked what it could teach me. The rejection was not the end. It was information.',
      'I am starting to notice a real shift in myself. When my colleague criticized my work today, I did not react defensively. I listened, kept what was useful, and let the rest go. It felt powerful.',
    ],
    identity: [
      {
        statement: 'I am someone who responds rather than reacts.',
        context: 'After practicing the pause',
      },
      {
        statement: 'I welcome obstacles as invitations to grow.',
        context: 'After the job rejection',
      },
    ],
  },
  fr: {
    personalReflection: 'Reflexion personnelle',
    minutes: '{count} minutes',
    hours: '{count} heures',
    days: '{count} jours',
    demoUser: 'Utilisateur demo',
    whyStatement: 'Je veux trouver du calme dans le chaos et devenir la meilleure version de moi-meme.',
    lessons: [
      "Introduction au stoïcisme",
      "La dichotomie du contrôle",
      "Le matin stoïcien",
      "La visualisation négative",
      "L'obstacle est le chemin",
      "Vivre dans le présent",
    ],
    reflections: [
      "J'essaie encore de tout contrôler autour de moi et cela m'épuise. Mon responsable a pris une décision que je n'aimais pas et j'ai passé la nuit à stresser. Je vois maintenant toute l'énergie que je perds à me battre contre ce que je ne peux pas changer.",
      "Aujourd'hui, je me suis surpris à m'agacer dans les embouteillages. Puis je me suis souvenu que cela ne dépendait pas de moi. Pour la première fois, j'ai senti mes épaules se relâcher. Je ne contrôle pas la circulation, mais je peux choisir ma réaction.",
      "J'ai commencé ma matinée par dix minutes de silence avant de regarder mon téléphone. C'était étrange au début, mais mon esprit était plus clair à la fin. C'était une petite victoire, mais elle comptait.",
      "J'ai imaginé perdre ce que j'aime. Au lieu de me sentir vide, j'ai ressenti de la gratitude pour ce qui est encore là. Mes problèmes ont paru plus petits et j'ai appelé ma mère juste pour lui dire que je l'aime.",
      "J'ai été refusé pour un poste que je voulais vraiment. L'ancienne version de moi se serait écroulée. Cette fois, je me suis demandé ce que cela pouvait m'apprendre. Ce refus n'était pas une fin, c'était une information.",
      "Je commence à remarquer un vrai changement en moi. Quand mon collègue a critiqué mon travail aujourd'hui, je n'ai pas réagi sur la défensive. J'ai écouté, gardé ce qui était utile et laissé le reste. C'était puissant.",
    ],
    identity: [
      {
        statement: "Je suis quelqu'un qui répond au lieu de réagir.",
        context: "Après avoir pratiqué la pause",
      },
      {
        statement: "J'accueille les obstacles comme des occasions de grandir.",
        context: "Après le refus du poste",
      },
    ],
  },
  ar: {
    personalReflection: 'تأمل شخصي',
    minutes: '{count} دقيقة',
    hours: '{count} ساعة',
    days: '{count} يوم',
    demoUser: 'مستخدم تجريبي',
    whyStatement: 'أريد أن أجد هدوءا وسط الفوضى وأن أصبح أفضل نسخة من نفسي.',
    lessons: [
      'مدخل إلى الرواقية',
      'ثنائية التحكم',
      'الصباح الرواقي',
      'التصور السلبي',
      'العقبة هي الطريق',
      'العيش في الحاضر',
    ],
    reflections: [
      'ما زلت أحاول التحكم في كل ما حولي، وهذا يرهقني. اتخذ مديري قرارا لم يعجبني وبقيت طوال الليل متوترا بسببه. بدأت أدرك الآن كم أستهلك من طاقة وأنا أحارب أشياء لا أستطيع الفوز بها.',
      'اليوم لاحظت أنني أغضب بسبب الازدحام. ثم تذكرت أن هذا خارج سيطرتي. للمرة الأولى شعرت بأن كتفي قد ارتخيا. أنا لا أتحكم في الطريق، لكنني أتحكم في استجابتي.',
      'بدأت صباحي بعشر دقائق من الصمت قبل أن ألمس هاتفي. كان الأمر غريبا في البداية، لكن ذهني أصبح أكثر صفاء في النهاية. كان انتصارا صغيرا، لكنه مهم.',
      'تخيلت أنني فقدت الأشياء التي أحبها. بدلا من أن أشعر بالفراغ، شعرت بالامتنان لما ما زال موجودا. بدت مشكلاتي أصغر فجأة، فاتصلت بأمي فقط لأخبرها أنني أحبها.',
      'تم رفضي في وظيفة كنت أريدها بشدة. النسخة القديمة مني كانت ستنهار. هذه المرة سألت نفسي: ماذا يمكن أن يعلمني هذا؟ لم يكن الرفض نهاية، بل معلومة.',
      'أبدأ بملاحظة تحول حقيقي داخلي. عندما انتقد زميلي عملي اليوم لم أدافع عن نفسي كما كنت أفعل سابقا. استمعت، وأخذت ما يفيدني، وتركت الباقي. كان ذلك شعورا قويا.',
    ],
    identity: [
      {
        statement: 'أنا شخص يستجيب بدلا من أن يندفع.',
        context: 'بعد ممارسة التوقف',
      },
      {
        statement: 'أستقبل العقبات كفرص للنمو.',
        context: 'بعد رفض الوظيفة',
      },
    ],
  },
} as const;

export function useTransformationStory() {
  const store = useStore();

  const canGenerateStory = useMemo(() => {
    const hasReflections = (store.allReflections?.length || 0) >= 3;
    const hasLessons = Object.keys(store.completedLessons || {}).length >= 1;
    return hasReflections || hasLessons;
  }, [store.allReflections, store.completedLessons]);

  const storyReadiness = useMemo(() => {
    const reflectionCount = store.allReflections?.length || 0;
    const lessonCount = Object.keys(store.completedLessons || {}).length;
    const hasIdentity = (store.identityStatements?.length || 0) > 0;
    const hasStreak = store.currentStreak >= 3;

    return {
      isReady: canGenerateStory,
      reflectionCount,
      lessonCount,
      hasIdentity,
      hasStreak,
      minimumRequired: {
        reflections: 3,
        current: reflectionCount,
      },
      richness: calculateRichness(reflectionCount, lessonCount, hasIdentity, hasStreak),
    };
  }, [canGenerateStory, store]);

  const buildContext = useCallback((): StoryGenerationContext | null => {
    if (!canGenerateStory) return null;

    const locale = resolveStoryLocale(store.language);
    const copy = COPY[locale];
    const allReflections = store.allReflections || [];
    const sortedReflections = [...allReflections].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstDate = sortedReflections[0]?.date ? new Date(sortedReflections[0].date) : new Date();
    const now = new Date();

    const reflections: ReflectionForStory[] = sortedReflections.map((entry) => ({
      id: entry.id,
      text: entry.reflection,
      date: entry.date,
      lessonTitle: entry.lessonTitle,
      coreConceptTag: entry.coreConceptTag,
      wordCount: entry.reflection.split(/\s+/).filter(Boolean).length,
    }));

    const identityStatements: IdentityForStory[] = (store.identityStatements || []).map((statement) => ({
      statement: statement.statement,
      date: statement.createdAt,
      context: statement.context?.description || copy.personalReflection,
    }));

    const assessments: AssessmentForStory[] = (store.monthlyAssessments || []).map((assessment) => ({
      date: assessment.date,
      month: assessment.month,
      scores: assessment.scores,
    }));

    const wisdomLogs: WisdomLogForStory[] = (store.wisdomInActionLogs || []).map((entry) => ({
      situation: entry.situation,
      principle: entry.stoicPrinciple,
      outcome: entry.outcome,
      date: entry.date,
    }));

    const patternHistory = buildPatternHistory(reflections);
    const daysSinceStart = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalWordsWritten = reflections.reduce((sum, reflection) => sum + reflection.wordCount, 0);
    const totalActiveDays = (store.activityLog || []).length;
    const consistencyPercentage = daysSinceStart > 0 ? (totalActiveDays / daysSinceStart) * 100 : 100;

    const metrics: StoryMetrics = {
      totalReflections: reflections.length,
      totalWordsWritten,
      averageReflectionLength: reflections.length > 0 ? Math.round(totalWordsWritten / reflections.length) : 0,
      longestReflection: reflections.length > 0 ? Math.max(...reflections.map((reflection) => reflection.wordCount)) : 0,
      totalActiveDays,
      currentStreak: store.currentStreak,
      longestStreak: store.longestStreak,
      consistencyPercentage,
      lessonsCompleted: Object.keys(store.completedLessons || {}).length,
      practiceSessionsCompleted: 0,
      assessmentsCompleted: assessments.length,
      identityStatementsCreated: identityStatements.length,
      wisdomApplications: wisdomLogs.length,
      totalXpEarned: store.totalXp,
      currentLevel: getCurrentLevel(store.totalXp),
      dominantPatterns: getDominantPatterns(patternHistory),
      patternShifts: [],
      daysSinceStart,
      totalTimeInvested: formatTimeInvested(totalActiveDays * 10, locale),
    };

    return {
      locale,
      userName: store.name || '',
      transformationGoal: store.transformationGoal || 'growth',
      whyStatement: store.whyStatement || '',
      periodStart: firstDate,
      periodEnd: now,
      daysSinceJourneyStart: daysSinceStart,
      reflections,
      identityStatements,
      assessments,
      wisdomLogs,
      patternHistory,
      metrics,
    };
  }, [canGenerateStory, store]);

  const generateStory = useCallback((type: StoryType = 'on_demand'): TransformationStory | null => {
    const context = buildContext();
    if (!context) return null;
    return buildTransformationStory(context, type);
  }, [buildContext]);

  const generateDemoStory = useCallback((): TransformationStory | null => {
    const locale = resolveStoryLocale(store.language);
    const demoContext = buildDemoContext(locale);
    return buildTransformationStory(demoContext, 'on_demand');
  }, [store.language]);

  return {
    canGenerateStory,
    storyReadiness,
    generateStory,
    buildContext,
    generateDemoStory,
  };
}

function calculateRichness(
  reflections: number,
  lessons: number,
  hasIdentity: boolean,
  hasStreak: boolean
): 'minimal' | 'moderate' | 'rich' | 'exceptional' {
  let score = 0;
  if (reflections >= 10) score += 2;
  else if (reflections >= 5) score += 1;
  if (lessons >= 10) score += 2;
  else if (lessons >= 5) score += 1;
  if (hasIdentity) score += 1;
  if (hasStreak) score += 1;

  if (score >= 6) return 'exceptional';
  if (score >= 4) return 'rich';
  if (score >= 2) return 'moderate';
  return 'minimal';
}

function getCurrentLevel(xp: number): number {
  const levels = [
    { level: 1, minXp: 0 },
    { level: 2, minXp: 100 },
    { level: 3, minXp: 250 },
    { level: 4, minXp: 500 },
    { level: 5, minXp: 850 },
    { level: 6, minXp: 1300 },
    { level: 7, minXp: 1900 },
    { level: 8, minXp: 2700 },
    { level: 9, minXp: 3800 },
    { level: 10, minXp: 5200 },
  ];

  for (let index = levels.length - 1; index >= 0; index -= 1) {
    if (xp >= levels[index].minXp) return levels[index].level;
  }

  return 1;
}

function formatTimeInvested(minutes: number, locale: StoryLocale): string {
  const copy = COPY[locale];
  if (minutes < 60) return formatStory(copy.minutes, { count: minutes });

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return formatStory(copy.hours, { count: hours });

  const days = Math.floor(hours / 24);
  return formatStory(copy.days, { count: days });
}

function buildPatternHistory(reflections: ReflectionForStory[]): MonthlyPatternForStory[] {
  const monthlyReflections = new Map<string, ReflectionForStory[]>();

  for (const reflection of reflections) {
    const date = new Date(reflection.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyReflections.has(monthKey)) {
      monthlyReflections.set(monthKey, []);
    }
    monthlyReflections.get(monthKey)!.push(reflection);
  }

  const result: MonthlyPatternForStory[] = [];

  for (const [month, monthReflections] of monthlyReflections) {
    const themes: Record<string, number> = {};

    for (const key of PATTERN_HISTORY_KEYS) {
      const keywords = THEME_KEYWORDS[key] || [];
      let count = 0;

      for (const reflection of monthReflections) {
        const normalizedText = normalizeText(reflection.text);
        if (keywords.some((keyword) => normalizedText.includes(normalizeText(keyword)))) {
          count += 1;
        }
      }

      themes[key] = count;
    }

    result.push({ month, themes });
  }

  return result.sort((a, b) => a.month.localeCompare(b.month));
}

function getDominantPatterns(history: MonthlyPatternForStory[]): string[] {
  if (history.length === 0) return [];

  const recent = history[history.length - 1];
  return Object.entries(recent.themes)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0)
    .slice(0, 3)
    .map(([pattern]) => pattern);
}

function buildDemoContext(locale: StoryLocale): StoryGenerationContext {
  const now = new Date();
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  const copy = COPY[locale];

  const demoReflections: ReflectionForStory[] = copy.reflections.map((text, index) => ({
    id: `demo-${index + 1}`,
    text,
    date: new Date(Date.now() - [28, 21, 14, 10, 5, 2][index] * 24 * 60 * 60 * 1000).toISOString(),
    lessonTitle: copy.lessons[index],
    coreConceptTag: ['acceptance', 'control', 'discipline', 'gratitude', 'perspective', 'acceptance'][index],
    wordCount: text.split(/\s+/).filter(Boolean).length,
  }));

  const demoIdentity: IdentityForStory[] = copy.identity.map((item, index) => ({
    statement: item.statement,
    date: new Date(Date.now() - [10, 3][index] * 24 * 60 * 60 * 1000).toISOString(),
    context: item.context,
  }));

  const totalWords = demoReflections.reduce((sum, reflection) => sum + reflection.wordCount, 0);

  const metrics: StoryMetrics = {
    totalReflections: demoReflections.length,
    totalWordsWritten: totalWords,
    averageReflectionLength: Math.round(totalWords / demoReflections.length),
    longestReflection: Math.max(...demoReflections.map((reflection) => reflection.wordCount)),
    totalActiveDays: 20,
    currentStreak: 7,
    longestStreak: 12,
    consistencyPercentage: 71,
    lessonsCompleted: 6,
    practiceSessionsCompleted: 0,
    assessmentsCompleted: 0,
    identityStatementsCreated: 2,
    wisdomApplications: 0,
    totalXpEarned: 350,
    currentLevel: 3,
    dominantPatterns: ['control', 'acceptance', 'growth'],
    patternShifts: [],
    daysSinceStart: 28,
    totalTimeInvested: formatTimeInvested(180, locale),
  };

  return {
    locale,
    userName: copy.demoUser,
    transformationGoal: 'calmer',
    whyStatement: copy.whyStatement,
    periodStart: startDate,
    periodEnd: now,
    daysSinceJourneyStart: 28,
    reflections: demoReflections,
    identityStatements: demoIdentity,
    assessments: [],
    wisdomLogs: [],
    patternHistory: buildPatternHistory(demoReflections),
    metrics,
  };
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
