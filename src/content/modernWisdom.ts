// ═══════════════════════════════════════════════════════════════════════════
// WORLD 1: MODERN FOUNDATIONS
// ═══════════════════════════════════════════════════════════════════════════
//
// This is not ancient philosophy hidden in dusty quotes.
// This is wisdom translated for modern life.
//
// Start with pain. Start with problems users know intimately.
// Then show them the way through - with practical, actionable wisdom.
//
// Each lesson is a unique experience, designed for its specific teaching.
// No templates. No repetition. Every lesson is crafted for maximum impact.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleWorld, FlexibleLesson, FlexibleChapter, LessonStep } from '@/types/lessons';
import { type Locale } from '@/i18n';
import { chapter2_Resilience } from './modernWisdomChapter2';
import { chapter3_Relationships } from './modernWisdomChapter3';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1: THE WEIGHT YOU CARRY (Dichotomy of Control)
// ─────────────────────────────────────────────────────────────────────────────

const lesson1_InstantReframe: FlexibleLesson = {
  id: 'modern-1-instant-reframe',
  slug: 'instant-reframe',
  order: 1,
  title: 'The Weight You Carry',
  subtitle: 'Discover the question that sets you free',
  description: 'One question has freed emperors and prisoners alike. Today, it frees you.',
  coreConceptTag: 'control',
  xpReward: 25,
  estimatedMinutes: 7,
  thumbnail: { icon: '⚖️', color: '#f59e0b' },
  teaserText: "Tomorrow you'll discover the one question that has freed emperors and prisoners alike for 2000 years.",
  exercises: [
    {
      id: 'ex-1-truth-mirror',
      type: 'truth-mirror',
      title: 'The Letting Go Sequence',
      content: {
        statements: [
          "I'm still thinking about something I said.",
          "I'm worried about something I can't change.",
          "I keep replaying a conversation in my head.",
          "I'm trying to control someone else's opinion of me.",
          "I'm anxious about a future I can't predict.",
          "I'm holding onto anger at something that's over.",
          "I'm waiting for someone to change who won't.",
          "I'm fighting a reality I need to accept."
        ],
        holdReveal: "This is the weight. Breathe it out.",
        breathPrompts: [
          "Let go...",
          "Release...",
          "Accept..."
        ],
        style: 'release'
      }
    },
    {
      id: 'ex-1-soul-compass',
      type: 'soul-compass',
      title: 'Control or Release?',
      content: {
        centralQuestion: "Think of what's weighing on you right now. What does it feel like?",
        options: [
          { id: 'action', emoji: '🎯', text: 'I can take action on this' },
          { id: 'accept', emoji: '🌊', text: 'I need to accept this' },
          { id: 'unsure', emoji: '⚡', text: "I'm not sure yet" },
          { id: 'circles', emoji: '💭', text: 'I keep going in circles' },
          { id: 'angry', emoji: '🔥', text: 'This makes me angry' },
          { id: 'sad', emoji: '🌑', text: 'This makes me sad' }
        ],
        showIntensity: true,
        intensityQuestion: "How heavy does this feel?",
        intensityLabels: { low: 'Light', high: 'Crushing' },
        intensityResponses: {
          low: "Light burdens become lighter when named.",
          mid: "You're in the middle. That takes courage to admit.",
          high: "Heavy weights need heavy tools. You're here. That's step one."
        },
        style: 'introspective'
      }
    },
    {
      id: 'ex-1-presence-anchor',
      type: 'presence-anchor',
      title: 'The Open Palms',
      content: {
        gesture: "Open your hands, palms up, fingers relaxed. Feel the air on your palms.",
        meaning: "Release what you cannot control",
        breathCycles: 5,
        exhalePrompts: [
          "What you cannot control...",
          "Let it rest in open palms...",
          "You are not your worry...",
          "This moment is enough...",
          "Freedom is letting go..."
        ],
        anchorMessage: "Whenever you feel the urge to control, open your palms. Your body will remember.",
        style: 'release'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Right now, something is sitting in the back of your mind. It's been there for a while. Maybe it's a conversation you keep rehearsing. A wrong that was done to you. A decision you've been avoiding. A fear about the future that won't let go.",
      mood: 'tension',
      nextStepId: 'scenario-2',
    },
    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "You can feel it right now, can't you? That familiar weight. The mental loop that plays when you're trying to fall asleep. The tension that lives in your shoulders, your chest, your jaw.",
      subtext: "This weight is real. And today, we're going to do something about it.",
      bridgeQuestion: "Are you ready to face it?",
      continueLabel: "Yes, I'm ready",
      mood: 'tension',
      nextStepId: 'identify-burden',
    },
    {
      id: 'identify-burden',
      type: 'resonanceCheck',
      prompt: "What's been weighing on you?",
      instruction: "Tap everything that resonates",
      options: [
        { id: 'conversation', text: 'A conversation I keep replaying' },
        { id: 'decision', text: "A decision I've been avoiding" },
        { id: 'wronged', text: 'Someone who wronged me' },
        { id: 'future-fear', text: 'Fear about my future' },
        { id: 'regret', text: 'Something I said or did that I regret' },
        { id: 'responsibility', text: "A responsibility that's crushing me" },
        { id: 'relationship', text: "A relationship that's draining me" },
        { id: 'self-doubt', text: 'Constant self-doubt' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'burden-type',
      nextStepId: 'feel-weight',
    },
    {
      id: 'feel-weight',
      type: 'scaleRating',
      prompt: "How heavy does this feel right now?",
      lowLabel: 'A whisper',
      highLabel: 'Crushing',
      steps: 5,
      storeAs: 'burden-weight',
      responsesByRange: {
        low: 'Even small weights add up when you carry them long enough.',
        mid: "You've been carrying this longer than you realize.",
        high: "No wonder you're exhausted. You've been carrying a boulder.",
      },
      nextStepId: 'ancient-question',
    },
    {
      id: 'ancient-question',
      type: 'insight',
      text: "For two thousand years, emperors and slaves have asked themselves one question to find peace. Marcus Aurelius asked it while ruling Rome. Epictetus asked it while in chains. James Stockdale asked it while being tortured as a prisoner of war.\n\nToday, you ask it about what you just named.",
      style: 'principle',
      followUp: "The question is simple. But answering it honestly changes everything.",
      nextStepId: 'the-choice',
    },
    {
      id: 'the-choice',
      type: 'choice',
      instruction: 'Answer with ruthless honesty',
      question: 'Is there a concrete action you can take about this in the next 5 minutes?',
      options: [
        {
          id: 'yes',
          label: 'Yes — there is something I can do',
          subtext: 'A specific action I could take right now',
          nextStepId: 'action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: 'No — this is truly outside my control',
          subtext: 'I cannot change this through my own actions',
          nextStepId: 'acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    // YES BRANCH
    {
      id: 'action-validation',
      type: 'insight',
      text: "You have power here. Most people never realize that. They sit with their worries, replaying them endlessly, when the cure was always within reach. You saw differently. You saw an opening.",
      style: 'reframe',
      followUp: "Now comes the hardest part: actually doing something about it.",
      nextStepId: 'action-affirmation',
    },
    {
      id: 'action-affirmation',
      type: 'affirmation',
      preText: "You identified your burden. You saw that action is possible.",
      statement: "I will take one concrete step about this today. Not tomorrow. Today.",
      confirmLabel: "This is my commitment",
      style: 'commitment',
      nextStepId: 'action-tapflow',
    },
    {
      id: 'action-tapflow',
      type: 'tapFlow',
      title: 'The Action Mindset',
      instructions: [
        'You identified something within your control.',
        'Most people never get this far.',
        'They stay stuck in their heads, replaying the same worries.',
        'But you saw an opening. You chose to act.',
        'Action is the antidote to anxiety.',
        'The moment you move, the weight begins to lift.',
        'Not because the problem disappears...',
        'But because you stop being its victim.',
        "Today, you take one step. That's all that matters.",
      ],
      style: 'fearless',
      nextStepId: 'reflection',
    },
    // NO BRANCH
    {
      id: 'acceptance-validation',
      type: 'insight',
      text: "You just did something incredibly difficult: you told yourself the truth. This thing that's been torturing you — you cannot fix it through action. Most people spend months, years, entire lifetimes fighting battles they can never win. You stopped. Right here. Right now.",
      style: 'reframe',
      followUp: "This isn't defeat. This is wisdom. The question now is: can you actually let go?",
      nextStepId: 'acceptance-tapflow',
    },
    {
      id: 'acceptance-tapflow',
      type: 'tapFlow',
      title: 'The Release',
      instructions: [
        'Take three deep breaths. Slow and deliberate.',
        'Picture the thing you named. See it clearly in your mind.',
        'Notice how your body responds. The tightening. The resistance.',
        "Now imagine you're holding this burden in your cupped hands.",
        "Feel its weight. You've been carrying this for so long.",
        'Now slowly... open your hands. Palm up. Fingers spread.',
        "Watch it lift. It was never yours to carry.",
        "It exists. But it doesn't need to live inside you.",
        'Take one more breath. Feel the space where the weight used to be.',
      ],
      style: 'grounding',
      nextStepId: 'reflection',
    },
    // CONVERGE
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "What shifted in you today? Whether you chose action or acceptance, something changed. Name it.",
      minimumWords: 5,
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },
    {
      id: 'closing-insight',
      type: 'insight',
      text: "What you just practiced is called the Dichotomy of Control. It's the foundation of Stoic philosophy, and it has guided leaders, survivors, and ordinary people for over two thousand years.\n\nOne question: 'Is this within my control?'\n\nIf yes, act. If no, accept. That's it. That's the entire philosophy.",
      source: 'Epictetus',
      sourceBook: 'The Enchiridion',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "This question will change your life if you let it. Every worry, every stress, every sleepless night — ask yourself: 'Can I do something about this?' Then act or accept. That's where peace lives.",
        ],
        byChoice: {
          yes: [
            "You saw an opening where others see only walls. You committed to action — and that commitment is real. Honor it today. The weight lifts the moment you move.",
          ],
          no: [
            "You practiced the hardest skill in philosophy: accepting what you cannot change. Most people fight that battle forever. Today, you chose peace instead.",
          ],
        },
      },
    },
  ] as LessonStep[],
};


// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2: THE POWER OF TINY (Atomic Habits)
// ─────────────────────────────────────────────────────────────────────────────

const lesson2_PowerOfTiny: FlexibleLesson = {
  id: 'modern-2-power-of-tiny',
  slug: 'power-of-tiny',
  order: 2,
  title: 'The Power of Tiny',
  subtitle: 'Why 1% better beats 100% perfect',
  description: 'Discover why the smallest actions create the biggest changes.',
  coreConceptTag: 'habits',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌱', color: '#10b981' },
  teaserText: "Tomorrow you'll learn the 2-minute rule that makes habits impossible to fail.",
  exercises: [
    {
      id: 'ex-2-truth-mirror',
      type: 'truth-mirror',
      title: 'The Identity Votes',
      content: {
        statements: [
          "I start things but rarely finish them.",
          "I wait until I'm motivated to begin.",
          "I think I need to make big changes.",
          "I've tried this before and failed.",
          "I don't believe small actions matter.",
          "I'm harder on myself than anyone else.",
          "I compare my start to someone else's finish.",
          "I forget that showing up IS the win."
        ],
        holdReveal: "This pattern can change. One tiny vote at a time.",
        breathPrompts: [
          "One percent...",
          "One vote...",
          "One day..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-2-soul-compass',
      type: 'soul-compass',
      title: "What's Your 2-Minute Truth?",
      content: {
        centralQuestion: "Why haven't your past attempts stuck?",
        options: [
          { id: 'big', emoji: '🎯', text: 'I made it too big' },
          { id: 'motivation', emoji: '🌀', text: 'I lost motivation' },
          { id: 'life', emoji: '📅', text: 'Life got in the way' },
          { id: 'hard', emoji: '😤', text: 'I was too hard on myself' },
          { id: 'wrong', emoji: '🎭', text: 'I was doing it for the wrong reasons' },
          { id: 'unknown', emoji: '❓', text: "I don't know why" }
        ],
        showIntensity: true,
        intensityQuestion: "How much do you want this to change?",
        intensityLabels: { low: 'A little', high: 'Desperately' },
        intensityResponses: {
          low: "Maybe you're content. That's okay too.",
          mid: "The spark is there. Let's fan it gently.",
          high: "That fire is real. Now shrink the action, not the desire."
        },
        style: 'energizing'
      }
    },
    {
      id: 'ex-2-presence-anchor',
      type: 'presence-anchor',
      title: 'The Seed Gesture',
      content: {
        gesture: "Touch your thumb to your index finger, forming a tiny circle - like holding a seed.",
        meaning: "Tiny is powerful",
        breathCycles: 4,
        exhalePrompts: [
          "Small doesn't mean weak...",
          "Consistent beats intense...",
          "You are what you repeat...",
          "The seed becomes the oak..."
        ],
        anchorMessage: "Touch these fingers anytime you feel overwhelmed. Remember: tiny is powerful.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "You've tried to change before. Started strong on a Monday morning. Made the plan. Bought the equipment. Felt the rush of motivation.\n\nThen Wednesday came. Or maybe Thursday. And the streak broke. The gym bag sat by the door. The journal stayed blank. The app sent reminders you swiped away.",
      subtext: "Sound familiar? Here's the thing — it wasn't your fault.",
      bridgeQuestion: "What if the problem was never your willpower?",
      continueLabel: "Tell me more",
      mood: 'hope',
    },
    {
      id: 'failed-habits',
      type: 'resonanceCheck',
      prompt: "What have you tried and failed to stick with?",
      instruction: "Be honest — tap all that apply",
      options: [
        { id: 'exercise', text: 'Working out consistently' },
        { id: 'eating', text: 'Eating healthier' },
        { id: 'reading', text: 'Reading more' },
        { id: 'meditation', text: 'Meditation or mindfulness' },
        { id: 'sleep', text: 'Waking up earlier' },
        { id: 'productivity', text: 'Being more productive' },
        { id: 'bad-habit', text: 'Breaking a bad habit' },
        { id: 'learning', text: 'Learning something new' },
      ],
      minSelections: 1,
      maxSelections: 4,
      storeAs: 'failed-habits',
      nextStepId: 'failure-scale',
    },
    {
      id: 'failure-scale',
      type: 'scaleRating',
      prompt: "How frustrated are you with yourself for not sticking with things?",
      lowLabel: 'A little annoyed',
      highLabel: 'Deeply frustrated',
      steps: 5,
      storeAs: 'frustration-level',
      responsesByRange: {
        low: "That's okay. The good news is you're still curious enough to try a different approach.",
        mid: "That frustration is valid. But what if the method was broken, not you?",
        high: "That frustration has been lying to you. It says you're weak. The truth? You were just using the wrong strategy.",
      },
      nextStepId: 'core-insight',
    },
    {
      id: 'core-insight',
      type: 'insight',
      text: "We overestimate what we can do in a day and underestimate what we can do in a year. The secret isn't massive action — it's tiny action, repeated.\n\n1% better every day means 37x better in a year.",
      source: 'James Clear',
      sourceBook: 'Atomic Habits',
      style: 'principle',
      followUp: "The 2-minute rule: scale any habit down until it takes less than 2 minutes. Then do only that. Every single day.",
      nextStepId: 'tiny-choice',
    },
    {
      id: 'tiny-choice',
      type: 'choice',
      instruction: 'Now shrink it to 2 minutes',
      question: 'Which tiny version could you actually do every single day?',
      options: [
        { id: 'pushups', label: '2 pushups instead of a workout', nextStepId: 'body-affirmation', storeAs: 'tinyHabit' },
        { id: 'paragraph', label: 'Read one paragraph, not a chapter', nextStepId: 'mind-affirmation', storeAs: 'tinyHabit' },
        { id: 'breaths', label: '3 deep breaths instead of meditating', nextStepId: 'calm-affirmation', storeAs: 'tinyHabit' },
        { id: 'shoes', label: 'Put on my shoes instead of running', nextStepId: 'body-affirmation', storeAs: 'tinyHabit' },
        { id: 'sentence', label: 'Write one sentence instead of journaling', nextStepId: 'mind-affirmation', storeAs: 'tinyHabit' },
        { id: 'water', label: 'Drink one glass of water first thing', nextStepId: 'body-affirmation', storeAs: 'tinyHabit' },
      ],
    },
    {
      id: 'body-affirmation',
      type: 'affirmation',
      preText: "Not the perfect version. The possible version.",
      statement: "I will do the tiny version. Every day. Starting today. My body will thank me.",
      confirmLabel: "This is my tiny habit",
      style: 'commitment',
      nextStepId: 'compound-tapflow',
    },
    {
      id: 'mind-affirmation',
      type: 'affirmation',
      preText: "Not the perfect version. The possible version.",
      statement: "I will do the tiny version. Every day. Starting today. My mind will thank me.",
      confirmLabel: "This is my tiny habit",
      style: 'commitment',
      nextStepId: 'compound-tapflow',
    },
    {
      id: 'calm-affirmation',
      type: 'affirmation',
      preText: "Not the perfect version. The possible version.",
      statement: "I will do the tiny version. Every day. Starting today. My peace will thank me.",
      confirmLabel: "This is my tiny habit",
      style: 'commitment',
      nextStepId: 'compound-tapflow',
    },
    {
      id: 'compound-tapflow',
      type: 'tapFlow',
      title: 'The Compound Effect',
      instructions: [
        "Day 1: You do the tiny thing. It feels almost silly.",
        "Day 7: It's becoming automatic. You barely think about it.",
        "Day 30: It's part of who you are now.",
        "Day 90: People start to notice something different about you.",
        "Day 365: You are 37 times better than when you started.",
        "All because you chose the version you couldn't fail at.",
        "Not the ambitious version. Not the impressive version.",
        "The tiny version. The real version. The one that actually sticks.",
      ],
      closingText: "Every action is a vote for who you wish to become.",
      style: 'grounding',
      nextStepId: 'confidence-check',
    },
    {
      id: 'confidence-check',
      type: 'scaleRating',
      prompt: "How confident are you that you can do this tiny version every day?",
      lowLabel: 'Not sure',
      highLabel: '100% certain',
      steps: 5,
      storeAs: 'confidence',
      responsesByRange: {
        low: "Make it even smaller until you hit 5/5. That's the sweet spot.",
        mid: "Good — but could you shrink it even more? The tinier, the more unstoppable.",
        high: "That's the sweet spot. A habit you can't fail at. Unstoppable.",
      },
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "How did it feel to do something tiny instead of planning something huge? Could you do this every single day?",
      minimumWords: 5,
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },
    {
      id: 'closing-insight',
      type: 'insight',
      text: "James Clear wrote: 'You do not rise to the level of your goals. You fall to the level of your systems.'\n\nYour system is now in place. One tiny action. Every day. That's the entire system. And it works because it removes the need for motivation, willpower, or perfect conditions.",
      source: 'James Clear',
      sourceBook: 'Atomic Habits',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You identified what failed, chose the tiny version, and committed. That's more than most people ever do. Every action is a vote for who you wish to become. You just cast your vote.",
        ],
        byChoice: {
          pushups: [
            "Two pushups. That's your vote for being someone who moves their body. It sounds small because it is. And that's exactly why it will work.",
          ],
          paragraph: [
            "One paragraph. That's your vote for being a reader. Most 'readers' have a stack of unfinished books. You'll have a finished habit. That's worth more.",
          ],
          breaths: [
            "Three breaths. That's your vote for being someone who finds calm in chaos. The monks would approve. They started the same way.",
          ],
          shoes: [
            "Shoes on. That's it. The brilliant thing? Once the shoes are on, you'll probably walk. Once you walk, you might run. But the only rule is: shoes on.",
          ],
          sentence: [
            "One sentence. That's your vote for being someone who reflects. Hemingway wrote one true sentence to start every day. You're in good company.",
          ],
          water: [
            "One glass of water. Your body has been dehydrating for 8 hours. This tiny act of care ripples through your entire morning.",
          ],
        },
      },
    },
  ] as LessonStep[],
};


// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: THE HIDDEN GIFT (The Obstacle Is the Way)
// ─────────────────────────────────────────────────────────────────────────────

const lesson3_ObstacleOpportunity: FlexibleLesson = {
  id: 'modern-3-obstacle-opportunity',
  slug: 'obstacle-opportunity',
  order: 3,
  title: 'The Hidden Gift',
  subtitle: 'Finding opportunity in every obstacle',
  description: 'Learn to see your problems as fuel for growth.',
  coreConceptTag: 'obstacles',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🔥', color: '#ef4444' },
  teaserText: "Tomorrow you'll learn the ancient secret that turns every obstacle into your greatest advantage.",
  exercises: [
    {
      id: 'ex-3-truth-mirror',
      type: 'truth-mirror',
      title: 'The Hidden Gifts',
      content: {
        statements: [
          "This setback might be redirecting me somewhere better.",
          "This difficulty is building strength I'll need later.",
          "What feels like rejection might be protection.",
          "The door that closed wasn't my door.",
          "This struggle is teaching me something important.",
          "My biggest growth has come from my hardest times.",
          "The obstacle contains exactly what I need.",
          "I can use this, even if I didn't choose it."
        ],
        holdReveal: "The obstacle is the way. This is your way.",
        breathPrompts: [
          "Through...",
          "Not around...",
          "Forward..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-3-soul-compass',
      type: 'soul-compass',
      title: 'Obstacle Inventory',
      content: {
        centralQuestion: "What is blocking your path right now?",
        options: [
          { id: 'door', emoji: '🚪', text: "A door that won't open" },
          { id: 'person', emoji: '👤', text: "A person who won't change" },
          { id: 'time', emoji: '⏰', text: "Time I don't have" },
          { id: 'loss', emoji: '💔', text: "A loss I can't undo" },
          { id: 'fear', emoji: '😰', text: "Fear I can't shake" },
          { id: 'unknown', emoji: '🤷', text: "I don't know what's blocking me" }
        ],
        showIntensity: false,
        followUpQuestion: "What could this obstacle be creating?",
        followUpOptions: [
          { id: 'strength', emoji: '💪', text: 'Strength' },
          { id: 'wisdom', emoji: '🧠', text: 'Wisdom' },
          { id: 'redirect', emoji: '🔄', text: 'Redirection' },
          { id: 'growth', emoji: '🌱', text: 'Growth' },
          { id: 'unseen', emoji: '❓', text: "I can't see it yet" }
        ],
        style: 'awakening'
      }
    },
    {
      id: 'ex-3-presence-anchor',
      type: 'presence-anchor',
      title: 'The Phoenix Rising',
      content: {
        gesture: "Press your palms together at your chest. As you breathe out, raise them overhead while spreading your fingers wide - like flames rising.",
        meaning: "Rise from what tried to burn you",
        breathCycles: 4,
        exhalePrompts: [
          "From the fire...",
          "Comes the fuel...",
          "The obstacle becomes...",
          "The way forward..."
        ],
        anchorMessage: "Whenever you feel blocked, do this gesture. Rise like the phoenix.",
        style: 'strength'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "There's something blocking your path right now. A rejection letter. A failed attempt. A person who won't budge. A situation that feels impossibly, maddeningly stuck.",
      subtext: "Everyone told you this was a problem. What if they were wrong?",
      continueLabel: "I'm listening",
      mood: 'curiosity',
      nextStepId: 'scenario-2',
    },
    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "Thomas Edison was asked how it felt to fail 1,000 times before inventing the lightbulb. He said: 'I didn't fail 1,000 times. The lightbulb was an invention with 1,000 steps.'\n\nThe obstacle wasn't blocking his path. It WAS his path.",
      bridgeQuestion: "What if your obstacle is doing the same thing for you?",
      continueLabel: "Let's find out",
      mood: 'curiosity',
      nextStepId: 'identify-obstacle',
    },
    {
      id: 'identify-obstacle',
      type: 'resonanceCheck',
      prompt: "What kind of obstacle are you facing?",
      instruction: "Tap what sounds most like your situation",
      options: [
        { id: 'rejection', text: 'Rejection or failure' },
        { id: 'person', text: 'A difficult person' },
        { id: 'money', text: 'Financial pressure' },
        { id: 'health', text: 'Health challenges' },
        { id: 'stuck', text: 'Feeling stuck in life' },
        { id: 'relationship', text: 'A broken relationship' },
        { id: 'career', text: 'Career frustration' },
        { id: 'self-doubt', text: 'Crushing self-doubt' },
      ],
      minSelections: 1,
      maxSelections: 2,
      storeAs: 'obstacle-type',
      nextStepId: 'obstacle-scale',
    },
    {
      id: 'obstacle-scale',
      type: 'scaleRating',
      prompt: "How stuck do you feel right now?",
      lowLabel: 'Slightly blocked',
      highLabel: 'Completely trapped',
      steps: 5,
      storeAs: 'stuck-level',
      responsesByRange: {
        low: "A small obstacle is still worth reframing. Small walls still block the view.",
        mid: "You're in the thick of it. That's actually the perfect place for what comes next.",
        high: "When you feel completely trapped, that's often the moment right before the breakthrough. Stay with me.",
      },
      nextStepId: 'core-insight',
    },
    {
      id: 'core-insight',
      type: 'insight',
      text: "The impediment to action advances action. What stands in the way becomes the way.\n\nEvery obstacle you face contains within it the seeds of an equal or greater opportunity.",
      source: 'Marcus Aurelius',
      sourceBook: 'Meditations (interpreted by Ryan Holiday)',
      style: 'principle',
      followUp: "This isn't positive thinking. It's strategic thinking. The question isn't 'why me?' — it's 'what can I build from this?'",
      nextStepId: 'flip-choice',
    },
    {
      id: 'flip-choice',
      type: 'choice',
      instruction: 'Consider this carefully',
      question: 'Could this obstacle be teaching you something you needed to learn?',
      options: [
        {
          id: 'maybe-yes',
          label: 'Maybe... I can see how it might',
          subtext: "There's a lesson hiding in here somewhere",
          nextStepId: 'opportunity-affirmation',
          storeAs: 'obstacleView',
        },
        {
          id: 'not-sure',
          label: "I honestly don't see it yet",
          subtext: "This just feels like pain right now",
          nextStepId: 'reframe-tapflow',
          storeAs: 'obstacleView',
        },
      ],
    },
    // YES BRANCH
    {
      id: 'opportunity-affirmation',
      type: 'affirmation',
      preText: "You can already see it. The gift wrapped in difficulty.",
      statement: "This obstacle is not my enemy. It is my teacher. I will learn what it has to show me.",
      confirmLabel: "I accept this lesson",
      style: 'strength',
      nextStepId: 'gift-tapflow',
    },
    {
      id: 'gift-tapflow',
      type: 'tapFlow',
      title: 'Finding the Gift',
      instructions: [
        'Picture your obstacle clearly.',
        "Now imagine you're 5 years in the future.",
        "You're looking back at this exact moment.",
        'This obstacle helped you become someone stronger.',
        'It taught you something no book could teach.',
        'It forged a skill you use every day.',
        'You are grateful — not for the pain, but for who it made you.',
        'Hold that future version of yourself in your mind.',
        'That person exists because of what you face today.',
      ],
      style: 'fearless',
      nextStepId: 'gift-resonance',
    },
    // NO BRANCH
    {
      id: 'reframe-tapflow',
      type: 'tapFlow',
      title: 'A Different Lens',
      instructions: [
        "When we can't see the gift, it's usually because we're too close.",
        "Let's zoom out.",
        "Think of a past struggle. Something that felt impossible at the time.",
        "You survived it. You may have even grown from it.",
        "Now look at your current obstacle with that same distance.",
        "You don't have to see the gift clearly yet.",
        "You just have to be open to the possibility that it exists.",
        "History is full of people who became who they were BECAUSE of their obstacles.",
        "Not despite them. Because of them.",
      ],
      style: 'grounding',
      nextStepId: 'gift-resonance',
    },
    // CONVERGE
    {
      id: 'gift-resonance',
      type: 'resonanceCheck',
      prompt: "What might this obstacle be building in you?",
      instruction: "Tap what resonates",
      options: [
        { id: 'resilience', text: "Resilience — I'm learning to bounce back" },
        { id: 'patience', text: "Patience — I'm learning to endure" },
        { id: 'creativity', text: "Creativity — I'm finding new paths" },
        { id: 'empathy', text: "Empathy — I understand struggle now" },
        { id: 'strength', text: "Strength — I'm harder to break" },
        { id: 'wisdom', text: 'Wisdom — I see things differently' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'obstacle-gift',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "What opportunity might be hiding inside your obstacle? What could this be teaching you?",
      minimumWords: 5,
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },
    {
      id: 'closing-insight',
      type: 'insight',
      text: "Marcus Aurelius wrote this nearly 2,000 years ago while fighting wars, plagues, and betrayal:\n\n'The obstacle on the path becomes the path. Never forget, within every obstacle is an opportunity to improve our condition.'\n\nRyan Holiday turned this into a modern philosophy in The Obstacle Is the Way. Now it's yours.",
      source: 'Marcus Aurelius & Ryan Holiday',
      sourceBook: 'The Obstacle Is the Way',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just did alchemy. You named your obstacle, visualized your future self overcoming it, and identified the gift hiding inside the pain. That's how the greatest minds in history thought. Now it's how you think too.",
        ],
        byChoice: {
          'maybe-yes': [
            "You could already see the gift — even before I pointed it out. That's a rare ability. Most people are so consumed by the pain that they never look for what it's building. You did.",
          ],
          'not-sure': [
            "You were honest that you couldn't see the gift yet. That honesty is itself a gift. The meaning often reveals itself months or years later — and when it does, you'll remember this moment.",
          ],
        },
      },
    },
  ] as LessonStep[],
};


// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: OWN YOUR MORNING (Premeditation of Adversity)
// ─────────────────────────────────────────────────────────────────────────────

const lesson4_MorningMindset: FlexibleLesson = {
  id: 'modern-4-morning-mindset',
  slug: 'morning-mindset',
  order: 4,
  title: 'Own Your Morning',
  subtitle: 'Start the day before it starts you',
  description: 'A 2-minute practice that changes how your whole day feels.',
  coreConceptTag: 'preparation',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌅', color: '#f97316' },
  teaserText: "Tomorrow you'll learn the 2-minute morning practice used by Roman emperors and modern CEOs alike.",
  exercises: [
    {
      id: 'ex-4-truth-mirror',
      type: 'truth-mirror',
      title: 'The Ambush Awareness',
      content: {
        statements: [
          "My mornings are usually hijacked by my phone.",
          "I wake up already stressed about the day.",
          "I let other people set my emotional tone.",
          "I'm surprised when things go wrong.",
          "I react instead of respond.",
          "I forget that I have a choice in how I feel.",
          "I start the day on defense, not offense.",
          "I could anticipate, but I usually don't."
        ],
        holdReveal: "The warrior expects the ambush. Now you're ready.",
        breathPrompts: [
          "I anticipated...",
          "I chose...",
          "I'm ready..."
        ],
        style: 'clarity'
      }
    },
    {
      id: 'ex-4-soul-compass',
      type: 'soul-compass',
      title: 'What Ambushes You?',
      content: {
        centralQuestion: "What typically derails your day?",
        options: [
          { id: 'phone', emoji: '📱', text: 'My phone/social media' },
          { id: 'people', emoji: '👥', text: 'Difficult people' },
          { id: 'email', emoji: '📧', text: 'Emails/messages' },
          { id: 'commute', emoji: '🚗', text: 'Commute/traffic' },
          { id: 'anxiety', emoji: '😰', text: 'My own anxiety' },
          { id: 'random', emoji: '🎲', text: 'Random surprises' }
        ],
        showIntensity: false,
        followUpQuestion: "If this happened tomorrow, how would you CHOOSE to respond?",
        followUpOptions: [
          { id: 'calm', emoji: '🧘', text: 'With calm acceptance' },
          { id: 'focus', emoji: '🔥', text: 'With fierce focus' },
          { id: 'step-back', emoji: '💭', text: 'By stepping back first' },
          { id: 'unsure', emoji: '🤷', text: "I'm not sure yet" }
        ],
        style: 'grounding'
      }
    },
    {
      id: 'ex-4-presence-anchor',
      type: 'presence-anchor',
      title: "The Warrior's Breath",
      content: {
        gesture: "Place your right hand over your heart, left hand on your belly. Feel both rise and fall.",
        meaning: "Prepared and present",
        breathCycles: 5,
        exhalePrompts: [
          "I expect difficulty...",
          "I choose my response...",
          "I am not surprised...",
          "I am not overwhelmed...",
          "I am prepared..."
        ],
        anchorMessage: "Tomorrow morning, before you touch your phone, touch your heart. Remember this feeling.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Your alarm goes off. Before your eyes even focus, your hand reaches for the phone. Notifications. Messages. News. Someone else's emergency. Someone else's opinion.\n\nBy the time you're out the door, the day is already controlling you. And you never got to choose.",
      subtext: "Most people live their entire lives in reaction mode. Today, you learn the alternative.",
      continueLabel: "Show me how",
      mood: 'hope',
      nextStepId: 'scenario-2',
    },
    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "Marcus Aurelius — the most powerful man in the ancient world — began every single morning the same way. Before the generals. Before the politics. Before the crises.\n\nHe sat with himself and prepared for what was coming. Not with hope. With honesty.",
      bridgeQuestion: "What if 2 minutes could change your entire day?",
      continueLabel: "I'm in",
      mood: 'curiosity',
      nextStepId: 'ambush-check',
    },
    {
      id: 'ambush-check',
      type: 'resonanceCheck',
      prompt: "What usually ambushes your day?",
      instruction: "Tap the ones that hit home",
      options: [
        { id: 'emails', text: 'Stressful emails or messages' },
        { id: 'coworker', text: 'A difficult coworker or boss' },
        { id: 'commute', text: 'Traffic or commute chaos' },
        { id: 'todos', text: 'Overwhelming to-do list' },
        { id: 'family', text: 'Family tensions' },
        { id: 'social', text: 'Social media comparison' },
        { id: 'unexpected', text: 'Unexpected problems that derail everything' },
        { id: 'self-talk', text: 'My own negative self-talk' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'day-ambush',
      nextStepId: 'ambush-scale',
    },
    {
      id: 'ambush-scale',
      type: 'scaleRating',
      prompt: "How often do you feel like your day controls you instead of the other way around?",
      lowLabel: 'Rarely',
      highLabel: 'Almost every day',
      steps: 5,
      storeAs: 'reactivity-level',
      responsesByRange: {
        low: "You already have some control. This practice will sharpen it even further.",
        mid: "Some days you lead, some days you follow. Let's tip the balance in your favor.",
        high: "You've been living in someone else's script. Today you start writing your own.",
      },
      nextStepId: 'core-insight',
    },
    {
      id: 'core-insight',
      type: 'insight',
      text: "Marcus Aurelius wrote: 'Begin each day by telling yourself: Today I will meet with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness.'\n\nThis isn't pessimism. It's preparation. A warrior who expects the ambush is calm when it comes.",
      source: 'Marcus Aurelius',
      sourceBook: 'Meditations',
      style: 'principle',
      followUp: "By naming what might go wrong, you take away its power to surprise you. Now you have a choice: when that thing happens, how do you WANT to respond?",
      nextStepId: 'response-choice',
    },
    {
      id: 'response-choice',
      type: 'choice',
      instruction: 'Choose your stance',
      question: 'When this happens today, how do you want to show up?',
      options: [
        { id: 'calm', label: "Calm and centered — I won't let it rattle me", nextStepId: 'calm-path', storeAs: 'morningStance' },
        { id: 'curious', label: "Curious and open — I'll look for what I can learn", nextStepId: 'curious-path', storeAs: 'morningStance' },
        { id: 'compassionate', label: 'Compassionate — to others and myself', nextStepId: 'compassion-path', storeAs: 'morningStance' },
        { id: 'prepared', label: "Prepared and proactive — I expected this, I'm ready", nextStepId: 'prepared-path', storeAs: 'morningStance' },
      ],
    },
    {
      id: 'calm-path',
      type: 'affirmation',
      preText: "You named the ambush. You chose stillness.",
      statement: "Today, when life tests me, I choose to respond with calm, not reaction.",
      confirmLabel: "I am ready for today",
      style: 'commitment',
      nextStepId: 'warrior-tapflow',
    },
    {
      id: 'curious-path',
      type: 'affirmation',
      preText: "You named the ambush. You chose curiosity.",
      statement: "Today, when life tests me, I choose to ask 'what can I learn?' instead of 'why me?'",
      confirmLabel: "I am ready for today",
      style: 'commitment',
      nextStepId: 'warrior-tapflow',
    },
    {
      id: 'compassion-path',
      type: 'affirmation',
      preText: "You named the ambush. You chose compassion.",
      statement: "Today, when life tests me, I choose to meet difficulty with kindness — for others and for myself.",
      confirmLabel: "I am ready for today",
      style: 'commitment',
      nextStepId: 'warrior-tapflow',
    },
    {
      id: 'prepared-path',
      type: 'affirmation',
      preText: "You named the ambush. You chose readiness.",
      statement: "Today, nothing will surprise me. I expected the difficulty. I am prepared.",
      confirmLabel: "I am ready for today",
      style: 'commitment',
      nextStepId: 'warrior-tapflow',
    },
    {
      id: 'warrior-tapflow',
      type: 'tapFlow',
      title: "The Warrior's Morning",
      instructions: [
        'You just did what Marcus Aurelius did every morning.',
        'You anticipated the challenge.',
        'You chose your response in advance.',
        "When it arrives — and it will — you won't be blindsided.",
        'Because a warrior who expects the ambush is calm when it comes.',
        'You are no longer reactive.',
        'You are no longer surprised.',
        'You are prepared. You are intentional. You are ready.',
      ],
      closingText: "This takes 2 minutes. It changes your entire day.",
      style: 'grounding',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "When that challenge arises today, how do you want to show up? What response would make you proud?",
      minimumWords: 5,
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },
    {
      id: 'closing-insight',
      type: 'insight',
      text: "This is called 'premeditatio malorum' — the premeditation of adversity. The Stoics practiced it every morning for 2,000 years.\n\nTim Ferriss, Ryan Holiday, and every modern Stoic practitioner start their day this way. In 2 minutes, you've given yourself an edge most people never find.",
      source: 'Seneca & Marcus Aurelius',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just rehearsed your day before it happened. Athletes visualize. Performers rehearse. Now you do too. The challenge will come — but you'll be ready.",
        ],
        byChoice: {
          calm: [
            "You chose calm. In a world that rewards panic, that's a radical act. When the chaos hits today, take one breath before responding. That one breath is the difference between reacting and choosing.",
          ],
          curious: [
            "You chose curiosity over frustration. That's a superpower. When the difficulty arrives today, your first thought won't be 'why me?' It will be 'what can I learn from this?'",
          ],
          compassionate: [
            "You chose compassion — for others and yourself. That's the hardest choice, and the most powerful. When someone tests your patience today, remember: they're fighting their own battles too.",
          ],
          prepared: [
            "You chose to be the warrior. Nothing will blindside you today because you've already seen it coming. Marcus Aurelius ran the entire Roman Empire with this exact practice.",
          ],
        },
      },
    },
  ] as LessonStep[],
};


// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: THE GRATITUDE SHIFT (Negative Visualization)
// ─────────────────────────────────────────────────────────────────────────────

const lesson5_GratitudeShift: FlexibleLesson = {
  id: 'modern-5-gratitude-shift',
  slug: 'gratitude-shift',
  order: 5,
  title: 'The Gratitude Shift',
  subtitle: 'A counterintuitive path to appreciation',
  description: 'Use imagination to unlock genuine gratitude.',
  coreConceptTag: 'gratitude',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '✨', color: '#8b5cf6' },
  teaserText: "Tomorrow you'll discover the counterintuitive technique that makes gratitude feel real instead of forced.",
  exercises: [
    {
      id: 'ex-5-truth-mirror',
      type: 'truth-mirror',
      title: 'The Invisible Gifts',
      content: {
        statements: [
          "I've stopped noticing what I have.",
          "I'm chasing what I don't have.",
          "Someone I love could be gone tomorrow.",
          "My body works miracles I ignore.",
          "I have comforts my ancestors dreamed of.",
          "I take people for granted who take nothing from me.",
          "Everything I have is borrowed.",
          "This ordinary moment is actually extraordinary."
        ],
        holdReveal: "What you have is not permanent. See it before it's gone.",
        breathPrompts: [
          "I see it...",
          "I feel it...",
          "I'm grateful..."
        ],
        style: 'gratitude'
      }
    },
    {
      id: 'ex-5-soul-compass',
      type: 'soul-compass',
      title: 'What Have You Stopped Seeing?',
      content: {
        centralQuestion: "What gift in your life has become invisible?",
        options: [
          { id: 'person', emoji: '👤', text: 'Someone who loves me' },
          { id: 'home', emoji: '🏠', text: 'A safe place to live' },
          { id: 'body', emoji: '💪', text: 'A body that works' },
          { id: 'mind', emoji: '🧠', text: 'A mind that thinks' },
          { id: 'time', emoji: '🌅', text: 'Time I still have' },
          { id: 'food', emoji: '🍽️', text: 'Food I take for granted' }
        ],
        showIntensity: true,
        intensityQuestion: "How invisible has this become?",
        intensityLabels: { low: 'I notice it sometimes', high: 'Completely invisible' },
        intensityResponses: {
          low: "Good - you still see it. Don't let it fade further.",
          mid: "It's fading. Today, you brought it back into focus.",
          high: "It vanished from view. Now imagine it gone forever. Feel that? That's gratitude."
        },
        style: 'awakening'
      }
    },
    {
      id: 'ex-5-presence-anchor',
      type: 'presence-anchor',
      title: 'The Heart Hold',
      content: {
        gesture: "Place both hands over your heart, one on top of the other. Press gently. Feel your heartbeat.",
        meaning: "This gift I didn't earn",
        breathCycles: 4,
        exhalePrompts: [
          "For this heartbeat I didn't earn...",
          "For this breath I didn't request...",
          "For this moment I can't keep...",
          "For this life I didn't deserve..."
        ],
        anchorMessage: "Your heart beats without asking. That alone is miracle enough.",
        style: 'gratitude'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "You've heard it a thousand times. 'Be grateful.' 'Count your blessings.' 'Think positive.'\n\nAnd you've tried. You've written the gratitude journal. Listed three things. Felt... nothing. Because forced gratitude is hollow. Your brain knows when you're faking it.",
      subtext: "But what if there was a backdoor? A way to feel genuine, overwhelming appreciation — without pretending?",
      continueLabel: "Show me",
      mood: 'curiosity',
      nextStepId: 'loss-tapflow',
    },
    {
      id: 'loss-tapflow',
      type: 'tapFlow',
      title: 'The Temporary Gift',
      instructions: [
        'Think of someone you love. See their face clearly.',
        'Their laugh. The way they look at you. The small things they do.',
        'Now imagine: what if they were gone tomorrow?',
        'Not someday. Tomorrow.',
        'Feel the weight of that absence. The empty chair. The silence where their voice used to be.',
        "The conversations you'd never have. The moments that would never happen.",
        'Sit with that feeling for a moment...',
        "Now come back. They're still here. Right now, in this world, they exist.",
        "They were always a temporary gift. As are you. As is everything.",
      ],
      closingText: "Everything you love is borrowed, not owned.",
      style: 'grateful',
      nextStepId: 'taken-for-granted',
    },
    {
      id: 'taken-for-granted',
      type: 'resonanceCheck',
      prompt: "What have you been taking for granted?",
      instruction: "Tap the ones that hit home",
      options: [
        { id: 'health', text: 'My health or physical ability' },
        { id: 'person', text: 'Someone who loves me' },
        { id: 'safety', text: 'Safety and a roof over my head' },
        { id: 'senses', text: 'My senses — sight, hearing, taste' },
        { id: 'freedom', text: 'Freedom to choose my own path' },
        { id: 'today', text: 'The fact that I woke up today' },
        { id: 'access', text: 'Access to food, water, warmth' },
        { id: 'moments', text: 'Small moments that make life beautiful' },
      ],
      minSelections: 1,
      maxSelections: 4,
      storeAs: 'taken-for-granted',
      nextStepId: 'gratitude-scale',
    },
    {
      id: 'gratitude-scale',
      type: 'scaleRating',
      prompt: "Right now, in this moment — how grateful do you feel?",
      lowLabel: 'Not much',
      highLabel: 'Deeply grateful',
      steps: 5,
      storeAs: 'gratitude-level',
      responsesByRange: {
        low: "Honest. Gratitude isn't always easy to feel. But you just named what matters — that's the first crack in the armor.",
        mid: "You feel it stirring. That's the shift beginning. From thinking about gratitude to actually feeling it.",
        high: "That warmth you feel? That's what happens when you stop chasing more and see what's already here.",
      },
      nextStepId: 'core-insight',
    },
    {
      id: 'core-insight',
      type: 'insight',
      text: "This is called 'negative visualization' — imagining loss to unlock appreciation. It's not morbid. It's the fastest path to genuine gratitude.\n\nYou don't have to pretend. You just have to remember that everything is temporary.",
      source: 'William B. Irvine',
      sourceBook: 'A Guide to the Good Life',
      style: 'principle',
      followUp: "The Stoics practiced this daily. Not to live in fear, but to live in appreciation.",
      nextStepId: 'gratitude-choice',
    },
    {
      id: 'gratitude-choice',
      type: 'choice',
      instruction: 'What feels right for you?',
      question: 'How do you want to carry this feeling forward?',
      options: [
        {
          id: 'person',
          label: "Tell someone I appreciate them — today",
          subtext: "Turn this feeling into action",
          nextStepId: 'action-affirmation',
          storeAs: 'gratitudeAction',
        },
        {
          id: 'presence',
          label: "Just hold this feeling a little longer",
          subtext: "Let the appreciation sink deeper",
          nextStepId: 'presence-tapflow',
          storeAs: 'gratitudeAction',
        },
      ],
    },
    // ACTION BRANCH
    {
      id: 'action-affirmation',
      type: 'affirmation',
      preText: "You didn't just feel gratitude. You chose to share it.",
      statement: "Today, I will tell someone what they mean to me. Not because I have to. Because I finally see.",
      subtext: "Gratitude expressed is gratitude multiplied.",
      confirmLabel: "I will tell them today",
      style: 'gratitude',
      nextStepId: 'action-tapflow',
    },
    {
      id: 'action-tapflow',
      type: 'tapFlow',
      title: 'The Ripple',
      instructions: [
        'Think of the person you want to tell.',
        "See their face when they hear your words.",
        "You'll probably feel awkward saying it. That's normal.",
        "But the awkwardness lasts seconds. The impact lasts years.",
        "People remember who saw them. Who appreciated them.",
        "Today, you become that person for someone else.",
        "Not because a lesson told you to. Because you felt it.",
      ],
      style: 'grateful',
      nextStepId: 'reflection',
    },
    // PRESENCE BRANCH
    {
      id: 'presence-tapflow',
      type: 'tapFlow',
      title: 'The Deepening',
      instructions: [
        'Close your eyes for a moment.',
        'Feel gratitude — not in your head, but in your chest.',
        "Let it spread. The warmth. The softness.",
        'Think of what you named. The thing you almost lost sight of.',
        "It's still here. Right now. In this moment.",
        "You didn't create this gratitude. You uncovered it.",
        "By imagining loss, you found what was already there.",
        "Carry this with you. Not as a thought. As a feeling.",
      ],
      closingText: "From scarcity to abundance — in one shift of perspective.",
      style: 'grateful',
      nextStepId: 'reflection',
    },
    // CONVERGE
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "What do you have right now that you've been taking for granted? What would you miss terribly if it were gone?",
      minimumWords: 5,
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },
    {
      id: 'closing-insight',
      type: 'insight',
      text: "Seneca wrote: 'It is not the man who has too little, but the man who craves more, that is poor.'\n\nYou just became rich — not by gaining anything, but by seeing what you already have. That shift from scarcity to abundance is available to you every single day. All it takes is remembering: everything is borrowed.",
      source: 'Seneca',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You didn't write a gratitude list. You didn't force yourself to feel thankful. You imagined loss — and appreciation appeared on its own. That's the Stoic secret: you don't create gratitude. You uncover it by remembering that everything is temporary.",
        ],
        byChoice: {
          person: [
            "You chose to turn feeling into action. When you tell that person what they mean to you today, you'll feel the gratitude double. Do it today. Don't let the moment pass.",
          ],
          presence: [
            "You chose to sit with the feeling. To let it deepen instead of rushing to the next thing. That takes wisdom. The appreciation you felt today — it's available anytime. Just remember: everything is borrowed.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 1: FOUNDATIONS
// ─────────────────────────────────────────────────────────────────────────────

const chapter1_Foundations_EN: FlexibleChapter = {
  id: 'chapter-modern-foundations',
  slug: 'foundations',
  name: 'Foundations',
  subtitle: 'The essentials that change everything',
  description: 'Five practices that form the bedrock of a resilient mind. Master these, and everything else becomes easier.',
  order: 1,
  iconName: 'Zap',
  lessons: [
    lesson1_InstantReframe,
    lesson2_PowerOfTiny,
    lesson3_ObstacleOpportunity,
    lesson4_MorningMindset,
    lesson5_GratitudeShift,
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// WORLD 1: MODERN FOUNDATIONS
// ─────────────────────────────────────────────────────────────────────────────

const MODERN_WISDOM_WORLD_BY_LOCALE: Record<Locale, Pick<FlexibleWorld, 'name' | 'subtitle' | 'description'>> = {
  en: {
    name: 'Modern Wisdom',
    subtitle: 'Ancient philosophy, modern life',
    description: 'Fifteen transformative lessons based on the best modern books: Atomic Habits, The Obstacle Is the Way, Antifragile, and more. Build resilience, master relationships, and design an unshakeable foundation.',
  },
  fr: {
    name: 'Sagesse Moderne',
    subtitle: 'Philosophie ancienne, vie moderne',
    description: 'Quinze le\u00e7ons transformatrices inspir\u00e9es des meilleurs livres modernes : Un rien peut tout changer, L\u2019Obstacle est le chemin, Antifragile, et plus encore. B\u00e2tissez votre r\u00e9silience, ma\u00eetrisez vos relations et construisez une base in\u00e9branlable.',
  },
  ar: {
    name: '\u0627\u0644\u062d\u0643\u0645\u0629 \u0627\u0644\u062d\u062f\u064a\u062b\u0629',
    subtitle: '\u0641\u0644\u0633\u0641\u0629 \u0642\u062f\u064a\u0645\u0629\u060c \u062d\u064a\u0627\u0629 \u062d\u062f\u064a\u062b\u0629',
    description: '\u062e\u0645\u0633\u0629 \u0639\u0634\u0631 \u062f\u0631\u0633\u0627\u064b \u062a\u062d\u0648\u0644\u064a\u0627\u064b \u0645\u0633\u062a\u0646\u062f\u0629 \u0625\u0644\u0649 \u0623\u0641\u0636\u0644 \u0627\u0644\u0643\u062a\u0628 \u0627\u0644\u062d\u062f\u064a\u062b\u0629: \u0627\u0644\u0639\u0627\u062f\u0627\u062a \u0627\u0644\u0630\u0631\u064a\u0629\u060c \u0627\u0644\u0639\u0642\u0628\u0629 \u0647\u064a \u0627\u0644\u0637\u0631\u064a\u0642\u060c \u0636\u062f \u0627\u0644\u0647\u0634\u0627\u0634\u0629\u060c \u0648\u063a\u064a\u0631\u0647\u0627. \u0627\u0628\u0646\u0650 \u0627\u0644\u0645\u0631\u0648\u0646\u0629\u060c \u0623\u062a\u0642\u0646 \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062a\u060c \u0648\u0635\u0645\u0651\u0645 \u0623\u0633\u0627\u0633\u0627\u064b \u0644\u0627 \u064a\u062a\u0632\u0639\u0632\u0639.',
  },
};

// FR/AR translations: metadata is localized, lesson steps use EN (engagement flow content is language-independent for now)
const lesson1_FR: FlexibleLesson = { ...lesson1_InstantReframe, title: 'Le poids que tu portes', subtitle: 'D\u00e9couvre la question qui te lib\u00e8re', description: 'Une seule question a lib\u00e9r\u00e9 empereurs et prisonniers. Aujourd\u2019hui, elle te lib\u00e8re.', teaserText: "Demain, tu d\u00e9couvriras l'unique question qui lib\u00e8re empereurs et prisonniers depuis 2000 ans." };
const lesson2_FR: FlexibleLesson = { ...lesson2_PowerOfTiny, title: 'Le pouvoir du minuscule', subtitle: 'Pourquoi 1% vaut mieux que 100%', description: 'D\u00e9couvre pourquoi les plus petites actions cr\u00e9ent les plus grands changements.', teaserText: "Demain, tu apprendras la r\u00e8gle des 2 minutes qui rend les habitudes impossibles \u00e0 rater." };
const lesson3_FR: FlexibleLesson = { ...lesson3_ObstacleOpportunity, title: 'Le cadeau cach\u00e9', subtitle: 'Trouver l\u2019opportunit\u00e9 dans chaque obstacle', description: 'Apprends \u00e0 voir tes probl\u00e8mes comme du carburant pour grandir.', teaserText: "Demain, tu apprendras le secret ancien qui transforme chaque obstacle en ton plus grand avantage." };
const lesson4_FR: FlexibleLesson = { ...lesson4_MorningMindset, title: 'Ma\u00eetrise ton matin', subtitle: 'Lance la journ\u00e9e avant qu\u2019elle ne te lance', description: 'Une pratique de 2 minutes qui change la journ\u00e9e enti\u00e8re.', teaserText: "Demain, tu apprendras la pratique matinale de 2 minutes utilis\u00e9e par les empereurs romains et les PDG modernes." };
const lesson5_FR: FlexibleLesson = { ...lesson5_GratitudeShift, title: 'Le d\u00e9clic gratitude', subtitle: 'Un chemin contre-intuitif vers la reconnaissance', description: "Utilise ton imagination pour d\u00e9bloquer une gratitude authentique.", teaserText: "Demain, tu d\u00e9couvriras la technique contre-intuitive qui rend la gratitude r\u00e9elle plut\u00f4t que forc\u00e9e." };

const lesson1_AR: FlexibleLesson = { ...lesson1_InstantReframe, title: '\u0627\u0644\u062b\u0642\u0644 \u0627\u0644\u0630\u064a \u062a\u062d\u0645\u0644\u0647', subtitle: '\u0627\u0643\u062a\u0634\u0641 \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0630\u064a \u064a\u062d\u0631\u0631\u0643', description: '\u0633\u0624\u0627\u0644 \u0648\u0627\u062d\u062f \u062d\u0631\u0651\u0631 \u0623\u0628\u0627\u0637\u0631\u0629 \u0648\u0633\u062c\u0646\u0627\u0621. \u0627\u0644\u064a\u0648\u0645\u060c \u064a\u062d\u0631\u0631\u0643 \u0623\u0646\u062a.', teaserText: '\u063a\u062f\u0627\u064b \u0633\u062a\u0643\u062a\u0634\u0641 \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0648\u062d\u064a\u062f \u0627\u0644\u0630\u064a \u062d\u0631\u0651\u0631 \u0627\u0644\u0623\u0628\u0627\u0637\u0631\u0629 \u0648\u0627\u0644\u0633\u062c\u0646\u0627\u0621 \u0645\u0646\u0630 2000 \u0639\u0627\u0645.' };
const lesson2_AR: FlexibleLesson = { ...lesson2_PowerOfTiny, title: '\u0642\u0648\u0629 \u0627\u0644\u0635\u063a\u064a\u0631', subtitle: '\u0644\u0645\u0627\u0630\u0627 1% \u0623\u0641\u0636\u0644 \u0645\u0646 100%', description: '\u0627\u0643\u062a\u0634\u0641 \u0644\u0645\u0627\u0630\u0627 \u0623\u0635\u063a\u0631 \u0627\u0644\u0623\u0641\u0639\u0627\u0644 \u062a\u0635\u0646\u0639 \u0623\u0643\u0628\u0631 \u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a.' };
const lesson3_AR: FlexibleLesson = { ...lesson3_ObstacleOpportunity, title: '\u0627\u0644\u0647\u062f\u064a\u0629 \u0627\u0644\u0645\u062e\u0641\u064a\u0629', subtitle: '\u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0641\u0631\u0635\u0629 \u0641\u064a \u0643\u0644 \u0639\u0642\u0628\u0629', description: '\u062a\u0639\u0644\u0651\u0645 \u0623\u0646 \u062a\u0631\u0649 \u0645\u0634\u0627\u0643\u0644\u0643 \u0643\u0648\u0642\u0648\u062f \u0644\u0644\u0646\u0645\u0648.' };
const lesson4_AR: FlexibleLesson = { ...lesson4_MorningMindset, title: '\u0627\u0645\u062a\u0644\u0643 \u0635\u0628\u0627\u062d\u0643', subtitle: '\u0627\u0628\u062f\u0623 \u064a\u0648\u0645\u0643 \u0642\u0628\u0644 \u0623\u0646 \u064a\u0628\u062f\u0623\u0643', description: '\u0645\u0645\u0627\u0631\u0633\u0629 \u0645\u0646 \u062f\u0642\u064a\u0642\u062a\u064a\u0646 \u062a\u063a\u064a\u0651\u0631 \u064a\u0648\u0645\u0643 \u0628\u0627\u0644\u0643\u0627\u0645\u0644.' };
const lesson5_AR: FlexibleLesson = { ...lesson5_GratitudeShift, title: '\u062a\u062d\u0648\u0651\u0644 \u0627\u0644\u0627\u0645\u062a\u0646\u0627\u0646', subtitle: '\u0637\u0631\u064a\u0642 \u063a\u064a\u0631 \u0628\u062f\u064a\u0647\u064a \u0646\u062d\u0648 \u0627\u0644\u062a\u0642\u062f\u064a\u0631', description: '\u0627\u0633\u062a\u062e\u062f\u0645 \u062e\u064a\u0627\u0644\u0643 \u0644\u0625\u0637\u0644\u0627\u0642 \u0627\u0645\u062a\u0646\u0627\u0646 \u062d\u0642\u064a\u0642\u064a.' };

const chapter1_Foundations_FR: FlexibleChapter = {
  id: 'chapter-modern-foundations',
  slug: 'foundations',
  name: 'Fondations',
  subtitle: 'Les essentiels qui changent tout',
  description: 'Cinq pratiques qui forment le socle d\u2019un esprit r\u00e9silient. Ma\u00eetrise-les, et tout le reste devient plus facile.',
  order: 1,
  iconName: 'Zap',
  lessons: [lesson1_FR, lesson2_FR, lesson3_FR, lesson4_FR, lesson5_FR],
};

const chapter1_Foundations_AR: FlexibleChapter = {
  id: 'chapter-modern-foundations',
  slug: 'foundations',
  name: '\u0627\u0644\u0623\u0633\u0633',
  subtitle: '\u0627\u0644\u0623\u0633\u0627\u0633\u064a\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u063a\u064a\u0651\u0631 \u0643\u0644 \u0634\u064a\u0621',
  description: '\u062e\u0645\u0633 \u0645\u0645\u0627\u0631\u0633\u0627\u062a \u062a\u0634\u0643\u0651\u0644 \u0623\u0633\u0627\u0633 \u0630\u0647\u0646 \u0645\u0631\u0646. \u0623\u062a\u0642\u0646\u0647\u0627\u060c \u0648\u0633\u064a\u0635\u0628\u062d \u0643\u0644 \u0634\u064a\u0621 \u0622\u062e\u0631 \u0623\u0633\u0647\u0644.',
  order: 1,
  iconName: 'Zap',
  lessons: [lesson1_AR, lesson2_AR, lesson3_AR, lesson4_AR, lesson5_AR],
};

const CHAPTER1_FOUNDATIONS_BY_LOCALE: Record<Locale, FlexibleChapter> = {
  en: chapter1_Foundations_EN,
  fr: chapter1_Foundations_FR,
  ar: chapter1_Foundations_AR,
};

export const modernWisdomWorld: FlexibleWorld = {
  id: 'world-modern-wisdom',
  slug: 'modern-wisdom',
  name: MODERN_WISDOM_WORLD_BY_LOCALE.en.name,
  subtitle: MODERN_WISDOM_WORLD_BY_LOCALE.en.subtitle,
  description: MODERN_WISDOM_WORLD_BY_LOCALE.en.description,
  iconName: 'Sparkles',
  color: '#f59e0b',
  order: 1,
  isPremium: false,
  estimatedDays: 15,
  totalLessons: 15,
  chapters: [chapter1_Foundations_EN, chapter2_Resilience, chapter3_Relationships],
};

export function getModernWisdomWorld(locale: Locale): FlexibleWorld {
  const localized = MODERN_WISDOM_WORLD_BY_LOCALE[locale] || MODERN_WISDOM_WORLD_BY_LOCALE.en;
  const localizedChapter1 = CHAPTER1_FOUNDATIONS_BY_LOCALE[locale] || CHAPTER1_FOUNDATIONS_BY_LOCALE.en;
  return {
    ...modernWisdomWorld,
    name: localized.name,
    subtitle: localized.subtitle,
    description: localized.description,
    chapters: [localizedChapter1, chapter2_Resilience, chapter3_Relationships],
  };
}

export default modernWisdomWorld;
