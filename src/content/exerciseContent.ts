import type { DailyExercise } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISE CONTENT - All 45 exercises for 15 lessons
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1: The Weight You Carry (Control)
// rapid-verdict, scenario-snap, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const lesson1Exercises: DailyExercise[] = [
  {
    id: 'ex-1-rapid-verdict',
    type: 'rapid-verdict',
    title: 'What Can You Actually Control?',
    content: {
      statements: [
        { text: 'Other people\'s opinions of me', agreeTag: 'atlas', disagreeTag: 'stoic' },
        { text: 'How I respond to criticism', agreeTag: 'stoic', disagreeTag: 'drifter' },
        { text: 'Whether my loved ones are happy', agreeTag: 'atlas', disagreeTag: 'stoic' },
        { text: 'My effort and attitude today', agreeTag: 'stoic', disagreeTag: 'drifter' },
        { text: 'The economy and job market', agreeTag: 'storm-chaser', disagreeTag: 'stoic' },
        { text: 'How much I prepare for difficulty', agreeTag: 'stoic', disagreeTag: 'drifter' },
        { text: 'Traffic, weather, delays', agreeTag: 'storm-chaser', disagreeTag: 'stoic' },
        { text: 'Whether people keep their promises', agreeTag: 'atlas', disagreeTag: 'stoic' },
        { text: 'My own integrity and honesty', agreeTag: 'stoic', disagreeTag: 'drifter' },
        { text: 'The outcome of my hard work', agreeTag: 'storm-chaser', disagreeTag: 'stoic' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'stoic>=6', title: 'The Stoic', description: 'You instinctively focus on what you can control. This is rare wisdom.', emoji: '🏛️' },
        { tagPattern: 'atlas>=4', title: 'The Atlas', description: 'You carry the world on your shoulders. Not everything is yours to hold.', emoji: '🌍' },
        { tagPattern: 'storm-chaser>=3', title: 'The Storm Chaser', description: 'You try to control the uncontrollable. That\'s exhausting.', emoji: '⛈️' },
        { tagPattern: 'drifter>=3', title: 'The Drifter', description: 'You may be surrendering power you actually have. Reclaim it.', emoji: '🍃' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'ex-1-scenario-snap',
    type: 'scenario-snap',
    title: 'The Delayed Flight',
    content: {
      title: 'The Delayed Flight',
      frames: [
        {
          id: 'f1',
          narrative: 'You\'re at the airport. Your flight just got delayed 4 hours. You have an important meeting tomorrow morning. The gate agent looks overwhelmed.',
          emoji: '✈️',
          choices: [
            { id: 'c1a', text: 'March up to the counter and demand answers', trait: 'control-seeker', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Take a breath and assess your options', trait: 'adapter', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Start catastrophizing about missing the meeting', trait: 'catastrophizer', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a',
          narrative: 'The agent says there\'s nothing they can do. Weather delays. You feel your blood pressure rising. Other passengers are watching.',
          emoji: '😤',
          choices: [
            { id: 'c2a1', text: 'Ask to speak to a supervisor', trait: 'control-seeker', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Step back and look for alternatives', trait: 'adapter', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b',
          narrative: 'You check alternate flights, nearby airports, and video call options. There might be a connecting flight through Chicago.',
          emoji: '🧭',
          choices: [
            { id: 'c2b1', text: 'Book the backup and email about the delay', trait: 'adapter', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Wait it out — maybe it\'ll resolve itself', trait: 'catastrophizer', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c',
          narrative: 'Your mind races: the meeting will be ruined, they\'ll think you\'re unreliable, this always happens to you. Your hands are shaking.',
          emoji: '😰',
          choices: [
            { id: 'c2c1', text: 'Call someone to vent about how unfair this is', trait: 'catastrophizer', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Pause. Ask yourself: what CAN I actually do?', trait: 'adapter', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3',
          narrative: 'Four hours pass. The situation resolved — or didn\'t. But the question remains: how much energy did you spend on what you couldn\'t control?',
          emoji: '🪞',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'adapter>=2', title: 'The Adapter', insight: 'You focused energy where it matters — on your response, not the situation. This is the Stoic way.', wisdomNudge: 'The obstacle is the way. You already know this instinctively.', emoji: '🧭' },
        { traitPattern: 'control-seeker>=2', title: 'The Fighter', insight: 'You tried to force an outcome. Sometimes that works. But with weather? With other people? The energy cost is enormous.', wisdomNudge: 'Ask yourself: am I fighting the storm, or finding shelter?', emoji: '⚔️' },
        { traitPattern: 'catastrophizer>=2', title: 'The Forecaster', insight: 'Your mind jumped to worst-case scenarios. The meeting wasn\'t ruined yet — but your evening was.', wisdomNudge: 'Most of what we fear never happens. The suffering is in the anticipation.', emoji: '🌩️' },
      ],
      style: 'tense' as const,
    },
  },
  {
    id: 'ex-1-word-forge',
    type: 'word-forge',
    title: 'My Letting Go Mantra',
    content: {
      prompt: 'Tap words that resonate to forge your personal letting-go mantra.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'release', category: 'action' as const },
        { id: 'w3', text: 'what', category: 'value' as const },
        { id: 'w4', text: 'cannot', category: 'value' as const },
        { id: 'w5', text: 'control', category: 'action' as const },
        { id: 'w6', text: 'choose', category: 'action' as const },
        { id: 'w7', text: 'peace', category: 'emotion' as const },
        { id: 'w8', text: 'over', category: 'value' as const },
        { id: 'w9', text: 'chaos', category: 'emotion' as const },
        { id: 'w10', text: 'my', category: 'identity' as const },
        { id: 'w11', text: 'power', category: 'identity' as const },
        { id: 'w12', text: 'is', category: 'value' as const },
        { id: 'w13', text: 'in', category: 'value' as const },
        { id: 'w14', text: 'response', category: 'action' as const },
        { id: 'w15', text: 'surrender', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'This is your anchor. When the world feels uncontrollable, return to these words.',
      style: 'serene' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2: The Power of Tiny (Habits)
// heat-check, rapid-verdict, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const lesson2Exercises: DailyExercise[] = [
  {
    id: 'ex-2-heat-check',
    type: 'heat-check',
    title: 'Habit Audit',
    content: {
      prompt: 'Place each habit on the grid. Where does it really fall?',
      xAxis: { low: 'Hard to do', high: 'Easy to do' },
      yAxis: { low: 'Low impact', high: 'High impact' },
      items: [
        { id: 'h1', label: 'Exercise', emoji: '🏃' },
        { id: 'h2', label: 'Reading', emoji: '📖' },
        { id: 'h3', label: 'Journaling', emoji: '✍️' },
        { id: 'h4', label: 'Meditation', emoji: '🧘' },
        { id: 'h5', label: 'Healthy eating', emoji: '🥗' },
        { id: 'h6', label: 'Sleep hygiene', emoji: '😴' },
      ],
      quadrantInsights: {
        topRight: 'Easy and high-impact — these are your golden habits. Start here.',
        topLeft: 'High impact but hard — shrink these to 2-minute versions first.',
        bottomRight: 'Easy but low impact — nice to have, but don\'t mistake them for progress.',
        bottomLeft: 'Hard and low impact — drop these. They drain without returning.',
      },
      completionMessage: 'The 2-minute rule: make the habit so small it\'s impossible to fail.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'ex-2-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Identity Votes',
    content: {
      statements: [
        { text: 'I start things but rarely finish them', agreeTag: 'starter', disagreeTag: 'finisher' },
        { text: 'I wait until I feel motivated to begin', agreeTag: 'waiter', disagreeTag: 'mover' },
        { text: 'I believe I need to make big changes', agreeTag: 'all-or-nothing', disagreeTag: 'incremental' },
        { text: 'I compare my start to others\' finish', agreeTag: 'comparer', disagreeTag: 'self-focused' },
        { text: 'Showing up IS the win, even if tiny', agreeTag: 'incremental', disagreeTag: 'all-or-nothing' },
        { text: 'I\'m harder on myself than anyone else', agreeTag: 'self-critic', disagreeTag: 'self-kind' },
        { text: 'Small actions feel pointless to me', agreeTag: 'all-or-nothing', disagreeTag: 'incremental' },
        { text: 'I trust the process more than the outcome', agreeTag: 'incremental', disagreeTag: 'outcome-focused' },
        { text: 'I need to see results fast or I quit', agreeTag: 'impatient', disagreeTag: 'patient' },
        { text: 'Consistency matters more than intensity', agreeTag: 'incremental', disagreeTag: 'all-or-nothing' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'incremental>=5', title: 'The Seed Planter', description: 'You understand that tiny actions compound. You\'re built for lasting change.', emoji: '🌱' },
        { tagPattern: 'all-or-nothing>=4', title: 'The Sprinter', description: 'You go hard then burn out. The fix: make it so small you can\'t say no.', emoji: '🏃' },
        { tagPattern: 'self-critic>=2', title: 'The Inner Judge', description: 'Your harshest critic is you. Tiny wins silence that voice over time.', emoji: '⚖️' },
        { tagPattern: 'waiter>=2', title: 'The Motivation Seeker', description: 'You wait to feel ready. But action creates motivation, not the reverse.', emoji: '⏳' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'ex-2-priority-tower',
    type: 'priority-tower',
    title: 'What Makes Habits Stick?',
    content: {
      prompt: 'Rank these habit ingredients from most to least important for YOU.',
      items: [
        { id: 'tiny', emoji: '🔬', label: 'Making it tiny' },
        { id: 'stack', emoji: '📚', label: 'Habit stacking' },
        { id: 'track', emoji: '📊', label: 'Tracking progress' },
        { id: 'reward', emoji: '🎁', label: 'Immediate reward' },
        { id: 'identity', emoji: '🪞', label: 'Identity shift' },
        { id: 'environment', emoji: '🏠', label: 'Environment design' },
      ],
      insightsByTopChoice: {
        tiny: 'You intuitively know: reduce friction first. James Clear would approve.',
        stack: 'Linking habits to existing routines is powerful — you\'re a natural architect.',
        track: 'What gets measured gets managed. Just don\'t let tracking become the goal.',
        reward: 'Dopamine drives repetition. Smart — just ensure the reward doesn\'t undo the habit.',
        identity: 'The deepest insight: habits shape who you become, not just what you do.',
        environment: 'You understand that willpower is finite but environment is forever.',
      },
      completionMessage: 'Every action is a vote for the person you wish to become.',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: The Hidden Gift (Obstacles)
// scenario-snap, word-forge, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const lesson3Exercises: DailyExercise[] = [
  {
    id: 'ex-3-scenario-snap',
    type: 'scenario-snap',
    title: 'The Rejection Letter',
    content: {
      title: 'The Rejection Letter',
      frames: [
        {
          id: 'f1', emoji: '📧',
          narrative: 'You open your email. The job you wanted — the one you were perfect for — rejected you. "We\'ve decided to go with another candidate." Your stomach drops.',
          choices: [
            { id: 'c1a', text: 'Close the laptop and stew in disappointment', trait: 'victim', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Feel the sting but start processing it', trait: 'grower', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Immediately apply to 10 more jobs in anger', trait: 'reactor', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '😔',
          narrative: 'Hours pass. You replay the interview, finding every flaw. You start questioning whether you\'re good enough for anything.',
          choices: [
            { id: 'c2a1', text: 'Ask: what could this rejection be protecting me from?', trait: 'grower', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Decide you\'re just not cut out for this', trait: 'victim', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🤔',
          narrative: 'You sit with the disappointment without running from it. After a few minutes, curiosity appears: what can this teach you?',
          choices: [
            { id: 'c2b1', text: 'Email them asking for feedback', trait: 'grower', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Reflect on what you\'d do differently', trait: 'grower', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '⚡',
          narrative: 'You fire off applications without reading them properly. The anger feels productive but you\'re not thinking clearly.',
          choices: [
            { id: 'c2c1', text: 'Slow down and channel the energy intentionally', trait: 'grower', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Keep going — momentum matters more', trait: 'reactor', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🔮',
          narrative: 'Six months from now, this rejection will be a footnote — or a turning point. The difference is what you do with it today.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'grower>=2', title: 'The Alchemist', insight: 'You turn lead into gold. Rejection isn\'t a wall — it\'s a redirect. You see the hidden gift.', wisdomNudge: 'The obstacle is the way. Every "no" carves the path to the right "yes."', emoji: '⚗️' },
        { traitPattern: 'victim>=2', title: 'The Wounded', insight: 'The pain is real. But staying in it keeps you from the lesson. What if this rejection was protection?', wisdomNudge: 'Every master was once a disaster. The rejection letter is chapter one, not the epilogue.', emoji: '🩹' },
        { traitPattern: 'reactor>=2', title: 'The Sprinter', insight: 'Your speed is admirable but unguided energy wastes itself. Pause. Aim. Then fire.', wisdomNudge: 'Reaction is instinct. Response is wisdom. The pause between stimulus and response is where growth lives.', emoji: '🏃' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'ex-3-word-forge',
    type: 'word-forge',
    title: 'My Obstacle Mantra',
    content: {
      prompt: 'Forge a mantra for facing obstacles. Tap words that feel true.',
      words: [
        { id: 'w1', text: 'The', category: 'value' as const },
        { id: 'w2', text: 'obstacle', category: 'value' as const },
        { id: 'w3', text: 'is', category: 'value' as const },
        { id: 'w4', text: 'the', category: 'value' as const },
        { id: 'w5', text: 'way', category: 'action' as const },
        { id: 'w6', text: 'through', category: 'action' as const },
        { id: 'w7', text: 'I', category: 'identity' as const },
        { id: 'w8', text: 'grow', category: 'action' as const },
        { id: 'w9', text: 'stronger', category: 'identity' as const },
        { id: 'w10', text: 'from', category: 'value' as const },
        { id: 'w11', text: 'resistance', category: 'emotion' as const },
        { id: 'w12', text: 'fire', category: 'emotion' as const },
        { id: 'w13', text: 'forges', category: 'action' as const },
        { id: 'w14', text: 'steel', category: 'identity' as const },
        { id: 'w15', text: 'rise', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'When obstacles appear, speak these words. They are your shield.',
      style: 'fiery' as const,
    },
  },
  {
    id: 'ex-3-heat-check',
    type: 'heat-check',
    title: 'Obstacle Reframe Grid',
    content: {
      prompt: 'For each obstacle, plot how painful it is vs. how much it taught you.',
      xAxis: { low: 'Taught me nothing', high: 'Taught me everything' },
      yAxis: { low: 'Barely hurt', high: 'Deeply painful' },
      items: [
        { id: 'o1', label: 'A rejection', emoji: '❌' },
        { id: 'o2', label: 'A betrayal', emoji: '🗡️' },
        { id: 'o3', label: 'A failure', emoji: '📉' },
        { id: 'o4', label: 'A loss', emoji: '💔' },
        { id: 'o5', label: 'A harsh truth', emoji: '🪞' },
      ],
      quadrantInsights: {
        topRight: 'The most painful experiences taught the most. This is the hidden gift — suffering as teacher.',
        topLeft: 'Deep pain without lesson — you may not have processed this fully yet. The gift is still unwrapping.',
        bottomRight: 'Easy lessons — valuable but not transformative. Growth lives in harder territory.',
        bottomLeft: 'Low pain, low lesson — these aren\'t your growth edges. Look elsewhere.',
      },
      completionMessage: 'The obstacle is the way. What hurt you most often taught you most.',
      style: 'emotional' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: Own Your Morning (Preparation)
// priority-tower, heat-check, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const lesson4Exercises: DailyExercise[] = [
  {
    id: 'ex-4-priority-tower',
    type: 'priority-tower',
    title: 'Morning Power Stack',
    content: {
      prompt: 'Rank these morning practices by how much they\'d transform YOUR day.',
      items: [
        { id: 'breathe', emoji: '🌬️', label: 'Intentional breathing' },
        { id: 'phone-free', emoji: '📵', label: 'Phone-free first hour' },
        { id: 'move', emoji: '🏃', label: 'Movement / exercise' },
        { id: 'journal', emoji: '📝', label: 'Morning journaling' },
        { id: 'premeditatio', emoji: '🛡️', label: 'Anticipate challenges' },
        { id: 'gratitude', emoji: '🙏', label: 'Gratitude practice' },
      ],
      insightsByTopChoice: {
        breathe: 'The body leads the mind. Three breaths before anything else — that\'s Marcus Aurelius\'s secret.',
        'phone-free': 'You refuse to let others set your emotional tone. The phone is other people\'s agenda.',
        move: 'Physical energy creates mental clarity. The warrior trains the body to train the mind.',
        journal: 'Writing clarifies thinking. You process before the world can confuse you.',
        premeditatio: 'The Stoic practice of premeditatio malorum — anticipating obstacles before they arrive.',
        gratitude: 'Starting with abundance instead of scarcity rewires your entire operating system.',
      },
      completionMessage: 'Own the first hour, own the day. Start before the world starts you.',
      style: 'stark' as const,
    },
  },
  {
    id: 'ex-4-heat-check',
    type: 'heat-check',
    title: 'Morning Hijack Map',
    content: {
      prompt: 'Map what typically ambushes your morning and how much it affects you.',
      xAxis: { low: 'Rarely happens', high: 'Happens daily' },
      yAxis: { low: 'Minor annoyance', high: 'Ruins my whole day' },
      items: [
        { id: 'm1', label: 'Checking phone first', emoji: '📱' },
        { id: 'm2', label: 'Hitting snooze', emoji: '⏰' },
        { id: 'm3', label: 'Bad news / social media', emoji: '📰' },
        { id: 'm4', label: 'Rushing out the door', emoji: '🏃' },
        { id: 'm5', label: 'Skipping breakfast', emoji: '🍳' },
        { id: 'm6', label: 'Stressful emails', emoji: '📧' },
      ],
      quadrantInsights: {
        topRight: 'Daily and devastating — these are your morning enemies. Eliminate them first.',
        topLeft: 'Rare but destructive — prepare a defense for when they strike.',
        bottomRight: 'Daily but minor — reduce friction here for easy wins.',
        bottomLeft: 'Minimal threat — don\'t waste energy on these.',
      },
      completionMessage: 'The warrior anticipates the ambush. Now you know where yours come from.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'ex-4-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Ambush Awareness',
    content: {
      statements: [
        { text: 'My mornings are usually hijacked by my phone', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I wake up already stressed about the day', agreeTag: 'reactive', disagreeTag: 'prepared' },
        { text: 'I let other people set my emotional tone', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I react instead of respond to situations', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I forget that I have a choice in how I feel', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I start the day on defense not offense', agreeTag: 'reactive', disagreeTag: 'prepared' },
        { text: 'I anticipate what might go wrong', agreeTag: 'prepared', disagreeTag: 'reactive' },
        { text: 'I have a morning routine I follow', agreeTag: 'intentional', disagreeTag: 'reactive' },
        { text: 'I choose my first input carefully', agreeTag: 'intentional', disagreeTag: 'reactive' },
        { text: 'I give myself time before the rush begins', agreeTag: 'prepared', disagreeTag: 'reactive' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'intentional>=5', title: 'The Commander', description: 'You own your mornings. The day follows your lead.', emoji: '⚔️' },
        { tagPattern: 'prepared>=3', title: 'The Sentinel', description: 'You see threats before they arrive. A warrior\'s instinct.', emoji: '🛡️' },
        { tagPattern: 'reactive>=5', title: 'The Ambushed', description: 'Your mornings happen TO you. Time to flip the script.', emoji: '😵' },
        { tagPattern: 'reactive>=3', title: 'The Awakening', description: 'You\'re becoming aware of the pattern. Awareness is step one.', emoji: '👁️' },
      ],
      style: 'bold' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: The Gratitude Shift (Gratitude)
// word-forge, scenario-snap, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const lesson5Exercises: DailyExercise[] = [
  {
    id: 'ex-5-word-forge',
    type: 'word-forge',
    title: 'My Gratitude Anchor',
    content: {
      prompt: 'Forge a gratitude statement from these words. What are you truly grateful for?',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'am', category: 'identity' as const },
        { id: 'w3', text: 'grateful', category: 'emotion' as const },
        { id: 'w4', text: 'for', category: 'value' as const },
        { id: 'w5', text: 'this', category: 'value' as const },
        { id: 'w6', text: 'breath', category: 'value' as const },
        { id: 'w7', text: 'moment', category: 'value' as const },
        { id: 'w8', text: 'enough', category: 'emotion' as const },
        { id: 'w9', text: 'alive', category: 'identity' as const },
        { id: 'w10', text: 'growth', category: 'action' as const },
        { id: 'w11', text: 'struggle', category: 'emotion' as const },
        { id: 'w12', text: 'teaches', category: 'action' as const },
        { id: 'w13', text: 'abundance', category: 'emotion' as const },
        { id: 'w14', text: 'already', category: 'value' as const },
        { id: 'w15', text: 'here', category: 'value' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'Gratitude isn\'t about having more. It\'s about seeing what\'s already here.',
      style: 'serene' as const,
    },
  },
  {
    id: 'ex-5-scenario-snap',
    type: 'scenario-snap',
    title: 'The Ordinary Tuesday',
    content: {
      title: 'The Ordinary Tuesday',
      frames: [
        {
          id: 'f1', emoji: '☕',
          narrative: 'It\'s a regular Tuesday morning. Nothing special. Coffee, commute, work. But what if you could see this day through different eyes?',
          choices: [
            { id: 'c1a', text: 'This day is boring — nothing to be grateful for', trait: 'blind', nextFrameId: 'f2' },
            { id: 'c1b', text: 'Let me look closer at what I have', trait: 'seeker', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '👀',
          narrative: 'Your coffee is hot. You have a roof overhead. Someone, somewhere, would trade everything for your ordinary Tuesday. The traffic you curse? It means you have a car and somewhere to go.',
          choices: [
            { id: 'c2a', text: 'I never thought of it that way', trait: 'seeker', nextFrameId: 'f3' },
            { id: 'c2b', text: 'But my problems are still real', trait: 'blind', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🔄',
          narrative: 'Both things can be true: your problems are real AND your blessings are real. Gratitude doesn\'t deny pain. It refuses to be consumed by it.',
          choices: [
            { id: 'c3a', text: 'I want to see both — the hard and the beautiful', trait: 'seeker', nextFrameId: 'f4' },
            { id: 'c3b', text: 'It\'s hard to feel grateful when things are tough', trait: 'blind', nextFrameId: 'f4' },
          ],
        },
        {
          id: 'f4', emoji: '✨',
          narrative: 'The Stoics practiced gratitude not because life was easy, but because it was short. Every ordinary Tuesday is a gift you\'ll eventually wish you had back.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'seeker>=2', title: 'The Awakened Eye', insight: 'You\'re learning to see abundance in the ordinary. This is the master skill of a fulfilling life.', wisdomNudge: 'The richest person isn\'t the one who has the most — it\'s the one who needs the least.', emoji: '👁️' },
        { traitPattern: 'blind>=2', title: 'The Honest Skeptic', insight: 'Your resistance is honest. Gratitude forced is gratitude faked. Start with just one tiny thing.', wisdomNudge: 'You don\'t have to be grateful for everything. Start with one breath. That\'s enough.', emoji: '🌑' },
      ],
      style: 'empowering' as const,
    },
  },
  {
    id: 'ex-5-priority-tower',
    type: 'priority-tower',
    title: 'What I\'d Miss Most',
    content: {
      prompt: 'If you lost everything tomorrow, rank what you\'d miss most.',
      items: [
        { id: 'health', emoji: '❤️', label: 'My health' },
        { id: 'people', emoji: '👥', label: 'People who love me' },
        { id: 'freedom', emoji: '🦅', label: 'My freedom' },
        { id: 'senses', emoji: '👁️', label: 'My senses (sight, hearing)' },
        { id: 'home', emoji: '🏠', label: 'A safe place to live' },
        { id: 'purpose', emoji: '🎯', label: 'My sense of purpose' },
      ],
      insightsByTopChoice: {
        health: 'Health is invisible until it\'s gone. You already have the thing people pray hardest for.',
        people: 'Connection is your deepest value. Tell them today — don\'t wait for a crisis.',
        freedom: 'The ability to choose your path — millions don\'t have this. Use it wisely.',
        senses: 'Seeing a sunset, hearing music, tasting food — these miracles happen daily. Notice them.',
        home: 'Safety and shelter — the foundation everything else is built on. Not everyone has this.',
        purpose: 'Meaning matters more than comfort. You\'re already seeking it — that IS the purpose.',
      },
      completionMessage: 'You already have what you\'d die to get back. That\'s worth a moment of gratitude.',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6: Comeback Formula (Resilience)
// rapid-verdict, priority-tower, scenario-snap
// ─────────────────────────────────────────────────────────────────────────────
export const lesson6Exercises: DailyExercise[] = [
  {
    id: 'ex-6-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Are You Still Holding On?',
    content: {
      statements: [
        { text: 'I replay past failures before falling asleep', agreeTag: 'wounded', disagreeTag: 'phoenix' },
        { text: 'I believe my best days might be behind me', agreeTag: 'wounded', disagreeTag: 'phoenix' },
        { text: 'Setbacks fuel my determination', agreeTag: 'phoenix', disagreeTag: 'once-bitten' },
        { text: 'I\'m afraid to try again after being burned', agreeTag: 'once-bitten', disagreeTag: 'phoenix' },
        { text: 'I use anger as fuel for my comeback', agreeTag: 'coiled-spring', disagreeTag: 'phoenix' },
        { text: 'Failure taught me something I couldn\'t learn otherwise', agreeTag: 'phoenix', disagreeTag: 'wounded' },
        { text: 'I\'d rather not try than risk failing again', agreeTag: 'once-bitten', disagreeTag: 'coiled-spring' },
        { text: 'I know exactly what I\'d do differently next time', agreeTag: 'phoenix', disagreeTag: 'wounded' },
        { text: 'I carry resentment about what went wrong', agreeTag: 'wounded', disagreeTag: 'phoenix' },
        { text: 'My setback made me more dangerous than before', agreeTag: 'coiled-spring', disagreeTag: 'once-bitten' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'phoenix>=5', title: 'The Phoenix', description: 'You transform failure into fuel. Every setback makes you more formidable.', emoji: '🔥' },
        { tagPattern: 'wounded>=4', title: 'The Wounded Warrior', description: 'The scars are still fresh. Healing isn\'t weakness — it\'s preparation for the next battle.', emoji: '🩹' },
        { tagPattern: 'once-bitten>=3', title: 'Once Bitten', description: 'Fear of repeating pain is keeping you stuck. The only real failure is not getting back up.', emoji: '🐍' },
        { tagPattern: 'coiled-spring>=3', title: 'The Coiled Spring', description: 'You\'re compressed with energy, ready to explode. Channel it — don\'t let it consume you.', emoji: '🌀' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'ex-6-priority-tower',
    type: 'priority-tower',
    title: 'What Matters Most in a Comeback',
    content: {
      prompt: 'Rank these comeback ingredients. What matters most to YOU?',
      items: [
        { id: 'grit', emoji: '💎', label: 'Grit — refusing to quit' },
        { id: 'plan', emoji: '📋', label: 'A clear plan' },
        { id: 'support', emoji: '🤝', label: 'Support from others' },
        { id: 'lesson', emoji: '📖', label: 'Learning the lesson first' },
        { id: 'patience', emoji: '⏳', label: 'Patience and timing' },
        { id: 'anger', emoji: '🔥', label: 'Healthy anger as fuel' },
      ],
      insightsByTopChoice: {
        grit: 'Tenacity is your superpower. Angela Duckworth\'s research proves: grit predicts success more than talent.',
        plan: 'Strategy over emotion. You don\'t just bounce back — you bounce back smarter.',
        support: 'No comeback happens alone. Vulnerability to ask for help is strength, not weakness.',
        lesson: 'Wisdom first, action second. You refuse to repeat the same mistakes.',
        patience: 'Timing is everything. The comeback that lasts is the one that doesn\'t rush.',
        anger: 'Controlled fire is the most powerful force. Just make sure it\'s fuel, not poison.',
      },
      completionMessage: 'The comeback is always stronger than the setback.',
      style: 'warm' as const,
    },
  },
  {
    id: 'ex-6-scenario-snap',
    type: 'scenario-snap',
    title: 'The Second Chance',
    content: {
      title: 'The Second Chance',
      frames: [
        {
          id: 'f1', emoji: '💥',
          narrative: 'A project you poured 6 months into just failed. Publicly. Your team is demoralized, your boss is disappointed, and you feel like hiding.',
          choices: [
            { id: 'c1a', text: 'Request a meeting to analyze what went wrong', trait: 'analyzer', nextFrameId: 'f2' },
            { id: 'c1b', text: 'Take a few days to process before responding', trait: 'retreater', nextFrameId: 'f2' },
            { id: 'c1c', text: 'Start working on a fix immediately', trait: 'charger', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '🔍',
          narrative: 'The dust settles. You discover the failure came from a flawed assumption at the very start — one everyone, including you, missed.',
          choices: [
            { id: 'c2a', text: 'Build a new approach based on what you learned', trait: 'analyzer', nextFrameId: 'f3' },
            { id: 'c2b', text: 'Question whether this project is even worth saving', trait: 'retreater', nextFrameId: 'f3' },
            { id: 'c2c', text: 'Rally the team with renewed energy', trait: 'charger', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '⚖️',
          narrative: 'Your boss gives you a choice: try again with reduced resources, or move on to something safe. The team is watching your decision.',
          choices: [
            { id: 'c3a', text: 'Take the challenge — failure taught me what I needed', trait: 'analyzer', nextFrameId: 'f4' },
            { id: 'c3b', text: 'Play it safe this time — I need a win', trait: 'retreater', nextFrameId: 'f4' },
          ],
        },
        {
          id: 'f4', emoji: '🌅',
          narrative: 'Whatever you chose, one thing is true: you didn\'t stay down. The person who never failed never tried anything worth doing.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'analyzer>=2', title: 'The Strategist', insight: 'You learn before you leap again. Your comebacks are calculated, not reckless.', wisdomNudge: 'Edison didn\'t fail 10,000 times — he found 10,000 ways that didn\'t work. Then he found the one that did.', emoji: '🧠' },
        { traitPattern: 'retreater>=2', title: 'The Hibernator', insight: 'You process deeply. Just make sure hibernation doesn\'t become permanent hiding.', wisdomNudge: 'Rest if you must, but don\'t you quit. The world needs what only you can bring.', emoji: '🐻' },
        { traitPattern: 'charger>=2', title: 'The Relentless', insight: 'Your energy after failure is impressive. Just add strategy to your intensity.', wisdomNudge: 'Speed is powerful. Direction is essential. Combine both and you\'re unstoppable.', emoji: '🚀' },
      ],
      style: 'vulnerable' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7: Embrace the Struggle (Discomfort)
// heat-check, word-forge, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const lesson7Exercises: DailyExercise[] = [
  {
    id: 'ex-7-heat-check',
    type: 'heat-check',
    title: 'Comfort Zone Map',
    content: {
      prompt: 'Map each challenge: how uncomfortable is it vs. how much it grows you?',
      xAxis: { low: 'Minimal growth', high: 'Massive growth' },
      yAxis: { low: 'Comfortable', high: 'Very uncomfortable' },
      items: [
        { id: 'd1', label: 'Cold showers', emoji: '🥶' },
        { id: 'd2', label: 'Public speaking', emoji: '🎤' },
        { id: 'd3', label: 'Saying no', emoji: '🚫' },
        { id: 'd4', label: 'Sitting in silence', emoji: '🤫' },
        { id: 'd5', label: 'Admitting I\'m wrong', emoji: '🙇' },
        { id: 'd6', label: 'Asking for help', emoji: '🙋' },
      ],
      quadrantInsights: {
        topRight: 'Uncomfortable AND high growth — this is where character is forged. Seek these.',
        topLeft: 'Uncomfortable with little growth — suffering for suffering\'s sake. Be strategic.',
        bottomRight: 'Easy and growth-rich — start here to build momentum.',
        bottomLeft: 'Easy and low growth — your comfort zone. Nothing changes here.',
      },
      completionMessage: 'Voluntary discomfort is the vaccine against involuntary hardship.',
      style: 'raw' as const,
    },
  },
  {
    id: 'ex-7-word-forge',
    type: 'word-forge',
    title: 'The Warrior Creed',
    content: {
      prompt: 'Forge your warrior creed for embracing the hard path.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'choose', category: 'action' as const },
        { id: 'w3', text: 'hard', category: 'value' as const },
        { id: 'w4', text: 'over', category: 'value' as const },
        { id: 'w5', text: 'easy', category: 'value' as const },
        { id: 'w6', text: 'because', category: 'value' as const },
        { id: 'w7', text: 'strength', category: 'identity' as const },
        { id: 'w8', text: 'comes', category: 'action' as const },
        { id: 'w9', text: 'from', category: 'value' as const },
        { id: 'w10', text: 'struggle', category: 'emotion' as const },
        { id: 'w11', text: 'comfort', category: 'emotion' as const },
        { id: 'w12', text: 'destroys', category: 'action' as const },
        { id: 'w13', text: 'unbreakable', category: 'identity' as const },
        { id: 'w14', text: 'forged', category: 'action' as const },
        { id: 'w15', text: 'fire', category: 'emotion' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'The person who voluntarily does hard things doesn\'t fear involuntary hardship.',
      style: 'fiery' as const,
    },
  },
  {
    id: 'ex-7-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Comfort or Growth?',
    content: {
      statements: [
        { text: 'I actively seek out uncomfortable experiences', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
        { text: 'I take the easy path when nobody\'s watching', agreeTag: 'comfort-seeker', disagreeTag: 'warrior' },
        { text: 'Physical discomfort makes me feel alive', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
        { text: 'I avoid conversations that might be awkward', agreeTag: 'comfort-seeker', disagreeTag: 'warrior' },
        { text: 'I\'ve grown most during my hardest times', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
        { text: 'I choose convenience over challenge by default', agreeTag: 'comfort-seeker', disagreeTag: 'warrior' },
        { text: 'I can sit with boredom without reaching for my phone', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
        { text: 'I delay gratification regularly', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
        { text: 'I eat for pleasure more than for health', agreeTag: 'comfort-seeker', disagreeTag: 'warrior' },
        { text: 'I would take a cold shower right now if challenged', agreeTag: 'warrior', disagreeTag: 'comfort-seeker' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'warrior>=6', title: 'The Spartan', description: 'You embrace hardship as training. Your comfort zone is a war zone — and you love it.', emoji: '🛡️' },
        { tagPattern: 'warrior>=4', title: 'The Apprentice', description: 'You\'re building discomfort tolerance. Keep pushing edges.', emoji: '⚒️' },
        { tagPattern: 'comfort-seeker>=5', title: 'The Cushioned', description: 'Comfort is your default. It feels safe but it\'s making you fragile.', emoji: '🛋️' },
        { tagPattern: 'comfort-seeker>=3', title: 'The Awakening', description: 'You\'re starting to see: comfort isn\'t safety. It\'s a slow erosion.', emoji: '💡' },
      ],
      style: 'bold' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8: Fear-Setting (Fear)
// scenario-snap, rapid-verdict, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const lesson8Exercises: DailyExercise[] = [
  {
    id: 'ex-8-scenario-snap',
    type: 'scenario-snap',
    title: 'The Leap',
    content: {
      title: 'The Leap',
      frames: [
        {
          id: 'f1', emoji: '🌉',
          narrative: 'You\'ve been offered an opportunity that could change everything — but it requires leaving behind what\'s safe. A new city, a new role, a new identity. Your gut says yes. Your fear says no.',
          choices: [
            { id: 'c1a', text: 'List every worst-case scenario in vivid detail', trait: 'definer', nextFrameId: 'f2' },
            { id: 'c1b', text: 'Avoid thinking about it — the anxiety is too much', trait: 'avoider', nextFrameId: 'f2' },
            { id: 'c1c', text: 'Ask everyone I know for their opinion', trait: 'outsourcer', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '📝',
          narrative: 'The worst cases: you could fail publicly, burn bridges, waste a year, lose money. But you realize — you could also prevent most of these with preparation.',
          choices: [
            { id: 'c2a', text: 'Write down specific prevention steps', trait: 'definer', nextFrameId: 'f3' },
            { id: 'c2b', text: 'The risks feel too real — better stay safe', trait: 'avoider', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '⏳',
          narrative: 'Now the killer question: what happens if you DON\'T take the leap? In 1 year? In 5 years? In 10? The cost of inaction compounds silently.',
          choices: [
            { id: 'c3a', text: 'Inaction is the bigger risk — I see that now', trait: 'definer', nextFrameId: 'f4' },
            { id: 'c3b', text: 'At least I\'m safe if I stay', trait: 'avoider', nextFrameId: 'f4' },
          ],
        },
        {
          id: 'f4', emoji: '🔥',
          narrative: 'Tim Ferriss says: "A person\'s success can be measured by the number of uncomfortable conversations they\'re willing to have." The leap is just a very big uncomfortable conversation — with yourself.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'definer>=2', title: 'The Fear Definer', insight: 'You look fear in the eye and name it. Defined fears shrink. Undefined fears grow.', wisdomNudge: 'The fear you can describe is the fear you can manage. You just proved that.', emoji: '🔍' },
        { traitPattern: 'avoider>=2', title: 'The Safe Harbor', insight: 'Safety feels wise but stagnation is its own risk. The harbor is safe — but ships aren\'t built for harbors.', wisdomNudge: 'What you fear doing most is usually what you most need to do.', emoji: '⚓' },
        { traitPattern: 'outsourcer>=1', title: 'The Consensus Seeker', insight: 'Other people\'s opinions can\'t replace your inner knowing. They\'ll tell you what THEY would do.', wisdomNudge: 'No one else can weigh YOUR regrets. This decision belongs to you alone.', emoji: '🗣️' },
      ],
      style: 'tense' as const,
    },
  },
  {
    id: 'ex-8-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Fear Inventory',
    content: {
      statements: [
        { text: 'I know exactly what I\'m afraid of', agreeTag: 'defined', disagreeTag: 'vague' },
        { text: 'My biggest fear is looking foolish', agreeTag: 'social', disagreeTag: 'independent' },
        { text: 'I postpone decisions to avoid potential failure', agreeTag: 'paralyzed', disagreeTag: 'decisive' },
        { text: 'The cost of NOT acting scares me more than acting', agreeTag: 'decisive', disagreeTag: 'paralyzed' },
        { text: 'I catastrophize — imagining the worst without evidence', agreeTag: 'catastrophizer', disagreeTag: 'realist' },
        { text: 'I could recover from most worst-case scenarios', agreeTag: 'resilient', disagreeTag: 'fragile' },
        { text: 'I avoid risks even when the upside is huge', agreeTag: 'paralyzed', disagreeTag: 'decisive' },
        { text: 'My fears are usually worse than reality', agreeTag: 'realist', disagreeTag: 'catastrophizer' },
        { text: 'I\'d rather regret trying than regret not trying', agreeTag: 'decisive', disagreeTag: 'paralyzed' },
        { text: 'Fear has stopped me from something important', agreeTag: 'paralyzed', disagreeTag: 'decisive' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'decisive>=5', title: 'The Defuser', description: 'You see through fear. You act despite it. That\'s courage defined.', emoji: '💣' },
        { tagPattern: 'paralyzed>=4', title: 'The Frozen', description: 'Fear has you stuck. But naming it — like you just did — is the first step to melting the ice.', emoji: '🧊' },
        { tagPattern: 'catastrophizer>=3', title: 'The Forecaster', description: 'Your imagination is powerful but misdirected. Use it to envision success, not disaster.', emoji: '🌩️' },
        { tagPattern: 'resilient>=3', title: 'The Bouncer', description: 'You know you can survive almost anything. That knowledge is your hidden superpower.', emoji: '🏀' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'ex-8-heat-check',
    type: 'heat-check',
    title: 'Fear vs. Regret Map',
    content: {
      prompt: 'Plot each fear: how terrifying is it vs. how much you\'d regret not facing it?',
      xAxis: { low: 'No regret if I avoid it', high: 'Huge regret if I avoid it' },
      yAxis: { low: 'Not scary', high: 'Terrifying' },
      items: [
        { id: 'f1', label: 'Starting a business', emoji: '🚀' },
        { id: 'f2', label: 'Having a hard conversation', emoji: '💬' },
        { id: 'f3', label: 'Moving somewhere new', emoji: '🌍' },
        { id: 'f4', label: 'Leaving a toxic situation', emoji: '🚪' },
        { id: 'f5', label: 'Being truly vulnerable', emoji: '💗' },
      ],
      quadrantInsights: {
        topRight: 'Terrifying AND high regret — these are your life-defining moments. Face them.',
        topLeft: 'Scary but low regret — your fear may be disproportionate. Let these go.',
        bottomRight: 'Not scary but high regret — why are you procrastinating? Just do it.',
        bottomLeft: 'Low fear, low regret — not your growth edge. Focus elsewhere.',
      },
      completionMessage: 'The fear you don\'t face becomes your ceiling. The one you face becomes your floor.',
      style: 'raw' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9: Antifragile Mind (Antifragile)
// word-forge, heat-check, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const lesson9Exercises: DailyExercise[] = [
  {
    id: 'ex-9-word-forge',
    type: 'word-forge',
    title: 'The Antifragile Creed',
    content: {
      prompt: 'Forge your antifragile declaration. What kind of force are you?',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'am', category: 'identity' as const },
        { id: 'w3', text: 'not', category: 'value' as const },
        { id: 'w4', text: 'the', category: 'value' as const },
        { id: 'w5', text: 'candle', category: 'value' as const },
        { id: 'w6', text: 'fire', category: 'emotion' as const },
        { id: 'w7', text: 'wind', category: 'emotion' as const },
        { id: 'w8', text: 'feeds', category: 'action' as const },
        { id: 'w9', text: 'me', category: 'identity' as const },
        { id: 'w10', text: 'chaos', category: 'emotion' as const },
        { id: 'w11', text: 'makes', category: 'action' as const },
        { id: 'w12', text: 'stronger', category: 'identity' as const },
        { id: 'w13', text: 'antifragile', category: 'identity' as const },
        { id: 'w14', text: 'thrive', category: 'action' as const },
        { id: 'w15', text: 'pressure', category: 'emotion' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'Wind extinguishes a candle but energizes fire. You are the fire.',
      style: 'electric' as const,
    },
  },
  {
    id: 'ex-9-heat-check',
    type: 'heat-check',
    title: 'Stressor Spectrum',
    content: {
      prompt: 'Map your stressors: how stressful are they vs. how much they\'ve strengthened you?',
      xAxis: { low: 'Made me weaker', high: 'Made me stronger' },
      yAxis: { low: 'Mild stress', high: 'Extreme stress' },
      items: [
        { id: 's1', label: 'Financial pressure', emoji: '💰' },
        { id: 's2', label: 'Relationship conflict', emoji: '💔' },
        { id: 's3', label: 'Career setback', emoji: '📉' },
        { id: 's4', label: 'Health challenge', emoji: '🏥' },
        { id: 's5', label: 'Public failure', emoji: '🎭' },
        { id: 's6', label: 'Being underestimated', emoji: '👁️' },
      ],
      quadrantInsights: {
        topRight: 'Extreme stress that made you stronger — this is antifragility in action. You gained from disorder.',
        topLeft: 'Extreme stress that weakened you — this wound needs attention. Not all stress strengthens.',
        bottomRight: 'Mild stress, big growth — these are your ideal training grounds. Seek more of these.',
        bottomLeft: 'Mild stress, no growth — not worth your attention. Focus on higher-leverage challenges.',
      },
      completionMessage: 'The goal isn\'t to eliminate stress — it\'s to become the kind of person who grows from it.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'ex-9-priority-tower',
    type: 'priority-tower',
    title: 'Antifragile Toolkit',
    content: {
      prompt: 'Rank these antifragile strategies. Which would transform you most?',
      items: [
        { id: 'optionality', emoji: '🔀', label: 'Creating options (never one path)' },
        { id: 'barbell', emoji: '🏋️', label: 'Barbell strategy (safe + wild bets)' },
        { id: 'skin', emoji: '🎯', label: 'Skin in the game (real stakes)' },
        { id: 'redundancy', emoji: '🛟', label: 'Redundancy (backup plans)' },
        { id: 'stress', emoji: '💪', label: 'Voluntary stressors (cold/hard/fast)' },
        { id: 'tinker', emoji: '🔧', label: 'Constant tinkering (small experiments)' },
      ],
      insightsByTopChoice: {
        optionality: 'Options are freedom. The more paths available, the less any single failure can break you.',
        barbell: 'Nassim Taleb\'s key insight: be very safe in most things, very aggressive in a few. Never be moderate.',
        skin: 'When your own stakes are on the line, you perform differently. Comfort breeds complacency.',
        redundancy: 'Two is one, one is none. Backup plans aren\'t pessimism — they\'re strategic antifragility.',
        stress: 'Voluntary hardship builds the calluses that protect you from involuntary hardship.',
        tinker: 'Small experiments, low cost, high learning. This is how antifragile systems evolve.',
      },
      completionMessage: 'Fragile things break under stress. Robust things survive. Antifragile things IMPROVE.',
      style: 'cosmic' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10: Future Self Letter (Vision)
// priority-tower, scenario-snap, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const lesson10Exercises: DailyExercise[] = [
  {
    id: 'ex-10-priority-tower',
    type: 'priority-tower',
    title: 'Future Self Values',
    content: {
      prompt: 'Rank what your FUTURE self would value most. Not today\'s you — the you in 5 years.',
      items: [
        { id: 'courage', emoji: '🦁', label: 'The courage to act' },
        { id: 'discipline', emoji: '⚙️', label: 'Daily discipline' },
        { id: 'relationships', emoji: '💞', label: 'Deep relationships' },
        { id: 'health', emoji: '🏃', label: 'Physical vitality' },
        { id: 'wisdom', emoji: '🦉', label: 'Hard-won wisdom' },
        { id: 'freedom', emoji: '🦅', label: 'True freedom' },
      ],
      insightsByTopChoice: {
        courage: 'Your future self was built by the brave decisions your present self made. Start today.',
        discipline: 'Discipline is freedom. Your future self thanks today\'s you for showing up consistently.',
        relationships: 'At the end of life, nobody wishes they had worked more. Connection is the real wealth.',
        health: 'Without health, nothing else matters. Your future self needs a body that works.',
        wisdom: 'Wisdom comes from experience — especially painful experience. You\'re earning it now.',
        freedom: 'Freedom is the ultimate goal. But it\'s built through constraint and discipline first.',
      },
      completionMessage: 'Your future self is watching. Make them proud.',
      style: 'cosmic' as const,
    },
  },
  {
    id: 'ex-10-scenario-snap',
    type: 'scenario-snap',
    title: 'The Time Traveler',
    content: {
      title: 'The Time Traveler',
      frames: [
        {
          id: 'f1', emoji: '⏰',
          narrative: 'Imagine your future self — 5 years from now — could send you one message. They\'ve lived through everything that\'s coming. What do they want you to know?',
          choices: [
            { id: 'c1a', text: 'Start that thing you\'ve been putting off', trait: 'action-caller', nextFrameId: 'f2' },
            { id: 'c1b', text: 'The people around you matter more than you realize', trait: 'connector', nextFrameId: 'f2' },
            { id: 'c1c', text: 'Stop worrying — most of your fears never happen', trait: 'peace-seeker', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '🪞',
          narrative: 'Now flip it. Your future self asks YOU a question: "What did you do with the time you had? Did you play it safe... or did you live?"',
          choices: [
            { id: 'c2a', text: 'I want to live fully — even if it\'s scary', trait: 'action-caller', nextFrameId: 'f3' },
            { id: 'c2b', text: 'I want to be at peace — even if it\'s quiet', trait: 'peace-seeker', nextFrameId: 'f3' },
            { id: 'c2c', text: 'I want to connect deeply — even if it hurts', trait: 'connector', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🌅',
          narrative: 'Your future self smiles. They know something you don\'t yet: the decisions you make in the next 90 days will echo for decades. Today matters more than you think.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'action-caller>=2', title: 'The Launcher', insight: 'Your future self is built by bold moves, not safe ones. The time to start is now.', wisdomNudge: 'In 5 years you\'ll wish you started today. So start today.', emoji: '🚀' },
        { traitPattern: 'connector>=2', title: 'The Bridge Builder', insight: 'Your future self values relationships above achievements. Invest in people.', wisdomNudge: 'The quality of your life equals the quality of your relationships.', emoji: '🌉' },
        { traitPattern: 'peace-seeker>=2', title: 'The Sage', insight: 'Your future self found peace not by achieving more, but by needing less.', wisdomNudge: 'Peace isn\'t found — it\'s chosen. You can choose it today.', emoji: '🧘' },
      ],
      style: 'empowering' as const,
    },
  },
  {
    id: 'ex-10-word-forge',
    type: 'word-forge',
    title: 'Promise to Future Me',
    content: {
      prompt: 'Forge a promise to your future self. What will you commit to?',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'promise', category: 'action' as const },
        { id: 'w3', text: 'to', category: 'value' as const },
        { id: 'w4', text: 'become', category: 'action' as const },
        { id: 'w5', text: 'who', category: 'identity' as const },
        { id: 'w6', text: 'you', category: 'identity' as const },
        { id: 'w7', text: 'need', category: 'emotion' as const },
        { id: 'w8', text: 'today', category: 'value' as const },
        { id: 'w9', text: 'builds', category: 'action' as const },
        { id: 'w10', text: 'tomorrow', category: 'value' as const },
        { id: 'w11', text: 'brave', category: 'identity' as const },
        { id: 'w12', text: 'consistent', category: 'identity' as const },
        { id: 'w13', text: 'worthy', category: 'emotion' as const },
        { id: 'w14', text: 'start', category: 'action' as const },
        { id: 'w15', text: 'now', category: 'value' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'Your future self is counting on you. This promise is your bridge to them.',
      style: 'serene' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11: Mirror Effect (Projection)
// rapid-verdict, heat-check, scenario-snap
// ─────────────────────────────────────────────────────────────────────────────
export const lesson11Exercises: DailyExercise[] = [
  {
    id: 'ex-11-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Trigger Check',
    content: {
      statements: [
        { text: 'Arrogant people infuriate me', agreeTag: 'reactive', disagreeTag: 'clear' },
        { text: 'I notice when I\'m projecting my own stuff onto others', agreeTag: 'clear', disagreeTag: 'reactive' },
        { text: 'Lazy people drive me crazy', agreeTag: 'reactive', disagreeTag: 'clear' },
        { text: 'What bothers me in others often exists in me', agreeTag: 'shadow', disagreeTag: 'reactive' },
        { text: 'I judge people quickly based on first impressions', agreeTag: 'reactive', disagreeTag: 'clear' },
        { text: 'My triggers reveal my own unresolved issues', agreeTag: 'shadow', disagreeTag: 'reactive' },
        { text: 'Dishonest people make me irrationally angry', agreeTag: 'reactive', disagreeTag: 'clear' },
        { text: 'The traits I most admire are ones I want to develop', agreeTag: 'clear', disagreeTag: 'reactive' },
        { text: 'I react before I reflect — then regret it', agreeTag: 'absorber', disagreeTag: 'clear' },
        { text: 'I can observe my emotions without being controlled by them', agreeTag: 'clear', disagreeTag: 'absorber' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'clear>=5', title: 'The Clear Mirror', description: 'You see yourself in others without flinching. Self-awareness is your superpower.', emoji: '🪞' },
        { tagPattern: 'reactive>=4', title: 'The Reactive Mirror', description: 'Your triggers are loud. That\'s okay — they\'re pointing at exactly what you need to work on.', emoji: '⚡' },
        { tagPattern: 'shadow>=3', title: 'The Shadow Spotter', description: 'You\'re learning to see your shadow in your reactions. Jung would be proud.', emoji: '🌑' },
        { tagPattern: 'absorber>=2', title: 'The Absorber', description: 'You take on other people\'s energy. Learn to observe without absorbing.', emoji: '🧽' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'ex-11-heat-check',
    type: 'heat-check',
    title: 'My Relationship Triggers',
    content: {
      prompt: 'Plot each trait: how much it triggers you vs. how much you see it in yourself.',
      xAxis: { low: 'Doesn\'t bother me', high: 'Deeply triggers me' },
      yAxis: { low: 'Only see in others', high: 'Recognize in myself' },
      items: [
        { id: 't1', label: 'Dishonesty', emoji: '🎭' },
        { id: 't2', label: 'Arrogance', emoji: '👑' },
        { id: 't3', label: 'Neediness', emoji: '🫂' },
        { id: 't4', label: 'Laziness', emoji: '🛋️' },
        { id: 't5', label: 'Harsh criticism', emoji: '🗡️' },
      ],
      quadrantInsights: {
        topRight: 'High trigger AND you see it in yourself — this is your deepest growth edge. The mirror is showing you truth.',
        topLeft: 'You see it in yourself but it doesn\'t trigger you — you\'ve already integrated this shadow. Growth happened.',
        bottomRight: 'Triggers you but you don\'t see it in yourself — classic projection. Look closer.',
        bottomLeft: 'Doesn\'t trigger and you don\'t see it — not your current work. Focus elsewhere.',
      },
      completionMessage: 'Everything that irritates us about others leads us to an understanding of ourselves. — Carl Jung',
      style: 'emotional' as const,
    },
  },
  {
    id: 'ex-11-scenario-snap',
    type: 'scenario-snap',
    title: 'The Dinner Table',
    content: {
      title: 'The Dinner Table',
      frames: [
        {
          id: 'f1', emoji: '🍽️',
          narrative: 'You\'re at dinner with friends. One person dominates the conversation, interrupting everyone, making everything about themselves. You feel your jaw tighten.',
          choices: [
            { id: 'c1a', text: 'Call them out directly', trait: 'mirror-fighter', nextFrameId: 'f2' },
            { id: 'c1b', text: 'Ask yourself: why does this bother me SO much?', trait: 'mirror-seeker', nextFrameId: 'f2' },
            { id: 'c1c', text: 'Go quiet and disengage', trait: 'mirror-avoider', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '💭',
          narrative: 'Later that night, you can\'t stop thinking about it. The irritation lingers. Why? They were just being themselves. But something hit a nerve.',
          choices: [
            { id: 'c2a', text: 'Could I be guilty of the same thing sometimes?', trait: 'mirror-seeker', nextFrameId: 'f3' },
            { id: 'c2b', text: 'They were wrong and that\'s that', trait: 'mirror-fighter', nextFrameId: 'f3' },
            { id: 'c2c', text: 'I should just avoid them next time', trait: 'mirror-avoider', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🪞',
          narrative: 'The mirror effect: what we judge most harshly in others often reflects something we haven\'t resolved in ourselves. Not always — but more often than we want to admit.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'mirror-seeker>=2', title: 'The Self-Examiner', insight: 'You turn the mirror inward. This is the hardest and most valuable reflex a human can develop.', wisdomNudge: 'The person who examines their reactions owns them. The person who doesn\'t is owned BY them.', emoji: '🔍' },
        { traitPattern: 'mirror-fighter>=2', title: 'The Reactor', insight: 'Your instinct to fight is strong. But ask: is the battle with them or with something inside you?', wisdomNudge: 'Before you fight the enemy outside, check if there\'s one inside you\'re avoiding.', emoji: '⚔️' },
        { traitPattern: 'mirror-avoider>=2', title: 'The Disappearer', insight: 'You withdraw to protect yourself. But avoidance doesn\'t resolve — it postpones.', wisdomNudge: 'What you resist persists. What you examine dissolves.', emoji: '👻' },
      ],
      style: 'awkward' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12: Radical Honesty (Honesty)
// scenario-snap, word-forge, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const lesson12Exercises: DailyExercise[] = [
  {
    id: 'ex-12-scenario-snap',
    type: 'scenario-snap',
    title: 'The White Lie',
    content: {
      title: 'The White Lie',
      frames: [
        {
          id: 'f1', emoji: '😬',
          narrative: 'A friend asks what you think of their new business idea. Honestly? You think it\'s flawed. But they\'re excited and invested. They look at you expectantly.',
          choices: [
            { id: 'c1a', text: '"That\'s amazing!" (even though you don\'t mean it)', trait: 'pleaser', nextFrameId: 'f2' },
            { id: 'c1b', text: 'Share your honest concerns with care', trait: 'truthful', nextFrameId: 'f2' },
            { id: 'c1c', text: 'Change the subject awkwardly', trait: 'avoider', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '🤔',
          narrative: 'Three months later, the business fails — exactly the way you predicted. Your friend says: "I wish someone had been honest with me." You feel the weight of your choice.',
          choices: [
            { id: 'c2a', text: 'I should have spoken up — honesty serves love', trait: 'truthful', nextFrameId: 'f3' },
            { id: 'c2b', text: 'It wasn\'t my place to crush their dream', trait: 'pleaser', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '⚖️',
          narrative: 'Radical honesty isn\'t cruelty — it\'s courage. The truth told with care is a gift. The lie told with kindness is still a cage.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'truthful>=2', title: 'The Truth Teller', insight: 'You choose honesty even when it\'s hard. Real friends tell you what you need to hear.', wisdomNudge: 'The truth may hurt for a moment, but a lie hurts forever.', emoji: '💎' },
        { traitPattern: 'pleaser>=2', title: 'The Protector', insight: 'Your kindness is real, but sometimes kindness without truth is just cowardice in disguise.', wisdomNudge: 'Ask yourself: am I protecting them or protecting myself from discomfort?', emoji: '🛡️' },
        { traitPattern: 'avoider>=1', title: 'The Dodger', insight: 'Avoidance is the most common lie. Silence when truth is needed is its own deception.', wisdomNudge: 'What you don\'t say speaks louder than what you do.', emoji: '🏃' },
      ],
      style: 'awkward' as const,
    },
  },
  {
    id: 'ex-12-word-forge',
    type: 'word-forge',
    title: 'My Honesty Code',
    content: {
      prompt: 'Forge your personal honesty code. What words define your commitment to truth?',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'speak', category: 'action' as const },
        { id: 'w3', text: 'truth', category: 'value' as const },
        { id: 'w4', text: 'even', category: 'value' as const },
        { id: 'w5', text: 'when', category: 'value' as const },
        { id: 'w6', text: 'it', category: 'value' as const },
        { id: 'w7', text: 'shakes', category: 'action' as const },
        { id: 'w8', text: 'my', category: 'identity' as const },
        { id: 'w9', text: 'voice', category: 'identity' as const },
        { id: 'w10', text: 'honest', category: 'identity' as const },
        { id: 'w11', text: 'free', category: 'emotion' as const },
        { id: 'w12', text: 'courage', category: 'emotion' as const },
        { id: 'w13', text: 'kind', category: 'emotion' as const },
        { id: 'w14', text: 'real', category: 'identity' as const },
        { id: 'w15', text: 'always', category: 'value' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'The truth sets you free. But first, you must choose to speak it.',
      style: 'electric' as const,
    },
  },
  {
    id: 'ex-12-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Honesty Audit',
    content: {
      statements: [
        { text: 'I say "I\'m fine" when I\'m not', agreeTag: 'masked', disagreeTag: 'open' },
        { text: 'I give honest feedback even if it\'s unwelcome', agreeTag: 'open', disagreeTag: 'masked' },
        { text: 'I avoid conflict by agreeing with things I don\'t believe', agreeTag: 'masked', disagreeTag: 'open' },
        { text: 'I tell people what they want to hear', agreeTag: 'masked', disagreeTag: 'open' },
        { text: 'I\'m honest with myself about my own flaws', agreeTag: 'self-honest', disagreeTag: 'self-deceiver' },
        { text: 'I exaggerate to make stories more interesting', agreeTag: 'performer', disagreeTag: 'authentic' },
        { text: 'My public self matches my private self', agreeTag: 'authentic', disagreeTag: 'performer' },
        { text: 'I admit mistakes quickly and without excuses', agreeTag: 'open', disagreeTag: 'masked' },
        { text: 'I withhold my real opinions to keep the peace', agreeTag: 'masked', disagreeTag: 'open' },
        { text: 'Honesty is more important to me than being liked', agreeTag: 'open', disagreeTag: 'masked' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'open>=5', title: 'The Transparent', description: 'You live honestly. The weight you don\'t carry is the weight of deception.', emoji: '💎' },
        { tagPattern: 'masked>=5', title: 'The Masked', description: 'You\'re wearing a mask to keep the peace. But peace built on lies isn\'t peace at all.', emoji: '🎭' },
        { tagPattern: 'self-honest>=2', title: 'The Inner Honest', description: 'You see yourself clearly — the hardest form of honesty. Build outward from here.', emoji: '🪞' },
        { tagPattern: 'performer>=2', title: 'The Performer', description: 'You curate your image. Ask: who are you when nobody\'s watching?', emoji: '🎬' },
      ],
      style: 'introspective' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 13: Boundaries (Boundaries)
// heat-check, priority-tower, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const lesson13Exercises: DailyExercise[] = [
  {
    id: 'ex-13-heat-check',
    type: 'heat-check',
    title: 'Boundary Breach Map',
    content: {
      prompt: 'Map where your boundaries are weakest. How often is each crossed vs. how much it costs you?',
      xAxis: { low: 'Rarely crossed', high: 'Constantly crossed' },
      yAxis: { low: 'Minor cost', high: 'Drains me completely' },
      items: [
        { id: 'b1', label: 'Saying yes when I mean no', emoji: '🫠' },
        { id: 'b2', label: 'Others\' emotions becoming mine', emoji: '🧽' },
        { id: 'b3', label: 'Working beyond my limits', emoji: '💼' },
        { id: 'b4', label: 'Tolerating disrespect', emoji: '😤' },
        { id: 'b5', label: 'Giving time I don\'t have', emoji: '⏰' },
        { id: 'b6', label: 'Sacrificing my needs for others', emoji: '🫗' },
      ],
      quadrantInsights: {
        topRight: 'Constantly crossed AND deeply draining — these are your emergency boundaries. Set them NOW.',
        topLeft: 'Draining but rare — prepare your response for when it happens. Have the words ready.',
        bottomRight: 'Frequent but tolerable — don\'t ignore these. Small leaks sink big ships.',
        bottomLeft: 'Minor and rare — not your priority. Focus your energy on the top right.',
      },
      completionMessage: 'Boundaries aren\'t walls — they\'re filters. They protect what matters most: you.',
      style: 'emotional' as const,
    },
  },
  {
    id: 'ex-13-priority-tower',
    type: 'priority-tower',
    title: 'Boundary Priorities',
    content: {
      prompt: 'Which boundary would transform your life most if you enforced it?',
      items: [
        { id: 'no', emoji: '🚫', label: 'Saying no without guilt' },
        { id: 'time', emoji: '⏰', label: 'Protecting my time' },
        { id: 'emotional', emoji: '🛡️', label: 'Not absorbing others\' emotions' },
        { id: 'digital', emoji: '📵', label: 'Digital boundaries' },
        { id: 'self', emoji: '💪', label: 'Not betraying my own values' },
        { id: 'rest', emoji: '😴', label: 'Honoring my need for rest' },
      ],
      insightsByTopChoice: {
        no: '"No" is a complete sentence. The people who respect you will respect your no.',
        time: 'Time is the only resource you can never get back. Guard it like the treasure it is.',
        emotional: 'Empathy without boundaries is self-destruction. You can care without carrying.',
        digital: 'Your attention is your most valuable asset. Every app is designed to steal it.',
        self: 'The most important boundary: the one between who you are and who others want you to be.',
        rest: 'Rest isn\'t laziness. It\'s maintenance. Even machines break without downtime.',
      },
      completionMessage: 'Every yes to something is a no to something else. Choose wisely.',
      style: 'stark' as const,
    },
  },
  {
    id: 'ex-13-word-forge',
    type: 'word-forge',
    title: 'My Boundary Declaration',
    content: {
      prompt: 'Forge the words that will protect your energy and integrity.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'protect', category: 'action' as const },
        { id: 'w3', text: 'my', category: 'identity' as const },
        { id: 'w4', text: 'energy', category: 'value' as const },
        { id: 'w5', text: 'no', category: 'action' as const },
        { id: 'w6', text: 'is', category: 'value' as const },
        { id: 'w7', text: 'sacred', category: 'emotion' as const },
        { id: 'w8', text: 'enough', category: 'identity' as const },
        { id: 'w9', text: 'boundaries', category: 'value' as const },
        { id: 'w10', text: 'are', category: 'value' as const },
        { id: 'w11', text: 'love', category: 'emotion' as const },
        { id: 'w12', text: 'guard', category: 'action' as const },
        { id: 'w13', text: 'peace', category: 'emotion' as const },
        { id: 'w14', text: 'unapologetically', category: 'identity' as const },
        { id: 'w15', text: 'whole', category: 'identity' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'Boundaries are the immune system of the soul. You just strengthened yours.',
      style: 'serene' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14: Empathy Shift (Empathy)
// word-forge, rapid-verdict, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const lesson14Exercises: DailyExercise[] = [
  {
    id: 'ex-14-word-forge',
    type: 'word-forge',
    title: 'The Empathy Oath',
    content: {
      prompt: 'Forge your commitment to understanding before being understood.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'seek', category: 'action' as const },
        { id: 'w3', text: 'to', category: 'value' as const },
        { id: 'w4', text: 'understand', category: 'action' as const },
        { id: 'w5', text: 'before', category: 'value' as const },
        { id: 'w6', text: 'being', category: 'identity' as const },
        { id: 'w7', text: 'understood', category: 'action' as const },
        { id: 'w8', text: 'listen', category: 'action' as const },
        { id: 'w9', text: 'with', category: 'value' as const },
        { id: 'w10', text: 'heart', category: 'emotion' as const },
        { id: 'w11', text: 'everyone', category: 'identity' as const },
        { id: 'w12', text: 'fights', category: 'emotion' as const },
        { id: 'w13', text: 'battles', category: 'emotion' as const },
        { id: 'w14', text: 'unseen', category: 'value' as const },
        { id: 'w15', text: 'first', category: 'value' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'The greatest gift you can give another person is to make them feel truly seen.',
      style: 'serene' as const,
    },
  },
  {
    id: 'ex-14-rapid-verdict',
    type: 'rapid-verdict',
    title: 'How Well Do You Really Listen?',
    content: {
      statements: [
        { text: 'I listen to respond, not to understand', agreeTag: 'fixer', disagreeTag: 'listener' },
        { text: 'I can hold space for someone without trying to fix them', agreeTag: 'listener', disagreeTag: 'fixer' },
        { text: 'I interrupt when I have a good point to make', agreeTag: 'fixer', disagreeTag: 'listener' },
        { text: 'I try to understand WHY someone feels the way they do', agreeTag: 'listener', disagreeTag: 'judger' },
        { text: 'I judge people before I know their full story', agreeTag: 'judger', disagreeTag: 'listener' },
        { text: 'I can disagree with someone and still respect them', agreeTag: 'listener', disagreeTag: 'judger' },
        { text: 'I assume the worst about people\'s intentions', agreeTag: 'judger', disagreeTag: 'generous' },
        { text: 'I give people the benefit of the doubt', agreeTag: 'generous', disagreeTag: 'judger' },
        { text: 'I think about how MY words affect others', agreeTag: 'aware', disagreeTag: 'unaware' },
        { text: 'In conflict I focus on winning rather than connecting', agreeTag: 'fixer', disagreeTag: 'listener' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'listener>=5', title: 'The Deep Listener', description: 'You hear what\'s behind the words. This is the rarest and most valuable social skill.', emoji: '👂' },
        { tagPattern: 'fixer>=4', title: 'The Fixer', description: 'You jump to solutions. Sometimes people don\'t need fixing — they need witnessing.', emoji: '🔧' },
        { tagPattern: 'judger>=3', title: 'The Quick Judge', description: 'You form opinions fast. Challenge: spend one day assuming everyone has a reason.', emoji: '⚖️' },
        { tagPattern: 'generous>=2', title: 'The Generous Spirit', description: 'You assume good intentions. This is a superpower that transforms relationships.', emoji: '💝' },
      ],
      style: 'playful' as const,
    },
  },
  {
    id: 'ex-14-priority-tower',
    type: 'priority-tower',
    title: 'What Makes Someone Feel Heard?',
    content: {
      prompt: 'Rank these listening skills by impact. What matters most?',
      items: [
        { id: 'silence', emoji: '🤫', label: 'Comfortable silence' },
        { id: 'questions', emoji: '❓', label: 'Asking deep questions' },
        { id: 'reflect', emoji: '🪞', label: 'Reflecting back what you heard' },
        { id: 'validate', emoji: '💚', label: 'Validating their feelings' },
        { id: 'presence', emoji: '👁️', label: 'Full undivided presence' },
        { id: 'nofix', emoji: '🚫', label: 'Resisting the urge to fix' },
      ],
      insightsByTopChoice: {
        silence: 'Most people fill silence with noise. You understand that silence is where people find their own answers.',
        questions: 'The right question at the right time can change someone\'s entire perspective. Powerful skill.',
        reflect: 'Mirroring shows you truly heard. It\'s simple yet profoundly rare. Most people don\'t do it.',
        validate: 'Validation doesn\'t mean agreement. It means: "Your feelings make sense." That alone heals.',
        presence: 'In an age of distraction, full presence is the ultimate gift. You understand this.',
        nofix: 'The hardest skill for caring people: just witnessing without intervening. Masterful empathy.',
      },
      completionMessage: 'Seek first to understand, then to be understood. — Stephen Covey',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15: Forgiveness (Forgiveness)
// priority-tower, scenario-snap, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const lesson15Exercises: DailyExercise[] = [
  {
    id: 'ex-15-priority-tower',
    type: 'priority-tower',
    title: 'What Forgiveness Really Means',
    content: {
      prompt: 'Rank these truths about forgiveness. Which resonates most with you?',
      items: [
        { id: 'freedom', emoji: '🕊️', label: 'Forgiveness is freedom for ME' },
        { id: 'not-condone', emoji: '⚖️', label: 'Forgiving doesn\'t mean condoning' },
        { id: 'process', emoji: '🔄', label: 'It\'s a process not a moment' },
        { id: 'strength', emoji: '💪', label: 'Forgiving requires strength not weakness' },
        { id: 'poison', emoji: '☠️', label: 'Resentment is poison I drink' },
        { id: 'choice', emoji: '🤝', label: 'Forgiveness is a choice I make daily' },
      ],
      insightsByTopChoice: {
        freedom: 'You understand: forgiveness isn\'t about them. It\'s about unburdening yourself.',
        'not-condone': 'Critical distinction. You can release someone from your resentment without excusing what they did.',
        process: 'Wise. Forgiveness isn\'t a switch — it\'s a muscle you strengthen over time.',
        strength: 'The weak can never forgive. Forgiveness is the attribute of the strong. — Gandhi',
        poison: 'Resentment is drinking poison and expecting the other person to die. You see this clearly.',
        choice: 'Daily choice. Some days it\'s easier than others. The commitment to choose is what matters.',
      },
      completionMessage: 'Forgiveness is the final freedom. Not because they deserve it — because you do.',
      style: 'warm' as const,
    },
  },
  {
    id: 'ex-15-scenario-snap',
    type: 'scenario-snap',
    title: 'The Grudge',
    content: {
      title: 'The Grudge',
      frames: [
        {
          id: 'f1', emoji: '⚓',
          narrative: 'Someone hurt you. Maybe recently, maybe years ago. You carry it like an anchor. The memory surfaces unbidden — in the shower, before sleep, when you\'re supposed to be present.',
          choices: [
            { id: 'c1a', text: 'They don\'t deserve my forgiveness', trait: 'holder', nextFrameId: 'f2' },
            { id: 'c1b', text: 'I\'m tired of carrying this weight', trait: 'releaser', nextFrameId: 'f2' },
            { id: 'c1c', text: 'I\'m not sure what forgiveness even means', trait: 'seeker', nextFrameId: 'f2' },
          ],
        },
        {
          id: 'f2', emoji: '💡',
          narrative: 'Here\'s what nobody tells you: forgiveness isn\'t a gift to the person who hurt you. It\'s a gift to yourself. They may never know you forgave. They may never deserve it. But YOU deserve to be free.',
          choices: [
            { id: 'c2a', text: 'But what they did was truly unforgivable', trait: 'holder', nextFrameId: 'f3' },
            { id: 'c2b', text: 'I want to try — even if it\'s hard', trait: 'releaser', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🔗',
          narrative: 'Picture the resentment as a chain connecting you to them. Every time you replay the hurt, you tighten the chain. Forgiveness doesn\'t mean the chain never existed. It means you stop pulling on it.',
          choices: [
            { id: 'c3a', text: 'I\'m ready to loosen the chain', trait: 'releaser', nextFrameId: 'f4' },
            { id: 'c3b', text: 'I need more time', trait: 'seeker', nextFrameId: 'f4' },
          ],
        },
        {
          id: 'f4', emoji: '🕊️',
          narrative: 'Nelson Mandela was imprisoned for 27 years. When he walked out, he chose to forgive. He said: "As I walked through the door toward my freedom, I knew that if I continued to hate, I would still be in prison."',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'releaser>=2', title: 'The Free One', insight: 'You\'re choosing freedom over righteousness. The chain is loosening. You\'re already lighter.', wisdomNudge: 'Forgiveness is not a single moment. It\'s a daily decision. Today, you decided.', emoji: '🕊️' },
        { traitPattern: 'holder>=2', title: 'The Guardian', insight: 'Your anger protects you. That makes sense. But at some point, the armor becomes the prison.', wisdomNudge: 'You don\'t have to forgive today. But notice the cost of carrying this. That awareness is the beginning.', emoji: '🛡️' },
        { traitPattern: 'seeker>=2', title: 'The Explorer', insight: 'You\'re asking the right questions. Forgiveness isn\'t understood — it\'s experienced. The journey has started.', wisdomNudge: 'You don\'t need to have it figured out. Just stay open. The understanding will come.', emoji: '🧭' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'ex-15-heat-check',
    type: 'heat-check',
    title: 'Resentment Weight Map',
    content: {
      prompt: 'Plot each resentment: how heavy is it vs. how ready are you to release it?',
      xAxis: { low: 'Not ready to release', high: 'Ready to release' },
      yAxis: { low: 'Light burden', high: 'Heavy burden' },
      items: [
        { id: 'r1', label: 'A parent who let me down', emoji: '👤' },
        { id: 'r2', label: 'A friend who betrayed trust', emoji: '🤝' },
        { id: 'r3', label: 'A partner who broke my heart', emoji: '💔' },
        { id: 'r4', label: 'Myself for past mistakes', emoji: '🪞' },
        { id: 'r5', label: 'Someone who got away with it', emoji: '⚖️' },
      ],
      quadrantInsights: {
        topRight: 'Heavy AND ready to release — you\'re at the breakthrough point. The freedom is close. Lean into it.',
        topLeft: 'Heavy but not ready — this wound needs more time. Don\'t force forgiveness. Just notice the weight.',
        bottomRight: 'Light and ready — these are easy releases. Let them go today. Practice forgiveness where it\'s easiest.',
        bottomLeft: 'Light and unready — these aren\'t your current work. They may resolve on their own.',
      },
      completionMessage: 'Resentment is a prison with no guards. The door has always been unlocked. You just have to walk through.',
      style: 'emotional' as const,
    },
  },
];
