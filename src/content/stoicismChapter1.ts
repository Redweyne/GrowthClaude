// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 1: PERCEPTION - See clearly before you act
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter, LessonStep } from '@/types/lessons';
import { stoicLesson1Exercises, stoicLesson2Exercises, stoicLesson3Exercises, stoicLesson4Exercises, stoicLesson5Exercises } from './stoicismExerciseContent';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1: THE DICHOTOMY OF CONTROL
// ─────────────────────────────────────────────────────────────────────────────

const lesson1: FlexibleLesson = {
  id: 'stoic-1-dichotomy-control',
  slug: 'dichotomy-of-control',
  order: 1,
  title: 'The Dichotomy of Control',
  subtitle: 'The single distinction that eliminates most suffering',
  description: 'Learn the foundational Stoic insight: some things are in your control, most things are not — and your peace depends on knowing the difference.',
  coreConceptTag: 'control',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '⚖️', color: '#6366f1' },
  teaserText: "Tomorrow you'll learn the single distinction that eliminates most suffering.",
  exercises: stoicLesson1Exercises,
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "You sent the message three hours ago. You've checked your phone eleven times. Your chest is tight. Your mind keeps rewriting what you said, imagining their reaction, rehearsing responses to responses that haven't happened yet.\n\nYou're burning alive — and the fire is entirely in your head.",
      subtext: "You're suffering over something you cannot control.",
      continueLabel: "I know this feeling",
      mood: 'tension',
      nextStepId: 'epictetus-insight',
    },
    {
      id: 'epictetus-insight',
      type: 'insight',
      text: "\"Some things are within our power, while others are not. Within our power are opinion, motivation, desire, aversion, and, in a word, whatever is of our own doing. Not within our power are our body, our property, reputation, office, and, in a word, whatever is not of our own doing.\"\n\n— Epictetus, Enchiridion, Chapter 1",
      source: 'Epictetus',
      sourceBook: 'Enchiridion',
      style: 'quote',
      followUp: "This is the opening line of the most influential Stoic handbook ever written. Two thousand years later, it remains the most liberating idea in philosophy.",
      nextStepId: 'control-choice',
    },
    {
      id: 'control-choice',
      type: 'choice',
      question: "Think about what's weighing on you most right now. Where does it fall?",
      instruction: "Be honest — not where you wish it fell",
      options: [
        {
          id: 'in-control',
          label: 'Fully in my control',
          subtext: 'My effort, my attitude, my next action',
          nextStepId: 'in-control-tapflow',
          storeAs: 'controlStance',
        },
        {
          id: 'out-of-control',
          label: 'Completely out of my control',
          subtext: "Someone else's decision, the past, the outcome",
          nextStepId: 'out-of-control-tapflow',
          storeAs: 'controlStance',
        },
        {
          id: 'partial-control',
          label: 'Partially in my control',
          subtext: 'I can influence it, but I can\'t determine it',
          nextStepId: 'partial-control-tapflow',
          storeAs: 'controlStance',
        },
      ],
    },
    {
      id: 'in-control-tapflow',
      type: 'tapFlow',
      title: 'The Power You Already Hold',
      instructions: [
        'If it\'s in your control, then you already hold the power.',
        'Your effort. Your choices. Your integrity.',
        'These are yours. No one can take them.',
        'Epictetus was a slave. Literally owned by another person.',
        'His body was not his own. His freedom was not his own.',
        'But his mind? His judgments? His character?',
        'Those were his. Untouchable. Unconquerable.',
        'If a slave can find freedom in what he controls...',
        'Then so can you.',
        'Stop worrying. Start acting.',
      ],
      closingText: "What you control is small — but it is everything.",
      style: 'grounding',
      nextStepId: 'reflection',
    },
    {
      id: 'out-of-control-tapflow',
      type: 'tapFlow',
      title: 'The Art of Letting Go',
      instructions: [
        'It\'s not in your control. Say that out loud.',
        'Feel the weight of those words.',
        'Now feel something unexpected: relief.',
        'You have been carrying something that was never yours to carry.',
        'Their opinion. The outcome. The past.',
        'You cannot will it into changing.',
        'You cannot worry it into submission.',
        'The only thing your worry produces is your own suffering.',
        'Let it go. Not because you don\'t care.',
        'Because you care enough about yourself to stop burning.',
      ],
      closingText: "Freedom begins the moment you stop fighting what you cannot change.",
      style: 'cosmic',
      nextStepId: 'reflection',
    },
    {
      id: 'partial-control-tapflow',
      type: 'tapFlow',
      title: 'Separating the Threads',
      instructions: [
        'Most of life lives here — in the gray zone.',
        'You can prepare for the interview. You can\'t make them hire you.',
        'You can be a good partner. You can\'t make them stay.',
        'You can train every day. You can\'t guarantee the result.',
        'The Stoic practice is surgical: separate the threads.',
        'Find the thread that is yours — your effort, your preparation, your character.',
        'Pour everything into that thread.',
        'And release the rest.',
        'Not with resignation. With clarity.',
        'Do your part. Release the verdict.',
      ],
      closingText: "Control what you can. Release what you cannot. This is the path to peace.",
      style: 'grounding',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "Write down the thing weighing on you most. Then draw a line down the middle of your mind: what part of it can you control? What part must you release? Be specific.",
      minimumWords: 5,
      encouragements: [
        "You're doing real philosophical work right now.",
        "This is the exercise that changed everything for the Stoics.",
      ],
      depthPrompts: [
        "Can you be even more specific about what is and isn't in your control?",
        "What would it feel like to truly release the part you can't control?",
      ],
      placeholder: "The thing weighing on me is...",
      nextStepId: 'affirmation-step',
    },
    {
      id: 'affirmation-step',
      type: 'affirmation',
      preText: "This is the first lesson of Stoicism. The foundation of everything that follows.",
      statement: "I will pour my energy into what I can control. I will release what I cannot. My peace is not negotiable.",
      confirmLabel: "This is my practice",
      style: 'commitment',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Epictetus was born a slave and died one of the most influential philosophers in history. His secret was this single distinction: control what you can, release what you cannot. He didn't have freedom over his body, his circumstances, or his fate. But he had absolute dominion over his mind. And that was enough to change the world.",
        ],
        lowEffort: "Even a few words show you're beginning to see the line between what you control and what you don't. That awareness alone is the start of freedom.",
        byChoice: {
          'in-control': [
            "You recognized that what's weighing on you is actually within your power. That's rare clarity. Most people give away their power by treating controllable things as if they're helpless. You're not helpless. You see the lever. Now pull it.",
          ],
          'out-of-control': [
            "You admitted something most people resist their entire lives: that the thing consuming your energy is not yours to control. Epictetus would say you just took the first step toward freedom. The suffering wasn't caused by the situation — it was caused by fighting something you cannot change.",
          ],
          'partial-control': [
            "You chose the hardest and most honest answer. Most things in life are partially in our control, and the Stoic practice is learning to separate the threads — pouring yourself into the part that's yours and releasing the rest. You've already begun that separation. Keep pulling the threads apart.",
          ],
        },
      },
    },
    {
      id: 'reward',
      type: 'reward',
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2: PERCEPTION IS EVERYTHING
// ─────────────────────────────────────────────────────────────────────────────

const lesson2: FlexibleLesson = {
  id: 'stoic-2-perception-everything',
  slug: 'perception-everything',
  order: 2,
  title: 'Perception is Everything',
  subtitle: "Events don't disturb you — your judgments do",
  description: 'Discover the Stoic secret: between every event and your reaction, there is a gap. In that gap lives your freedom.',
  coreConceptTag: 'perception',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '👁️', color: '#8b5cf6' },
  teaserText: "Tomorrow you'll discover why events don't disturb you — your judgments do.",
  exercises: stoicLesson2Exercises,
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Two people get stuck in traffic. Same highway. Same delay. Same minutes ticking away.\n\nOne pounds the steering wheel, screams, arrives home furious and ruins the evening. The other puts on a podcast, calls a friend, arrives home calm.\n\nSame event. Completely different experience. What's the variable?",
      subtext: "It was never the traffic.",
      continueLabel: "What made the difference?",
      mood: 'curiosity',
      nextStepId: 'epictetus-perception-insight',
    },
    {
      id: 'epictetus-perception-insight',
      type: 'insight',
      text: "\"It is not things that disturb us, but our judgments about things.\"\n\n— Epictetus, Enchiridion, Chapter 5",
      source: 'Epictetus',
      sourceBook: 'Enchiridion',
      style: 'quote',
      followUp: "This single sentence may be the most powerful idea in all of psychology. Cognitive behavioral therapy, the most evidence-based therapy in modern science, is built on this 2,000-year-old Stoic insight.",
      nextStepId: 'upset-check',
    },
    {
      id: 'upset-check',
      type: 'resonanceCheck',
      prompt: "What upset you recently?",
      instruction: "Tap what stirred something in you this past week",
      options: [
        { id: 'someone-said', text: 'Something someone said to me', emoji: '💬' },
        { id: 'plans-changed', text: 'Plans that fell apart', emoji: '📋' },
        { id: 'disrespect', text: 'Feeling disrespected or dismissed', emoji: '😤' },
        { id: 'failure', text: 'A failure or mistake I made', emoji: '❌' },
        { id: 'comparison', text: 'Comparing myself to someone else', emoji: '📱' },
        { id: 'unfairness', text: 'Something that felt deeply unfair', emoji: '⚖️' },
      ],
      minSelections: 1,
      maxSelections: 2,
      storeAs: 'recent-upset',
      nextStepId: 'judgment-scale',
    },
    {
      id: 'judgment-scale',
      type: 'scaleRating',
      prompt: "How much did your JUDGMENT about the event amplify your suffering — beyond what the event itself caused?",
      lowLabel: 'The event was the whole problem',
      highLabel: 'My story about it made it 10x worse',
      steps: 5,
      storeAs: 'judgment-amplification',
      responsesByRange: {
        low: "You believe the event itself was the problem. Let's look closer — there's almost always a story layered on top.",
        mid: "You can already feel it: the event was real, but your interpretation made it heavier. That gap is where your freedom lives.",
        high: "You already see it. The event was one thing. Your story about it — the meaning, the catastrophizing, the personalizing — was something else entirely. That awareness is power.",
      },
      nextStepId: 'separation-tapflow',
    },
    {
      id: 'separation-tapflow',
      type: 'tapFlow',
      title: 'Separating Event from Story',
      instructions: [
        'Think of what upset you. Hold it in your mind.',
        'Now strip away everything except what actually happened.',
        'Not what it meant. Not what it says about you. Not what might happen next.',
        'Just the raw event. The bare facts.',
        'Someone said words. Plans changed. A result appeared.',
        'That\'s it. That\'s all that actually happened.',
        'Everything else — the anger, the shame, the fear —',
        'That was your story. Your interpretation. Your judgment.',
        'The event was a spark. Your mind built the fire.',
        'What if you could see the spark without building the fire?',
      ],
      closingText: "Between the event and your suffering, there is always a story. You are the author.",
      style: 'grounding',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "Take the thing that upset you recently. Write down ONLY the bare facts — what actually happened, stripped of all judgment and interpretation. Then write the story you added on top. What do you notice?",
      minimumWords: 8,
      encouragements: [
        "This separation is the core of Stoic practice.",
        "You're rewiring how you process events right now.",
      ],
      depthPrompts: [
        "Can you strip it down even further? What's the absolute bare fact?",
        "What story did your mind add that wasn't in the original event?",
      ],
      placeholder: "The bare fact is... The story I added was...",
      nextStepId: 'affirmation-step',
    },
    {
      id: 'affirmation-step',
      type: 'affirmation',
      preText: "This is the Stoic lens. Once you see through it, you cannot unsee.",
      statement: "Events do not disturb me. My judgments do. I choose to see clearly before I react.",
      confirmLabel: "I see clearly now",
      style: 'commitment',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Epictetus taught this from a wheelchair. His leg was broken by his master when he was a slave — and he reportedly said during the act: 'You are going to break it.' Then, when it broke: 'I told you so.' The event was real. The pain was real. But his judgment of it — his refusal to add suffering on top of pain — that was his freedom. You have that same freedom, in every moment of your life.",
        ],
        lowEffort: "Even noticing the gap between event and story is a breakthrough. Most people live their entire lives without seeing it. You just saw it.",
      },
    },
    {
      id: 'reward',
      type: 'reward',
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: THE VIEW FROM ABOVE
// ─────────────────────────────────────────────────────────────────────────────

const lesson3: FlexibleLesson = {
  id: 'stoic-3-view-from-above',
  slug: 'view-from-above',
  order: 3,
  title: 'The View From Above',
  subtitle: "The meditation astronauts call the 'overview effect'",
  description: 'Practice the ancient Stoic meditation of zooming out until your problems become specks in the vast cosmic canvas.',
  coreConceptTag: 'perspective',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🌍', color: '#3b82f6' },
  teaserText: "Tomorrow you'll practice the meditation astronauts call the 'overview effect' — without leaving Earth.",
  exercises: stoicLesson3Exercises,
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Every astronaut who has seen Earth from space reports the same thing: a cognitive shift so profound it has its own name — the Overview Effect.\n\nBorders disappear. Conflicts seem absurd. The problems that consumed them minutes ago become invisible against the blue marble hanging in infinite darkness.\n\nMarcus Aurelius discovered this shift 1,800 years before spaceflight. He did it every night, from his tent, during a war.",
      subtext: "You don't need a rocket. You need perspective.",
      continueLabel: "Show me this view",
      mood: 'curiosity',
      nextStepId: 'marcus-insight',
    },
    {
      id: 'marcus-insight',
      type: 'insight',
      text: "\"You can rid yourself of many useless things among those that disturb you, for they lie entirely in your imagination. You will then gain for yourself ample space by comprehending the whole universe in your mind and by contemplating the eternity of time.\"\n\n— Marcus Aurelius, Meditations, Book IX",
      source: 'Marcus Aurelius',
      sourceBook: 'Meditations',
      style: 'quote',
      followUp: "Marcus practiced this meditation during the Marcomannic Wars — surrounded by death, plague, and betrayal. If it worked there, it can work in your living room.",
      nextStepId: 'cosmic-tapflow',
    },
    {
      id: 'cosmic-tapflow',
      type: 'tapFlow',
      title: 'The Cosmic Zoom',
      instructions: [
        'Close your eyes. Feel the weight of whatever is troubling you.',
        'Now imagine rising slowly out of your chair. You see your room from above.',
        'Higher. Your building. The street. People moving like ants with their own worries.',
        'Higher. Your city spreads below you. Thousands of lives, each one consumed by something that feels enormous.',
        'Higher. Your country. Rivers and mountains and millions of stories playing out simultaneously.',
        'Higher. The Earth. A pale blue sphere. Seven billion dramas, all happening on a speck.',
        'Higher still. The solar system. Earth is a pixel now.',
        'The Milky Way. Four hundred billion stars. Your sun is one of them.',
        'The observable universe. Two trillion galaxies.',
        'From here, your problem is not small. It is invisible.',
        'And yet you are here. You exist. Against all odds, you are conscious, alive, aware.',
        'That is the miracle. Not the problem. The miracle is you.',
      ],
      closingText: "You are a conscious being in an unconscious universe. Your problems are real — but they are not the whole story.",
      style: 'cosmic',
      nextStepId: 'perspective-scale',
    },
    {
      id: 'perspective-scale',
      type: 'scaleRating',
      prompt: "After that cosmic zoom — how does your current problem feel now?",
      lowLabel: 'Just as heavy',
      highLabel: 'Genuinely lighter',
      steps: 5,
      storeAs: 'cosmic-shift',
      responsesByRange: {
        low: "The weight is still there. That's okay — perspective is a muscle, not a switch. The more you practice this zoom, the lighter things become.",
        mid: "Something shifted. You can feel the edges of your problem softening. That's the view from above doing its work — reminding you that this moment is one frame in an infinite film.",
        high: "You felt it. The cosmic perspective dissolving the urgency, the tightness, the tunnel vision. Marcus did this every single night. You can too.",
      },
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "From the view from above — from the cosmic perspective — what do you want to say to yourself about the thing that's been consuming you? Write as if you're looking down at your own life from the stars.",
      minimumWords: 5,
      encouragements: [
        "You're practicing a meditation emperors used to govern empires.",
        "Let the cosmic perspective speak through you.",
      ],
      depthPrompts: [
        "What would you tell yourself if you could see your entire life from above — all of it, beginning to end?",
        "What matters from that height? What falls away?",
      ],
      placeholder: "From up here, I can see that...",
      nextStepId: 'affirmation-step',
    },
    {
      id: 'affirmation-step',
      type: 'affirmation',
      preText: "You carry the cosmos inside you.",
      statement: "I am part of something vast and ancient. My problems are real, but they are not the whole story. I choose the view from above.",
      subtext: "Marcus Aurelius wrote this meditation during a war. You can carry it into your day.",
      confirmLabel: "I choose perspective",
      style: 'commitment',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Marcus Aurelius sat in a tent on the Danube frontier, surrounded by plague and war, and wrote in his private journal about the vastness of time and space. He wasn't escaping reality — he was seeing MORE of it. Your problems are real. But they exist inside something so vast, so ancient, so extraordinary, that the act of seeing that context changes everything. Practice this zoom every night. Let the cosmos hold what your mind cannot.",
        ],
        lowEffort: "Even a glimpse of the cosmic perspective loosens the grip. Come back to this meditation whenever the weight feels too heavy. The view is always there, waiting.",
      },
    },
    {
      id: 'reward',
      type: 'reward',
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: MORNING PREPARATION
// ─────────────────────────────────────────────────────────────────────────────

const lesson4: FlexibleLesson = {
  id: 'stoic-4-morning-preparation',
  slug: 'morning-preparation',
  order: 4,
  title: 'Morning Preparation',
  subtitle: 'The morning ritual of a Roman emperor',
  description: 'Learn the dawn practice Marcus Aurelius used to command armies, govern an empire, and master his own mind — before breakfast.',
  coreConceptTag: 'preparation',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🌅', color: '#f97316' },
  teaserText: "Tomorrow you'll learn the morning ritual of a Roman emperor who commanded armies — and his own mind.",
  exercises: stoicLesson4Exercises,
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Your alarm goes off. You reach for your phone. Immediately, the world floods in — notifications, news, other people's demands. Within thirty seconds, you've lost yourself. You haven't even gotten out of bed, and you've already surrendered the day.\n\nMarcus Aurelius woke up differently. Every single morning. For twenty years.",
      subtext: "He prepared for the day the way a warrior prepares for battle.",
      continueLabel: "How did he do it?",
      mood: 'hope',
      nextStepId: 'marcus-morning-insight',
    },
    {
      id: 'marcus-morning-insight',
      type: 'insight',
      text: "\"When you wake up in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous, and surly. They are like this because they can't tell good from evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own. And so none of them can injure me.\"\n\n— Marcus Aurelius, Meditations, Book II",
      source: 'Marcus Aurelius',
      sourceBook: 'Meditations',
      style: 'quote',
      followUp: "This isn't cynicism. This is the most compassionate form of preparation: expecting the worst in others so you can offer the best of yourself.",
      nextStepId: 'challenges-check',
    },
    {
      id: 'challenges-check',
      type: 'resonanceCheck',
      prompt: "What challenges await you today or tomorrow?",
      instruction: "Tap what you're likely to face",
      options: [
        { id: 'difficult-person', text: 'A difficult person I have to deal with', emoji: '😠' },
        { id: 'tedious-work', text: 'Tedious or draining work', emoji: '😩' },
        { id: 'confrontation', text: 'A confrontation or uncomfortable conversation', emoji: '⚡' },
        { id: 'temptation', text: 'A temptation I know I should resist', emoji: '🍎' },
        { id: 'uncertainty', text: 'Uncertainty — not knowing what will happen', emoji: '🌫️' },
        { id: 'self-doubt', text: 'My own self-doubt and inner critic', emoji: '🪞' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'morning-challenges',
      nextStepId: 'plan-reflection',
    },
    {
      id: 'plan-reflection',
      type: 'reflection',
      prompt: "Choose one challenge you selected. How does the strongest, wisest version of you respond to it? Not how you hope to respond — how the person you're becoming WOULD respond. Write your battle plan.",
      minimumWords: 5,
      encouragements: [
        "You're doing exactly what Marcus did every morning in his tent.",
        "This is your pre-battle meditation.",
      ],
      depthPrompts: [
        "What virtue does this challenge demand of you? Patience? Courage? Compassion?",
        "What would Marcus Aurelius do in your exact situation?",
      ],
      placeholder: "When I face this challenge, I will...",
      nextStepId: 'warrior-tapflow',
    },
    {
      id: 'warrior-tapflow',
      type: 'tapFlow',
      title: 'The Morning Warrior Meditation',
      instructions: [
        'The dawn is yours. Before the world claims you, claim yourself.',
        'Breathe in. Feel the weight of the day ahead.',
        'Now name what\'s coming. The difficult people. The hard moments.',
        'See them clearly. Do not flinch.',
        'Marcus faced plague, betrayal, and war every morning.',
        'And every morning, he chose who he would be BEFORE it began.',
        'Now choose. Not what will happen — but who you will be when it does.',
        'Patient when tested. Steady when shaken. Kind when provoked.',
        'You are not reacting to the day. You are preparing for it.',
        'The morning belongs to you. Take it.',
      ],
      closingText: "You have prepared. The day will find you ready.",
      style: 'grounding',
      nextStepId: 'affirmation-step',
    },
    {
      id: 'affirmation-step',
      type: 'affirmation',
      preText: "This is the emperor's morning vow.",
      statement: "I will meet this day prepared. I have seen what's coming, and I have chosen who I will be. No person and no circumstance will decide that for me.",
      confirmLabel: "I am prepared",
      style: 'commitment',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "For twenty years, Marcus Aurelius ruled the most powerful empire on Earth — through plagues, wars, betrayals, and the deaths of children. He didn't survive on talent or luck. He survived on preparation. Every morning, he sat with what was coming and decided in advance who he would be. That's what you just did. Not once, like an exercise. Every morning, like a practice. The emperor's secret was not his power. It was his morning.",
        ],
        lowEffort: "Even naming what's ahead is a form of preparation. Tomorrow morning, before you reach for your phone, take thirty seconds to name one challenge and decide who you'll be when you face it. That's the practice.",
      },
    },
    {
      id: 'reward',
      type: 'reward',
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: REMOVING JUDGMENT
// ─────────────────────────────────────────────────────────────────────────────

const lesson5: FlexibleLesson = {
  id: 'stoic-5-removing-judgment',
  slug: 'removing-judgment',
  order: 5,
  title: 'Removing Judgment',
  subtitle: 'Strip away the stories that create suffering',
  description: 'Learn the Stoic art of seeing events as they are — without the layers of catastrophizing, personalizing, and generalizing that your mind adds on top.',
  coreConceptTag: 'judgment',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🔍', color: '#14b8a6' },
  teaserText: "Tomorrow you'll practice stripping away the stories that create suffering.",
  exercises: stoicLesson5Exercises,
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Your friend cancels plans. That's the event. Simple. Neutral.\n\nBut watch what your mind does with it:\n\n\"They don't actually want to see me.\"\n\"Nobody ever follows through.\"\n\"This always happens to me.\"\n\"They probably found something better.\"\n\nWithin seconds, a cancelled plan becomes evidence of your unworthiness. Your mind took a fact and built a courtroom — and you're the defendant.",
      subtext: "The event was one sentence. The suffering was an entire novel your mind wrote.",
      continueLabel: "I do this",
      mood: 'curiosity',
      nextStepId: 'marcus-judgment-insight',
    },
    {
      id: 'marcus-judgment-insight',
      type: 'insight',
      text: "\"Everything — a horse, a vine — is created for some duty. This is its nature. What were you made for? If you can answer that, consider: does your judgment serve your nature, or betray it?\"\n\nMarcus Aurelius saw that most suffering comes not from events but from the judgments we layer on top of them. Remove the judgment, and the event stands alone — often harmless.",
      source: 'Marcus Aurelius',
      sourceBook: 'Meditations',
      style: 'quote',
      followUp: "The Stoics identified a precise mechanism: your mind adds a story to every event. The story is optional. The event is not.",
      nextStepId: 'judgment-choice',
    },
    {
      id: 'judgment-choice',
      type: 'choice',
      question: "What type of judgment do you add most often to events?",
      instruction: "Choose the pattern that sounds most like your inner voice",
      options: [
        {
          id: 'catastrophizing',
          label: 'Catastrophizing',
          subtext: 'One bad thing happens and I imagine the worst possible chain reaction',
          nextStepId: 'catastrophizing-scenario',
          storeAs: 'judgmentType',
        },
        {
          id: 'personalizing',
          label: 'Personalizing',
          subtext: 'I assume everything negative is about me or my worth',
          nextStepId: 'personalizing-scenario',
          storeAs: 'judgmentType',
        },
        {
          id: 'generalizing',
          label: 'Generalizing',
          subtext: '"Always," "never," "everyone," "nobody" — I turn one event into a life pattern',
          nextStepId: 'generalizing-scenario',
          storeAs: 'judgmentType',
        },
      ],
    },
    {
      id: 'catastrophizing-scenario',
      type: 'scenario',
      narrative: "Catastrophizing: Your mind is a disaster movie director.\n\nYou make one mistake at work and suddenly you're being fired, losing your apartment, and living under a bridge. Your partner seems distant for one evening and you're already imagining the breakup speech.\n\nYour mind doesn't process events — it escalates them. Every spark becomes an inferno. Every crack becomes an earthquake.",
      subtext: "The event was a spark. Your mind built a five-alarm fire.",
      continueLabel: "That's exactly what happens",
      mood: 'tension',
      nextStepId: 'frequency-scale',
    },
    {
      id: 'personalizing-scenario',
      type: 'scenario',
      narrative: "Personalizing: Your mind is a narcissistic detective.\n\nSomeone doesn't text back — it must be something you did. A meeting gets canceled — they must not value your time. A friend seems quiet — they must be upset with you.\n\nEverything becomes about you. Every neutral event passes through a filter that asks: 'What does this say about my worth?'\n\nThe answer is always the same: you're not enough.",
      subtext: "Not everything is about you. But your mind insists it is.",
      continueLabel: "I see this pattern",
      mood: 'tension',
      nextStepId: 'frequency-scale',
    },
    {
      id: 'generalizing-scenario',
      type: 'scenario',
      narrative: "Generalizing: Your mind is a corrupt statistician.\n\nOne person lets you down and 'nobody can be trusted.' One failure and 'I always fail.' One bad day and 'nothing ever works out for me.'\n\nYour mind takes a single data point and extracts a universal law. It turns one raindrop into a flood, one stumble into a permanent fall.",
      subtext: "One event. A lifetime verdict. Your mind writes the sentence before hearing the evidence.",
      continueLabel: "I hear those words in my head",
      mood: 'tension',
      nextStepId: 'frequency-scale',
    },
    {
      id: 'frequency-scale',
      type: 'scaleRating',
      prompt: "How often do you catch yourself adding this kind of judgment to events?",
      lowLabel: 'Rarely',
      highLabel: 'Almost constantly',
      steps: 5,
      storeAs: 'judgment-frequency',
      responsesByRange: {
        low: "You have more awareness than most. This practice will sharpen that awareness into a reflex.",
        mid: "You catch it sometimes — but by then the damage is already done. Today you learn to catch it BEFORE the story takes hold.",
        high: "Your mind is running this program constantly, and it's exhausting. The good news: you just named the pattern. Naming it is the first step to breaking it.",
      },
      nextStepId: 'stripping-tapflow',
    },
    {
      id: 'stripping-tapflow',
      type: 'tapFlow',
      title: 'The Stripping Away',
      instructions: [
        'Think of something that upset you recently. Hold it in your mind.',
        'Now begin to strip it.',
        'Remove the "always" and "never." What actually happened, this one time?',
        'Remove the personalization. What if it had nothing to do with your worth?',
        'Remove the catastrophe. What is the most likely outcome, not the worst?',
        'Remove the judgment about yourself. What if you\'re not broken — just human?',
        'Keep stripping until you reach the bare event.',
        'A person did a thing. A result appeared. Words were spoken.',
        'No story. No verdict. No courtroom.',
        'Just what happened. Nothing more.',
        'This is reality without your mind\'s editorial. This is freedom.',
      ],
      closingText: "The event remains. The suffering was optional — and you just removed it.",
      style: 'grounding',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "Take a recent event that triggered your pattern (catastrophizing, personalizing, or generalizing). Write it as a bare fact — then write the judgment you added. Finally, write what changes when you see ONLY the fact.",
      minimumWords: 8,
      encouragements: [
        "You're doing the exact practice Marcus described in his journal.",
        "This is where suffering begins to dissolve.",
      ],
      depthPrompts: [
        "What would this event mean if you added no judgment at all?",
        "How does your body feel when you see only the bare fact versus the full story?",
      ],
      placeholder: "The bare fact: ... The judgment I added: ... Without the judgment: ...",
      nextStepId: 'affirmation-step',
    },
    {
      id: 'affirmation-step',
      type: 'affirmation',
      preText: "You have seen behind the curtain of your own mind.",
      statement: "I release the stories my mind layers onto events. I choose to see what is — not what I fear, not what I assume, not what I generalize. Just what is.",
      confirmLabel: "I release the story",
      style: 'release',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Marcus Aurelius spent twenty years practicing this in his private journals. Night after night, he would take the events of his day and strip them of judgment. 'Roasted meat is a dead animal. Wine is grape juice. The purple robes of the emperor are sheep's wool dyed in shellfish blood.' He stripped everything to its bare reality — not to be grim, but to be free. The more you practice this, the less power your mind's stories will have over you.",
        ],
        lowEffort: "Even seeing the pattern is a victory. Next time your mind starts building a story, pause and ask: 'What actually happened?' That one question can dissolve hours of suffering.",
        byChoice: {
          'catastrophizing': [
            "You named your pattern: catastrophizing. Your mind is a disaster movie director — one spark and it builds an inferno. Marcus Aurelius would say: 'Confine yourself to the present.' Not the imagined future. Not the worst-case scenario. Just this moment, this fact, this reality. The catastrophe your mind builds almost never arrives. But the suffering it causes is real. Start catching the spark before it becomes a fire.",
          ],
          'personalizing': [
            "You named your pattern: personalizing. Everything becomes about your worth. Epictetus would remind you: other people's actions are not within your control — and they are almost never about you. The friend who didn't text back might be drowning in their own life. The meeting that was canceled might have nothing to do with your value. Start assuming innocence instead of indictment. Most of the time, it really isn't about you.",
          ],
          'generalizing': [
            "You named your pattern: generalizing. One event becomes a universal law. Marcus would say: 'Don't let your imagination be crushed by life as a whole.' He knew the danger of turning one data point into a life sentence. One failure is not 'I always fail.' One disappointment is not 'Nothing works.' Train yourself to add the word 'this time' to every judgment. 'This time, it didn't work.' That's accuracy. That's freedom.",
          ],
        },
      },
    },
    {
      id: 'reward',
      type: 'reward',
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 1: PERCEPTION
// ─────────────────────────────────────────────────────────────────────────────

export const stoic_chapter1_Perception: FlexibleChapter = {
  id: 'chapter-stoic-perception',
  slug: 'perception',
  name: 'Perception',
  subtitle: 'See clearly before you act',
  description: "The Stoics believed that our judgments—not events themselves—cause our suffering. Learn to see reality without the distortions of fear, anger, or desire.",
  order: 1,
  iconName: 'Eye',
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5],
};

export default stoic_chapter1_Perception;
