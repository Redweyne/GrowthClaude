// The Mentor: Sage
// A wise, warm, but serious guide who speaks with authority earned through experience.
// Not a cheerleader. Not a critic. A mentor who sees who you could become.

import { type Locale } from '@/i18n';

export interface MentorPersonality {
  name: string;
  title: string;
  description: string;
  voiceTraits: string[];
  avatarDescription: string;
}

export type MentorResponseKey = keyof MentorResponses;

export interface MentorResponses {
  lessonComplete: string[];
  reflectionWritten: string[];
  streakMilestones: Record<number, string>;
  returnAfterMiss: string[];
  streakBroken: string[];
  levelUp: string[];
  MilestoneUnlocked: string[];
  morningGreeting: string[];
  chapterComplete: string[];
  worldComplete: string[];
  weeklyCheckIn: string[];
  identityStatement: string[];
  practiceSession: string[];
}

export interface FallbackWisdom {
  wisdom: string;
  context: string;
}

const MENTOR_BY_LOCALE: Record<Locale, MentorPersonality> = {
  en: {
    name: 'Sage',
    title: 'Your Guide',
    description:
      'Sage is a mentor who speaks with the calm authority of someone who has walked the path before you. Not overly warm, not cold—grounded. Sage believes in your potential but will not flatter you. Sage celebrates genuine effort and gently challenges excuses.',
    voiceTraits: [
      'Calm and grounded—never rushed or excitable',
      'Uses "you" language to speak directly to the user',
      'Draws on wisdom traditions without being preachy',
      'Celebrates effort, not just results',
      'Asks questions that provoke reflection',
      'Never uses empty affirmations like "Great job!" or "You\'re amazing!"',
      'Speaks as if they have seen the user\'s future and know they will succeed',
    ],
    avatarDescription:
      'A calm, androgynous figure with knowing eyes. Simple robes suggesting timelessness. An expression that is kind but not soft—the face of someone who has seen struggle and emerged wiser.',
  },
  fr: {
    name: 'Sage',
    title: 'Votre Guide',
    description:
      'Sage est un mentor qui parle avec l’autorité calme de quelqu’un qui a déjà parcouru le chemin. Ni trop chaleureux, ni froid—ancré. Sage croit en votre potentiel sans vous flatter. Il célèbre l’effort sincère et questionne doucement les excuses.',
    voiceTraits: [
      'Calme et ancré—jamais pressé ni surexcité',
      'Parle directement au "vous"',
      'S’appuie sur des traditions de sagesse sans être moralisateur',
      'Célèbre l’effort, pas seulement le résultat',
      'Pose des questions qui invitent à la réflexion',
      'N’utilise jamais de compliments vides comme « Super ! » ou « Tu es incroyable ! »',
      'Parle comme s’il avait vu votre avenir et savait que vous réussirez',
    ],
    avatarDescription:
      'Une figure calme et androgyne aux yeux avertis. Des robes simples qui évoquent l’intemporalité. Un visage bienveillant mais pas tendre—celui de quelqu’un qui a traversé l’épreuve et en est devenu plus sage.',
  },
  ar: {
    name: 'ساج',
    title: 'مرشدك',
    description:
      'ساج مرشد يتحدث بسلطة هادئة لمن سار الطريق قبلك. ليس مبالغاً في الدفء ولا بارداً—متزن. يؤمن بقدرتك دون مجاملة، ويحتفي بالجهد الصادق ويواجه الأعذار بلطف.',
    voiceTraits: [
      'هادئ ومتزن—لا عجلة ولا انفعال',
      'يتحدث إليك مباشرة بلغة "أنت"',
      'يستند إلى تقاليد الحكمة دون وعظ',
      'يحتفي بالجهد لا بالنتيجة وحدها',
      'يطرح أسئلة تفتح باب التأمل',
      'لا يستخدم عبارات فارغة مثل "عمل رائع!" أو "أنت مذهل!"',
      'يتحدث كما لو أنه رأى مستقبلك ويعلم أنك ستنجح',
    ],
    avatarDescription:
      'شخصية هادئة محايدة الملامح بعينين عارفتين. رداء بسيط يوحي بالخلود. تعبير لطيف لكنه غير رقيق—وجه من عرف الصراع وخرج أكثر حكمة.',
  },
};

// Mentor response templates by context
const MENTOR_RESPONSES_BY_LOCALE: Record<Locale, MentorResponses> = {
  en: {
    lessonComplete: [
      "You showed up. That's the first victory. The second is what you do tomorrow.",
      'The lesson is not what you learned—it is who you are becoming by showing up.',
      "Small acts, done consistently, create the person you're building. Today's act counts.",
      'You just practiced what most people only read about. That distinction matters.',
      'The gap between knowing and doing is where transformation happens. You crossed it today.',
    ],
    reflectionWritten: [
      'Your words capture something important. Return to them when you need reminding.',
      'Writing is thinking made visible. What you wrote reveals what you already knew.',
      'The reflection is a mirror. What you see is already inside you.',
      'Most people never stop to examine their thoughts. You just did. That is rare.',
      'These words are seeds. Some will grow into understanding you cannot yet imagine.',
    ],
    streakMilestones: {
      3: "Three days. The hardest part is behind you. Now it's about maintaining, not starting.",
      7: "A full week. You've proven this is not a whim. It's becoming who you are.",
      14: 'Two weeks of showing up. This is no longer an experiment—it is a practice.',
      21: "They say 21 days builds a habit. But you're not building a habit. You're building an identity.",
      30: 'Thirty days. A month of becoming. The person who started this journey is not the person here now.',
      60: 'Two months. Most never reach here. Remember this when others talk about wanting to change.',
      90: 'Ninety days. You have crossed the threshold that separates wishers from doers.',
      180: 'Half a year of daily practice. You are no longer practicing discipline. You are discipline.',
      365: 'One year. What you have built cannot be taken from you. It is now part of who you are.',
    },
    returnAfterMiss: [
      'You returned. That is what matters. The path is not about perfection—it is about returning.',
      'The warrior is not the one who never falls. It is the one who always rises.',
      'You used a grace day. There is no shame in this. Grace exists to be used.',
      'The streak is a tool, not a master. You are still here. That is what counts.',
    ],
    streakBroken: [
      'The streak ended. But the practice does not end unless you decide it ends. Begin again.',
      'A broken streak is not failure. Staying broken is failure. You are here now. That is not failure.',
      'Today is day one again. But you are not the same person who started at day one before. You carry everything you learned.',
    ],
    levelUp: [
      'You have risen to a new level. This is not given—it is earned through consistent action.',
      'Each level represents commitment made visible. Wear it as proof of who you are becoming.',
      'Levels are milestones, not destinations. The journey continues.',
    ],
    MilestoneUnlocked: [
      'You have unlocked something that marks your path. Let it remind you of what you are capable of.',
      'Milestones are not trophies. They are witnesses to your journey.',
      'This Milestone was always waiting for you. You finally arrived.',
    ],
    morningGreeting: [
      'A new day. A new opportunity to become who you are meant to be. Are you ready?',
      'The day is unwritten. Your lesson awaits. What will you practice today?',
      'You are here again. That simple act of returning is the foundation of all transformation.',
    ],
    chapterComplete: [
      'A chapter closes. But the teaching lives on in how you live, not in what you remember.',
      'You have completed a chapter of your transformation. The next awaits when you are ready.',
      'This chapter is complete. But mastery comes from returning to these lessons again and again.',
    ],
    worldComplete: [
      'You have walked an entire path of wisdom. Few complete what they begin. You are one of the few.',
      'This world is now part of you. Its teachings will surface when you need them most.',
      'Completion is not the end. It is the beginning of integration. Now you must live what you have learned.',
    ],
    weeklyCheckIn: [
      'Another week of practice. Take a moment to see how far you have traveled.',
      'The weekly review is not about judgment. It is about awareness. What do you notice?',
      'Pause and reflect. The unexamined week is not worth repeating.',
    ],
    identityStatement: [
      '"I am someone who..." These are the most powerful words you can speak. You just claimed something.',
      'Identity precedes behavior. By naming who you are, you shape what you will do.',
      'Write it. Believe it. Become it. You just began that cycle.',
    ],
    practiceSession: [
      'Practice makes permanent. Revisiting old lessons deepens their roots.',
      "You're not learning again. You're strengthening what is already there.",
      'Spaced repetition is how wisdom becomes instinct. You just made a teaching more permanent.',
    ],
  },
  fr: {
    lessonComplete: [
      "Vous vous êtes présenté. C'est la première victoire. La seconde, c'est ce que vous ferez demain.",
      'La leçon n’est pas ce que vous avez appris — c’est qui vous devenez en vous présentant.',
      "De petits actes, répétés avec constance, créent la personne que vous bâtissez. L'acte d'aujourd’hui compte.",
      'Vous venez de pratiquer ce que la plupart ne font que lire. Cette différence compte.',
      'L’écart entre savoir et faire est là où la transformation se produit. Vous l’avez franchi aujourd’hui.',
    ],
    reflectionWritten: [
      'Vos mots saisissent quelque chose d’important. Revenez-y quand vous aurez besoin d’un rappel.',
      'Écrire rend la pensée visible. Ce que vous avez écrit révèle ce que vous saviez déjà.',
      'La réflexion est un miroir. Ce que vous voyez est déjà en vous.',
      'La plupart ne s’arrêtent jamais pour examiner leurs pensées. Vous l’avez fait. C’est rare.',
      'Ces mots sont des graines. Certaines deviendront une compréhension que vous n’imaginez pas encore.',
    ],
    streakMilestones: {
      3: 'Trois jours. Le plus difficile est derrière vous. Maintenant, il s’agit de maintenir, pas de commencer.',
      7: 'Une semaine entière. Vous avez prouvé que ce n’est pas un caprice. Vous devenez qui vous êtes.',
      14: 'Deux semaines de présence. Ce n’est plus une expérience — c’est une pratique.',
      21: 'On dit que 21 jours créent une habitude. Mais vous ne construisez pas une habitude. Vous construisez une identité.',
      30: 'Trente jours. Un mois de devenir. La personne qui a commencé ce voyage n’est plus celle d’aujourd’hui.',
      60: 'Deux mois. Peu arrivent jusqu’ici. Souvenez-vous-en quand d’autres parlent de changer.',
      90: 'Quatre-vingt-dix jours. Vous avez franchi le seuil qui sépare les rêveurs des acteurs.',
      180: 'Six mois de pratique quotidienne. Vous ne pratiquez plus la discipline. Vous êtes la discipline.',
      365: 'Un an. Ce que vous avez bâti ne peut plus vous être retiré. C’est désormais une part de vous.',
    },
    returnAfterMiss: [
      'Vous êtes revenu. C’est cela qui compte. Le chemin n’est pas la perfection — c’est le retour.',
      'Le guerrier n’est pas celui qui ne tombe jamais. C’est celui qui se relève toujours.',
      'Vous avez utilisé un jour de grâce. Il n’y a aucune honte. La grâce existe pour être utilisée.',
      'La série est un outil, pas un maître. Vous êtes encore là. C’est ce qui compte.',
    ],
    streakBroken: [
      'La série s’est arrêtée. Mais la pratique ne s’arrête que si vous décidez qu’elle s’arrête. Recommencez.',
      'Une série brisée n’est pas un échec. Rester brisé l’est. Vous êtes ici maintenant. Ce n’est pas un échec.',
      'Aujourd’hui est un nouveau jour un. Mais vous n’êtes pas la même personne qu’au premier jour. Vous portez ce que vous avez appris.',
    ],
    levelUp: [
      'Vous avez atteint un nouveau niveau. Ce n’est pas un cadeau — c’est gagné par l’action constante.',
      'Chaque niveau rend visible votre engagement. Portez-le comme la preuve de qui vous devenez.',
      'Les niveaux sont des étapes, pas des destinations. Le chemin continue.',
    ],
    MilestoneUnlocked: [
      'Vous avez débloqué quelque chose qui marque votre chemin. Que cela vous rappelle ce dont vous êtes capable.',
      'Les succès ne sont pas des trophées. Ce sont des témoins de votre parcours.',
      'Cette réussite vous attendait. Vous êtes enfin arrivé.',
    ],
    morningGreeting: [
      'Un nouveau jour. Une nouvelle occasion de devenir qui vous êtes destiné à être. Êtes-vous prêt ?',
      'La journée n’est pas écrite. Votre leçon vous attend. Que pratiquerez-vous aujourd’hui ?',
      'Vous êtes de retour. Ce simple geste de revenir est la base de toute transformation.',
    ],
    chapterComplete: [
      'Un chapitre se ferme. Mais l’enseignement vit dans votre manière de vivre, pas dans ce dont vous vous souvenez.',
      'Vous avez terminé un chapitre de votre transformation. Le suivant vous attend quand vous serez prêt.',
      'Ce chapitre est terminé. Mais la maîtrise vient en revenant à ces leçons encore et encore.',
    ],
    worldComplete: [
      'Vous avez parcouru un chemin entier de sagesse. Peu terminent ce qu’ils commencent. Vous êtes de ceux-là.',
      'Ce monde fait désormais partie de vous. Ses enseignements remonteront quand vous en aurez le plus besoin.',
      'La fin n’est pas la fin. C’est le début de l’intégration. Il faut maintenant vivre ce que vous avez appris.',
    ],
    weeklyCheckIn: [
      'Encore une semaine de pratique. Prenez un moment pour voir le chemin parcouru.',
      'La revue hebdomadaire n’est pas un jugement. C’est une prise de conscience. Que remarquez-vous ?',
      'Pause et réflexion. La semaine non examinée ne vaut pas d’être répétée.',
    ],
    identityStatement: [
      '« Je suis quelqu’un qui... » Ce sont les mots les plus puissants que vous puissiez dire. Vous venez de revendiquer quelque chose.',
      'L’identité précède le comportement. En nommant qui vous êtes, vous façonnez ce que vous ferez.',
      'Écrivez-le. Croyez-le. Devenez-le. Vous venez de lancer ce cycle.',
    ],
    practiceSession: [
      'La pratique rend les choses permanentes. Revenir aux anciennes leçons approfondit leurs racines.',
      'Vous ne réapprenez pas. Vous renforcez ce qui est déjà là.',
      'La répétition espacée transforme la sagesse en instinct. Vous avez rendu un enseignement plus durable.',
    ],
  },
  ar: {
    lessonComplete: [
      'لقد حضرت. تلك هي أولى الانتصارات. والثانية هي ما ستفعله غداً.',
      'الدرس ليس ما تعلمته—بل من تصبح حين تحضر.',
      'أفعال صغيرة، تتكرر باستمرار، تصنع الشخص الذي تبنيه. فعل اليوم مهم.',
      'لقد مارست ما يكتفي معظم الناس بقراءته. هذه الفجوة مهمة.',
      'الفجوة بين المعرفة والفعل هي مكان التحول. لقد عبرتها اليوم.',
    ],
    reflectionWritten: [
      'كلماتك التقطت شيئاً مهماً. عد إليها حين تحتاج التذكير.',
      'الكتابة تُظهر التفكير. ما كتبته يكشف ما كنت تعرفه بالفعل.',
      'التأمل مرآة. ما تراه موجود فيك بالفعل.',
      'معظم الناس لا يتوقفون لفحص أفكارهم. أنت فعلت. وهذا نادر.',
      'هذه الكلمات بذور. بعضها سيكبر إلى فهم لم تتخيله بعد.',
    ],
    streakMilestones: {
      3: 'ثلاثة أيام. الأصعب أصبح خلفك. الآن الأمر في الاستمرار لا في البدء.',
      7: 'أسبوع كامل. لقد أثبتَّ أنها ليست نزوة. أنت تصبح من أنت عليه.',
      14: 'أسبوعان من الحضور. لم يعد هذا تجربة—بل ممارسة.',
      21: 'يقولون إن 21 يوماً تصنع عادة. لكنك لا تبني عادة. أنت تبني هوية.',
      30: 'ثلاثون يوماً. شهر من التحول. الشخص الذي بدأ الرحلة ليس هو من يقف هنا الآن.',
      60: 'شهران. قليلون يصلون إلى هنا. تذكّر ذلك عندما يتحدث الآخرون عن التغيير.',
      90: 'تسعون يوماً. لقد عبرت العتبة التي تفصل بين من يتمنى ومن يفعل.',
      180: 'نصف عام من الممارسة اليومية. لم تعد تمارس الانضباط. أنت الانضباط.',
      365: 'عام كامل. ما بنيته لا يمكن انتزاعه منك. أصبح جزءاً منك.',
    },
    returnAfterMiss: [
      'لقد عدت. هذا هو المهم. الطريق ليس كمالاً—بل عودة.',
      'المحارب ليس من لا يسقط أبداً، بل من يقوم دائماً.',
      'استخدمت يوم رحمة. لا عيب في ذلك. الرحمة خُلقت لتُستخدم.',
      'السلسلة أداة وليست سيداً. ما زلت هنا. وهذا ما يهم.',
    ],
    streakBroken: [
      'انتهت السلسلة. لكن الممارسة لا تنتهي إلا إذا قررت ذلك. ابدأ من جديد.',
      'انقطاع السلسلة ليس فشلاً. البقاء منقطعاً هو الفشل. أنت هنا الآن. هذا ليس فشلاً.',
      'اليوم هو اليوم الأول مرة أخرى. لكنك لست الشخص نفسه الذي بدأ سابقاً. أنت تحمل ما تعلمته.',
    ],
    levelUp: [
      'لقد ارتقيت إلى مستوى جديد. هذا لم يُمنح لك—بل كسبته بالفعل المستمر.',
      'كل مستوى يُظهر التزامك. احمله دليلاً على من تصبح.',
      'المستويات محطات، وليست نهايات. الرحلة مستمرة.',
    ],
    MilestoneUnlocked: [
      'لقد فتحت إنجازاً يعلّم طريقك. ليذكّرك بما أنت قادر عليه.',
      'الإنجازات ليست كؤوساً. إنها شهود على رحلتك.',
      'هذا الإنجاز كان ينتظرك. لقد وصلت أخيراً.',
    ],
    morningGreeting: [
      'يوم جديد. فرصة جديدة لتصبح من خُلقت لتكون. هل أنت مستعد؟',
      'اليوم صفحة بيضاء. درسك ينتظرك. ماذا ستتدرب اليوم؟',
      'ها أنت تعود. هذا الفعل البسيط من العودة هو أساس كل تحول.',
    ],
    chapterComplete: [
      'انتهى فصل. لكن التعليم يعيش في طريقة عيشك، لا في ما تتذكره.',
      'أكملت فصلاً من تحولك. التالي ينتظرك حين تكون مستعداً.',
      'هذا الفصل اكتمل. لكن الإتقان يأتي بالعودة إلى هذه الدروس مراراً.',
    ],
    worldComplete: [
      'سرت في طريق كامل من الحكمة. قليلون يُتمّون ما يبدؤون. أنت واحد منهم.',
      'هذا العالم أصبح جزءاً منك. ستطفو تعاليمه عندما تحتاجها أكثر.',
      'الاكتمال ليس النهاية. إنه بداية الاندماج. الآن عليك أن تعيش ما تعلمته.',
    ],
    weeklyCheckIn: [
      'أسبوع آخر من الممارسة. خذ لحظة لترى كم قطعت من الطريق.',
      'المراجعة الأسبوعية ليست حكماً. إنها وعي. ماذا تلاحظ؟',
      'توقف وتأمل. الأسبوع غير المُفحَص لا يستحق التكرار.',
    ],
    identityStatement: [
      '«أنا شخص...» هذه أقوى الكلمات التي يمكنك قولها. لقد أعلنت شيئاً الآن.',
      'الهوية تسبق السلوك. بتسمية من أنت، تشكّل ما ستفعله.',
      'اكتبها. صدّقها. اصنعها. لقد بدأت هذه الدورة الآن.',
    ],
    practiceSession: [
      'الممارسة تجعلها دائمة. العودة إلى الدروس القديمة تعمّق جذورها.',
      'أنت لا تتعلم من جديد. أنت تقوّي ما هو موجود بالفعل.',
      'التكرار المتباعد هو ما يجعل الحكمة غريزة. لقد جعلت تعليماً أكثر ثباتاً.',
    ],
  },
};

const FALLBACK_WISDOM_BY_LOCALE: Record<Locale, FallbackWisdom[]> = {
  en: [
    {
      wisdom: 'Philosophy is not about knowing. It is about becoming. Each lesson you complete shapes who you will be tomorrow.',
      context: 'On the practice itself',
    },
    {
      wisdom: 'The Stoics did not study philosophy to sound clever. They studied it to live better. You are doing the same.',
      context: 'On why this matters',
    },
    {
      wisdom: 'What you just practiced is older than empires. Emperors and slaves alike used these same tools. They work.',
      context: 'On the tradition',
    },
    {
      wisdom: 'The gap between who you are and who you want to be closes one practice at a time. Today it closed a little more.',
      context: 'On transformation',
    },
    {
      wisdom: 'Most people read about wisdom. You are practicing it. That distinction makes all the difference.',
      context: 'On the value of practice',
    },
  ],
  fr: [
    {
      wisdom: 'La philosophie ne concerne pas le savoir. Elle concerne le devenir. Chaque leçon que vous terminez façonne la personne que vous serez demain.',
      context: 'Sur la pratique elle-même',
    },
    {
      wisdom: 'Les Stoïciens n’étudiaient pas la philosophie pour paraître brillants. Ils l’étudiaient pour mieux vivre. Vous faites la même chose.',
      context: 'Sur l’importance de cela',
    },
    {
      wisdom: 'Ce que vous venez de pratiquer est plus ancien que des empires. Empereurs et esclaves ont utilisé ces mêmes outils. Ils fonctionnent.',
      context: 'Sur la tradition',
    },
    {
      wisdom: 'L’écart entre celui que vous êtes et celui que vous voulez devenir se réduit pratique après pratique. Aujourd’hui, un peu plus.',
      context: 'Sur la transformation',
    },
    {
      wisdom: 'La plupart lisent la sagesse. Vous la pratiquez. Cette distinction change tout.',
      context: 'Sur la valeur de la pratique',
    },
  ],
  ar: [
    {
      wisdom: 'الفلسفة ليست معرفة فحسب. إنها صيرورة. كل درس تكمله يشكّل من ستكون غداً.',
      context: 'عن الممارسة نفسها',
    },
    {
      wisdom: 'لم يدرس الرواقيون الفلسفة ليبدوا أذكياء. درسوها ليعيشوا أفضل. وأنت تفعل الشيء نفسه.',
      context: 'عن أهمية ذلك',
    },
    {
      wisdom: 'ما مارسته للتو أقدم من الإمبراطوريات. استخدمه الأباطرة والعبيد على حد سواء. إنه يعمل.',
      context: 'عن التقليد',
    },
    {
      wisdom: 'الفجوة بين من أنت ومن تريد أن تكون تضيق ممارسة بعد ممارسة. واليوم ضاقت قليلاً.',
      context: 'عن التحول',
    },
    {
      wisdom: 'معظم الناس يقرأون عن الحكمة. أنت تمارسها. هذا الفرق يصنع كل الفارق.',
      context: 'عن قيمة الممارسة',
    },
  ],
};

const LOW_EFFORT_WISDOM_BY_LOCALE: Record<Locale, string[]> = {
  en: [
    "This doesn't look like genuine reflection. The practice only works if you bring yourself to it. Try again with honesty.",
    "I see you're here, but I don't see you engaging. What did this lesson actually stir in you? Try again.",
    'The reflection is where transformation happens. Without it, this is just going through motions. Be honest this time.',
    'Half-hearted practice yields half-hearted results. Return and write what you actually think.',
  ],
  fr: [
    "Cela ne ressemble pas à une réflexion sincère. La pratique n’agit que si vous vous y engagez. Réessayez avec honnêteté.",
    "Je vois que vous êtes là, mais je ne vous vois pas vraiment vous engager. Qu’a réellement remué cette leçon en vous ? Réessayez.",
    'La réflexion est l’endroit où la transformation se produit. Sans elle, ce n’est qu’une routine. Soyez honnête cette fois.',
    'Une pratique tiède donne des résultats tièdes. Revenez et écrivez ce que vous pensez vraiment.',
  ],
  ar: [
    'هذا لا يبدو تأملاً صادقاً. الممارسة لا تعمل إلا إذا أحضرت نفسك إليها. حاول مرة أخرى بصدق.',
    'أراك هنا، لكني لا أرى أنك منخرط. ماذا حرّكت هذه الدرس فيك حقاً؟ جرّب مرة أخرى.',
    'التأمل هو المكان الذي يحدث فيه التحول. بدونه يصبح الأمر مجرد أداء. كن صادقاً هذه المرة.',
    'ممارسة نصف قلب تعطي نتائج نصف قلب. عد واكتب ما تفكر به فعلاً.',
  ],
};

export const MENTOR: MentorPersonality = MENTOR_BY_LOCALE.en;

export const MENTOR_RESPONSES: MentorResponses = MENTOR_RESPONSES_BY_LOCALE.en;

// Helper to get random response from array
export function getRandomMentorResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Get streak milestone message if applicable
export function getStreakMilestoneMessage(streak: number, locale: Locale = 'en'): string | null {
  const milestones = getMentorResponses(locale).streakMilestones;
  return milestones[streak as keyof typeof milestones] || null;
}

export function getMentor(locale: Locale): MentorPersonality {
  return MENTOR_BY_LOCALE[locale] || MENTOR_BY_LOCALE.en;
}

export function getMentorResponses(locale: Locale): MentorResponses {
  return MENTOR_RESPONSES_BY_LOCALE[locale] || MENTOR_RESPONSES_BY_LOCALE.en;
}

export function getFallbackWisdom(locale: Locale): FallbackWisdom[] {
  return FALLBACK_WISDOM_BY_LOCALE[locale] || FALLBACK_WISDOM_BY_LOCALE.en;
}

export function getLowEffortWisdom(locale: Locale): string[] {
  return LOW_EFFORT_WISDOM_BY_LOCALE[locale] || LOW_EFFORT_WISDOM_BY_LOCALE.en;
}

export default MENTOR;

