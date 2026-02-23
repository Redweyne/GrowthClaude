// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 3: RELATIONSHIPS - Engagement Path
// ═══════════════════════════════════════════════════════════════════════════
// No long-form writing. Resonance checks, scale ratings, tap flows,
// affirmations, and a single reflection before reward. Still deeply personal.
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, LessonStep } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11: THE MIRROR EFFECT (Engagement)
// Shadow Work / Projection — Carl Jung
// Flow: scenario → scenario2 → resonanceCheck → insight → choice
//       → branch (tapFlow A / tapFlow B) → reflection → reward
//       → closing insight → mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson11: FlexibleLesson = {
  id: 'modern-11-mirror-effect',
  slug: 'mirror-effect',
  order: 1,
  title: 'The Mirror Effect',
  subtitle: 'Others reflect what you project',
  description: 'Discover how changing yourself changes everyone around you.',
  coreConceptTag: 'projection',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🪞', color: '#ec4899' },
  teaserText: "Tomorrow you'll discover why the people who frustrate you most might be your greatest teachers.",
  // exercises: [], — defined in the deep-path file

  steps: [
    // ── 1. Emotional hook ──────────────────────────────────────────────────
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "Think about the person who gets under your skin more than anyone else. The one whose behavior makes your jaw tighten, your stomach clench, your thoughts spiral. You know exactly who they are.",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "What if their most infuriating quality is actually a message — not about them, but about you? What if the things that trigger you most are mirrors, reflecting something hidden inside you that's demanding to be seen?",
      subtext: "Carl Jung called this the Shadow. Today, you meet yours.",
      bridgeQuestion: "Are you willing to look?",
      continueLabel: "Show me",
      mood: 'curiosity',
      nextStepId: 'e-resonance',
    },

    // ── 2. Personal connection ─────────────────────────────────────────────
    {
      id: 'e-resonance',
      type: 'resonanceCheck',
      prompt: "What quality in others triggers you most?",
      instruction: "Tap everything that hits a nerve",
      options: [
        { id: 'arrogance', text: 'Arrogance or ego', emoji: '👑' },
        { id: 'dishonesty', text: 'Dishonesty or fakeness', emoji: '🎭' },
        { id: 'laziness', text: 'Laziness or lack of effort', emoji: '🛋️' },
        { id: 'neediness', text: 'Neediness or people-pleasing', emoji: '🪞' },
        { id: 'selfishness', text: 'Selfishness or taking advantage', emoji: '🦊' },
        { id: 'anger', text: 'Explosive anger or cruelty', emoji: '🔥' },
        { id: 'victim', text: 'Playing the victim', emoji: '😢' },
        { id: 'control', text: 'Being controlling or rigid', emoji: '🔒' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'trigger-quality',
      nextStepId: 'e-insight',
    },

    // ── 3. Core teaching ───────────────────────────────────────────────────
    {
      id: 'e-insight',
      type: 'insight',
      text: "Jung's insight was uncomfortable but liberating: we don't react strongly to things that have nothing to do with us. The arrogance that enrages you? Perhaps you fear your own ambition. The laziness you judge? Maybe you secretly resent your own relentless drive. The mirror doesn't lie — but it does set you free once you stop looking away.",
      source: 'Carl Jung',
      style: 'principle',
      followUp: "The question isn't whether you have a shadow. It's whether you'll keep pretending it doesn't exist.",
      nextStepId: 'e-choice',
    },

    // ── 4. Meaningful branch ───────────────────────────────────────────────
    {
      id: 'e-choice',
      type: 'choice',
      question: "When you look at what triggers you, what do you sense underneath?",
      instruction: "Be honest — there's no wrong answer",
      options: [
        {
          id: 'fear',
          label: "I fear becoming like them",
          subtext: "This quality represents something I'm terrified of in myself",
          nextStepId: 'e-fear-tapflow',
        },
        {
          id: 'envy',
          label: "Part of me envies what they allow themselves",
          subtext: "They express something I've learned to suppress",
          nextStepId: 'e-envy-tapflow',
        },
      ],
    },

    // ── 5a. Fear branch ────────────────────────────────────────────────────
    {
      id: 'e-fear-tapflow',
      type: 'tapFlow',
      title: 'Facing the Shadow',
      instructions: [
        'The quality you judge in them lives somewhere in you too.',
        'Not in the same form. Not in the same intensity.',
        'But the seed is there — and that is why it scares you.',
        'What if the seed isn\'t a threat?',
        'What if recognizing it gives you power over it?',
        'A shadow loses its power the moment you turn and face it.',
        'You are not them. But you are human, just like them.',
        'And in that shared humanity, there is compassion — even for the parts of yourself you hide.',
      ],
      style: 'grounding',
      nextStepId: 'e-reflection',
    },

    // ── 5b. Envy branch ────────────────────────────────────────────────────
    {
      id: 'e-envy-tapflow',
      type: 'tapFlow',
      title: 'The Hidden Permission',
      instructions: [
        'What if the person who triggers you is showing you something you\'ve denied yourself?',
        'Their arrogance might mirror your unexpressed confidence.',
        'Their selfishness might mirror your exhaustion from always giving.',
        'Their loudness might mirror the voice inside you that was told to be quiet.',
        'You don\'t have to become them.',
        'But you can reclaim the quality you\'ve been suppressing.',
        'In a healthier form. On your own terms.',
        'The trigger was never about them. It was an invitation to become more fully yourself.',
      ],
      style: 'cosmic',
      nextStepId: 'e-reflection',
    },

    // ── 6. Reflection (converged) ──────────────────────────────────────────
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What did you discover? What might this trigger be reflecting about your own fears, shadows, or hidden qualities?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },

    // ── 7. Reward ──────────────────────────────────────────────────────────
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },

    // ── 8. Closing insight ─────────────────────────────────────────────────
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "'Everything that irritates us about others can lead us to an understanding of ourselves.' The shadow isn't your enemy — it's the part of you that's been waiting in the dark for you to finally turn on the light.",
      source: 'Carl Jung',
      sourceBook: 'Memories, Dreams, Reflections',
      style: 'quote',
      nextStepId: 'e-mentor',
    },

    // ── 9. Mentor ──────────────────────────────────────────────────────────
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "Most people spend their whole lives pointing fingers outward. You just turned the mirror inward. That takes a rare kind of courage — the willingness to see yourself clearly. This is the beginning of real freedom.",
        ],
        byChoice: {
          fear: [
            "You recognized the fear beneath the judgment. That's shadow work in its purest form. The quality you dread becoming? It has less power over you now that you've named it. You don't run from what you can see.",
          ],
          envy: [
            "You saw something most people never admit: sometimes our strongest reactions come from longing, not disgust. The permission you've been denying yourself — it's yours to claim. Not their version. Yours.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12: RADICAL HONESTY (Engagement)
// Brad Blanton's Radical Honesty
// Flow: scenario → scenario2 → scaleRating → insight → choice
//       → branch (affirmation A / tapFlow B) → reflection → reward
//       → closing insight → mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson12: FlexibleLesson = {
  id: 'modern-12-radical-honesty',
  slug: 'radical-honesty',
  order: 2,
  title: 'Radical Honesty',
  subtitle: 'The truth will set you free (but first it will make you uncomfortable)',
  description: 'Learn why small lies imprison you and radical honesty liberates.',
  coreConceptTag: 'honesty',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '💎', color: '#3b82f6' },
  teaserText: "Tomorrow you'll understand why small lies build invisible prisons and radical honesty sets you free.",
  // exercises: [], — defined in the deep-path file

  steps: [
    // ── 1. Emotional hook ──────────────────────────────────────────────────
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "How many times today did you say something you didn't mean? 'I'm fine.' 'No worries.' 'Sounds great.' Each one felt harmless. But each one was a tiny betrayal — not of the person you were talking to, but of yourself.",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Over time, these small deceptions build an invisible prison. You forget what you actually think. You lose touch with what you actually want. You become a performance of a person rather than a person. And the exhaustion is crushing.",
      subtext: "What if you stopped performing?",
      continueLabel: "I feel the weight of this",
      mood: 'struggle',
      nextStepId: 'e-scale',
    },

    // ── 2. Personal connection ─────────────────────────────────────────────
    {
      id: 'e-scale',
      type: 'scaleRating',
      prompt: "How much of your day is spent managing impressions instead of being real?",
      lowLabel: 'Mostly authentic',
      highLabel: 'Constant performance',
      steps: 5,
      storeAs: 'honesty-scale',
      responsesByRange: {
        low: "Even a small gap between who you are and who you present is exhausting over time.",
        mid: "You're splitting yourself in two — the real you and the one you show the world. No wonder it's tiring.",
        high: "You're running a full-time production. The performer is exhausted. The real you is suffocating underneath.",
      },
      nextStepId: 'e-insight',
    },

    // ── 3. Core teaching ───────────────────────────────────────────────────
    {
      id: 'e-insight',
      type: 'insight',
      text: "Brad Blanton spent decades studying what happens when people tell the radical truth. His finding was counterintuitive: relationships don't break from honesty. They break from the accumulated weight of things unsaid. The truth might sting for five minutes. The lie poisons for years.",
      source: 'Brad Blanton',
      sourceBook: 'Radical Honesty',
      style: 'principle',
      followUp: "Radical honesty isn't cruelty. It's the refusal to let kindness become a costume for cowardice.",
      nextStepId: 'e-choice',
    },

    // ── 4. Meaningful branch ───────────────────────────────────────────────
    {
      id: 'e-choice',
      type: 'choice',
      question: "Where is honesty hardest for you right now?",
      instruction: "Choose what resonates most",
      options: [
        {
          id: 'others',
          label: "With someone in my life",
          subtext: "There's a truth I need to speak to another person",
          nextStepId: 'e-others-affirmation',
        },
        {
          id: 'self',
          label: "With myself",
          subtext: "There's something I've been refusing to admit to myself",
          nextStepId: 'e-self-tapflow',
        },
      ],
    },

    // ── 5a. Others branch ──────────────────────────────────────────────────
    {
      id: 'e-others-affirmation',
      type: 'affirmation',
      preText: "There is a conversation you've been avoiding. A truth that sits in your chest like a stone. Speaking it feels terrifying — but carrying it is slowly crushing you.",
      statement: "I choose truth over comfort. The conversation I've been avoiding deserves to happen — not perfectly, but honestly.",
      subtext: "Five minutes of discomfort beats years of resentment.",
      confirmLabel: "I choose honesty",
      style: 'strength',
      nextStepId: 'e-reflection',
    },

    // ── 5b. Self branch ────────────────────────────────────────────────────
    {
      id: 'e-self-tapflow',
      type: 'tapFlow',
      title: 'The Inner Truth',
      instructions: [
        'Somewhere inside you, there is a truth you\'ve been running from.',
        'It might be about what you actually want from your life.',
        'Or what you\'ve been pretending to be okay with.',
        'Or who you\'ve outgrown but are afraid to leave behind.',
        'This truth doesn\'t need you to act on it today.',
        'It just needs you to stop pretending it doesn\'t exist.',
        'Say it silently to yourself right now. The real thing.',
        'Feel the relief of not lying to yourself, even for this moment.',
        'That relief? That\'s what freedom tastes like.',
      ],
      style: 'grounding',
      nextStepId: 'e-reflection',
    },

    // ── 6. Reflection (converged) ──────────────────────────────────────────
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What would your life look like if you were radically honest? What truth is most important for you to embrace?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },

    // ── 7. Reward ──────────────────────────────────────────────────────────
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },

    // ── 8. Closing insight ─────────────────────────────────────────────────
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "'The truth will set you free, but first it will piss you off.' Radical honesty isn't about having no filter. It's about dismantling the prison of performance, one honest word at a time. The energy you reclaim from not lying is staggering.",
      source: 'Brad Blanton',
      sourceBook: 'Radical Honesty',
      style: 'quote',
      nextStepId: 'e-mentor',
    },

    // ── 9. Mentor ──────────────────────────────────────────────────────────
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just looked at the gap between who you present and who you are. Most people never even acknowledge that gap exists. The fact that you can see it means you're already closer to the other side.",
        ],
        byChoice: {
          others: [
            "You named the conversation you've been avoiding and chose honesty over comfort. Whether you have that conversation today or next week, the intention is set. Your silence was never protecting the relationship — it was slowly eroding it.",
          ],
          self: [
            "Self-deception is the hardest lie to break because the liar and the victim are the same person. You just stopped lying to yourself, even briefly. That moment of inner honesty is worth more than a thousand polite fictions.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 13: BOUNDARIES WITH GRACE (Engagement)
// Setting healthy boundaries — Brené Brown
// Flow: scenario → scenario2 → resonanceCheck → insight → choice
//       → branch (affirmation A / affirmation B) → reflection → reward
//       → closing insight → mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson13: FlexibleLesson = {
  id: 'modern-13-boundaries-grace',
  slug: 'boundaries-grace',
  order: 3,
  title: 'Boundaries with Grace',
  subtitle: 'Saying no without guilt',
  description: "Learn why healthy boundaries aren't selfish — they're essential.",
  coreConceptTag: 'boundaries',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '🛡️', color: '#14b8a6' },
  teaserText: "Tomorrow you'll learn how to say 'no' without guilt — the skill that protects everything you care about.",
  // exercises: [], — defined in the deep-path file

  steps: [
    // ── 1. Emotional hook ──────────────────────────────────────────────────
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "You said yes. Again. You didn't want to. Your body screamed no — the tight chest, the sinking feeling, the instant regret. But the words 'sure, no problem' left your mouth before you could stop them.",
      mood: 'struggle',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "And now you're resentful. Not at them for asking — at yourself for not being honest. Every 'yes' that should have been a 'no' is a small act of self-betrayal. And the resentment you feel toward others? It's really anger at yourself for not protecting your own energy.",
      subtext: "What if 'no' was the most loving word you could say?",
      continueLabel: "I need to hear this",
      mood: 'tension',
      nextStepId: 'e-resonance',
    },

    // ── 2. Personal connection ─────────────────────────────────────────────
    {
      id: 'e-resonance',
      type: 'resonanceCheck',
      prompt: "Where do you struggle most with boundaries?",
      instruction: "Tap all that apply",
      options: [
        { id: 'work', text: "Saying no at work", emoji: '💼' },
        { id: 'family', text: "Setting limits with family", emoji: '🏠' },
        { id: 'friends', text: "Disappointing friends", emoji: '👥' },
        { id: 'partner', text: "Expressing needs with a partner", emoji: '💑' },
        { id: 'time', text: "Protecting my time and energy", emoji: '⏳' },
        { id: 'emotional', text: "Absorbing others' emotions", emoji: '🧽' },
        { id: 'guilt', text: "Guilt when I prioritize myself", emoji: '😔' },
        { id: 'conflict', text: "Avoiding conflict at any cost", emoji: '🏳️' },
      ],
      minSelections: 1,
      maxSelections: 3,
      storeAs: 'boundary-struggle',
      nextStepId: 'e-insight',
    },

    // ── 3. Core teaching ───────────────────────────────────────────────────
    {
      id: 'e-insight',
      type: 'insight',
      text: "Brené Brown's research revealed something that surprised even her: the most compassionate people she studied were also the most boundaried. Boundaries aren't walls that keep people out. They're the fences that let you love people without losing yourself. Without them, generosity becomes martyrdom.",
      source: 'Brené Brown',
      sourceBook: 'Daring Greatly',
      style: 'principle',
      followUp: "'Daring to set boundaries is about having the courage to love ourselves, even when we risk disappointing others.'",
      nextStepId: 'e-choice',
    },

    // ── 4. Meaningful branch ───────────────────────────────────────────────
    {
      id: 'e-choice',
      type: 'choice',
      question: "What does your boundary struggle come down to?",
      instruction: "Choose the deeper truth",
      options: [
        {
          id: 'fear-rejection',
          label: "I'm afraid of being rejected or disliked",
          subtext: "If I say no, people will leave or think less of me",
          nextStepId: 'e-rejection-affirmation',
        },
        {
          id: 'guilt-selfish',
          label: "I feel guilty putting myself first",
          subtext: "Setting boundaries feels inherently selfish to me",
          nextStepId: 'e-guilt-affirmation',
        },
      ],
    },

    // ── 5a. Fear of rejection branch ───────────────────────────────────────
    {
      id: 'e-rejection-affirmation',
      type: 'affirmation',
      preText: "The people who leave when you set a boundary were only staying because you had none. The ones who matter will respect your honesty. And you will finally respect yourself.",
      statement: "I would rather be respected for my honesty than liked for my compliance. My 'no' protects my 'yes.'",
      subtext: "Real connection requires two whole people, not one person disappearing to keep the other comfortable.",
      confirmLabel: "I claim this truth",
      style: 'strength',
      nextStepId: 'e-reflection',
    },

    // ── 5b. Guilt branch ──────────────────────────────────────────────────
    {
      id: 'e-guilt-affirmation',
      type: 'affirmation',
      preText: "The guilt you feel when you set a boundary isn't evidence that you're selfish. It's evidence that someone taught you that your needs don't matter. That was a lie. And today, you stop believing it.",
      statement: "Taking care of myself is not selfish. It is the foundation of every genuine gift I give to others.",
      subtext: "You cannot pour from an empty cup. And you've been running on empty for too long.",
      confirmLabel: "I release the guilt",
      style: 'release',
      nextStepId: 'e-reflection',
    },

    // ── 6. Reflection (converged) ──────────────────────────────────────────
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "How does it feel to have words for protecting your energy? What would change if you consistently honored your own boundaries?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },

    // ── 7. Reward ──────────────────────────────────────────────────────────
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },

    // ── 8. Closing insight ─────────────────────────────────────────────────
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "'When we fail to set boundaries and hold people accountable, we feel used and mistreated.' Boundaries aren't about keeping others out — they're about teaching people how to love you well. And teaching yourself that you're worth protecting.",
      source: 'Brené Brown',
      sourceBook: 'The Gifts of Imperfection',
      style: 'quote',
      nextStepId: 'e-mentor',
    },

    // ── 9. Mentor ──────────────────────────────────────────────────────────
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You just named the places where your energy leaks. That awareness alone changes the pattern. Boundaries aren't built in a day, but today you drew the first line — and that line says: I matter too.",
        ],
        byChoice: {
          'fear-rejection': [
            "The fear of rejection kept you hostage to everyone else's needs. But here's the truth you discovered today: the people worth keeping are the ones who stay when you're honest. Everyone else was borrowing your energy, not earning your love.",
          ],
          'guilt-selfish': [
            "The guilt was never yours — it was handed to you by someone who benefited from your boundarylessness. Today you saw through the lie. Self-care isn't selfish. It's the source of every genuine thing you have to give.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14: THE EMPATHY SHIFT (Engagement)
// Stephen Covey's "Seek First to Understand"
// Flow: scenario → scenario2 → scaleRating → insight → choice
//       → branch (tapFlow A / tapFlow B) → reflection → reward
//       → closing insight → mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson14: FlexibleLesson = {
  id: 'modern-14-empathy-shift',
  slug: 'empathy-shift',
  order: 4,
  title: 'The Empathy Shift',
  subtitle: 'Seek first to understand',
  description: 'Transform conflict by understanding before demanding to be understood.',
  coreConceptTag: 'empathy',
  xpReward: 20,
  estimatedMinutes: 5,
  thumbnail: { icon: '👁️', color: '#f97316' },
  teaserText: "Tomorrow you'll learn the single shift that transforms conflict into connection.",
  // exercises: [], — defined in the deep-path file

  steps: [
    // ── 1. Emotional hook ──────────────────────────────────────────────────
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "Picture your last argument. Not the words — the feeling. That burning need to be understood. The frustration of explaining yourself again and again while the other person just doesn't get it.",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "Now here's the part that stings: they felt the exact same way. Both of you, fighting desperately to be heard. Neither of you pausing long enough to actually listen. Two monologues crashing into each other, both people walking away feeling invisible.",
      subtext: "What if you could break this cycle with a single shift?",
      continueLabel: "Tell me how",
      mood: 'curiosity',
      nextStepId: 'e-scale',
    },

    // ── 2. Personal connection ─────────────────────────────────────────────
    {
      id: 'e-scale',
      type: 'scaleRating',
      prompt: "In your most difficult relationship right now, how well do you truly understand the other person's perspective?",
      lowLabel: "Not at all",
      highLabel: "Deeply",
      steps: 5,
      storeAs: 'empathy-level',
      responsesByRange: {
        low: "You're honest about the gap. That honesty is the first step toward bridging it.",
        mid: "You've glimpsed their world but haven't fully stepped inside it. There's more to discover.",
        high: "If that's true, the conflict may not be about understanding — it may be about something deeper. Let's explore.",
      },
      nextStepId: 'e-insight',
    },

    // ── 3. Core teaching ───────────────────────────────────────────────────
    {
      id: 'e-insight',
      type: 'insight',
      text: "Covey discovered that most people don't listen to understand — they listen to reply. They're loading their next argument while pretending to hear you. But when someone truly feels understood, something remarkable happens: their walls come down. Their defensiveness melts. And only then can they finally hear you.",
      source: 'Stephen Covey',
      sourceBook: 'The 7 Habits of Highly Effective People',
      style: 'principle',
      followUp: "The person who understands first doesn't lose the argument. They transform it into a conversation.",
      nextStepId: 'e-choice',
    },

    // ── 4. Meaningful branch ───────────────────────────────────────────────
    {
      id: 'e-choice',
      type: 'choice',
      question: "Think of someone you're in tension with. What's making it hard to understand them?",
      instruction: "Choose what feels most true",
      options: [
        {
          id: 'hurt',
          label: "I'm too hurt to see their side",
          subtext: "My own pain makes it hard to make space for theirs",
          nextStepId: 'e-hurt-tapflow',
        },
        {
          id: 'certain',
          label: "I'm certain I'm right",
          subtext: "Their perspective seems obviously wrong to me",
          nextStepId: 'e-certain-tapflow',
        },
      ],
    },

    // ── 5a. Too hurt branch ────────────────────────────────────────────────
    {
      id: 'e-hurt-tapflow',
      type: 'tapFlow',
      title: 'Beyond the Hurt',
      instructions: [
        'Your pain is real. It deserves acknowledgment.',
        'But here is a difficult truth:',
        'Pain doesn\'t give us perfect vision. It gives us tunnel vision.',
        'When you\'re hurting, you can only see your own wound.',
        'The other person? They might be wounded too.',
        'Not more than you. Not less. Differently.',
        'Understanding their hurt doesn\'t minimize yours.',
        'It makes the picture complete.',
        'And from a complete picture, real healing becomes possible.',
      ],
      style: 'grounding',
      nextStepId: 'e-reflection',
    },

    // ── 5b. Certainty branch ───────────────────────────────────────────────
    {
      id: 'e-certain-tapflow',
      type: 'tapFlow',
      title: 'The Certainty Trap',
      instructions: [
        'You might be right. You probably are, in some ways.',
        'But certainty is a door that only opens one way — outward.',
        'When you\'re certain, nothing can get in.',
        'No new information. No empathy. No growth.',
        'The smartest people in history held their views lightly.',
        'Not because they lacked conviction.',
        'But because they knew that being right about the facts doesn\'t mean you understand the person.',
        'What if being right matters less than being connected?',
        'What if you could be right AND still see their world?',
      ],
      style: 'cosmic',
      nextStepId: 'e-reflection',
    },

    // ── 6. Reflection (converged) ──────────────────────────────────────────
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "How did it feel to genuinely try to understand someone you've been in conflict with? What shifted?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },

    // ── 7. Reward ──────────────────────────────────────────────────────────
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },

    // ── 8. Closing insight ─────────────────────────────────────────────────
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "'Most people do not listen with the intent to understand; they listen with the intent to reply.' The empathy shift isn't about agreeing. It's about making someone feel so deeply heard that they finally lower their shield — and then, for the first time, they can hear you too.",
      source: 'Stephen Covey',
      sourceBook: 'The 7 Habits of Highly Effective People',
      style: 'quote',
      nextStepId: 'e-mentor',
    },

    // ── 9. Mentor ──────────────────────────────────────────────────────────
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "You practiced the rarest skill in human relationships: genuine curiosity about someone else's inner world. Most conflicts end not because someone wins, but because someone finally listens. Today, you became that person.",
        ],
        byChoice: {
          hurt: [
            "You acknowledged your own pain AND made space for theirs. That's not weakness — it's the highest form of emotional strength. Healing doesn't require you to ignore your wound. It asks you to see that you're not the only one bleeding.",
          ],
          certain: [
            "Loosening the grip of certainty takes more courage than defending it. You didn't abandon your perspective — you made room for another one beside it. That's how rigid positions soften into genuine understanding.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15: FORGIVENESS IS FREEDOM (Engagement)
// Forgiveness as self-liberation
// Flow: scenario → scenario2 → resonanceCheck → insight → choice
//       → branch (tapFlow A / affirmation B) → reflection → reward
//       → closing insight → mentor
// ─────────────────────────────────────────────────────────────────────────────

const lesson15: FlexibleLesson = {
  id: 'modern-15-forgiveness-freedom',
  slug: 'forgiveness-freedom',
  order: 5,
  title: 'Forgiveness is Freedom',
  subtitle: 'Letting go of resentment',
  description: "The hardest practice that offers the greatest freedom. Forgiveness isn't for them — it's for you.",
  coreConceptTag: 'forgiveness',
  xpReward: 25,
  estimatedMinutes: 6,
  thumbnail: { icon: '🕊️', color: '#a855f7' },
  teaserText: "Tomorrow you'll explore the hardest practice of all — and understand why forgiveness is freedom for YOU, not absolution for them.",
  // exercises: [], — defined in the deep-path file

  steps: [
    // ── 1. Emotional hook ──────────────────────────────────────────────────
    {
      id: 'e-scenario',
      type: 'scenario',
      narrative: "There is someone who hurt you. You may not think about them every day anymore. But when their name comes up, something tightens inside you. A flash of heat. A clenched jaw. A thought that starts with 'after what they did...'",
      mood: 'tension',
      nextStepId: 'e-scenario-2',
    },
    {
      id: 'e-scenario-2',
      type: 'scenario',
      narrative: "That reaction — that tightening — is not about them. They may have moved on entirely. They may not even remember. But you? You carry it like a stone in your pocket, reaching for it every time the memory surfaces. The cruelest part of resentment is this: it punishes you for what someone else did.",
      subtext: "What if you could set the stone down?",
      continueLabel: "I'm ready to look at this",
      mood: 'struggle',
      nextStepId: 'e-resonance',
    },

    // ── 2. Personal connection ─────────────────────────────────────────────
    {
      id: 'e-resonance',
      type: 'resonanceCheck',
      prompt: "What does this resentment cost you?",
      instruction: "Tap everything you recognize",
      options: [
        { id: 'energy', text: 'Mental energy I could use elsewhere', emoji: '🔋' },
        { id: 'trust', text: 'My ability to trust new people', emoji: '🔐' },
        { id: 'sleep', text: 'Sleep and peace of mind', emoji: '🌙' },
        { id: 'joy', text: 'My capacity for joy', emoji: '✨' },
        { id: 'present', text: 'Being fully present in my life', emoji: '🕐' },
        { id: 'openness', text: 'Openness in my other relationships', emoji: '💔' },
        { id: 'identity', text: "It's become part of my identity", emoji: '🪨' },
        { id: 'bitterness', text: 'A bitterness I can taste', emoji: '🍋' },
      ],
      minSelections: 1,
      maxSelections: 4,
      storeAs: 'resentment-cost',
      nextStepId: 'e-insight',
    },

    // ── 3. Core teaching ───────────────────────────────────────────────────
    {
      id: 'e-insight',
      type: 'insight',
      text: "Forgiveness is the most misunderstood word in any language. It does not mean 'what you did was okay.' It does not mean 'I trust you again.' It does not mean reconciliation or reunion. Forgiveness is a unilateral decision to stop letting someone else's past actions control your present experience. It is the ultimate act of self-liberation.",
      style: 'principle',
      followUp: "You don't forgive because they deserve it. You forgive because you deserve to stop carrying it.",
      nextStepId: 'e-choice',
    },

    // ── 4. Meaningful branch ───────────────────────────────────────────────
    {
      id: 'e-choice',
      type: 'choice',
      question: "Where are you with forgiveness right now?",
      instruction: "There is no wrong answer. Only honest ones.",
      options: [
        {
          id: 'willing',
          label: "I'm willing to start letting go",
          subtext: "I'm tired of carrying this. I want to try.",
          nextStepId: 'e-willing-tapflow',
        },
        {
          id: 'not-ready',
          label: "I'm not ready — and I won't pretend I am",
          subtext: "The hurt is still too raw. I need to honor that.",
          nextStepId: 'e-notready-affirmation',
        },
      ],
    },

    // ── 5a. Willing to release ─────────────────────────────────────────────
    {
      id: 'e-willing-tapflow',
      type: 'tapFlow',
      title: 'The Release',
      instructions: [
        'Bring the person to mind. Not their face — the feeling they left you with.',
        'Feel where it lives in your body. Chest. Stomach. Throat.',
        'This feeling is real. But it is not permanent. Not unless you choose it to be.',
        'Now imagine the cord that connects you to this person through resentment.',
        'It pulls at you. Every time you think of them, the cord tightens.',
        'But here is the truth: only your end of the cord is in your hands.',
        'You can release it. Not for them. For you.',
        'Slowly, gently, let go of your end. Feel the weight drop.',
        'The cord dissolves. The space it occupied fills with something lighter.',
        'This is forgiveness. Not a feeling. A decision. And it is yours.',
      ],
      style: 'grounding',
      nextStepId: 'e-reflection',
    },

    // ── 5b. Not ready ──────────────────────────────────────────────────────
    {
      id: 'e-notready-affirmation',
      type: 'affirmation',
      preText: "Forced forgiveness is just another lie you tell yourself. Honoring where you are is its own kind of courage. The fact that you showed up, looked at this wound, and told the truth about it? That is not nothing. That is the soil from which real forgiveness eventually grows.",
      statement: "I honor my pain without letting it become my prison. I am not ready to forgive — but I am willing to stop letting this define me.",
      subtext: "The seed is planted. It will grow in its own time.",
      confirmLabel: "I honor where I am",
      style: 'release',
      nextStepId: 'e-reflection',
    },

    // ── 6. Reflection (converged) ──────────────────────────────────────────
    {
      id: 'e-reflection',
      type: 'reflection',
      prompt: "What would your life look like without this resentment? What energy would be freed if you truly let this go?",
      minimumWords: 5,
      nextStepId: 'e-reward',
    },

    // ── 7. Reward ──────────────────────────────────────────────────────────
    {
      id: 'e-reward',
      type: 'reward',
      nextStepId: 'e-closing-insight',
    },

    // ── 8. Closing insight ─────────────────────────────────────────────────
    {
      id: 'e-closing-insight',
      type: 'insight',
      text: "'Resentment is like drinking poison and then hoping it will kill your enemies.' Forgiveness is not a gift to the person who hurt you. It is the moment you decide that what they did will no longer control how you live. That is the deepest freedom a human being can claim.",
      source: 'Nelson Mandela',
      style: 'quote',
      nextStepId: 'e-mentor',
    },

    // ── 9. Mentor ──────────────────────────────────────────────────────────
    {
      id: 'e-mentor',
      type: 'mentor',
      responses: {
        default: [
          "Nelson Mandela walked out of 27 years of imprisonment and chose forgiveness — not because his captors deserved it, but because he refused to remain a prisoner in his own mind. Today you faced the same question. Whatever you chose, you faced it. That alone sets you apart.",
        ],
        byChoice: {
          willing: [
            "You chose to begin releasing the cord. Forgiveness isn't a single moment — it's a practice. You may need to choose it again tomorrow, and the day after. But today you took the first step toward a lighter life. The energy you reclaim from this will astound you.",
          ],
          'not-ready': [
            "You told the truth about where you are, and that truth is sacred. Forced forgiveness is suppression in a costume. The fact that you didn't pretend means the real thing, when it comes, will be genuine. Keep showing up. The day will arrive when the stone is ready to drop — and you'll barely need to open your hand.",
          ],
        },
      },
    },
  ] as LessonStep[],
};

export { lesson11, lesson12, lesson13, lesson14, lesson15 };
