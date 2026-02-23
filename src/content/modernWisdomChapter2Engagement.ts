// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2: RESILIENCE - Engagement Path Steps
// ═══════════════════════════════════════════════════════════════════════════
// These are the engagement-only (no writing) versions of each lesson.
// They replace commitments/deep reflections with resonanceChecks,
// scaleRatings, tapFlows, and affirmations — but still include a
// lightweight reflection step before the reward.
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, LessonStep } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6: THE COMEBACK FORMULA (Engagement Path)
// Pattern: Scenario → Scenario2 → ResonanceCheck → Insight → Choice →
//          Branch TapFlows → Reflection → Reward → Closing Insight → Mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson6: FlexibleLesson = {
  id: 'modern-6-comeback-formula',
  slug: 'comeback-formula',
  order: 1,
  title: 'The Comeback Formula',
  subtitle: 'Turn any setback into a setup',
  description: 'Learn the 3-step process that transforms failures into fuel.',
  coreConceptTag: 'resilience',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🔥', color: '#ef4444' },
  teaserText: "Tomorrow you'll learn the 3-step formula that turned Michael Jordan's greatest failure into his greatest strength.",
  // exercises: [], — defined in chapter file
  steps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "Something didn't go the way you planned. Maybe it was small — a missed opportunity, a conversation that went sideways. Maybe it was big — a rejection that knocked the wind out of you. Either way, you're carrying it.",
      subtext: "Every comeback story starts right here. In the wreckage.",
      continueLabel: "I know the feeling",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Here's what nobody tells you: the setback itself is not the problem. It's the story you attach to it. 'I'm not good enough.' 'It's never going to work.' 'I should just give up.' Those stories are the real enemy. And today, you're going to rewrite them.",
      bridgeQuestion: "Ready to learn the formula?",
      continueLabel: "Show me",
      mood: 'hope',
      nextStepId: 'e-setback-type',
    },
    {
      id: 'e-setback-type',
      type: 'resonanceCheck',
      prompt: "What kind of setback are you carrying right now?",
      instruction: "Tap everything that resonates",
      options: [
        { id: 'rejection', text: 'A rejection that stung' },
        { id: 'failure', text: 'Something I tried and failed at' },
        { id: 'relationship', text: 'A relationship that fell apart' },
        { id: 'missed', text: 'An opportunity I missed' },
        { id: 'mistake', text: 'A mistake I keep replaying' },
        { id: 'stalled', text: 'Progress that completely stalled' },
        { id: 'trust', text: 'Someone who let me down' },
        { id: 'self', text: 'I let myself down' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'setback-type',
      nextStepId: 'e-weight-check',
    },
    {
      id: 'e-weight-check',
      type: 'scaleRating',
      prompt: "How much is this setback still affecting you?",
      lowLabel: 'A bruise',
      highLabel: 'A wound',
      steps: 5,
      storeAs: 'setback-weight',
      responsesByRange: {
        low: "Even small setbacks deserve the comeback treatment. Let's sharpen the blade.",
        mid: "You've been sitting with this. It's time to turn it into something useful.",
        high: "That's heavy. But the deepest wounds produce the most powerful comebacks.",
      },
      nextStepId: 'e-formula-insight',
    },
    {
      id: 'e-formula-insight',
      type: 'insight',
      text: "The Comeback Formula has three steps. Feel it. Learn from it. Move on it. Most people skip step one — they suppress the pain. Then they skip step two — they don't extract the lesson. Then they repeat step three with no wisdom behind it. That's not a comeback. That's a loop.",
      style: 'principle',
      followUp: "Let's walk through each step.",
      nextStepId: 'e-feel-choice',
    },
    {
      id: 'e-feel-choice',
      type: 'choice',
      question: "Step 1: FEEL IT. How do you usually handle setbacks?",
      instruction: "Be honest with yourself",
      options: [
        {
          id: 'suppress',
          label: 'I push it down and move on',
          subtext: 'Pretend it doesn\'t bother me',
          nextStepId: 'e-suppress-path',
        },
        {
          id: 'dwell',
          label: 'I spiral and overthink it',
          subtext: 'Replay it endlessly in my head',
          nextStepId: 'e-dwell-path',
        },
      ],
    },
    // SUPPRESS PATH
    {
      id: 'e-suppress-path',
      type: 'tapFlow',
      title: 'Feel It First',
      instructions: [
        'You push pain down because you think it makes you strong.',
        'But suppressed pain doesn\'t disappear.',
        'It becomes anxiety. Numbness. Quiet resentment.',
        'Right now, for just a moment, let yourself feel the sting.',
        'Not to wallow. To acknowledge.',
        'Say to yourself: "This hurt. And that\'s okay."',
        'Feel it move through you, not get stuck in you.',
        'Good. You felt it. Now you\'re ready for the next step.',
      ],
      style: 'grounding',
      nextStepId: 'e-learn-insight',
    },
    // DWELL PATH
    {
      id: 'e-dwell-path',
      type: 'tapFlow',
      title: 'Feel It — Then Release It',
      instructions: [
        'You feel things deeply. That\'s not weakness — that\'s awareness.',
        'But there\'s a difference between feeling and spiraling.',
        'Feeling says: "This hurt."',
        'Spiraling says: "This will always hurt."',
        'Right now, let the feeling exist without the story.',
        'No analysis. No predictions. Just the raw emotion.',
        'Breathe. It\'s passing through you.',
        'It visited. It doesn\'t have to live here.',
      ],
      style: 'grounding',
      nextStepId: 'e-learn-insight',
    },
    // CONVERGE
    {
      id: 'e-learn-insight',
      type: 'insight',
      text: "Step 2: LEARN FROM IT. Every setback carries a lesson that can only be seen once the emotions clear. Michael Jordan was cut from his high school basketball team. The lesson? 'Work harder than everyone.' That lesson built a dynasty.",
      style: 'revelation',
      nextStepId: 'e-lesson-check',
    },
    {
      id: 'e-lesson-check',
      type: 'resonanceCheck',
      prompt: "What might your setback be teaching you?",
      instruction: "Tap what feels true",
      options: [
        { id: 'prepare', text: 'To prepare more thoroughly' },
        { id: 'boundaries', text: 'To set better boundaries' },
        { id: 'patience', text: 'To be more patient with the process' },
        { id: 'adapt', text: 'To be more adaptable' },
        { id: 'self-worth', text: 'That my worth isn\'t defined by outcomes' },
        { id: 'direction', text: 'That I need a different direction' },
        { id: 'people', text: 'To choose people more carefully' },
        { id: 'resilience', text: 'That I\'m stronger than I thought' },
      ],
      minSelections: 1,
      maxSelections: 2,
      storeAs: 'setback-lesson',
      nextStepId: 'e-move-affirmation',
    },
    {
      id: 'e-move-affirmation',
      type: 'affirmation',
      preText: "Step 3: MOVE ON IT. A comeback is not something you think about. It's something you do.",
      statement: "I refuse to let this setback define me. I will use it to refine me.",
      subtext: "Feel. Learn. Move. That's the formula.",
      confirmLabel: "This is my comeback",
      style: 'strength',
      nextStepId: 'e-reflection',
    },
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "How does it feel to have a comeback plan? What shifted in you during this process?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "The three-step comeback formula — Feel, Learn, Move — is not a theory. It's the pattern behind every great recovery in history. From Jordan to Oprah to your own life. The setback is never the end. It's the setup for what comes next.",
      source: 'The Comeback Formula',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just turned a setback into a setup. Most people let failures define them. You used yours to refine you. That's the difference between people who fade and people who become legendary.",
        ],
        byChoice: {
          suppress: [
            "You tend to push pain down — and today you let yourself feel it instead. That takes real courage. The more you practice this, the less power setbacks have over you. Feel it, learn from it, move. You've got the formula now.",
          ],
          dwell: [
            "You tend to spiral — and today you separated the feeling from the story. That's a breakthrough. The pain is real. The catastrophizing isn't. Feel it, extract the lesson, and move. You just proved you can do all three.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7: EMBRACE THE STRUGGLE (Engagement Path)
// Pattern: Scenario → ScaleRating → Insight → Choice →
//          Branch (Affirmation/TapFlow) → Reflection → Reward →
//          Closing Insight → Mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson7: FlexibleLesson = {
  id: 'modern-7-embrace-struggle',
  slug: 'embrace-struggle',
  order: 2,
  title: 'Embrace the Struggle',
  subtitle: 'Why comfort is the enemy of growth',
  description: 'Discover why voluntary hardship builds unshakeable strength.',
  coreConceptTag: 'discomfort',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '💪', color: '#8b5cf6' },
  teaserText: "Tomorrow you'll learn why the Navy SEALs, Spartans, and Stoics all embraced voluntary discomfort — and why you should too.",
  // exercises: [], — defined in chapter file
  steps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "Your brain has one job above all others: keep you alive. And it does this by steering you toward comfort and away from pain. The problem? Growth only happens outside the comfort zone. Your survival instinct is sabotaging your potential.",
      subtext: "What if the struggle isn't the enemy — but the teacher?",
      continueLabel: "I'm listening",
      mood: 'curiosity',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "The Spartans trained in freezing rivers. Seneca voluntarily slept on the floor and wore rough clothing. David Goggins runs ultra-marathons in broken feet. These aren't masochists. They're people who discovered the secret: voluntary hardship makes involuntary hardship bearable.",
      bridgeQuestion: "How comfortable has your life become?",
      continueLabel: "Let me think about that",
      mood: 'tension',
      nextStepId: 'e-comfort-check',
    },
    {
      id: 'e-comfort-check',
      type: 'scaleRating',
      prompt: "How often do you voluntarily choose discomfort?",
      lowLabel: 'Almost never',
      highLabel: 'All the time',
      steps: 5,
      storeAs: 'comfort-level',
      responsesByRange: {
        low: "Honest answer. Most people live here. The comfort trap is invisible until you see it.",
        mid: "You push yourself sometimes. But there's another level waiting for you.",
        high: "You already know the power. Today we go deeper into why it works.",
      },
      nextStepId: 'e-core-insight',
    },
    {
      id: 'e-core-insight',
      type: 'insight',
      text: "David Goggins calls it 'callousing the mind.' Every time you voluntarily choose something hard — cold water, an extra rep, a difficult conversation, sitting in silence — you build mental calluses. And those calluses protect you when life punches you in the face without warning.",
      source: 'David Goggins',
      sourceBook: "Can't Hurt Me",
      style: 'principle',
      followUp: "Which kind of hard are you willing to try?",
      nextStepId: 'e-challenge-choice',
    },
    {
      id: 'e-challenge-choice',
      type: 'choice',
      question: 'Which type of voluntary discomfort speaks to you?',
      instruction: 'Pick the one that makes you slightly uncomfortable',
      options: [
        {
          id: 'physical',
          label: 'Physical Challenge',
          subtext: 'Cold water, extra reps, skipping the elevator',
          nextStepId: 'e-physical-tapflow',
        },
        {
          id: 'mental',
          label: 'Mental Challenge',
          subtext: 'Silence, delayed gratification, facing boredom',
          nextStepId: 'e-mental-tapflow',
        },
      ],
    },
    // PHYSICAL PATH
    {
      id: 'e-physical-tapflow',
      type: 'tapFlow',
      title: 'The Body Leads',
      instructions: [
        'Your body is the gateway to mental toughness.',
        'When you choose physical discomfort, your brain panics.',
        '"Stop! This is unnecessary! You could be on the couch!"',
        'That voice is your survival instinct. It\'s not trying to help you grow.',
        'Every cold shower, every extra rep, every flight of stairs...',
        '...is a vote for the version of you that cannot be broken.',
        'The Spartans knew it. The SEALs know it. Now you know it.',
        'The body leads. The mind follows.',
      ],
      style: 'fearless',
      nextStepId: 'e-commit-affirmation',
    },
    // MENTAL PATH
    {
      id: 'e-mental-tapflow',
      type: 'tapFlow',
      title: 'The Silence Within',
      instructions: [
        'Mental discomfort is the hardest kind to choose.',
        'Sitting with boredom. Waiting without checking your phone.',
        'Having the difficult conversation instead of avoiding it.',
        'Your brain craves stimulation like a drug.',
        'But the person who can sit in silence, who can delay gratification...',
        '...that person has a superpower.',
        'Seneca wrote: "Set aside a number of days during which you shall be content with the scantiest fare."',
        'Not because suffering is good. Because the freedom from needing comfort — that is power.',
      ],
      style: 'grounding',
      nextStepId: 'e-commit-affirmation',
    },
    // CONVERGE
    {
      id: 'e-commit-affirmation',
      type: 'affirmation',
      preText: "You've chosen your edge. Now claim it.",
      statement: "I will voluntarily do one hard thing today. Not because I have to. Because I choose to.",
      subtext: "Comfort is the enemy. The struggle is the teacher.",
      confirmLabel: "I choose the hard thing",
      style: 'strength',
      nextStepId: 'e-reflection',
    },
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What did you notice during the challenge? How did it feel to voluntarily choose something hard?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "Seneca practiced voluntary poverty once a month. He'd eat the simplest food, wear his roughest clothes, and sleep without luxury. Not to punish himself — but to look his worst fear in the eye and say: 'Is this what I've been afraid of? This is nothing.'",
      source: 'Seneca',
      sourceBook: 'Letters from a Stoic',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You chose to face the hard thing instead of running from it. That single decision — repeated daily — is the difference between fragile and unbreakable. The callus is forming. Keep building it.",
        ],
        byChoice: {
          physical: [
            "You chose the physical path. The body is where toughness begins. Cold water, hard reps, deliberate discomfort — these are the training ground for an unbreakable spirit. Do one physical hard thing today. Your future self will thank you.",
          ],
          mental: [
            "You chose the mental path — the harder of the two, if we're honest. Sitting with silence, resisting impulse, choosing stillness in a world of noise. That is rare. Practice it today. Even five minutes of chosen boredom rewires who you are.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8: FEAR-SETTING (Engagement Path)
// Pattern: Scenario → Scenario2 → ResonanceCheck → Insight → Choice →
//          Branch TapFlows → ScaleRating → Reflection → Reward →
//          Closing Insight → Mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson8: FlexibleLesson = {
  id: 'modern-8-fear-setting',
  slug: 'fear-setting',
  order: 3,
  title: 'Fear-Setting',
  subtitle: "Tim Ferriss's antidote to paralysis",
  description: 'Define your fears to disarm them. A powerful exercise for making hard decisions.',
  coreConceptTag: 'fear',
  xpReward: 25,
  estimatedMinutes: 6,
  thumbnail: { icon: '🎯', color: '#f59e0b' },
  teaserText: "Tomorrow you'll learn the fear-dissolving technique that Tim Ferriss credits with saving his life.",
  // exercises: [], — defined in chapter file
  steps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "There's something you've been avoiding. A conversation. A decision. A leap you know you need to take. You keep telling yourself you'll do it 'when the time is right.' But the time never feels right, does it?",
      subtext: "The thing you're most afraid to do is usually the thing you most need to do.",
      continueLabel: "That's painfully accurate",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Tim Ferriss was at the lowest point of his life when he developed this technique. He was paralyzed by fear — unable to make any decision because every path seemed terrifying. Then he realized: his fears were undefined. And undefined fears are infinite. Defined fears are finite.",
      bridgeQuestion: "What if you could shrink your fear to its actual size?",
      continueLabel: "Teach me how",
      mood: 'hope',
      nextStepId: 'e-fear-type',
    },
    {
      id: 'e-fear-type',
      type: 'resonanceCheck',
      prompt: "What type of fear is keeping you stuck?",
      instruction: "Tap what sounds like you",
      options: [
        { id: 'failure', text: 'Fear of failing publicly' },
        { id: 'rejection', text: 'Fear of being rejected' },
        { id: 'money', text: 'Fear of financial ruin' },
        { id: 'judgment', text: 'Fear of what people will think' },
        { id: 'unknown', text: 'Fear of the unknown' },
        { id: 'success', text: 'Fear of actually succeeding' },
        { id: 'loss', text: 'Fear of losing what I have' },
        { id: 'inadequacy', text: 'Fear that I\'m not enough' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'fear-type',
      nextStepId: 'e-ferriss-insight',
    },
    {
      id: 'e-ferriss-insight',
      type: 'insight',
      text: "Fear-Setting has three steps: DEFINE the absolute worst case. PREVENT — what can you do to reduce the odds? REPAIR — if the worst happens anyway, how would you recover? When you run these three steps, something remarkable happens: the fear shrinks to its real size. And it's almost always smaller than you imagined.",
      source: 'Tim Ferriss',
      sourceBook: 'The 4-Hour Workweek',
      style: 'principle',
      followUp: "Let's walk through this with your fear.",
      nextStepId: 'e-worst-case-choice',
    },
    {
      id: 'e-worst-case-choice',
      type: 'choice',
      question: "If you took the leap, what's your biggest fear about what happens next?",
      instruction: 'Pick the one that makes your stomach drop',
      options: [
        {
          id: 'external',
          label: 'Something external goes wrong',
          subtext: 'I lose money, get rejected, face consequences',
          nextStepId: 'e-external-tapflow',
        },
        {
          id: 'internal',
          label: 'Something internal breaks',
          subtext: 'I prove I\'m not good enough, I humiliate myself',
          nextStepId: 'e-internal-tapflow',
        },
      ],
    },
    // EXTERNAL PATH
    {
      id: 'e-external-tapflow',
      type: 'tapFlow',
      title: 'Define. Prevent. Repair.',
      instructions: [
        'You fear an external consequence. Let\'s look at it directly.',
        'DEFINE: Imagine the worst version of this outcome.',
        'Really see it. The loss. The rejection. The fallout.',
        'Now ask: has anyone in history survived this exact thing?',
        'The answer is almost certainly yes. Many have.',
        'PREVENT: What steps could you take right now to reduce the risk?',
        'A conversation. A backup plan. A safety net.',
        'REPAIR: Even if the worst happened, you\'d rebuild. You\'ve rebuilt before.',
        'The fear was infinite in the dark. In the light, it has edges.',
      ],
      style: 'fearless',
      nextStepId: 'e-cost-scale',
    },
    // INTERNAL PATH
    {
      id: 'e-internal-tapflow',
      type: 'tapFlow',
      title: 'Define. Prevent. Repair.',
      instructions: [
        'You fear what failure would say about you. That\'s the deepest fear there is.',
        'DEFINE: What\'s the story you\'re afraid of? "I\'m not smart enough"? "I don\'t belong"?',
        'Notice: that story already exists in your head. You\'re already afraid of it.',
        'The leap doesn\'t create the fear. It just exposes what\'s already there.',
        'PREVENT: What if you separated your identity from the outcome?',
        'You are not your results. You are the person brave enough to try.',
        'REPAIR: If you fail, what actually changes about who you are? Nothing.',
        'You tried. That makes you braver than everyone who didn\'t.',
        'The only failure that defines you is the one you never attempted.',
      ],
      style: 'fearless',
      nextStepId: 'e-cost-scale',
    },
    // CONVERGE
    {
      id: 'e-cost-scale',
      type: 'scaleRating',
      prompt: "Now flip it: what's the cost of doing NOTHING? If you stay stuck for another year, how much will you regret it?",
      lowLabel: 'Some regret',
      highLabel: 'Deep regret',
      steps: 5,
      storeAs: 'inaction-cost',
      responsesByRange: {
        low: "Even mild regret compounds over years. A life of small avoidances adds up.",
        mid: "You already sense this matters. The cost of inaction is real, even if it's silent.",
        high: "That's the truth your fear was hiding from you. Inaction is the real risk.",
      },
      nextStepId: 'e-courage-affirmation',
    },
    {
      id: 'e-courage-affirmation',
      type: 'affirmation',
      preText: "You defined your fear. You saw that you could prevent it, repair from it, and that inaction costs more.",
      statement: "The fear is real. But the cost of staying stuck is greater. I choose to move.",
      confirmLabel: "I choose courage",
      style: 'commitment',
      nextStepId: 'e-reflection',
    },
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What is the true cost of NOT taking this action? What will you regret if you stay stuck?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "Tim Ferriss says: 'What we fear doing most is usually what we most need to do.' Fear-Setting doesn't eliminate fear — it right-sizes it. And a right-sized fear is one you can walk through.",
      source: 'Tim Ferriss',
      sourceBook: 'The 4-Hour Workweek',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just did what most people never do: you looked your fear in the eye and measured it. It didn't disappear — but it shrank. That's the power of defining what terrifies you. Now you can make a decision from clarity, not panic.",
        ],
        byChoice: {
          external: [
            "You feared an external consequence — and you discovered that you could prevent it, survive it, and rebuild from it. The worst case has edges now. It's not infinite anymore. That changes everything about your ability to act.",
          ],
          internal: [
            "You feared what failure would say about you — the deepest fear there is. And you realized: your identity is not your outcomes. You are the person brave enough to try. No result can take that away from you.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9: THE ANTIFRAGILE MIND (Engagement Path)
// Pattern: Scenario → Scenario2 → ResonanceCheck → Insight → Choice →
//          Branch TapFlows → Affirmation → Reflection → Reward →
//          Closing Insight → Mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson9: FlexibleLesson = {
  id: 'modern-9-antifragile-mind',
  slug: 'antifragile-mind',
  order: 4,
  title: 'The Antifragile Mind',
  subtitle: 'How to grow from chaos',
  description: "Based on Nassim Taleb's concept: become someone who gains from disorder.",
  coreConceptTag: 'antifragile',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🧬', color: '#10b981' },
  teaserText: "Tomorrow you'll discover why some people get STRONGER from chaos while others break — and how to become the former.",
  // exercises: [], — defined in chapter file
  steps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "Drop a glass on the floor. It shatters. That's fragile. Drop a rubber ball. It bounces back. That's resilient. But there's a third category that almost nobody talks about — something that gets STRONGER when you drop it.",
      subtext: "What if your mind could work that way?",
      continueLabel: "Tell me more",
      mood: 'curiosity',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Your muscles don't just survive the gym — they grow back stronger. Your immune system doesn't just fight infection — it builds antibodies for next time. Bones get denser under stress. What if your mind followed the same law? Nassim Taleb has a word for this. He calls it antifragile.",
      bridgeQuestion: "Which are you right now — fragile, resilient, or antifragile?",
      continueLabel: "Let me find out",
      mood: 'curiosity',
      nextStepId: 'e-current-state',
    },
    {
      id: 'e-current-state',
      type: 'resonanceCheck',
      prompt: "When life hits you hard, what's your default response?",
      instruction: "Be honest — tap what sounds like you",
      options: [
        { id: 'avoid', text: 'I try to avoid stress at all costs' },
        { id: 'survive', text: 'I grit my teeth and survive it' },
        { id: 'crumble', text: 'I tend to fall apart under pressure' },
        { id: 'numb', text: 'I go numb and shut down' },
        { id: 'adapt', text: 'I adapt and find a way through' },
        { id: 'grow', text: 'I actually get better from it' },
        { id: 'angry', text: 'I get angry and use it as fuel' },
        { id: 'depends', text: 'It depends on the day' },
      ],
      minSelections: 1,
      maxSelections: 2,
      storeAs: 'stress-response',
      nextStepId: 'e-taleb-insight',
    },
    {
      id: 'e-taleb-insight',
      type: 'insight',
      text: "Taleb writes: 'Wind extinguishes a candle and energizes fire. You want to be the fire, wishing for the wind.' The fragile break under volatility. The resilient survive it. The antifragile NEED it to reach their full potential. The question is: how do you become the fire?",
      source: 'Nassim Taleb',
      sourceBook: 'Antifragile',
      style: 'principle',
      followUp: "It starts with how you frame what's happening to you.",
      nextStepId: 'e-stressor-choice',
    },
    {
      id: 'e-stressor-choice',
      type: 'choice',
      question: "Think of a current stressor in your life. How does it make you feel?",
      instruction: "Pick the honest answer",
      options: [
        {
          id: 'threatened',
          label: 'Threatened — it feels like damage',
          subtext: 'This is hurting me and I want it to stop',
          nextStepId: 'e-reframe-tapflow',
        },
        {
          id: 'challenged',
          label: 'Challenged — it feels like a test',
          subtext: 'This is hard but I sense growth in it',
          nextStepId: 'e-amplify-tapflow',
        },
      ],
    },
    // THREATENED PATH — needs reframing
    {
      id: 'e-reframe-tapflow',
      type: 'tapFlow',
      title: 'From Threat to Training',
      instructions: [
        'Right now, this stressor feels like an attacker.',
        'Your body tenses. Your mind races. You want it to stop.',
        'But consider this: every hard thing in your past made you who you are.',
        'The breakup that taught you what you really need.',
        'The failure that forced you to find a better path.',
        'The loss that revealed what actually matters.',
        'This stressor is doing the same thing. Right now.',
        'It doesn\'t feel like a gift. It feels like a wound.',
        'But wounds heal stronger than the original skin.',
        'You are not being damaged. You are being forged.',
      ],
      style: 'fearless',
      nextStepId: 'e-antifragile-affirmation',
    },
    // CHALLENGED PATH — amplify the mindset
    {
      id: 'e-amplify-tapflow',
      type: 'tapFlow',
      title: 'Feed the Fire',
      instructions: [
        'You already sense the growth inside the struggle.',
        'That instinct is rare. Most people only see the pain.',
        'You see the training. The tempering. The evolution.',
        'Now take it further.',
        'Don\'t just survive this stressor. Ask: what skill is it building?',
        'What weakness is it exposing so you can fix it?',
        'What assumption is it breaking so you can think clearer?',
        'The fire doesn\'t just endure the wind.',
        'It uses the wind to burn brighter.',
        'That\'s you. Right now.',
      ],
      style: 'fearless',
      nextStepId: 'e-antifragile-affirmation',
    },
    // CONVERGE
    {
      id: 'e-antifragile-affirmation',
      type: 'affirmation',
      preText: "Fragile things break. Resilient things survive. Antifragile things grow.",
      statement: "I don't just survive what life throws at me. I grow from it. I am antifragile.",
      subtext: "The wind doesn't extinguish you. It fuels you.",
      confirmLabel: "I am the fire",
      style: 'strength',
      nextStepId: 'e-reflection',
    },
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What would change if you truly believed that stress makes you stronger, not weaker?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "Nassim Taleb spent decades studying systems that gain from disorder — economies, organisms, traditions. The pattern is always the same: the things that last are not the ones that avoid stress, but the ones that metabolize it. Your mind is no different.",
      source: 'Nassim Taleb',
      sourceBook: 'Antifragile',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just practiced the most powerful reframe in psychology: seeing stress as fuel, not poison. This isn't toxic positivity. This is biology. Muscles grow from resistance. Immune systems learn from exposure. Your mind works the same way. You're becoming antifragile.",
        ],
        byChoice: {
          threatened: [
            "You came in feeling threatened by your stressor — and you left seeing it as training. That shift is not small. It's the difference between the candle and the fire. The next time life hits you, your first instinct will be different. Not 'why me?' but 'what is this building in me?'",
          ],
          challenged: [
            "You already saw the growth inside the struggle. That means you're further along the antifragile path than most. Now amplify it. Don't just accept stress — welcome it. Seek the edges. The fire needs wind to burn at its brightest.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10: LETTER TO YOUR FUTURE SELF (Engagement Path)
// Pattern: Scenario → Scenario2 → ScaleRating → Insight → TapFlow →
//          ResonanceCheck → Choice → Branch Affirmations →
//          Reflection → Reward → Closing Insight → Mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson10: FlexibleLesson = {
  id: 'modern-10-future-self',
  slug: 'future-self',
  order: 5,
  title: 'Letter to Your Future Self',
  subtitle: 'Bridge the gap between who you are and who you will become',
  description: 'A powerful visualization and writing exercise that clarifies your trajectory.',
  coreConceptTag: 'vision',
  xpReward: 25,
  estimatedMinutes: 6,
  thumbnail: { icon: '✉️', color: '#6366f1' },
  teaserText: "Tomorrow you'll connect with your future self in a way that changes the decisions you make today.",
  // exercises: [], — defined in chapter file
  steps: [
    {
      id: 'e-opening',
      type: 'scenario',
      narrative: "One year from today, a version of you exists that you haven't met yet. They've lived through seasons you haven't seen. They know which risks paid off and which fears were phantom. They've already become someone you're only beginning to imagine.",
      subtext: "What if you could hear what they'd say to you right now?",
      continueLabel: "I want to know",
      mood: 'hope',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Research from UCLA shows that people who feel connected to their future selves make dramatically better decisions in the present. They save more. They exercise more. They take more meaningful risks. The bridge between today and tomorrow isn't time. It's imagination.",
      bridgeQuestion: "How connected do you feel to the person you'll become?",
      continueLabel: "Let me feel it",
      mood: 'curiosity',
      nextStepId: 'e-connection-scale',
    },
    {
      id: 'e-connection-scale',
      type: 'scaleRating',
      prompt: "Right now, how vivid is your sense of who you'll be in one year?",
      lowLabel: 'A total stranger',
      highLabel: 'I can see them clearly',
      steps: 5,
      storeAs: 'future-connection',
      responsesByRange: {
        low: "That's normal. Most people can't picture their future self. That's exactly what makes today's exercise so powerful.",
        mid: "You have a sense of direction. Let's sharpen the image until it feels real.",
        high: "You already feel them. Let's deepen that connection even further.",
      },
      nextStepId: 'e-vision-insight',
    },
    {
      id: 'e-vision-insight',
      type: 'insight',
      text: "Your future self is not a fantasy. They are a prediction shaped by the choices you make starting today. Every habit you build, every fear you face, every difficult thing you choose — it all compounds. The person you become in a year is being built right now, in this moment.",
      style: 'revelation',
      followUp: "Let's meet them.",
      nextStepId: 'e-visualization',
    },
    {
      id: 'e-visualization',
      type: 'tapFlow',
      title: 'Meet Your Future Self',
      instructions: [
        'Close your eyes for a moment. Take a breath.',
        'It\'s one year from today.',
        'Picture yourself waking up.',
        'Where are you? What does the room look like?',
        'You feel different. Calmer. More certain.',
        'Something has changed in your eyes. A quiet confidence.',
        'What habit did you build that transformed you?',
        'What fear did you finally walk through?',
        'What relationship did you repair — or release?',
        'See this person clearly. They are real. They are waiting.',
        'Everything you do today is a message to them.',
      ],
      style: 'cosmic',
      nextStepId: 'e-hopes-check',
    },
    {
      id: 'e-hopes-check',
      type: 'resonanceCheck',
      prompt: "What do you most hope your future self has accomplished?",
      instruction: "Tap what matters most to you",
      options: [
        { id: 'confidence', text: 'Built real, unshakeable confidence' },
        { id: 'health', text: 'Transformed their body or health' },
        { id: 'relationship', text: 'Found or deepened a meaningful relationship' },
        { id: 'career', text: 'Made a bold career move' },
        { id: 'peace', text: 'Found inner peace and calm' },
        { id: 'habit', text: 'Finally stuck with a life-changing habit' },
        { id: 'fear', text: 'Conquered a fear that\'s been holding them back' },
        { id: 'purpose', text: 'Discovered their purpose' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'future-hopes',
      nextStepId: 'e-bridge-choice',
    },
    {
      id: 'e-bridge-choice',
      type: 'choice',
      question: 'What does your future self most need to hear from you today?',
      instruction: 'Pick the message that feels most urgent',
      options: [
        {
          id: 'promise',
          label: 'A promise to start building now',
          subtext: "I'll put in the work so you can reap the reward",
          nextStepId: 'e-promise-affirmation',
        },
        {
          id: 'reminder',
          label: 'A reminder of who I am right now',
          subtext: "Don't forget where you came from and what you survived",
          nextStepId: 'e-reminder-affirmation',
        },
      ],
    },
    // PROMISE PATH
    {
      id: 'e-promise-affirmation',
      type: 'affirmation',
      preText: "Your future self is counting on the choices you make today.",
      statement: "I promise to do one thing today that my future self will thank me for. One step. One choice. One act of courage.",
      subtext: "Every great future was built by ordinary days like this one.",
      confirmLabel: "I promise",
      style: 'commitment',
      nextStepId: 'e-reflection',
    },
    // REMINDER PATH
    {
      id: 'e-reminder-affirmation',
      type: 'affirmation',
      preText: "Your future self needs to remember this version of you.",
      statement: "Remember where you started. Remember the struggle. Remember that you kept going when it was hard. That is who you are.",
      subtext: "Success can make us forget. This is your anchor.",
      confirmLabel: "I'll remember",
      style: 'gratitude',
      nextStepId: 'e-reflection',
    },
    // CONVERGE
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "Write a letter to yourself one year from now. What do you hope they've accomplished? What do you want to remind them about who you are today?",
      minimumWords: 10,
      nextStepId: 'e-reward',
    },
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "Hal Hershfield's research at UCLA proved that when people see a vivid image of their future selves, they make fundamentally different choices. They invest in growth. They delay gratification. They treat today as sacred, because they finally see where it leads.",
      source: 'Hal Hershfield',
      sourceBook: 'Your Future Self',
      style: 'quote',
      nextStepId: 'e-mentor',
    },
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just built a bridge between who you are and who you're becoming. That bridge is made of intention, and it's stronger than most people realize. Everything you do today sends a message to your future self. Make today's message one worth receiving.",
        ],
        byChoice: {
          promise: [
            "You made a promise to your future self. Not in some vague, 'someday' way — but a real commitment to act today. That's how the bridge is built. One day. One choice. One act of courage at a time. Don't let today's version of you let tomorrow's version down.",
          ],
          reminder: [
            "You chose to anchor your future self in where you started. That's wisdom. The most dangerous thing about growth is forgetting the struggle that made you strong. Your future self will need this reminder. Today, you gave them a gift they don't even know they need yet.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

export { lesson6, lesson7, lesson8, lesson9, lesson10 };
