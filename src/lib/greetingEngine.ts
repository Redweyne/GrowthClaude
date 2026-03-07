export interface GreetingContext {
  name: string;
  streak: number;
  longestStreak: number;
  totalLessons: number;
  lastLessonDate: string | null;
  lastLessonTitle?: string;
  lastLessonCoreTag?: string;
  transformationGoal?: string | null;
}

export interface GreetingResult {
  greeting: string;
  message: string;
  subMessage?: string;
  mood: 'warm' | 'motivating' | 'celebratory' | 'gentle' | 'fierce';
}

type TimeOfDay = 'earlyMorning' | 'morning' | 'afternoon' | 'evening' | 'lateNight';
type Locale = 'en' | 'fr' | 'ar';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return 'earlyMorning';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'lateNight';
}

function dayOfYear(): number {
  return Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
}

function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => `${params[key] ?? `{${key}}`}`);
}

const COPY = {
  en: {
    timeGreetings: {
      earlyMorning: ['The world is still quiet', 'Up before the noise', 'Early riser'],
      morning: ['Good morning', 'A new day begins', 'Fresh start'],
      afternoon: ['Good afternoon', 'Still going strong', 'Midday momentum'],
      evening: ['Good evening', 'Winding down wisely', 'Evening reflection'],
      lateNight: ['Night owl', 'The quiet hours', 'Still awake, still growing'],
    } as Record<TimeOfDay, string[]>,
    streak: {
      first: 'Your journey begins with a single step.',
      day1: 'Day 1. Every transformation starts here.',
      day3: '3 days strong. A habit is taking shape.',
      day7: 'One full week. You earned a Streak Shield.',
      day14: '2 weeks of relentless growth. Respect.',
      day21: '21 days. They say this is when habits become identity.',
      day30: '30 days. You are no longer the person who started.',
      day50Plus: '{streak} days. Legendary discipline.',
      matchBest: 'You just matched your longest streak. Tomorrow you break it.',
      beatBest: 'New personal record: {streak} days. You just surpassed your best.',
      short: [
        '{streak}-day streak. Building momentum.',
        'Day {streak}. The compound effect is working.',
        '{streak} days and counting. Keep stacking.',
      ],
      medium: [
        '{streak}-day streak burning bright.',
        'Week {weeks}+. Consistency is your superpower.',
        '{streak} days of choosing growth over comfort.',
      ],
      long: [
        '{streak} days of relentless growth.',
        'Day {streak}. This is who you are now.',
        '{streak}-day streak. Unstoppable.',
      ],
    },
    comeback: {
      d2: 'Welcome back. Yesterday was a rest day - today is a growth day.',
      d4: '{days} days away. But you came back. That matters more than the gap.',
      d7: 'A week away, but not a week wasted. Every return is a choice to grow.',
      d14: 'You disappeared for a bit. But here you are. The best comebacks are quiet ones.',
      d30: "It's been a while. No judgment. Just growth. Let's begin again.",
      long: "You're back. That took courage. Let's pick up where you left off.",
    },
    topics: {
      control: ['Remember: focus on what you can control.', 'The weight you carried yesterday - is it lighter today?'],
      habits: ['Your tiny habit from yesterday - did you do it?', 'Small steps. Big transformation.'],
      obstacles: ['That obstacle you named - has it started teaching you yet?', 'The gift hides inside the struggle.'],
      preparation: ['Did you own your morning today?', 'The day is yours to shape.'],
      gratitude: ['What are you grateful for right now?', 'The temporary gift of this moment.'],
      resilience: ['Setbacks build comebacks.', 'The comeback formula is working.'],
      growth: ['Struggle is the path, not the obstacle.', "You're getting stronger in the broken places."],
      courage: ['Fear is the compass. Follow it.', 'On the other side of fear is everything you want.'],
      antifragile: ['Disorder makes you stronger.', "You don't just survive chaos - you feed on it."],
      projection: ['What triggers you teaches you.', "The mirror doesn't lie."],
      honesty: ['Radical truth is radical freedom.', 'Honesty with yourself first.'],
      boundaries: ['Your boundaries protect your peace.', 'Saying no is saying yes to yourself.'],
      empathy: ['Understanding others starts with understanding yourself.', 'Empathy is strength, not weakness.'],
      forgiveness: ['Forgiveness frees the forgiver.', 'Letting go is the ultimate power move.'],
    } as Record<string, string[]>,
  },
  fr: {
    timeGreetings: {
      earlyMorning: ['Le monde est encore silencieux', 'Debout avant le bruit', 'Lève-tôt'],
      morning: ['Bonjour', 'Une nouvelle journée commence', 'Nouveau départ'],
      afternoon: ['Bon après-midi', 'Toujours en mouvement', 'Élan de milieu de journée'],
      evening: ['Bonsoir', 'Finissez la journée avec sagesse', 'Réflexion du soir'],
      lateNight: ['Oiseau de nuit', 'Les heures calmes', 'Toujours éveillé, toujours en croissance'],
    } as Record<TimeOfDay, string[]>,
    streak: {
      first: 'Votre voyage commence par un seul pas.',
      day1: 'Jour 1. Chaque transformation commence ici.',
      day3: '3 jours solides. Une habitude prend forme.',
      day7: 'Une semaine complète. Vous avez gagné un bouclier de série.',
      day14: '2 semaines de progression acharnée. Respect.',
      day21: '21 jours. C est souvent le moment où l habitude devient identité.',
      day30: '30 jours. Vous n êtes plus la personne du début.',
      day50Plus: '{streak} jours. Discipline légendaire.',
      matchBest: 'Vous venez d égaler votre meilleure série. Demain, vous la dépassez.',
      beatBest: 'Nouveau record personnel : {streak} jours. Vous avez dépassé votre meilleur score.',
      short: [
        'Série de {streak} jours. Le momentum monte.',
        'Jour {streak}. L effet cumulé agit.',
        '{streak} jours et ça continue. Continuez à empiler.',
      ],
      medium: [
        'Série de {streak} jours en pleine puissance.',
        'Semaine {weeks}+. La régularité est votre superpouvoir.',
        '{streak} jours à choisir la croissance plutôt que le confort.',
      ],
      long: [
        '{streak} jours de progression continue.',
        'Jour {streak}. C est qui vous êtes désormais.',
        'Série de {streak} jours. Inarrêtable.',
      ],
    },
    comeback: {
      d2: 'Bon retour. Hier était un jour de pause - aujourd hui est un jour de progression.',
      d4: '{days} jours d absence. Mais vous êtes revenu. C est cela qui compte le plus.',
      d7: 'Une semaine d absence, mais pas perdue. Chaque retour est un choix de grandir.',
      d14: 'Vous avez disparu un moment. Mais vous revoilà. Les meilleurs retours sont discrets.',
      d30: 'Cela faisait un moment. Aucun jugement. Juste la progression. Repartons.',
      long: 'Vous êtes de retour. Cela demande du courage. Reprenons là où vous en étiez.',
    },
    topics: {
      control: ['Souvenez-vous : concentrez-vous sur ce que vous contrôlez.', 'Le poids porté hier est-il plus léger aujourd hui ?'],
      habits: ['Votre petite habitude d hier, l avez-vous faite ?', 'Petits pas. Grande transformation.'],
      obstacles: ['Cet obstacle nommé hier vous enseigne-t-il déjà ?', 'Le cadeau se cache dans la difficulté.'],
      preparation: ['Avez-vous pris possession de votre matinée ?', 'Cette journée est à façonner.'],
      gratitude: ['De quoi êtes-vous reconnaissant maintenant ?', 'Le cadeau temporaire de cet instant.'],
      resilience: ['Les revers construisent les retours.', 'La formule du retour fonctionne.'],
      growth: ['La lutte est le chemin, pas l obstacle.', 'Vous devenez plus fort dans les fractures.'],
      courage: ['La peur est une boussole. Suivez-la.', 'De l autre côté de la peur se trouve ce que vous voulez.'],
      antifragile: ['Le désordre vous renforce.', 'Vous ne survivez pas seulement au chaos - vous en tirez de la force.'],
      projection: ['Ce qui vous déclenche vous enseigne.', 'Le miroir ne ment pas.'],
      honesty: ['La vérité radicale est une liberté radicale.', 'L honnêteté commence avec soi.'],
      boundaries: ['Vos limites protègent votre paix.', 'Dire non, c est dire oui à vous-même.'],
      empathy: ['Comprendre les autres commence par vous comprendre.', 'L empathie est une force, pas une faiblesse.'],
      forgiveness: ['Le pardon libère celui qui pardonne.', 'Lâcher prise est un vrai acte de puissance.'],
    } as Record<string, string[]>,
  },
  ar: {
    timeGreetings: {
      earlyMorning: ['العالم ما زال هادئاً', 'مستيقظ قبل الضجيج', 'مبكر النهوض'],
      morning: ['صباح الخير', 'يوم جديد يبدأ', 'بداية جديدة'],
      afternoon: ['مساء الخير', 'ما زلت تتقدم بقوة', 'زخم منتصف اليوم'],
      evening: ['مساء الخير', 'اختتام اليوم بحكمة', 'تأمل المساء'],
      lateNight: ['ساهر الليل', 'ساعات السكون', 'ما زلت مستيقظاً وما زلت تنمو'],
    } as Record<TimeOfDay, string[]>,
    streak: {
      first: 'رحلتك تبدأ بخطوة واحدة.',
      day1: 'اليوم 1. كل تحول يبدأ هنا.',
      day3: '3 أيام قوية. عادة جديدة تتشكل.',
      day7: 'أسبوع كامل. لقد استحققت درع السلسلة.',
      day14: 'أسبوعان من النمو المتواصل. احترام.',
      day21: '21 يوماً. هنا تتحول العادة إلى هوية.',
      day30: '30 يوماً. لم تعد الشخص الذي بدأ.',
      day50Plus: '{streak} يوماً. انضباط أسطوري.',
      matchBest: 'لقد ساويت أفضل سلسلة لك. غداً ستكسرها.',
      beatBest: 'رقم شخصي جديد: {streak} يوماً. لقد تجاوزت أفضل ما لديك.',
      short: [
        'سلسلة {streak} أيام. الزخم يتصاعد.',
        'اليوم {streak}. الأثر التراكمي يعمل.',
        '{streak} أيام وما زلت مستمراً. واصل البناء.',
      ],
      medium: [
        'سلسلة {streak} أيام تتوهج.',
        'أسبوع {weeks}+ . الاستمرارية قوتك الخارقة.',
        '{streak} يوماً من اختيار النمو على الراحة.',
      ],
      long: [
        '{streak} يوماً من النمو المتواصل.',
        'اليوم {streak}. هذه هويتك الآن.',
        'سلسلة {streak} أيام. لا يمكن إيقافك.',
      ],
    },
    comeback: {
      d2: 'مرحباً بعودتك. كان الأمس للراحة - واليوم للنمو.',
      d4: 'ابتعدت {days} أيام. لكنك عدت. هذا أهم من الفجوة.',
      d7: 'أسبوع بعيداً، لكنه ليس أسبوعاً ضائعاً. كل عودة اختيار للنمو.',
      d14: 'اختفيت قليلاً. لكنك هنا الآن. أفضل العودة هي الهادئة.',
      d30: 'مر وقت طويل. بلا أحكام. فقط نمو. لنبدأ من جديد.',
      long: 'لقد عدت. هذا يتطلب شجاعة. لنكمل من حيث توقفت.',
    },
    topics: {
      control: ['تذكّر: ركز على ما يمكنك التحكم فيه.', 'الحمل الذي حملته أمس، هل أصبح أخف اليوم؟'],
      habits: ['هل أنجزت عادتك الصغيرة من الأمس؟', 'خطوات صغيرة. تحول كبير.'],
      obstacles: ['العقبة التي سميتها، هل بدأت تعلمك؟', 'الهدية تختبئ داخل المعاناة.'],
      preparation: ['هل امتلكت صباحك اليوم؟', 'اليوم بين يديك لتشكله.'],
      gratitude: ['ما الذي تشعر بالامتنان له الآن؟', 'هبة هذه اللحظة المؤقتة.'],
      resilience: ['الانتكاسات تصنع العودة.', 'معادلة العودة تعمل.'],
      growth: ['المعاناة هي الطريق وليست العائق.', 'أنت تصبح أقوى في مواضع الانكسار.'],
      courage: ['الخوف بوصلة. اتبعه.', 'على الجانب الآخر من الخوف كل ما تريد.'],
      antifragile: ['الفوضى تقويك.', 'أنت لا تنجو من الفوضى فقط - بل تتغذى منها.'],
      projection: ['ما يثيرك يعلّمك.', 'المرآة لا تكذب.'],
      honesty: ['الصدق الجذري حرية جذرية.', 'الصدق يبدأ مع نفسك.'],
      boundaries: ['حدودك تحمي سلامك.', 'قول لا يعني قول نعم لنفسك.'],
      empathy: ['فهم الآخرين يبدأ بفهم نفسك.', 'التعاطف قوة وليس ضعفاً.'],
      forgiveness: ['المسامحة تحرر المسامح.', 'التخلي هو حركة قوة حقيقية.'],
    } as Record<string, string[]>,
  },
} as const;

function getStreakMessage(streak: number, longestStreak: number, locale: Locale): { message: string; mood: GreetingResult['mood'] } {
  const copy = COPY[locale].streak;

  if (streak === 0) return { message: copy.first, mood: 'warm' };
  if (streak === 1) return { message: copy.day1, mood: 'motivating' };
  if (streak === 3) return { message: copy.day3, mood: 'motivating' };
  if (streak === 7) return { message: copy.day7, mood: 'celebratory' };
  if (streak === 14) return { message: copy.day14, mood: 'fierce' };
  if (streak === 21) return { message: copy.day21, mood: 'celebratory' };
  if (streak === 30) return { message: copy.day30, mood: 'celebratory' };
  if (streak >= 50) return { message: format(copy.day50Plus, { streak }), mood: 'fierce' };

  if (longestStreak > 0 && streak === longestStreak) {
    return { message: copy.matchBest, mood: 'fierce' };
  }
  if (longestStreak > 0 && streak === longestStreak + 1) {
    return { message: format(copy.beatBest, { streak }), mood: 'celebratory' };
  }

  if (streak >= 2 && streak < 7) {
    const options = copy.short;
    return { message: format(options[streak % options.length], { streak }), mood: 'motivating' };
  }

  if (streak >= 7 && streak < 14) {
    const options = copy.medium;
    return {
      message: format(options[streak % options.length], { streak, weeks: Math.floor(streak / 7) }),
      mood: 'motivating',
    };
  }

  const options = copy.long;
  return { message: format(options[streak % options.length], { streak }), mood: 'fierce' };
}

function getDaysSinceLastLesson(lastLessonDate: string | null): number {
  if (!lastLessonDate) return -1;
  const last = new Date(lastLessonDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function getComebackMessage(daysSince: number, locale: Locale): string | null {
  if (daysSince <= 1) return null;
  const copy = COPY[locale].comeback;
  if (daysSince === 2) return copy.d2;
  if (daysSince <= 4) return format(copy.d4, { days: daysSince });
  if (daysSince <= 7) return copy.d7;
  if (daysSince <= 14) return copy.d14;
  if (daysSince <= 30) return copy.d30;
  return copy.long;
}

function getTopicCallback(coreTag: string | undefined, locale: Locale): string | undefined {
  if (!coreTag) return undefined;
  const options = COPY[locale].topics[coreTag];
  if (!options) return undefined;
  return options[dayOfYear() % options.length];
}

export function generateGreeting(ctx: GreetingContext, locale: Locale = 'en'): GreetingResult {
  const safeLocale = locale in COPY ? locale : 'en';
  const timeOfDay = getTimeOfDay();
  const daysSince = getDaysSinceLastLesson(ctx.lastLessonDate);
  const comebackMessage = getComebackMessage(daysSince, safeLocale);

  const greetings = COPY[safeLocale].timeGreetings[timeOfDay];
  const greeting = greetings[dayOfYear() % greetings.length];

  if (comebackMessage) {
    return {
      greeting,
      message: comebackMessage,
      subMessage: getTopicCallback(ctx.lastLessonCoreTag, safeLocale),
      mood: 'gentle',
    };
  }

  const streakResult = getStreakMessage(ctx.streak, ctx.longestStreak, safeLocale);
  return {
    greeting,
    message: streakResult.message,
    subMessage: getTopicCallback(ctx.lastLessonCoreTag, safeLocale),
    mood: streakResult.mood,
  };
}

export function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}
