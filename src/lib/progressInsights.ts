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
        s7: { title: 'First Week', desc: 'One week of showing up', icon: 'ðŸ”¥', sig: 'notable' as const },
        s14: { title: 'Two Weeks Strong', desc: 'The habit is forming', icon: 'âš¡', sig: 'notable' as const },
        s21: { title: 'Habit Forged', desc: '21 days of transformation', icon: 'ðŸ”¨', sig: 'major' as const },
        s30: { title: 'Month of Growth', desc: 'A full month of dedication', icon: 'ðŸŒ™', sig: 'major' as const },
        s60: { title: 'Discipline Embodied', desc: 'Two months of unwavering practice', icon: 'ðŸ’Ž', sig: 'transformative' as const },
        s90: { title: 'Quarter Champion', desc: 'Three months of transformation', icon: 'ðŸ‘‘', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1,000 Words', desc: 'A thousand words of reflection', icon: 'âœï¸', sig: 'notable' as const },
        w5000: { title: '5,000 Words', desc: 'Five thousand words of self-discovery', icon: 'ðŸ“š', sig: 'major' as const },
        w10000: { title: '10,000 Words', desc: 'Ten thousand words of transformation', icon: 'ðŸ“–', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'First Declaration', desc: 'You declared who you are becoming', icon: 'ðŸªž', sig: 'major' as const },
        five: { title: 'Identity Architect', desc: 'Five declarations of your new self', icon: 'ðŸ¦‹', sig: 'transformative' as const },
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
      awaitSub: 'Faites votre premier pas aujourd hui. Une leÃ§on. Une rÃ©flexion. Un choix de devenir qui vous savez pouvoir Ãªtre.',
      begun: '{name}, vous avez commencÃ©',
      begunSub: '{count} leÃ§on{suffix} terminÃ©e{suffix}. Le plus dur est passÃ©. Continuez.',
      weekOne: 'Semaine une, {name}',
      weekOneSub: '{lessons} leÃ§ons. {streak} jour{suffix} de pratique. Vous construisez quelque chose de rÃ©el.',
      counting: '{streak} jours et Ã§a continue',
      countingSub: '{name}, vous prouvez ce dont vous Ãªtes capable.',
      transformDays: '{streak} jours de transformation',
      transformDaysSub: '{name}, la personne du dÃ©but il y a {days} jours vous reconnaÃ®trait Ã  peine.',
      welcomeBack: '{name}, bon retour',
      welcomeBackSub: 'Votre sÃ©rie de {best} jours a prouvÃ© votre capacitÃ©. Aujourd hui est le jour 1 du nouveau chapitre.',
      onPath: '{days} jours sur le chemin',
      onPathSub: '{lessons} leÃ§ons. {words} mots Ã©crits. {name}, vous devenez qui vous vouliez Ãªtre.',
      continue: 'Le parcours de {name} continue',
      continueSub: '{lessons} leÃ§ons. {streakPart} Chaque jour en avant est un progrÃ¨s.',
    },
    milestones: {
      beginning: { title: 'Le dÃ©but', description: 'Vous avez fait votre premier pas sur ce chemin' },
      streak: {
        s7: { title: 'PremiÃ¨re semaine', desc: 'Une semaine de prÃ©sence', icon: 'ðŸ”¥', sig: 'notable' as const },
        s14: { title: 'Deux semaines solides', desc: 'L habitude se forme', icon: 'âš¡', sig: 'notable' as const },
        s21: { title: 'Habitude forgÃ©e', desc: '21 jours de transformation', icon: 'ðŸ”¨', sig: 'major' as const },
        s30: { title: 'Mois de progression', desc: 'Un mois complet de discipline', icon: 'ðŸŒ™', sig: 'major' as const },
        s60: { title: 'Discipline incarnÃ©e', desc: 'Deux mois de pratique constante', icon: 'ðŸ’Ž', sig: 'transformative' as const },
        s90: { title: 'Champion du trimestre', desc: 'Trois mois de transformation', icon: 'ðŸ‘‘', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1 000 mots', desc: 'Mille mots de rÃ©flexion', icon: 'âœï¸', sig: 'notable' as const },
        w5000: { title: '5 000 mots', desc: 'Cinq mille mots de dÃ©couverte de soi', icon: 'ðŸ“š', sig: 'major' as const },
        w10000: { title: '10 000 mots', desc: 'Dix mille mots de transformation', icon: 'ðŸ“–', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'PremiÃ¨re dÃ©claration', desc: 'Vous avez dÃ©clarÃ© qui vous devenez', icon: 'ðŸªž', sig: 'major' as const },
        five: { title: 'Architecte identitaire', desc: 'Cinq dÃ©clarations de votre nouveau vous', icon: 'ðŸ¦‹', sig: 'transformative' as const },
      },
    },
    insights: {
      firstWeek: '{name}, vous Ãªtes dans votre premiÃ¨re semaine. C est maintenant que cela compte le plus.',
      firstStep: 'Vous avez fait le pas le plus difficile : le premier.',
      buildingMomentum: '{streak} jours d affilÃ©e. L habitude prend racine.',
      solidHabit: '{streak} jours consÃ©cutifs. Ce n est plus un essai, cela devient votre identitÃ©.',
      monthPlus: '{streak} jours sans rupture. La personne du dÃ©but serait fiÃ¨re.',
      lostStreak: 'Votre sÃ©rie est tombÃ©e, mais ce que vous avez construit reste. Recommencez.',
      aboutToBeat: 'Vous Ãªtes Ã  votre meilleure sÃ©rie. Demain, vous crÃ©ez un nouveau record.',
      deepReflector: 'Vos rÃ©flexions font en moyenne {avg} mots. C est rare.',
      wordsMilestone: '{words} mots Ã©crits. C est une vraie conversation avec vous-mÃªme.',
      lessonsPace: 'Vous avez gardÃ© un rythme d une leÃ§on tous les {days} jours pendant {totalDays} jours.',
      why: 'Vous avez commencÃ© pour cette raison : "{why}" - est-elle toujours vivante ?',
      goals: {
        calmer: 'Vous cherchez plus de calme. Votre pratique entraÃ®ne une rÃ©ponse plus posÃ©e.',
        disciplined: '{streakPart} - voilÃ  la discipline : choisir encore, chaque jour.',
        confident: 'La confiance vient des preuves : {lessons} leÃ§ons, {reflections} rÃ©flexions.',
        leader: 'Le leadership commence par la direction de soi.',
        focused: 'Chaque leÃ§on entraÃ®ne votre attention.',
        resilient: 'La rÃ©silience se forge dans la pratique. {lessons} leÃ§ons terminÃ©es. {streakPart2}',
      },
      goalAlignment: 'Alignement avec l objectif',
    },
  },
  ar: {
    you: 'Ø£Ù†Øª',
    hero: {
      await: '{name}ØŒ ØªØ­ÙˆÙ‘Ù„Ùƒ ÙŠÙ†ØªØ¸Ø±Ùƒ',
      awaitSub: 'Ø®Ø° Ø®Ø·ÙˆØªÙƒ Ø§Ù„Ø£ÙˆÙ„Ù‰ Ø§Ù„ÙŠÙˆÙ…. Ø¯Ø±Ø³ ÙˆØ§Ø­Ø¯. ØªØ£Ù…Ù„ ÙˆØ§Ø­Ø¯. Ù‚Ø±Ø§Ø± ÙˆØ§Ø­Ø¯ Ù„ØªØµØ¨Ø­ Ù…Ù† ØªØ¹Ø±Ù Ø£Ù†Ùƒ Ù‚Ø§Ø¯Ø± Ø£Ù† ØªÙƒÙˆÙ†Ù‡.',
      begun: '{name}ØŒ Ù„Ù‚Ø¯ Ø¨Ø¯Ø£Øª',
      begunSub: 'Ø£ÙƒÙ…Ù„Øª {count} Ø¯Ø±Ø³{suffix}. Ø§Ù„Ø¬Ø²Ø¡ Ø§Ù„Ø£ØµØ¹Ø¨ Ø§Ù†ØªÙ‡Ù‰. ÙˆØ§ØµÙ„.',
      weekOne: 'Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ Ø§Ù„Ø£ÙˆÙ„ØŒ {name}',
      weekOneSub: '{lessons} Ø¯Ø±Ø³Ø§Ù‹. {streak} ÙŠÙˆÙ…{suffix} Ù…Ù† Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©. Ø£Ù†Øª ØªØ¨Ù†ÙŠ Ø´ÙŠØ¦Ø§Ù‹ Ø­Ù‚ÙŠÙ‚ÙŠØ§Ù‹.',
      counting: '{streak} ÙŠÙˆÙ…Ø§Ù‹ ÙˆÙ…Ø§ Ø²Ø§Ù„Øª Ù…Ø³ØªÙ…Ø±Ø©',
      countingSub: '{name}ØŒ Ø£Ù†Øª ØªØ«Ø¨Øª Ù…Ø§ Ø£Ù†Øª Ù‚Ø§Ø¯Ø± Ø¹Ù„ÙŠÙ‡.',
      transformDays: '{streak} ÙŠÙˆÙ…Ø§Ù‹ Ù…Ù† Ø§Ù„ØªØ­ÙˆÙ„',
      transformDaysSub: '{name}ØŒ Ø§Ù„Ø´Ø®Øµ Ø§Ù„Ø°ÙŠ Ø¨Ø¯Ø£ Ù‚Ø¨Ù„ {days} ÙŠÙˆÙ…Ø§Ù‹ Ø¨Ø§Ù„ÙƒØ§Ø¯ Ø³ÙŠØªØ¹Ø±Ù Ø¹Ù„ÙŠÙƒ Ø§Ù„Ø¢Ù†.',
      welcomeBack: '{name}ØŒ Ø£Ù‡Ù„Ø§Ù‹ Ø¨Ø¹ÙˆØ¯ØªÙƒ',
      welcomeBackSub: 'Ø³Ù„Ø³Ù„ØªÙƒ Ø§Ù„Ø³Ø§Ø¨Ù‚Ø© ({best} ÙŠÙˆÙ…) Ø£Ø«Ø¨ØªØª Ù‚Ø¯Ø±ØªÙƒ. Ø§Ù„ÙŠÙˆÙ… Ù‡Ùˆ Ø¨Ø¯Ø§ÙŠØ© ÙØµÙ„ Ø¬Ø¯ÙŠØ¯.',
      onPath: '{days} ÙŠÙˆÙ…Ø§Ù‹ Ø¹Ù„Ù‰ Ø§Ù„Ø·Ø±ÙŠÙ‚',
      onPathSub: '{lessons} Ø¯Ø±Ø³Ø§Ù‹. {words} ÙƒÙ„Ù…Ø© Ù…ÙƒØªÙˆØ¨Ø©. {name}ØŒ Ø£Ù†Øª ØªØµØ¨Ø­ Ù…Ø§ Ø£Ø±Ø¯Øª Ø£Ù† ØªÙƒÙˆÙ†Ù‡.',
      continue: 'Ø±Ø­Ù„Ø© {name} Ù…Ø³ØªÙ…Ø±Ø©',
      continueSub: '{lessons} Ø¯Ø±Ø³Ø§Ù‹. {streakPart} ÙƒÙ„ ÙŠÙˆÙ… Ù„Ù„Ø£Ù…Ø§Ù… Ù‡Ùˆ ØªÙ‚Ø¯Ù….',
    },
    milestones: {
      beginning: { title: 'Ø§Ù„Ø¨Ø¯Ø§ÙŠØ©', description: 'Ø§ØªØ®Ø°Øª Ø£ÙˆÙ„ Ø®Ø·ÙˆØ© ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø·Ø±ÙŠÙ‚' },
      streak: {
        s7: { title: 'Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹ Ø§Ù„Ø£ÙˆÙ„', desc: 'Ø£Ø³Ø¨ÙˆØ¹ ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ø§Ù„ØªØ²Ø§Ù…', icon: 'ðŸ”¥', sig: 'notable' as const },
        s14: { title: 'Ø£Ø³Ø¨ÙˆØ¹Ø§Ù† Ù‚ÙˆÙŠØ§Ù†', desc: 'Ø§Ù„Ø¹Ø§Ø¯Ø© Ø¨Ø¯Ø£Øª ØªØªØ´ÙƒÙ„', icon: 'âš¡', sig: 'notable' as const },
        s21: { title: 'Ø¹Ø§Ø¯Ø© Ù…ØªØ¬Ø°Ø±Ø©', desc: '21 ÙŠÙˆÙ…Ø§Ù‹ Ù…Ù† Ø§Ù„ØªØ­ÙˆÙ„', icon: 'ðŸ”¨', sig: 'major' as const },
        s30: { title: 'Ø´Ù‡Ø± Ù…Ù† Ø§Ù„Ù†Ù…Ùˆ', desc: 'Ø´Ù‡Ø± ÙƒØ§Ù…Ù„ Ù…Ù† Ø§Ù„Ø§Ù„ØªØ²Ø§Ù…', icon: 'ðŸŒ™', sig: 'major' as const },
        s60: { title: 'Ø§Ù†Ø¶Ø¨Ø§Ø· Ù…ØªØ¬Ø³Ø¯', desc: 'Ø´Ù‡Ø±Ø§Ù† Ù…Ù† Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø© Ø§Ù„Ø«Ø§Ø¨ØªØ©', icon: 'ðŸ’Ž', sig: 'transformative' as const },
        s90: { title: 'Ø¨Ø·Ù„ Ø§Ù„Ø±Ø¨Ø¹', desc: 'Ø«Ù„Ø§Ø«Ø© Ø£Ø´Ù‡Ø± Ù…Ù† Ø§Ù„ØªØ­ÙˆÙ„', icon: 'ðŸ‘‘', sig: 'transformative' as const },
      },
      words: {
        w1000: { title: '1000 ÙƒÙ„Ù…Ø©', desc: 'Ø£Ù„Ù ÙƒÙ„Ù…Ø© Ù…Ù† Ø§Ù„ØªØ£Ù…Ù„', icon: 'âœï¸', sig: 'notable' as const },
        w5000: { title: '5000 ÙƒÙ„Ù…Ø©', desc: 'Ø®Ù…Ø³Ø© Ø¢Ù„Ø§Ù ÙƒÙ„Ù…Ø© Ù…Ù† Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø°Ø§Øª', icon: 'ðŸ“š', sig: 'major' as const },
        w10000: { title: '10000 ÙƒÙ„Ù…Ø©', desc: 'Ø¹Ø´Ø±Ø© Ø¢Ù„Ø§Ù ÙƒÙ„Ù…Ø© Ù…Ù† Ø§Ù„ØªØ­ÙˆÙ„', icon: 'ðŸ“–', sig: 'transformative' as const },
      },
      identity: {
        first: { title: 'Ø£ÙˆÙ„ Ø¥Ø¹Ù„Ø§Ù†', desc: 'Ø£Ø¹Ù„Ù†Øª Ù…Ù† ØªØ±ÙŠØ¯ Ø£Ù† ØªØµØ¨Ø­', icon: 'ðŸªž', sig: 'major' as const },
        five: { title: 'Ù…Ù‡Ù†Ø¯Ø³ Ø§Ù„Ù‡ÙˆÙŠØ©', desc: 'Ø®Ù…Ø³ Ø¹Ø¨Ø§Ø±Ø§Øª Ù„Ù‡ÙˆÙŠØªÙƒ Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©', icon: 'ðŸ¦‹', sig: 'transformative' as const },
      },
    },
    insights: {
      firstWeek: '{name}ØŒ Ø£Ù†Øª ÙÙŠ Ø£Ø³Ø¨ÙˆØ¹Ùƒ Ø§Ù„Ø£ÙˆÙ„. Ù‡Ø°Ù‡ Ø§Ù„Ù…Ø±Ø­Ù„Ø© Ù‡ÙŠ Ø§Ù„Ø£Ù‡Ù….',
      firstStep: 'Ù„Ù‚Ø¯ Ø§ØªØ®Ø°Øª Ø£ØµØ¹Ø¨ Ø®Ø·ÙˆØ©: Ø§Ù„Ø®Ø·ÙˆØ© Ø§Ù„Ø£ÙˆÙ„Ù‰.',
      buildingMomentum: '{streak} Ø£ÙŠØ§Ù… Ù…ØªØªØ§Ù„ÙŠØ©. Ø§Ù„Ø¹Ø§Ø¯Ø© Ø¨Ø¯Ø£Øª ØªØ±Ø³Ø®.',
      solidHabit: '{streak} ÙŠÙˆÙ…Ø§Ù‹ Ù…ØªØªØ§Ù„ÙŠØ§Ù‹. Ù„Ù… ØªØ¹Ø¯ ØªØ¬Ø±Ø¨Ø© Ø¨Ù„ Ø£ØµØ¨Ø­Øª Ø¬Ø²Ø¡Ø§Ù‹ Ù…Ù†Ùƒ.',
      monthPlus: '{streak} ÙŠÙˆÙ…Ø§Ù‹ Ø¨Ù„Ø§ Ø§Ù†Ù‚Ø·Ø§Ø¹. Ø§Ù„Ù†Ø³Ø®Ø© Ø§Ù„ØªÙŠ Ø¨Ø¯Ø£Øª Ø³ØªÙƒÙˆÙ† ÙØ®ÙˆØ±Ø© Ø¨Ùƒ.',
      lostStreak: 'Ø§Ù†ØªÙ‡Øª Ø³Ù„Ø³Ù„ØªÙƒØŒ Ù„ÙƒÙ† Ù…Ø§ Ø¨Ù†ÙŠØªÙ‡ Ù„Ù… ÙŠØ®ØªÙ. Ø§Ø¨Ø¯Ø£ Ù…Ù† Ø¬Ø¯ÙŠØ¯.',
      aboutToBeat: 'Ø£Ù†Øª Ø¹Ù†Ø¯ Ø£Ø·ÙˆÙ„ Ø³Ù„Ø³Ù„Ø© Ù„Ùƒ. ØºØ¯Ø§Ù‹ ØªÙƒØªØ¨ Ø±Ù‚Ù…Ø§Ù‹ Ø¬Ø¯ÙŠØ¯Ø§Ù‹.',
      deepReflector: 'Ù…ØªÙˆØ³Ø· ØªØ£Ù…Ù„Ø§ØªÙƒ {avg} ÙƒÙ„Ù…Ø©. Ù‡Ø°Ø§ Ø¹Ù…Ù‚ Ù†Ø§Ø¯Ø±.',
      wordsMilestone: 'ÙƒØªØ¨Øª {words} ÙƒÙ„Ù…Ø© ØªØ£Ù…Ù„ÙŠØ©. Ù‡Ø°Ù‡ Ù…Ø­Ø§Ø¯Ø«Ø© Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù…Ø¹ Ù†ÙØ³Ùƒ.',
      lessonsPace: 'Ø­Ø§ÙØ¸Øª Ø¹Ù„Ù‰ ÙˆØªÙŠØ±Ø© Ø¯Ø±Ø³ ÙƒÙ„ {days} ÙŠÙˆÙ… Ø®Ù„Ø§Ù„ {totalDays} ÙŠÙˆÙ…Ø§Ù‹.',
      why: 'Ø¨Ø¯Ø£Øª Ù„Ù‡Ø°Ø§ Ø§Ù„Ø³Ø¨Ø¨: "{why}" - Ù‡Ù„ Ù…Ø§ Ø²Ø§Ù„ Ù…Ø´ØªØ¹Ù„Ø§Ù‹ØŸ',
      goals: {
        calmer: 'Ù‡Ø¯ÙÙƒ Ù‡Ùˆ Ø§Ù„Ù‡Ø¯ÙˆØ¡. ÙƒÙ„ Ù…Ù…Ø§Ø±Ø³Ø© ØªØ¯Ø±Ø¨Ùƒ Ø¹Ù„Ù‰ Ø§Ù„Ø§Ø³ØªØ¬Ø§Ø¨Ø© Ø¨Ø¯Ù„ Ø±Ø¯ Ø§Ù„ÙØ¹Ù„.',
        disciplined: '{streakPart} - Ù‡Ø°Ø§ Ù‡Ùˆ Ø§Ù„Ø§Ù†Ø¶Ø¨Ø§Ø·: Ø§Ø®ØªÙŠØ§Ø± ÙŠÙˆÙ…ÙŠ Ù…ØªÙƒØ±Ø±.',
        confident: 'Ø§Ù„Ø«Ù‚Ø© ØªØ£ØªÙŠ Ù…Ù† Ø§Ù„Ø£Ø¯Ù„Ø©: {lessons} Ø¯Ø±Ø³Ø§Ù‹ Ùˆ{reflections} ØªØ£Ù…Ù„Ø§Ù‹.',
        leader: 'Ø§Ù„Ù‚ÙŠØ§Ø¯Ø© ØªØ¨Ø¯Ø£ Ø¨Ù‚ÙŠØ§Ø¯Ø© Ø§Ù„Ø°Ø§Øª.',
        focused: 'ÙƒÙ„ Ø¯Ø±Ø³ ÙŠØ¯Ø±Ø¨ Ø§Ù†ØªØ¨Ø§Ù‡Ùƒ. Ø§Ù„ØªØ±ÙƒÙŠØ² ÙŠÙØ¨Ù†Ù‰.',
        resilient: 'Ø§Ù„Ù…Ø±ÙˆÙ†Ø© ØªÙØµØ§Øº Ø¨Ø§Ù„Ù…Ù…Ø§Ø±Ø³Ø©. {lessons} Ø¯Ø±Ø³Ø§Ù‹ Ù…ÙƒØªÙ…Ù„Ù‹Ø§. {streakPart2}',
      },
      goalAlignment: 'Ù…ÙˆØ§Ø¡Ù…Ø© Ø§Ù„Ù‡Ø¯Ù',
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
    showingUp: '{count} jours de prÃ©sence',
    startingFresh: 'Nouveau dÃ©part',
    inARow: '{count} jours dâ€™affilÃ©e.',
    dayStreak: 'SÃ©rie de {count} jours.',
  },
  ar: {
    showingUp: '{count} ÙŠÙˆÙ…Ø§Ù‹ Ù…Ù† Ø§Ù„Ø§Ù„ØªØ²Ø§Ù…',
    startingFresh: 'Ø¨Ø¯Ø§ÙŠØ© Ø¬Ø¯ÙŠØ¯Ø©',
    inARow: '{count} ÙŠÙˆÙ…Ø§Ù‹ Ù…ØªØªØ§Ù„ÙŠØ©.',
    dayStreak: 'Ø³Ù„Ø³Ù„Ø© {count} ÙŠÙˆÙ…Ù‹Ø§.',
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
