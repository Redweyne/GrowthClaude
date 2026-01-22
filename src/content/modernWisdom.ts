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
  steps: [
    // ═══════════════════════════════════════════════════════════════════════
    // OPENING - Deep emotional connection
    // ═══════════════════════════════════════════════════════════════════════
    {
      id: 'opening',
      type: 'scenario',
      narrative: "Right now, something is sitting in the back of your mind. It's been there for a while. Maybe it's a conversation you keep rehearsing. A wrong that was done to you. A decision you've been avoiding. A fear about the future that won't let go.",
      mood: 'tension',
    },

    {
      id: 'scenario-2',
      type: 'scenario',
      narrative: "You can feel it right now, can't you? That familiar weight. The mental loop that plays when you're trying to fall asleep. The tension that lives in your shoulders, your chest, your jaw.",
      subtext: "This weight is real. And today, we're going to do something about it.",
      bridgeQuestion: "Are you ready to face it?",
      continueLabel: "Yes, I'm ready",
      mood: 'tension',
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
    },

    {
      id: 'acceptance-visualization',
      type: 'visualization',
      title: 'The Release',
      instructions: [
        'Close your eyes. Take three deep breaths.',
        'Now picture the thing you named. See it clearly in your mind.',
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

const chapter1_Foundations: FlexibleChapter = {
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

export const modernWisdomWorld: FlexibleWorld = {
  id: 'world-modern-wisdom',
  slug: 'modern-wisdom',
  name: 'Modern Wisdom',
  subtitle: 'Ancient philosophy, modern life',
  description: 'Fifteen transformative lessons based on the best modern books: Atomic Habits, The Obstacle Is the Way, Antifragile, and more. Build resilience, master relationships, and design an unshakeable foundation.',
  iconName: 'Sparkles',
  color: '#f59e0b',
  order: 1,
  isPremium: false,
  estimatedDays: 15,
  totalLessons: 15,
  chapters: [chapter1_Foundations, chapter2_Resilience, chapter3_Relationships],
};

export default modernWisdomWorld;
