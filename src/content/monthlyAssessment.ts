// Monthly assessment questions and reflection prompts

import { type Locale } from '@/i18n';

export type AssessmentDimension = 'emotionalMastery' | 'discipline' | 'perspective' | 'selfAwareness' | 'growth';

export interface AssessmentQuestion {
  id: string;
  dimension: AssessmentDimension;
  title: string;
  question: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  stoicContext: string;
}

export interface FinalReflectionPrompt {
  title: string;
  prompt: string;
  placeholder: string;
}

const QUESTIONS_BY_LOCALE: Record<Locale, AssessmentQuestion[]> = {
  en: [
    {
      id: 'emotional-mastery',
      dimension: 'emotionalMastery',
      title: 'Emotional Mastery',
      question: 'When emotions surged this month, how steady were you?',
      description: 'Not perfection—just your ability to pause, breathe, and choose your response.',
      lowLabel: 'Overwhelmed',
      highLabel: 'Steady',
      stoicContext: 'You can control your response, not the wave.',
    },
    {
      id: 'discipline',
      dimension: 'discipline',
      title: 'Discipline',
      question: 'How faithfully did you keep your promises to yourself?',
      description: 'Small acts of consistency shape the person you trust.',
      lowLabel: 'Off track',
      highLabel: 'Unshakable',
      stoicContext: 'Character is built in the quiet moments.',
    },
    {
      id: 'perspective',
      dimension: 'perspective',
      title: 'Perspective',
      question: 'How often did you see challenges as teachers rather than enemies?',
      description: 'Reframing the obstacle is the path forward.',
      lowLabel: 'Resistant',
      highLabel: 'Reframed',
      stoicContext: 'The obstacle becomes the way.',
    },
    {
      id: 'self-awareness',
      dimension: 'selfAwareness',
      title: 'Self-Awareness',
      question: 'How clearly did you notice your patterns, triggers, and needs?',
      description: 'Awareness is the first act of change.',
      lowLabel: 'Unaware',
      highLabel: 'Clear',
      stoicContext: 'Know yourself, and you begin to be free.',
    },
    {
      id: 'growth',
      dimension: 'growth',
      title: 'Growth',
      question: 'Overall, how much did you grow this month?',
      description: 'Consider your courage, choices, and how you showed up.',
      lowLabel: 'Just starting',
      highLabel: 'Transformed',
      stoicContext: 'Progress is the quiet victory of each day.',
    },
  ],
  fr: [
    {
      id: 'emotional-mastery',
      dimension: 'emotionalMastery',
      title: 'Maîtrise Émotionnelle',
      question: 'Quand les émotions ont monté ce mois-ci, à quel point êtes-vous resté stable ?',
      description: 'Pas la perfection — seulement votre capacité à faire une pause, respirer et choisir votre réponse.',
      lowLabel: 'Submergé',
      highLabel: 'Serein',
      stoicContext: 'Vous pouvez contrôler votre réponse, pas la vague.',
    },
    {
      id: 'discipline',
      dimension: 'discipline',
      title: 'Discipline',
      question: 'Dans quelle mesure avez-vous tenu vos promesses envers vous-même ?',
      description: 'De petits actes de constance façonnent la personne en qui vous avez confiance.',
      lowLabel: 'Hors cap',
      highLabel: 'Inébranlable',
      stoicContext: 'Le caractère se forge dans les moments silencieux.',
    },
    {
      id: 'perspective',
      dimension: 'perspective',
      title: 'Perspective',
      question: 'À quelle fréquence avez-vous vu les défis comme des enseignants plutôt que des ennemis ?',
      description: 'Recadrer l’obstacle ouvre le chemin.',
      lowLabel: 'Résistant',
      highLabel: 'Reformulé',
      stoicContext: 'L’obstacle devient le chemin.',
    },
    {
      id: 'self-awareness',
      dimension: 'selfAwareness',
      title: 'Conscience de Soi',
      question: 'Avec quelle clarté avez-vous remarqué vos schémas, vos déclencheurs et vos besoins ?',
      description: 'La conscience est le premier acte du changement.',
      lowLabel: 'Peu conscient',
      highLabel: 'Clair',
      stoicContext: 'Se connaître, c’est commencer à être libre.',
    },
    {
      id: 'growth',
      dimension: 'growth',
      title: 'Croissance',
      question: 'Globalement, à quel point avez-vous grandi ce mois-ci ?',
      description: 'Pensez à votre courage, à vos choix et à la manière dont vous vous êtes montré.',
      lowLabel: 'Tout juste commencé',
      highLabel: 'Transformé',
      stoicContext: 'Le progrès est la victoire silencieuse de chaque jour.',
    },
  ],
  ar: [
    {
      id: 'emotional-mastery',
      dimension: 'emotionalMastery',
      title: 'السيطرة العاطفية',
      question: 'عندما اشتدت المشاعر هذا الشهر، كم كنت ثابتاً؟',
      description: 'ليس الكمال—بل قدرتك على التوقف، والتنفس، واختيار ردك.',
      lowLabel: 'مُنهك',
      highLabel: 'ثابت',
      stoicContext: 'يمكنك أن تتحكم في ردك، لا في الموجة.',
    },
    {
      id: 'discipline',
      dimension: 'discipline',
      title: 'الانضباط',
      question: 'إلى أي مدى وفيت بوعودك لنفسك؟',
      description: 'الأفعال الصغيرة المتسقة تصنع الشخص الذي تثق به.',
      lowLabel: 'مُتعثّر',
      highLabel: 'راسخ',
      stoicContext: 'الشخصية تُبنى في اللحظات الهادئة.',
    },
    {
      id: 'perspective',
      dimension: 'perspective',
      title: 'المنظور',
      question: 'كم مرة رأيت التحديات كمعلمين لا كأعداء؟',
      description: 'إعادة تأطير العائق هي الطريق للأمام.',
      lowLabel: 'مقاوم',
      highLabel: 'مُعاد النظر',
      stoicContext: 'العائق يصبح الطريق.',
    },
    {
      id: 'self-awareness',
      dimension: 'selfAwareness',
      title: 'الوعي الذاتي',
      question: 'كم كانت ملاحظتك لأنماطك ومحفزاتك واحتياجاتك واضحة؟',
      description: 'الوعي هو أول فعل للتغيير.',
      lowLabel: 'غير واعٍ',
      highLabel: 'واضح',
      stoicContext: 'اعرف نفسك، فتبدأ حريتك.',
    },
    {
      id: 'growth',
      dimension: 'growth',
      title: 'النمو',
      question: 'بشكل عام، كم نميت هذا الشهر؟',
      description: 'تأمل شجاعتك، اختياراتك، وكيف كنت حاضراً.',
      lowLabel: 'في البداية',
      highLabel: 'متحول',
      stoicContext: 'التقدم هو نصر هادئ لكل يوم.',
    },
  ],
};

const REFLECTION_PROMPT_BY_LOCALE: Record<Locale, FinalReflectionPrompt> = {
  en: {
    title: 'Your Monthly Reflection',
    prompt: 'If this month could speak, what would it thank you for—and what would it ask you to change?',
    placeholder: 'Write from the heart. Let one honest sentence lead to the next...',
  },
  fr: {
    title: 'Votre réflexion mensuelle',
    prompt: 'Si ce mois pouvait parler, pour quoi vous remercierait-il — et que vous demanderait-il de changer ?',
    placeholder: 'Écrivez avec le cœur. Laissez une phrase honnête conduire la suivante...',
  },
  ar: {
    title: 'تأملك الشهري',
    prompt: 'لو استطاع هذا الشهر أن يتكلم، على ماذا سيشكرك—وماذا سيطلب منك أن تغيّر؟',
    placeholder: 'اكتب من القلب. دع جملة صادقة تقود إلى التالية...',
  },
};

export function getAssessmentQuestions(locale: Locale): AssessmentQuestion[] {
  return QUESTIONS_BY_LOCALE[locale] || QUESTIONS_BY_LOCALE.en;
}

export function getFinalReflectionPrompt(locale: Locale): FinalReflectionPrompt {
  return REFLECTION_PROMPT_BY_LOCALE[locale] || REFLECTION_PROMPT_BY_LOCALE.en;
}

export function getDimensionColor(dimension: AssessmentDimension): string {
  const colors: Record<AssessmentDimension, string> = {
    emotionalMastery: '#F472B6',
    discipline: '#F59E0B',
    perspective: '#38BDF8',
    selfAwareness: '#A78BFA',
    growth: '#34D399',
  };

  return colors[dimension] || '#A1A1AA';
}

export default QUESTIONS_BY_LOCALE;
