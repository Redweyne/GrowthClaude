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
// LESSON 1: THE INSTANT REFRAME (Dichotomy of Control)
// Pattern: Scenario → Choice → Branch (Yes: Commit → Go Do It → Return → Reflect)
//                                      (No: Insight → Visualization → Reflect)
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
    // ═══════════════════════════════════════════════════════════════════════
    // OPENING - Deep emotional connection
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Right now, something is sitting in the back of your mind. It's been there for a while. Maybe it's a conversation you keep rehearsing. A wrong that was done to you. A decision you've been avoiding. A fear about the future that won't let go.",
      mood: 'tension',
      nextStepId: 'scenario-2', // Explicit navigation to prevent dead-ends
    },

    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "You can feel it right now, can't you? That familiar weight. The mental loop that plays when you're trying to fall asleep. The tension that lives in your shoulders, your chest, your jaw.",
      subtext: "This weight is real. And today, we're going to do something about it.",
      bridgeQuestion: "Are you ready to face it?",
      continueLabel: "Yes, I'm ready",
      mood: 'tension',
      nextStepId: 'name-burden', // Explicit navigation to prevent dead-ends
    },

    // ═══════════════════════════════════════════════════════════════════════
    // NAME THE BURDEN - Make it concrete
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'name-burden',
      type: 'commitment',
      prompt: "Name it. What's the thing that's been weighing on you? Don't filter it. Don't make it sound better than it is. Write exactly what's been eating at you.",
      placeholder: "The thing that's really bothering me is...",
      minimumWords: 8,
      guidanceHints: [
        'Be specific. "Work stress" becomes "My manager criticized me in front of everyone and I can\'t stop replaying it"',
        'Be honest. No one sees this but you.',
        'Let it out. This is the first step to letting it go.',
      ],
      continueLabel: "I've named it",
      storeAs: 'burden',
      nextStepId: 'feel-it',
    },

    // Pause to feel it
    {
      id: 'feel-it',
      type: 'timer',
      title: 'Feel the Weight',
      instruction: "Take 30 seconds to actually feel this burden. Don't analyze it. Don't try to fix it. Just notice where it lives in your body. Your shoulders? Your chest? Your stomach?",
      durationSeconds: 30,
      timerStyle: 'presence',
      guidanceMessages: [
        'Where do you feel it in your body?',
        'How long have you been carrying this?',
        'Just notice. Don\'t judge.',
      ],
      nextStepId: 'ancient-question',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // THE ANCIENT QUESTION - The turning point
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'ancient-question',
      type: 'insight',
      text: "For two thousand years, emperors and slaves have asked themselves one question to find peace. Marcus Aurelius asked it while ruling Rome. Epictetus asked it while in chains. James Stockdale asked it while being tortured as a prisoner of war. Today, you ask it about what you just named.",
      style: 'principle',
      followUp: "The question is simple. But answering it honestly changes everything.",
      nextStepId: 'the-choice',
    },

    // THE PIVOTAL CHOICE
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

    // ═══════════════════════════════════════════════════════════════════════
    // YES PATH - The Path of Action
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'action-validation',
      type: 'insight',
      text: "You have power here. Most people never realize that. They sit with their worries, replaying them endlessly, when the cure was always within reach. You saw differently. You saw an opening.",
      style: 'reframe',
      followUp: "Now comes the hardest part: actually doing something about it.",
      nextStepId: 'commit-action',
    },

    {
      id: 'commit-action',
      type: 'commitment',
      prompt: "What exactly will you do? Be specific. Not 'I'll talk to them' but 'I'll send the text that says...' Not 'I'll work on it' but 'I'll spend 5 minutes doing...'",
      placeholder: "In the next 5 minutes, I will specifically...",
      minimumWords: 8,
      guidanceHints: [
        'Make it so specific you can\'t misunderstand yourself',
        'Make it small enough to do NOW, not "later"',
        'The smaller the better. Done beats perfect.',
      ],
      continueLabel: "This is my commitment",
      storeAs: 'commitment',
      nextStepId: 'go-do-it',
    },

    {
      id: 'go-do-it',
      type: 'goDoIt',
      sageMessage: "This is the moment that separates those who change from those who only wish they did. Go now. Do exactly what you wrote. Not after you finish reading. Not when it feels right. NOW. Come back only when it's done. I'll be here.",
      sageSubtext: "Action is the antidote to anxiety. The cure to worry is movement.",
      dismissLabel: "I'm going now",
      returnStepId: 'return-check',
    },

    {
      id: 'return-check',
      type: 'returnConfirm',
      welcomeMessage: "You came back.",
      confirmationQuestion: "Did you do what you committed to?",
      completedOption: {
        label: "Yes — I did it",
        nextStepId: 'action-reflection',
      },
      didNotCompleteOption: {
        label: "No — I didn't do it",
        message: "Thank you for your honesty. Most people would lie to themselves right now. You didn't. That honesty is rare and valuable. Let's understand what happened — not to judge you, but to learn.",
        nextStepId: 'action-reflection-incomplete',
      },
    },

    // Reflection for completed action
    {
      id: 'action-reflection',
      type: 'reflection',
      prompt: "You did it. How do you feel now? What shifted in you the moment you took action? Be specific about the before and after.",
      minimumWords: 15,
      encouragements: [
        'What was harder than you expected?',
        'What was easier than you expected?',
        'How does this moment feel different from the one before you started?',
      ],
      nextStepId: 'reward',
    },

    // Reflection for incomplete action
    {
      id: 'action-reflection-incomplete',
      type: 'reflection',
      prompt: "What got in the way? Don't judge yourself — just observe. What voice talked you out of it? What did you tell yourself? Understanding this is more valuable than you think.",
      minimumWords: 15,
      encouragements: [
        'What story did your mind tell you?',
        'Was the fear before worse than the actual task would have been?',
        'What would you need to do differently next time?',
      ],
      nextStepId: 'reward',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // NO PATH - The Path of Acceptance
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'acceptance-validation',
      type: 'insight',
      text: "You just did something incredibly difficult: you told yourself the truth. This thing that's been torturing you — you cannot fix it through action. Most people spend months, years, entire lifetimes fighting battles they can never win. You stopped. Right here. Right now.",
      style: 'reframe',
      followUp: "This isn't defeat. This is wisdom. The question now is: can you actually let go?",
      nextStepId: 'acceptance-depth',
    },

    {
      id: 'acceptance-depth',
      type: 'scenario',
      narrative: "Letting go sounds simple. But your mind has become addicted to this worry. It returns to it like a tongue to a sore tooth. The same thoughts. The same anger. The same fear. Over and over.",
      subtext: "You've tried to stop thinking about it. That doesn't work. What works is something different.",
      bridgeQuestion: "Are you ready to try a different way?",
      continueLabel: "Show me",
      mood: 'hope',
      nextStepId: 'acceptance-visualization', // Explicit navigation for the acceptance path
    },

    {
      id: 'acceptance-visualization',
      type: 'visualization',
      title: 'The Release',
      instructions: [
        'Take three deep breaths. Slow and deliberate.',
        'Picture the thing you named. See it clearly in your mind.',
        'Notice how your body responds. The tightening. The resistance.',
        'Now imagine you\'re holding this burden in your cupped hands.',
        'Feel its weight. You\'ve been carrying this for so long.',
        'Now slowly... open your hands. Palm up. Fingers spread.',
        'Watch it lift. It was never yours to carry.',
        'It exists. But it doesn\'t need to live inside you.',
        'Take one more breath. Feel the space where the weight used to be.',
      ],
      paceSeconds: 4,
      style: 'grounding',
      nextStepId: 'acceptance-reflection',
    },

    {
      id: 'acceptance-reflection',
      type: 'reflection',
      prompt: "What shifted in you during that exercise? Even if it was small. Even if the worry came back immediately. What did it feel like, for that brief moment, to let go?",
      minimumWords: 15,
      encouragements: [
        'Don\'t judge whether you did it "right"',
        'What did you notice in your body?',
        'Is there still resistance? That\'s okay. Name it.',
      ],
      nextStepId: 'reward',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CLOSING - Both paths converge
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'closing-insight',
    },

    {
      id: 'closing-insight',
      type: 'insight',
      text: "What you just practiced is called the Dichotomy of Control. It's the foundation of Stoic philosophy, and it has guided leaders, survivors, and ordinary people for over two thousand years. One question: 'Is this within my control?' If yes, act. If no, accept. That's it. That's the entire philosophy.",
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
            "You didn't just think about your problem — you moved. That's rare. Most people are paralyzed by their worries. You proved you're not. Remember this feeling. This is who you're becoming: someone who acts.",
            "The philosopher William James said: 'Action seems to follow feeling, but really action and feeling go together.' You proved that today. You didn't wait to feel ready. You acted, and the feeling followed.",
          ],
          no: [
            "You practiced the hardest skill in philosophy: accepting what you cannot change without becoming passive about what you can. That takes wisdom most people never develop.",
            "The Stoics called this 'amor fati' — love of fate. Not just tolerating what you can't control, but making peace with it. You took the first step today. The burden you named? It hasn't disappeared. But you've started changing your relationship with it.",
          ],
        },
        byCompletion: {
          completed: [
            "You said you would, and you did. That's rare. Most people break promises to themselves so often they stop believing they're capable of change. You just proved otherwise. One kept promise at a time — that's how identity changes.",
          ],
          notCompleted: [
            "You came back and told the truth. That matters more than you know. The gap between intention and action? That's where growth lives. You saw the gap today. Tomorrow, you'll know what to expect. And you'll be ready.",
          ],
        },
      },
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGAGEMENT PATH - No writing, no long waits, still deeply personal
  // ═══════════════════════════════════════════════════════════════════════════
  engagementSteps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "Right now, something is sitting in the back of your mind. It's been there for a while. Maybe it's a conversation you keep rehearsing. A wrong that was done to you. A decision you've been avoiding. A fear about the future that won't let go.",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "You can feel it right now, can't you? That familiar weight. The mental loop that plays when you're trying to fall asleep. The tension that lives in your shoulders, your chest, your jaw.",
      subtext: "This weight is real. And today, we're going to do something about it.",
      bridgeQuestion: "Are you ready to face it?",
      continueLabel: "Yes, I'm ready",
      mood: 'tension',
      nextStepId: 'e-identify-burden',
    },
    {
      id: 'e-identify-burden',
      type: 'resonanceCheck',
      prompt: "What's been weighing on you?",
      instruction: "Tap everything that resonates",
      options: [
        { id: 'conversation', text: 'A conversation I keep replaying' },
        { id: 'decision', text: 'A decision I\'ve been avoiding' },
        { id: 'wronged', text: 'Someone who wronged me' },
        { id: 'future-fear', text: 'Fear about my future' },
        { id: 'regret', text: 'Something I said or did that I regret' },
        { id: 'responsibility', text: 'A responsibility that\'s crushing me' },
        { id: 'relationship', text: 'A relationship that\'s draining me' },
        { id: 'self-doubt', text: 'Constant self-doubt' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'burden-type',
      nextStepId: 'e-feel-weight',
    },
    {
      id: 'e-feel-weight',
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
      nextStepId: 'e-ancient-question',
    },
    {
      id: 'e-ancient-question',
      type: 'insight',
      text: "For two thousand years, emperors and slaves have asked themselves one question to find peace. Marcus Aurelius asked it while ruling Rome. Epictetus asked it while in chains. James Stockdale asked it while being tortured as a prisoner of war. Today, you ask it about what you just named.",
      style: 'principle',
      followUp: "The question is simple. But answering it honestly changes everything.",
      nextStepId: 'e-the-choice',
    },
    {
      id: 'e-the-choice',
      type: 'choice',
      instruction: 'Answer with ruthless honesty',
      question: 'Is there a concrete action you can take about this in the next 5 minutes?',
      options: [
        {
          id: 'yes',
          label: 'Yes — there is something I can do',
          subtext: 'A specific action I could take right now',
          nextStepId: 'e-action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: 'No — this is truly outside my control',
          subtext: 'I cannot change this through my own actions',
          nextStepId: 'e-acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    // YES PATH
    {
      id: 'e-action-validation',
      type: 'insight',
      text: "You have power here. Most people never realize that. They sit with their worries, replaying them endlessly, when the cure was always within reach. You saw differently. You saw an opening.",
      style: 'reframe',
      followUp: "Now comes the hardest part: actually doing something about it.",
      nextStepId: 'e-action-affirmation',
    },
    {
      id: 'e-action-affirmation',
      type: 'affirmation',
      preText: "You identified your burden. You saw that action is possible.",
      statement: "I will take one concrete step about this today. Not tomorrow. Today.",
      confirmLabel: "This is my commitment",
      style: 'commitment',
      nextStepId: 'e-action-tapflow',
    },
    {
      id: 'e-action-tapflow',
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
        'Today, you take one step. That\'s all that matters.',
      ],
      style: 'fearless',
      nextStepId: 'e-reward',
    },
    // NO PATH
    {
      id: 'e-acceptance-validation',
      type: 'insight',
      text: "You just did something incredibly difficult: you told yourself the truth. This thing that's been torturing you — you cannot fix it through action. Most people spend months, years, entire lifetimes fighting battles they can never win. You stopped. Right here. Right now.",
      style: 'reframe',
      followUp: "This isn't defeat. This is wisdom. The question now is: can you actually let go?",
      nextStepId: 'e-acceptance-tapflow',
    },
    {
      id: 'e-acceptance-tapflow',
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
      nextStepId: 'e-reward',
    },
    // CONVERGE
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "What you just practiced is called the Dichotomy of Control. It's the foundation of Stoic philosophy, and it has guided leaders, survivors, and ordinary people for over two thousand years. One question: 'Is this within my control?' If yes, act. If no, accept. That's it. That's the entire philosophy.",
      source: 'Epictetus',
      sourceBook: 'The Enchiridion',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "This question will change your life if you let it. Every worry, every stress, every sleepless night — ask yourself: 'Can I do something about this?' Then act or accept. That's where peace lives.",
        ],
        byChoice: {
          yes: [
            "You saw an opening where others see only walls. You committed to action — not in writing, but in your heart. That commitment is real. Honor it today.",
          ],
          no: [
            "You practiced the hardest skill in philosophy: accepting what you cannot change. Most people fight that battle forever. Today, you chose peace instead.",
          ],
        },
        byMode: {
          engagement: [
            "You didn't write today — but you showed up. You identified your burden, faced the ancient question, and made your choice. That's not less. That's enough. Come back tomorrow.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2: THE POWER OF TINY (Atomic Habits)
// Pattern: Scenario → Insight → Commitment → Timer → Reflection
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
      id: 'scenario',
      type: 'scenario',
      narrative: "You've tried to change before. Started strong. Then life happened. The gym membership went unused. The meditation app gathered dust. The journal stayed blank after day three.",
      subtext: "It's not your fault. You were playing the wrong game.",
      bridgeQuestion: "What if the problem was never your willpower?",
      continueLabel: "Tell me more",
      mood: 'hope',
    },
    {
      id: 'insight',
      type: 'insight',
      text: "We overestimate what we can do in a day and underestimate what we can do in a year. The secret isn't massive action - it's tiny action, repeated. 1% better every day means 37x better in a year.",
      source: 'James Clear',
      sourceBook: 'Atomic Habits',
      style: 'principle',
      nextStepId: 'tiny-commitment',
    },
    {
      id: 'tiny-commitment',
      type: 'commitment',
      prompt: "What's one thing you've been wanting to build? Now make it TINY. What's the 2-minute version?",
      placeholder: "Instead of 'work out for an hour', write 'do 2 pushups'. Instead of 'meditate', write 'take 3 breaths'.",
      minimumWords: 3,
      guidanceHints: [
        'Make it so small it feels almost silly',
        'If it takes more than 2 minutes, shrink it',
        'The goal is showing up, not performance',
      ],
      continueLabel: 'This is my tiny habit',
      nextStepId: 'do-it-now',
    },
    {
      id: 'do-it-now',
      type: 'timer',
      title: 'Do It Right Now',
      instruction: 'Take 60 seconds and do your tiny habit. Yes, right now.',
      durationSeconds: 60,
      timerStyle: 'countdown',
      guidanceMessages: [
        'This is how change begins.',
        'Small actions compound into big results.',
        'You\'re building a new identity.',
      ],
      allowStruggle: true,
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "How did it feel to do something tiny instead of planning something huge? Could you do this every single day?",
      minimumWords: 10,
      encouragements: [
        'Was it easier than you expected?',
        'What would change if you did this daily for a year?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just did something most people never do: you started small on purpose. James Clear calls this 'the 2-minute rule.' Make it so easy you can't say no. Then scale up from there.",
          "Every master was once a disaster. Every mountain was climbed one step at a time. You just took your first step. Tomorrow, take another. That's the whole secret.",
          "Habits form through repetition, not intensity. A tiny action done daily beats a heroic effort done once. You now know the path. Walk it.",
        ],
        byCompletion: {
          completed: [
            "You didn't just learn about tiny habits - you practiced one. That's the difference between knowing and doing. Come back tomorrow and do it again. That's how identity shifts.",
          ],
          notCompleted: [
            "Even struggling with the tiny version teaches you something. What got in the way? That's valuable data. Tomorrow, make it even tinier. Find the version you CAN'T fail at.",
          ],
        },
      },
    },
  ],

  engagementSteps: [
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "You've tried to change before. Started strong. Then life happened. The gym membership went unused. The meditation app gathered dust. The journal stayed blank after day three.",
      subtext: "It's not your fault. You were playing the wrong game.",
      bridgeQuestion: "What if the problem was never your willpower?",
      continueLabel: "Tell me more",
      mood: 'hope',
    },
    {
      id: 'e-insight',
      type: 'insight',
      text: "We overestimate what we can do in a day and underestimate what we can do in a year. The secret isn't massive action - it's tiny action, repeated. 1% better every day means 37x better in a year.",
      source: 'James Clear',
      sourceBook: 'Atomic Habits',
      style: 'principle',
      nextStepId: 'e-failed-habits',
    },
    {
      id: 'e-failed-habits',
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
      nextStepId: 'e-tiny-choice',
    },
    {
      id: 'e-tiny-choice',
      type: 'choice',
      instruction: 'Now shrink it to 2 minutes',
      question: 'Which tiny version could you actually do every single day?',
      options: [
        { id: 'pushups', label: '2 pushups instead of a workout', nextStepId: 'e-affirmation' },
        { id: 'paragraph', label: 'Read one paragraph, not a chapter', nextStepId: 'e-affirmation' },
        { id: 'breaths', label: '3 deep breaths instead of meditating', nextStepId: 'e-affirmation' },
        { id: 'shoes', label: 'Put on my shoes instead of running', nextStepId: 'e-affirmation' },
        { id: 'sentence', label: 'Write one sentence instead of journaling', nextStepId: 'e-affirmation' },
        { id: 'water', label: 'Drink one glass of water first thing', nextStepId: 'e-affirmation' },
      ],
    },
    {
      id: 'e-affirmation',
      type: 'affirmation',
      preText: "Not the perfect version. The possible version.",
      statement: "I will do the tiny version. Every day. Starting today.",
      confirmLabel: "This is my tiny habit",
      style: 'commitment',
      nextStepId: 'e-confidence',
    },
    {
      id: 'e-confidence',
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
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You identified what failed, chose the tiny version, and committed. That's more than most people ever do. James Clear says: 'Every action is a vote for who you wish to become.' You just cast your vote.",
        ],
        byMode: {
          engagement: [
            "You didn't just learn about tiny habits — you chose yours and committed to it. No writing needed. Your commitment is in the choice you made. Honor it today. Do the tiny thing. Then come back tomorrow.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: OBSTACLE AS OPPORTUNITY (The Obstacle Is the Way)
// Pattern: Scenario → Commitment (name obstacle) → Choice → Visualization → Reflection
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
      id: 'scenario',
      type: 'scenario',
      narrative: "There's something blocking your path right now. A rejection. A failure. A person who won't cooperate. A situation that feels impossibly stuck.",
      subtext: "What if this obstacle is exactly what you need?",
      continueLabel: "I'm listening",
      mood: 'curiosity',
    },
    {
      id: 'name-obstacle',
      type: 'commitment',
      prompt: "Name your obstacle. What's standing in your way right now?",
      placeholder: "My boss won't listen... I got rejected from... I keep failing at...",
      minimumWords: 3,
      guidanceHints: [
        'Be specific about what\'s blocking you',
        'Don\'t filter - name the real obstacle',
      ],
      continueLabel: 'This is my obstacle',
      storeAs: 'obstacle',
      nextStepId: 'flip-question',
    },
    {
      id: 'flip-question',
      type: 'choice',
      instruction: 'Consider this carefully',
      question: 'Could this obstacle be teaching you something you needed to learn?',
      options: [
        {
          id: 'maybe-yes',
          label: 'Maybe... I can see how it might',
          nextStepId: 'opportunity-insight',
        },
        {
          id: 'not-sure',
          label: 'I honestly don\'t see it',
          nextStepId: 'reframe-insight',
        },
      ],
    },
    {
      id: 'opportunity-insight',
      type: 'insight',
      text: "The impediment to action advances action. What stands in the way becomes the way. Every obstacle you face contains within it the seeds of an equal or greater opportunity.",
      source: 'Ryan Holiday',
      sourceBook: 'The Obstacle Is the Way',
      style: 'principle',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'reframe-insight',
      type: 'insight',
      text: "When we can't see the gift in an obstacle, it's usually because we're too close. But history is full of people who became who they were BECAUSE of their obstacles, not despite them. Let's zoom out.",
      style: 'reframe',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'opportunity-visualization',
      type: 'visualization',
      title: 'Finding the Gift',
      instructions: [
        'Picture your obstacle clearly.',
        'Now imagine you\'re 5 years in the future.',
        'This obstacle helped you become someone stronger.',
        'What did it teach you?',
        'What skill did you develop because of it?',
        'Who did you become by facing it?',
        'Hold that future version of yourself in your mind.',
      ],
      paceSeconds: 5,
      style: 'fearless',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "What opportunity might be hiding inside your obstacle? What could this be teaching you?",
      minimumWords: 15,
      encouragements: [
        'What strength could this build?',
        'How might this redirect you somewhere better?',
        'What story will you tell about overcoming this?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just did alchemy - turning lead into gold. The obstacle that seemed like a wall? You started seeing it as a door. This is how great people think. And now you know how too.",
          "Ryan Holiday wrote 'The Obstacle Is the Way' based on a single idea from Marcus Aurelius. That idea has guided leaders for 2000 years. Now it guides you.",
          "The obstacle is the way. Not around. Not over. Through. Every problem is a teacher in disguise. You're learning to read the lessons.",
        ],
      },
    },
  ],

  engagementSteps: [
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "There's something blocking your path right now. A rejection. A failure. A person who won't cooperate. A situation that feels impossibly stuck.",
      subtext: "What if this obstacle is exactly what you need?",
      continueLabel: "I'm listening",
      mood: 'curiosity',
    },
    {
      id: 'e-identify-obstacle',
      type: 'resonanceCheck',
      prompt: "What kind of obstacle are you facing?",
      instruction: "Tap what sounds most like you",
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
      nextStepId: 'e-flip-question',
    },
    {
      id: 'e-flip-question',
      type: 'choice',
      instruction: 'Consider this carefully',
      question: 'Could this obstacle be teaching you something you needed to learn?',
      options: [
        {
          id: 'maybe-yes',
          label: 'Maybe... I can see how it might',
          nextStepId: 'e-opportunity-insight',
        },
        {
          id: 'not-sure',
          label: "I honestly don't see it",
          nextStepId: 'e-reframe-insight',
        },
      ],
    },
    {
      id: 'e-opportunity-insight',
      type: 'insight',
      text: "The impediment to action advances action. What stands in the way becomes the way. Every obstacle you face contains within it the seeds of an equal or greater opportunity.",
      source: 'Ryan Holiday',
      sourceBook: 'The Obstacle Is the Way',
      style: 'principle',
      nextStepId: 'e-visualization',
    },
    {
      id: 'e-reframe-insight',
      type: 'insight',
      text: "When we can't see the gift in an obstacle, it's usually because we're too close. But history is full of people who became who they were BECAUSE of their obstacles, not despite them. Let's zoom out.",
      style: 'reframe',
      nextStepId: 'e-visualization',
    },
    {
      id: 'e-visualization',
      type: 'tapFlow',
      title: 'Finding the Gift',
      instructions: [
        'Picture your obstacle clearly.',
        "Now imagine you're 5 years in the future.",
        "You're looking back at this moment.",
        'This obstacle helped you become someone stronger.',
        'What did it teach you?',
        'What skill did you develop because of it?',
        'Who did you become by facing it?',
        'Hold that future version of yourself in your mind.',
      ],
      style: 'fearless',
      nextStepId: 'e-gift-check',
    },
    {
      id: 'e-gift-check',
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
      nextStepId: 'e-affirmation',
    },
    {
      id: 'e-affirmation',
      type: 'affirmation',
      statement: "This obstacle is not my enemy. It is my teacher.",
      confirmLabel: "I accept this lesson",
      style: 'strength',
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just did alchemy. You named your obstacle, visualized your future self overcoming it, and identified the gift hiding inside the pain. That's how great people think.",
        ],
        byMode: {
          engagement: [
            "The obstacle is the way. Not around. Not over. Through. You saw the gift in the struggle today. That shift in perspective — from victim to student — is worth more than any essay could capture.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: THE MORNING MINDSET (Own Your Morning)
// Pattern: Scenario → Timer (breathing) → Commitment → Insight → Reflection
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
      id: 'scenario',
      type: 'scenario',
      narrative: "Most people wake up and immediately react. Check the phone. Read the news. Get pulled into someone else's agenda. By the time they're out the door, the day is already controlling them.",
      subtext: "What if you could flip that?",
      continueLabel: "Show me how",
      mood: 'hope',
    },
    {
      id: 'breathing',
      type: 'timer',
      title: 'First: Arrive in Your Body',
      instruction: 'Before you do anything else, take 5 slow, deep breaths. Feel yourself arrive in this moment.',
      durationSeconds: 45,
      timerStyle: 'breathing',
      guidanceMessages: [
        'Inhale... hold... exhale slowly.',
        'This moment is yours.',
        'No one needs anything from you right now.',
      ],
      nextStepId: 'anticipate',
    },
    {
      id: 'anticipate',
      type: 'commitment',
      prompt: "Think about today. What's one thing that might frustrate, annoy, or stress you? Name it now - so it doesn't surprise you later.",
      placeholder: "That meeting with... The traffic on... That email I need to send...",
      minimumWords: 3,
      guidanceHints: [
        'What could go wrong?',
        'Who might be difficult?',
        'What are you dreading?',
      ],
      continueLabel: 'I see it coming',
      storeAs: 'anticipated-challenge',
      nextStepId: 'prep-insight',
    },
    {
      id: 'prep-insight',
      type: 'insight',
      text: "By naming what might go wrong, you've already taken away its power to surprise you. A warrior who expects battle is calm when it comes. You're not being negative - you're being prepared.",
      style: 'reframe',
      followUp: "Now you have a choice: when that thing happens, how do you WANT to respond?",
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "When that challenge arises today, how do you want to show up? What response would make you proud?",
      minimumWords: 10,
      encouragements: [
        'What would your calmest self do?',
        'How would you advise a friend in this situation?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "This is called 'premeditation' - the Stoics practiced it every morning for 2000 years. Marcus Aurelius wrote: 'Begin each day by telling yourself: Today I will meet with interference, ingratitude, insolence.' He ran the Roman Empire with this practice.",
          "You just rehearsed your day before it happened. Athletes visualize. Performers rehearse. Now you do too. The challenge will come - but you'll be ready.",
          "Tim Ferriss, Ryan Holiday, every modern Stoic practitioner - they all start their day like this. In 2 minutes, you've given yourself an edge most people never find.",
        ],
      },
    },
  ],

  engagementSteps: [
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "Most people wake up and immediately react. Check the phone. Read the news. Get pulled into someone else's agenda. By the time they're out the door, the day is already controlling them.",
      subtext: "What if you could flip that?",
      continueLabel: "Show me how",
      mood: 'hope',
    },
    {
      id: 'e-breathing',
      type: 'timer',
      title: 'Arrive in This Moment',
      instruction: 'Take 3 slow breaths. In through the nose, out through the mouth. Feel yourself arrive.',
      durationSeconds: 15,
      timerStyle: 'breathing',
      guidanceMessages: [
        'Inhale... hold... exhale.',
        'This moment is yours.',
        'No one needs anything from you right now.',
      ],
      nextStepId: 'e-ambush',
    },
    {
      id: 'e-ambush',
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
      nextStepId: 'e-prep-insight',
    },
    {
      id: 'e-prep-insight',
      type: 'insight',
      text: "By naming what might go wrong, you've already taken away its power to surprise you. A warrior who expects battle is calm when it comes. You're not being negative - you're being prepared.",
      style: 'reframe',
      followUp: "Now you have a choice: when that thing happens, how do you WANT to respond?",
      nextStepId: 'e-response-choice',
    },
    {
      id: 'e-response-choice',
      type: 'choice',
      instruction: 'Choose your stance',
      question: 'When this happens today, how do you want to show up?',
      options: [
        { id: 'calm', label: "Calm and centered — I won't let it rattle me", nextStepId: 'e-affirmation' },
        { id: 'curious', label: "Curious and open — I'll look for what I can learn", nextStepId: 'e-affirmation' },
        { id: 'compassionate', label: 'Compassionate — to others and myself', nextStepId: 'e-affirmation' },
        { id: 'prepared', label: "Prepared and proactive — I expected this, I'm ready", nextStepId: 'e-affirmation' },
      ],
    },
    {
      id: 'e-affirmation',
      type: 'affirmation',
      preText: "You named the ambush. You chose your response.",
      statement: "Today, when life tests me, I choose to respond with intention, not reaction.",
      confirmLabel: "I am ready for today",
      style: 'commitment',
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "Marcus Aurelius began every morning exactly like this — anticipating challenges and choosing his response. He ran the Roman Empire with this 2-minute practice. Now it's yours.",
        ],
        byMode: {
          engagement: [
            "You just rehearsed your day before it happened. Athletes visualize. Performers rehearse. Now you do too. The challenge will come — but for the first time, you'll be ready. Not because you wrote a plan, but because you chose who you want to be when it arrives.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: THE GRATITUDE SHIFT (Negative Visualization)
// Pattern: Visualization (loss) → Insight → Reflection → Timer (appreciation)
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
      id: 'scenario',
      type: 'scenario',
      narrative: "You've heard it a thousand times: 'Be grateful.' But forced gratitude feels hollow. You can't just decide to feel thankful. Or can you?",
      subtext: "The Stoics found a backdoor to genuine appreciation.",
      continueLabel: "Show me",
      mood: 'curiosity',
    },
    {
      id: 'loss-visualization',
      type: 'visualization',
      title: 'The Temporary Gift',
      instructions: [
        'Think of someone you love. See their face.',
        'Now imagine: what if they were gone tomorrow?',
        'Feel the weight of that absence.',
        'The conversations you\'d miss. The moments lost.',
        'Sit with that feeling for a moment.',
        'Now... open your eyes. They\'re still here.',
        'They were always a temporary gift. As are you.',
      ],
      paceSeconds: 5,
      style: 'grateful',
      nextStepId: 'gratitude-insight',
    },
    {
      id: 'gratitude-insight',
      type: 'insight',
      text: "This is 'negative visualization' - imagining loss to unlock appreciation. It's not morbid. It's the fastest path to genuine gratitude. You don't have to pretend. You just have to remember that everything is temporary.",
      source: 'William B. Irvine',
      sourceBook: 'A Guide to the Good Life',
      style: 'principle',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "What do you have right now that you've been taking for granted? What would you miss terribly if it were gone?",
      minimumWords: 15,
      encouragements: [
        'It could be a person, a place, an ability, a simple comfort.',
        'What\'s always been there that you barely notice?',
      ],
      nextStepId: 'appreciation-timer',
    },
    {
      id: 'appreciation-timer',
      type: 'timer',
      title: 'One Minute of Presence',
      instruction: 'Spend 60 seconds simply appreciating what you just named. Feel the gratitude - don\'t just think it.',
      durationSeconds: 60,
      timerStyle: 'presence',
      guidanceMessages: [
        'Let the appreciation fill you.',
        'This moment is a gift.',
        'Nothing lasts forever. That\'s what makes it precious.',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just practiced what the Stoics called 'premeditatio malorum' - meditation on adversity. It sounds dark, but it leads to light. Now you see what you have instead of what you lack.",
          "Gratitude isn't about toxic positivity. It's about clear seeing. You just saw clearly. The people and things in your life are temporary visitors. Treat them that way.",
          "Seneca wrote: 'It is not the man who has too little, but the man who craves more, that is poor.' You just became rich by seeing what you already have.",
        ],
      },
    },
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // ENGAGEMENT PATH: The Gratitude Shift (no writing, no long waits)
  // Flow: scenario → tapFlow (loss) → insight → resonanceCheck → scaleRating
  //       → timer (15s presence) → affirmation → reward → mentor
  // ═══════════════════════════════════════════════════════════════════════════
  engagementSteps: [
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "You've heard it a thousand times: 'Be grateful.' But forced gratitude feels hollow. You can't just decide to feel thankful. Or can you?",
      subtext: "The Stoics found a backdoor to genuine appreciation.",
      continueLabel: "Show me",
      mood: 'curiosity',
    },
    {
      id: 'e-loss-tapflow',
      type: 'tapFlow',
      title: 'The Temporary Gift',
      instructions: [
        'Think of someone you love. See their face.',
        'Now imagine: what if they were gone tomorrow?',
        'Feel the weight of that absence.',
        "The conversations you'd miss. The moments lost.",
        'Sit with that feeling for a moment.',
        "Now... open your eyes. They're still here.",
        "They were always a temporary gift. As are you.",
      ],
      closingText: "Everything you love is borrowed, not owned.",
      style: 'grateful',
      nextStepId: 'e-insight',
    },
    {
      id: 'e-insight',
      type: 'insight',
      text: "This is 'negative visualization' - imagining loss to unlock appreciation. It's not morbid. It's the fastest path to genuine gratitude. You don't have to pretend. You just have to remember that everything is temporary.",
      source: 'William B. Irvine',
      sourceBook: 'A Guide to the Good Life',
      style: 'principle',
      nextStepId: 'e-taken-for-granted',
    },
    {
      id: 'e-taken-for-granted',
      type: 'resonanceCheck',
      prompt: "What have you been taking for granted?",
      instruction: "Tap the ones that hit home",
      options: [
        { id: 'health', text: 'My health or physical ability', emoji: '🫀' },
        { id: 'person', text: 'Someone who loves me', emoji: '💛' },
        { id: 'safety', text: 'Safety and a roof over my head', emoji: '🏠' },
        { id: 'senses', text: 'My senses — sight, hearing, taste', emoji: '👁️' },
        { id: 'freedom', text: 'Freedom to choose my own path', emoji: '🦅' },
        { id: 'today', text: 'The fact that I woke up today', emoji: '☀️' },
        { id: 'access', text: 'Access to food, water, warmth', emoji: '🌊' },
        { id: 'moments', text: 'Small moments that make life beautiful', emoji: '✨' },
      ],
      minSelections: 1,
      maxSelections: 4,
      storeAs: 'taken-for-granted',
      nextStepId: 'e-gratitude-scale',
    },
    {
      id: 'e-gratitude-scale',
      type: 'scaleRating',
      prompt: "Right now, in this moment — how grateful do you feel?",
      lowLabel: "Not much",
      highLabel: "Deeply grateful",
      steps: 5,
      storeAs: 'gratitude-level',
      responsesByRange: {
        low: "Honest. Gratitude isn't always easy to feel. But you just named what matters — that's the first step.",
        mid: "You feel it stirring. That's the shift beginning. From thinking about gratitude to feeling it.",
        high: "That warmth you feel? That's what happens when you stop chasing more and see what's already here.",
      },
      nextStepId: 'e-presence-timer',
    },
    {
      id: 'e-presence-timer',
      type: 'timer',
      title: 'A Moment of Presence',
      instruction: 'Close your eyes. Feel gratitude for what you just named. Not in your head — in your chest.',
      durationSeconds: 15,
      timerStyle: 'presence',
      guidanceMessages: [
        'Let the appreciation fill you.',
        'This moment is a gift.',
      ],
      nextStepId: 'e-affirmation',
    },
    {
      id: 'e-affirmation',
      type: 'affirmation',
      preText: "You didn't force gratitude. You uncovered it.",
      statement: "I don't need more to be grateful. I need to see what I already have.",
      subtext: "From scarcity to abundance — in one shift.",
      confirmLabel: "I see it now",
      style: 'gratitude',
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "Seneca wrote: 'It is not the man who has too little, but the man who craves more, that is poor.' You just became rich by seeing what you already have.",
        ],
        byMode: {
          engagement: [
            "You didn't write a gratitude list. You didn't force yourself to feel thankful. You imagined loss — and appreciation appeared on its own. That's the Stoic secret: you don't create gratitude. You uncover it by remembering that everything is temporary. The people you love. The body you inhabit. This very day. All borrowed. All precious.",
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
    description: 'Quinze leçons transformatrices inspirées des meilleurs livres modernes : Un rien peut tout changer, L’Obstacle est le chemin, Antifragile, et plus encore. Bâtissez votre résilience, maîtrisez vos relations et construisez une base inébranlable.',
  },
  ar: {
    name: 'الحكمة الحديثة',
    subtitle: 'فلسفة قديمة، حياة حديثة',
    description: 'خمسة عشر درساً تحولياً مستندة إلى أفضل الكتب الحديثة: العادات الذرية، العقبة هي الطريق، ضد الهشاشة، وغيرها. ابنِ المرونة، أتقن العلاقات، وصمّم أساساً لا يتزعزع.',
  },
};


const lesson1_InstantReframe_FR: FlexibleLesson = {
  id: 'modern-1-instant-reframe',
  slug: 'instant-reframe',
  order: 1,
  title: 'Le poids que tu portes',
  subtitle: 'Découvre la question qui te libère',
  description: 'Une seule question a libéré empereurs et prisonniers. Aujourd’hui, elle te libère.',
  coreConceptTag: 'control',
  xpReward: 25,
  estimatedMinutes: 7,
  thumbnail: { icon: '⚖️', color: '#f59e0b' },
  teaserText: "Demain, tu découvriras l’unique question qui libère empereurs et prisonniers depuis 2000 ans.",
  exercises: [
    {
      id: 'ex-1-truth-mirror',
      type: 'truth-mirror',
      title: 'La séquence du lâcher-prise',
      content: {
        statements: [
          "Je pense encore à quelque chose que j'ai dit.",
          "Je m'inquiète de quelque chose que je ne peux pas changer.",
          "Je rejoue une conversation dans ma tête.",
          "J'essaie de contrôler l'opinion des autres sur moi.",
          "Je suis anxieux face à un futur que je ne peux pas prédire.",
          "Je garde de la colère pour quelque chose qui est terminé.",
          "J'attends que quelqu'un change alors qu'il ne changera pas.",
          "Je lutte contre une réalité que je dois accepter."
        ],
        holdReveal: "C'est le poids. Expire-le.",
        breathPrompts: ["Lâche prise...", "Libère...", "Accepte..."],
        style: 'release'
      }
    },
    {
      id: 'ex-1-soul-compass',
      type: 'soul-compass',
      title: 'Contrôler ou lâcher ?',
      content: {
        centralQuestion: "Pense à ce qui te pèse en ce moment. Qu'est-ce que tu ressens ?",
        options: [
          { id: 'action', emoji: '🎯', text: 'Je peux agir sur ça' },
          { id: 'accept', emoji: '🌊', text: 'Je dois accepter ça' },
          { id: 'unsure', emoji: '⚡', text: 'Je ne sais pas encore' },
          { id: 'circles', emoji: '💭', text: 'Je tourne en rond' },
          { id: 'angry', emoji: '🔥', text: 'Ça me met en colère' },
          { id: 'sad', emoji: '🌑', text: 'Ça me rend triste' }
        ],
        showIntensity: true,
        intensityQuestion: "À quel point ça pèse ?",
        intensityLabels: { low: 'Léger', high: 'Écrasant' },
        intensityResponses: {
          low: "Les fardeaux légers deviennent plus légers quand on les nomme.",
          mid: "Tu es au milieu. Ça demande du courage de l'admettre.",
          high: "Les poids lourds nécessitent des outils puissants. Tu es là. C'est la première étape."
        },
        style: 'introspective'
      }
    },
    {
      id: 'ex-1-presence-anchor',
      type: 'presence-anchor',
      title: 'Les paumes ouvertes',
      content: {
        gesture: "Ouvre tes mains, paumes vers le haut, doigts détendus. Sens l'air sur tes paumes.",
        meaning: "Lâcher ce que tu ne peux pas contrôler",
        breathCycles: 5,
        exhalePrompts: ["Ce que tu ne peux pas contrôler...", "Laisse-le reposer dans tes paumes...", "Tu n'es pas ton inquiétude...", "Ce moment suffit...", "La liberté, c'est lâcher prise..."],
        anchorMessage: "Chaque fois que tu ressens l'envie de contrôler, ouvre tes paumes. Ton corps s'en souviendra.",
        style: 'release'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "En ce moment, quelque chose te reste en tête. Cela fait un moment. Peut-être une conversation que tu répètes sans cesse. Un tort qu'on t'a fait. Une décision que tu évites. Une peur du futur qui ne te lâche pas.",
      mood: 'tension',
      nextStepId: 'scenario-2',
    },
    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "Tu le sens maintenant, n’est-ce pas ? Ce poids familier. La boucle mentale qui tourne quand tu essaies de t’endormir. La tension qui vit dans tes épaules, ta poitrine, ta mâchoire.",
      subtext: "Ce poids est réel. Et aujourd’hui, on va faire quelque chose.",
      bridgeQuestion: 'Es-tu prêt(e) à l’affronter ?',
      continueLabel: 'Oui, je suis prêt(e)',
      mood: 'tension',
      nextStepId: 'name-burden',
    },
    {
      id: 'name-burden',
      type: 'commitment',
      prompt: "Nomme-le. Qu’est-ce qui te pèse ? Ne filtre pas. Ne cherche pas à l’embellir. Écris exactement ce qui te ronge.",
      placeholder: "Ce qui me pèse vraiment, c’est...",
      minimumWords: 8,
      guidanceHints: [
        'Sois précis(e). "Stress au travail" devient "Mon/ma manager m’a critiqué(e) devant tout le monde et je n’arrive pas à arrêter d’y repenser"',
        'Sois honnête. Personne ne voit ça sauf toi.',
        'Laisse sortir. C’est la première étape pour le laisser partir.',
      ],
      continueLabel: "Je l’ai nommé",
      storeAs: 'burden',
      nextStepId: 'feel-it',
    },
    {
      id: 'feel-it',
      type: 'timer',
      title: 'Ressens le poids',
      instruction: "Prends 30 secondes pour ressentir réellement ce fardeau. Ne l’analyse pas. N’essaie pas de le corriger. Remarque simplement où il vit dans ton corps. Tes épaules ? Ta poitrine ? Ton ventre ?",
      durationSeconds: 30,
      timerStyle: 'presence',
      guidanceMessages: [
        'Où le ressens-tu dans ton corps ?',
        'Depuis combien de temps le portes-tu ?',
        'Observe simplement. Ne juge pas.',
      ],
      nextStepId: 'ancient-question',
    },
    {
      id: 'ancient-question',
      type: 'insight',
      text: "Depuis deux mille ans, empereurs et esclaves se posent une question pour trouver la paix. Marc Aurèle se la posait en gouvernant Rome. Épictète se la posait enchaîné. James Stockdale se la posait alors qu’il était torturé comme prisonnier de guerre. Aujourd’hui, tu te la poses à propos de ce que tu viens de nommer.",
      style: 'principle',
      followUp: 'La question est simple. Mais y répondre honnêtement change tout.',
      nextStepId: 'the-choice',
    },
    {
      id: 'the-choice',
      type: 'choice',
      instruction: 'Réponds avec une honnêteté implacable',
      question: 'Y a-t-il une action concrète que tu peux entreprendre dans les 5 prochaines minutes ?',
      options: [
        {
          id: 'yes',
          label: 'Oui — il y a quelque chose que je peux faire',
          subtext: 'Une action précise que je peux faire maintenant',
          nextStepId: 'action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: 'Non — c’est vraiment hors de mon contrôle',
          subtext: 'Je ne peux pas changer cela par mes propres actions',
          nextStepId: 'acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    {
      id: 'action-validation',
      type: 'insight',
      text: "Tu as du pouvoir ici. La plupart des gens ne le voient jamais. Ils restent assis avec leurs inquiétudes, les rejouant sans fin, alors que le remède était à portée de main. Tu as vu autrement. Tu as vu une ouverture.",
      style: 'reframe',
      followUp: 'Maintenant vient la partie la plus difficile : faire réellement quelque chose.',
      nextStepId: 'commit-action',
    },
    {
      id: 'commit-action',
      type: 'commitment',
      prompt: "Que vas-tu faire exactement ? Sois précis(e). Pas 'Je vais leur parler' mais 'Je vais envoyer le message qui dit...'. Pas 'Je vais travailler dessus' mais 'Je vais passer 5 minutes à...'.",
      placeholder: 'Dans les 5 prochaines minutes, je vais précisément...',
      minimumWords: 8,
      guidanceHints: [
        'Rends-le si précis que tu ne peux pas te tromper toi-même',
        'Rends-le assez petit pour le faire MAINTENANT, pas « plus tard »',
        'Plus petit, mieux c’est. Fait vaut mieux que parfait.',
      ],
      continueLabel: 'C’est mon engagement',
      storeAs: 'commitment',
      nextStepId: 'go-do-it',
    },
    {
      id: 'go-do-it',
      type: 'goDoIt',
      sageMessage: "C’est le moment qui sépare ceux qui changent de ceux qui ne font que le souhaiter. Va maintenant. Fais exactement ce que tu as écrit. Pas après avoir fini de lire. Pas quand tu te sentiras prêt(e). MAINTENANT. Reviens seulement quand c’est fait. Je serai là.",
      sageSubtext: "L’action est l’antidote à l’anxiété. Le remède à l’inquiétude, c’est le mouvement.",
      dismissLabel: "J’y vais",
      returnStepId: 'return-check',
    },
    {
      id: 'return-check',
      type: 'returnConfirm',
      welcomeMessage: 'Tu es revenu.',
      confirmationQuestion: 'As-tu fait ce à quoi tu t’étais engagé(e) ?',
      completedOption: {
        label: 'Oui — je l’ai fait',
        nextStepId: 'action-reflection',
      },
      didNotCompleteOption: {
        label: 'Non — je ne l’ai pas fait',
        message: "Merci pour ton honnêteté. La plupart des gens se mentiraient à eux-mêmes. Toi, non. Cette honnêteté est rare et précieuse. Comprenons ce qui s’est passé — pas pour te juger, mais pour apprendre.",
        nextStepId: 'action-reflection-incomplete',
      },
    },
    {
      id: 'action-reflection',
      type: 'reflection',
      prompt: "Tu l’as fait. Comment te sens-tu maintenant ? Qu’est-ce qui a changé en toi au moment où tu as agi ? Sois précis(e) sur l’avant et l’après.",
      minimumWords: 15,
      encouragements: [
        'Qu’est-ce qui était plus difficile que tu ne le pensais ?',
        'Qu’est-ce qui était plus facile que tu ne le pensais ?',
        'En quoi ce moment est-il différent de celui d’avant ?'
      ],
      nextStepId: 'reward',
    },
    {
      id: 'action-reflection-incomplete',
      type: 'reflection',
      prompt: "Qu’est-ce qui t’a freiné(e) ? Ne te juge pas — observe simplement. Quelle voix t’a dissuadé(e) ? Que t’es-tu dit ? Comprendre cela est plus précieux que tu ne le penses.",
      minimumWords: 15,
      encouragements: [
        'Quelle histoire ton esprit t’a-t-il racontée ?',
        'La peur d’avant était-elle pire que la tâche elle-même ?',
        'Que ferais-tu différemment la prochaine fois ?'
      ],
      nextStepId: 'reward',
    },
    {
      id: 'acceptance-validation',
      type: 'insight',
      text: "Tu viens de faire quelque chose d’incroyablement difficile : te dire la vérité. Cette chose qui te tourmente — tu ne peux pas la corriger par l’action. La plupart des gens passent des mois, des années, des vies entières à combattre des batailles qu’ils ne peuvent jamais gagner. Tu t’es arrêté(e). Ici. Maintenant.",
      style: 'reframe',
      followUp: 'Ce n’est pas une défaite. C’est de la sagesse. La question maintenant est : peux-tu vraiment lâcher prise ?',
      nextStepId: 'acceptance-depth',
    },
    {
      id: 'acceptance-depth',
      type: 'scenario',
      narrative: "Lâcher prise semble simple. Mais ton esprit est devenu dépendant de cette inquiétude. Il y revient comme une langue sur une dent douloureuse. Les mêmes pensées. La même colère. La même peur. Encore et encore.",
      subtext: "Tu as essayé d’arrêter d’y penser. Ça ne marche pas. Ce qui marche, c’est autre chose.",
      bridgeQuestion: 'Es-tu prêt(e) à essayer une autre voie ?',
      continueLabel: 'Montre-moi',
      mood: 'hope',
      nextStepId: 'acceptance-visualization',
    },
    {
      id: 'acceptance-visualization',
      type: 'visualization',
      title: 'Le lâcher-prise',
      instructions: [
        'Prends trois respirations profondes. Lentes et délibérées.',
        'Visualise la chose que tu as nommée. Vois-la clairement.',
        'Remarque la réaction de ton corps. La crispation. La résistance.',
        'Maintenant, imagine que tu tiens ce fardeau dans tes mains en coupe.',
        'Sens son poids. Tu le portes depuis si longtemps.',
        'Maintenant lentement... ouvre tes mains. Paumes vers le haut. Doigts écartés.',
        'Regarde-le s’élever. Il n’a jamais été à toi.',
        'Il existe. Mais il n’a pas besoin de vivre en toi.',
        'Prends encore une respiration. Sens l’espace où le poids se trouvait.',
      ],
      paceSeconds: 4,
      style: 'grounding',
      nextStepId: 'acceptance-reflection',
    },
    {
      id: 'acceptance-reflection',
      type: 'reflection',
      prompt: "Qu’est-ce qui a bougé en toi pendant cet exercice ? Même si c’était infime. Même si l’inquiétude est revenue tout de suite. Qu’est-ce que ça faisait, pendant ce bref moment, de lâcher prise ?",
      minimumWords: 15,
      encouragements: [
        'Ne juge pas si tu l’as fait « correctement »',
        'Qu’as-tu remarqué dans ton corps ?',
        'Y a-t-il encore de la résistance ? C’est normal. Nomme-la.',
      ],
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
      text: "Ce que tu viens de pratiquer s’appelle la dichotomie du contrôle. C’est le fondement de la philosophie stoïcienne, et elle guide des leaders, des survivants et des gens ordinaires depuis plus de deux mille ans. Une question : « Est-ce sous mon contrôle ? » Si oui, agis. Si non, accepte. Voilà. Toute la philosophie.",
      source: 'Épictète',
      sourceBook: 'Manuel (Enchiridion)',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Cette question changera ta vie si tu la laisses faire. Chaque souci, chaque stress, chaque nuit blanche — demande-toi : « Puis-je faire quelque chose ? » Puis agis ou accepte. C’est là que vit la paix.",
        ],
        byChoice: {
          yes: [
            "Tu n’as pas seulement pensé à ton problème — tu as bougé. C’est rare. La plupart des gens sont paralysés par leurs soucis. Tu as prouvé que tu ne l’es pas. Souviens-toi de ce sentiment. C’est ce que tu deviens : quelqu’un qui agit.",
            "Le philosophe William James a dit : « L’action semble suivre le sentiment, mais en réalité action et sentiment vont ensemble. » Tu l’as prouvé aujourd’hui. Tu n’as pas attendu de te sentir prêt(e). Tu as agi, et le sentiment a suivi.",
          ],
          no: [
            "Tu as pratiqué la compétence la plus difficile en philosophie : accepter ce que tu ne peux pas changer sans devenir passif face à ce que tu peux. Cela demande une sagesse que la plupart ne développent jamais.",
            "Les Stoïciens appelaient cela « amor fati » — l’amour du destin. Pas seulement tolérer ce que tu ne contrôles pas, mais faire la paix avec cela. Tu as fait le premier pas aujourd’hui. Le fardeau que tu as nommé ? Il n’a pas disparu. Mais tu commences à changer ta relation avec lui.",
          ],
        },
        byCompletion: {
          completed: [
            "Tu as dit que tu le ferais, et tu l’as fait. C’est rare. La plupart des gens rompent leurs promesses envers eux-mêmes si souvent qu’ils cessent de croire qu’ils peuvent changer. Tu viens de prouver le contraire. Une promesse tenue à la fois — voilà comment l’identité change.",
          ],
          notCompleted: [
            "Tu es revenu(e) et tu as dit la vérité. C’est plus important que tu ne le penses. L’écart entre intention et action ? C’est là que la croissance se vit. Tu as vu l’écart aujourd’hui. Demain, tu sauras à quoi t’attendre. Et tu seras prêt(e).",
          ],
        },
      },
    },
  ],

  engagementSteps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "En ce moment, quelque chose te reste en tête. Cela fait un moment. Peut-être une conversation que tu répètes sans cesse. Un tort qu'on t'a fait. Une décision que tu évites. Une peur du futur qui ne te lâche pas.",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Tu le sens maintenant, n'est-ce pas ? Ce poids familier. La boucle mentale qui tourne quand tu essaies de t'endormir. La tension qui vit dans tes épaules, ta poitrine, ta mâchoire.",
      subtext: "Ce poids est réel. Et aujourd'hui, on va faire quelque chose.",
      bridgeQuestion: "Es-tu prêt(e) à l'affronter ?",
      continueLabel: 'Oui, je suis prêt(e)',
      mood: 'tension',
      nextStepId: 'e-identify-burden',
    },
    {
      id: 'e-identify-burden',
      type: 'resonanceCheck',
      prompt: "Qu'est-ce qui te pèse ?",
      instruction: 'Appuie sur tout ce qui résonne',
      options: [
        { id: 'conversation', text: 'Une conversation que je repasse en boucle' },
        { id: 'decision', text: "Une décision que j'évite" },
        { id: 'wronged', text: "Quelqu'un qui m'a fait du tort" },
        { id: 'future-fear', text: 'La peur de mon avenir' },
        { id: 'regret', text: "Quelque chose que j'ai dit ou fait et que je regrette" },
        { id: 'responsibility', text: "Une responsabilité qui m'écrase" },
        { id: 'relationship', text: "Une relation qui m'épuise" },
        { id: 'self-doubt', text: 'Un doute de soi constant' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'burden-type',
      nextStepId: 'e-feel-weight',
    },
    {
      id: 'e-feel-weight',
      type: 'scaleRating',
      prompt: 'À quel point ce poids est-il lourd maintenant ?',
      lowLabel: 'Un murmure',
      highLabel: 'Écrasant',
      steps: 5,
      storeAs: 'burden-weight',
      responsesByRange: {
        low: "Même les petits poids s'accumulent quand on les porte longtemps.",
        mid: 'Tu portes cela depuis plus longtemps que tu ne le penses.',
        high: "Pas étonnant que tu sois épuisé(e). Tu portais un rocher.",
      },
      nextStepId: 'e-ancient-question',
    },
    {
      id: 'e-ancient-question',
      type: 'insight',
      text: "Depuis deux mille ans, empereurs et esclaves se posent une question pour trouver la paix. Marc Aurèle se la posait en gouvernant Rome. Épictète se la posait enchaîné. James Stockdale se la posait alors qu'il était torturé comme prisonnier de guerre. Aujourd'hui, tu te la poses à propos de ce que tu viens de nommer.",
      style: 'principle',
      followUp: 'La question est simple. Mais y répondre honnêtement change tout.',
      nextStepId: 'e-the-choice',
    },
    {
      id: 'e-the-choice',
      type: 'choice',
      instruction: 'Réponds avec une honnêteté implacable',
      question: 'Y a-t-il une action concrète que tu peux entreprendre dans les 5 prochaines minutes ?',
      options: [
        {
          id: 'yes',
          label: 'Oui — il y a quelque chose que je peux faire',
          subtext: 'Une action précise que je peux faire maintenant',
          nextStepId: 'e-action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: "Non — c'est vraiment hors de mon contrôle",
          subtext: 'Je ne peux pas changer cela par mes propres actions',
          nextStepId: 'e-acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    // OUI PATH
    {
      id: 'e-action-validation',
      type: 'insight',
      text: "Tu as du pouvoir ici. La plupart des gens ne le voient jamais. Ils restent assis avec leurs inquiétudes, les rejouant sans fin, alors que le remède était à portée de main. Tu as vu autrement. Tu as vu une ouverture.",
      style: 'reframe',
      followUp: 'Maintenant vient la partie la plus difficile : faire réellement quelque chose.',
      nextStepId: 'e-action-affirmation',
    },
    {
      id: 'e-action-affirmation',
      type: 'affirmation',
      preText: "Tu as identifié ton fardeau. Tu as vu que l'action est possible.",
      statement: "Je vais faire un pas concret à ce sujet aujourd'hui. Pas demain. Aujourd'hui.",
      confirmLabel: "C'est mon engagement",
      style: 'commitment',
      nextStepId: 'e-action-tapflow',
    },
    {
      id: 'e-action-tapflow',
      type: 'tapFlow',
      title: "L'état d'esprit de l'action",
      instructions: [
        'Tu as identifié quelque chose sous ton contrôle.',
        "La plupart des gens n'arrivent jamais jusque-là.",
        'Ils restent bloqués dans leur tête, rejouant les mêmes inquiétudes.',
        "Mais toi, tu as vu une ouverture. Tu as choisi d'agir.",
        "L'action est l'antidote à l'anxiété.",
        'Au moment où tu bouges, le poids commence à se lever.',
        'Non pas parce que le problème disparaît...',
        "Mais parce que tu cesses d'en être la victime.",
        "Aujourd'hui, tu fais un pas. C'est tout ce qui compte.",
      ],
      style: 'fearless',
      nextStepId: 'e-reward',
    },
    // NON PATH
    {
      id: 'e-acceptance-validation',
      type: 'insight',
      text: "Tu viens de faire quelque chose d'incroyablement difficile : te dire la vérité. Cette chose qui te tourmente — tu ne peux pas la corriger par l'action. La plupart des gens passent des mois, des années, des vies entières à combattre des batailles qu'ils ne peuvent jamais gagner. Tu t'es arrêté(e). Ici. Maintenant.",
      style: 'reframe',
      followUp: "Ce n'est pas une défaite. C'est de la sagesse. La question maintenant est : peux-tu vraiment lâcher prise ?",
      nextStepId: 'e-acceptance-tapflow',
    },
    {
      id: 'e-acceptance-tapflow',
      type: 'tapFlow',
      title: 'Le lâcher-prise',
      instructions: [
        'Prends trois respirations profondes. Lentes et délibérées.',
        'Visualise la chose que tu as nommée. Vois-la clairement.',
        'Remarque la réaction de ton corps. La crispation. La résistance.',
        'Maintenant, imagine que tu tiens ce fardeau dans tes mains en coupe.',
        'Sens son poids. Tu le portes depuis si longtemps.',
        'Maintenant lentement... ouvre tes mains. Paumes vers le haut. Doigts écartés.',
        "Regarde-le s'élever. Il n'a jamais été à toi.",
        "Il existe. Mais il n'a pas besoin de vivre en toi.",
        "Prends encore une respiration. Sens l'espace où le poids se trouvait.",
      ],
      style: 'grounding',
      nextStepId: 'e-reward',
    },
    // CONVERGENCE
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "Ce que tu viens de pratiquer s'appelle la dichotomie du contrôle. C'est le fondement de la philosophie stoïcienne, et elle guide des leaders, des survivants et des gens ordinaires depuis plus de deux mille ans. Une question : « Est-ce sous mon contrôle ? » Si oui, agis. Si non, accepte. Voilà. Toute la philosophie.",
      source: 'Épictète',
      sourceBook: 'Manuel (Enchiridion)',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "Cette question changera ta vie si tu la laisses faire. Chaque souci, chaque stress, chaque nuit blanche — demande-toi : « Puis-je faire quelque chose ? » Puis agis ou accepte. C'est là que vit la paix.",
        ],
        byChoice: {
          yes: [
            "Tu as vu une ouverture où d'autres ne voient que des murs. Tu t'es engagé(e) à agir — pas par écrit, mais dans ton cœur. Cet engagement est réel. Honore-le aujourd'hui.",
          ],
          no: [
            "Tu as pratiqué la compétence la plus difficile en philosophie : accepter ce que tu ne peux pas changer. La plupart des gens combattent cette bataille pour toujours. Aujourd'hui, tu as choisi la paix.",
          ],
        },
        byMode: {
          engagement: [
            "Tu n'as pas écrit aujourd'hui — mais tu t'es présenté(e). Tu as identifié ton fardeau, affronté la question ancestrale et fait ton choix. Ce n'est pas moins. C'est suffisant. Reviens demain.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

const lesson1_InstantReframe_AR: FlexibleLesson = {
  id: 'modern-1-instant-reframe',
  slug: 'instant-reframe',
  order: 1,
  title: 'العبء الذي تحمله',
  subtitle: 'اكتشف السؤال الذي يحررك',
  description: 'سؤال واحد حرر أباطرة وسجناء. اليوم يحررك أنت.',
  coreConceptTag: 'control',
  xpReward: 25,
  estimatedMinutes: 7,
  thumbnail: { icon: '⚖️', color: '#f59e0b' },
  teaserText: 'غداً ستكتشف السؤال الوحيد الذي حرر الأباطرة والسجناء منذ 2000 عام.',
  exercises: [
    {
      id: 'ex-1-truth-mirror',
      type: 'truth-mirror',
      title: 'تسلسل التحرّر',
      content: {
        statements: [
          "ما زلت أفكر بشيء قلته.",
          "أقلق بشأن شيء لا أستطيع تغييره.",
          "أعيد محادثة في رأسي باستمرار.",
          "أحاول التحكم برأي شخص آخر فيّ.",
          "أشعر بالقلق من مستقبل لا أستطيع توقعه.",
          "أتمسك بغضب تجاه شيء انتهى.",
          "أنتظر أن يتغير شخص لن يتغير.",
          "أقاوم واقعاً أحتاج أن أتقبله."
        ],
        holdReveal: "هذا هو الثقل. تنفّسه للخارج.",
        breathPrompts: [
          "دعه يذهب...",
          "حرّره...",
          "تقبّل..."
        ],
        style: 'release'
      }
    },
    {
      id: 'ex-1-soul-compass',
      type: 'soul-compass',
      title: 'التحكم أم التحرّر؟',
      content: {
        centralQuestion: "فكّر فيما يثقل عليك الآن. كيف يبدو شعورك؟",
        options: [
          { id: 'action', emoji: '🎯', text: 'أستطيع اتخاذ إجراء' },
          { id: 'accept', emoji: '🌊', text: 'أحتاج أن أتقبل هذا' },
          { id: 'unsure', emoji: '⚡', text: 'لست متأكداً بعد' },
          { id: 'circles', emoji: '💭', text: 'أدور في حلقات' },
          { id: 'angry', emoji: '🔥', text: 'هذا يغضبني' },
          { id: 'sad', emoji: '🌑', text: 'هذا يحزنني' }
        ],
        showIntensity: true,
        intensityQuestion: "كم يبدو ثقيلاً؟",
        intensityLabels: { low: 'خفيف', high: 'ساحق' },
        intensityResponses: {
          low: "الأثقال الخفيفة تصبح أخف عند تسميتها.",
          mid: "أنت في المنتصف. الاعتراف بذلك يتطلب شجاعة.",
          high: "الأثقال الكبيرة تحتاج أدوات قوية. أنت هنا. هذه الخطوة الأولى."
        },
        style: 'introspective'
      }
    },
    {
      id: 'ex-1-presence-anchor',
      type: 'presence-anchor',
      title: 'الكفان المفتوحتان',
      content: {
        gesture: "افتح يديك، الكفان للأعلى، الأصابع مرتخية. اشعر بالهواء على كفيك.",
        meaning: "حرّر ما لا تستطيع التحكم به",
        breathCycles: 5,
        exhalePrompts: [
          "ما لا تستطيع التحكم به...",
          "اتركه يستريح في كفيك المفتوحتين...",
          "أنت لست قلقك...",
          "هذه اللحظة تكفي...",
          "الحرية في التحرّر..."
        ],
        anchorMessage: "كلما شعرت بالرغبة في التحكم، افتح كفيك. جسدك سيتذكر.",
        style: 'release'
      }
    }
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: 'الآن، هناك شيء يجلس في مؤخرة ذهنك. كان هناك منذ مدة. ربما محادثة تكررها باستمرار. خطأ وقع بحقك. قرار تتجنبه. خوف من المستقبل لا يتركك.',
      mood: 'tension',
      nextStepId: 'scenario-2',
    },
    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: 'يمكنك أن تشعر به الآن، أليس كذلك؟ ذلك الثقل المألوف. الحلقة الذهنية التي تدور عندما تحاول النوم. التوتر الذي يعيش في كتفيك، صدرك، فكك.',
      subtext: 'هذا الثقل حقيقي. واليوم سنفعل شيئاً حياله.',
      bridgeQuestion: 'هل أنت مستعد لمواجهته؟',
      continueLabel: 'نعم، أنا مستعد',
      mood: 'tension',
      nextStepId: 'name-burden',
    },
    {
      id: 'name-burden',
      type: 'commitment',
      prompt: 'سمّه. ما الشيء الذي يثقل عليك؟ لا تُفلتره. لا تجعله يبدو أفضل مما هو عليه. اكتب تماماً ما ينخر فيك.',
      placeholder: 'الشيء الذي يزعجني حقاً هو...',
      minimumWords: 8,
      guidanceHints: [
        'كن محدداً. "ضغط العمل" تصبح "مديري انتقدني أمام الجميع ولا أستطيع التوقف عن إعادة ذلك"',
        'كن صادقاً. لا أحد يرى هذا سواك.',
        'أخرجه. هذه أول خطوة لتركه يرحل.',
      ],
      continueLabel: 'سميته',
      storeAs: 'burden',
      nextStepId: 'feel-it',
    },
    {
      id: 'feel-it',
      type: 'timer',
      title: 'اشعر بالثقل',
      instruction: 'خذ 30 ثانية لتشعر فعلاً بهذا العبء. لا تحلله. لا تحاول إصلاحه. فقط لاحظ أين يعيش في جسدك. في كتفيك؟ صدرك؟ معدتك؟',
      durationSeconds: 30,
      timerStyle: 'presence',
      guidanceMessages: [
        'أين تشعر به في جسدك؟',
        'منذ متى وأنت تحمله؟',
        'فقط لاحِظ. لا تحكم.',
      ],
      nextStepId: 'ancient-question',
    },
    {
      id: 'ancient-question',
      type: 'insight',
      text: 'على مدى ألفي عام، كان الأباطرة والعبيد يسألون أنفسهم سؤالاً واحداً ليجدوا السلام. سأله ماركوس أوريليوس وهو يحكم روما. وسأله إبكتيتوس وهو في القيود. وسأله جيمس ستوكدايل وهو يتعرض للتعذيب كأسير حرب. اليوم، أنت تسأله عمّا سمّيتَه الآن.',
      style: 'principle',
      followUp: 'السؤال بسيط. لكن الإجابة عنه بصدق تغيّر كل شيء.',
      nextStepId: 'the-choice',
    },
    {
      id: 'the-choice',
      type: 'choice',
      instruction: 'أجب بصدق صارم',
      question: 'هل هناك فعل ملموس يمكنك القيام به خلال الخمس دقائق القادمة؟',
      options: [
        {
          id: 'yes',
          label: 'نعم — هناك شيء أستطيع فعله',
          subtext: 'فعل محدد يمكنني القيام به الآن',
          nextStepId: 'action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: 'لا — هذا خارج سيطرتي حقاً',
          subtext: 'لا أستطيع تغيير هذا بأفعالي',
          nextStepId: 'acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    {
      id: 'action-validation',
      type: 'insight',
      text: 'لديك قوة هنا. أغلب الناس لا يدركون ذلك أبداً. يجلسون مع مخاوفهم ويعيدونها بلا نهاية، بينما كان العلاج دائماً في متناولهم. أنت رأيت شيئاً مختلفاً. رأيت نافذة.',
      style: 'reframe',
      followUp: 'الآن يأتي الجزء الأصعب: أن تفعل شيئاً فعلاً.',
      nextStepId: 'commit-action',
    },
    {
      id: 'commit-action',
      type: 'commitment',
      prompt: "ما الذي ستفعله بالضبط؟ كن محدداً. ليس 'سأتحدث معهم' بل 'سأرسل الرسالة التي تقول...'. ليس 'سأعمل عليه' بل 'سأقضي 5 دقائق في...'.",
      placeholder: 'خلال الخمس دقائق القادمة سأقوم تحديداً بـ...',
      minimumWords: 8,
      guidanceHints: [
        'اجعله محدداً لدرجة لا تسيء فهم نفسك',
        'اجعله صغيراً بما يكفي لتنفيذه الآن، وليس "لاحقاً"',
        'كلما كان أصغر كان أفضل. الإنجاز يتفوق على الكمال.',
      ],
      continueLabel: 'هذا هو التزامي',
      storeAs: 'commitment',
      nextStepId: 'go-do-it',
    },
    {
      id: 'go-do-it',
      type: 'goDoIt',
      sageMessage: 'هذه هي اللحظة التي تفصل من يغيّرون حياتهم عن من يتمنون فقط. اذهب الآن. افعل بالضبط ما كتبته. ليس بعد أن تنتهي من القراءة. ليس عندما تشعر أنه الوقت المناسب. الآن. ارجع فقط عندما تنتهي. سأكون هنا.',
      sageSubtext: 'الفعل هو ترياق القلق. علاج الهم هو الحركة.',
      dismissLabel: 'سأذهب الآن',
      returnStepId: 'return-check',
    },
    {
      id: 'return-check',
      type: 'returnConfirm',
      welcomeMessage: 'لقد عدت.',
      confirmationQuestion: 'هل فعلت ما التزمت به؟',
      completedOption: {
        label: 'نعم — فعلته',
        nextStepId: 'action-reflection',
      },
      didNotCompleteOption: {
        label: 'لا — لم أفعله',
        message: 'شكراً لصدقك. معظم الناس كانوا سيكذبون على أنفسهم الآن. أنت لم تفعل. هذا الصدق نادر وثمين. دعنا نفهم ما حدث — ليس لنحكم عليك، بل لنتعلم.',
        nextStepId: 'action-reflection-incomplete',
      },
    },
    {
      id: 'action-reflection',
      type: 'reflection',
      prompt: 'لقد فعلتها. كيف تشعر الآن؟ ماذا تغيّر فيك لحظة اتخذت الفعل؟ كن محدداً حول قبل وبعد.',
      minimumWords: 15,
      encouragements: [
        'ما الذي كان أصعب مما توقعت؟',
        'ما الذي كان أسهل مما توقعت؟',
        'كيف يختلف هذا الشعور عن اللحظة قبل أن تبدأ؟',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'action-reflection-incomplete',
      type: 'reflection',
      prompt: 'ما الذي أعاقك؟ لا تحكم على نفسك — فقط لاحظ. أي صوت أقنعك بالتراجع؟ ماذا قلت لنفسك؟ فهم ذلك أثمن مما تظن.',
      minimumWords: 15,
      encouragements: [
        'ما القصة التي رواها عقلك لك؟',
        'هل كان الخوف قبل الفعل أسوأ من المهمة نفسها؟',
        'ما الذي ستفعله بشكل مختلف في المرة القادمة؟',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'acceptance-validation',
      type: 'insight',
      text: 'لقد فعلت شيئاً صعباً للغاية: قلت الحقيقة لنفسك. هذا الشيء الذي يعذبك — لا يمكنك إصلاحه بالفعل. معظم الناس يقضون شهوراً وسنين وحيوات كاملة وهم يقاتلون معارك لا يمكنهم الفوز بها. أنت توقفت. هنا. الآن.',
      style: 'reframe',
      followUp: 'هذا ليس هزيمة. هذه حكمة. السؤال الآن: هل تستطيع حقاً أن تتركه؟',
      nextStepId: 'acceptance-depth',
    },
    {
      id: 'acceptance-depth',
      type: 'scenario',
      narrative: 'التخلّي يبدو بسيطاً. لكن عقلك أصبح مدمناً على هذا القلق. يعود إليه كما يعود اللسان إلى سنٍ مؤلم. نفس الأفكار. نفس الغضب. نفس الخوف. مراراً وتكراراً.',
      subtext: 'حاولت أن تتوقف عن التفكير فيه. هذا لا ينجح. ما ينجح هو شيء مختلف.',
      bridgeQuestion: 'هل أنت مستعد لتجربة طريقة مختلفة؟',
      continueLabel: 'أرني',
      mood: 'hope',
      nextStepId: 'acceptance-visualization',
    },
    {
      id: 'acceptance-visualization',
      type: 'visualization',
      title: 'التحرّر',
      instructions: [
        'خذ ثلاث أنفاس عميقة. بطيئة ومتعمدة.',
        'تخيل الشيء الذي سمّيته. انظر إليه بوضوح.',
        'لاحظ كيف يستجيب جسدك. الانقباض. المقاومة.',
        'تخيل أنك تمسك هذا العبء بين يديك المقعرتين.',
        'اشعر بوزنه. لقد حملته طويلاً.',
        'الآن ببطء... افتح يديك. الكفان للأعلى. الأصابع متباعدة.',
        'راقب كيف يرتفع. لم يكن ملكك لتحمله.',
        'هو موجود. لكنه لا يحتاج أن يعيش داخلك.',
        'خذ نفساً آخر. اشعر بالمساحة حيث كان الوزن.',
      ],
      paceSeconds: 4,
      style: 'grounding',
      nextStepId: 'acceptance-reflection',
    },
    {
      id: 'acceptance-reflection',
      type: 'reflection',
      prompt: 'ماذا تغيّر فيك أثناء هذا التمرين؟ حتى لو كان بسيطاً. حتى لو عاد القلق فوراً. كيف كان شعورك، في تلك اللحظة القصيرة، عندما تركت الأمر؟',
      minimumWords: 15,
      encouragements: [
        'لا تحكم هل فعلت ذلك "بشكل صحيح"',
        'ماذا لاحظت في جسدك؟',
        'هل لا تزال هناك مقاومة؟ هذا طبيعي. سمّها.',
      ],
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
      text: 'ما مارسته للتو يُسمى ثنائية التحكم. إنها أساس الفلسفة الرواقية، وقد أرشدت قادة وناجين وأناساً عاديين لأكثر من ألفي عام. سؤال واحد: "هل هذا ضمن سيطرتي؟" إن كان نعم فافعل. وإن كان لا فاقبل. هذا كل شيء. هذه هي الفلسفة كاملة.',
      source: 'إبكتيتوس',
      sourceBook: 'الإنخيريديون',
      style: 'quote',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'هذا السؤال سيغيّر حياتك إن سمحت له بذلك. كل همّ، كل توتر، كل ليلة بلا نوم — اسأل نفسك: "هل يمكنني أن أفعل شيئاً؟" ثم افعل أو اقبل. هناك تعيش السكينة.',
        ],
        byChoice: {
          yes: [
            'لم تفكر بمشكلتك فقط — بل تحركت. هذا نادر. معظم الناس يشلّهم القلق. أثبتَّ أنك لست منهم. تذكّر هذا الشعور. هذا ما تصبح عليه: شخص يفعل.',
            'قال الفيلسوف ويليام جيمس: "يبدو أن الفعل يتبع الشعور، لكن في الحقيقة الفعل والشعور يسيران معاً." لقد أثبت ذلك اليوم. لم تنتظر أن تشعر بأنك جاهز. تصرّفت، ثم تبع الشعور.',
          ],
          no: [
            'لقد مارست أصعب مهارة في الفلسفة: تقبل ما لا تستطيع تغييره دون أن تصبح سلبياً تجاه ما تستطيع. هذا يتطلب حكمة لا يطورها معظم الناس أبداً.',
            'سمّى الرواقيون هذا "amor fati" — حب القدر. ليس مجرد تحمل ما لا تتحكم به، بل مصالحة معه. لقد أخذت الخطوة الأولى اليوم. العبء الذي سمّيته؟ لم يختفِ. لكنك بدأت تغيّر علاقتك به.',
          ],
        },
        byCompletion: {
          completed: [
            'قلت إنك ستفعل، وفعلت. هذا نادر. معظم الناس يكسرون وعودهم لأنفسهم كثيراً لدرجة أنهم يتوقفون عن تصديق قدرتهم على التغيير. أنت أثبت العكس. وعد واحد في كل مرة — هكذا تتغير الهوية.',
          ],
          notCompleted: [
            'عدت وقلت الحقيقة. هذا أهم مما تظن. الفجوة بين النية والفعل؟ هناك يعيش النمو. رأيت الفجوة اليوم. غداً ستعرف ماذا تتوقع. وستكون مستعداً.',
          ],
        },
      },
    },
  ],

  engagementSteps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: 'الآن، هناك شيء يجلس في مؤخرة ذهنك. كان هناك منذ مدة. ربما محادثة تكررها باستمرار. خطأ وقع بحقك. قرار تتجنبه. خوف من المستقبل لا يتركك.',
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: 'يمكنك أن تشعر به الآن، أليس كذلك؟ ذلك الثقل المألوف. الحلقة الذهنية التي تدور عندما تحاول النوم. التوتر الذي يعيش في كتفيك، صدرك، فكك.',
      subtext: 'هذا الثقل حقيقي. واليوم سنفعل شيئاً حياله.',
      bridgeQuestion: 'هل أنت مستعد لمواجهته؟',
      continueLabel: 'نعم، أنا مستعد',
      mood: 'tension',
      nextStepId: 'e-identify-burden',
    },
    {
      id: 'e-identify-burden',
      type: 'resonanceCheck',
      prompt: 'ما الذي يثقل عليك؟',
      instruction: 'انقر على كل ما يتردد صداه',
      options: [
        { id: 'conversation', text: 'محادثة أكررها باستمرار' },
        { id: 'decision', text: 'قرار أتجنبه' },
        { id: 'wronged', text: 'شخص أخطأ بحقي' },
        { id: 'future-fear', text: 'خوف من مستقبلي' },
        { id: 'regret', text: 'شيء قلته أو فعلته وأندم عليه' },
        { id: 'responsibility', text: 'مسؤولية تسحقني' },
        { id: 'relationship', text: 'علاقة تستنزفني' },
        { id: 'self-doubt', text: 'شك مستمر بالنفس' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'burden-type',
      nextStepId: 'e-feel-weight',
    },
    {
      id: 'e-feel-weight',
      type: 'scaleRating',
      prompt: 'ما مدى ثقل هذا الآن؟',
      lowLabel: 'همسة',
      highLabel: 'ساحق',
      steps: 5,
      storeAs: 'burden-weight',
      responsesByRange: {
        low: 'حتى الأوزان الصغيرة تتراكم عندما تحملها طويلاً.',
        mid: 'لقد حملت هذا لفترة أطول مما تدرك.',
        high: 'لا عجب أنك منهك. كنت تحمل صخرة.',
      },
      nextStepId: 'e-ancient-question',
    },
    {
      id: 'e-ancient-question',
      type: 'insight',
      text: 'على مدى ألفي عام، كان الأباطرة والعبيد يسألون أنفسهم سؤالاً واحداً ليجدوا السلام. سأله ماركوس أوريليوس وهو يحكم روما. وسأله إبكتيتوس وهو في القيود. وسأله جيمس ستوكدايل وهو يتعرض للتعذيب كأسير حرب. اليوم، أنت تسأله عمّا سمّيتَه الآن.',
      style: 'principle',
      followUp: 'السؤال بسيط. لكن الإجابة عنه بصدق تغيّر كل شيء.',
      nextStepId: 'e-the-choice',
    },
    {
      id: 'e-the-choice',
      type: 'choice',
      instruction: 'أجب بصدق صارم',
      question: 'هل هناك فعل ملموس يمكنك القيام به خلال الخمس دقائق القادمة؟',
      options: [
        {
          id: 'yes',
          label: 'نعم — هناك شيء أستطيع فعله',
          subtext: 'فعل محدد يمكنني القيام به الآن',
          nextStepId: 'e-action-validation',
          storeAs: 'controlChoice',
        },
        {
          id: 'no',
          label: 'لا — هذا خارج سيطرتي حقاً',
          subtext: 'لا أستطيع تغيير هذا بأفعالي',
          nextStepId: 'e-acceptance-validation',
          storeAs: 'controlChoice',
        },
      ],
    },
    // نعم PATH
    {
      id: 'e-action-validation',
      type: 'insight',
      text: 'لديك قوة هنا. أغلب الناس لا يدركون ذلك أبداً. يجلسون مع مخاوفهم ويعيدونها بلا نهاية، بينما كان العلاج دائماً في متناولهم. أنت رأيت شيئاً مختلفاً. رأيت نافذة.',
      style: 'reframe',
      followUp: 'الآن يأتي الجزء الأصعب: أن تفعل شيئاً فعلاً.',
      nextStepId: 'e-action-affirmation',
    },
    {
      id: 'e-action-affirmation',
      type: 'affirmation',
      preText: 'لقد حددت عبءك. ورأيت أن الفعل ممكن.',
      statement: 'سأتخذ خطوة ملموسة واحدة بشأن هذا اليوم. ليس غداً. اليوم.',
      confirmLabel: 'هذا هو التزامي',
      style: 'commitment',
      nextStepId: 'e-action-tapflow',
    },
    {
      id: 'e-action-tapflow',
      type: 'tapFlow',
      title: 'عقلية الفعل',
      instructions: [
        'لقد حددت شيئاً ضمن سيطرتك.',
        'معظم الناس لا يصلون إلى هذا الحد أبداً.',
        'يبقون عالقين في رؤوسهم، يعيدون نفس المخاوف.',
        'لكنك رأيت نافذة. اخترت الفعل.',
        'الفعل هو ترياق القلق.',
        'لحظة أن تتحرك، يبدأ الثقل بالارتفاع.',
        'ليس لأن المشكلة اختفت...',
        'بل لأنك توقفت عن أن تكون ضحيتها.',
        'اليوم، تتخذ خطوة واحدة. هذا كل ما يهم.',
      ],
      style: 'fearless',
      nextStepId: 'e-reward',
    },
    // لا PATH
    {
      id: 'e-acceptance-validation',
      type: 'insight',
      text: 'لقد فعلت شيئاً صعباً للغاية: قلت الحقيقة لنفسك. هذا الشيء الذي يعذبك — لا يمكنك إصلاحه بالفعل. معظم الناس يقضون شهوراً وسنين وحيوات كاملة وهم يقاتلون معارك لا يمكنهم الفوز بها. أنت توقفت. هنا. الآن.',
      style: 'reframe',
      followUp: 'هذا ليس هزيمة. هذه حكمة. السؤال الآن: هل تستطيع حقاً أن تتركه؟',
      nextStepId: 'e-acceptance-tapflow',
    },
    {
      id: 'e-acceptance-tapflow',
      type: 'tapFlow',
      title: 'التحرّر',
      instructions: [
        'خذ ثلاث أنفاس عميقة. بطيئة ومتعمدة.',
        'تخيل الشيء الذي سمّيته. انظر إليه بوضوح.',
        'لاحظ كيف يستجيب جسدك. الانقباض. المقاومة.',
        'تخيل أنك تمسك هذا العبء بين يديك المقعرتين.',
        'اشعر بوزنه. لقد حملته طويلاً.',
        'الآن ببطء... افتح يديك. الكفان للأعلى. الأصابع متباعدة.',
        'راقب كيف يرتفع. لم يكن ملكك لتحمله.',
        'هو موجود. لكنه لا يحتاج أن يعيش داخلك.',
        'خذ نفساً آخر. اشعر بالمساحة حيث كان الوزن.',
      ],
      style: 'grounding',
      nextStepId: 'e-reward',
    },
    // تقارب
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: 'ما مارسته للتو يُسمى ثنائية التحكم. إنها أساس الفلسفة الرواقية، وقد أرشدت قادة وناجين وأناساً عاديين لأكثر من ألفي عام. سؤال واحد: "هل هذا ضمن سيطرتي؟" إن كان نعم فافعل. وإن كان لا فاقبل. هذا كل شيء. هذه هي الفلسفة كاملة.',
      source: 'إبكتيتوس',
      sourceBook: 'الإنخيريديون',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          'هذا السؤال سيغيّر حياتك إن سمحت له بذلك. كل همّ، كل توتر، كل ليلة بلا نوم — اسأل نفسك: "هل يمكنني أن أفعل شيئاً؟" ثم افعل أو اقبل. هناك تعيش السكينة.',
        ],
        byChoice: {
          yes: [
            'رأيت نافذة حيث يرى الآخرون جدراناً فقط. التزمت بالفعل — ليس بالكتابة، بل في قلبك. هذا الالتزام حقيقي. أكرمه اليوم.',
          ],
          no: [
            'مارست أصعب مهارة في الفلسفة: قبول ما لا تستطيع تغييره. معظم الناس يقاتلون تلك المعركة للأبد. اليوم، اخترت السلام.',
          ],
        },
        byMode: {
          engagement: [
            'لم تكتب اليوم — لكنك حضرت. حددت عبءك، واجهت السؤال القديم، واتخذت اختيارك. هذا ليس أقل. هذا كافٍ. عد غداً.',
          ],
        },
      },
    },
  ] as LessonStep[],
};

const lesson2_PowerOfTiny_FR: FlexibleLesson = {
  id: 'modern-2-power-of-tiny',
  slug: 'power-of-tiny',
  order: 2,
  title: 'Le pouvoir du tout petit',
  subtitle: 'Pourquoi 1 % mieux vaut 100 % parfait',
  description: 'Découvre pourquoi les plus petites actions créent les plus grands changements.',
  coreConceptTag: 'habits',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌱', color: '#10b981' },
  teaserText: "Demain, tu apprendras la règle des 2 minutes qui rend les habitudes impossibles à rater.",
  exercises: [
    {
      id: 'ex-2-truth-mirror',
      type: 'truth-mirror',
      title: 'Les votes d\'identité',
      content: {
        statements: [
          "Je commence des choses mais je les finis rarement.",
          "J'attends d'être motivé pour commencer.",
          "Je pense qu'il me faut de grands changements.",
          "J'ai déjà essayé ça et j'ai échoué.",
          "Je ne crois pas que les petites actions comptent.",
          "Je suis plus dur avec moi-même que quiconque.",
          "Je compare mon début à la fin de quelqu'un d'autre.",
          "J'oublie que se présenter EST la victoire."
        ],
        holdReveal: "Ce schéma peut changer. Un petit vote à la fois.",
        breathPrompts: [
          "Un pour cent...",
          "Un vote...",
          "Un jour..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-2-soul-compass',
      type: 'soul-compass',
      title: 'Quelle est ta vérité de 2 minutes ?',
      content: {
        centralQuestion: "Pourquoi tes tentatives passées n'ont-elles pas tenu ?",
        options: [
          { id: 'big', emoji: '🎯', text: "J'ai visé trop grand" },
          { id: 'motivation', emoji: '🌀', text: "J'ai perdu ma motivation" },
          { id: 'life', emoji: '📅', text: "La vie s'est mise en travers" },
          { id: 'hard', emoji: '😤', text: "J'ai été trop dur avec moi" },
          { id: 'wrong', emoji: '🎭', text: "Je le faisais pour de mauvaises raisons" },
          { id: 'unknown', emoji: '❓', text: "Je ne sais pas pourquoi" }
        ],
        showIntensity: true,
        intensityQuestion: "À quel point veux-tu que ça change ?",
        intensityLabels: { low: 'Un peu', high: 'Désespérément' },
        intensityResponses: {
          low: "Peut-être es-tu content. C'est ok aussi.",
          mid: "L'étincelle est là. Attisons-la doucement.",
          high: "Ce feu est réel. Maintenant réduis l'action, pas le désir."
        },
        style: 'energizing'
      }
    },
    {
      id: 'ex-2-presence-anchor',
      type: 'presence-anchor',
      title: 'Le geste de la graine',
      content: {
        gesture: "Touche ton pouce à ton index, formant un petit cercle — comme si tu tenais une graine.",
        meaning: "Petit est puissant",
        breathCycles: 4,
        exhalePrompts: [
          "Petit ne veut pas dire faible...",
          "Constant bat intense...",
          "Tu es ce que tu répètes...",
          "La graine devient le chêne..."
        ],
        anchorMessage: "Touche ces doigts chaque fois que tu te sens dépassé. Souviens-toi : petit est puissant.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: "Tu as déjà essayé de changer. Tu as commencé fort. Puis la vie a repris. L'abonnement de gym est resté inutilisé. L'appli de méditation a pris la poussière. Le journal est resté vide après le troisième jour.",
      subtext: 'Ce n’est pas ta faute. Tu jouais au mauvais jeu.',
      bridgeQuestion: 'Et si le problème n’avait jamais été ta volonté ?',
      continueLabel: 'Dis-m’en plus',
      mood: 'hope',
    },
    {
      id: 'insight',
      type: 'insight',
      text: "Nous surestimons ce que nous pouvons faire en un jour et sous-estimons ce que nous pouvons faire en un an. Le secret n’est pas l’action massive — c’est l’action minuscule, répétée. 1 % de mieux chaque jour, c’est 37x mieux en un an.",
      source: 'James Clear',
      sourceBook: 'Un rien peut tout changer (Atomic Habits)',
      style: 'principle',
      nextStepId: 'tiny-commitment',
    },
    {
      id: 'tiny-commitment',
      type: 'commitment',
      prompt: "Quelle est une chose que tu veux construire ? Maintenant, rends-la TOUTE PETITE. Quelle est la version 2 minutes ?",
      placeholder: "Au lieu de 'faire du sport une heure', écris 'faire 2 pompes'. Au lieu de 'méditer', écris 'prendre 3 respirations'.",
      minimumWords: 3,
      guidanceHints: [
        'Fais-la si petite qu’elle semble presque ridicule',
        'Si cela prend plus de 2 minutes, réduis',
        'L’objectif, c’est de se présenter, pas la performance',
      ],
      continueLabel: 'Voici ma petite habitude',
      nextStepId: 'do-it-now',
    },
    {
      id: 'do-it-now',
      type: 'timer',
      title: 'Fais-le maintenant',
      instruction: 'Prends 60 secondes et fais ta petite habitude. Oui, maintenant.',
      durationSeconds: 60,
      timerStyle: 'countdown',
      guidanceMessages: [
        'C’est ainsi que le changement commence.',
        'Les petites actions composent de grands résultats.',
        'Tu construis une nouvelle identité.',
      ],
      allowStruggle: true,
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: "Comment t’es-tu senti(e) en faisant quelque chose de petit au lieu de planifier quelque chose d’énorme ? Pourrais-tu faire ça chaque jour ?",
      minimumWords: 10,
      encouragements: [
        'Était-ce plus facile que tu ne l’imaginais ?',
        'Que changerait cette habitude quotidienne sur un an ?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Tu viens de faire quelque chose que la plupart des gens ne font jamais : commencer petit, volontairement. James Clear appelle cela « la règle des 2 minutes ». Rends-le si facile que tu ne peux pas dire non. Puis augmente à partir de là.",
          "Chaque maître a été un désastre. Chaque montagne a été gravie un pas après l’autre. Tu viens de faire ton premier pas. Demain, fais un autre. C’est tout le secret.",
          "Les habitudes se forment par répétition, pas par intensité. Une action minuscule faite chaque jour vaut mieux qu’un effort héroïque fait une seule fois. Tu connais maintenant le chemin. Marche-le.",
        ],
        byCompletion: {
          completed: [
            "Tu n’as pas seulement appris les petites habitudes — tu en as pratiqué une. C’est la différence entre savoir et faire. Reviens demain et recommence. C’est comme ça que l’identité change.",
          ],
          notCompleted: [
            "Même la lutte avec la version minuscule t’enseigne quelque chose. Qu’est-ce qui t’a freiné(e) ? C’est une donnée précieuse. Demain, fais encore plus petit. Trouve la version qui ne peut pas échouer.",
          ],
        },
      },
    },
  ],
};

const lesson2_PowerOfTiny_AR: FlexibleLesson = {
  id: 'modern-2-power-of-tiny',
  slug: 'power-of-tiny',
  order: 2,
  title: 'قوة الصغير',
  subtitle: 'لماذا 1% أفضل من 100% مثالي',
  description: 'اكتشف لماذا تُحدث أصغر الأفعال أكبر التغييرات.',
  coreConceptTag: 'habits',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌱', color: '#10b981' },
  teaserText: 'غداً ستتعلم قاعدة الدقيقتين التي تجعل العادات شبه مستحيلة الفشل.',
  exercises: [
    {
      id: 'ex-2-truth-mirror',
      type: 'truth-mirror',
      title: 'أصوات الهوية',
      content: {
        statements: [
          "أبدأ أشياء لكنني نادراً ما أنهيها.",
          "أنتظر حتى أشعر بالتحفيز لأبدأ.",
          "أظن أنني بحاجة لتغييرات كبيرة.",
          "جربت هذا من قبل وفشلت.",
          "لا أؤمن أن الأفعال الصغيرة تهم.",
          "أنا أقسى على نفسي من أي شخص آخر.",
          "أقارن بدايتي بنهاية شخص آخر.",
          "أنسى أن الحضور هو الفوز بحد ذاته."
        ],
        holdReveal: "هذا النمط يمكن أن يتغير. صوت صغير في كل مرة.",
        breathPrompts: [
          "واحد بالمئة...",
          "صوت واحد...",
          "يوم واحد..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-2-soul-compass',
      type: 'soul-compass',
      title: 'ما حقيقتك ذات الدقيقتين؟',
      content: {
        centralQuestion: "لماذا لم تستمر محاولاتك السابقة؟",
        options: [
          { id: 'big', emoji: '🎯', text: 'جعلتها كبيرة جداً' },
          { id: 'motivation', emoji: '🌀', text: 'فقدت حماسي' },
          { id: 'life', emoji: '📅', text: 'الحياة تدخلت' },
          { id: 'hard', emoji: '😤', text: 'كنت قاسياً جداً على نفسي' },
          { id: 'wrong', emoji: '🎭', text: 'كنت أفعلها لأسباب خاطئة' },
          { id: 'unknown', emoji: '❓', text: 'لا أعرف لماذا' }
        ],
        showIntensity: true,
        intensityQuestion: "كم تريد أن يتغير هذا؟",
        intensityLabels: { low: 'قليلاً', high: 'بشدة' },
        intensityResponses: {
          low: "ربما أنت راضٍ. هذا جيد أيضاً.",
          mid: "الشرارة موجودة. لنُشعلها برفق.",
          high: "هذه النار حقيقية. الآن صغّر الفعل، لا الرغبة."
        },
        style: 'energizing'
      }
    },
    {
      id: 'ex-2-presence-anchor',
      type: 'presence-anchor',
      title: 'إيماءة البذرة',
      content: {
        gesture: "المس إبهامك بسبابتك لتصنع دائرة صغيرة — كأنك تمسك بذرة.",
        meaning: "الصغير قوي",
        breathCycles: 4,
        exhalePrompts: [
          "الصغير لا يعني الضعيف...",
          "المستمر يهزم المكثف...",
          "أنت ما تكرره...",
          "البذرة تصبح البلوطة..."
        ],
        anchorMessage: "المس هذين الإصبعين كلما شعرت بالإرهاق. تذكر: الصغير قوي.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'لقد حاولت التغيير من قبل. بدأت بقوة. ثم حدثت الحياة. اشتراك النادي لم يُستخدم. تطبيق التأمل غطاه الغبار. دفتر اليوميات بقي فارغاً بعد اليوم الثالث.',
      subtext: 'ليس خطأك. لقد لعبت اللعبة الخاطئة.',
      bridgeQuestion: 'ماذا لو لم تكن المشكلة إرادتك أصلاً؟',
      continueLabel: 'قل لي المزيد',
      mood: 'hope',
    },
    {
      id: 'insight',
      type: 'insight',
      text: 'نحن نبالغ في تقدير ما نستطيع فعله في يوم، ونقلل من تقدير ما نستطيع فعله في سنة. السر ليس عملاً ضخماً — بل عملاً صغيراً متكرراً. 1% أفضل كل يوم يعني 37 ضعفاً أفضل خلال سنة.',
      source: 'James Clear',
      sourceBook: 'العادات الذرية (Atomic Habits)',
      style: 'principle',
      nextStepId: 'tiny-commitment',
    },
    {
      id: 'tiny-commitment',
      type: 'commitment',
      prompt: 'ما الشيء الذي تريد بناءه؟ الآن اجعله صغيراً جداً. ما نسخة الدقيقتين؟',
      placeholder: "بدلاً من 'أتمرن ساعة' اكتب 'أقوم بتمرينتي ضغط'. بدلاً من 'أتأمل' اكتب 'آخذ ثلاث أنفاس'.",
      minimumWords: 3,
      guidanceHints: [
        'اجعله صغيراً لدرجة تبدو سخيفة',
        'إذا استغرق أكثر من دقيقتين، صغّره',
        'الهدف هو الحضور، لا الأداء',
      ],
      continueLabel: 'هذه عادتي الصغيرة',
      nextStepId: 'do-it-now',
    },
    {
      id: 'do-it-now',
      type: 'timer',
      title: 'افعلها الآن',
      instruction: 'خذ 60 ثانية وافعل عادتك الصغيرة. نعم، الآن.',
      durationSeconds: 60,
      timerStyle: 'countdown',
      guidanceMessages: [
        'هكذا يبدأ التغيير.',
        'الأفعال الصغيرة تتراكم إلى نتائج كبيرة.',
        'أنت تبني هوية جديدة.',
      ],
      allowStruggle: true,
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'كيف كان شعورك عندما فعلت شيئاً صغيراً بدلاً من التخطيط لشيء ضخم؟ هل يمكنك القيام بهذا كل يوم؟',
      minimumWords: 10,
      encouragements: [
        'هل كان أسهل مما توقعت؟',
        'ماذا سيتغير لو فعلت ذلك يومياً لمدة عام؟',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'لقد فعلت شيئاً لا يفعله معظم الناس: بدأت صغيراً عن قصد. يسمي جيمس كلير هذا "قاعدة الدقيقتين". اجعله سهلاً لدرجة لا يمكنك قول لا. ثم زد من هناك.',
          'كل خبير كان يوماً كارثة. كل جبل صُعد خطوة خطوة. لقد خطوت أول خطوة. غداً خذ خطوة أخرى. هذا هو السر كله.',
          'العادات تتشكل بالتكرار لا بالشدة. فعل صغير يومي يتفوق على جهد بطولي مرة واحدة. أنت تعرف الطريق الآن. سر فيه.',
        ],
        byCompletion: {
          completed: [
            'لم تتعلم عن العادات الصغيرة فقط — بل مارست واحدة. هذا هو الفرق بين المعرفة والفعل. عد غداً وافعلها مرة أخرى. هكذا تتحول الهوية.',
          ],
          notCompleted: [
            'حتى التعثر مع النسخة الصغيرة يعلمك شيئاً. ما الذي أعاقك؟ هذه معلومة ثمينة. غداً اجعلها أصغر. ابحث عن نسخة لا يمكنك أن تفشل فيها.',
          ],
        },
      },
    },
  ],
};

const lesson3_ObstacleOpportunity_FR: FlexibleLesson = {
  id: 'modern-3-obstacle-opportunity',
  slug: 'obstacle-opportunity',
  order: 3,
  title: 'Le cadeau caché',
  subtitle: 'Trouver une opportunité dans chaque obstacle',
  description: 'Apprends à voir tes problèmes comme du carburant pour grandir.',
  coreConceptTag: 'obstacles',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🔥', color: '#ef4444' },
  teaserText: "Demain, tu apprendras le secret ancien qui transforme chaque obstacle en ton plus grand avantage.",
  exercises: [
    {
      id: 'ex-3-truth-mirror',
      type: 'truth-mirror',
      title: 'Les cadeaux cachés',
      content: {
        statements: [
          "Ce revers me redirige peut-être vers quelque chose de mieux.",
          "Cette difficulté construit une force dont j'aurai besoin plus tard.",
          "Ce qui ressemble à un rejet est peut-être une protection.",
          "La porte qui s'est fermée n'était pas ma porte.",
          "Cette lutte m'enseigne quelque chose d'important.",
          "Ma plus grande croissance vient de mes moments les plus difficiles.",
          "L'obstacle contient exactement ce dont j'ai besoin.",
          "Je peux utiliser ceci, même si je ne l'ai pas choisi."
        ],
        holdReveal: "L'obstacle est le chemin. C'est ton chemin.",
        breathPrompts: [
          "À travers...",
          "Pas autour...",
          "En avant..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-3-soul-compass',
      type: 'soul-compass',
      title: 'Inventaire des obstacles',
      content: {
        centralQuestion: "Qu'est-ce qui bloque ton chemin en ce moment ?",
        options: [
          { id: 'door', emoji: '🚪', text: "Une porte qui ne s'ouvre pas" },
          { id: 'person', emoji: '👤', text: "Une personne qui ne change pas" },
          { id: 'time', emoji: '⏰', text: "Du temps que je n'ai pas" },
          { id: 'loss', emoji: '💔', text: "Une perte irréparable" },
          { id: 'fear', emoji: '😰', text: "Une peur que je n'arrive pas à secouer" },
          { id: 'unknown', emoji: '🤷', text: "Je ne sais pas ce qui me bloque" }
        ],
        showIntensity: false,
        followUpQuestion: "Que pourrait créer cet obstacle ?",
        followUpOptions: [
          { id: 'strength', emoji: '💪', text: 'De la force' },
          { id: 'wisdom', emoji: '🧠', text: 'De la sagesse' },
          { id: 'redirect', emoji: '🔄', text: 'Une redirection' },
          { id: 'growth', emoji: '🌱', text: 'De la croissance' },
          { id: 'unseen', emoji: '❓', text: "Je ne le vois pas encore" }
        ],
        style: 'awakening'
      }
    },
    {
      id: 'ex-3-presence-anchor',
      type: 'presence-anchor',
      title: 'Le phénix qui s\'élève',
      content: {
        gesture: "Presse tes paumes l'une contre l'autre sur ta poitrine. En expirant, lève-les au-dessus de ta tête en écartant tes doigts — comme des flammes qui montent.",
        meaning: "S'élever de ce qui voulait te brûler",
        breathCycles: 4,
        exhalePrompts: [
          "Du feu...",
          "Vient le carburant...",
          "L'obstacle devient...",
          "Le chemin en avant..."
        ],
        anchorMessage: "Chaque fois que tu te sens bloqué(e), fais ce geste. Élève-toi comme le phénix.",
        style: 'strength'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'Quelque chose bloque ton chemin en ce moment. Un refus. Un échec. Une personne qui ne coopère pas. Une situation qui semble figée.',
      subtext: 'Et si cet obstacle était exactement ce dont tu as besoin ?',
      continueLabel: 'Je t’écoute',
      mood: 'curiosity',
    },
    {
      id: 'name-obstacle',
      type: 'commitment',
      prompt: 'Nomme ton obstacle. Qu’est-ce qui se dresse sur ta route en ce moment ?',
      placeholder: 'Mon/ma manager ne m’écoute pas... J’ai été refusé(e) à... J’échoue à...',
      minimumWords: 3,
      guidanceHints: [
        'Sois précis(e) sur ce qui te bloque',
        'Ne filtre pas — nomme l’obstacle réel',
      ],
      continueLabel: 'Voici mon obstacle',
      storeAs: 'obstacle',
      nextStepId: 'flip-question',
    },
    {
      id: 'flip-question',
      type: 'choice',
      instruction: 'Réfléchis bien',
      question: 'Cet obstacle pourrait-il t’enseigner quelque chose que tu devais apprendre ?',
      options: [
        {
          id: 'maybe-yes',
          label: 'Peut-être... je vois comment',
          nextStepId: 'opportunity-insight',
        },
        {
          id: 'not-sure',
          label: 'Honnêtement, je ne vois pas',
          nextStepId: 'reframe-insight',
        },
      ],
    },
    {
      id: 'opportunity-insight',
      type: 'insight',
      text: 'L’obstacle à l’action fait avancer l’action. Ce qui fait obstacle devient le chemin. Chaque obstacle contient en lui les graines d’une opportunité égale ou plus grande.',
      source: 'Ryan Holiday',
      sourceBook: 'L’Obstacle est le chemin',
      style: 'principle',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'reframe-insight',
      type: 'insight',
      text: 'Quand nous ne voyons pas le cadeau dans un obstacle, c’est souvent parce que nous sommes trop proches. Mais l’histoire regorge de personnes qui sont devenues ce qu’elles sont À CAUSE de leurs obstacles, pas malgré eux. Prenons du recul.',
      style: 'reframe',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'opportunity-visualization',
      type: 'visualization',
      title: 'Trouver le cadeau',
      instructions: [
        'Visualise clairement ton obstacle.',
        'Imagine-toi 5 ans dans le futur.',
        'Cet obstacle t’a aidé(e) à devenir plus fort(e).',
        'Qu’est-ce qu’il t’a appris ?',
        'Quelle compétence as-tu développée grâce à lui ?',
        'Qui es-tu devenu(e) en le traversant ?',
        'Garde cette version future de toi en tête.',
      ],
      paceSeconds: 5,
      style: 'fearless',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'Quelle opportunité pourrait se cacher dans ton obstacle ? Que pourrait-il t’enseigner ?',
      minimumWords: 15,
      encouragements: [
        'Quelle force cela pourrait-il construire ?',
        'Comment cela pourrait-il te rediriger vers mieux ?',
        'Quelle histoire raconteras-tu en le surmontant ?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'Tu viens de faire de l’alchimie — transformer le plomb en or. L’obstacle qui semblait un mur ? Tu as commencé à le voir comme une porte. C’est ainsi que pensent les grands. Et maintenant, toi aussi.',
          'Ryan Holiday a écrit « L’Obstacle est le chemin » à partir d’une seule idée de Marc Aurèle. Cette idée guide des leaders depuis 2000 ans. Désormais, elle te guide aussi.',
          'L’obstacle est le chemin. Pas autour. Pas au-dessus. À travers. Chaque problème est un professeur déguisé. Tu apprends à lire ses leçons.',
        ],
      },
    },
  ],
};

const lesson3_ObstacleOpportunity_AR: FlexibleLesson = {
  id: 'modern-3-obstacle-opportunity',
  slug: 'obstacle-opportunity',
  order: 3,
  title: 'الهدية الخفية',
  subtitle: 'العثور على فرصة في كل عقبة',
  description: 'تعلّم أن ترى مشاكلك كوقود للنمو.',
  coreConceptTag: 'obstacles',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🔥', color: '#ef4444' },
  teaserText: 'غداً ستتعلم السر القديم الذي يحوّل كل عقبة إلى أعظم ميزة لديك.',
  exercises: [
    {
      id: 'ex-3-truth-mirror',
      type: 'truth-mirror',
      title: 'الهدايا الخفية',
      content: {
        statements: [
          "هذه النكسة قد تعيد توجيهي نحو شيء أفضل.",
          "هذه الصعوبة تبني قوة سأحتاجها لاحقاً.",
          "ما يبدو رفضاً قد يكون حماية.",
          "الباب الذي أُغلق لم يكن بابي.",
          "هذه المعاناة تعلمني شيئاً مهماً.",
          "أعظم نموّي جاء من أصعب لحظاتي.",
          "العقبة تحتوي بالضبط ما أحتاجه.",
          "يمكنني استخدام هذا، حتى لو لم أخترها."
        ],
        holdReveal: "العقبة هي الطريق. هذا طريقك.",
        breathPrompts: [
          "عبرها...",
          "ليس حولها...",
          "للأمام..."
        ],
        style: 'strength'
      }
    },
    {
      id: 'ex-3-soul-compass',
      type: 'soul-compass',
      title: 'جرد العقبات',
      content: {
        centralQuestion: "ما الذي يسد طريقك الآن؟",
        options: [
          { id: 'door', emoji: '🚪', text: "باب لا يُفتح" },
          { id: 'person', emoji: '👤', text: "شخص لا يتغير" },
          { id: 'time', emoji: '⏰', text: "وقت لا أملكه" },
          { id: 'loss', emoji: '💔', text: "خسارة لا يمكن إصلاحها" },
          { id: 'fear', emoji: '😰', text: "خوف لا أستطيع التخلص منه" },
          { id: 'unknown', emoji: '🤷', text: "لا أعرف ما الذي يعيقني" }
        ],
        showIntensity: false,
        followUpQuestion: "ما الذي قد تخلقه هذه العقبة؟",
        followUpOptions: [
          { id: 'strength', emoji: '💪', text: 'القوة' },
          { id: 'wisdom', emoji: '🧠', text: 'الحكمة' },
          { id: 'redirect', emoji: '🔄', text: 'إعادة التوجيه' },
          { id: 'growth', emoji: '🌱', text: 'النمو' },
          { id: 'unseen', emoji: '❓', text: "لا أراها بعد" }
        ],
        style: 'awakening'
      }
    },
    {
      id: 'ex-3-presence-anchor',
      type: 'presence-anchor',
      title: 'العنقاء الناهضة',
      content: {
        gesture: "اضغط كفيك معاً عند صدرك. مع الزفير، ارفعهما فوق رأسك مع تفريق أصابعك — كأنها ألسنة نار ترتفع.",
        meaning: "انهض مما حاول إحراقك",
        breathCycles: 4,
        exhalePrompts: [
          "من النار...",
          "يأتي الوقود...",
          "العقبة تصبح...",
          "الطريق للأمام..."
        ],
        anchorMessage: "كلما شعرت بالانسداد، قم بهذه الإيماءة. انهض كالعنقاء.",
        style: 'strength'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'هناك شيء يسد طريقك الآن. رفض. فشل. شخص لا يتعاون. موقف يبدو عالقاً بشكل مستحيل.',
      subtext: 'ماذا لو كانت هذه العقبة بالضبط ما تحتاجه؟',
      continueLabel: 'أنا أستمع',
      mood: 'curiosity',
    },
    {
      id: 'name-obstacle',
      type: 'commitment',
      prompt: 'سمِّ عقبتك. ما الذي يقف في طريقك الآن؟',
      placeholder: 'مديري لا يستمع... تم رفضي من... أستمر في الفشل في...',
      minimumWords: 3,
      guidanceHints: [
        'كن محدداً بما يعيقك',
        'لا تُفلتر — سمِّ العقبة الحقيقية',
      ],
      continueLabel: 'هذه عقبتـي',
      storeAs: 'obstacle',
      nextStepId: 'flip-question',
    },
    {
      id: 'flip-question',
      type: 'choice',
      instruction: 'فكّر في هذا بعناية',
      question: 'هل يمكن أن تكون هذه العقبة تعلّمك شيئاً كنت بحاجة لتعلّمه؟',
      options: [
        {
          id: 'maybe-yes',
          label: 'ربما... أستطيع أن أرى ذلك',
          nextStepId: 'opportunity-insight',
        },
        {
          id: 'not-sure',
          label: 'بصراحة لا أراه',
          nextStepId: 'reframe-insight',
        },
      ],
    },
    {
      id: 'opportunity-insight',
      type: 'insight',
      text: 'العائق أمام الفعل يقدّم الفعل. ما يقف في الطريق يصبح الطريق. كل عقبة تحتوي على بذور فرصة مساوية أو أكبر.',
      source: 'Ryan Holiday',
      sourceBook: 'العقبة هي الطريق',
      style: 'principle',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'reframe-insight',
      type: 'insight',
      text: 'عندما لا نرى الهدية في العقبة، فغالباً لأننا قريبون جداً. لكن التاريخ مليء بأشخاص أصبحوا ما هم عليه بسبب عقباتهم، لا رغمها. فلنبتعد خطوة.',
      style: 'reframe',
      nextStepId: 'opportunity-visualization',
    },
    {
      id: 'opportunity-visualization',
      type: 'visualization',
      title: 'العثور على الهدية',
      instructions: [
        'تخيّل عقبتك بوضوح.',
        'الآن تخيّل أنك بعد خمس سنوات.',
        'هذه العقبة ساعدتك على أن تصبح أقوى.',
        'ماذا علّمتك؟',
        'ما المهارة التي طوّرتها بسببها؟',
        'من أصبحت عندما واجهتها؟',
        'احتفظ بهذه النسخة المستقبلية في ذهنك.',
      ],
      paceSeconds: 5,
      style: 'fearless',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'ما الفرصة التي قد تختبئ داخل عقبتك؟ ما الذي يمكن أن تعلّمك إياه؟',
      minimumWords: 15,
      encouragements: [
        'أي قوة يمكن أن تبنيها هذه التجربة؟',
        'كيف قد تعيد توجيهك إلى الأفضل؟',
        'ما القصة التي سترويها عن تجاوزها؟',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'لقد قمت بالكيمياء التحويلية — حولت الرصاص إلى ذهب. العقبة التي بدت كجدار؟ بدأت تراها كباب. هكذا يفكر العظماء. والآن أنت تعرف كيف أيضاً.',
          'كتب ريان هوليداي "العقبة هي الطريق" بناءً على فكرة واحدة من ماركوس أوريليوس. هذه الفكرة قادت قادة لمدة 2000 عام. والآن تقودك أنت.',
          'العقبة هي الطريق. لا حولها. لا فوقها. بل من خلالها. كل مشكلة معلّم متخفٍ. وأنت تتعلم قراءة دروسه.',
        ],
      },
    },
  ],
};

const lesson4_MorningMindset_FR: FlexibleLesson = {
  id: 'modern-4-morning-mindset',
  slug: 'morning-mindset',
  order: 4,
  title: 'Maîtrise ton matin',
  subtitle: 'Commence la journée avant qu’elle ne te commence',
  description: 'Une pratique de 2 minutes qui change la façon dont toute ta journée se déroule.',
  coreConceptTag: 'preparation',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌅', color: '#f97316' },
  teaserText: "Demain, tu apprendras la pratique matinale de 2 minutes utilisée par des empereurs romains et des PDG modernes.",
  exercises: [
    {
      id: 'ex-4-truth-mirror',
      type: 'truth-mirror',
      title: 'Conscience de l\'embuscade',
      content: {
        statements: [
          "Mes matins sont généralement piratés par mon téléphone.",
          "Je me réveille déjà stressé(e) par la journée.",
          "Je laisse les autres définir mon humeur.",
          "Je suis surpris(e) quand les choses vont mal.",
          "Je réagis au lieu de répondre.",
          "J'oublie que j'ai le choix dans ce que je ressens.",
          "Je commence la journée en défense, pas en attaque.",
          "Je pourrais anticiper, mais je ne le fais pas."
        ],
        holdReveal: "Le guerrier s'attend à l'embuscade. Maintenant tu es prêt(e).",
        breathPrompts: [
          "J'ai anticipé...",
          "J'ai choisi...",
          "Je suis prêt(e)..."
        ],
        style: 'clarity'
      }
    },
    {
      id: 'ex-4-soul-compass',
      type: 'soul-compass',
      title: 'Qu\'est-ce qui te prend en embuscade ?',
      content: {
        centralQuestion: "Qu'est-ce qui déraille généralement ta journée ?",
        options: [
          { id: 'phone', emoji: '📱', text: 'Mon téléphone/les réseaux sociaux' },
          { id: 'people', emoji: '👥', text: 'Les personnes difficiles' },
          { id: 'email', emoji: '📧', text: 'Les e-mails/messages' },
          { id: 'commute', emoji: '🚗', text: 'Le trajet/la circulation' },
          { id: 'anxiety', emoji: '😰', text: 'Ma propre anxiété' },
          { id: 'random', emoji: '🎲', text: 'Les surprises aléatoires' }
        ],
        showIntensity: false,
        followUpQuestion: "Si ça arrivait demain, comment CHOISIRAIS-tu de répondre ?",
        followUpOptions: [
          { id: 'calm', emoji: '🧘', text: 'Avec une acceptation calme' },
          { id: 'focus', emoji: '🔥', text: 'Avec une concentration féroce' },
          { id: 'step-back', emoji: '💭', text: 'En prenant du recul d\'abord' },
          { id: 'unsure', emoji: '🤷', text: "Je ne suis pas sûr(e) encore" }
        ],
        style: 'grounding'
      }
    },
    {
      id: 'ex-4-presence-anchor',
      type: 'presence-anchor',
      title: 'Le souffle du guerrier',
      content: {
        gesture: "Pose ta main droite sur ton cœur, ta main gauche sur ton ventre. Sens les deux monter et descendre.",
        meaning: "Préparé(e) et présent(e)",
        breathCycles: 5,
        exhalePrompts: [
          "J'attends la difficulté...",
          "Je choisis ma réponse...",
          "Je ne suis pas surpris(e)...",
          "Je ne suis pas submergé(e)...",
          "Je suis préparé(e)..."
        ],
        anchorMessage: "Demain matin, avant de toucher ton téléphone, touche ton cœur. Souviens-toi de ce sentiment.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'La plupart des gens se réveillent et réagissent immédiatement. Vérifient le téléphone. Lisent les infos. Se font happer par l’agenda de quelqu’un d’autre. Au moment de sortir, la journée les contrôle déjà.',
      subtext: 'Et si tu inversais ça ?',
      continueLabel: 'Montre-moi comment',
      mood: 'hope',
    },
    {
      id: 'breathing',
      type: 'timer',
      title: 'D’abord : reviens dans ton corps',
      instruction: 'Avant toute chose, prends 5 respirations lentes et profondes. Sens-toi arriver dans ce moment.',
      durationSeconds: 45,
      timerStyle: 'breathing',
      guidanceMessages: [
        'Inspire... retiens... expire lentement.',
        'Ce moment est à toi.',
        'Personne n’a besoin de toi maintenant.',
      ],
      nextStepId: 'anticipate',
    },
    {
      id: 'anticipate',
      type: 'commitment',
      prompt: 'Pense à aujourd’hui. Quelle est une chose qui pourrait te frustrer, t’agacer ou te stresser ? Nomme-la maintenant — pour qu’elle ne te surprenne pas plus tard.',
      placeholder: 'Cette réunion avec... Le trafic sur... Cet e-mail que je dois envoyer...',
      minimumWords: 3,
      guidanceHints: [
        'Qu’est-ce qui pourrait mal tourner ?',
        'Qui pourrait être difficile ?',
        'Qu’est-ce que tu redoutes ?',
      ],
      continueLabel: 'Je le vois venir',
      storeAs: 'anticipated-challenge',
      nextStepId: 'prep-insight',
    },
    {
      id: 'prep-insight',
      type: 'insight',
      text: 'En nommant ce qui pourrait mal se passer, tu lui retires déjà le pouvoir de te surprendre. Un guerrier qui s’attend au combat reste calme quand il arrive. Tu n’es pas négatif(ve) — tu es préparé(e).',
      style: 'reframe',
      followUp: 'Maintenant tu as un choix : quand cette chose arrivera, comment VEUX-tu répondre ?',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'Quand ce défi surgira aujourd’hui, comment veux-tu te présenter ? Quelle réponse te rendrait fier/fière ?',
      minimumWords: 10,
      encouragements: [
        'Que ferait ton moi le plus calme ?',
        'Comment conseillerais-tu un ami dans cette situation ?',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "On appelle cela la « préméditation » — les Stoïciens la pratiquaient chaque matin depuis 2000 ans. Marc Aurèle a écrit : « Commence chaque jour en te disant : aujourd’hui je rencontrerai l’ingérence, l’ingratitude, l’insolence. » Il a dirigé l’Empire romain avec cette pratique.",
          'Tu viens de répéter ta journée avant qu’elle n’arrive. Les athlètes visualisent. Les artistes répètent. Maintenant toi aussi. Le défi viendra — mais tu seras prêt(e).',
          'Tim Ferriss, Ryan Holiday, chaque pratiquant stoïc moderne — tous commencent leur journée ainsi. En 2 minutes, tu t’es donné un avantage que la plupart ne trouvent jamais.',
        ],
      },
    },
  ],
};

const lesson4_MorningMindset_AR: FlexibleLesson = {
  id: 'modern-4-morning-mindset',
  slug: 'morning-mindset',
  order: 4,
  title: 'امتلك صباحك',
  subtitle: 'ابدأ يومك قبل أن يبدأك',
  description: 'ممارسة لمدة دقيقتين تغيّر شعور يومك بالكامل.',
  coreConceptTag: 'preparation',
  xpReward: 18,
  estimatedMinutes: 4,
  thumbnail: { icon: '🌅', color: '#f97316' },
  teaserText: 'غداً ستتعلم ممارسة الصباح لمدة دقيقتين التي استخدمها أباطرة روما والرؤساء التنفيذيون المعاصرون.',
  exercises: [
    {
      id: 'ex-4-truth-mirror',
      type: 'truth-mirror',
      title: 'الوعي بالكمين',
      content: {
        statements: [
          "صباحاتي عادة يخطفها هاتفي.",
          "أستيقظ وأنا متوتر بالفعل من اليوم.",
          "أدع الآخرين يحددون مزاجي.",
          "أتفاجأ عندما تسوء الأمور.",
          "أنا أتفاعل بدلاً من أن أستجيب.",
          "أنسى أن لدي خياراً فيما أشعر به.",
          "أبدأ يومي في موقف دفاعي لا هجومي.",
          "كان بإمكاني التوقع، لكنني عادة لا أفعل."
        ],
        holdReveal: "المحارب يتوقع الكمين. الآن أنت مستعد.",
        breathPrompts: [
          "توقعت...",
          "اخترت...",
          "أنا مستعد..."
        ],
        style: 'clarity'
      }
    },
    {
      id: 'ex-4-soul-compass',
      type: 'soul-compass',
      title: 'ما الذي يكمن لك؟',
      content: {
        centralQuestion: "ما الذي يُخرج يومك عن مساره عادة؟",
        options: [
          { id: 'phone', emoji: '📱', text: 'هاتفي/وسائل التواصل' },
          { id: 'people', emoji: '👥', text: 'الأشخاص الصعبون' },
          { id: 'email', emoji: '📧', text: 'الرسائل/الإيميلات' },
          { id: 'commute', emoji: '🚗', text: 'التنقل/الزحام' },
          { id: 'anxiety', emoji: '😰', text: 'قلقي الشخصي' },
          { id: 'random', emoji: '🎲', text: 'المفاجآت العشوائية' }
        ],
        showIntensity: false,
        followUpQuestion: "إذا حدث هذا غداً، كيف ستختار أن تستجيب؟",
        followUpOptions: [
          { id: 'calm', emoji: '🧘', text: 'بقبول هادئ' },
          { id: 'focus', emoji: '🔥', text: 'بتركيز شرس' },
          { id: 'step-back', emoji: '💭', text: 'بالتراجع أولاً' },
          { id: 'unsure', emoji: '🤷', text: "لست متأكداً بعد" }
        ],
        style: 'grounding'
      }
    },
    {
      id: 'ex-4-presence-anchor',
      type: 'presence-anchor',
      title: 'نَفَس المحارب',
      content: {
        gesture: "ضع يدك اليمنى على قلبك، واليسرى على بطنك. اشعر بهما يرتفعان وينخفضان.",
        meaning: "مستعد وحاضر",
        breathCycles: 5,
        exhalePrompts: [
          "أتوقع الصعوبة...",
          "أختار استجابتي...",
          "لست متفاجئاً...",
          "لست مرتبكاً...",
          "أنا مستعد..."
        ],
        anchorMessage: "غداً صباحاً، قبل أن تلمس هاتفك، المس قلبك. تذكر هذا الشعور.",
        style: 'grounding'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'معظم الناس يستيقظون ويتفاعلون فوراً. يفحصون الهاتف. يقرأون الأخبار. ينجرفون إلى أجندة شخص آخر. بحلول خروجهم، يكون اليوم قد بدأ بالتحكم فيهم.',
      subtext: 'ماذا لو قلبت المعادلة؟',
      continueLabel: 'أرني كيف',
      mood: 'hope',
    },
    {
      id: 'breathing',
      type: 'timer',
      title: 'أولاً: عد إلى جسدك',
      instruction: 'قبل أي شيء، خذ 5 أنفاس بطيئة وعميقة. اشعر بأنك وصلت إلى هذه اللحظة.',
      durationSeconds: 45,
      timerStyle: 'breathing',
      guidanceMessages: [
        'اشهق... احبس... ازفر ببطء.',
        'هذه اللحظة لك.',
        'لا أحد يحتاج منك شيئاً الآن.',
      ],
      nextStepId: 'anticipate',
    },
    {
      id: 'anticipate',
      type: 'commitment',
      prompt: 'فكّر في اليوم. ما الشيء الذي قد يزعجك أو يضايقك أو يسبب لك التوتر؟ سمّه الآن — حتى لا يفاجئك لاحقاً.',
      placeholder: 'ذلك الاجتماع مع... الزحام على... تلك الرسالة التي يجب أن أرسلها...',
      minimumWords: 3,
      guidanceHints: [
        'ما الذي قد يسوء؟',
        'من قد يكون صعباً؟',
        'ما الذي تخشاه؟',
      ],
      continueLabel: 'أراه قادماً',
      storeAs: 'anticipated-challenge',
      nextStepId: 'prep-insight',
    },
    {
      id: 'prep-insight',
      type: 'insight',
      text: 'بمجرد تسمية ما قد يسوء، فقد سلبتَ منه قوة المفاجأة. المحارب الذي يتوقع المعركة يكون هادئاً عند وقوعها. أنت لست سلبياً — أنت مستعد.',
      style: 'reframe',
      followUp: 'الآن لديك خيار: عندما يحدث ذلك، كيف تريد أن تستجيب؟',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'عندما يظهر هذا التحدي اليوم، كيف تريد أن تحضر؟ ما الاستجابة التي ستجعلك فخوراً؟',
      minimumWords: 10,
      encouragements: [
        'ماذا سيفعل أكثر نسخك هدوءاً؟',
        'كيف ستنصح صديقاً في هذا الموقف؟',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'يُسمّى هذا "التمهيد" — كان الرواقيون يمارسونه كل صباح منذ 2000 عام. كتب ماركوس أوريليوس: "ابدأ كل يوم بأن تقول لنفسك: اليوم سألاقي التدخل والجحود والوقاحة." وقد أدار الإمبراطورية الرومانية بهذا التدريب.',
          'لقد تدرّبت على يومك قبل حدوثه. الرياضيون يتخيلون. الفنانون يتدرّبون. الآن أنت أيضاً. التحدي سيأتي — لكنك ستكون مستعداً.',
          'تيم فيريس، ريان هوليداي، وكل ممارس رواقية حديث — يبدأون يومهم بهذه الطريقة. في دقيقتين، منحت نفسك أفضلية لا يجدها معظم الناس أبداً.',
        ],
      },
    },
  ],
};

const lesson5_GratitudeShift_FR: FlexibleLesson = {
  id: 'modern-5-gratitude-shift',
  slug: 'gratitude-shift',
  order: 5,
  title: 'Le basculement de gratitude',
  subtitle: 'Une voie contre-intuitive vers l’appréciation',
  description: 'Utilise l’imagination pour réveiller une vraie gratitude.',
  coreConceptTag: 'gratitude',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '✨', color: '#8b5cf6' },
  teaserText: "Demain, tu découvriras la technique contre-intuitive qui rend la gratitude réelle plutôt que forcée.",
  exercises: [
    {
      id: 'ex-5-truth-mirror',
      type: 'truth-mirror',
      title: 'Les cadeaux invisibles',
      content: {
        statements: [
          "J'ai cessé de remarquer ce que j'ai.",
          "Je cours après ce que je n'ai pas.",
          "Quelqu'un que j'aime pourrait disparaître demain.",
          "Mon corps accomplit des miracles que j'ignore.",
          "J'ai des conforts dont mes ancêtres rêvaient.",
          "Je prends pour acquis des gens qui ne prennent rien de moi.",
          "Tout ce que j'ai est emprunté.",
          "Ce moment ordinaire est en fait extraordinaire."
        ],
        holdReveal: "Ce que tu as n'est pas permanent. Vois-le avant qu'il disparaisse.",
        breathPrompts: [
          "Je le vois...",
          "Je le ressens...",
          "Je suis reconnaissant(e)..."
        ],
        style: 'gratitude'
      }
    },
    {
      id: 'ex-5-soul-compass',
      type: 'soul-compass',
      title: 'Qu\'as-tu cessé de voir ?',
      content: {
        centralQuestion: "Quel cadeau dans ta vie est devenu invisible ?",
        options: [
          { id: 'person', emoji: '👤', text: 'Quelqu\'un qui m\'aime' },
          { id: 'home', emoji: '🏠', text: 'Un endroit sûr où vivre' },
          { id: 'body', emoji: '💪', text: 'Un corps qui fonctionne' },
          { id: 'mind', emoji: '🧠', text: 'Un esprit qui pense' },
          { id: 'time', emoji: '🌅', text: 'Du temps qu\'il me reste' },
          { id: 'food', emoji: '🍽️', text: 'De la nourriture que je prends pour acquise' }
        ],
        showIntensity: true,
        intensityQuestion: "À quel point c'est devenu invisible ?",
        intensityLabels: { low: 'Je le remarque parfois', high: 'Complètement invisible' },
        intensityResponses: {
          low: "Bien - tu le vois encore. Ne le laisse pas disparaître davantage.",
          mid: "Il s'efface. Aujourd'hui, tu l'as remis au premier plan.",
          high: "Il avait disparu de ta vue. Imagine-le parti pour toujours. Tu sens ça ? C'est la gratitude."
        },
        style: 'awakening'
      }
    },
    {
      id: 'ex-5-presence-anchor',
      type: 'presence-anchor',
      title: 'Les mains sur le cœur',
      content: {
        gesture: "Pose les deux mains sur ton cœur, l'une sur l'autre. Presse doucement. Sens les battements de ton cœur.",
        meaning: "Ce cadeau que je n'ai pas mérité",
        breathCycles: 4,
        exhalePrompts: [
          "Pour ce battement de cœur que je n'ai pas mérité...",
          "Pour ce souffle que je n'ai pas demandé...",
          "Pour ce moment que je ne peux pas garder...",
          "Pour cette vie que je n'ai pas méritée..."
        ],
        anchorMessage: "Ton cœur bat sans te le demander. Cela seul est un miracle suffisant.",
        style: 'gratitude'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: "Tu l'as entendu mille fois : « Sois reconnaissant(e). » Mais la gratitude forcée sonne creux. Tu ne peux pas décider de ressentir de la gratitude. Ou si ?",
      subtext: 'Les Stoïciens ont trouvé une porte dérobée vers l’appréciation.',
      continueLabel: 'Montre-moi',
      mood: 'curiosity',
    },
    {
      id: 'loss-visualization',
      type: 'visualization',
      title: 'Le cadeau temporaire',
      instructions: [
        'Pense à quelqu’un que tu aimes. Vois son visage.',
        'Maintenant imagine : et si cette personne disparaissait demain ?',
        'Ressens le poids de cette absence.',
        'Les conversations qui te manqueraient. Les moments perdus.',
        'Reste avec ce sentiment un instant.',
        'Maintenant... ouvre les yeux. Cette personne est toujours là.',
        'Elle a toujours été un cadeau temporaire. Tout comme toi.',
      ],
      paceSeconds: 5,
      style: 'grateful',
      nextStepId: 'gratitude-insight',
    },
    {
      id: 'gratitude-insight',
      type: 'insight',
      text: 'C’est la « visualisation négative » — imaginer la perte pour réveiller l’appréciation. Ce n’est pas morbide. C’est le chemin le plus rapide vers une gratitude authentique. Tu n’as pas besoin de faire semblant. Tu dois seulement te rappeler que tout est temporaire.',
      source: 'William B. Irvine',
      sourceBook: 'Guide de la bonne vie',
      style: 'principle',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'Qu’as-tu maintenant et que tu tiens pour acquis ? Qu’est-ce qui te manquerait terriblement si cela disparaissait ?',
      minimumWords: 15,
      encouragements: [
        'Cela peut être une personne, un lieu, une capacité, un simple confort.',
        'Qu’est-ce qui a toujours été là et que tu remarques à peine ?',
      ],
      nextStepId: 'appreciation-timer',
    },
    {
      id: 'appreciation-timer',
      type: 'timer',
      title: 'Une minute de présence',
      instruction: 'Passe 60 secondes à apprécier ce que tu viens de nommer. Ressens la gratitude — ne la pense pas seulement.',
      durationSeconds: 60,
      timerStyle: 'presence',
      guidanceMessages: [
        'Laisse l’appréciation te remplir.',
        'Ce moment est un cadeau.',
        'Rien ne dure éternellement. C’est ce qui le rend précieux.',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "Tu viens de pratiquer ce que les Stoïciens appelaient « premeditatio malorum » — méditer sur l’adversité. Cela paraît sombre, mais mène à la lumière. Tu vois maintenant ce que tu as plutôt que ce qui te manque.",
          'La gratitude n’est pas une positivité toxique. C’est une vision claire. Tu viens de voir clairement. Les personnes et les choses dans ta vie sont des visiteurs temporaires. Traite-les comme tels.',
          "Sénèque a écrit : « Ce n’est pas l’homme qui a trop peu, mais celui qui désire plus, qui est pauvre. » Tu viens de devenir riche en voyant ce que tu as déjà.",
        ],
      },
    },
  ],
};

const lesson5_GratitudeShift_AR: FlexibleLesson = {
  id: 'modern-5-gratitude-shift',
  slug: 'gratitude-shift',
  order: 5,
  title: 'تحوّل الامتنان',
  subtitle: 'طريق غير بديهي نحو التقدير',
  description: 'استخدم الخيال لتفعيل امتنان حقيقي.',
  coreConceptTag: 'gratitude',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '✨', color: '#8b5cf6' },
  teaserText: 'غداً ستكتشف التقنية غير المتوقعة التي تجعل الامتنان حقيقياً بدلاً من مصطنع.',
  exercises: [
    {
      id: 'ex-5-truth-mirror',
      type: 'truth-mirror',
      title: 'الهدايا الخفية',
      content: {
        statements: [
          "توقفت عن ملاحظة ما لديّ.",
          "أطارد ما ليس لديّ.",
          "قد يختفي شخص أحبه غداً.",
          "جسدي يصنع معجزات أتجاهلها.",
          "لديّ راحات حلم بها أجدادي.",
          "آخذ أناساً كمُسلّمات وهم لا يأخذون مني شيئاً.",
          "كل ما أملكه مُعار.",
          "هذه اللحظة العادية استثنائية فعلاً."
        ],
        holdReveal: "ما لديك ليس دائماً. راه قبل أن يذهب.",
        breathPrompts: [
          "أراه...",
          "أشعر به...",
          "أنا ممتن..."
        ],
        style: 'gratitude'
      }
    },
    {
      id: 'ex-5-soul-compass',
      type: 'soul-compass',
      title: 'ما الذي توقفت عن رؤيته؟',
      content: {
        centralQuestion: "أي هدية في حياتك أصبحت خفية؟",
        options: [
          { id: 'person', emoji: '👤', text: 'شخص يحبني' },
          { id: 'home', emoji: '🏠', text: 'مكان آمن للعيش' },
          { id: 'body', emoji: '💪', text: 'جسد يعمل' },
          { id: 'mind', emoji: '🧠', text: 'عقل يفكر' },
          { id: 'time', emoji: '🌅', text: 'وقت ما زال لديّ' },
          { id: 'food', emoji: '🍽️', text: 'طعام آخذه كمُسلّم' }
        ],
        showIntensity: true,
        intensityQuestion: "كم أصبح هذا خفياً؟",
        intensityLabels: { low: 'ألاحظه أحياناً', high: 'خفي تماماً' },
        intensityResponses: {
          low: "جيد - لا زلت تراه. لا تدعه يتلاشى أكثر.",
          mid: "بدأ يتلاشى. اليوم أعدته للصورة.",
          high: "اختفى من نظرك. الآن تخيله ذهب للأبد. تشعر بذلك؟ هذا هو الامتنان."
        },
        style: 'awakening'
      }
    },
    {
      id: 'ex-5-presence-anchor',
      type: 'presence-anchor',
      title: 'احتضان القلب',
      content: {
        gesture: "ضع كلتا يديك على قلبك، واحدة فوق الأخرى. اضغط برفق. اشعر بنبضات قلبك.",
        meaning: "هذه الهدية التي لم أكسبها",
        breathCycles: 4,
        exhalePrompts: [
          "لهذه النبضة التي لم أكسبها...",
          "لهذا النَفَس الذي لم أطلبه...",
          "لهذه اللحظة التي لا أستطيع الاحتفاظ بها...",
          "لهذه الحياة التي لا أستحقها..."
        ],
        anchorMessage: "قلبك ينبض دون أن يسألك. هذا وحده معجزة كافية.",
        style: 'gratitude'
      }
    }
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: 'سمعت ذلك آلاف المرات: "كن ممتناً". لكن الامتنان القسري يبدو فارغاً. لا يمكنك أن تقرر أن تشعر بالامتنان. أم يمكنك؟',
      subtext: 'وجد الرواقيون باباً خلفياً نحو تقدير صادق.',
      continueLabel: 'أرني',
      mood: 'curiosity',
    },
    {
      id: 'loss-visualization',
      type: 'visualization',
      title: 'الهدية المؤقتة',
      instructions: [
        'فكّر في شخص تحبه. تخيّل وجهه.',
        'الآن تخيّل: ماذا لو غاب غداً؟',
        'اشعر بثقل هذا الغياب.',
        'المحادثات التي ستفتقدها. اللحظات التي ستضيع.',
        'ابقَ مع هذا الشعور للحظة.',
        'الآن... افتح عينيك. هو ما زال هنا.',
        'كان دائماً هدية مؤقتة. وكذلك أنت.',
      ],
      paceSeconds: 5,
      style: 'grateful',
      nextStepId: 'gratitude-insight',
    },
    {
      id: 'gratitude-insight',
      type: 'insight',
      text: 'هذا هو "التصور السلبي" — تخيّل الفقد لاستخراج الامتنان. ليس أمراً كئيباً. إنه أسرع طريق إلى امتنان حقيقي. لا تحتاج إلى التظاهر. فقط تذكّر أن كل شيء مؤقت.',
      source: 'William B. Irvine',
      sourceBook: 'دليل إلى الحياة الطيبة',
      style: 'principle',
      nextStepId: 'reflection',
    },
    {
      id: 'reflection',
      type: 'reflection',
      prompt: 'ما الذي تملكه الآن وتعتبره أمراً مسلّماً به؟ ما الذي ستفتقده بشدة إذا اختفى؟',
      minimumWords: 15,
      encouragements: [
        'قد يكون شخصاً، مكاناً، قدرة، أو راحة بسيطة.',
        'ما الشيء الذي كان دائماً موجوداً بالكاد تلاحظه؟',
      ],
      nextStepId: 'appreciation-timer',
    },
    {
      id: 'appreciation-timer',
      type: 'timer',
      title: 'دقيقة حضور',
      instruction: 'اقضِ 60 ثانية في تقدير ما سمّيته للتو. اشعر بالامتنان — لا تفكر به فقط.',
      durationSeconds: 60,
      timerStyle: 'presence',
      guidanceMessages: [
        'دع التقدير يملؤك.',
        'هذه اللحظة هدية.',
        'لا شيء يدوم للأبد. وهذا ما يجعله ثميناً.',
      ],
      nextStepId: 'reward',
    },
    {
      id: 'reward',
      type: 'reward',
      nextStepId: 'mentor',
    },
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          'لقد مارست ما سماه الرواقيون "premeditatio malorum" — التأمل في الشدائد. يبدو مظلماً، لكنه يقود للنور. الآن ترى ما لديك بدلاً من ما ينقصك.',
          'الامتنان ليس إيجابية سامة. إنه رؤية واضحة. لقد رأيت بوضوح. الأشخاص والأشياء في حياتك زائرون مؤقتون. عاملهم على هذا الأساس.',
          'كتب سينيكا: "ليس الفقير من يملك القليل، بل من يطمع في المزيد." لقد أصبحت غنياً برؤية ما لديك بالفعل.',
        ],
      },
    },
  ],
};

const chapter1_Foundations_FR: FlexibleChapter = {
  id: 'chapter-modern-foundations',
  slug: 'foundations',
  name: 'Fondations',
  subtitle: 'Les essentiels qui changent tout',
  description: 'Cinq pratiques qui forment le socle d’un esprit résilient. Maîtrise-les, et tout le reste devient plus facile.',
  order: 1,
  iconName: 'Zap',
  lessons: [
    lesson1_InstantReframe_FR,
    lesson2_PowerOfTiny_FR,
    lesson3_ObstacleOpportunity_FR,
    lesson4_MorningMindset_FR,
    lesson5_GratitudeShift_FR,
  ],
};

const chapter1_Foundations_AR: FlexibleChapter = {
  id: 'chapter-modern-foundations',
  slug: 'foundations',
  name: 'الأسس',
  subtitle: 'الأساسيات التي تغيّر كل شيء',
  description: 'خمس ممارسات تشكّل أساس ذهن مرن. أتقنها، وسيصبح كل شيء آخر أسهل.',
  order: 1,
  iconName: 'Zap',
  lessons: [
    lesson1_InstantReframe_AR,
    lesson2_PowerOfTiny_AR,
    lesson3_ObstacleOpportunity_AR,
    lesson4_MorningMindset_AR,
    lesson5_GratitudeShift_AR,
  ],
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
