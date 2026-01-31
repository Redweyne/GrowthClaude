// Practice scenarios for spaced repetition
// These resurface lessons in new, real-world contexts

import { type Locale } from '@/i18n';

export interface PracticeScenario {
  lessonId: string;
  coreConceptTag: string;
  scenario: string;
  question: string;
  reflectionPrompt: string;
  xpReward: number;
}

const PRACTICE_SCENARIOS_BY_LOCALE: Record<Locale, PracticeScenario[]> = {
  en: [
  // ═══════════════════════════════════════════════════════════════════════════
  // MODERN WISDOM SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════

  // Lesson 1: The Instant Reframe
  {
    lessonId: 'modern-1-instant-reframe',
    coreConceptTag: 'control',
    scenario: "Your flight has been delayed by 3 hours. Other passengers are yelling at the gate agent. You feel your frustration rising.",
    question: "Is the weather delay within your control? Is your reaction within your control?",
    reflectionPrompt: "How did applying the dichotomy of control change how you feel about this scenario?",
    xpReward: 10,
  },
  {
    lessonId: 'modern-1-instant-reframe',
    coreConceptTag: 'control',
    scenario: "You submitted your best work, but your manager gave the credit to someone else in the team meeting.",
    question: "What specific action can you take right now? If none, what must you accept?",
    reflectionPrompt: "What energy is saved by focusing only on your response?",
    xpReward: 10,
  },

  // Lesson 2: The Power of Tiny
  {
    lessonId: 'modern-2-power-of-tiny',
    coreConceptTag: 'habits',
    scenario: "You want to start reading more, but you 'don't have time' for an hour of reading.",
    question: "What is the 2-minute version of this habit? Can you read one page?",
    reflectionPrompt: "Why does the tiny version feel 'too small' to count? Challenge that thought.",
    xpReward: 10,
  },
  {
    lessonId: 'modern-2-power-of-tiny',
    coreConceptTag: 'habits',
    scenario: "You've missed the gym for 3 weeks. The idea of a full workout feels overwhelming.",
    question: "What is the 1% version? Can you do 5 pushups right now?",
    reflectionPrompt: "How does lowering the bar actually help you jump over it?",
    xpReward: 10,
  },

  // Lesson 3: The Hidden Gift (Obstacles)
  {
    lessonId: 'modern-3-obstacle-opportunity',
    coreConceptTag: 'obstacles',
    scenario: "You didn't get the funding for your project. It feels like a dead end.",
    question: "How could this specific 'no' force you to create a better model?",
    reflectionPrompt: "What did this obstacle teach you that success never could?",
    xpReward: 10,
  },
  {
    lessonId: 'modern-3-obstacle-opportunity',
    coreConceptTag: 'obstacles',
    scenario: "A difficult client is making your life miserable with constant changes.",
    question: "What skill is this person forcing you to master?",
    reflectionPrompt: "How is this person an accidental teacher?",
    xpReward: 10,
  },

  // Lesson 4: Own Your Morning
  {
    lessonId: 'modern-4-morning-mindset',
    coreConceptTag: 'preparation',
    scenario: "You have a high-stakes presentation this afternoon. You wake up feeling anxious.",
    question: "Pre-accept the nervousness. How do you WANT to respond when it hits?",
    reflectionPrompt: "How does expecting the challenge change your relationship to it?",
    xpReward: 10,
  },

  // Lesson 5: The Gratitude Shift
  {
    lessonId: 'modern-5-gratitude-shift',
    coreConceptTag: 'gratitude',
    scenario: "You're frustrated with your partner's messy habits.",
    question: "Imagine they were gone tomorrow. Would you miss the mess?",
    reflectionPrompt: "How does the lens of loss clarify what matters?",
    xpReward: 10,
  },

  // Lesson 6: The Comeback Formula
  {
    lessonId: 'modern-6-comeback-formula',
    coreConceptTag: 'resilience',
    scenario: "You failed a public commitment. The shame is keeping you hidden.",
    question: "Feel it fully for 60 seconds. Then: what is the 48-hour comeback plan?",
    reflectionPrompt: "What is the difference between wallowing and processing?",
    xpReward: 10,
  },

  // Lesson 7: Embrace the Struggle
  {
    lessonId: 'modern-7-embrace-struggle',
    coreConceptTag: 'discomfort',
    scenario: "You have a choice: take the easy route or the hard one that teaches you more.",
    question: "Which path builds the muscle you want to have next year?",
    reflectionPrompt: "Why do we fear the very thing that makes us strong?",
    xpReward: 10,
  },

  // Lesson 8: Fear-Setting
  {
    lessonId: 'modern-8-fear-setting',
    coreConceptTag: 'fear',
    scenario: "You want to quit your job to start a business, but you're paralyzed.",
    question: "Define the absolute worst case. Is it survivable?",
    reflectionPrompt: "What is the hidden cost of inaction?",
    xpReward: 10,
  },

  // Lesson 9: The Antifragile Mind
  {
    lessonId: 'modern-9-antifragile-mind',
    coreConceptTag: 'antifragile',
    scenario: "Everything is chaotic at work. Plans are changing hourly.",
    question: "How can you not just survive this chaos, but gain from it?",
    reflectionPrompt: "What systems grow stronger under stress?",
    xpReward: 10,
  },

  // Lesson 10: Letter to Future Self
  {
    lessonId: 'modern-10-future-self',
    coreConceptTag: 'vision',
    scenario: "You're tempted to compromise your values for a quick win.",
    question: "What would your future self—one year from now—say about this choice?",
    reflectionPrompt: "Who are you becoming with this decision?",
    xpReward: 10,
  },

  // Lesson 11: The Mirror Effect
  {
    lessonId: 'modern-11-mirror-effect',
    coreConceptTag: 'projection',
    scenario: "Someone's arrogance is driving you crazy.",
    question: "Where does arrogance live in you? Or the fear of it?",
    reflectionPrompt: "The world is a mirror. What are you seeing?",
    xpReward: 10,
  },

  // Lesson 12: Radical Honesty
  {
    lessonId: 'modern-12-radical-honesty',
    coreConceptTag: 'honesty',
    scenario: "You're about to tell a small white lie to avoid an awkward moment.",
    question: "What prison are you building with this small brick?",
    reflectionPrompt: "What is the price of keeping up appearances?",
    xpReward: 10,
  },

  // Lesson 13: Boundaries with Grace
  {
    lessonId: 'modern-13-boundaries-grace',
    coreConceptTag: 'boundaries',
    scenario: "A friend asks for a favor you don't have the energy to give.",
    question: "Can you say no clearly, without over-explaining or apologizing?",
    reflectionPrompt: "Why does protecting your energy feel like selfishness?",
    xpReward: 10,
  },

  // Lesson 14: The Empathy Shift
  {
    lessonId: 'modern-14-empathy-shift',
    coreConceptTag: 'empathy',
    scenario: "You're in a heated argument. You know you're right.",
    question: "Stop. Can you articulate their position so well they say 'that's exactly it'?",
    reflectionPrompt: "What happens when you seek to understand before being understood?",
    xpReward: 10,
  },

  // Lesson 15: Forgiveness is Freedom
  {
    lessonId: 'modern-15-forgiveness-freedom',
    coreConceptTag: 'forgiveness',
    scenario: "An old memory of betrayal surfaces. You feel the anger fresh again.",
    question: "Who is drinking the poison right now? You or them?",
    reflectionPrompt: "What would you do with the energy you're using to hold this grudge?",
    xpReward: 10,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STOICISM SCENARIOS
  // ═══════════════════════════════════════════════════════════════════════════

  // Lesson 1: Dichotomy of Control
  {
    lessonId: 'stoic-1-dichotomy-control',
    coreConceptTag: 'control',
    scenario: "The weather ruins your outdoor event plans.",
    question: "Is this within your control?",
    reflectionPrompt: "How much suffering comes from fighting reality?",
    xpReward: 10,
  },

  // Lesson 2: Perception is Everything
  {
    lessonId: 'stoic-2-perception-everything',
    coreConceptTag: 'perception',
    scenario: "Someone insults you online.",
    question: "Is the insult painful, or is it your judgment about the insult?",
    reflectionPrompt: "Facts vs Stories. Can you separate them?",
    xpReward: 10,
  },

  // Lesson 3: The View From Above
  {
    lessonId: 'stoic-3-view-from-above',
    coreConceptTag: 'perspective',
    scenario: "You're stressed about a deadline.",
    question: "Zoom out to earth orbit. Zoom forward 100 years. Where is this deadline?",
    reflectionPrompt: "Does this matter to the cosmos?",
    xpReward: 10,
  },

  // Lesson 4: Morning Preparation
  {
    lessonId: 'stoic-4-morning-preparation',
    coreConceptTag: 'preparation',
    scenario: "You wake up hoping for an easy day.",
    question: "Instead, anticipate the difficulties. How will you meet them?",
    reflectionPrompt: "Why is an expected blow lighter than an unexpected one?",
    xpReward: 10,
  },

  // Lesson 5: Removing Judgment
  {
    lessonId: 'stoic-5-removing-judgment',
    coreConceptTag: 'judgment',
    scenario: "You lose your wallet. You think 'This is a disaster'.",
    question: "Describe it neutrally: 'I placed my wallet somewhere and cannot find it.'",
    reflectionPrompt: "Where did the 'disaster' quality come from?",
    xpReward: 10,
  },

  // Lesson 6: Do The Work
  {
    lessonId: 'stoic-6-do-the-work',
    coreConceptTag: 'action',
    scenario: "You know you should exercise, but you're just thinking about it.",
    question: "Stop thinking. Move your body. Now.",
    reflectionPrompt: "What is the gap between philosophy and action?",
    xpReward: 10,
  },

  // Lesson 7: The Obstacle Is The Way
  {
    lessonId: 'stoic-7-obstacle-way',
    coreConceptTag: 'obstacles',
    scenario: "You get rejected from a job you wanted.",
    question: "How does this rejection point the way to a better path?",
    reflectionPrompt: "The impediment to action advances action.",
    xpReward: 10,
  },

  // Lesson 8: Reserve Clause
  {
    lessonId: 'stoic-8-reserve-clause',
    coreConceptTag: 'reserve-clause',
    scenario: "You're working hard on a presentation, desperate for approval.",
    question: "Add the clause: 'I will do my best, if nothing prevents me.'",
    reflectionPrompt: "Can you commit fully without attaching to the outcome?",
    xpReward: 10,
  },

  // Lesson 9: Act Immediately
  {
    lessonId: 'stoic-9-act-immediately',
    coreConceptTag: 'focus',
    scenario: "You're checking your phone while talking to a friend.",
    question: "Where is your attention? Bring it back fully.",
    reflectionPrompt: "How much life do we miss by being half-present?",
    xpReward: 10,
  },

  // Lesson 10: Voluntary Discomfort
  {
    lessonId: 'stoic-10-voluntary-discomfort',
    coreConceptTag: 'discomfort',
    scenario: "You're hungry but dinner is an hour away.",
    question: "Don't snack. Observe the hunger. Can you handle it?",
    reflectionPrompt: "Is this the condition I feared?",
    xpReward: 10,
  },

  // Lesson 11: Amor Fati
  {
    lessonId: 'stoic-11-amor-fati',
    coreConceptTag: 'amor-fati',
    scenario: "You get stuck in traffic and will be late.",
    question: "Don't just accept it. Love it. This is your life right now.",
    reflectionPrompt: "What happens when you stop arguing with reality?",
    xpReward: 10,
  },

  // Lesson 12: Memento Mori
  {
    lessonId: 'stoic-12-memento-mori',
    coreConceptTag: 'memento-mori',
    scenario: "You're angry about a petty household chore.",
    question: "If this were your last day on earth, would you care?",
    reflectionPrompt: "Death strips away the inessential.",
    xpReward: 10,
  },

  // Lesson 13: Premeditatio Malorum
  {
    lessonId: 'stoic-13-premeditatio-malorum',
    coreConceptTag: 'negative-visualization',
    scenario: "You're worried about money.",
    question: "Imagine you lost it all. Could you survive? Yes.",
    reflectionPrompt: "The fear is often worse than the reality.",
    xpReward: 10,
  },

  // Lesson 14: Eternal Recurrence
  {
    lessonId: 'stoic-14-eternal-recurrence',
    coreConceptTag: 'eternal-recurrence',
    scenario: "You're bored and scrolling aimlessly.",
    question: "If you had to live this moment forever, would you choose this?",
    reflectionPrompt: "Live so you would wish for the eternal return.",
    xpReward: 10,
  },

  // Lesson 15: Inner Citadel
  {
    lessonId: 'stoic-15-inner-citadel',
    coreConceptTag: 'inner-citadel',
    scenario: "The news is terrifying. People are panicking.",
    question: "Retreat to your inner fortress. What is safe there?",
    reflectionPrompt: "The mind can be a place of peace in a world of war.",
    xpReward: 10,
  },
  ],
  fr: [
    // ═══════════════════════════════════════════════════════════════════════════
    // MODERN WISDOM SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════════

    // Lesson 1: The Instant Reframe
    {
      lessonId: 'modern-1-instant-reframe',
      coreConceptTag: 'control',
      scenario: "Votre vol a été retardé de 3 heures. D'autres passagers crient sur l'agent au comptoir. Vous sentez la frustration monter.",
      question: "Ce retard météo est-il sous votre contrôle ? Votre réaction l'est-elle ?",
      reflectionPrompt: "Comment l'application de la dichotomie du contrôle change-t-elle votre ressenti dans ce scénario ?",
      xpReward: 10,
    },
    {
      lessonId: 'modern-1-instant-reframe',
      coreConceptTag: 'control',
      scenario: "Vous avez rendu votre meilleur travail, mais votre manager en a attribué le mérite à quelqu'un d'autre en réunion.",
      question: "Quelle action précise pouvez-vous entreprendre maintenant ? Sinon, qu'avez-vous à accepter ?",
      reflectionPrompt: "Quelle énergie économisez-vous en vous concentrant uniquement sur votre réponse ?",
      xpReward: 10,
    },

    // Lesson 2: The Power of Tiny
    {
      lessonId: 'modern-2-power-of-tiny',
      coreConceptTag: 'habits',
      scenario: "Vous voulez lire plus, mais vous n'avez pas 'le temps' pour une heure de lecture.",
      question: "Quelle est la version 2 minutes de cette habitude ? Pouvez-vous lire une page ?",
      reflectionPrompt: "Pourquoi la version minuscule vous semble-t-elle 'trop petite' pour compter ? Remettez cette pensée en question.",
      xpReward: 10,
    },
    {
      lessonId: 'modern-2-power-of-tiny',
      coreConceptTag: 'habits',
      scenario: "Vous avez manqué la salle pendant 3 semaines. L'idée d'un entraînement complet vous écrase.",
      question: "Quelle est la version à 1 % ? Pouvez-vous faire 5 pompes maintenant ?",
      reflectionPrompt: "Comment abaisser la barre vous aide-t-il à la franchir ?",
      xpReward: 10,
    },

    // Lesson 3: The Hidden Gift (Obstacles)
    {
      lessonId: 'modern-3-obstacle-opportunity',
      coreConceptTag: 'obstacles',
      scenario: "Vous n'avez pas obtenu le financement de votre projet. Cela ressemble à une impasse.",
      question: "Comment ce 'non' pourrait-il vous forcer à créer un meilleur modèle ?",
      reflectionPrompt: "Qu'est-ce que cet obstacle vous a appris que le succès n'aurait jamais pu vous apprendre ?",
      xpReward: 10,
    },
    {
      lessonId: 'modern-3-obstacle-opportunity',
      coreConceptTag: 'obstacles',
      scenario: "Un client difficile rend votre vie pénible avec des changements constants.",
      question: "Quelle compétence cette personne vous oblige-t-elle à maîtriser ?",
      reflectionPrompt: "Comment cette personne est-elle un professeur accidentel ?",
      xpReward: 10,
    },

    // Lesson 4: Own Your Morning
    {
      lessonId: 'modern-4-morning-mindset',
      coreConceptTag: 'preparation',
      scenario: "Vous avez une présentation à enjeux cet après-midi. Vous vous réveillez anxieux.",
      question: "Accueillez la nervosité. Comment VOULEZ-VOUS répondre lorsqu'elle surgit ?",
      reflectionPrompt: "Comment le fait d'attendre le défi change-t-il votre relation à celui-ci ?",
      xpReward: 10,
    },

    // Lesson 5: The Gratitude Shift
    {
      lessonId: 'modern-5-gratitude-shift',
      coreConceptTag: 'gratitude',
      scenario: "Les habitudes désordonnées de votre partenaire vous agacent.",
      question: "Imaginez qu'il/elle disparaisse demain. Est-ce que ce désordre vous manquerait ?",
      reflectionPrompt: "Comment le prisme de la perte clarifie-t-il ce qui compte ?",
      xpReward: 10,
    },

    // Lesson 6: The Comeback Formula
    {
      lessonId: 'modern-6-comeback-formula',
      coreConceptTag: 'resilience',
      scenario: "Vous avez échoué à un engagement public. La honte vous tient caché.",
      question: "Ressentez-le pleinement pendant 60 secondes. Puis : quel est votre plan de retour en 48 heures ?",
      reflectionPrompt: "Quelle est la différence entre ruminer et traiter ?",
      xpReward: 10,
    },

    // Lesson 7: Embrace the Struggle
    {
      lessonId: 'modern-7-embrace-struggle',
      coreConceptTag: 'discomfort',
      scenario: "Vous avez le choix : prendre la voie facile ou la voie difficile qui vous apprend davantage.",
      question: "Quel chemin construit le muscle que vous voulez avoir l'année prochaine ?",
      reflectionPrompt: "Pourquoi craignons-nous précisément ce qui nous rend forts ?",
      xpReward: 10,
    },

    // Lesson 8: Fear-Setting
    {
      lessonId: 'modern-8-fear-setting',
      coreConceptTag: 'fear',
      scenario: "Vous voulez quitter votre emploi pour créer une entreprise, mais vous êtes paralysé.",
      question: "Définissez le pire scénario possible. Est-il survivable ?",
      reflectionPrompt: "Quel est le coût caché de l'inaction ?",
      xpReward: 10,
    },

    // Lesson 9: The Antifragile Mind
    {
      lessonId: 'modern-9-antifragile-mind',
      coreConceptTag: 'antifragile',
      scenario: "Tout est chaotique au travail. Les plans changent chaque heure.",
      question: "Comment ne pas seulement survivre à ce chaos, mais en tirer un gain ?",
      reflectionPrompt: "Quels systèmes deviennent plus forts sous la pression ?",
      xpReward: 10,
    },

    // Lesson 10: Letter to Future Self
    {
      lessonId: 'modern-10-future-self',
      coreConceptTag: 'vision',
      scenario: "Vous êtes tenté de compromettre vos valeurs pour une victoire rapide.",
      question: "Que dirait votre futur vous—dans un an—à propos de ce choix ?",
      reflectionPrompt: "Qui devenez-vous avec cette décision ?",
      xpReward: 10,
    },

    // Lesson 11: The Mirror Effect
    {
      lessonId: 'modern-11-mirror-effect',
      coreConceptTag: 'projection',
      scenario: "L'arrogance de quelqu'un vous rend fou.",
      question: "Où l'arrogance vit-elle en vous ? Ou la peur d'elle ?",
      reflectionPrompt: "Le monde est un miroir. Qu'y voyez-vous ?",
      xpReward: 10,
    },

    // Lesson 12: Radical Honesty
    {
      lessonId: 'modern-12-radical-honesty',
      coreConceptTag: 'honesty',
      scenario: "Vous êtes sur le point de dire un petit mensonge pour éviter un moment gênant.",
      question: "Quelle prison construisez-vous avec cette petite brique ?",
      reflectionPrompt: "Quel est le prix de maintenir les apparences ?",
      xpReward: 10,
    },

    // Lesson 13: Boundaries with Grace
    {
      lessonId: 'modern-13-boundaries-grace',
      coreConceptTag: 'boundaries',
      scenario: "Un ami vous demande un service pour lequel vous n'avez pas l'énergie.",
      question: "Pouvez-vous dire non clairement, sans trop expliquer ni vous excuser ?",
      reflectionPrompt: "Pourquoi protéger votre énergie ressemble-t-il à de l'égoïsme ?",
      xpReward: 10,
    },

    // Lesson 14: The Empathy Shift
    {
      lessonId: 'modern-14-empathy-shift',
      coreConceptTag: 'empathy',
      scenario: "Vous êtes dans une dispute animée. Vous savez que vous avez raison.",
      question: "Stop. Pouvez-vous formuler leur position si bien qu'ils disent : « C'est exactement ça » ?",
      reflectionPrompt: "Que se passe-t-il quand vous cherchez à comprendre avant d'être compris ?",
      xpReward: 10,
    },

    // Lesson 15: Forgiveness is Freedom
    {
      lessonId: 'modern-15-forgiveness-freedom',
      coreConceptTag: 'forgiveness',
      scenario: "Un vieux souvenir de trahison refait surface. La colère est fraîche.",
      question: "Qui boit le poison maintenant ? Vous ou l'autre ?",
      reflectionPrompt: "Que feriez-vous de l'énergie que vous utilisez à garder cette rancune ?",
      xpReward: 10,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STOICISM SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════════

    // Lesson 1: Dichotomy of Control
    {
      lessonId: 'stoic-1-dichotomy-control',
      coreConceptTag: 'control',
      scenario: "La météo ruine vos plans d'événement extérieur.",
      question: "Est-ce sous votre contrôle ?",
      reflectionPrompt: "Quelle part de souffrance vient de la lutte contre la réalité ?",
      xpReward: 10,
    },

    // Lesson 2: Perception is Everything
    {
      lessonId: 'stoic-2-perception-everything',
      coreConceptTag: 'perception',
      scenario: "Quelqu'un vous insulte en ligne.",
      question: "L'insulte est-elle douloureuse, ou est-ce votre jugement sur l'insulte ?",
      reflectionPrompt: "Faits vs histoires. Pouvez-vous les séparer ?",
      xpReward: 10,
    },

    // Lesson 3: The View From Above
    {
      lessonId: 'stoic-3-view-from-above',
      coreConceptTag: 'perspective',
      scenario: "Vous êtes stressé par une échéance.",
      question: "Zoomez jusqu'à l'orbite terrestre. Avancez de 100 ans. Où est cette échéance ?",
      reflectionPrompt: "Est-ce que cela importe au cosmos ?",
      xpReward: 10,
    },

    // Lesson 4: Morning Preparation
    {
      lessonId: 'stoic-4-morning-preparation',
      coreConceptTag: 'preparation',
      scenario: "Vous vous réveillez en espérant une journée facile.",
      question: "Anticipez plutôt les difficultés. Comment allez-vous les accueillir ?",
      reflectionPrompt: "Pourquoi un coup attendu est-il plus léger qu'un coup inattendu ?",
      xpReward: 10,
    },

    // Lesson 5: Removing Judgment
    {
      lessonId: 'stoic-5-removing-judgment',
      coreConceptTag: 'judgment',
      scenario: "Vous perdez votre portefeuille. Vous pensez : « C'est un désastre ».",
      question: "Décrivez-le neutrement : « J'ai posé mon portefeuille quelque part et je ne le trouve pas. »",
      reflectionPrompt: "D'où vient la qualité de « désastre » ?",
      xpReward: 10,
    },

    // Lesson 6: Do The Work
    {
      lessonId: 'stoic-6-do-the-work',
      coreConceptTag: 'action',
      scenario: "Vous savez que vous devriez faire de l'exercice, mais vous y pensez seulement.",
      question: "Arrêtez de penser. Bougez votre corps. Maintenant.",
      reflectionPrompt: "Quelle est la distance entre philosophie et action ?",
      xpReward: 10,
    },

    // Lesson 7: The Obstacle Is The Way
    {
      lessonId: 'stoic-7-obstacle-way',
      coreConceptTag: 'obstacles',
      scenario: "Vous êtes refusé pour un poste que vous vouliez.",
      question: "Comment ce refus vous montre-t-il le chemin vers une meilleure voie ?",
      reflectionPrompt: "L'obstacle à l'action fait avancer l'action.",
      xpReward: 10,
    },

    // Lesson 8: Reserve Clause
    {
      lessonId: 'stoic-8-reserve-clause',
      coreConceptTag: 'reserve-clause',
      scenario: "Vous travaillez dur sur une présentation, en quête d'approbation.",
      question: "Ajoutez la clause : « Je ferai de mon mieux, si rien ne m'en empêche. »",
      reflectionPrompt: "Pouvez-vous vous engager pleinement sans vous attacher au résultat ?",
      xpReward: 10,
    },

    // Lesson 9: Act Immediately
    {
      lessonId: 'stoic-9-act-immediately',
      coreConceptTag: 'focus',
      scenario: "Vous regardez votre téléphone pendant que vous parlez à un ami.",
      question: "Où est votre attention ? Ramenez-la pleinement.",
      reflectionPrompt: "Combien de vie manquons-nous en étant à moitié présents ?",
      xpReward: 10,
    },

    // Lesson 10: Voluntary Discomfort
    {
      lessonId: 'stoic-10-voluntary-discomfort',
      coreConceptTag: 'discomfort',
      scenario: "Vous avez faim, mais le dîner est dans une heure.",
      question: "Ne grignotez pas. Observez la faim. Pouvez-vous la supporter ?",
      reflectionPrompt: "Est-ce cela que je craignais ?",
      xpReward: 10,
    },

    // Lesson 11: Amor Fati
    {
      lessonId: 'stoic-11-amor-fati',
      coreConceptTag: 'amor-fati',
      scenario: "Vous êtes coincé dans les embouteillages et vous serez en retard.",
      question: "Ne l'acceptez pas seulement. Aimez-le. C'est votre vie maintenant.",
      reflectionPrompt: "Que se passe-t-il quand vous cessez de vous disputer avec la réalité ?",
      xpReward: 10,
    },

    // Lesson 12: Memento Mori
    {
      lessonId: 'stoic-12-memento-mori',
      coreConceptTag: 'memento-mori',
      scenario: "Vous êtes en colère pour une petite corvée domestique.",
      question: "Si c'était votre dernier jour sur terre, est-ce que cela compterait ?",
      reflectionPrompt: "La mort enlève l'accessoire.",
      xpReward: 10,
    },

    // Lesson 13: Premeditatio Malorum
    {
      lessonId: 'stoic-13-premeditatio-malorum',
      coreConceptTag: 'negative-visualization',
      scenario: "Vous vous inquiétez de l'argent.",
      question: "Imaginez que vous ayez tout perdu. Pouvez-vous survivre ? Oui.",
      reflectionPrompt: "La peur est souvent pire que la réalité.",
      xpReward: 10,
    },

    // Lesson 14: Eternal Recurrence
    {
      lessonId: 'stoic-14-eternal-recurrence',
      coreConceptTag: 'eternal-recurrence',
      scenario: "Vous vous ennuyez et scrollez sans but.",
      question: "Si vous deviez vivre ce moment pour toujours, le choisiriez-vous ?",
      reflectionPrompt: "Vivez de sorte à souhaiter l'éternel retour.",
      xpReward: 10,
    },

    // Lesson 15: Inner Citadel
    {
      lessonId: 'stoic-15-inner-citadel',
      coreConceptTag: 'inner-citadel',
      scenario: "Les informations sont terrifiantes. Les gens paniquent.",
      question: "Retirez-vous dans votre forteresse intérieure. Qu'est-ce qui y est sûr ?",
      reflectionPrompt: "L'esprit peut être un lieu de paix dans un monde de guerre.",
      xpReward: 10,
    },
  ],
  ar: [
    // ═══════════════════════════════════════════════════════════════════════════
    // MODERN WISDOM SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════════

    // Lesson 1: The Instant Reframe
    {
      lessonId: 'modern-1-instant-reframe',
      coreConceptTag: 'control',
      scenario: 'تأخر رحلتك 3 ساعات. بعض الركاب يصرخون على موظف البوابة. تشعر بالإحباط يتصاعد.',
      question: 'هل تأخير الطقس ضمن سيطرتك؟ هل رد فعلك ضمن سيطرتك؟',
      reflectionPrompt: 'كيف غيّر تطبيق ثنائية التحكم شعورك تجاه هذا السيناريو؟',
      xpReward: 10,
    },
    {
      lessonId: 'modern-1-instant-reframe',
      coreConceptTag: 'control',
      scenario: 'قدّمت أفضل عمل لديك، لكن مديرك منح الفضل لشخص آخر في اجتماع الفريق.',
      question: 'ما الإجراء المحدد الذي يمكنك اتخاذه الآن؟ وإن لم يوجد، فماذا عليك قبوله؟',
      reflectionPrompt: 'ما الطاقة التي توفّرها حين تركز فقط على استجابتك؟',
      xpReward: 10,
    },

    // Lesson 2: The Power of Tiny
    {
      lessonId: 'modern-2-power-of-tiny',
      coreConceptTag: 'habits',
      scenario: 'تريد القراءة أكثر، لكنك "لا تملك الوقت" لساعة من القراءة.',
      question: 'ما النسخة ذات الدقيقتين من هذه العادة؟ هل يمكنك قراءة صفحة واحدة؟',
      reflectionPrompt: 'لماذا تبدو النسخة الصغيرة "صغيرة جداً" لتُحسب؟ تحدَّ هذا التفكير.',
      xpReward: 10,
    },
    {
      lessonId: 'modern-2-power-of-tiny',
      coreConceptTag: 'habits',
      scenario: 'فاتتك الجيم لثلاثة أسابيع. فكرة تمرين كامل تبدو مُنهِكة.',
      question: 'ما النسخة ذات الـ1%؟ هل يمكنك القيام بـ5 ضغطات الآن؟',
      reflectionPrompt: 'كيف يساعدك خفض السقف على القفز فوقه؟',
      xpReward: 10,
    },

    // Lesson 3: The Hidden Gift (Obstacles)
    {
      lessonId: 'modern-3-obstacle-opportunity',
      coreConceptTag: 'obstacles',
      scenario: 'لم تحصل على تمويل مشروعك. يبدو الأمر كأنه طريق مسدود.',
      question: 'كيف يمكن لهذا "اللا" أن يجبرك على بناء نموذج أفضل؟',
      reflectionPrompt: 'ما الذي علّمك إياه هذا العائق ولم يكن النجاح ليعلّمه؟',
      xpReward: 10,
    },
    {
      lessonId: 'modern-3-obstacle-opportunity',
      coreConceptTag: 'obstacles',
      scenario: 'عميل صعب يجعل حياتك بائسة بسبب تغييرات مستمرة.',
      question: 'ما المهارة التي يجبرك هذا الشخص على إتقانها؟',
      reflectionPrompt: 'كيف يكون هذا الشخص معلماً عن غير قصد؟',
      xpReward: 10,
    },

    // Lesson 4: Own Your Morning
    {
      lessonId: 'modern-4-morning-mindset',
      coreConceptTag: 'preparation',
      scenario: 'لديك عرض مهم هذا المساء. تستيقظ وتشعر بالقلق.',
      question: 'تقبّل التوتر مسبقاً. كيف تريد أن تستجيب عندما يظهر؟',
      reflectionPrompt: 'كيف يغيّر توقّع التحدّي علاقتك به؟',
      xpReward: 10,
    },

    // Lesson 5: The Gratitude Shift
    {
      lessonId: 'modern-5-gratitude-shift',
      coreConceptTag: 'gratitude',
      scenario: 'أنت منزعج من فوضى شريكك المعتادة.',
      question: 'تخيّل أنهم رحلوا غداً. هل ستفتقد الفوضى؟',
      reflectionPrompt: 'كيف توضح عدسة الفقدان ما الذي يهم حقاً؟',
      xpReward: 10,
    },

    // Lesson 6: The Comeback Formula
    {
      lessonId: 'modern-6-comeback-formula',
      coreConceptTag: 'resilience',
      scenario: 'فشلت في التزام علني. الخجل يبقيك مختبئاً.',
      question: 'اشعر به بالكامل لمدة 60 ثانية. ثم: ما خطة العودة خلال 48 ساعة؟',
      reflectionPrompt: 'ما الفرق بين الاجترار والمعالجة؟',
      xpReward: 10,
    },

    // Lesson 7: Embrace the Struggle
    {
      lessonId: 'modern-7-embrace-struggle',
      coreConceptTag: 'discomfort',
      scenario: 'لديك خيار: الطريق السهل أو الطريق الصعب الذي يعلّمك أكثر.',
      question: 'أي طريق يبني العضلة التي تريد امتلاكها العام القادم؟',
      reflectionPrompt: 'لماذا نخاف الشيء نفسه الذي يجعلنا أقوياء؟',
      xpReward: 10,
    },

    // Lesson 8: Fear-Setting
    {
      lessonId: 'modern-8-fear-setting',
      coreConceptTag: 'fear',
      scenario: 'تريد ترك وظيفتك لبدء عمل، لكنك مشلول.',
      question: 'عرّف أسوأ سيناريو ممكن. هل يمكن النجاة منه؟',
      reflectionPrompt: 'ما التكلفة الخفية لعدم التحرك؟',
      xpReward: 10,
    },

    // Lesson 9: The Antifragile Mind
    {
      lessonId: 'modern-9-antifragile-mind',
      coreConceptTag: 'antifragile',
      scenario: 'كل شيء فوضوي في العمل. الخطط تتغير كل ساعة.',
      question: 'كيف لا تنجو من هذه الفوضى فقط، بل تستفيد منها؟',
      reflectionPrompt: 'ما الأنظمة التي تقوى تحت الضغط؟',
      xpReward: 10,
    },

    // Lesson 10: Letter to Future Self
    {
      lessonId: 'modern-10-future-self',
      coreConceptTag: 'vision',
      scenario: 'تميل للتنازل عن قيمك من أجل مكسب سريع.',
      question: 'ماذا سيقول نفسك في المستقبل—بعد سنة—عن هذا القرار؟',
      reflectionPrompt: 'من تصبح مع هذا القرار؟',
      xpReward: 10,
    },

    // Lesson 11: The Mirror Effect
    {
      lessonId: 'modern-11-mirror-effect',
      coreConceptTag: 'projection',
      scenario: 'غرور شخص ما يثير جنونك.',
      question: 'أين يعيش الغرور فيك؟ أو الخوف منه؟',
      reflectionPrompt: 'العالم مرآة. ماذا ترى؟',
      xpReward: 10,
    },

    // Lesson 12: Radical Honesty
    {
      lessonId: 'modern-12-radical-honesty',
      coreConceptTag: 'honesty',
      scenario: 'أنت على وشك قول كذبة صغيرة لتجنب موقف محرج.',
      question: 'أي سجن تبنيه بهذا الطوب الصغير؟',
      reflectionPrompt: 'ما ثمن الحفاظ على المظاهر؟',
      xpReward: 10,
    },

    // Lesson 13: Boundaries with Grace
    {
      lessonId: 'modern-13-boundaries-grace',
      coreConceptTag: 'boundaries',
      scenario: 'صديق يطلب منك خدمة لا تملك طاقة لها.',
      question: 'هل يمكنك قول لا بوضوح دون شرح زائد أو اعتذار؟',
      reflectionPrompt: 'لماذا يبدو حماية طاقتك أنانية؟',
      xpReward: 10,
    },

    // Lesson 14: The Empathy Shift
    {
      lessonId: 'modern-14-empathy-shift',
      coreConceptTag: 'empathy',
      scenario: 'أنت في جدال ساخن. أنت متأكد أنك على حق.',
      question: 'توقف. هل يمكنك صياغة موقفهم بحيث يقولون: "هذا بالضبط"؟',
      reflectionPrompt: 'ماذا يحدث عندما تسعى للفهم قبل أن تُفهَم؟',
      xpReward: 10,
    },

    // Lesson 15: Forgiveness is Freedom
    {
      lessonId: 'modern-15-forgiveness-freedom',
      coreConceptTag: 'forgiveness',
      scenario: 'ذكرى قديمة للخيانة تعود. الغضب يشعر كأنه جديد.',
      question: 'من يشرب السم الآن؟ أنت أم هو/هي؟',
      reflectionPrompt: 'ماذا ستفعل بالطاقة التي تستخدمها لحمل هذا الحقد؟',
      xpReward: 10,
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STOICISM SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════════

    // Lesson 1: Dichotomy of Control
    {
      lessonId: 'stoic-1-dichotomy-control',
      coreConceptTag: 'control',
      scenario: 'الطقس يفسد خطط حدثك الخارجي.',
      question: 'هل هذا ضمن سيطرتك؟',
      reflectionPrompt: 'كم من المعاناة يأتي من مقاومة الواقع؟',
      xpReward: 10,
    },

    // Lesson 2: Perception is Everything
    {
      lessonId: 'stoic-2-perception-everything',
      coreConceptTag: 'perception',
      scenario: 'شخص ما يسيء إليك عبر الإنترنت.',
      question: 'هل الإهانة مؤلمة، أم حكمك على الإهانة هو المؤلم؟',
      reflectionPrompt: 'حقائق مقابل قصص. هل يمكنك الفصل بينهما؟',
      xpReward: 10,
    },

    // Lesson 3: The View From Above
    {
      lessonId: 'stoic-3-view-from-above',
      coreConceptTag: 'perspective',
      scenario: 'أنت متوتر بشأن موعد نهائي.',
      question: 'ابتعد حتى مدار الأرض. ثم تقدّم 100 عام. أين هذا الموعد النهائي؟',
      reflectionPrompt: 'هل يهم هذا للكون؟',
      xpReward: 10,
    },

    // Lesson 4: Morning Preparation
    {
      lessonId: 'stoic-4-morning-preparation',
      coreConceptTag: 'preparation',
      scenario: 'تستيقظ آملًا أن يكون يومك سهلاً.',
      question: 'بدلاً من ذلك، توقّع الصعوبات. كيف ستقابلها؟',
      reflectionPrompt: 'لماذا تكون الضربة المتوقعة أخف من الضربة المفاجئة؟',
      xpReward: 10,
    },

    // Lesson 5: Removing Judgment
    {
      lessonId: 'stoic-5-removing-judgment',
      coreConceptTag: 'judgment',
      scenario: 'أضعت محفظتك. تفكر: "هذه كارثة".',
      question: 'صفها بحياد: "وضعت محفظتي في مكان ما ولا أستطيع العثور عليها".',
      reflectionPrompt: 'من أين جاءت صفة "الكارثة"؟',
      xpReward: 10,
    },

    // Lesson 6: Do The Work
    {
      lessonId: 'stoic-6-do-the-work',
      coreConceptTag: 'action',
      scenario: 'تعرف أنك يجب أن تتمرن، لكنك فقط تفكر في ذلك.',
      question: 'توقف عن التفكير. حرّك جسدك. الآن.',
      reflectionPrompt: 'ما الفجوة بين الفلسفة والفعل؟',
      xpReward: 10,
    },

    // Lesson 7: The Obstacle Is The Way
    {
      lessonId: 'stoic-7-obstacle-way',
      coreConceptTag: 'obstacles',
      scenario: 'تم رفضك في وظيفة كنت تريدها.',
      question: 'كيف يشير هذا الرفض إلى طريق أفضل؟',
      reflectionPrompt: 'العائق أمام الفعل يدفع الفعل إلى الأمام.',
      xpReward: 10,
    },

    // Lesson 8: Reserve Clause
    {
      lessonId: 'stoic-8-reserve-clause',
      coreConceptTag: 'reserve-clause',
      scenario: 'تعمل بجد على عرض تقديمي، متعطشاً للموافقة.',
      question: 'أضف العبارة: "سأبذل قصارى جهدي، إن لم يمنعني شيء".',
      reflectionPrompt: 'هل يمكنك الالتزام الكامل دون التعلق بالنتيجة؟',
      xpReward: 10,
    },

    // Lesson 9: Act Immediately
    {
      lessonId: 'stoic-9-act-immediately',
      coreConceptTag: 'focus',
      scenario: 'تتفقد هاتفك أثناء التحدث مع صديق.',
      question: 'أين انتباهك؟ أعده بالكامل.',
      reflectionPrompt: 'كم من الحياة نفقدها حين نكون نصف حاضرين؟',
      xpReward: 10,
    },

    // Lesson 10: Voluntary Discomfort
    {
      lessonId: 'stoic-10-voluntary-discomfort',
      coreConceptTag: 'discomfort',
      scenario: 'أنت جائع لكن العشاء بعد ساعة.',
      question: 'لا تتناول وجبة خفيفة. راقب الجوع. هل تستطيع تحمّله؟',
      reflectionPrompt: 'أهذه هي الحالة التي كنت أخشاها؟',
      xpReward: 10,
    },

    // Lesson 11: Amor Fati
    {
      lessonId: 'stoic-11-amor-fati',
      coreConceptTag: 'amor-fati',
      scenario: 'علقت في الازدحام وستتأخر.',
      question: 'لا تكتفِ بالقبول. أحبّ ذلك. هذه حياتك الآن.',
      reflectionPrompt: 'ماذا يحدث عندما تتوقف عن الجدال مع الواقع؟',
      xpReward: 10,
    },

    // Lesson 12: Memento Mori
    {
      lessonId: 'stoic-12-memento-mori',
      coreConceptTag: 'memento-mori',
      scenario: 'أنت غاضب من عمل منزلي تافه.',
      question: 'لو كان هذا آخر يوم لك على الأرض، هل كنت ستكترث؟',
      reflectionPrompt: 'الموت يجرّد غير الضروري.',
      xpReward: 10,
    },

    // Lesson 13: Premeditatio Malorum
    {
      lessonId: 'stoic-13-premeditatio-malorum',
      coreConceptTag: 'negative-visualization',
      scenario: 'أنت قلق بشأن المال.',
      question: 'تخيّل أنك فقدته كله. هل يمكنك النجاة؟ نعم.',
      reflectionPrompt: 'الخوف غالباً أسوأ من الواقع.',
      xpReward: 10,
    },

    // Lesson 14: Eternal Recurrence
    {
      lessonId: 'stoic-14-eternal-recurrence',
      coreConceptTag: 'eternal-recurrence',
      scenario: 'أنت تشعر بالملل وتتمرر بلا هدف.',
      question: 'لو كان عليك أن تعيش هذه اللحظة إلى الأبد، هل ستختارها؟',
      reflectionPrompt: 'عِش بحيث تتمنى العودة الأبدية.',
      xpReward: 10,
    },

    // Lesson 15: Inner Citadel
    {
      lessonId: 'stoic-15-inner-citadel',
      coreConceptTag: 'inner-citadel',
      scenario: 'الأخبار مرعبة والناس في حالة ذعر.',
      question: 'ارجع إلى قلعتك الداخلية. ما الذي يكون آمناً هناك؟',
      reflectionPrompt: 'العقل يمكن أن يكون مكان سلام في عالم حرب.',
      xpReward: 10,
    },
  ],
};

export const PRACTICE_SCENARIOS: PracticeScenario[] = PRACTICE_SCENARIOS_BY_LOCALE.en;

// Get random practice scenarios for completed lessons
export function getPracticeScenarios(
  completedLessonIds: string[],
  count: number = 3,
  locale: Locale = 'en'
): PracticeScenario[] {
  const scenarios = PRACTICE_SCENARIOS_BY_LOCALE[locale] || PRACTICE_SCENARIOS_BY_LOCALE.en;
  const availableScenarios = scenarios.filter(s =>
    completedLessonIds.includes(s.lessonId)
  );

  // If no available scenarios match completed lessons, fallback to generic or unlocked ones
  // or return empty (UI handles empty state)
  if (availableScenarios.length === 0) return [];

  // Shuffle and take requested count
  const shuffled = [...availableScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get scenarios for a specific lesson
export function getScenariosForLesson(lessonId: string, locale: Locale = 'en'): PracticeScenario[] {
  const scenarios = PRACTICE_SCENARIOS_BY_LOCALE[locale] || PRACTICE_SCENARIOS_BY_LOCALE.en;
  return scenarios.filter(s => s.lessonId === lessonId);
}

export default PRACTICE_SCENARIOS;
