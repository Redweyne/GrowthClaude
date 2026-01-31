// Weekly check-in prompts for self-reflection and growth tracking

import { type Locale } from '@/i18n';

export interface CheckinPrompt {
  id: string;
  category: 'progress' | 'challenges' | 'insights' | 'intentions';
  prompt: string;
  followUp?: string;
}

const CHECKIN_PROMPTS_BY_LOCALE: Record<Locale, CheckinPrompt[]> = {
  en: [
  // Progress reflection
  {
    id: 'progress-1',
    category: 'progress',
    prompt: "What moment this week are you most proud of?",
    followUp: "How did your learning contribute to that moment?",
  },
  {
    id: 'progress-2',
    category: 'progress',
    prompt: "When did you catch yourself applying something you learned?",
    followUp: "What was different about how you responded?",
  },
  {
    id: 'progress-3',
    category: 'progress',
    prompt: "What's one way you showed up differently this week?",
    followUp: "How did that feel?",
  },

  // Challenges faced
  {
    id: 'challenges-1',
    category: 'challenges',
    prompt: "What was your biggest challenge this week?",
    followUp: "How might your learning help you face it?",
  },
  {
    id: 'challenges-2',
    category: 'challenges',
    prompt: "When did you struggle to apply what you've learned?",
    followUp: "What got in the way? What might help next time?",
  },
  {
    id: 'challenges-3',
    category: 'challenges',
    prompt: "What situation tested your patience or peace this week?",
    followUp: "Looking back, what would the wisest version of you have done?",
  },

  // Key insights
  {
    id: 'insights-1',
    category: 'insights',
    prompt: "What did you learn about yourself this week?",
    followUp: "How will you use this self-knowledge?",
  },
  {
    id: 'insights-2',
    category: 'insights',
    prompt: "What truth became clearer to you this week?",
    followUp: "How does this change how you see things?",
  },
  {
    id: 'insights-3',
    category: 'insights',
    prompt: "What pattern did you notice in your thoughts or actions?",
    followUp: "Is this serving you? What might you change?",
  },

  // Future intentions
  {
    id: 'intentions-1',
    category: 'intentions',
    prompt: "What's one thing you want to practice more next week?",
    followUp: "How will you create opportunities to practice it?",
  },
  {
    id: 'intentions-2',
    category: 'intentions',
    prompt: "What habit do you want to strengthen in the coming week?",
    followUp: "What's the smallest step you can take tomorrow?",
  },
  {
    id: 'intentions-3',
    category: 'intentions',
    prompt: "Who in your life might benefit from what you've learned?",
    followUp: "How might you share this wisdom with them?",
  },
  ],
  fr: [
    // Progress reflection
    {
      id: 'progress-1',
      category: 'progress',
      prompt: 'Quel moment cette semaine vous rend le plus fier ?',
      followUp: 'Comment votre apprentissage a-t-il contribué à ce moment ?'
    },
    {
      id: 'progress-2',
      category: 'progress',
      prompt: 'Quand vous êtes-vous surpris à appliquer quelque chose que vous avez appris ?',
      followUp: 'Qu’y avait-il de différent dans votre façon de répondre ?'
    },
    {
      id: 'progress-3',
      category: 'progress',
      prompt: 'Quelle est une manière dont vous vous êtes présenté différemment cette semaine ?',
      followUp: 'Comment cela vous a-t-il fait sentir ?'
    },

    // Challenges faced
    {
      id: 'challenges-1',
      category: 'challenges',
      prompt: 'Quel a été votre plus grand défi cette semaine ?',
      followUp: 'Comment votre apprentissage peut-il vous aider à y faire face ?'
    },
    {
      id: 'challenges-2',
      category: 'challenges',
      prompt: 'Quand avez-vous eu du mal à appliquer ce que vous avez appris ?',
      followUp: 'Qu’est-ce qui a bloqué ? Qu’est-ce qui pourrait aider la prochaine fois ?'
    },
    {
      id: 'challenges-3',
      category: 'challenges',
      prompt: 'Quelle situation a mis à l’épreuve votre patience ou votre paix cette semaine ?',
      followUp: 'Avec le recul, qu’aurait fait la version la plus sage de vous ?'
    },

    // Key insights
    {
      id: 'insights-1',
      category: 'insights',
      prompt: 'Qu’avez-vous appris sur vous-même cette semaine ?',
      followUp: 'Comment allez-vous utiliser cette connaissance de vous ?'
    },
    {
      id: 'insights-2',
      category: 'insights',
      prompt: 'Quelle vérité est devenue plus claire pour vous cette semaine ?',
      followUp: 'Comment cela change-t-il votre manière de voir les choses ?'
    },
    {
      id: 'insights-3',
      category: 'insights',
      prompt: 'Quel schéma avez-vous remarqué dans vos pensées ou vos actions ?',
      followUp: 'Est-ce que cela vous sert ? Que pourriez-vous changer ?'
    },

    // Future intentions
    {
      id: 'intentions-1',
      category: 'intentions',
      prompt: 'Quelle est une chose que vous voulez davantage pratiquer la semaine prochaine ?',
      followUp: 'Comment allez-vous créer des occasions de la pratiquer ?'
    },
    {
      id: 'intentions-2',
      category: 'intentions',
      prompt: 'Quelle habitude voulez-vous renforcer dans la semaine à venir ?',
      followUp: 'Quel est le plus petit pas que vous pouvez faire demain ?'
    },
    {
      id: 'intentions-3',
      category: 'intentions',
      prompt: 'Qui, dans votre vie, pourrait bénéficier de ce que vous avez appris ?',
      followUp: 'Comment pourriez-vous partager cette sagesse avec cette personne ?'
    },
  ],
  ar: [
    // Progress reflection
    {
      id: 'progress-1',
      category: 'progress',
      prompt: 'ما اللحظة التي تفخر بها أكثر هذا الأسبوع؟',
      followUp: 'كيف ساهم تعلّمك في تلك اللحظة؟'
    },
    {
      id: 'progress-2',
      category: 'progress',
      prompt: 'متى لاحظت نفسك تطبّق شيئاً مما تعلّمته؟',
      followUp: 'ما المختلف في طريقة استجابتك؟'
    },
    {
      id: 'progress-3',
      category: 'progress',
      prompt: 'ما الطريقة التي حضرت بها بشكل مختلف هذا الأسبوع؟',
      followUp: 'كيف كان شعورك؟'
    },

    // Challenges faced
    {
      id: 'challenges-1',
      category: 'challenges',
      prompt: 'ما أكبر تحدٍ واجهته هذا الأسبوع؟',
      followUp: 'كيف يمكن لتعلّمك أن يساعدك على مواجهته؟'
    },
    {
      id: 'challenges-2',
      category: 'challenges',
      prompt: 'متى واجهت صعوبة في تطبيق ما تعلّمته؟',
      followUp: 'ما الذي أعاقك؟ وما الذي قد يساعدك في المرة القادمة؟'
    },
    {
      id: 'challenges-3',
      category: 'challenges',
      prompt: 'ما الموقف الذي اختبر صبرك أو سلامك هذا الأسبوع؟',
      followUp: 'بالنظر إلى الوراء، ماذا كان سيفعل أكثر نسخك حكمة؟'
    },

    // Key insights
    {
      id: 'insights-1',
      category: 'insights',
      prompt: 'ما الذي تعلّمته عن نفسك هذا الأسبوع؟',
      followUp: 'كيف ستستخدم هذه المعرفة الذاتية؟'
    },
    {
      id: 'insights-2',
      category: 'insights',
      prompt: 'ما الحقيقة التي أصبحت أكثر وضوحاً لك هذا الأسبوع؟',
      followUp: 'كيف يغيّر ذلك طريقتك في رؤية الأمور؟'
    },
    {
      id: 'insights-3',
      category: 'insights',
      prompt: 'ما النمط الذي لاحظته في أفكارك أو أفعالك؟',
      followUp: 'هل يخدمك هذا؟ وما الذي قد تغيّره؟'
    },

    // Future intentions
    {
      id: 'intentions-1',
      category: 'intentions',
      prompt: 'ما الشيء الذي تريد أن تمارسه أكثر الأسبوع المقبل؟',
      followUp: 'كيف ستصنع فرصاً لممارسته؟'
    },
    {
      id: 'intentions-2',
      category: 'intentions',
      prompt: 'ما العادة التي تريد تقويتها في الأسبوع القادم؟',
      followUp: 'ما أصغر خطوة يمكنك اتخاذها غداً؟'
    },
    {
      id: 'intentions-3',
      category: 'intentions',
      prompt: 'من في حياتك قد يستفيد مما تعلّمته؟',
      followUp: 'كيف يمكنك مشاركة هذه الحكمة معه؟'
    },
  ],
};

export const CHECKIN_PROMPTS: CheckinPrompt[] = CHECKIN_PROMPTS_BY_LOCALE.en;

// Get a random prompt from each category
export function getWeeklyCheckinPrompts(locale: Locale = 'en'): CheckinPrompt[] {
  const promptsByLocale = CHECKIN_PROMPTS_BY_LOCALE[locale] || CHECKIN_PROMPTS_BY_LOCALE.en;
  const categories: Array<'progress' | 'challenges' | 'insights' | 'intentions'> = [
    'progress',
    'challenges',
    'insights',
    'intentions'
  ];

  return categories.map(category => {
    const prompts = promptsByLocale.filter(p => p.category === category);
    return prompts[Math.floor(Math.random() * prompts.length)];
  });
}

// Mentor closing messages for weekly check-in
const CHECKIN_MENTOR_MESSAGES_BY_LOCALE: Record<Locale, string[]> = {
  en: [
    'Your commitment to reflection is itself a form of growth. The unexamined life may not be worth living, but you are living fully.',
    'This weekly pause creates space for wisdom to settle. You\'re not just learning—you\'re becoming.',
    'Most people rush through life without stopping to reflect. You\'re doing the work that matters.',
    'Self-awareness is the foundation of all change. You\'re building something lasting.',
    'Another week of intentional growth. The compound effect of these reflections will transform you.',
    'Remember: progress isn\'t always visible in the moment. Trust the process you\'ve committed to.',
  ],
  fr: [
    'Votre engagement envers la réflexion est déjà une forme de croissance. La vie non examinée ne vaut peut-être pas d’être vécue, mais vous vivez pleinement.',
    'Cette pause hebdomadaire crée l’espace pour que la sagesse s’installe. Vous n’êtes pas seulement en train d’apprendre — vous devenez.',
    'La plupart courent sans s’arrêter pour réfléchir. Vous faites le travail qui compte.',
    'La conscience de soi est le fondement de tout changement. Vous construisez quelque chose de durable.',
    'Une nouvelle semaine de croissance intentionnelle. L’effet cumulatif de ces réflexions vous transformera.',
    'Souvenez-vous : le progrès n’est pas toujours visible sur le moment. Faites confiance au processus auquel vous vous êtes engagé.',
  ],
  ar: [
    'التزامك بالتأمل بحد ذاته شكل من أشكال النمو. قد لا تكون الحياة غير المُفحَصة جديرة بالعيش، لكنك تعيشها بامتلاء.',
    'هذه الوقفة الأسبوعية تخلق مساحة لتستقر الحكمة. أنت لا تتعلم فقط—بل تصبح.',
    'معظم الناس يسرعون في الحياة دون أن يتوقفوا للتأمل. أنت تقوم بالعمل الذي يهم.',
    'الوعي الذاتي هو أساس كل تغيير. أنت تبني شيئاً دائماً.',
    'أسبوع آخر من نمو مقصود. الأثر التراكمي لهذه التأملات سيحوّلك.',
    'تذكّر: التقدم لا يكون دائماً واضحاً في اللحظة. ثق بالمسار الذي التزمت به.',
  ],
};

export const CHECKIN_MENTOR_MESSAGES = CHECKIN_MENTOR_MESSAGES_BY_LOCALE.en;

export function getRandomCheckinMessage(locale: Locale = 'en'): string {
  const messages = CHECKIN_MENTOR_MESSAGES_BY_LOCALE[locale] || CHECKIN_MENTOR_MESSAGES_BY_LOCALE.en;
  return messages[Math.floor(Math.random() * messages.length)];
}

export interface CheckinResponse {
  promptId: string;
  mainResponse: string;
  followUpResponse?: string;
}

export interface WeeklyCheckin {
  id: string;
  date: string;
  weekNumber: number;
  responses: CheckinResponse[];
  xpEarned: number;
}

export default CHECKIN_PROMPTS;
