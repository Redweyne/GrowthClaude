// ============================================================================
// STORY BUILDER
// Assembles personalized transformation stories from user data.
// ============================================================================

import { v4 as uuidv4 } from 'uuid';
import {
  TransformationStory,
  StorySlide,
  StoryType,
  StoryMood,
  StoryGenerationContext,
  ShareableStoryCard,
  ShareableStat,
  OpeningSlide,
  JourneyStartSlide,
  ContrastSlide,
  PatternShiftSlide,
  IdentityMomentSlide,
  StreakHighlightSlide,
  StatRevealSlide,
  AssessmentGrowthSlide,
  WordCloudSlide,
  ClosingSlide,
  CallToActionSlide,
  SlideBackground,
  SlideAnimation,
  TransformationInsight,
} from '@/types/story';
import {
  findBestContrast,
  analyzeWordFrequency,
  getReflectionStats,
  findBreakthroughReflection,
} from './reflectionAnalyzer';
import { analyzePatternEvolution, formatPatternsForSlide } from './patternAnalyzer';
import { generateInsights, determineStoryMood } from './insightGenerator';
import {
  ASSESSMENT_DIMENSION_LABELS,
  STORY_LOCALE_TAGS,
  formatStory,
  formatStoryDate,
  formatStoryMonthLabel,
  formatStoryNumber,
  resolveStoryLocale,
  type StoryLocale,
} from './storyLocale';

export const OPENING_HEADLINES: Record<StoryLocale, Record<StoryMood, string[]>> = {
  en: {
    triumphant: ['This Is Who You Have Become', 'Look How Far You Have Risen', 'The Fire Inside You Won'],
    reflective: ['The Quiet Work You Have Done', 'When You Look Back', 'This Is Your Story'],
    resilient: ['You Never Gave Up', 'Through It All, You Kept Going', 'The Strength Was Always There'],
    awakening: ['Something In You Shifted', 'The First Step Matters Most', 'A New Chapter Began'],
    transformative: ['Read This Slowly', 'You Are Not The Same Person', 'This Is What Growth Looks Like'],
  },
  fr: {
    triumphant: ['Voici la personne que vous etes devenu', 'Regardez le chemin parcouru', 'Le feu interieur a tenu bon'],
    reflective: ['Le travail silencieux que vous avez fait', 'Quand vous regardez en arriere', 'Voici votre histoire'],
    resilient: ['Vous n avez pas abandonne', 'Malgre tout, vous avez continue', 'La force etait deja en vous'],
    awakening: ['Quelque chose a bouge en vous', 'Le premier pas compte le plus', 'Un nouveau chapitre a commence'],
    transformative: ['Lisez ceci lentement', 'Vous n etes plus la meme personne', 'Voila a quoi ressemble la croissance'],
  },
  ar: {
    triumphant: ['هذه هي النسخة التي أصبحتها', 'انظر كم ارتفعت', 'النار التي بداخلك انتصرت'],
    reflective: ['هذا هو العمل الهادئ الذي قمت به', 'عندما تنظر إلى الخلف', 'هذه قصتك'],
    resilient: ['أنت لم تستسلم', 'رغم كل شيء واصلت', 'القوة كانت بداخلك دائما'],
    awakening: ['شيء ما تبدل داخلك', 'الخطوة الأولى هي الأهم', 'بدأ فصل جديد'],
    transformative: ['اقرأ هذا ببطء', 'أنت لست الشخص نفسه الذي بدأ', 'هكذا يبدو النمو الحقيقي'],
  },
};

export const CLOSING_MESSAGES: Record<StoryLocale, Record<StoryMood, string[]>> = {
  en: {
    triumphant: ['You did not just change. You became.', 'This version of you is beautiful.', 'The fire you built will keep lighting your path.'],
    reflective: ['The deepest growth happens quietly.', 'You have been doing the work, and it shows.', 'Some transformations can only be felt.'],
    resilient: ['You chose yourself again and again.', 'Consistency has become part of your identity.', 'You kept going when stopping would have been easier.'],
    awakening: ['The journey has begun.', 'Something powerful is taking root inside you.', 'Trust the process. Trust yourself.'],
    transformative: ['The person reading this is not the person who started.', 'You are proof that change is possible.', 'What you have done here is remarkable.'],
  },
  fr: {
    triumphant: ["Vous n'avez pas seulement changé, vous avez évolué.", "Cette version de vous est magnifique.", "Le feu que vous avez construit continuera d'éclairer votre route."],
    reflective: ["Les transformations les plus profondes se passent en silence.", "Vous faites le travail, et cela se voit.", "Certaines transformations se sentent avant de se raconter."],
    resilient: ["Vous vous êtes choisi encore et encore.", "La constance fait maintenant partie de votre identité.", "Vous avez continué même quand il était plus simple de vous arrêter."],
    awakening: ["Le voyage a commencé.", "Quelque chose de puissant prend racine en vous.", "Faites confiance au processus. Faites-vous confiance."],
    transformative: ["La personne qui lit ceci n'est plus celle qui a commencé.", "Vous êtes la preuve que le changement est possible.", "Ce que vous avez construit ici est remarquable."],
  },
  ar: {
    triumphant: ['أنت لم تتغير فقط، بل أصبحت شيئا جديدا.', 'هذه النسخة منك جميلة.', 'النار التي بنيتها ستواصل إضاءة طريقك.'],
    reflective: ['أعمق أشكال النمو تحدث بهدوء.', 'لقد كنت تقوم بالعمل فعلا، وهذا واضح.', 'بعض التحولات لا تُشرح بل تُشعر.'],
    resilient: ['لقد اخترت نفسك مرة بعد مرة.', 'أصبح الثبات جزءا من هويتك.', 'واصلت رغم أن التوقف كان أسهل.'],
    awakening: ['لقد بدأت الرحلة.', 'شيء قوي بدأ يترسخ داخلك.', 'ثق في العملية، وثق بنفسك.'],
    transformative: ['الشخص الذي يقرأ هذا الآن ليس الشخص الذي بدأ.', 'أنت دليل حي على أن التغيير ممكن.', 'ما بنيته هنا مميز حقا.'],
  },
};

export const PERSONAL_NOTES: Record<StoryLocale, Record<StoryMood, string>> = {
  en: {
    triumphant: 'Every reflection, every lesson, and every day you showed up mattered. This story is the evidence.',
    reflective: 'Growth is not always loud. Often it lives in the quiet shifts, the small reframes, and the choices nobody else sees.',
    resilient: 'There were moments when it would have been easier to stop. Something in you kept choosing the path anyway. That matters.',
    awakening: 'A single spark can start a fire. You lit that spark, and now the path ahead is real.',
    transformative: 'If someone had shown you this version of yourself at the beginning, you might not have believed it. Yet here you are.',
  },
  fr: {
    triumphant: "Chaque réflexion, chaque leçon et chaque jour compte. Cette histoire en est la preuve.",
    reflective: "La croissance n'est pas toujours spectaculaire. Elle vit souvent dans les déclics silencieux et les choix que personne ne voit.",
    resilient: "Il y a eu des moments où il aurait été plus simple d'arrêter. Quelque chose en vous a choisi d'avancer quand même.",
    awakening: "Une seule étincelle suffit à allumer un feu. Vous avez allumé cette étincelle, et le chemin existe désormais vraiment.",
    transformative: "Si on vous avait montré cette version de vous au début, vous auriez peut-être douté. Pourtant la voici.",
  },
  ar: {
    triumphant: 'كل تأمل وكل درس وكل يوم حضرت فيه كان مهما. هذه القصة هي الدليل.',
    reflective: 'النمو ليس دائما صاخبا. غالبا ما يعيش في التحولات الهادئة والخيارات التي لا يراها أحد غيرك.',
    resilient: 'كانت هناك لحظات كان التوقف فيها أسهل. لكن شيئا فيك اختار الاستمرار، وهذا مهم.',
    awakening: 'شرارة واحدة تكفي لتشعل نارا. لقد أشعلت تلك الشرارة، والطريق أمامك أصبح حقيقيا.',
    transformative: 'لو رأيت هذه النسخة منك في البداية ربما لما صدقتها. ومع ذلك ها أنت هنا.',
  },
};

const COPY = {
  en: {
    weeklyReview: 'Your week in review',
    milestoneWorth: 'A milestone worth celebrating',
    transformationDays: '{count} days of transformation',
    dayOne: 'Day One',
    dayCount: '{count} Days',
    namedTransformation: "{name}'s Transformation",
    yourTransformation: 'Your Transformation',
    firstLessonFallback: 'Your first lesson',
    openingToday: 'Today, something changed inside you.',
    openingDaysAgo: '{count} days ago, you made the decision that changed everything.',
    statHeadline: 'What Your Commitment Built',
    wordsWritten: 'Words Written',
    selfReflection: 'in self-reflection',
    lessonsCompleted: 'Lessons Completed',
    wisdomGained: 'wisdom gained',
    currentLevel: 'Current Level',
    reflections: 'Reflections',
    momentsOfClarity: 'moments of clarity',
    then: 'Then',
    now: 'Now',
    growthIndicator: '{count} days between these moments',
    streak: {
      d30: 'A month of relentless dedication. This is no longer discipline. It is who you are.',
      d14: 'Two weeks of choosing yourself every single day. That takes something rare.',
      d7: 'Seven days of showing up. The habit is taking root.',
      best: 'Your personal best: {count} days. You proved you can do this. Now do it again.',
      fallback: 'Every day you choose growth is a victory. Never forget that.',
    },
    identityMessage: 'Words shape reality. You are writing yourself into existence.',
    assessmentMessage: 'Your {label} grew by {count} points.',
    wordCloudMessage: 'The vocabulary of your transformation',
    rememberThisMoment: 'Remember this moment.',
    bestIsYet: 'The best is yet to come.',
    shareStory: 'Share Your Story',
    continueJourney: 'Continue Your Journey',
    encouragementTriumphant: 'Your story may help someone else believe change is possible. Share it.',
    encouragementDefault: 'This moment matters. Your journey matters. You matter.',
    dayStreak: 'Day Streak',
    lessons: 'Lessons',
    myTransformationStory: 'My Transformation Story',
    growthDays: '{count} days of growth',
    reflectionOn: '- From my reflection on {date}',
  },
  fr: {
    weeklyReview: 'Votre semaine en revue',
    milestoneWorth: "Une étape qui mérite d'être célébrée",
    transformationDays: '{count} jours de transformation',
    dayOne: 'Jour un',
    dayCount: '{count} jours',
    namedTransformation: 'La transformation de {name}',
    yourTransformation: 'Votre transformation',
    firstLessonFallback: "Votre première leçon",
    openingToday: "Aujourd'hui, quelque chose a bougé en vous.",
    openingDaysAgo: "Il y a {count} jours, vous avez pris une décision qui a tout changé.",
    statHeadline: "Ce que votre engagement a construit",
    wordsWritten: "Mots écrits",
    selfReflection: "dans vos réflexions",
    lessonsCompleted: "Leçons terminées",
    wisdomGained: "sagesse intégrée",
    currentLevel: "Niveau actuel",
    reflections: "Réflexions",
    momentsOfClarity: "moments de clarté",
    then: 'Avant',
    now: 'Maintenant',
    growthIndicator: '{count} jours entre ces deux moments',
    streak: {
      d30: "Un mois de dédication continue. Ce n'est plus seulement de la discipline, c'est devenu vous.",
      d14: "Deux semaines à vous choisir chaque jour. Cela demande quelque chose de rare.",
      d7: "Sept jours de présence. L'habitude prend racine.",
      best: "Votre meilleure série : {count} jours. Vous avez prouvé que c'est possible. Refaites-le.",
      fallback: "Chaque jour où vous choisissez la progression est une victoire. Gardez-le en mémoire.",
    },
    identityMessage: "Les mots façonnent la réalité. Vous êtes en train d'écrire qui vous devenez.",
    assessmentMessage: "Votre {label} a progressé de {count} points.",
    wordCloudMessage: "Le vocabulaire de votre transformation",
    rememberThisMoment: "Souvenez-vous de cet instant.",
    bestIsYet: "Le meilleur reste à venir.",
    shareStory: 'Partager votre histoire',
    continueJourney: 'Continuer votre parcours',
    encouragementTriumphant: "Votre histoire peut aider quelqu'un d'autre à croire au changement. Partagez-la.",
    encouragementDefault: "Cet instant compte. Votre parcours compte. Vous comptez.",
    dayStreak: "Série",
    lessons: "Leçons",
    myTransformationStory: "Mon histoire de transformation",
    growthDays: "{count} jours de progression",
    reflectionOn: "- Extrait de ma réflexion du {date}",
  },
  ar: {
    weeklyReview: 'مراجعة أسبوعك',
    milestoneWorth: 'محطة تستحق الاحتفال',
    transformationDays: '{count} يوما من التحول',
    dayOne: 'اليوم الأول',
    dayCount: '{count} يوما',
    namedTransformation: 'تحول {name}',
    yourTransformation: 'تحولك',
    firstLessonFallback: 'درسك الأول',
    openingToday: 'اليوم، تبدل شيء ما داخلك.',
    openingDaysAgo: 'منذ {count} يوما اتخذت القرار الذي بدأ يغير كل شيء.',
    statHeadline: 'ما الذي بناه التزامك',
    wordsWritten: 'الكلمات المكتوبة',
    selfReflection: 'في تأملاتك',
    lessonsCompleted: 'الدروس المكتملة',
    wisdomGained: 'حكمة اكتسبتها',
    currentLevel: 'المستوى الحالي',
    reflections: 'التأملات',
    momentsOfClarity: 'لحظات وضوح',
    then: 'في البداية',
    now: 'الآن',
    growthIndicator: '{count} يوما بين هاتين اللحظتين',
    streak: {
      d30: 'شهر كامل من الالتزام المستمر. هذا لم يعد مجرد انضباط، بل أصبح جزءا منك.',
      d14: 'أسبوعان من اختيار نفسك كل يوم. هذا يتطلب شيئا نادرا.',
      d7: 'سبعة أيام من الحضور. العادة بدأت تترسخ.',
      best: 'أفضل سلسلة لك: {count} يوما. لقد أثبت أن بإمكانك فعلها، فافعلها من جديد.',
      fallback: 'كل يوم تختار فيه النمو هو انتصار. لا تنس ذلك.',
    },
    identityMessage: 'الكلمات تصنع الواقع. أنت تكتب نفسك إلى الوجود.',
    assessmentMessage: 'زاد {label} لديك بمقدار {count} نقاط.',
    wordCloudMessage: 'مفردات تحولك',
    rememberThisMoment: 'تذكر هذه اللحظة.',
    bestIsYet: 'الأفضل لم يأت بعد.',
    shareStory: 'شارك قصتك',
    continueJourney: 'واصل رحلتك',
    encouragementTriumphant: 'قد تساعد قصتك شخصا آخر على الإيمان بإمكانية التغيير. شاركها.',
    encouragementDefault: 'هذه اللحظة مهمة. رحلتك مهمة. وأنت مهم.',
    dayStreak: 'سلسلة الأيام',
    lessons: 'الدروس',
    myTransformationStory: 'قصة تحولي',
    growthDays: '{count} يوما من النمو',
    reflectionOn: '- من تأملي بتاريخ {date}',
  },
} as const;

const BACKGROUNDS: Record<string, SlideBackground> = {
  opening: { type: 'gradient', colors: ['#1a1a2e', '#16213e', '#0f3460'], pattern: 'none' },
  warmGlow: { type: 'gradient', colors: ['#1a1a2e', '#2d1f3d', '#3d2449'], pattern: 'none' },
  growthGreen: { type: 'gradient', colors: ['#0f2027', '#203a43', '#2c5364'], pattern: 'none' },
  deepPurple: { type: 'gradient', colors: ['#1a1a2e', '#2d2b55', '#3d3875'], pattern: 'none' },
  celebration: { type: 'gradient', colors: ['#1a1a2e', '#2a2a4a', '#3a3a6a'], pattern: 'dots' },
  closing: { type: 'gradient', colors: ['#0f0f1a', '#1a1a2e', '#252545'], pattern: 'none' },
};

const ANIMATIONS: Record<string, SlideAnimation> = {
  fadeIn: { enter: 'fade', exit: 'fade', stagger: 100 },
  slideUp: { enter: 'slide_up', exit: 'fade', stagger: 150 },
  scaleIn: { enter: 'scale', exit: 'fade', stagger: 100 },
  blurIn: { enter: 'blur', exit: 'blur', stagger: 200 },
};

export function buildTransformationStory(
  context: StoryGenerationContext,
  type: StoryType = 'on_demand'
): TransformationStory {
  const storyId = uuidv4();
  const insights = generateInsights(context);
  const mood = determineStoryMood(insights);
  const slides = buildSlides(context, insights, mood);
  const { title, subtitle } = generateTitleAndSubtitle(context, mood, type);
  const shareCard = buildShareableCard(context, mood, storyId);

  return {
    id: storyId,
    type,
    mood,
    generatedAt: new Date().toISOString(),
    periodStart: context.periodStart.toISOString(),
    periodEnd: context.periodEnd.toISOString(),
    title,
    subtitle,
    slides,
    shareCard,
    metrics: context.metrics,
  };
}

function generateTitleAndSubtitle(
  context: StoryGenerationContext,
  mood: StoryMood,
  type: StoryType
): { title: string; subtitle: string } {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const headlines = OPENING_HEADLINES[locale][mood];
  const title = headlines[Math.floor(Math.random() * headlines.length)];

  let subtitle: string;
  switch (type) {
    case 'weekly':
      subtitle = copy.weeklyReview;
      break;
    case 'monthly':
      subtitle = formatStoryMonthLabel(
        `${context.periodEnd.getFullYear()}-${String(context.periodEnd.getMonth() + 1).padStart(2, '0')}`,
        locale,
        'long'
      );
      break;
    case 'milestone':
      subtitle = copy.milestoneWorth;
      break;
    default:
      subtitle = formatStory(copy.transformationDays, { count: context.metrics.daysSinceStart });
  }

  return { title, subtitle };
}

function buildSlides(
  context: StoryGenerationContext,
  insights: TransformationInsight[],
  mood: StoryMood
): StorySlide[] {
  const slides: StorySlide[] = [];
  let order = 0;

  slides.push(buildOpeningSlide(context, mood, order++));

  if (context.metrics.daysSinceStart > 0) {
    slides.push(buildJourneyStartSlide(context, order++));
  }

  slides.push(buildStatRevealSlide(context, order++));

  const contrast = findBestContrast(context.reflections, context.locale);
  if (contrast && contrast.contrastScore >= 0.25) {
    slides.push(buildContrastSlide(contrast, context, order++));
  }

  if (context.patternHistory.length >= 2) {
    const patternSlide = buildPatternShiftSlide(context, order++);
    if (patternSlide) slides.push(patternSlide);
  }

  if (context.metrics.currentStreak >= 3 || context.metrics.longestStreak >= 7) {
    slides.push(buildStreakHighlightSlide(context, order++));
  }

  if (context.identityStatements.length > 0) {
    slides.push(buildIdentityMomentSlide(context, order++));
  }

  const assessmentSlide = buildAssessmentGrowthSlide(context, order);
  if (assessmentSlide) {
    slides.push(assessmentSlide);
    order += 1;
  }

  if (context.reflections.length >= 5) {
    slides.push(buildWordCloudSlide(context, order++));
  }

  slides.push(buildClosingSlide(context, mood, order++));
  slides.push(buildCallToActionSlide(context, mood, order++));

  return slides;
}

function buildOpeningSlide(context: StoryGenerationContext, mood: StoryMood, order: number): OpeningSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const periodLabel = context.metrics.daysSinceStart === 0
    ? copy.dayOne
    : formatStory(copy.dayCount, { count: context.metrics.daysSinceStart });

  return {
    id: uuidv4(),
    type: 'opening',
    order,
    duration: 5500,
    background: BACKGROUNDS.opening,
    animation: ANIMATIONS.blurIn,
    headline: randomFrom(OPENING_HEADLINES[locale][mood]),
    subheadline: context.userName
      ? formatStory(copy.namedTransformation, { name: context.userName })
      : copy.yourTransformation,
    periodLabel,
    accentEmoji: mood === 'triumphant' ? '✨' : undefined,
  };
}

function buildJourneyStartSlide(context: StoryGenerationContext, order: number): JourneyStartSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const firstReflection = context.reflections[0];
  const firstDate = firstReflection ? new Date(firstReflection.date) : context.periodStart;

  return {
    id: uuidv4(),
    type: 'journey_start',
    order,
    duration: 6000,
    background: BACKGROUNDS.warmGlow,
    animation: ANIMATIONS.slideUp,
    daysSinceStart: context.metrics.daysSinceStart,
    firstLessonDate: formatStoryDate(firstDate, locale, { month: 'long', day: 'numeric', year: 'numeric' }),
    firstLessonTitle: firstReflection?.lessonTitle || copy.firstLessonFallback,
    openingMessage: context.metrics.daysSinceStart === 0
      ? copy.openingToday
      : formatStory(copy.openingDaysAgo, { count: context.metrics.daysSinceStart }),
  };
}

function buildStatRevealSlide(context: StoryGenerationContext, order: number): StatRevealSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const stats = getReflectionStats(context.reflections);

  return {
    id: uuidv4(),
    type: 'stat_reveal',
    order,
    duration: 6000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.scaleIn,
    stats: [
      {
        label: copy.wordsWritten,
        value: formatStoryNumber(stats.totalWords, locale),
        subtext: copy.selfReflection,
        icon: '✍️',
        color: '#8B5CF6',
        animation: 'count_up',
      },
      {
        label: copy.lessonsCompleted,
        value: context.metrics.lessonsCompleted,
        subtext: copy.wisdomGained,
        icon: '📚',
        color: '#3B82F6',
        animation: 'count_up',
      },
      {
        label: copy.currentLevel,
        value: context.metrics.currentLevel,
        subtext: `${formatStoryNumber(context.metrics.totalXpEarned, locale)} XP`,
        icon: '⚡',
        color: '#F59E0B',
        animation: 'pop',
      },
      {
        label: copy.reflections,
        value: stats.total,
        subtext: copy.momentsOfClarity,
        icon: '💭',
        color: '#10B981',
        animation: 'count_up',
      },
    ],
    headline: copy.statHeadline,
  };
}

function buildContrastSlide(
  contrast: ReturnType<typeof findBestContrast>,
  context: StoryGenerationContext,
  order: number
): ContrastSlide {
  if (!contrast) {
    throw new Error('Cannot build contrast slide without contrast data');
  }

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const daysBetween = Math.floor(
    (new Date(contrast.after.date).getTime() - new Date(contrast.before.date).getTime())
    / (1000 * 60 * 60 * 24)
  );

  return {
    id: uuidv4(),
    type: 'contrast',
    order,
    duration: 10000,
    background: BACKGROUNDS.growthGreen,
    animation: ANIMATIONS.slideUp,
    before: {
      text: truncateText(contrast.before.text, 200),
      date: formatStoryDate(contrast.before.date, locale, { month: 'short', day: 'numeric' }),
      label: copy.then,
    },
    after: {
      text: truncateText(contrast.after.text, 200),
      date: formatStoryDate(contrast.after.date, locale, { month: 'short', day: 'numeric' }),
      label: copy.now,
    },
    insightMessage: contrast.growthNarrative,
    growthIndicator: formatStory(copy.growthIndicator, { count: daysBetween }),
  };
}

function buildPatternShiftSlide(context: StoryGenerationContext, order: number): PatternShiftSlide | null {
  const locale = resolveStoryLocale(context.locale);
  const evolution = analyzePatternEvolution(context.patternHistory, locale);
  if (evolution.significantShifts.length === 0) return null;

  const shift = evolution.significantShifts[0];
  const { fromPatterns, toPatterns } = formatPatternsForSlide(
    context.patternHistory[0],
    context.patternHistory[context.patternHistory.length - 1],
    locale
  );

  if (fromPatterns.length === 0 && toPatterns.length === 0) return null;

  return {
    id: uuidv4(),
    type: 'pattern_shift',
    order,
    duration: 7000,
    background: BACKGROUNDS.warmGlow,
    animation: ANIMATIONS.slideUp,
    fromPatterns,
    toPatterns,
    shiftMessage: shift.narrative,
    interpretation: evolution.evolutionNarrative,
  };
}

function buildStreakHighlightSlide(context: StoryGenerationContext, order: number): StreakHighlightSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const { currentStreak, longestStreak, totalActiveDays, consistencyPercentage } = context.metrics;

  let message: string;
  let emoji: string;

  if (currentStreak >= 30) {
    message = copy.streak.d30;
    emoji = '🔥';
  } else if (currentStreak >= 14) {
    message = copy.streak.d14;
    emoji = '💪';
  } else if (currentStreak >= 7) {
    message = copy.streak.d7;
    emoji = '⭐';
  } else if (longestStreak >= 7) {
    message = formatStory(copy.streak.best, { count: longestStreak });
    emoji = '🎯';
  } else {
    message = copy.streak.fallback;
    emoji = '✨';
  }

  return {
    id: uuidv4(),
    type: 'streak_highlight',
    order,
    duration: 5000,
    background: BACKGROUNDS.celebration,
    animation: ANIMATIONS.scaleIn,
    currentStreak,
    longestStreak,
    totalActiveDays,
    consistencyScore: Math.round(consistencyPercentage),
    message,
    streakEmoji: emoji,
  };
}

function buildIdentityMomentSlide(context: StoryGenerationContext, order: number): IdentityMomentSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const latest = context.identityStatements[context.identityStatements.length - 1];

  return {
    id: uuidv4(),
    type: 'identity_moment',
    order,
    duration: 8000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.blurIn,
    statement: {
      text: latest.statement,
      date: formatStoryDate(latest.date, locale, { month: 'long', day: 'numeric' }),
      context: latest.context,
    },
    message: copy.identityMessage,
    totalStatements: context.identityStatements.length,
  };
}

function buildAssessmentGrowthSlide(
  context: StoryGenerationContext,
  order: number
): AssessmentGrowthSlide | null {
  if (context.assessments.length < 2) return null;

  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const labels = ASSESSMENT_DIMENSION_LABELS[locale];
  const first = context.assessments[0];
  const last = context.assessments[context.assessments.length - 1];
  const dimensions = ['emotionalMastery', 'discipline', 'perspective', 'selfAwareness', 'growth'];
  const icons: Record<string, string> = {
    emotionalMastery: '🧘',
    discipline: '⚡',
    perspective: '🔭',
    selfAwareness: '🪞',
    growth: '🌱',
  };

  let bestDimension = dimensions[0];
  let bestGrowth = 0;

  for (const dimension of dimensions) {
    const growth = (last.scores[dimension] || 0) - (first.scores[dimension] || 0);
    if (growth > bestGrowth) {
      bestGrowth = growth;
      bestDimension = dimension;
    }
  }

  if (bestGrowth < 1) return null;

  const growthPercentage = Math.round(bestGrowth / Math.max(first.scores[bestDimension] || 1, 1) * 100);

  return {
    id: uuidv4(),
    type: 'assessment_growth',
    order,
    duration: 6000,
    background: BACKGROUNDS.growthGreen,
    animation: ANIMATIONS.slideUp,
    dimension: labels[bestDimension],
    dimensionIcon: icons[bestDimension],
    before: {
      score: first.scores[bestDimension] || 0,
      date: formatStoryMonthLabel(first.month, locale, 'short'),
    },
    after: {
      score: last.scores[bestDimension] || 0,
      date: formatStoryMonthLabel(last.month, locale, 'short'),
    },
    growthPercentage,
    message: formatStory(copy.assessmentMessage, {
      label: labels[bestDimension].toLowerCase(),
      count: bestGrowth,
    }),
  };
}

function buildWordCloudSlide(context: StoryGenerationContext, order: number): WordCloudSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const words = analyzeWordFrequency(context.reflections);
  const stats = getReflectionStats(context.reflections);

  return {
    id: uuidv4(),
    type: 'word_cloud',
    order,
    duration: 5000,
    background: BACKGROUNDS.deepPurple,
    animation: ANIMATIONS.fadeIn,
    words: words.slice(0, 20),
    totalWordsWritten: stats.totalWords,
    message: copy.wordCloudMessage,
  };
}

function buildClosingSlide(
  context: StoryGenerationContext,
  mood: StoryMood,
  order: number
): ClosingSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];

  return {
    id: uuidv4(),
    type: 'closing',
    order,
    duration: 9000,
    background: BACKGROUNDS.closing,
    animation: ANIMATIONS.blurIn,
    headline: context.userName ? `${context.userName},` : copy.rememberThisMoment,
    message: randomFrom(CLOSING_MESSAGES[locale][mood]),
    personalNote: PERSONAL_NOTES[locale][mood],
    signOff: copy.bestIsYet,
  };
}

function buildCallToActionSlide(
  context: StoryGenerationContext,
  mood: StoryMood,
  order: number
): CallToActionSlide {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];

  return {
    id: uuidv4(),
    type: 'call_to_action',
    order,
    duration: 0,
    background: BACKGROUNDS.closing,
    animation: ANIMATIONS.fadeIn,
    primaryAction: {
      label: copy.shareStory,
      action: 'share',
    },
    secondaryAction: {
      label: copy.continueJourney,
      action: 'continue',
    },
    encouragement: mood === 'triumphant' ? copy.encouragementTriumphant : copy.encouragementDefault,
  };
}

function buildShareableCard(
  context: StoryGenerationContext,
  mood: StoryMood,
  storyId: string
): ShareableStoryCard {
  const locale = resolveStoryLocale(context.locale);
  const copy = COPY[locale];
  const stats: ShareableStat[] = [
    { icon: '🔥', value: `${context.metrics.currentStreak}`, label: copy.dayStreak },
    { icon: '📚', value: `${context.metrics.lessonsCompleted}`, label: copy.lessons },
    {
      icon: '✍️',
      value: formatStoryNumber(context.metrics.totalWordsWritten || getReflectionStats(context.reflections).totalWords, locale),
      label: copy.wordsWritten,
    },
  ];

  const breakthrough = findBreakthroughReflection(context.reflections);
  const quote = breakthrough
    ? {
        text: truncateText(breakthrough.text, 120),
        attribution: formatStory(copy.reflectionOn, {
          date: formatStoryDate(breakthrough.date, locale),
        }),
      }
    : undefined;

  const themes: Record<StoryMood, { background: string[]; textColor: string; accentColor: string; pattern: 'minimal' | 'geometric' | 'organic' | 'none' }> = {
    triumphant: { background: ['#1a1a2e', '#2d1f3d', '#4a2c4a'], textColor: '#ffffff', accentColor: '#F59E0B', pattern: 'geometric' },
    reflective: { background: ['#0f2027', '#203a43', '#2c5364'], textColor: '#ffffff', accentColor: '#06B6D4', pattern: 'minimal' },
    resilient: { background: ['#1a1a2e', '#2a2a4a', '#3a3a6a'], textColor: '#ffffff', accentColor: '#10B981', pattern: 'minimal' },
    awakening: { background: ['#1a1a2e', '#2d2b55', '#3d3875'], textColor: '#ffffff', accentColor: '#8B5CF6', pattern: 'organic' },
    transformative: { background: ['#0f0f1a', '#1a1a2e', '#2a1a3e'], textColor: '#ffffff', accentColor: '#EC4899', pattern: 'geometric' },
  };

  return {
    id: uuidv4(),
    storyId,
    title: context.userName
      ? formatStory(copy.namedTransformation, { name: context.userName })
      : copy.myTransformationStory,
    subtitle: formatStory(copy.growthDays, { count: context.metrics.daysSinceStart }),
    stats,
    quote,
    period: `${formatStoryDate(context.periodStart, locale)} - ${formatStoryDate(context.periodEnd, locale)}`,
    theme: themes[mood],
  };
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (lastSentenceEnd > maxLength * 0.6) {
    return text.slice(0, lastSentenceEnd + 1);
  }

  const lastSpace = truncated.lastIndexOf(' ');
  return text.slice(0, Math.max(lastSpace, 0)) + '...';
}

function randomFrom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}
