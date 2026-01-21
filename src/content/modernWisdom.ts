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
  title: 'The Instant Reframe',
  subtitle: 'Stop suffering over what you can\'t control',
  description: 'Learn the single question that eliminates 80% of your stress.',
  coreConceptTag: 'control',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🎯', color: '#f59e0b' },
  steps: [
    // STEP 1: The Hook - Paint the pain
    {
      id: 'scenario',
      type: 'scenario',
      narrative: "Something's been weighing on you. Maybe it's a conversation you're dreading. A decision that keeps you up at night. Someone who wronged you. A situation that feels stuck.",
      subtext: "We all carry these invisible weights.",
      bridgeQuestion: "Take a moment. What's bothering you right now?",
      continueLabel: "I have something in mind",
      mood: 'tension',
    },

    // STEP 2: The Pivotal Question
    {
      id: 'control-choice',
      type: 'choice',
      instruction: 'Be honest with yourself',
      question: 'Can you do something about this in the next 5 minutes?',
      options: [
        {
          id: 'yes',
          label: 'Yes, I can take action',
          subtext: 'There\'s something concrete I could do right now',
          nextStepId: 'commit-action',
        },
        {
          id: 'no',
          label: 'No, it\'s outside my control',
          subtext: 'I can\'t change this directly',
          nextStepId: 'acceptance-insight',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // YES PATH - Take Action
    // ═══════════════════════════════════════════════════════════════════════

    // STEP 3a: Write the commitment
    {
      id: 'commit-action',
      type: 'commitment',
      prompt: 'What specifically will you do in the next 5 minutes?',
      placeholder: 'I will send that message... I will make that call... I will start that task...',
      minimumWords: 4,
      guidanceHints: [
        'Be specific - what exactly will you do?',
        'Make it small enough to start immediately',
        'One clear action is all you need',
      ],
      continueLabel: 'I commit to this',
      storeAs: 'commitment',
      nextStepId: 'go-do-it',
    },

    // STEP 4a: The Sacred Dismissal
    {
      id: 'go-do-it',
      type: 'goDoIt',
      sageMessage: "Now go. Do exactly what you wrote. Don't think about it. Don't wait for the perfect moment. The moment is now. I'll be here when you return - but only return after you've taken action. If you return without doing it, you're only lying to yourself.",
      sageSubtext: "Action is the antidote to anxiety.",
      dismissLabel: "I'm going to do it now",
      returnStepId: 'return-check',
    },

    // STEP 5a: Welcome Back
    {
      id: 'return-check',
      type: 'returnConfirm',
      welcomeMessage: 'Welcome back.',
      confirmationQuestion: 'Did you complete the action you committed to?',
      completedOption: {
        label: 'Yes, I did it',
        nextStepId: 'reflection-action',
      },
      didNotCompleteOption: {
        label: 'I didn\'t do it',
        message: "Thank you for your honesty. That takes courage. The opportunity isn't gone - it's waiting. But let's reflect on what held you back, so next time you can break through.",
        nextStepId: 'reflection-action',
      },
    },

    // ═══════════════════════════════════════════════════════════════════════
    // NO PATH - Acceptance
    // ═══════════════════════════════════════════════════════════════════════

    // STEP 3b: The Wisdom of Letting Go
    {
      id: 'acceptance-insight',
      type: 'insight',
      text: "You've just done something most people never do: you honestly admitted this is outside your control. That's not weakness. That's wisdom. Fighting battles you can't win is the source of most suffering.",
      style: 'reframe',
      followUp: "Now let's practice what letting go actually feels like.",
      nextStepId: 'acceptance-visualization',
    },

    // STEP 4b: Visualization Exercise
    {
      id: 'acceptance-visualization',
      type: 'visualization',
      title: 'The Release',
      instructions: [
        'Close your eyes. Take a deep breath.',
        'Picture the thing that\'s been bothering you.',
        'See it clearly. Feel its weight.',
        'Now imagine placing it in an open hand in front of you.',
        'Slowly turn your hand over. Let it fall.',
        'Watch it drift away. It was never yours to carry.',
        'Take another breath. Feel the space where the weight used to be.',
      ],
      paceSeconds: 5,
      style: 'grounding',
      nextStepId: 'reflection-acceptance',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CONVERGENCE - Both paths lead to reflection
    // ═══════════════════════════════════════════════════════════════════════

    // STEP 6a: Reflection (Action path)
    {
      id: 'reflection-action',
      type: 'reflection',
      prompt: 'What did you learn from taking action (or from what held you back)?',
      minimumWords: 10,
      encouragements: [
        'What surprised you?',
        'How do you feel now compared to before?',
        'What would you do differently next time?',
      ],
      nextStepId: 'reward',
    },

    // STEP 6b: Reflection (Acceptance path)
    {
      id: 'reflection-acceptance',
      type: 'reflection',
      prompt: 'What shifted when you practiced letting go? How does it feel to stop fighting what you can\'t control?',
      minimumWords: 10,
      encouragements: [
        'What did releasing feel like?',
        'Is there still resistance? That\'s okay.',
        'What would change if you truly accepted this?',
      ],
      nextStepId: 'reward',
    },

    // STEP 7: Celebration
    {
      id: 'reward',
      type: 'reward',
      celebrationStyle: 'standard',
      nextStepId: 'mentor',
    },

    // STEP 8: Sage's Wisdom
    {
      id: 'mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just practiced the most powerful question in philosophy: 'Is this within my control?' Those four words have freed emperors and prisoners alike. Keep asking it.",
          "This is the foundation of inner peace: knowing where your power ends and acceptance begins. You're not giving up - you're getting strategic about where you spend your energy.",
          "Ryan Holiday wrote an entire book about this - 'The Obstacle Is the Way.' The Stoics knew it 2000 years ago. And now you've felt it yourself.",
        ],
        byChoice: {
          yes: [
            "You didn't just think about change - you created it. That's rare. Most people stay trapped in their heads. You moved your feet. That's the difference between philosophy and transformation.",
            "Action is the cure for anxiety. You proved that today. The thing that was weighing on you? You faced it. That takes courage.",
          ],
          no: [
            "Acceptance isn't defeat - it's wisdom. You stopped wasting energy on a battle you couldn't win. That energy is now available for battles you CAN win.",
            "Letting go isn't giving up. It's growing up. You just practiced a skill that most people never learn. The weight you released - it was never yours to carry.",
          ],
        },
        byCompletion: {
          completed: [
            "You said you would, and you did. That's integrity. That's how identity changes - one kept promise at a time. You're becoming someone who acts.",
          ],
          notCompleted: [
            "You came back and told the truth. That's harder than lying to yourself. The resistance you felt? That's the edge of growth. Next time, you'll know what it feels like - and you'll push through.",
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
