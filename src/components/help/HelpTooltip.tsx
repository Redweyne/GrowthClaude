'use client';

// ═══════════════════════════════════════════════════════════════════════════
// HELP TOOLTIP - CONTEXTUAL UNDERSTANDING
// ═══════════════════════════════════════════════════════════════════════════
//
// A subtle (?) icon that opens a beautiful bottom sheet with explanations.
// Non-intrusive, always available, but never in the way.
//
// Users can dismiss help forever or just for now.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Sparkles, Heart, Dumbbell, BookOpen, Flame, Star, Users, Target } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useTranslation } from '@/i18n';

// Help content definitions
export type HelpTopic =
  | 'echoes'
  | 'exercises'
  | 'xp'
  | 'streak'
  | 'levels'
  | 'worlds'
  | 'synchronized'
  | 'identity';

interface HelpContent {
  icon: typeof Sparkles;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  details?: string[];
}

const helpContent: Record<HelpTopic, HelpContent> = {
  echoes: {
    icon: Heart,
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/20',
    title: 'What are Echoes?',
    description: 'Echoes are responses to other travelers\' reflections. When you complete a lesson, you respond to someone else\'s insights.',
    details: [
      'Teaching others deepens your own understanding',
      'Every reflection gets at least one echo',
      'You can open up for deeper connection if you choose',
      'It\'s anonymous and safe - use brother, sister, or traveler',
    ],
  },
  exercises: {
    icon: Dumbbell,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    title: 'What are Exercises?',
    description: 'Five daily exercises help you apply the lesson\'s wisdom to your real life. This is where knowledge becomes transformation.',
    details: [
      'Scenario: Apply wisdom to a real situation',
      'Quote: Contemplate the day\'s most powerful insight',
      'Application: Plan how to use this tomorrow',
      'Anchor: Create a physical reminder',
      'Reframe: See a challenge through new eyes',
    ],
  },
  xp: {
    icon: Sparkles,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/20',
    title: 'What is XP?',
    description: 'Experience Points (XP) track your dedication to growth. They\'re earned through daily practice and unlock new levels.',
    details: [
      'Lesson completion: ~20 XP',
      'Echo response: 10 XP',
      'Each exercise: 5 XP (25 total)',
      'Daily completion bonus: 10 XP',
      'XP unlocks higher levels and titles',
    ],
  },
  streak: {
    icon: Flame,
    iconColor: 'text-orange-400',
    iconBg: 'bg-orange-500/20',
    title: 'What is a Streak?',
    description: 'Your streak counts consecutive days of practice. It\'s a measure of consistency - the true driver of transformation.',
    details: [
      'Complete any daily practice to maintain your streak',
      'Missing a day resets to zero',
      'Longer streaks = deeper transformation',
      'Don\'t chase the number - chase the habit',
    ],
  },
  levels: {
    icon: Star,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/20',
    title: 'What are Levels?',
    description: 'Levels represent your journey from novice to master. Each level has a title reflecting your growth.',
    details: [
      'Level 1: Awakening',
      'Level 2: Seeker',
      'Level 3: Practitioner',
      'Level 5: Philosopher',
      'Level 10: Sage (the summit)',
    ],
  },
  worlds: {
    icon: BookOpen,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/20',
    title: 'What are Worlds?',
    description: 'Worlds are collections of wisdom from different traditions. Each world has chapters with daily lessons.',
    details: [
      'Modern Wisdom: Contemporary insights for today',
      'Stoicism: Ancient Roman & Greek philosophy',
      'More worlds coming soon',
      'Complete one world to unlock the next',
    ],
  },
  synchronized: {
    icon: Users,
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/20',
    title: 'Why Same Lesson for Everyone?',
    description: 'Everyone learns the same lesson on the same day. This creates a shared experience and enables meaningful echoes.',
    details: [
      'You\'re never learning alone',
      'Echoes come from today\'s shared experience',
      'Community grows through shared wisdom',
      'Consistency over speed - one lesson per day',
    ],
  },
  identity: {
    icon: Target,
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    title: 'What are Identity Statements?',
    description: '"I am someone who..." statements capture who you\'re becoming. They\'re milestones in your transformation.',
    details: [
      'Created during lessons and reflections',
      'Track how your identity evolves',
      'Reinforce positive self-perception',
      'Review them to see your growth',
    ],
  },
};

type LocalizedHelpContent = Record<HelpTopic, { title: string; description: string; details: string[] }>;

const localizedHelpContentByLocale: { fr: LocalizedHelpContent; ar: LocalizedHelpContent } = {
  fr: {
    echoes: {
      title: 'Que sont les Échos ?',
      description: "Les Échos sont des réponses aux réflexions d'autres voyageurs. Quand vous terminez une leçon, vous répondez aux idées de quelqu'un d'autre.",
      details: [
        'Enseigner aux autres approfondit votre propre compréhension',
        'Chaque réflexion reçoit au moins un écho',
        'Vous pouvez ouvrir la porte à une connexion plus profonde si vous le souhaitez',
        "C'est anonyme et sûr - utilisez frère, sœur ou voyageur",
      ],
    },
    exercises: {
      title: 'Que sont les Exercices ?',
      description: "Cinq exercices quotidiens vous aident à appliquer la sagesse de la leçon à votre vie réelle. C'est ici que la connaissance devient transformation.",
      details: [
        'Scénario : appliquer la sagesse à une situation réelle',
        "Citation : contempler l'idée la plus puissante du jour",
        "Application : planifier comment l'utiliser demain",
        'Ancre : créer un rappel physique',
        'Reformulation : voir un défi avec un nouveau regard',
      ],
    },
    xp: {
      title: "Qu'est-ce que l'XP ?",
      description: "Les points d'expérience (XP) mesurent votre engagement dans la croissance. Ils sont gagnés grâce à la pratique quotidienne et débloquent de nouveaux niveaux.",
      details: [
        'Leçon terminée : ~20 XP',
        "Réponse à un Écho : 10 XP",
        'Chaque exercice : 5 XP (25 au total)',
        'Bonus de fin de journée : 10 XP',
        "L'XP débloque des niveaux et des titres plus élevés",
      ],
    },
    streak: {
      title: "Qu'est-ce qu'une série ?",
      description: "Votre série compte les jours consécutifs de pratique. C'est la mesure de la constance, le vrai moteur de la transformation.",
      details: [
        'Terminez une pratique quotidienne pour maintenir votre série',
        'Manquer un jour remet la série à zéro',
        'Des séries plus longues = une transformation plus profonde',
        "Ne poursuivez pas le chiffre - poursuivez l'habitude",
      ],
    },
    levels: {
      title: 'Que sont les Niveaux ?',
      description: 'Les niveaux représentent votre parcours de novice à maître. Chaque niveau a un titre qui reflète votre croissance.',
      details: [
        'Niveau 1 : Éveil',
        'Niveau 2 : Chercheur',
        'Niveau 3 : Pratiquant',
        'Niveau 5 : Philosophe',
        'Niveau 10 : Sage (le sommet)',
      ],
    },
    worlds: {
      title: 'Que sont les Mondes ?',
      description: 'Les Mondes sont des collections de sagesse issues de différentes traditions. Chaque monde contient des chapitres avec des leçons quotidiennes.',
      details: [
        "Sagesse Moderne : des idées contemporaines pour aujourd'hui",
        'Stoïcisme : philosophie gréco-romaine antique',
        'D’autres mondes arrivent bientôt',
        'Terminez un monde pour débloquer le suivant',
      ],
    },
    synchronized: {
      title: 'Pourquoi la même leçon pour tous ?',
      description: "Tout le monde apprend la même leçon le même jour. Cela crée une expérience partagée et permet des Échos plus significatifs.",
      details: [
        "Vous n'apprenez jamais seul",
        "Les Échos viennent de l'expérience partagée du jour",
        'La communauté grandit grâce à une sagesse commune',
        'La constance avant la vitesse - une leçon par jour',
      ],
    },
    identity: {
      title: "Que sont les Déclarations d'identité ?",
      description: 'Les déclarations "Je suis quelqu’un qui..." capturent qui vous devenez. Ce sont des jalons dans votre transformation.',
      details: [
        'Créées pendant les leçons et les réflexions',
        "Suivent l'évolution de votre identité",
        'Renforcent une perception positive de soi',
        'Relisez-les pour voir votre croissance',
      ],
    },
  },
  ar: {
    echoes: {
      title: 'ما هي الأصداء؟',
      description: 'الأصداء هي ردود على تأملات مسافرين آخرين. عندما تنهي درسًا، ترد على أفكار شخص آخر.',
      details: [
        'تعليم الآخرين يعمّق فهمك أنت',
        'كل تأمل يحصل على صدى واحد على الأقل',
        'يمكنك فتح الباب لاتصال أعمق إذا رغبت',
        'الأمر مجهول وآمن - استخدم أخ أو أخت أو مسافر',
      ],
    },
    exercises: {
      title: 'ما هي التمارين؟',
      description: 'خمسة تمارين يومية تساعدك على تطبيق حكمة الدرس على حياتك الواقعية. هنا تتحول المعرفة إلى تغيير حقيقي.',
      details: [
        'سيناريو: طبّق الحكمة على موقف حقيقي',
        'اقتباس: تأمل أقوى فكرة في اليوم',
        'تطبيق: خطط لكيف ستستخدم هذا غدًا',
        'مرساة: أنشئ تذكيرًا جسديًا',
        'إعادة صياغة: انظر إلى التحدي بعين جديدة',
      ],
    },
    xp: {
      title: 'ما هو XP؟',
      description: 'نقاط الخبرة (XP) تتبع التزامك بالنمو. تُكتسب عبر الممارسة اليومية وتفتح مستويات جديدة.',
      details: [
        'إكمال الدرس: حوالي 20 XP',
        'الرد على صدى: 10 XP',
        'كل تمرين: 5 XP (25 إجمالًا)',
        'مكافأة الإكمال اليومي: 10 XP',
        'XP يفتح مستويات وألقاب أعلى',
      ],
    },
    streak: {
      title: 'ما هي السلسلة؟',
      description: 'السلسلة تحسب الأيام المتتالية من الممارسة. إنها مقياس الاستمرارية، وهو المحرك الحقيقي للتحول.',
      details: [
        'أكمل أي ممارسة يومية للحفاظ على سلسلتك',
        'تفويت يوم واحد يعيدها إلى الصفر',
        'سلاسل أطول = تحول أعمق',
        'لا تطارد الرقم - طارد العادة',
      ],
    },
    levels: {
      title: 'ما هي المستويات؟',
      description: 'المستويات تمثل رحلتك من مبتدئ إلى متمكن. لكل مستوى لقب يعكس نموك.',
      details: [
        'المستوى 1: الاستيقاظ',
        'المستوى 2: الباحث',
        'المستوى 3: الممارس',
        'المستوى 5: الفيلسوف',
        'المستوى 10: الحكيم (القمة)',
      ],
    },
    worlds: {
      title: 'ما هي العوالم؟',
      description: 'العوالم هي مجموعات حكمة من تقاليد مختلفة. كل عالم يحتوي على فصول بدروس يومية.',
      details: [
        'الحكمة الحديثة: أفكار معاصرة لليوم',
        'الرواقية: فلسفة رومانية ويونانية قديمة',
        'عوالم أخرى قادمة قريبًا',
        'أكمل عالمًا لفتح العالم التالي',
      ],
    },
    synchronized: {
      title: 'لماذا نفس الدرس للجميع؟',
      description: 'الجميع يتعلم نفس الدرس في نفس اليوم. هذا يخلق تجربة مشتركة ويجعل الأصداء أكثر معنى.',
      details: [
        'أنت لا تتعلم وحدك أبدًا',
        'الأصداء تأتي من تجربة اليوم المشتركة',
        'المجتمع ينمو عبر حكمة مشتركة',
        'الاستمرارية قبل السرعة - درس واحد يوميًا',
      ],
    },
    identity: {
      title: 'ما هي عبارات الهوية؟',
      description: 'عبارات "أنا شخص..." تلتقط من تصبح عليه. إنها محطات في مسار تحولك.',
      details: [
        'تُنشأ أثناء الدروس والتأملات',
        'تتبع كيف تتطور هويتك',
        'تعزز صورة ذاتية إيجابية',
        'راجعها لترى نموك',
      ],
    },
  },
};

const uiCopyByLocale = {
  en: {
    helpPrefix: 'Help',
    gotIt: 'Got it',
    dontShowAgain: "Don't show again",
  },
  fr: {
    helpPrefix: 'Aide',
    gotIt: "J'ai compris",
    dontShowAgain: 'Ne plus afficher',
  },
  ar: {
    helpPrefix: 'مساعدة',
    gotIt: 'فهمت',
    dontShowAgain: 'عدم الإظهار مرة أخرى',
  },
} as const;

interface HelpTooltipProps {
  topic: HelpTopic;
  size?: 'sm' | 'md';
  className?: string;
}

export function HelpTooltip({ topic, size = 'sm', className = '' }: HelpTooltipProps) {
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isHelpDismissed, dismissHelp } = useStore();

  const localized = localizedHelpContentByLocale[locale as 'fr' | 'ar']?.[topic];
  const content = localized ? { ...helpContent[topic], ...localized } : helpContent[topic];
  const Icon = content.icon;
  const iconSize = size === 'sm' ? 14 : 16;
  const uiCopy = uiCopyByLocale[locale] ?? uiCopyByLocale.en;

  // Don't render if permanently dismissed
  if (isHelpDismissed(topic)) {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center rounded-full text-stone-500 light:text-stone-400 hover:text-stone-400 light:hover:text-stone-700 hover:bg-stone-800/50 light:hover:bg-stone-200/50 transition-all ${
          size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
        } ${className}`}
        aria-label={`${uiCopy.helpPrefix}: ${content.title}`}
      >
        <HelpCircle size={iconSize} />
      </button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/80 light:bg-stone-200/80 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[101] max-h-[80vh] overflow-y-auto"
            >
              <div className="bg-stone-900 light:bg-white border-t border-stone-800 light:border-stone-200 rounded-t-3xl">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-stone-700 light:bg-stone-300" />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 text-stone-500 light:text-stone-400 hover:text-stone-300 light:hover:text-stone-900 transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Content */}
                <div className="px-6 pb-8 pt-2">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`w-16 h-16 rounded-2xl ${content.iconBg} mx-auto mb-4 flex items-center justify-center`}
                  >
                    <Icon size={32} className={content.iconColor} />
                  </motion.div>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl font-bold text-stone-100 light:text-stone-900 text-center mb-3"
                  >
                    {content.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-stone-400 light:text-stone-600 text-center mb-6 leading-relaxed"
                  >
                    {content.description}
                  </motion.p>

                  {/* Details */}
                  {content.details && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="space-y-2 mb-6"
                    >
                      {content.details.map((detail, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/50 light:bg-stone-100/50"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                          <p className="text-stone-300 light:text-stone-700 text-sm">{detail}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3"
                  >
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-stone-900 font-medium hover:bg-amber-400 light:hover:bg-amber-500 transition-colors"
                    >
                      {uiCopy.gotIt}
                    </button>
                    <button
                      onClick={() => {
                        dismissHelp(topic);
                        setIsOpen(false);
                      }}
                      className="py-3 px-4 rounded-xl bg-stone-800 light:bg-stone-100 text-stone-400 light:text-stone-600 hover:text-stone-300 light:hover:text-stone-900 transition-colors text-sm"
                    >
                      {uiCopy.dontShowAgain}
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default HelpTooltip;
