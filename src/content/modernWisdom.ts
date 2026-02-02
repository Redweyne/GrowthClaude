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

import type { FlexibleWorld, FlexibleLesson, FlexibleChapter } from '@/types/lessons';
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
      id: 'ex-1-scenario',
      type: 'scenario',
      title: 'The Traffic Test',
      content: {
        situation: "You're stuck in heavy traffic. You're already 20 minutes late for an important meeting. Your phone is buzzing with messages asking where you are. You feel your frustration rising, your grip tightening on the steering wheel.",
        question: "Using the dichotomy of control, what is within your control right now, and what isn't? How would you respond?",
        hints: [
          "Consider: can you control the traffic?",
          "What CAN you control about this situation?",
          "How would acceptance of what you can't control change your experience?"
        ]
      }
    },
    {
      id: 'ex-1-quote',
      type: 'quote',
      title: 'Epictetus on Freedom',
      content: {
        quote: "Make the best use of what is in your power, and take the rest as it happens. Some things are up to us and some things are not up to us.",
        author: "Epictetus",
        source: "Enchiridion",
        reflectionPrompt: "Think of a current worry in your life. Which parts are truly 'up to you' and which parts are you needlessly trying to control?"
      }
    },
    {
      id: 'ex-1-application',
      type: 'application',
      title: 'Tomorrow\'s Question',
      content: {
        instruction: "Tomorrow, when you notice yourself feeling stressed or worried, pause and ask: 'Is this within my control?' If yes, act. If no, practice acceptance.",
        planPrompt: "What's one specific situation tomorrow where you could apply this question? Be specific about when and where.",
        examples: [
          "When I check my email and see something frustrating",
          "During my commute when things don't go as planned",
          "In a meeting when someone disagrees with me"
        ]
      }
    },
    {
      id: 'ex-1-anchor',
      type: 'anchor',
      title: 'The Open Palms',
      content: {
        gesture: "Open your hands, palms up, fingers relaxed",
        meaning: "This gesture represents releasing what you cannot control. Open palms cannot grip, cannot hold tight, cannot fight against reality.",
        breathPattern: "As you breathe in, notice any tension in your hands. As you breathe out, let your palms open fully, releasing the urge to control.",
        repetitions: 3
      }
    },
    {
      id: 'ex-1-reframe',
      type: 'reframe',
      title: 'Control Reframe',
      content: {
        challengePrompt: "Describe something that's been stressing you out lately - something you keep thinking about but can't seem to resolve.",
        reframeGuide: "Now separate what's within your control from what isn't. Rewrite this situation focusing ONLY on the parts you can actually influence.",
        example: {
          before: "My coworker keeps undermining me in meetings and I can't stop thinking about it",
          after: "I can't control my coworker's behavior, but I can control: how I prepare for meetings, how I respond in the moment, and whether I address it directly with them or my manager"
        }
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
      celebrationStyle: 'breakthrough',
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
      id: 'ex-2-scenario',
      type: 'scenario',
      title: 'The Overwhelmed Beginner',
      content: {
        situation: "Your friend wants to get fit. They buy an expensive gym membership, workout clothes, supplements, and create an ambitious 6-day workout plan. Three weeks later, they've been to the gym twice and feel like a failure. They ask you for advice.",
        question: "Using the power of tiny, what would you tell them? How would you help them redesign their approach?",
        hints: [
          "Think: what's the 2-minute version?",
          "What habit is so small they can't fail?",
          "How does showing up matter more than performance?"
        ]
      }
    },
    {
      id: 'ex-2-quote',
      type: 'quote',
      title: 'James Clear on Identity',
      content: {
        quote: "Every action you take is a vote for the type of person you wish to become. No single instance will transform your beliefs, but as the votes build up, so does the evidence of your new identity.",
        author: "James Clear",
        source: "Atomic Habits",
        reflectionPrompt: "What identity are you voting for with your daily tiny actions? What small habit would cast a vote for the person you want to become?"
      }
    },
    {
      id: 'ex-2-application',
      type: 'application',
      title: 'The 2-Minute Tomorrow',
      content: {
        instruction: "Tomorrow morning, before you do anything else, do a 2-minute version of something you've been wanting to build into your life.",
        planPrompt: "What specific 2-minute habit will you do tomorrow morning? Where will you do it? What's your cue to start?",
        examples: [
          "When my feet hit the floor, I'll do 2 pushups",
          "After I brush my teeth, I'll write one sentence in a journal",
          "Before I check my phone, I'll take 3 deep breaths"
        ]
      }
    },
    {
      id: 'ex-2-anchor',
      type: 'anchor',
      title: 'The Seed Gesture',
      content: {
        gesture: "Touch your thumb to your index finger, forming a small circle - like holding a tiny seed",
        meaning: "This small circle represents the tiny habit - small enough to hold, but containing infinite potential for growth. Every mighty oak started as something this small.",
        breathPattern: "Breathe in and imagine planting this seed. Breathe out and imagine it taking root. Small. Consistent. Unstoppable.",
        repetitions: 3
      }
    },
    {
      id: 'ex-2-reframe',
      type: 'reframe',
      title: 'From All-or-Nothing to Something',
      content: {
        challengePrompt: "What's something you've been failing at because you've been trying to do too much? A goal where you keep starting strong and then quitting?",
        reframeGuide: "Now shrink it. What's the 2-minute version that you could do every single day no matter what? Make it so small it feels almost pointless.",
        example: {
          before: "I want to meditate for 20 minutes every morning but I keep skipping it",
          after: "I will sit down, close my eyes, and take exactly 3 breaths. That's my meditation. Done. I can always do more, but 3 breaths is the only requirement."
        }
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
      celebrationStyle: 'standard',
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
      id: 'ex-3-scenario',
      type: 'scenario',
      title: 'The Unexpected Layoff',
      content: {
        situation: "Your coworker just got laid off after 8 years at the company. They're devastated, angry, and scared. They call you seeking comfort but also convinced their life is ruined.",
        question: "Using 'the obstacle is the way' thinking, how would you help them see this differently? What opportunity might be hiding in this setback?",
        hints: [
          "What doors might this close that needed closing?",
          "What might they pursue now that they wouldn't have before?",
          "How have layoffs transformed other people's lives for the better?"
        ]
      }
    },
    {
      id: 'ex-3-quote',
      type: 'quote',
      title: 'Marcus Aurelius on Obstacles',
      content: {
        quote: "The impediment to action advances action. What stands in the way becomes the way.",
        author: "Marcus Aurelius",
        source: "Meditations",
        reflectionPrompt: "Think of a past obstacle that ended up redirecting your life in a better direction. What 'gift' did that difficulty ultimately give you?"
      }
    },
    {
      id: 'ex-3-application',
      type: 'application',
      title: 'The Obstacle Flip',
      content: {
        instruction: "Tomorrow, when you encounter any frustration or obstacle, immediately ask: 'What opportunity is hiding in this?'",
        planPrompt: "What's one obstacle you're currently facing? How might you actively look for the opportunity within it tomorrow?",
        examples: [
          "The difficult client is teaching me patience and communication skills",
          "The boring task is a chance to practice focus and presence",
          "The rejection is redirecting me somewhere better"
        ]
      }
    },
    {
      id: 'ex-3-anchor',
      type: 'anchor',
      title: 'The Phoenix Rising',
      content: {
        gesture: "Press your palms together at your chest, then slowly raise them overhead while spreading your fingers wide - like flames rising",
        meaning: "Like the phoenix, you rise from what tried to burn you. The gesture transforms downward pressure into upward movement.",
        breathPattern: "Breathe in with palms together. Breathe out as you raise and spread - transforming the obstacle into fuel for your rise.",
        repetitions: 3
      }
    },
    {
      id: 'ex-3-reframe',
      type: 'reframe',
      title: 'From Block to Building Block',
      content: {
        challengePrompt: "What obstacle are you currently facing that feels like it's just blocking your path? Something that seems purely negative?",
        reframeGuide: "Now flip it. What skill, strength, or opportunity could this obstacle be creating for you? How might your future self thank this difficulty?",
        example: {
          before: "I keep getting rejected from jobs and it's destroying my confidence",
          after: "Each rejection is teaching me resilience and helping me refine my approach. The right opportunity hasn't appeared yet because I'm being prepared for something better. This difficulty is building my determination."
        }
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
      celebrationStyle: 'standard',
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
      id: 'ex-4-scenario',
      type: 'scenario',
      title: 'The Reactive Morning',
      content: {
        situation: "Your friend tells you they wake up every day already stressed. They immediately check their phone, see work emails and social media, and feel anxious before they even get out of bed. They say they have no time for a morning routine.",
        question: "How would you help them design a 2-minute morning practice that takes back control of how their day starts?",
        hints: [
          "What could they do BEFORE reaching for their phone?",
          "How can anticipating challenges reduce their power?",
          "What tiny ritual could change their whole morning energy?"
        ]
      }
    },
    {
      id: 'ex-4-quote',
      type: 'quote',
      title: 'Marcus Aurelius at Dawn',
      content: {
        quote: "Begin each day by telling yourself: Today I will meet with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own.",
        author: "Marcus Aurelius",
        source: "Meditations",
        reflectionPrompt: "What typically catches you off guard during your day? How would anticipating it change your reaction?"
      }
    },
    {
      id: 'ex-4-application',
      type: 'application',
      title: 'Morning Premeditation',
      content: {
        instruction: "Tomorrow morning, before checking any devices, spend 2 minutes: 1) Take 5 deep breaths, 2) Ask: what might frustrate me today? 3) Decide: how do I WANT to respond?",
        planPrompt: "What time will you wake up? What's one challenge you can anticipate for tomorrow? How will you choose to respond to it?",
        examples: [
          "The meeting at 10am might get tense - I'll choose to stay curious instead of defensive",
          "Traffic will probably be bad - I'll use that time to listen to something uplifting",
          "My inbox will be full - I'll process it calmly, one email at a time"
        ]
      }
    },
    {
      id: 'ex-4-anchor',
      type: 'anchor',
      title: 'The Warrior\'s Breath',
      content: {
        gesture: "Place your right hand over your heart, left hand on your belly",
        meaning: "This stance connects head and heart, preparation and presence. A warrior prepares for battle not with fear, but with calm readiness.",
        breathPattern: "Breathe in courage through the hand on your belly. Breathe out calm through the hand on your heart. You are prepared. You are ready.",
        repetitions: 5
      }
    },
    {
      id: 'ex-4-reframe',
      type: 'reframe',
      title: 'From Victim to Victor',
      content: {
        challengePrompt: "Describe a recurring frustration in your daily life - something that seems to 'happen to you' regularly and throws off your mood.",
        reframeGuide: "Now rewrite this as something you can anticipate and prepare for. How can you respond to it as a warrior who expected this, not a victim who was surprised?",
        example: {
          before: "My boss always dumps work on me at 5pm and ruins my evening",
          after: "I know my boss often has last-minute requests. At 4:30pm, I'll prepare myself mentally. When it comes, I'll calmly assess: what can wait until tomorrow, and what truly can't? I expected this. I'm ready."
        }
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
      celebrationStyle: 'standard',
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
      id: 'ex-5-scenario',
      type: 'scenario',
      title: 'The Gratitude Skeptic',
      content: {
        situation: "Your friend says: 'I've tried gratitude journals and they feel fake. Listing things I'm grateful for just feels like going through the motions. It doesn't actually change how I feel.'",
        question: "How would you explain negative visualization to them? How is it different from forced gratitude?",
        hints: [
          "Why does imagining loss work better than listing blessings?",
          "How does contrast create genuine appreciation?",
          "What makes this approach feel real instead of performative?"
        ]
      }
    },
    {
      id: 'ex-5-quote',
      type: 'quote',
      title: 'Seneca on Wealth',
      content: {
        quote: "It is not the man who has too little, but the man who craves more, that is poor. What difference does it make how much is in your bank account or in your barns, if you covet your neighbor's harvest and you count not your past blessings, but the blessings you're yet to have?",
        author: "Seneca",
        source: "Letters from a Stoic",
        reflectionPrompt: "What do you already have that you've stopped noticing? What would you desperately miss if it were suddenly gone?"
      }
    },
    {
      id: 'ex-5-application',
      type: 'application',
      title: 'The Temporary Gift Practice',
      content: {
        instruction: "Tomorrow, choose one person or thing you often take for granted. Spend 60 seconds imagining your life without them. Then notice how your appreciation shifts.",
        planPrompt: "Who or what will you focus on tomorrow? Why did you choose this person or thing?",
        examples: [
          "My morning coffee - imagining not having access to it",
          "My ability to walk - imagining being unable to move freely",
          "My partner/friend - imagining they weren't in my life"
        ]
      }
    },
    {
      id: 'ex-5-anchor',
      type: 'anchor',
      title: 'The Heart Hold',
      content: {
        gesture: "Place both hands over your heart, one on top of the other, and gently press",
        meaning: "This gesture physically connects you to what matters. Your heart beats without your effort - a gift you never asked for but always receive.",
        breathPattern: "Breathe in and feel your heart beating under your hands. Breathe out and silently say 'thank you' for this gift you didn't earn.",
        repetitions: 3
      }
    },
    {
      id: 'ex-5-reframe',
      type: 'reframe',
      title: 'From Taking to Receiving',
      content: {
        challengePrompt: "What's something in your life you've completely stopped appreciating? Something that's become so normal you don't even notice it anymore?",
        reframeGuide: "Now imagine it being taken away tomorrow. Really feel the loss. Then write about how this 'ordinary' thing is actually an extraordinary gift.",
        example: {
          before: "My health is fine, nothing special. I just exist.",
          after: "My body woke up today. My lungs filled with air without me asking. My heart has beaten over a billion times without missing. I can see colors, hear music, taste food. This ordinary body is actually a miracle I've been ignoring."
        }
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
      celebrationStyle: 'breakthrough',
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
      id: 'ex-1-scenario',
      type: 'scenario',
      title: 'L’épreuve des embouteillages',
      content: {
        situation: "Tu es coincé dans un embouteillage dense. Tu as déjà 20 minutes de retard pour une réunion importante. Ton téléphone vibre avec des messages qui demandent où tu es. Tu sens ta frustration monter, ta prise se resserrer sur le volant.",
        question: "En utilisant la dichotomie du contrôle, qu’est-ce qui dépend de toi maintenant, et qu’est-ce qui n’en dépend pas ? Comment répondrais-tu ?",
        hints: [
          "Demande-toi : peux-tu contrôler la circulation ?",
          "Que PEUX-TU contrôler dans cette situation ?",
          "Comment l’acceptation de ce que tu ne peux pas contrôler changerait-elle ton expérience ?",
        ],
      },
    },
    {
      id: 'ex-1-quote',
      type: 'quote',
      title: 'Épictète sur la liberté',
      content: {
        quote: "Fais le meilleur usage de ce qui dépend de toi, et prends le reste comme il vient. Certaines choses dépendent de nous et d’autres ne dépendent pas de nous.",
        author: 'Épictète',
        source: 'Manuel (Enchiridion)',
        reflectionPrompt: "Pense à une inquiétude actuelle dans ta vie. Quelles parties dépendent vraiment de toi et quelles parties essaies-tu inutilement de contrôler ?",
      },
    },
    {
      id: 'ex-1-application',
      type: 'application',
      title: 'La question de demain',
      content: {
        instruction: "Demain, dès que tu te surprends à être stressé(e) ou inquiet(ète), fais une pause et demande-toi : 'Est-ce sous mon contrôle ?' Si oui, agis. Si non, pratique l’acceptation.",
        planPrompt: "Quelle situation précise demain pourrais-tu utiliser pour appliquer cette question ? Sois précis(e) sur quand et où.",
        examples: [
          "Quand je consulte mes e-mails et que je vois quelque chose de frustrant",
          "Pendant mon trajet quand tout ne se passe pas comme prévu",
          "En réunion quand quelqu’un n’est pas d’accord avec moi",
        ],
      },
    },
    {
      id: 'ex-1-anchor',
      type: 'anchor',
      title: 'Les paumes ouvertes',
      content: {
        gesture: 'Ouvre tes mains, paumes vers le haut, doigts détendus',
        meaning: "Ce geste représente le fait de relâcher ce que tu ne peux pas contrôler. Des paumes ouvertes ne peuvent pas serrer, ni tenir fort, ni lutter contre la réalité.",
        breathPattern: "À l’inspiration, remarque toute tension dans tes mains. À l’expiration, laisse tes paumes s’ouvrir complètement, en relâchant l’envie de contrôler.",
        repetitions: 3,
      },
    },
    {
      id: 'ex-1-reframe',
      type: 'reframe',
      title: 'Reformuler le contrôle',
      content: {
        challengePrompt: "Décris quelque chose qui te stresse ces temps-ci — quelque chose auquel tu penses sans arrêt mais que tu n’arrives pas à résoudre.",
        reframeGuide: "Sépare maintenant ce qui dépend de toi de ce qui n’en dépend pas. Réécris cette situation en te concentrant UNIQUEMENT sur les parties que tu peux réellement influencer.",
        example: {
          before: "Mon collègue me discrédite en réunion et je n’arrête pas d’y penser",
          after: "Je ne peux pas contrôler le comportement de mon collègue, mais je peux contrôler : ma préparation aux réunions, ma réponse sur le moment, et le fait d’en parler directement avec lui ou mon/ma manager",
        },
      },
    },
  ],
  steps: [
    {
      id: 'opening',
      type: 'scenario',
      narrative: "En ce moment, quelque chose te reste en tête. Cela fait un moment. Peut-être une conversation que tu répètes sans cesse. Un tort qu’on t’a fait. Une décision que tu évites. Une peur du futur qui ne te lâche pas.",
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
      celebrationStyle: 'breakthrough',
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
      id: 'ex-1-scenario',
      type: 'scenario',
      title: 'اختبار الزحام',
      content: {
        situation: 'أنت عالق في ازدحام خانق. أنت متأخر بالفعل 20 دقيقة عن اجتماع مهم. هاتفك يهتز برسائل تسأل أين أنت. تشعر بالإحباط يصعد وتشد قبضتك على المقود.',
        question: 'باستخدام ثنائية التحكم، ما الذي يقع ضمن سيطرتك الآن، وما الذي لا يقع ضمنها؟ كيف ستتصرف؟',
        hints: [
          'فكّر: هل تستطيع التحكم في الزحام؟',
          'ما الذي تستطيع التحكم به في هذا الموقف؟',
          'كيف سيغيّر قبول ما لا تستطيع التحكم به تجربتك؟',
        ],
      },
    },
    {
      id: 'ex-1-quote',
      type: 'quote',
      title: 'إبكتيتوس عن الحرية',
      content: {
        quote: 'استعمل أفضل ما في قدرتك، وتقبّل الباقي كما يحدث. بعض الأمور لنا وبعضها ليس لنا.',
        author: 'إبكتيتوس',
        source: 'الإنخيريديون',
        reflectionPrompt: 'فكّر في قلق حالي في حياتك. أي الأجزاء تقع فعلاً ضمن سيطرتك وأي الأجزاء تحاول التحكم بها بلا جدوى؟',
      },
    },
    {
      id: 'ex-1-application',
      type: 'application',
      title: 'سؤال الغد',
      content: {
        instruction: "غداً، عندما تلاحظ أنك متوتر أو قلق، توقف واسأل: 'هل هذا ضمن سيطرتي؟' إذا نعم فتصرف. وإذا لا فمارس القبول.",
        planPrompt: 'ما موقف محدد غداً يمكنك فيه تطبيق هذا السؤال؟ كن محدداً في الوقت والمكان.',
        examples: [
          'عندما أراجع بريدي الإلكتروني وأرى شيئاً مزعجاً',
          'أثناء تنقلي عندما لا تسير الأمور كما خُطط لها',
          'في اجتماع عندما يختلف معي أحدهم',
        ],
      },
    },
    {
      id: 'ex-1-anchor',
      type: 'anchor',
      title: 'الكفان المفتوحتان',
      content: {
        gesture: 'افتح يديك، الكفان للأعلى، والأصابع مرتخية',
        meaning: 'هذا الإيماء يرمز إلى إطلاق ما لا يمكنك التحكم به. الكفان المفتوحان لا يمكنهما القبض أو التشبث أو مقاومة الواقع.',
        breathPattern: 'مع الشهيق لاحظ أي توتر في يديك. ومع الزفير اترك كفيك ينفتحان تماماً، مطلقاً رغبة التحكم.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-1-reframe',
      type: 'reframe',
      title: 'إعادة صياغة التحكم',
      content: {
        challengePrompt: 'صف شيئاً كان يضغط عليك مؤخراً — شيء تفكر فيه باستمرار ولا تستطيع حله.',
        reframeGuide: 'الآن افصل ما يمكنك التحكم به عما لا يمكنك التحكم به. أعد كتابة الموقف مع التركيز فقط على ما تستطيع التأثير فيه.',
        example: {
          before: 'زميلي يستهين بي في الاجتماعات ولا أستطيع التوقف عن التفكير في ذلك',
          after: 'لا يمكنني التحكم في سلوك زميلي، لكن يمكنني التحكم في: كيف أستعد للاجتماعات، وكيف أرد في اللحظة، وهل أتحدث معه مباشرة أو مع مديري',
        },
      },
    },
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
      celebrationStyle: 'breakthrough',
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
      id: 'ex-2-scenario',
      type: 'scenario',
      title: 'Le débutant dépassé',
      content: {
        situation: "Ton ami veut se mettre en forme. Il achète un abonnement de gym cher, des vêtements de sport, des compléments, et crée un plan ambitieux de 6 jours. Trois semaines plus tard, il n’est allé à la salle que deux fois et se sent nul. Il te demande conseil.",
        question: "Avec le pouvoir du tout petit, que lui dirais-tu ? Comment l’aiderais-tu à repenser son approche ?",
        hints: [
          'Pense : quelle est la version 2 minutes ? ',
          'Quelle habitude est si petite qu’il ne peut pas échouer ?',
          'En quoi se présenter compte plus que la performance ?',
        ],
      },
    },
    {
      id: 'ex-2-quote',
      type: 'quote',
      title: 'James Clear sur l’identité',
      content: {
        quote: "Chaque action que tu entreprends est un vote pour la personne que tu souhaites devenir. Aucune action isolée ne transformera tes croyances, mais à mesure que les votes s’accumulent, les preuves de ta nouvelle identité s’accumulent aussi.",
        author: 'James Clear',
        source: 'Un rien peut tout changer (Atomic Habits)',
        reflectionPrompt: "Pour quelle identité votes-tu avec tes petites actions quotidiennes ? Quelle petite habitude voterait pour la personne que tu veux devenir ?",
      },
    },
    {
      id: 'ex-2-application',
      type: 'application',
      title: 'Les 2 minutes de demain',
      content: {
        instruction: "Demain matin, avant de faire quoi que ce soit, fais une version de 2 minutes de quelque chose que tu veux intégrer à ta vie.",
        planPrompt: 'Quelle habitude précise de 2 minutes feras-tu demain matin ? Où ? Quel sera ton déclencheur ?',
        examples: [
          'Quand mes pieds touchent le sol, je fais 2 pompes',
          'Après m’être brossé les dents, j’écris une phrase dans un journal',
          'Avant de regarder mon téléphone, je prends 3 respirations profondes',
        ],
      },
    },
    {
      id: 'ex-2-anchor',
      type: 'anchor',
      title: 'Le geste de la graine',
      content: {
        gesture: "Touche ton pouce à ton index, formant un petit cercle — comme si tu tenais une graine",
        meaning: "Ce petit cercle représente l’habitude minuscule — assez petite pour tenir dans la main, mais contenant un potentiel infini. Chaque grand chêne a commencé si petit.",
        breathPattern: "Inspire et imagine planter cette graine. Expire et imagine qu’elle prend racine. Petit. Constant. Inarrêtable.",
        repetitions: 3,
      },
    },
    {
      id: 'ex-2-reframe',
      type: 'reframe',
      title: 'Du tout ou rien au quelque chose',
      content: {
        challengePrompt: "Qu’est-ce que tu rates parce que tu essaies d’en faire trop ? Un objectif où tu démarres fort puis abandonnes ?",
        reframeGuide: 'Réduis-le. Quelle est la version 2 minutes que tu pourrais faire chaque jour quoi qu’il arrive ? Fais-la si petite qu’elle semble presque inutile.',
        example: {
          before: "Je veux méditer 20 minutes chaque matin, mais je saute sans cesse",
          after: "Je vais m’asseoir, fermer les yeux, et prendre exactement 3 respirations. C’est ma méditation. Terminé. Je peux toujours faire plus, mais 3 respirations sont la seule exigence.",
        },
      },
    },
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: "Tu as déjà essayé de changer. Tu as commencé fort. Puis la vie a repris. L’abonnement de gym est resté inutilisé. L’appli de méditation a pris la poussière. Le journal est resté vide après le troisième jour.",
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
      celebrationStyle: 'standard',
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
      id: 'ex-2-scenario',
      type: 'scenario',
      title: 'المبتدئ المرهق',
      content: {
        situation: 'يريد صديقك أن يصبح لائقاً. يشتري اشتراكاً مكلفاً في النادي، وملابس رياضية، ومكملات، ويضع خطة تمرين طموحة لستة أيام. بعد ثلاثة أسابيع، ذهب إلى النادي مرتين فقط ويشعر بالفشل. يطلب منك نصيحة.',
        question: 'باستخدام قوة الصغير، ماذا ستقول له؟ وكيف ستساعده على إعادة تصميم نهجه؟',
        hints: [
          'فكّر: ما نسخة الدقيقتين؟',
          'ما العادة الصغيرة جداً التي لا يمكنه أن يفشل فيها؟',
          'كيف أن الحضور أهم من الأداء؟',
        ],
      },
    },
    {
      id: 'ex-2-quote',
      type: 'quote',
      title: 'جيمس كلير عن الهوية',
      content: {
        quote: 'كل فعل تقوم به هو صوت لصالح نوع الشخص الذي ترغب أن تصبحه. لن تغيّر أي مرة واحدة معتقداتك، لكن مع تراكم الأصوات تتراكم أدلة هويتك الجديدة.',
        author: 'James Clear',
        source: 'العادات الذرية (Atomic Habits)',
        reflectionPrompt: 'لأي هوية تصوّت بأفعالك الصغيرة اليومية؟ ما العادة الصغيرة التي ستصوّت للشخص الذي تريد أن تصبحه؟',
      },
    },
    {
      id: 'ex-2-application',
      type: 'application',
      title: 'دقيقتا الغد',
      content: {
        instruction: 'غداً صباحاً، قبل أن تفعل أي شيء آخر، قم بنسخة مدتها دقيقتان من شيء تريد بناءه في حياتك.',
        planPrompt: 'ما العادة المحددة لمدة دقيقتين التي ستقوم بها صباح الغد؟ أين ستفعلها؟ وما الإشارة التي ستبدأ بها؟',
        examples: [
          'عندما تلمس قدماي الأرض، سأقوم بتمرينتي ضغط',
          'بعد أن أفرش أسناني، سأكتب جملة واحدة في دفتر',
          'قبل أن أتحقق من هاتفي، سأأخذ 3 أنفاس عميقة',
        ],
      },
    },
    {
      id: 'ex-2-anchor',
      type: 'anchor',
      title: 'إيماءة البذرة',
      content: {
        gesture: 'المس إبهامك بسبابتك لتصنع دائرة صغيرة — كأنك تمسك بذرة صغيرة',
        meaning: 'هذه الدائرة الصغيرة تمثل العادة الصغيرة جداً — صغيرة بما يكفي لتحملها، لكنها تحمل إمكانات نمو لا نهائية. كل شجرة عظيمة بدأت بهذا الصغر.',
        breathPattern: 'اشهق وتخيل أنك تزرع هذه البذرة. ازفر وتخيل أنها تتجذر. صغير. مستمر. لا يُوقف.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-2-reframe',
      type: 'reframe',
      title: 'من الكل أو لا شيء إلى شيء',
      content: {
        challengePrompt: 'ما الشيء الذي تفشل فيه لأنك تحاول فعل الكثير؟ هدف تبدأه بقوة ثم تتوقف؟',
        reframeGuide: 'الآن صغّره. ما نسخة الدقيقتين التي يمكنك فعلها كل يوم مهما حصل؟ اجعلها صغيرة لدرجة تبدو بلا معنى تقريباً.',
        example: {
          before: 'أريد التأمل لمدة 20 دقيقة كل صباح لكنني أتخطاه باستمرار',
          after: 'سأجلس، أغلق عينيّ، وآخذ ثلاث أنفاس فقط. هذه هي تأملاتي. انتهى. يمكنني فعل المزيد، لكن ثلاث أنفاس هي الشرط الوحيد.',
        },
      },
    },
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
      celebrationStyle: 'standard',
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
      id: 'ex-3-scenario',
      type: 'scenario',
      title: 'Le licenciement inattendu',
      content: {
        situation: "Ton collègue vient d’être licencié après 8 ans dans l’entreprise. Il est dévasté, en colère et effrayé. Il t’appelle pour être réconforté, mais il est convaincu que sa vie est ruinée.",
        question: "Avec la pensée « l’obstacle est le chemin », comment l’aiderais-tu à voir les choses autrement ? Quelle opportunité pourrait se cacher dans ce revers ?",
        hints: [
          'Quelles portes cela ferme-t-il peut-être, et qui devaient se fermer ?',
          'Que pourrait-il poursuivre maintenant qu’il n’aurait pas poursuivi avant ?',
          'Comment des licenciements ont-ils transformé la vie d’autres personnes pour le mieux ?',
        ],
      },
    },
    {
      id: 'ex-3-quote',
      type: 'quote',
      title: 'Marc Aurèle sur les obstacles',
      content: {
        quote: "L’obstacle à l’action fait avancer l’action. Ce qui fait obstacle devient le chemin.",
        author: 'Marc Aurèle',
        source: 'Méditations',
        reflectionPrompt: 'Pense à un obstacle passé qui a fini par réorienter ta vie dans une meilleure direction. Quel « cadeau » cette difficulté t’a-t-elle offert ?',
      },
    },
    {
      id: 'ex-3-application',
      type: 'application',
      title: 'Le retournement de l’obstacle',
      content: {
        instruction: "Demain, lorsque tu rencontres une frustration ou un obstacle, demande immédiatement : « Quelle opportunité se cache ici ? »",
        planPrompt: 'Quel obstacle affrontes-tu en ce moment ? Comment pourrais-tu chercher activement l’opportunité qu’il contient demain ?',
        examples: [
          'Le client difficile m’apprend la patience et la communication',
          'La tâche ennuyeuse est une chance de pratiquer la concentration',
          'Le refus me redirige vers mieux',
        ],
      },
    },
    {
      id: 'ex-3-anchor',
      type: 'anchor',
      title: 'Le phénix qui s’élève',
      content: {
        gesture: 'Presse tes paumes l’une contre l’autre sur la poitrine, puis monte-les lentement au-dessus de ta tête en écartant les doigts — comme des flammes qui montent',
        meaning: 'Comme le phénix, tu t’élèves de ce qui voulait te brûler. Le geste transforme la pression vers le bas en mouvement vers le haut.',
        breathPattern: 'Inspire paumes jointes. Expire en les levant et en les ouvrant — transforme l’obstacle en carburant pour ta montée.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-3-reframe',
      type: 'reframe',
      title: 'Du blocage à la brique',
      content: {
        challengePrompt: 'Quel obstacle affrontes-tu en ce moment qui te donne l’impression de bloquer ton chemin ? Quelque chose de purement négatif ?',
        reframeGuide: 'Renverse-le. Quelle compétence, force ou opportunité cet obstacle crée-t-il pour toi ? Comment ton toi du futur remercierait-il cette difficulté ?',
        example: {
          before: 'Je me fais refuser des emplois et ça détruit ma confiance',
          after: 'Chaque refus m’apprend la résilience et m’aide à affiner ma démarche. La bonne opportunité n’est pas encore apparue parce que je suis en train d’être préparé(e) à mieux. Cette difficulté construit ma détermination.',
        },
      },
    },
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
      celebrationStyle: 'standard',
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
      id: 'ex-3-scenario',
      type: 'scenario',
      title: 'الفصل المفاجئ',
      content: {
        situation: 'تم فصل زميلك للتو بعد 8 سنوات في الشركة. هو محطم وغاضب وخائف. يتصل بك طالباً المواساة، لكنه مقتنع أن حياته انتهت.',
        question: 'باستخدام فكرة "العقبة هي الطريق"، كيف ستساعده على رؤية الأمر بشكل مختلف؟ ما الفرصة التي قد تختبئ في هذه النكسة؟',
        hints: [
          'ما الأبواب التي قد يغلقها هذا وكان يجب أن تُغلق؟',
          'ما الذي قد يلاحقه الآن ولم يكن ليلاحقه من قبل؟',
          'كيف غيّرت عمليات الفصل حياة أشخاص آخرين للأفضل؟',
        ],
      },
    },
    {
      id: 'ex-3-quote',
      type: 'quote',
      title: 'ماركوس أوريليوس عن العوائق',
      content: {
        quote: 'العائق أمام الفعل يقدّم الفعل. ما يقف في الطريق يصبح الطريق.',
        author: 'ماركوس أوريليوس',
        source: 'التأملات',
        reflectionPrompt: 'فكر في عقبة سابقة انتهت بإعادة توجيه حياتك نحو الأفضل. ما "الهدية" التي قدمتها لك تلك الصعوبة في النهاية؟',
      },
    },
    {
      id: 'ex-3-application',
      type: 'application',
      title: 'قلب العقبة',
      content: {
        instruction: 'غداً، عندما تواجه أي إحباط أو عقبة، اسأل فوراً: "ما الفرصة التي تختبئ هنا؟"',
        planPrompt: 'ما العقبة التي تواجهها حالياً؟ كيف يمكن أن تبحث عن الفرصة داخلها غداً؟',
        examples: [
          'العميل الصعب يعلمني الصبر ومهارات التواصل',
          'المهمة المملة فرصة لتدريب التركيز والحضور',
          'الرفض يعيد توجيهي إلى مكان أفضل',
        ],
      },
    },
    {
      id: 'ex-3-anchor',
      type: 'anchor',
      title: 'العنقاء التي تنهض',
      content: {
        gesture: 'اضغط كفيك معاً عند صدرك، ثم ارفعهما ببطء فوق رأسك مع تفريق الأصابع — كأنها ألسنة نار ترتفع',
        meaning: 'مثل العنقاء، تنهض مما حاول إحراقك. الإيماءة تحوّل الضغط إلى حركة صاعدة.',
        breathPattern: 'اشهق مع ضم الكفين. ازفر وأنت ترفع وتفتح — حوّل العقبة إلى وقود للارتقاء.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-3-reframe',
      type: 'reframe',
      title: 'من عائق إلى لبنة',
      content: {
        challengePrompt: 'ما العقبة التي تواجهها الآن وتشعر أنها تسد طريقك؟ شيء يبدو سلبياً بالكامل؟',
        reframeGuide: 'الآن اقلبها. ما المهارة أو القوة أو الفرصة التي قد تخلقها لك هذه العقبة؟ كيف سيشكرك مستقبلك على هذه الصعوبة؟',
        example: {
          before: 'أتعرض للرفض في الوظائف وهذا يحطم ثقتي',
          after: 'كل رفض يعلمني الصمود ويساعدني على تحسين أسلوبي. الفرصة المناسبة لم تظهر بعد لأنني أُعدّ لشيء أفضل. هذه الصعوبة تبني عزيمتي.',
        },
      },
    },
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
      celebrationStyle: 'standard',
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
      id: 'ex-4-scenario',
      type: 'scenario',
      title: 'Le matin réactif',
      content: {
        situation: "Ton ami te dit qu’il se réveille chaque jour déjà stressé. Il attrape immédiatement son téléphone, voit des e-mails de travail et les réseaux sociaux, et se sent anxieux avant même de sortir du lit. Il dit ne pas avoir le temps pour une routine matinale.",
        question: 'Comment l’aiderais-tu à concevoir une pratique matinale de 2 minutes qui lui rend le contrôle du début de sa journée ?',
        hints: [
          'Que pourrait-il faire AVANT de prendre son téléphone ?',
          'Comment l’anticipation des défis peut-elle réduire leur pouvoir ?',
          'Quel petit rituel pourrait changer toute l’énergie de son matin ?',
        ],
      },
    },
    {
      id: 'ex-4-quote',
      type: 'quote',
      title: 'Marc Aurèle à l’aube',
      content: {
        quote: "Commence chaque jour en te disant : aujourd’hui je rencontrerai l’ingérence, l’ingratitude, l’insolence, la déloyauté, la malveillance et l’égoïsme. Mais j’ai vu la beauté du bien et la laideur du mal, et j’ai reconnu que le fautif a une nature apparentée à la mienne.",
        author: 'Marc Aurèle',
        source: 'Méditations',
        reflectionPrompt: 'Qu’est-ce qui te prend habituellement au dépourvu dans ta journée ? Comment l’anticiper changerait ta réaction ?',
      },
    },
    {
      id: 'ex-4-application',
      type: 'application',
      title: 'Préméditation matinale',
      content: {
        instruction: 'Demain matin, avant de consulter tout appareil, passe 2 minutes : 1) prends 5 respirations profondes, 2) demande-toi : qu’est-ce qui pourrait me frustrer aujourd’hui ? 3) décide : comment veux-je répondre ?',
        planPrompt: 'À quelle heure te réveilleras-tu ? Quel est un défi que tu peux anticiper pour demain ? Comment choisiras-tu d’y répondre ?',
        examples: [
          'La réunion de 10h risque d’être tendue — je choisirai de rester curieux(se) plutôt que défensif(ve)',
          'Le trafic sera probablement mauvais — j’utiliserai ce temps pour écouter quelque chose de positif',
          'Ma boîte mail sera pleine — je la traiterai calmement, un e-mail à la fois',
        ],
      },
    },
    {
      id: 'ex-4-anchor',
      type: 'anchor',
      title: 'Le souffle du guerrier',
      content: {
        gesture: 'Pose ta main droite sur ton cœur, ta main gauche sur ton ventre',
        meaning: 'Cette posture relie tête et cœur, préparation et présence. Un guerrier se prépare au combat non par la peur, mais par un calme prêt.',
        breathPattern: 'Inspire le courage par la main sur ton ventre. Expire le calme par la main sur ton cœur. Tu es prêt(e). Tu es prêt(e).',
        repetitions: 5,
      },
    },
    {
      id: 'ex-4-reframe',
      type: 'reframe',
      title: 'De victime à victorieux',
      content: {
        challengePrompt: 'Décris une frustration récurrente dans ta vie quotidienne — quelque chose qui semble « t’arriver » régulièrement et qui te met de mauvaise humeur.',
        reframeGuide: 'Réécris-la maintenant comme quelque chose que tu peux anticiper et préparer. Comment peux-tu répondre comme un guerrier qui s’y attendait, pas comme une victime surprise ?',
        example: {
          before: 'Mon/ma manager me donne toujours du travail à 17h et ruine ma soirée',
          after: 'Je sais que mon/ma manager a souvent des demandes de dernière minute. À 16h30, je me prépare mentalement. Quand cela arrive, j’évalue calmement : qu’est-ce qui peut attendre demain et qu’est-ce qui ne peut pas ? Je m’y attendais. Je suis prêt(e).',
        },
      },
    },
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
      celebrationStyle: 'standard',
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
      id: 'ex-4-scenario',
      type: 'scenario',
      title: 'الصباح التفاعلي',
      content: {
        situation: 'يخبرك صديقك أنه يستيقظ كل يوم وهو متوتر. يفتح هاتفه فوراً، يرى رسائل العمل ووسائل التواصل، ويشعر بالقلق قبل أن ينهض من السرير. يقول إنه لا يملك وقتاً لروتين صباحي.',
        question: 'كيف ستساعده على تصميم ممارسة صباحية لمدة دقيقتين تعيد له السيطرة على بداية يومه؟',
        hints: [
          'ما الذي يمكنه فعله قبل الوصول إلى هاتفه؟',
          'كيف يقلل توقع التحديات من تأثيرها؟',
          'أي طقس صغير يمكن أن يغيّر طاقة صباحه بالكامل؟',
        ],
      },
    },
    {
      id: 'ex-4-quote',
      type: 'quote',
      title: 'ماركوس أوريليوس عند الفجر',
      content: {
        quote: 'ابدأ كل يوم بأن تقول لنفسك: اليوم سألاقي التدخل والجحود والوقاحة وعدم الوفاء وسوء النية والأنانية. لكني رأيت جمال الخير وقبح الشر، وعرفت أن المخطئ له طبيعة قريبة من طبيعتي.',
        author: 'ماركوس أوريليوس',
        source: 'التأملات',
        reflectionPrompt: 'ما الذي يفاجئك عادة خلال يومك؟ كيف سيغيّر توقعه طريقة ردك؟',
      },
    },
    {
      id: 'ex-4-application',
      type: 'application',
      title: 'تأمل الصباح المسبق',
      content: {
        instruction: 'غداً صباحاً، قبل تفقد أي جهاز، اقضِ دقيقتين: 1) خذ 5 أنفاس عميقة، 2) اسأل: ما الذي قد يزعجني اليوم؟ 3) قرر: كيف أريد أن أستجيب؟',
        planPrompt: 'متى ستستيقظ؟ ما التحدي الذي يمكنك توقعه غداً؟ وكيف ستختار الاستجابة له؟',
        examples: [
          'قد يكون اجتماع العاشرة متوتراً — سأختار الفضول بدلاً من الدفاعية',
          'سيكون الزحام سيئاً — سأستغل الوقت للاستماع لشيء ملهم',
          'سيكون بريدي ممتلئاً — سأتعامل معه بهدوء، رسالة تلو الأخرى',
        ],
      },
    },
    {
      id: 'ex-4-anchor',
      type: 'anchor',
      title: 'نَفَس المحارب',
      content: {
        gesture: 'ضع يدك اليمنى على قلبك، واليسرى على بطنك',
        meaning: 'هذه الوقفة تربط الرأس بالقلب، والاستعداد بالحضور. المحارب يستعد للمعركة لا بالخوف بل بهدوء جاهز.',
        breathPattern: 'اشهق الشجاعة عبر اليد على بطنك. ازفر الهدوء عبر اليد على قلبك. أنت مستعد. أنت جاهز.',
        repetitions: 5,
      },
    },
    {
      id: 'ex-4-reframe',
      type: 'reframe',
      title: 'من الضحية إلى المنتصر',
      content: {
        challengePrompt: 'صف إحباطاً متكرراً في حياتك اليومية — شيئاً يبدو أنه "يحدث لك" باستمرار ويؤثر على مزاجك.',
        reframeGuide: 'الآن أعد صياغته كشيء يمكنك توقعه والاستعداد له. كيف يمكنك الرد كشخص محارب كان يتوقع ذلك، لا كضحية تفاجأت؟',
        example: {
          before: 'مديري دائماً يرسل لي عملاً في الساعة الخامسة مساءً ويفسد أمسيتي',
          after: 'أعرف أن مديري غالباً لديه طلبات في اللحظة الأخيرة. عند 4:30 سأستعد ذهنياً. عندما يحدث ذلك، سأقيّم بهدوء: ما الذي يمكن أن ينتظر للغد، وما الذي لا يمكن؟ كنت أتوقع ذلك. أنا مستعد.',
        },
      },
    },
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
      celebrationStyle: 'standard',
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
      id: 'ex-5-scenario',
      type: 'scenario',
      title: 'Le sceptique de la gratitude',
      content: {
        situation: "Ton ami dit : « J’ai essayé les journaux de gratitude et ça sonne faux. Lister ce dont je suis reconnaissant(e) ressemble à une routine. Ça ne change pas vraiment ce que je ressens. »",
        question: 'Comment lui expliquerais-tu la visualisation négative ? En quoi est-elle différente d’une gratitude forcée ?',
        hints: [
          'Pourquoi imaginer la perte fonctionne mieux que lister les bénédictions ?',
          'Comment le contraste crée-t-il une appréciation authentique ?',
          'Qu’est-ce qui rend cette approche réelle plutôt que performative ?',
        ],
      },
    },
    {
      id: 'ex-5-quote',
      type: 'quote',
      title: 'Sénèque sur la richesse',
      content: {
        quote: "Ce n’est pas l’homme qui a trop peu, mais celui qui désire plus, qui est pauvre. Quelle différence cela fait-il combien il y a dans ton compte ou tes greniers, si tu convoites la récolte du voisin et ne comptes pas tes bénédictions passées, mais celles que tu n’as pas encore ?",
        author: 'Sénèque',
        source: 'Lettres à Lucilius',
        reflectionPrompt: 'Qu’as-tu déjà et que tu ne remarques plus ? Qu’est-ce qui te manquerait terriblement si cela disparaissait soudainement ?',
      },
    },
    {
      id: 'ex-5-application',
      type: 'application',
      title: 'La pratique du cadeau temporaire',
      content: {
        instruction: 'Demain, choisis une personne ou une chose que tu prends souvent pour acquise. Passe 60 secondes à imaginer ta vie sans elle. Puis remarque comment ton appréciation change.',
        planPrompt: 'Sur qui ou quoi te concentreras-tu demain ? Pourquoi as-tu choisi cette personne ou cette chose ?',
        examples: [
          'Mon café du matin — imaginer ne plus y avoir accès',
          'Ma capacité à marcher — imaginer ne plus pouvoir bouger librement',
          'Mon/ma partenaire/ami(e) — imaginer qu’il/elle ne soit plus dans ma vie',
        ],
      },
    },
    {
      id: 'ex-5-anchor',
      type: 'anchor',
      title: 'Les mains sur le cœur',
      content: {
        gesture: 'Pose les deux mains sur ton cœur, l’une sur l’autre, et presse doucement',
        meaning: "Ce geste te relie physiquement à ce qui compte. Ton cœur bat sans ton effort — un cadeau que tu n’as pas demandé mais que tu reçois toujours.",
        breathPattern: 'Inspire en sentant ton cœur battre sous tes mains. Expire et dis silencieusement « merci » pour ce cadeau que tu n’as pas mérité.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-5-reframe',
      type: 'reframe',
      title: 'De prendre à recevoir',
      content: {
        challengePrompt: 'Qu’est-ce que tu as complètement arrêté d’apprécier dans ta vie ? Quelque chose de si normal que tu ne le remarques même plus ?',
        reframeGuide: 'Imagine maintenant qu’on te le retire demain. Ressens vraiment la perte. Puis écris comment cette chose « ordinaire » est en réalité un cadeau extraordinaire.',
        example: {
          before: 'Ma santé va bien, rien de spécial. J’existe, voilà tout.',
          after: 'Mon corps s’est réveillé aujourd’hui. Mes poumons se sont remplis d’air sans que je le demande. Mon cœur a battu plus d’un milliard de fois sans faillir. Je peux voir des couleurs, entendre de la musique, goûter la nourriture. Ce corps ordinaire est en fait un miracle que j’ignorais.',
        },
      },
    },
  ],
  steps: [
    {
      id: 'scenario',
      type: 'scenario',
      narrative: "Tu l’as entendu mille fois : « Sois reconnaissant(e). » Mais la gratitude forcée sonne creux. Tu ne peux pas décider de ressentir de la gratitude. Ou si ?",
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
      celebrationStyle: 'breakthrough',
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
      id: 'ex-5-scenario',
      type: 'scenario',
      title: 'المتشكك في الامتنان',
      content: {
        situation: 'يقول صديقك: "لقد جربت دفاتر الامتنان وشعرت أنها زائفة. سرد الأشياء التي أنا ممتن لها يشبه أداء واجب. لا يغيّر شعوري فعلاً."',
        question: 'كيف تشرح له التصور السلبي؟ وكيف يختلف عن الامتنان القسري؟',
        hints: [
          'لماذا يعمل تخيّل الفقد أفضل من تعداد النعم؟',
          'كيف يصنع التباين تقديراً حقيقياً؟',
          'ما الذي يجعل هذا النهج صادقاً بدلاً من استعراض؟',
        ],
      },
    },
    {
      id: 'ex-5-quote',
      type: 'quote',
      title: 'سينيكا عن الثراء',
      content: {
        quote: 'ليس الفقير من يملك القليل، بل من يطمع في المزيد. ما الفرق في مقدار ما لديك في حسابك أو مخازنك إن كنت تشتهي حصاد جارك ولا تعدّ بركاتك الماضية بل البركات التي لم تأت بعد؟',
        author: 'سينيكا',
        source: 'رسائل من رواقـي',
        reflectionPrompt: 'ما الذي لديك بالفعل وتوقفت عن ملاحظته؟ ما الذي ستفتقده بشدة إذا اختفى فجأة؟',
      },
    },
    {
      id: 'ex-5-application',
      type: 'application',
      title: 'ممارسة الهدية المؤقتة',
      content: {
        instruction: 'غداً، اختر شخصاً أو شيئاً تأخذه كأمر مسلّم به. اقضِ 60 ثانية تتخيل حياتك بدونه. ثم لاحظ كيف يتغير تقديرك.',
        planPrompt: 'على من أو على ماذا ستركّز غداً؟ ولماذا اخترت هذا الشخص أو الشيء؟',
        examples: [
          'قهوة الصباح — تخيل عدم توفرها',
          'قدرتي على المشي — تخيل عدم القدرة على الحركة بحرية',
          'الشريك/الصديق — تخيل أنه ليس في حياتي',
        ],
      },
    },
    {
      id: 'ex-5-anchor',
      type: 'anchor',
      title: 'احتضان القلب',
      content: {
        gesture: 'ضع كلتا يديك على قلبك، واحدة فوق الأخرى، واضغط برفق',
        meaning: 'هذا الإيماء يربطك جسدياً بما يهم. قلبك ينبض دون جهد منك — هدية لم تطلبها لكنها تصلك دائماً.',
        breathPattern: 'اشهق واشعر بنبض قلبك تحت يديك. ازفر وقل بصمت "شكراً" لهذه الهدية التي لم تكسبها.',
        repetitions: 3,
      },
    },
    {
      id: 'ex-5-reframe',
      type: 'reframe',
      title: 'من الأخذ إلى التلقي',
      content: {
        challengePrompt: 'ما الشيء في حياتك الذي توقفت تماماً عن تقديره؟ شيء أصبح عادياً لدرجة أنك لا تلاحظه؟',
        reframeGuide: 'تخيله الآن يُسلب منك غداً. اشعر بالخسارة فعلاً. ثم اكتب كيف أن هذا الشيء "العادي" هو في الحقيقة هدية استثنائية.',
        example: {
          before: 'صحتي جيدة، لا شيء مميز. أنا فقط موجود.',
          after: 'جسدي استيقظ اليوم. رئتاي امتلأتا بالهواء دون أن أطلب. قلبي نبض أكثر من مليار مرة دون أن يخفق. أستطيع رؤية الألوان وسماع الموسيقى وتذوق الطعام. هذا الجسد العادي معجزة كنت أتجاهلها.',
        },
      },
    },
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
      celebrationStyle: 'breakthrough',
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
