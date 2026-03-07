import type { TransformationGoal } from '@/types';
import type { ReflectionEntry, ActivityDay, MonthlyAssessment } from '@/store/useStore';

type Locale = 'en' | 'fr' | 'ar';

export interface TransformationScore {
  score: number;
  grade: 'awakening' | 'emerging' | 'growing' | 'flourishing' | 'transcending';
  trend: 'rising' | 'steady' | 'needs-attention';
  breakdown: {
    consistency: number;
    depth: number;
    commitment: number;
    growth: number;
  };
}

export interface JourneyMilestone {
  date: string;
  type: 'first-lesson' | 'streak-milestone' | 'reflection-depth' | 'identity-shift' | 'breakthrough';
  title: string;
  description: string;
  icon: string;
  significance: 'minor' | 'notable' | 'major' | 'transformative';
}

export interface PersonalInsight {
  type: 'observation' | 'encouragement' | 'challenge' | 'celebration' | 'reflection';
  message: string;
  context?: string;
  priority: number;
}

export interface ProgressContext {
  name: string | null;
  transformationGoal: TransformationGoal | null;
  whyStatement: string | null;
  daysSinceStart: number;
  totalLessons: number;
  totalReflections: number;
  totalWords: number;
  totalIdentityStatements: number;
  averageReflectionLength: number;
  currentStreak: number;
  longestStreak: number;
  reflections: ReflectionEntry[];
  activityLog: ActivityDay[];
  assessments: MonthlyAssessment[];
  totalXp: number;
}

function resolveLocale(locale?: string): Locale {
  if (locale === 'fr' || locale === 'ar' || locale === 'en') return locale;
  return 'en';
}

function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? `{${key}}`}`);
}

const COPY = {
  en: {
    you: 'You',
    hero: {
      await: '{name}, your transformation awaits',
      awaitSub: 'Take your first step today. One lesson. One reflection. One choice to become who you know you can be.',
      begun: "{name}, you've begun",
      begunSub: '{count} lesson{suffix} completed. The hardest part is over. Now, keep going.',
      weekOne: 'Week one, {name}',
      weekOneSub: '{lessons} lessons. {streak} day{suffix} of practice. You are building something real.',
      counting: '{streak} days and counting',
      countingSub: '{name}, you are proving what you are capable of. This streak is not luck. It is you.',
      transformDays: '{streak} days of transformation',
      transformDaysSub: '{name}, the person who started {days} days ago would barely recognize you now.',
      welcomeBack: '{name}, welcome back',
      welcomeBackSub: 'Your {best}-day streak proved what you are capable of. Today is day one of your next chapter.',
      onPath: '{days} days on the path',
      onPathSub: '{lessons} lessons. {words} words written. {name}, you are becoming who you set out to be.',
      continue: "{name}'s journey continues",
      continueSub: '{lessons} lessons. {streakPart} Every day forward is progress.',
    },
    milestones: {
      beginning: { title: 'The Beginning', description: 'You took your first step on this path' },
      streak: {
        s7: { title: 'First Week', desc: 'One week of showing up', icon: '🔥', sig: 'notable' as const },
        s14: { title: 'Two Weeks Strong', desc: 'The habit is forming', icon: '⚡', sig: 'notable' as const },
        s21: { title: 'Habit Forged', desc: '21 days of transformation', icon: '🔨', sig: 'major' as const },
        s30: { title: 'Month of Growth', desc: 'A full month of dedication', icon: '🌙', sig: 'major' as const },
        s60: { title: 'Discipline Embodied', desc: 'Two months of unwavering practice', icon: '💎', sig: 'transformative' as const },
        s90: { title: 'Quarter Champion', desc: 'Three months of transformation', icon: '👑', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1,000 Words', desc: 'A thousand words of reflection', icon: '✍️', sig: 'notable' as const },
        w5000: { title: '5,000 Words', desc: 'Five thousand words of self-discovery', icon: '📚', sig: 'major' as const },
        w10000: { title: '10,000 Words', desc: 'Ten thousand words of transformation', icon: '📖', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'First Declaration', desc: 'You declared who you are becoming', icon: '🪞', sig: 'major' as const },
        five: { title: 'Identity Architect', desc: 'Five declarations of your new self', icon: '🦋', sig: 'transformative' as const },
      },
    },
    insights: {
      firstWeek: '{name}, you are in your first week. This is when it matters most. Every day you show up now lays the foundation for everything that follows.',
      firstStep: 'You took the hardest step - the first one. Most people only think about changing. You acted.',
      buildingMomentum: '{streak} days in a row. The habit is taking root. Protect this momentum.',
      solidHabit: '{streak} consecutive days. This is no longer an experiment - it is becoming part of who you are.',
      monthPlus: '{streak} days of unbroken practice. The person who started {days} days ago would be proud of who you have become.',
      lostStreak: 'Your streak ended, but what you built is not gone. You proved you can reach {best} days. Begin again.',
      aboutToBeat: 'You are at your longest streak ever. Tomorrow, you write a new record.',
      deepReflector: 'Your reflections average {avg} words. This is genuine introspection.',
      wordsMilestone: '{words} words written in reflection. This is an ongoing conversation with yourself.',
      lessonsPace: 'You have averaged a lesson every {days} days for {totalDays} days. That kind of consistency transforms people.',
      why: 'You started this because: "{why}" - is that why still burning?',
      goals: {
        calmer: 'You set out to become calmer. Every day of practice trains you to respond instead of react.',
        disciplined: '{streakPart} - this is what discipline looks like: choice, day after day.',
        confident: 'Confidence comes from evidence. {lessons} lessons. {reflections} honest reflections.',
        leader: 'Leadership starts with self-leadership. You are building that foundation.',
        focused: 'Every lesson trains your attention. Focus is built, not found.',
        resilient: 'Resilience is forged in practice. {lessons} lessons completed. {streakPart2}',
      },
      goalAlignment: 'Goal alignment',
    },
  },
  fr: {
    you: 'Vous',
    hero: {
      await: '{name}, votre transformation vous attend',
      awaitSub: "Faites votre premier pas aujourd'hui. Une leçon. Une réflexion. Un choix de devenir qui vous savez pouvoir être.",
      begun: '{name}, vous avez commencé',
      begunSub: '{count} leçon{suffix} terminée{suffix}. Le plus dur est passé. Continuez.',
      weekOne: 'Semaine une, {name}',
      weekOneSub: '{lessons} leçons. {streak} jour{suffix} de pratique. Vous construisez quelque chose de réel.',
      counting: '{streak} jours et ça continue',
      countingSub: '{name}, vous prouvez ce dont vous êtes capable.',
      transformDays: '{streak} jours de transformation',
      transformDaysSub: '{name}, la personne du début il y a {days} jours vous reconnaîtrait à peine.',
      welcomeBack: '{name}, bon retour',
      welcomeBackSub: "Votre série de {best} jours a prouvé votre capacité. Aujourd'hui est le jour 1 du nouveau chapitre.",
      onPath: '{days} jours sur le chemin',
      onPathSub: '{lessons} leçons. {words} mots écrits. {name}, vous devenez qui vous vouliez être.',
      continue: 'Le parcours de {name} continue',
      continueSub: '{lessons} leçons. {streakPart} Chaque jour en avant est un progrès.',
    },
    milestones: {
      beginning: { title: 'Le début', description: 'Vous avez fait votre premier pas sur ce chemin' },
      streak: {
        s7: { title: 'Première semaine', desc: 'Une semaine de présence', icon: '🔥', sig: 'notable' as const },
        s14: { title: "Deux semaines solides", desc: "L'habitude se forme", icon: '⚡', sig: 'notable' as const },
        s21: { title: 'Habitude forgée', desc: '21 jours de transformation', icon: '🔨', sig: 'major' as const },
        s30: { title: 'Mois de progression', desc: 'Un mois complet de discipline', icon: '🌙', sig: 'major' as const },
        s60: { title: 'Discipline incarnée', desc: 'Deux mois de pratique constante', icon: '💎', sig: 'transformative' as const },
        s90: { title: 'Champion du trimestre', desc: 'Trois mois de transformation', icon: '👑', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1 000 mots', desc: 'Mille mots de réflexion', icon: '✍️', sig: 'notable' as const },
        w5000: { title: '5 000 mots', desc: 'Cinq mille mots de découverte de soi', icon: '📚', sig: 'major' as const },
        w10000: { title: '10 000 mots', desc: 'Dix mille mots de transformation', icon: '📖', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'Première déclaration', desc: 'Vous avez déclaré qui vous devenez', icon: '🪞', sig: 'major' as const },
        five: { title: 'Architecte identitaire', desc: 'Cinq déclarations de votre nouveau vous', icon: '🦋', sig: 'transformative' as const },
      },
    },
    insights: {
      firstWeek: "{name}, vous êtes dans votre première semaine. C'est maintenant que cela compte le plus.",
      firstStep: 'Vous avez fait le pas le plus difficile : le premier.',
      buildingMomentum: "{streak} jours d'affilée. L'habitude prend racine.",
      solidHabit: "{streak} jours consécutifs. Ce n'est plus un essai, cela devient votre identité.",
      monthPlus: '{streak} jours sans rupture. La personne du début serait fière.',
      lostStreak: 'Votre série est tombée, mais ce que vous avez construit reste. Recommencez.',
      aboutToBeat: 'Vous êtes à votre meilleure série. Demain, vous créez un nouveau record.',
      deepReflector: "Vos réflexions font en moyenne {avg} mots. C'est rare.",
      wordsMilestone: "{words} mots écrits. C'est une vraie conversation avec vous-même.",
      lessonsPace: "Vous avez gardé un rythme d'une leçon tous les {days} jours pendant {totalDays} jours.",
      why: 'Vous avez commencé pour cette raison : "{why}" - est-elle toujours vivante ?',
      goals: {
        calmer: 'Vous cherchez plus de calme. Votre pratique entraîne une réponse plus posée.',
        disciplined: '{streakPart} - voilà la discipline : choisir encore, chaque jour.',
        confident: 'La confiance vient des preuves : {lessons} leçons, {reflections} réflexions.',
        leader: 'Le leadership commence par la direction de soi.',
        focused: 'Chaque leçon entraîne votre attention.',
        resilient: 'La résilience se forge dans la pratique. {lessons} leçons terminées. {streakPart2}',
      },
      goalAlignment: "Alignement avec l'objectif",
    },
  },
  ar: {
    you: 'أنت',
    hero: {
      await: '{name}، تحوّلك ينتظرك',
      awaitSub: 'خذ خطوتك الأولى اليوم. درس واحد. تأمل واحد. قرار واحد لتصبح من تعرف أنك قادر أن تكونه.',
      begun: '{name}، لقد بدأت',
      begunSub: 'أكملت {count} درس{suffix}. الجزء الأصعب انتهى. واصل.',
      weekOne: 'الأسبوع الأول، {name}',
      weekOneSub: '{lessons} درساً. {streak} يوم{suffix} من الممارسة. أنت تبني شيئاً حقيقياً.',
      counting: '{streak} يوماً وما زالت مستمرة',
      countingSub: '{name}، أنت تثبت ما أنت قادر عليه.',
      transformDays: '{streak} يوماً من التحول',
      transformDaysSub: '{name}، الشخص الذي بدأ قبل {days} يوماً بالكاد سيتعرف عليك الآن.',
      welcomeBack: '{name}، أهلاً بعودتك',
      welcomeBackSub: 'سلسلتك السابقة ({best} يوم) أثبتت قدرتك. اليوم هو بداية فصل جديد.',
      onPath: '{days} يوماً على الطريق',
      onPathSub: '{lessons} درساً. {words} كلمة مكتوبة. {name}، أنت تصبح ما أردت أن تكونه.',
      continue: 'رحلة {name} مستمرة',
      continueSub: '{lessons} درساً. {streakPart} كل يوم للأمام هو تقدم.',
    },
    milestones: {
      beginning: { title: 'البداية', description: 'اتخذت أول خطوة في هذا الطريق' },
      streak: {
        s7: { title: 'الأسبوع الأول', desc: 'أسبوع كامل من الالتزام', icon: '🔥', sig: 'notable' as const },
        s14: { title: 'أسبوعان قويان', desc: 'العادة بدأت تتشكل', icon: '⚡', sig: 'notable' as const },
        s21: { title: 'عادة متجذرة', desc: '21 يوماً من التحول', icon: '🔨', sig: 'major' as const },
        s30: { title: 'شهر من النمو', desc: 'شهر كامل من الالتزام', icon: '🌙', sig: 'major' as const },
        s60: { title: 'انضباط متجسد', desc: 'شهران من الممارسة الثابتة', icon: '💎', sig: 'transformative' as const },
        s90: { title: 'بطل الربع', desc: 'ثلاثة أشهر من التحول', icon: '👑', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1000 كلمة', desc: 'ألف كلمة من التأمل', icon: '✍️', sig: 'notable' as const },
        w5000: { title: '5000 كلمة', desc: 'خمسة آلاف كلمة من اكتشاف الذات', icon: '📚', sig: 'major' as const },
        w10000: { title: '10000 كلمة', desc: 'عشرة آلاف كلمة من التحول', icon: '📖', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'أول إعلان', desc: 'أعلنت من تريد أن تصبح', icon: '🪞', sig: 'major' as const },
        five: { title: 'مهندس الهوية', desc: 'خمس عبارات لهويتك الجديدة', icon: '🦋', sig: 'transformative' as const },
      },
    },
    insights: {
      firstWeek: '{name}، أنت في أسبوعك الأول. هذه المرحلة هي الأهم.',
      firstStep: 'لقد اتخذت أصعب خطوة: الخطوة الأولى.',
      buildingMomentum: '{streak} أيام متتالية. العادة بدأت ترسخ.',
      solidHabit: '{streak} يوماً متتالياً. لم تعد تجربة بل أصبحت جزءاً منك.',
      monthPlus: '{streak} يوماً بلا انقطاع. النسخة التي بدأت ستكون فخورة بك.',
      lostStreak: 'انتهت سلسلتك، لكن ما بنيته لم يختف. ابدأ من جديد.',
      aboutToBeat: 'أنت عند أطول سلسلة لك. غداً تكتب رقماً جديداً.',
      deepReflector: 'متوسط تأملاتك {avg} كلمة. هذا عمق نادر.',
      wordsMilestone: 'كتبت {words} كلمة تأملية. هذه محادثة حقيقية مع نفسك.',
      lessonsPace: 'حافظت على وتيرة درس كل {days} يوم خلال {totalDays} يوماً.',
      why: 'بدأت لهذا السبب: "{why}" - هل ما زال مشتعلاً؟',
      goals: {
        calmer: 'هدفك هو الهدوء. كل ممارسة تدربك على الاستجابة بدل رد الفعل.',
        disciplined: '{streakPart} - هذا هو الانضباط: اختيار يومي متكرر.',
        confident: 'الثقة تأتي من الأدلة: {lessons} درساً و{reflections} تأملاً.',
        leader: 'القيادة تبدأ بقيادة الذات.',
        focused: 'كل درس يدرب انتباهك. التركيز يُبنى.',
        resilient: 'المرونة تُصاغ بالممارسة. {lessons} درساً مكتملًا. {streakPart2}',
      },
      goalAlignment: 'مواءمة الهدف',
    },
  },
} as const;

const LOCALE_TAG: Record<Locale, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar',
};

const STREAK_PHRASES: Record<Locale, {
  showingUp: string;
  startingFresh: string;
  inARow: string;
  dayStreak: string;
}> = {
  en: {
    showingUp: '{count} days of showing up',
    startingFresh: 'Starting fresh',
    inARow: '{count} days in a row.',
    dayStreak: '{count} day streak.',
  },
  fr: {
    showingUp: '{count} jours de présence',
    startingFresh: 'Nouveau départ',
    inARow: "{count} jours d'affilée.",
    dayStreak: 'Série de {count} jours.',
  },
  ar: {
    showingUp: '{count} يوماً من الالتزام',
    startingFresh: 'بداية جديدة',
    inARow: '{count} يوماً متتالية.',
    dayStreak: 'سلسلة {count} يومًا.',
  },
};

export function calculateTransformationScore(ctx: ProgressContext): TransformationScore {
  let consistency = 0;
  if (ctx.daysSinceStart > 0) {
    const streakRatio = ctx.currentStreak / Math.max(ctx.daysSinceStart, 1);
    consistency = Math.min(25, streakRatio * 30 + (ctx.currentStreak >= 7 ? 5 : 0));
  }
  if (ctx.currentStreak >= 30) consistency = 25;

  let depth = 0;
  if (ctx.totalReflections > 0) {
    const avgLength = ctx.averageReflectionLength;
    if (avgLength >= 50) depth += 10;
    else if (avgLength >= 30) depth += 7;
    else if (avgLength >= 15) depth += 4;

    if (ctx.totalReflections >= 30) depth += 10;
    else if (ctx.totalReflections >= 15) depth += 7;
    else if (ctx.totalReflections >= 5) depth += 4;

    if (ctx.totalIdentityStatements >= 5) depth += 5;
    else if (ctx.totalIdentityStatements >= 2) depth += 3;
  }
  depth = Math.min(25, depth);

  let commitment = 0;
  if (ctx.totalLessons > 0) {
    if (ctx.totalLessons >= 50) commitment = 20;
    else if (ctx.totalLessons >= 25) commitment = 15;
    else if (ctx.totalLessons >= 10) commitment = 10;
    else if (ctx.totalLessons >= 5) commitment = 6;
    else commitment = 3;

    if (ctx.daysSinceStart >= 30 && ctx.totalLessons >= 20) commitment += 5;
  }
  commitment = Math.min(25, commitment);

  let growth = 0;
  if (ctx.assessments.length >= 2) {
    const latest = ctx.assessments[ctx.assessments.length - 1];
    const previous = ctx.assessments[ctx.assessments.length - 2];

    const latestAvg = Object.values(latest.scores).reduce((a, b) => a + b, 0) / 5;
    const previousAvg = Object.values(previous.scores).reduce((a, b) => a + b, 0) / 5;

    const improvement = latestAvg - previousAvg;
    if (improvement > 1) growth = 20;
    else if (improvement > 0) growth = 15;
    else if (improvement === 0) growth = 10;
    else growth = 5;
  } else if (ctx.assessments.length === 1) {
    growth = 12;
  } else {
    if (ctx.totalReflections >= 10) growth = 10;
    else if (ctx.totalReflections >= 5) growth = 7;
  }

  growth = Math.min(25, growth);
  const score = Math.round(consistency + depth + commitment + growth);

  let grade: TransformationScore['grade'];
  if (score >= 80) grade = 'transcending';
  else if (score >= 60) grade = 'flourishing';
  else if (score >= 40) grade = 'growing';
  else if (score >= 20) grade = 'emerging';
  else grade = 'awakening';

  let trend: TransformationScore['trend'] = 'steady';
  if (ctx.currentStreak >= 3 && ctx.currentStreak > ctx.longestStreak * 0.5) {
    trend = 'rising';
  } else if (ctx.currentStreak === 0 && ctx.longestStreak > 0) {
    trend = 'needs-attention';
  }

  return {
    score,
    grade,
    trend,
    breakdown: {
      consistency: Math.round(consistency),
      depth: Math.round(depth),
      commitment: Math.round(commitment),
      growth: Math.round(growth)
    }
  };
}

export function generateJourneyMilestones(ctx: ProgressContext, locale: string = 'en'): JourneyMilestone[] {
  const l = resolveLocale(locale);
  const copy = COPY[l].milestones;
  const milestones: JourneyMilestone[] = [];

  if (ctx.activityLog.length > 0) {
    const firstDay = ctx.activityLog[0];
    milestones.push({
      date: firstDay.date,
      type: 'first-lesson',
      title: copy.beginning.title,
      description: copy.beginning.description,
      icon: 'ðŸŒ±',
      significance: 'transformative'
    });
  }

  const streakMilestones = [
    { streak: 7, data: copy.streak.s7 },
    { streak: 14, data: copy.streak.s14 },
    { streak: 21, data: copy.streak.s21 },
    { streak: 30, data: copy.streak.s30 },
    { streak: 60, data: copy.streak.s60 },
    { streak: 90, data: copy.streak.s90 },
  ];

  for (const sm of streakMilestones) {
    if (ctx.longestStreak >= sm.streak) {
      milestones.push({
        date: '',
        type: 'streak-milestone',
        title: sm.data.title,
        description: sm.data.desc,
        icon: sm.data.icon,
        significance: sm.data.sig
      });
    }
  }

  const wordMilestones = [
    { words: 1000, data: copy.words.w1000 },
    { words: 5000, data: copy.words.w5000 },
    { words: 10000, data: copy.words.w10000 },
  ];

  for (const wm of wordMilestones) {
    if (ctx.totalWords >= wm.words) {
      milestones.push({
        date: '',
        type: 'reflection-depth',
        title: wm.data.title,
        description: wm.data.desc,
        icon: wm.data.icon,
        significance: wm.data.sig
      });
    }
  }

  if (ctx.totalIdentityStatements >= 1) {
    milestones.push({
      date: '',
      type: 'identity-shift',
      title: copy.identity.first.title,
      description: copy.identity.first.desc,
      icon: copy.identity.first.icon,
      significance: copy.identity.first.sig
    });
  }
  if (ctx.totalIdentityStatements >= 5) {
    milestones.push({
      date: '',
      type: 'identity-shift',
      title: copy.identity.five.title,
      description: copy.identity.five.desc,
      icon: copy.identity.five.icon,
      significance: copy.identity.five.sig
    });
  }

  return milestones;
}

export function generatePersonalInsights(ctx: ProgressContext, locale: string = 'en'): PersonalInsight[] {
  const l = resolveLocale(locale);
  const copy = COPY[l].insights;
  const name = ctx.name || COPY[l].you;
  const insights: PersonalInsight[] = [];

  if (ctx.daysSinceStart <= 7 && ctx.daysSinceStart > 0) {
    insights.push({
      type: 'encouragement',
      message: format(copy.firstWeek, { name }),
      priority: 90
    });
  }

  if (ctx.totalLessons <= 3 && ctx.totalLessons > 0) {
    insights.push({
      type: 'celebration',
      message: copy.firstStep,
      priority: 85
    });
  }

  if (ctx.currentStreak >= 5 && ctx.currentStreak < 14) {
    insights.push({
      type: 'observation',
      message: format(copy.buildingMomentum, { streak: ctx.currentStreak }),
      priority: 80
    });
  }

  if (ctx.currentStreak >= 14 && ctx.currentStreak < 30) {
    insights.push({
      type: 'celebration',
      message: format(copy.solidHabit, { streak: ctx.currentStreak }),
      priority: 85
    });
  }

  if (ctx.currentStreak >= 30) {
    insights.push({
      type: 'celebration',
      message: format(copy.monthPlus, { streak: ctx.currentStreak, days: ctx.daysSinceStart }),
      priority: 95
    });
  }

  if (ctx.currentStreak === 0 && ctx.longestStreak > 7) {
    insights.push({
      type: 'encouragement',
      message: format(copy.lostStreak, { best: ctx.longestStreak }),
      priority: 90
    });
  }

  if (ctx.currentStreak > 0 && ctx.currentStreak === ctx.longestStreak) {
    insights.push({
      type: 'challenge',
      message: copy.aboutToBeat,
      priority: 88
    });
  }

  if (ctx.averageReflectionLength >= 50) {
    insights.push({
      type: 'observation',
      message: format(copy.deepReflector, { avg: ctx.averageReflectionLength }),
      priority: 75
    });
  }

  if (ctx.totalWords >= 5000) {
    insights.push({
      type: 'celebration',
      message: format(copy.wordsMilestone, { words: ctx.totalWords.toLocaleString(LOCALE_TAG[l]) }),
      priority: 80
    });
  }

  if (ctx.transformationGoal) {
    const streakCopy = STREAK_PHRASES[l];
    const streakPart = ctx.currentStreak > 0
      ? format(streakCopy.showingUp, { count: ctx.currentStreak })
      : streakCopy.startingFresh;
    const streakPart2 = ctx.currentStreak > 0
      ? format(streakCopy.inARow, { count: ctx.currentStreak })
      : '';
    insights.push({
      type: 'observation',
      message: format(copy.goals[ctx.transformationGoal], {
        lessons: ctx.totalLessons,
        reflections: ctx.totalReflections,
        streakPart,
        streakPart2,
      }),
      context: copy.goalAlignment,
      priority: 70
    });
  }

  if (ctx.daysSinceStart >= 14 && ctx.totalLessons >= 10) {
    const lessonsPerDay = ctx.totalLessons / ctx.daysSinceStart;
    if (lessonsPerDay >= 0.5) {
      insights.push({
        type: 'observation',
        message: format(copy.lessonsPace, {
          days: Math.round(1 / lessonsPerDay),
          totalDays: ctx.daysSinceStart,
        }),
        priority: 65
      });
    }
  }

  if (ctx.whyStatement && ctx.daysSinceStart >= 7) {
    insights.push({
      type: 'reflection',
      message: format(copy.why, { why: `${ctx.whyStatement.slice(0, 100)}${ctx.whyStatement.length > 100 ? '...' : ''}` }),
      priority: 60
    });
  }

  return insights.sort((a, b) => b.priority - a.priority);
}

export function generateHeroMessage(ctx: ProgressContext, locale: string = 'en'): { headline: string; subtext: string } {
  const l = resolveLocale(locale);
  const copy = COPY[l].hero;
  const name = ctx.name || COPY[l].you;

  if (ctx.totalLessons === 0) {
    return {
      headline: format(copy.await, { name }),
      subtext: copy.awaitSub
    };
  }

  if (ctx.totalLessons <= 3) {
    return {
      headline: format(copy.begun, { name }),
      subtext: format(copy.begunSub, {
        count: ctx.totalLessons,
        suffix: ctx.totalLessons > 1 ? 's' : ''
      })
    };
  }

  if (ctx.daysSinceStart <= 7) {
    return {
      headline: format(copy.weekOne, { name }),
      subtext: format(copy.weekOneSub, {
        lessons: ctx.totalLessons,
        streak: ctx.currentStreak,
        suffix: ctx.currentStreak !== 1 ? 's' : ''
      })
    };
  }

  if (ctx.currentStreak >= 7 && ctx.currentStreak < 30) {
    return {
      headline: format(copy.counting, { streak: ctx.currentStreak }),
      subtext: format(copy.countingSub, { name })
    };
  }

  if (ctx.currentStreak >= 30) {
    return {
      headline: format(copy.transformDays, { streak: ctx.currentStreak }),
      subtext: format(copy.transformDaysSub, { name, days: ctx.daysSinceStart })
    };
  }

  if (ctx.currentStreak === 0 && ctx.longestStreak > 0) {
    return {
      headline: format(copy.welcomeBack, { name }),
      subtext: format(copy.welcomeBackSub, { best: ctx.longestStreak })
    };
  }

  if (ctx.daysSinceStart >= 30) {
    return {
      headline: format(copy.onPath, { days: ctx.daysSinceStart }),
      subtext: format(copy.onPathSub, {
        lessons: ctx.totalLessons,
        words: ctx.totalWords.toLocaleString(LOCALE_TAG[l]),
        name
      })
    };
  }

  return {
    headline: format(copy.continue, { name }),
    subtext: format(copy.continueSub, {
      lessons: ctx.totalLessons,
      streakPart: ctx.currentStreak > 0
        ? format(STREAK_PHRASES[l].dayStreak, { count: ctx.currentStreak })
        : ''
    })
  };
}

type ScoreCopy = {
  gradeDescriptions: Record<TransformationScore['grade'], { title: string; description: string; color: string }>;
  breakdownLabels: Record<keyof TransformationScore['breakdown'], { label: string; description: string; icon: string }>;
};

export const SCORE_COPY_BY_LOCALE: Record<Locale, ScoreCopy> = {
  en: {
    gradeDescriptions: {
      awakening: {
        title: 'Awakening',
        description: "You've opened your eyes to change. The journey has begun.",
        color: '#94a3b8'
      },
      emerging: {
        title: 'Emerging',
        description: "You're rising from who you were. The old patterns are loosening.",
        color: '#22d3ee'
      },
      growing: {
        title: 'Growing',
        description: "Real progress is happening. You're not the same person who started.",
        color: '#10b981'
      },
      flourishing: {
        title: 'Flourishing',
        description: 'Your transformation is undeniable. Others can see the change.',
        color: '#8b5cf6'
      },
      transcending: {
        title: 'Transcending',
        description: "You've become who you set out to be. Now you're reaching higher.",
        color: '#f59e0b'
      }
    },
    breakdownLabels: {
      consistency: {
        label: 'Consistency',
        description: 'Showing up day after day',
        icon: '🔥'
      },
      depth: {
        label: 'Depth',
        description: 'Quality of your reflections',
        icon: '🌊'
      },
      commitment: {
        label: 'Commitment',
        description: 'Lessons completed and time invested',
        icon: '⚡'
      },
      growth: {
        label: 'Growth',
        description: 'Measurable progress over time',
        icon: '📈'
      }
    },
  },
  fr: {
    gradeDescriptions: {
      awakening: {
        title: 'Éveil',
        description: 'Vous avez ouvert les yeux sur le changement. Le chemin commence.',
        color: '#94a3b8'
      },
      emerging: {
        title: 'Émergence',
        description: 'Vous vous élevez de votre ancienne version. Les vieux schémas se desserrent.',
        color: '#22d3ee'
      },
      growing: {
        title: 'Croissance',
        description: 'Un vrai progrès est en cours. Vous n’êtes déjà plus la même personne.',
        color: '#10b981'
      },
      flourishing: {
        title: 'Épanouissement',
        description: 'Votre transformation est évidente. Le changement se voit.',
        color: '#8b5cf6'
      },
      transcending: {
        title: 'Transcendance',
        description: 'Vous devenez qui vous vouliez être. Maintenant, vous allez plus haut.',
        color: '#f59e0b'
      }
    },
    breakdownLabels: {
      consistency: {
        label: 'Régularité',
        description: 'Être présent jour après jour',
        icon: '🔥'
      },
      depth: {
        label: 'Profondeur',
        description: 'Qualité de vos réflexions',
        icon: '🌊'
      },
      commitment: {
        label: 'Engagement',
        description: 'Leçons terminées et temps investi',
        icon: '⚡'
      },
      growth: {
        label: 'Progression',
        description: 'Progrès mesurable dans le temps',
        icon: '📈'
      }
    },
  },
  ar: {
    gradeDescriptions: {
      awakening: {
        title: 'اليقظة',
        description: 'لقد بدأت ترى التغيير بوضوح. الرحلة بدأت.',
        color: '#94a3b8'
      },
      emerging: {
        title: 'البداية',
        description: 'أنت تنهض من نسختك القديمة. الأنماط القديمة بدأت تتفكك.',
        color: '#22d3ee'
      },
      growing: {
        title: 'النمو',
        description: 'هناك تقدّم حقيقي. لم تعد الشخص نفسه الذي بدأ.',
        color: '#10b981'
      },
      flourishing: {
        title: 'الازدهار',
        description: 'تحوّلك واضح للجميع. التغيير أصبح ملموساً.',
        color: '#8b5cf6'
      },
      transcending: {
        title: 'التسامي',
        description: 'أصبحت أقرب لمن تريد أن تكونه. والآن تتجه إلى مستوى أعلى.',
        color: '#f59e0b'
      }
    },
    breakdownLabels: {
      consistency: {
        label: 'الاستمرارية',
        description: 'الالتزام يومًا بعد يوم',
        icon: '🔥'
      },
      depth: {
        label: 'العمق',
        description: 'جودة تأملاتك',
        icon: '🌊'
      },
      commitment: {
        label: 'الالتزام',
        description: 'الدروس المكتملة والوقت المستثمر',
        icon: '⚡'
      },
      growth: {
        label: 'التقدم',
        description: 'تقدم قابل للقياس مع الوقت',
        icon: '📈'
      }
    },
  },
};

export function getGradeDescriptions(locale: string = 'en') {
  return SCORE_COPY_BY_LOCALE[resolveLocale(locale)].gradeDescriptions;
}

export function getBreakdownLabels(locale: string = 'en') {
  return SCORE_COPY_BY_LOCALE[resolveLocale(locale)].breakdownLabels;
}
