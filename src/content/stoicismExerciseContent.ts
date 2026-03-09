import type { DailyExercise } from '@/types/dailyPractice';

// ═══════════════════════════════════════════════════════════════════════════
// STOICISM EXERCISE CONTENT - 45 exercises for 15 lessons
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1: Dichotomy of Control
// rapid-verdict, scenario-snap, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson1Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-1-rapid-verdict',
    type: 'rapid-verdict',
    title: 'What Can You Actually Control?',
    content: {
      statements: [
        { text: "Other people's opinions of me", agreeTag: 'atlas', disagreeTag: 'stoic' },
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
        { tagPattern: 'atlas>=4', title: 'The Atlas', description: "You carry the world on your shoulders. Not everything is yours to hold.", emoji: '🌍' },
        { tagPattern: 'storm-chaser>=3', title: 'The Storm Chaser', description: "You try to control the uncontrollable. That's exhausting.", emoji: '⛈️' },
        { tagPattern: 'drifter>=3', title: 'The Drifter', description: 'You may be surrendering power you actually have. Reclaim it.', emoji: '🍃' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'stoic-ex-1-scenario-snap',
    type: 'scenario-snap',
    title: 'The Cancelled Plans',
    content: {
      title: 'The Cancelled Plans',
      frames: [
        {
          id: 'f1', emoji: '📱',
          narrative: "You've been looking forward to tonight for weeks. Dinner with your closest friend — the one you never get to see. Your phone buzzes: 'So sorry, something came up. Can we reschedule?' No explanation.",
          choices: [
            { id: 'c1a', text: 'Feel a flash of anger and text back something sharp', trait: 'reactor', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Feel disappointed but pause before responding', trait: 'stoic', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Start spiraling — they don\'t actually care about you', trait: 'storyteller', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '🔥',
          narrative: 'You type: "Nice. Thanks for the heads up." The sarcasm feels satisfying for about three seconds. Then the guilt arrives.',
          choices: [
            { id: 'c2a1', text: 'Delete it and take a breath', trait: 'stoic', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Send it — they deserve to know how you feel', trait: 'reactor', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🧘',
          narrative: 'You notice the disappointment. You let it sit without acting on it. After a minute, you ask yourself: is their cancellation within my control?',
          choices: [
            { id: 'c2b1', text: 'Reply warmly and plan something for yourself tonight', trait: 'stoic', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Ask what came up — you need to know', trait: 'reactor', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '💭',
          narrative: 'Your mind races: they always cancel. Nobody prioritizes you. Maybe you\'re not worth the effort. The evening hasn\'t even started and you\'re already miserable.',
          choices: [
            { id: 'c2c1', text: 'Catch the spiral — separate fact from story', trait: 'stoic', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Open social media and compare your life to everyone else\'s', trait: 'storyteller', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🪞',
          narrative: 'The cancellation was never in your control. But your evening — your peace, your response, your next move — always was.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'stoic>=2', title: 'The Philosopher', insight: 'You separated what happened from what you made it mean. The cancellation was a fact. Everything else was a choice.', wisdomNudge: 'Epictetus: "It is not things that disturb us, but our judgments about things."', emoji: '🏛️' },
        { traitPattern: 'reactor>=2', title: 'The Flame', insight: 'Your first instinct is to push back. That fire has value — but pointed outward, it often burns you.', wisdomNudge: 'Between stimulus and response is a space. In that space is your freedom.', emoji: '🔥' },
        { traitPattern: 'storyteller>=2', title: 'The Narrator', insight: 'You added chapters to a one-line text. The story you told hurt more than the cancellation itself.', wisdomNudge: 'Strip the story. What actually happened? Just that. Nothing more.', emoji: '📖' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'stoic-ex-1-word-forge',
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
// LESSON 2: Perception is Everything
// heat-check, rapid-verdict, scenario-snap
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson2Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-2-heat-check',
    type: 'heat-check',
    title: 'Judgment Audit',
    content: {
      prompt: 'For each situation, map how quickly you judge vs. how accurate your judgment usually is.',
      xAxis: { low: 'Slow to judge', high: 'Instant judgment' },
      yAxis: { low: 'Usually wrong', high: 'Usually accurate' },
      items: [
        { id: 'j1', label: 'A stranger\'s rudeness', emoji: '😤' },
        { id: 'j2', label: 'A friend\'s silence', emoji: '🤐' },
        { id: 'j3', label: 'A coworker\'s criticism', emoji: '💼' },
        { id: 'j4', label: 'Bad news from a loved one', emoji: '📞' },
        { id: 'j5', label: 'Your own mistakes', emoji: '🪞' },
        { id: 'j6', label: 'An unexpected change of plans', emoji: '🔄' },
      ],
      quadrantInsights: {
        topRight: 'Fast and accurate — your instincts serve you here. But even accurate judgments carry emotional weight.',
        topLeft: 'Slow and accurate — this is wisdom. You let reality settle before you interpret it.',
        bottomRight: 'Fast and wrong — your snap judgments are costing you. The Stoics would say: strip the story.',
        bottomLeft: 'Slow but still wrong — you deliberate but still misread. Seek more facts before interpreting.',
      },
      completionMessage: 'Every judgment is a lens. Some lenses distort. Now you know which ones.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'stoic-ex-2-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Fact or Story?',
    content: {
      statements: [
        { text: 'They didn\'t reply because they\'re angry at me', agreeTag: 'storyteller', disagreeTag: 'factual' },
        { text: 'I failed the test — the score speaks for itself', agreeTag: 'factual', disagreeTag: 'storyteller' },
        { text: 'My boss is out to get me', agreeTag: 'storyteller', disagreeTag: 'factual' },
        { text: 'The traffic is heavy today', agreeTag: 'factual', disagreeTag: 'storyteller' },
        { text: 'Nobody at this party likes me', agreeTag: 'storyteller', disagreeTag: 'factual' },
        { text: 'I made an error in the report', agreeTag: 'factual', disagreeTag: 'storyteller' },
        { text: 'This always happens to me', agreeTag: 'storyteller', disagreeTag: 'factual' },
        { text: 'She looked at me disapprovingly', agreeTag: 'storyteller', disagreeTag: 'factual' },
        { text: 'It rained and the event was moved indoors', agreeTag: 'factual', disagreeTag: 'storyteller' },
        { text: 'Life is fundamentally unfair to people like me', agreeTag: 'storyteller', disagreeTag: 'factual' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'factual>=7', title: 'The Scientist', description: 'You distinguish fact from fiction with precision. Your judgments are clean.', emoji: '🔬' },
        { tagPattern: 'factual>=4', title: 'The Realist', description: 'You lean factual but stories still slip in. Watch for emotional language.', emoji: '📊' },
        { tagPattern: 'storyteller>=4', title: 'The Novelist', description: 'You add chapters to single sentences. Not wrong — but costly.', emoji: '📖' },
        { tagPattern: 'storyteller>=7', title: 'The Mythmaker', description: 'Almost everything gets a story. Strip them away and watch the pain dissolve.', emoji: '🎭' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'stoic-ex-2-scenario-snap',
    type: 'scenario-snap',
    title: 'The Overheard Remark',
    content: {
      title: 'The Overheard Remark',
      frames: [
        {
          id: 'f1', emoji: '👂',
          narrative: 'Walking past the break room, you catch two colleagues laughing. One says your name. They don\'t see you. The laughter continues.',
          choices: [
            { id: 'c1a', text: 'They\'re obviously mocking me — walk away hurt', trait: 'storyteller', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Pause — I only heard my name, nothing else', trait: 'philosopher', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Walk in and confront them directly', trait: 'reactor', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '😔',
          narrative: 'For the rest of the day, every interaction feels loaded. Are they all talking about you? The story grows with every glance.',
          choices: [
            { id: 'c2a1', text: 'Ask yourself: what do I actually KNOW?', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Avoid them for the rest of the week', trait: 'storyteller', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🤔',
          narrative: 'You noticed the urge to create a story. Maybe they were planning your birthday surprise. Maybe sharing a funny moment involving you. Maybe a hundred things.',
          choices: [
            { id: 'c2b1', text: 'Let it go — I don\'t have enough information to judge', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Casually ask them later what was funny', trait: 'philosopher', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '⚡',
          narrative: '"Were you talking about me?" They look surprised. "Yeah — we were saying you should join our trivia team. You\'d be great." The accusation hangs in the air.',
          choices: [
            { id: 'c2c1', text: 'Feel embarrassed and learn from the jump', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Laugh it off but feel foolish', trait: 'reactor', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '💡',
          narrative: 'You heard your name and laughter. That was the fact. Everything else — the mockery, the betrayal, the conspiracy — was story. Pure fiction, written by your fears.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'philosopher>=2', title: 'The Clear-Eyed', insight: 'You caught the gap between event and interpretation. This is the foundational Stoic skill.', wisdomNudge: 'Epictetus: "Remove the judgment and the pain goes with it."', emoji: '👁️' },
        { traitPattern: 'storyteller>=2', title: 'The Story-Spinner', insight: 'Your mind wrote an entire screenplay from two data points. The suffering was real — but the story wasn\'t.', wisdomNudge: 'Next time, ask: what would a camera have recorded? Just that.', emoji: '🎬' },
        { traitPattern: 'reactor>=2', title: 'The First-Responder', insight: 'You act before you think. Sometimes that saves lives. But in social situations, it often creates problems that didn\'t exist.', wisdomNudge: 'The pause between stimulus and response — that\'s where wisdom lives.', emoji: '🚨' },
      ],
      style: 'tense' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: The View From Above
// word-forge, priority-tower, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson3Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-3-word-forge',
    type: 'word-forge',
    title: 'My Cosmic Perspective Mantra',
    content: {
      prompt: 'Forge a mantra for when problems feel all-consuming. Tap words that ground you.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'am', category: 'value' as const },
        { id: 'w3', text: 'a', category: 'value' as const },
        { id: 'w4', text: 'speck', category: 'identity' as const },
        { id: 'w5', text: 'in', category: 'value' as const },
        { id: 'w6', text: 'the', category: 'value' as const },
        { id: 'w7', text: 'cosmos', category: 'emotion' as const },
        { id: 'w8', text: 'free', category: 'emotion' as const },
        { id: 'w9', text: 'this', category: 'value' as const },
        { id: 'w10', text: 'too', category: 'value' as const },
        { id: 'w11', text: 'shall', category: 'action' as const },
        { id: 'w12', text: 'pass', category: 'action' as const },
        { id: 'w13', text: 'breathe', category: 'action' as const },
        { id: 'w14', text: 'vast', category: 'emotion' as const },
        { id: 'w15', text: 'perspective', category: 'identity' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'When the world closes in, speak these words and zoom out.',
      style: 'serene' as const,
    },
  },
  {
    id: 'stoic-ex-3-priority-tower',
    type: 'priority-tower',
    title: 'What Actually Matters?',
    content: {
      prompt: 'From the cosmic view, rank what truly deserves your energy.',
      items: [
        { id: 'reputation', emoji: '🏆', label: 'Your reputation' },
        { id: 'relationships', emoji: '❤️', label: 'Deep relationships' },
        { id: 'character', emoji: '🏛️', label: 'Your character' },
        { id: 'status', emoji: '👑', label: 'Social status' },
        { id: 'inner-peace', emoji: '🕊️', label: 'Inner peace' },
        { id: 'achievement', emoji: '📈', label: 'Worldly achievement' },
      ],
      insightsByTopChoice: {
        reputation: 'Marcus Aurelius ruled the world — and spent his journals reminding himself how little fame matters.',
        relationships: 'Love is the one thing that survives the cosmic zoom. You see clearly.',
        character: 'The Stoics agree: virtue is the only true good. Everything else is "preferred indifferent."',
        status: 'From space, there are no hierarchies. Only atoms dancing. Status is a game — who told you to play?',
        'inner-peace': 'Tranquility of mind — ataraxia — is the Stoic goal. You already know the destination.',
        achievement: 'Every empire fell. Every monument crumbled. But the character behind the work? That echoes.',
      },
      completionMessage: 'From far enough away, only what you are — not what you have — still registers.',
      style: 'stark' as const,
    },
  },
  {
    id: 'stoic-ex-3-heat-check',
    type: 'heat-check',
    title: 'Perspective Calibration',
    content: {
      prompt: 'Map each worry: how big does it feel vs. how big will it be in 10 years?',
      xAxis: { low: 'Forgotten in 10 years', high: 'Still matters in 10 years' },
      yAxis: { low: 'Feels small now', high: 'Feels enormous now' },
      items: [
        { id: 'p1', label: 'A conflict with a friend', emoji: '😤' },
        { id: 'p2', label: 'A career setback', emoji: '📉' },
        { id: 'p3', label: 'An embarrassing moment', emoji: '😳' },
        { id: 'p4', label: 'A health concern', emoji: '🏥' },
        { id: 'p5', label: 'Money problems', emoji: '💸' },
      ],
      quadrantInsights: {
        topRight: 'Big now AND in 10 years — these deserve your full attention. Focus here.',
        topLeft: 'Feels huge but won\'t last — the view from above dissolves these. Zoom out.',
        bottomRight: 'Feels small but will matter — don\'t neglect the quiet fires.',
        bottomLeft: 'Small and temporary — release these completely. They don\'t deserve your energy.',
      },
      completionMessage: 'Marcus Aurelius: "Think of the whole of existence, of which your share is tiny."',
      style: 'emotional' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: Morning Preparation
// priority-tower, heat-check, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson4Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-4-priority-tower',
    type: 'priority-tower',
    title: 'Morning Power Stack',
    content: {
      prompt: 'Rank these Stoic morning practices by how much they\'d armor YOUR day.',
      items: [
        { id: 'anticipate', emoji: '🛡️', label: 'Anticipate difficulties' },
        { id: 'gratitude', emoji: '🙏', label: 'Name 3 blessings' },
        { id: 'intention', emoji: '🎯', label: 'Set one clear intention' },
        { id: 'acceptance', emoji: '🕊️', label: 'Pre-accept what can\'t be controlled' },
        { id: 'virtue', emoji: '🏛️', label: 'Choose today\'s virtue focus' },
        { id: 'journal', emoji: '📝', label: 'Morning journal reflection' },
      ],
      insightsByTopChoice: {
        anticipate: 'The Stoic premeditatio: "I shall meet with interference, ingratitude, insolence." Pre-seen, pre-defeated.',
        gratitude: 'Seneca: "True happiness is to enjoy the present, without dependence upon the future."',
        intention: 'A day without direction drifts. An intention is your rudder.',
        acceptance: 'Pre-accepting removes surprise. Surprise is what turns events into suffering.',
        virtue: 'The Four Cardinal Virtues: Wisdom, Courage, Justice, Temperance. Pick one. Live it.',
        journal: 'Marcus Aurelius wrote his Meditations every morning. Not for an audience — for himself.',
      },
      completionMessage: 'Own the first hour, own the day. The warrior who expects battle is calm when it arrives.',
      style: 'stark' as const,
    },
  },
  {
    id: 'stoic-ex-4-heat-check',
    type: 'heat-check',
    title: 'Morning Hijack Map',
    content: {
      prompt: 'Map what typically ambushes your morning and how much it derails you.',
      xAxis: { low: 'Rarely happens', high: 'Happens daily' },
      yAxis: { low: 'Minor annoyance', high: 'Ruins my whole day' },
      items: [
        { id: 'm1', label: 'Checking phone first', emoji: '📱' },
        { id: 'm2', label: 'Hitting snooze repeatedly', emoji: '⏰' },
        { id: 'm3', label: 'Doomscrolling news', emoji: '📰' },
        { id: 'm4', label: 'Rushing out the door', emoji: '🏃' },
        { id: 'm5', label: 'Negative self-talk', emoji: '🗣️' },
        { id: 'm6', label: 'Stressful messages', emoji: '📧' },
      ],
      quadrantInsights: {
        topRight: 'Daily and devastating — these are your morning enemies. Marcus would say: name them. Prepare for them.',
        topLeft: 'Rare but destructive — build a defense for when they strike.',
        bottomRight: 'Daily but minor — reduce friction here for easy wins.',
        bottomLeft: 'Minimal threat — don\'t waste energy on these.',
      },
      completionMessage: 'The warrior anticipates the ambush. Now you know where yours come from.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'stoic-ex-4-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Morning Stoic Assessment',
    content: {
      statements: [
        { text: 'I usually start my day reactively', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I mentally prepare for difficult people', agreeTag: 'prepared', disagreeTag: 'reactive' },
        { text: 'My phone dictates my first emotion of the day', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I set clear intentions before leaving the house', agreeTag: 'intentional', disagreeTag: 'reactive' },
        { text: 'Unexpected bad news can ruin my entire day', agreeTag: 'reactive', disagreeTag: 'prepared' },
        { text: 'I anticipate what could go wrong today', agreeTag: 'prepared', disagreeTag: 'reactive' },
        { text: 'I feel rushed most mornings', agreeTag: 'reactive', disagreeTag: 'intentional' },
        { text: 'I have a consistent morning practice', agreeTag: 'intentional', disagreeTag: 'reactive' },
        { text: 'I accept that some things today won\'t go my way', agreeTag: 'prepared', disagreeTag: 'reactive' },
        { text: 'I let other people set my emotional tone', agreeTag: 'reactive', disagreeTag: 'intentional' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'intentional>=5', title: 'The Commander', description: 'You own your mornings. Marcus would approve — you start from sovereignty, not reactivity.', emoji: '⚔️' },
        { tagPattern: 'prepared>=4', title: 'The Sentinel', description: 'You anticipate the ambush. This is premeditatio in action. Stay sharp.', emoji: '🛡️' },
        { tagPattern: 'reactive>=5', title: 'The Leaf', description: 'You\'re blown by whatever wind comes. It\'s not weakness — it\'s a missing morning armor. Build it.', emoji: '🍂' },
        { tagPattern: 'reactive>=8', title: 'The Pinball', description: 'You bounce from stimulus to stimulus. One Stoic morning practice would change everything.', emoji: '🎯' },
      ],
      style: 'bold' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: Removing Judgment
// scenario-snap, word-forge, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson5Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-5-scenario-snap',
    type: 'scenario-snap',
    title: 'The Bad Review',
    content: {
      title: 'The Bad Review',
      frames: [
        {
          id: 'f1', emoji: '⭐',
          narrative: 'You pour three months into a project — your best work. The feedback arrives: "Disappointing. Below expectations. Please redo." Three lines. No warmth.',
          choices: [
            { id: 'c1a', text: '"They don\'t appreciate anything I do"', trait: 'judge', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Read it again slowly — what are the actual facts?', trait: 'stripper', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Feel the sting but don\'t add a story to it', trait: 'stoic', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '😤',
          narrative: 'The judgment cascades: they\'re unfair, your work IS good, they don\'t understand. But notice — the feedback said "redo." It didn\'t say "you\'re worthless."',
          choices: [
            { id: 'c2a1', text: 'Strip the judgment: what did they actually say?', trait: 'stripper', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Double down: this IS unfair treatment', trait: 'judge', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🔍',
          narrative: 'Facts only: the work didn\'t meet their standard. They want revisions. That\'s it. No malice required. No personal attack implied. Just a gap between output and expectation.',
          choices: [
            { id: 'c2b1', text: 'Ask specifically what they want changed', trait: 'stripper', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Use this as fuel to exceed expectations', trait: 'stoic', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '🧘',
          narrative: 'The sting is real. You don\'t pretend it doesn\'t hurt. But you refuse to write a novel about three sentences of feedback. The pain is clean — no judgment added.',
          choices: [
            { id: 'c2c1', text: 'Process the feeling, then plan your revision', trait: 'stoic', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Let the clean pain teach you something', trait: 'stripper', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '💎',
          narrative: '"Disappointing. Below expectations. Please redo." Nine words. Your judgment added a novel of suffering. Remove the novel — only nine words remain.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'stripper>=2', title: 'The Surgeon', insight: 'You cut judgment from fact with precision. What remains after the cut is always workable.', wisdomNudge: 'Marcus Aurelius: "Remove the judgment and the hurt itself is removed."', emoji: '🔪' },
        { traitPattern: 'stoic>=2', title: 'The Unshaken', insight: 'You felt the pain without multiplying it. Clean pain heals. Dirty pain — pain plus judgment — festers.', wisdomNudge: 'There is no suffering without the story you attach to it.', emoji: '🏛️' },
        { traitPattern: 'judge>=2', title: 'The Interpreter', insight: 'You added meaning instantly. The feedback was data — you made it a verdict. Notice the difference.', wisdomNudge: 'Facts don\'t hurt. Interpretations hurt. Strip them.', emoji: '⚖️' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'stoic-ex-5-word-forge',
    type: 'word-forge',
    title: 'My Clarity Mantra',
    content: {
      prompt: 'Forge a mantra for stripping judgment. Tap words that cut through.',
      words: [
        { id: 'w1', text: 'Strip', category: 'action' as const },
        { id: 'w2', text: 'the', category: 'value' as const },
        { id: 'w3', text: 'story', category: 'value' as const },
        { id: 'w4', text: 'see', category: 'action' as const },
        { id: 'w5', text: 'clearly', category: 'emotion' as const },
        { id: 'w6', text: 'only', category: 'value' as const },
        { id: 'w7', text: 'facts', category: 'identity' as const },
        { id: 'w8', text: 'remain', category: 'action' as const },
        { id: 'w9', text: 'judgment', category: 'value' as const },
        { id: 'w10', text: 'removed', category: 'action' as const },
        { id: 'w11', text: 'pain', category: 'emotion' as const },
        { id: 'w12', text: 'dissolves', category: 'action' as const },
        { id: 'w13', text: 'truth', category: 'identity' as const },
        { id: 'w14', text: 'is', category: 'value' as const },
        { id: 'w15', text: 'workable', category: 'emotion' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'When judgment clouds your vision, speak these words and see what actually is.',
      style: 'serene' as const,
    },
  },
  {
    id: 'stoic-ex-5-priority-tower',
    type: 'priority-tower',
    title: 'Layers of Judgment',
    content: {
      prompt: 'Rank which judgments cause you the most suffering — from heaviest to lightest.',
      items: [
        { id: 'self-judgment', emoji: '🪞', label: 'Judging yourself' },
        { id: 'others-judgment', emoji: '👥', label: 'Judging others' },
        { id: 'situation-judgment', emoji: '🌪️', label: 'Judging situations as unfair' },
        { id: 'future-judgment', emoji: '🔮', label: 'Judging the future as threatening' },
        { id: 'past-judgment', emoji: '⏳', label: 'Judging the past as wasted' },
        { id: 'comparison', emoji: '📊', label: 'Comparing yourself to others' },
      ],
      insightsByTopChoice: {
        'self-judgment': 'You are your own harshest court. Marcus Aurelius: "How much more grievous are the consequences of anger than the causes of it."',
        'others-judgment': 'Every person you judge carries a history you cannot see. Strip the label — what remains is a human.',
        'situation-judgment': '"Unfair" is a judgment, not a fact. The universe doesn\'t deal in fairness — only in what is.',
        'future-judgment': 'You suffer more in imagination than reality. The future you fear rarely arrives as imagined.',
        'past-judgment': 'The past is ashes. Judging it as "wasted" adds suffering to what already cannot be changed.',
        comparison: 'You compare your behind-the-scenes to their highlight reel. Stop watching their movie.',
      },
      completionMessage: 'Remove the judgment. What remains is just... reality. And reality is always workable.',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6: Fate Permitting (Reserve Clause)
// rapid-verdict, scenario-snap, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson6Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-6-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Grip or Grace?',
    content: {
      statements: [
        { text: 'If I work hard enough, I deserve to succeed', agreeTag: 'gripper', disagreeTag: 'detached' },
        { text: 'I can give my best and accept any outcome', agreeTag: 'detached', disagreeTag: 'gripper' },
        { text: 'Not getting what I want means I failed', agreeTag: 'gripper', disagreeTag: 'detached' },
        { text: 'The process matters more than the result', agreeTag: 'detached', disagreeTag: 'gripper' },
        { text: 'I need certainty before I feel at peace', agreeTag: 'gripper', disagreeTag: 'detached' },
        { text: 'I can plan thoroughly and hold plans loosely', agreeTag: 'detached', disagreeTag: 'gripper' },
        { text: 'When plans fall through I feel personally attacked', agreeTag: 'gripper', disagreeTag: 'detached' },
        { text: 'Life owes me nothing; everything is a bonus', agreeTag: 'detached', disagreeTag: 'gripper' },
        { text: 'My self-worth depends on my achievements', agreeTag: 'gripper', disagreeTag: 'detached' },
        { text: 'I can want something badly and be okay without it', agreeTag: 'detached', disagreeTag: 'gripper' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'detached>=7', title: 'The Philosopher', description: 'You hold goals like a bird — firmly enough to keep, gently enough not to crush. This is mastery.', emoji: '🕊️' },
        { tagPattern: 'detached>=4', title: 'The Apprentice', description: 'You\'re learning to separate effort from outcome. The reserve clause is growing in you.', emoji: '🌱' },
        { tagPattern: 'gripper>=5', title: 'The White-Knuckler', description: 'You grip outcomes so tightly your hands bleed. Maximum effort, yes — but add: "fate permitting."', emoji: '✊' },
        { tagPattern: 'gripper>=8', title: 'The Hostage', description: 'Your peace is held captive by results. The Stoics would free you with three words: fate permitting.', emoji: '⛓️' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'stoic-ex-6-scenario-snap',
    type: 'scenario-snap',
    title: 'The Final Interview',
    content: {
      title: 'The Final Interview',
      frames: [
        {
          id: 'f1', emoji: '🏢',
          narrative: 'You\'ve made it to the final round. Dream job. Dream salary. You crushed every interview. Now you wait. Three days pass. Then: "We went with another candidate."',
          choices: [
            { id: 'c1a', text: 'I did everything right — this is WRONG', trait: 'gripper', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'I gave my best. Fate decided differently.', trait: 'reserve', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Clearly I\'m not good enough', trait: 'collapser', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '😤',
          narrative: 'The anger burns. You deserved this. You earned this. The system is broken. But... did the outcome change? Did the anger help?',
          choices: [
            { id: 'c2a1', text: 'Let go of what I can\'t control', trait: 'reserve', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Keep fighting — contact them again', trait: 'gripper', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🌊',
          narrative: 'You feel the disappointment fully. You don\'t pretend it doesn\'t sting. But somewhere inside, a quiet voice says: "My effort was excellent. The outcome was never mine to own."',
          choices: [
            { id: 'c2b1', text: 'Ask for feedback and redirect energy to next opportunity', trait: 'reserve', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Trust that this opened a door I can\'t yet see', trait: 'reserve', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '😔',
          narrative: 'The rejection becomes evidence against yourself. But consider: they chose "another candidate." Not "a better person." Not "someone more worthy." Just... another candidate.',
          choices: [
            { id: 'c2c1', text: 'Strip the judgment — it was a decision, not a verdict', trait: 'reserve', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Start doubting every skill you have', trait: 'collapser', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🏛️',
          narrative: 'Fate permitting. The Stoics gave everything to every endeavor — and appended these two words. Full effort. Zero grip on outcomes. This is freedom.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'reserve>=2', title: 'The Stoic Archer', insight: 'You aimed with everything. The wind took the arrow where it went. Your aim was perfect — and that\'s all that was yours.', wisdomNudge: '"I will sail across the ocean, fate permitting." Full commitment, zero attachment.', emoji: '🏹' },
        { traitPattern: 'gripper>=2', title: 'The Clenched Fist', insight: 'You fought for what you earned. Admirable — but outcomes are rented, never owned. The grip is the source of suffering.', wisdomNudge: 'Maximum effort, minimum attachment. These can coexist.', emoji: '✊' },
        { traitPattern: 'collapser>=2', title: 'The Self-Doubter', insight: 'You turned a circumstance into an identity. One rejection doesn\'t define you — unless you let it.', wisdomNudge: 'Your worth is in your character, not your results. Those are fate\'s domain.', emoji: '🌧️' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'stoic-ex-6-word-forge',
    type: 'word-forge',
    title: 'My Reserve Clause',
    content: {
      prompt: 'Forge your personal reserve clause. Tap words that free you from outcomes.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'give', category: 'action' as const },
        { id: 'w3', text: 'everything', category: 'value' as const },
        { id: 'w4', text: 'fate', category: 'emotion' as const },
        { id: 'w5', text: 'permitting', category: 'action' as const },
        { id: 'w6', text: 'release', category: 'action' as const },
        { id: 'w7', text: 'the', category: 'value' as const },
        { id: 'w8', text: 'outcome', category: 'value' as const },
        { id: 'w9', text: 'my', category: 'identity' as const },
        { id: 'w10', text: 'effort', category: 'identity' as const },
        { id: 'w11', text: 'is', category: 'value' as const },
        { id: 'w12', text: 'enough', category: 'emotion' as const },
        { id: 'w13', text: 'peace', category: 'emotion' as const },
        { id: 'w14', text: 'in', category: 'value' as const },
        { id: 'w15', text: 'surrender', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'Append these words to every ambition. They will set you free.',
      style: 'serene' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7: The Last Morning (Memento Mori)
// heat-check, rapid-verdict, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson7Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-7-heat-check',
    type: 'heat-check',
    title: 'Mortality Clarity Map',
    content: {
      prompt: 'If this were your last year, map each activity by time spent vs. actual meaning.',
      xAxis: { low: 'Barely any time on it', high: 'Consumes most of my time' },
      yAxis: { low: 'Meaningless to me', high: 'Deeply meaningful' },
      items: [
        { id: 'd1', label: 'Social media', emoji: '📱' },
        { id: 'd2', label: 'Time with loved ones', emoji: '❤️' },
        { id: 'd3', label: 'Work obligations', emoji: '💼' },
        { id: 'd4', label: 'Creative pursuits', emoji: '🎨' },
        { id: 'd5', label: 'Personal growth', emoji: '📚' },
        { id: 'd6', label: 'Worrying about the future', emoji: '😰' },
      ],
      quadrantInsights: {
        topRight: 'Time-heavy AND meaningful — this is alignment. Protect these fiercely.',
        topLeft: 'Deeply meaningful but neglected — memento mori whispers: don\'t wait.',
        bottomRight: 'Takes all your time but means nothing — death exposes this as stolen life.',
        bottomLeft: 'Neither time nor meaning — already released. Good.',
      },
      completionMessage: 'Seneca: "It is not that we have a short time to live, but that we waste a great deal of it."',
      style: 'emotional' as const,
    },
  },
  {
    id: 'stoic-ex-7-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Mortality Mirror',
    content: {
      statements: [
        { text: 'I live as if I have unlimited time', agreeTag: 'sleepwalker', disagreeTag: 'awake' },
        { text: 'Thinking about death makes me anxious', agreeTag: 'avoider', disagreeTag: 'awake' },
        { text: 'I would change how I spend today if it were my last', agreeTag: 'misaligned', disagreeTag: 'aligned' },
        { text: 'I tell the people I love how I feel', agreeTag: 'awake', disagreeTag: 'sleepwalker' },
        { text: 'I postpone what matters most', agreeTag: 'sleepwalker', disagreeTag: 'awake' },
        { text: 'Death awareness could make me more alive', agreeTag: 'awake', disagreeTag: 'avoider' },
        { text: 'I spend time on things I don\'t actually care about', agreeTag: 'misaligned', disagreeTag: 'aligned' },
        { text: 'I have unresolved things I\'d regret leaving unsaid', agreeTag: 'sleepwalker', disagreeTag: 'awake' },
        { text: 'My daily choices reflect what truly matters to me', agreeTag: 'aligned', disagreeTag: 'misaligned' },
        { text: 'I\'m grateful to be alive right now, today', agreeTag: 'awake', disagreeTag: 'sleepwalker' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'awake>=6', title: 'The Awakened', description: 'You live with death on your shoulder — not as fear but as fuel. This is the Stoic way.', emoji: '☀️' },
        { tagPattern: 'aligned>=3', title: 'The Aligned', description: 'Your actions match your values. Memento mori would only sharpen what you already live.', emoji: '🎯' },
        { tagPattern: 'sleepwalker>=4', title: 'The Sleepwalker', description: 'You\'re living as if time is infinite. It isn\'t. Today is the day to wake up.', emoji: '😴' },
        { tagPattern: 'avoider>=3', title: 'The Denier', description: 'Death makes you uncomfortable. But the Stoics found that facing it dissolves the fear and ignites the life.', emoji: '🙈' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'stoic-ex-7-priority-tower',
    type: 'priority-tower',
    title: 'Last Year Priorities',
    content: {
      prompt: 'If you had one year left, rank what you\'d prioritize.',
      items: [
        { id: 'love', emoji: '❤️', label: 'Deep connection with loved ones' },
        { id: 'adventure', emoji: '🌍', label: 'Experiences and adventure' },
        { id: 'legacy', emoji: '📜', label: 'Creating something that lasts' },
        { id: 'healing', emoji: '🩹', label: 'Healing old wounds' },
        { id: 'present', emoji: '🧘', label: 'Being fully present each day' },
        { id: 'service', emoji: '🤝', label: 'Serving others' },
      ],
      insightsByTopChoice: {
        love: 'Marcus Aurelius, on his deathbed, asked only for his friends. Not his empire. Not his legacy. His people.',
        adventure: 'Seneca: "Begin at once to live." You know time is finite — use it to feel alive.',
        legacy: 'What you create may outlast you. But will it matter if you missed the living?',
        healing: 'You\'d reconcile before departing. Why wait? Start the healing today.',
        present: 'The deepest wisdom: this moment is all you ever have. You already know the answer.',
        service: 'The Stoics believed we exist for each other. Your instinct to serve is cosmopolitan virtue.',
      },
      completionMessage: 'Now ask: why aren\'t you living this way already? Memento mori — remember, you will die.',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8: The Rehearsal (Premeditatio Malorum)
// scenario-snap, word-forge, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson8Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-8-scenario-snap',
    type: 'scenario-snap',
    title: 'The Worst Day',
    content: {
      title: 'The Worst Day',
      frames: [
        {
          id: 'f1', emoji: '⚡',
          narrative: 'Everything goes wrong at once. Your alarm didn\'t go off. You spill coffee on your shirt. Traffic is gridlocked. Your boss calls — furious about a deadline you forgot. Your partner texts: "We need to talk."',
          choices: [
            { id: 'c1a', text: 'Completely shut down — this is too much', trait: 'overwhelmed', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Triage: what\'s urgent, what can wait?', trait: 'rehearsed', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Rage at the universe — why always me?', trait: 'victim', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '😶',
          narrative: 'You freeze. The stack of problems feels impossible. But here\'s the Stoic question: did the problems multiply, or did your capacity to handle them shrink?',
          choices: [
            { id: 'c2a1', text: 'Take one breath and handle one thing at a time', trait: 'rehearsed', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Call in sick and crawl back to bed', trait: 'overwhelmed', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🎯',
          narrative: 'Boss call is urgent — handle that first. Partner text is important but can wait two hours. Coffee stain is cosmetic. Alarm is past. You operate like a general under fire.',
          choices: [
            { id: 'c2b1', text: 'Execute the plan with calm precision', trait: 'rehearsed', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Handle the boss, then mentally prepare for the partner talk', trait: 'rehearsed', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '🌩️',
          narrative: 'The anger feels righteous but produces nothing. The alarm doesn\'t un-miss. The coffee doesn\'t un-spill. The rage only adds a sixth problem to five.',
          choices: [
            { id: 'c2c1', text: 'Redirect the anger into action', trait: 'rehearsed', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Vent to someone who\'ll validate the unfairness', trait: 'victim', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🛡️',
          narrative: 'The Stoics rehearsed days like this in advance. Not pessimism — preparation. When you\'ve already imagined the worst, the real thing is never as overwhelming.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'rehearsed>=2', title: 'The Prepared', insight: 'You triaged chaos with composure. This is premeditatio malorum in action — the worst was already rehearsed.', wisdomNudge: 'Seneca: "The man who has anticipated the coming of troubles takes away their power when they arrive."', emoji: '🛡️' },
        { traitPattern: 'overwhelmed>=2', title: 'The Flooded', insight: 'The wave hit all at once and you went under. Premeditatio gives you the raft before the storm arrives.', wisdomNudge: 'You don\'t need to solve everything at once. Handle the one thing in front of you.', emoji: '🌊' },
        { traitPattern: 'victim>=2', title: 'The Lightning Rod', insight: 'You absorbed the chaos and amplified it with blame. The events were real — the "why me?" was optional.', wisdomNudge: 'Bad days happen to everyone. What varies is how prepared you are to meet them.', emoji: '⚡' },
      ],
      style: 'tense' as const,
    },
  },
  {
    id: 'stoic-ex-8-word-forge',
    type: 'word-forge',
    title: 'My Rehearsal Mantra',
    content: {
      prompt: 'Forge a mantra for when everything goes wrong at once. Tap words of readiness.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'have', category: 'value' as const },
        { id: 'w3', text: 'rehearsed', category: 'action' as const },
        { id: 'w4', text: 'this', category: 'value' as const },
        { id: 'w5', text: 'nothing', category: 'value' as const },
        { id: 'w6', text: 'surprises', category: 'emotion' as const },
        { id: 'w7', text: 'me', category: 'identity' as const },
        { id: 'w8', text: 'prepared', category: 'identity' as const },
        { id: 'w9', text: 'calm', category: 'emotion' as const },
        { id: 'w10', text: 'storm', category: 'emotion' as const },
        { id: 'w11', text: 'ready', category: 'action' as const },
        { id: 'w12', text: 'strong', category: 'identity' as const },
        { id: 'w13', text: 'through', category: 'action' as const },
        { id: 'w14', text: 'any', category: 'value' as const },
        { id: 'w15', text: 'fire', category: 'emotion' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'The warrior who expects battle is calm when it arrives. These are your battle words.',
      style: 'fiery' as const,
    },
  },
  {
    id: 'stoic-ex-8-heat-check',
    type: 'heat-check',
    title: 'Fear vs. Probability',
    content: {
      prompt: 'Map your fears: how likely are they to happen vs. how much you dread them?',
      xAxis: { low: 'Very unlikely', high: 'Very likely' },
      yAxis: { low: 'Low dread', high: 'Maximum dread' },
      items: [
        { id: 'f1', label: 'Losing your job', emoji: '💼' },
        { id: 'f2', label: 'Public humiliation', emoji: '😰' },
        { id: 'f3', label: 'Serious illness', emoji: '🏥' },
        { id: 'f4', label: 'Relationship ending', emoji: '💔' },
        { id: 'f5', label: 'Financial ruin', emoji: '💸' },
      ],
      quadrantInsights: {
        topRight: 'High dread, high probability — rehearse these in detail. Premeditatio was made for this quadrant.',
        topLeft: 'High dread, low probability — your mind inflates unlikely fears. Name them and deflate them.',
        bottomRight: 'Low dread, but likely — you\'re already prepared emotionally. Good.',
        bottomLeft: 'Low dread, unlikely — no action needed. Release these completely.',
      },
      completionMessage: 'Seneca rehearsed poverty by sleeping on the floor and eating plain bread — not to suffer, but to stop fearing.',
      style: 'analytical' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9: The Roles We Play
// priority-tower, rapid-verdict, scenario-snap
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson9Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-9-priority-tower',
    type: 'priority-tower',
    title: 'Your Roles, Ranked',
    content: {
      prompt: 'Rank the roles you play by which ones define you most.',
      items: [
        { id: 'child', emoji: '👨‍👩‍👦', label: 'Son/Daughter' },
        { id: 'friend', emoji: '🤝', label: 'Friend' },
        { id: 'professional', emoji: '💼', label: 'Professional/Worker' },
        { id: 'citizen', emoji: '🌍', label: 'Citizen of the world' },
        { id: 'learner', emoji: '📚', label: 'Student/Learner' },
        { id: 'caretaker', emoji: '🫂', label: 'Caretaker/Supporter' },
      ],
      insightsByTopChoice: {
        child: 'Epictetus said your role as a child is to honor those who gave you life — with patience, not perfection.',
        friend: 'Friendship was sacred to the Stoics. Seneca: "One of the most beautiful qualities of true friendship is to understand and to be understood."',
        professional: 'Your work is how you serve. The Stoics believed every role — emperor or slave — demands the same excellence.',
        citizen: 'Marcus Aurelius: "My city and my country is Rome — but as a human being, my city is the world."',
        learner: 'The prokoptōn — the one making progress. Not a sage, but always advancing. This is the noblest self-identity.',
        caretaker: 'Caring for others is sympatheia in action — the web of human connection made real through your hands.',
      },
      completionMessage: 'Epictetus: "You are a citizen of the universe, and a son, and a brother. Consider what each of these titles demands."',
      style: 'warm' as const,
    },
  },
  {
    id: 'stoic-ex-9-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Role Excellence Check',
    content: {
      statements: [
        { text: 'I bring the same effort to every role I play', agreeTag: 'excellent', disagreeTag: 'selective' },
        { text: 'Some roles feel like obligations, not callings', agreeTag: 'burdened', disagreeTag: 'excellent' },
        { text: 'I neglect certain roles when I\'m stressed', agreeTag: 'selective', disagreeTag: 'excellent' },
        { text: 'I try to be excellent even in roles no one sees', agreeTag: 'excellent', disagreeTag: 'selective' },
        { text: 'I resent some of my responsibilities', agreeTag: 'burdened', disagreeTag: 'excellent' },
        { text: 'My public and private selves are the same person', agreeTag: 'excellent', disagreeTag: 'selective' },
        { text: 'I\'d be embarrassed if people saw how I act in certain roles', agreeTag: 'selective', disagreeTag: 'excellent' },
        { text: 'I see every role as an opportunity for virtue', agreeTag: 'excellent', disagreeTag: 'burdened' },
        { text: 'Some roles drain me more than they should', agreeTag: 'burdened', disagreeTag: 'excellent' },
        { text: 'I\'m proud of how I show up in all areas of life', agreeTag: 'excellent', disagreeTag: 'selective' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'excellent>=6', title: 'The Whole Person', description: 'You bring excellence to every role. Marcus would recognize a fellow practitioner.', emoji: '🏛️' },
        { tagPattern: 'selective>=4', title: 'The Spotlight Player', description: 'You shine in some roles, dim in others. The Stoic ideal: equal excellence everywhere.', emoji: '🔦' },
        { tagPattern: 'burdened>=4', title: 'The Weary Bearer', description: 'Some roles feel heavy. Reframe them: each is a chance to practice virtue, not an obligation to endure.', emoji: '⚓' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'stoic-ex-9-scenario-snap',
    type: 'scenario-snap',
    title: 'The Dual Identity',
    content: {
      title: 'The Dual Identity',
      frames: [
        {
          id: 'f1', emoji: '🎭',
          narrative: 'It\'s been a brutal week at work. You\'re exhausted, frustrated, running on fumes. You walk through your front door. Your family is waiting for dinner. They\'re excited to see you.',
          choices: [
            { id: 'c1a', text: 'Bring the work frustration home — you can\'t fake energy', trait: 'leaker', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Take 30 seconds at the door to shift roles consciously', trait: 'intentional', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Put on a smile but seethe internally', trait: 'masker', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '💢',
          narrative: 'Your partner asks how your day was. You unload everything. The mood shifts. Dinner becomes tense. Your child goes quiet. Work invaded your home.',
          choices: [
            { id: 'c2a1', text: 'Realize the cost and commit to a transition ritual', trait: 'intentional', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'They should understand — you\'re only human', trait: 'leaker', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🚪',
          narrative: 'You pause at the doorway. Three breaths. You remind yourself: right now, I\'m not a worker. I\'m a parent, a partner. This role demands my best too. You walk in present.',
          choices: [
            { id: 'c2b1', text: 'Share your day honestly but without dumping', trait: 'intentional', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Focus entirely on them — your stuff can wait', trait: 'intentional', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '😶',
          narrative: 'The smile feels like armor. You\'re "there" but not present. Your family senses something is off but you insist everything is fine. The distance grows.',
          choices: [
            { id: 'c2c1', text: 'Drop the mask and be honest about your state', trait: 'intentional', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Maintain the mask — protecting them is more important', trait: 'masker', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🏛️',
          narrative: 'Epictetus: every role demands its own excellence. The doorway is a stage entrance. What role are you stepping into? Meet it fully.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'intentional>=2', title: 'The Role-Shifter', insight: 'You transition between roles consciously. This is Stoic role ethics: meet each role with its own standard of excellence.', wisdomNudge: 'The 30-second doorway pause is one of the most practical Stoic tools that exist.', emoji: '🚪' },
        { traitPattern: 'leaker>=2', title: 'The Overflow', insight: 'When one role overwhelms, it floods every other. Boundaries between roles aren\'t walls — they\'re bridges you cross intentionally.', wisdomNudge: 'Marcus Aurelius led armies AND wrote philosophy. He never let one role contaminate another.', emoji: '🌊' },
        { traitPattern: 'masker>=2', title: 'The Performer', insight: 'You protect others by hiding yourself. Noble — but unsustainable. True role excellence includes honest vulnerability.', wisdomNudge: 'You can be struggling AND present. These aren\'t contradictions.', emoji: '🎭' },
      ],
      style: 'vulnerable' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10: The Web (Sympatheia)
// word-forge, heat-check, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson10Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-10-word-forge',
    type: 'word-forge',
    title: 'My Interconnection Mantra',
    content: {
      prompt: 'Forge a mantra about your place in the cosmic web. Tap words that connect you.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'am', category: 'value' as const },
        { id: 'w3', text: 'connected', category: 'emotion' as const },
        { id: 'w4', text: 'to', category: 'value' as const },
        { id: 'w5', text: 'everything', category: 'value' as const },
        { id: 'w6', text: 'thread', category: 'identity' as const },
        { id: 'w7', text: 'web', category: 'emotion' as const },
        { id: 'w8', text: 'ripple', category: 'action' as const },
        { id: 'w9', text: 'my', category: 'identity' as const },
        { id: 'w10', text: 'actions', category: 'action' as const },
        { id: 'w11', text: 'matter', category: 'emotion' as const },
        { id: 'w12', text: 'we', category: 'identity' as const },
        { id: 'w13', text: 'are', category: 'value' as const },
        { id: 'w14', text: 'one', category: 'identity' as const },
        { id: 'w15', text: 'weave', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'You are a thread in the web of all things. These words remind you of the weave.',
      style: 'serene' as const,
    },
  },
  {
    id: 'stoic-ex-10-heat-check',
    type: 'heat-check',
    title: 'Ripple Effect Map',
    content: {
      prompt: 'Map each daily action: how small does it feel vs. how far does it actually ripple?',
      xAxis: { low: 'Feels insignificant', high: 'Feels important' },
      yAxis: { low: 'Small ripple', high: 'Far-reaching ripple' },
      items: [
        { id: 'r1', label: 'Being kind to a stranger', emoji: '😊' },
        { id: 'r2', label: 'Losing your temper', emoji: '😤' },
        { id: 'r3', label: 'A genuine compliment', emoji: '💬' },
        { id: 'r4', label: 'Teaching someone something', emoji: '📚' },
        { id: 'r5', label: 'Choosing patience over anger', emoji: '🧘' },
        { id: 'r6', label: 'Ignoring someone who needs help', emoji: '🚶' },
      ],
      quadrantInsights: {
        topRight: 'Feels big AND ripples far — you already invest in these. Double down.',
        topLeft: 'Feels small but ripples far — the hidden power moves. These are where sympatheia lives.',
        bottomRight: 'Feels important but small ripple — don\'t confuse self-importance with impact.',
        bottomLeft: 'Small in every way — or is it? Even silence sends a signal through the web.',
      },
      completionMessage: 'Marcus Aurelius: "What injures the hive injures the bee." Your thread is the web.',
      style: 'emotional' as const,
    },
  },
  {
    id: 'stoic-ex-10-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Isolation Test',
    content: {
      statements: [
        { text: 'My actions only affect me', agreeTag: 'isolated', disagreeTag: 'connected' },
        { text: 'When I suffer, others around me feel it too', agreeTag: 'connected', disagreeTag: 'isolated' },
        { text: 'Strangers have no real impact on my life', agreeTag: 'isolated', disagreeTag: 'connected' },
        { text: 'Everything I do sends a signal to the people watching', agreeTag: 'connected', disagreeTag: 'isolated' },
        { text: 'I\'m fundamentally on my own in this world', agreeTag: 'isolated', disagreeTag: 'connected' },
        { text: 'Helping someone I\'ll never see again still matters', agreeTag: 'connected', disagreeTag: 'isolated' },
        { text: 'My mood has no effect on people I don\'t talk to', agreeTag: 'isolated', disagreeTag: 'connected' },
        { text: 'I\'m part of something larger than myself', agreeTag: 'connected', disagreeTag: 'isolated' },
        { text: 'Small kindnesses are basically meaningless', agreeTag: 'isolated', disagreeTag: 'connected' },
        { text: 'How I treat one person affects how they treat the next', agreeTag: 'connected', disagreeTag: 'isolated' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'connected>=7', title: 'The Thread', description: 'You feel the web. Every action a ripple, every person a node. This is sympatheia — cosmic interconnection.', emoji: '🕸️' },
        { tagPattern: 'connected>=4', title: 'The Awakening', description: 'You sense the connections but don\'t always act on them. The web is there — tune in more.', emoji: '🌅' },
        { tagPattern: 'isolated>=5', title: 'The Island', description: 'You feel alone in the current. But Marcus saw that even the emperor was just a thread. No one is an island.', emoji: '🏝️' },
        { tagPattern: 'isolated>=8', title: 'The Disconnected', description: 'Deep isolation. But here\'s the paradox: you\'re doing this exercise because something in you craves connection. Follow that thread.', emoji: '🔌' },
      ],
      style: 'introspective' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11: The View from Above (Cosmic Perspective)
// heat-check, scenario-snap, word-forge
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson11Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-11-heat-check',
    type: 'heat-check',
    title: 'The Cosmic Scale',
    content: {
      prompt: 'From the View from Above, map how much attention you give each vs. how much it deserves.',
      xAxis: { low: 'Barely think about it', high: 'Occupies my mind constantly' },
      yAxis: { low: 'Cosmically insignificant', high: 'Cosmically significant' },
      items: [
        { id: 'v1', label: 'Social media likes', emoji: '👍' },
        { id: 'v2', label: 'Your character', emoji: '🏛️' },
        { id: 'v3', label: 'Others\' approval', emoji: '👏' },
        { id: 'v4', label: 'Acts of kindness', emoji: '💝' },
        { id: 'v5', label: 'Career status', emoji: '📊' },
        { id: 'v6', label: 'Inner peace', emoji: '🕊️' },
      ],
      quadrantInsights: {
        topRight: 'Significant AND occupying your mind — perfect alignment. This is where attention belongs.',
        topLeft: 'Cosmically significant but ignored — you\'re missing what matters. Redirect your attention.',
        bottomRight: 'Cosmically nothing but consuming you — the view from above dissolves these. Let them go.',
        bottomLeft: 'Small and ignored — correctly so. Your priorities are sound here.',
      },
      completionMessage: 'From space, only character echoes. Everything else is scenery.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'stoic-ex-11-scenario-snap',
    type: 'scenario-snap',
    title: 'The Timeline Shift',
    content: {
      title: 'The Timeline Shift',
      frames: [
        {
          id: 'f1', emoji: '🔭',
          narrative: 'You\'re lying awake at 2 AM, consumed by a problem. A conflict at work. A decision that could change everything. Your chest is tight. Your mind won\'t stop.',
          choices: [
            { id: 'c1a', text: 'Replay the problem from every angle', trait: 'ruminator', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Try the view from above — zoom out', trait: 'philosopher', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Catastrophize about what will happen next', trait: 'catastrophizer', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '🔄',
          narrative: 'Hour three. You\'ve replayed it 47 times. Each replay changes nothing but deepens the groove. The problem is the same size. You\'re smaller.',
          choices: [
            { id: 'c2a1', text: 'Ask: will this matter in 10 years?', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Keep going — maybe the 48th replay will crack it', trait: 'ruminator', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🌌',
          narrative: 'You close your eyes and rise. Your room, your city, your country, Earth. From here, you can\'t even see the building where the conflict happened. Stars burn quietly. The universe doesn\'t know about your problem.',
          choices: [
            { id: 'c2b1', text: 'Breathe deeply — the problem just shrank', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Hold both: the human pain and the cosmic perspective', trait: 'philosopher', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '😰',
          narrative: 'Your mind writes sequels: fired, alone, broke, humiliated. None of it has happened. But your body doesn\'t know that — stress hormones flood as if it\'s real.',
          choices: [
            { id: 'c2c1', text: 'Catch the fiction — come back to what\'s real right now', trait: 'philosopher', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Let the spiral continue — at least you\'re "prepared"', trait: 'catastrophizer', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🌍',
          narrative: 'From far enough above, your problem is invisible. Not because it doesn\'t matter — but because it isn\'t everything. The view from above gives back the rest of your life.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'philosopher>=2', title: 'The Astronaut', insight: 'You achieved the cognitive shift astronauts call the "overview effect." Your problem didn\'t disappear — it found its proper size.', wisdomNudge: 'Keep this practice. At 2 AM, when the walls close in, zoom out. Always zoom out.', emoji: '🚀' },
        { traitPattern: 'ruminator>=2', title: 'The Loop', insight: 'Rumination feels productive but changes nothing. It\'s running on a treadmill of thought. The view from above is the exit door.', wisdomNudge: 'Marcus Aurelius: "Think of the whole of existence, of which your share is tiny."', emoji: '🔄' },
        { traitPattern: 'catastrophizer>=2', title: 'The Fortune Teller', insight: 'You\'re suffering from futures that haven\'t happened. The view from above reminds you: you\'re here, now, alive. That\'s the only fact.', wisdomNudge: 'Anxiety is interest paid on a debt you might never owe.', emoji: '🔮' },
      ],
      style: 'tense' as const,
    },
  },
  {
    id: 'stoic-ex-11-word-forge',
    type: 'word-forge',
    title: 'My Overview Mantra',
    content: {
      prompt: 'Forge a mantra for the 2 AM moments. Tap words that pull you above the clouds.',
      words: [
        { id: 'w1', text: 'From', category: 'value' as const },
        { id: 'w2', text: 'above', category: 'action' as const },
        { id: 'w3', text: 'everything', category: 'value' as const },
        { id: 'w4', text: 'is', category: 'value' as const },
        { id: 'w5', text: 'small', category: 'emotion' as const },
        { id: 'w6', text: 'I', category: 'identity' as const },
        { id: 'w7', text: 'am', category: 'value' as const },
        { id: 'w8', text: 'vast', category: 'identity' as const },
        { id: 'w9', text: 'stars', category: 'emotion' as const },
        { id: 'w10', text: 'breathe', category: 'action' as const },
        { id: 'w11', text: 'zoom', category: 'action' as const },
        { id: 'w12', text: 'out', category: 'action' as const },
        { id: 'w13', text: 'peace', category: 'emotion' as const },
        { id: 'w14', text: 'returns', category: 'action' as const },
        { id: 'w15', text: 'always', category: 'value' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'When the walls close in, speak these words. Rise above. See the whole picture.',
      style: 'serene' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12: The River (Amor Fati)
// rapid-verdict, priority-tower, scenario-snap
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson12Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-12-rapid-verdict',
    type: 'rapid-verdict',
    title: 'Fight or Flow?',
    content: {
      statements: [
        { text: 'I resist changes I didn\'t choose', agreeTag: 'fighter', disagreeTag: 'river' },
        { text: 'I can find meaning in unwanted events', agreeTag: 'river', disagreeTag: 'fighter' },
        { text: 'Bad luck means the universe is against me', agreeTag: 'fighter', disagreeTag: 'river' },
        { text: 'Every setback contains a hidden instruction', agreeTag: 'river', disagreeTag: 'fighter' },
        { text: 'I need things to go my way to be happy', agreeTag: 'fighter', disagreeTag: 'river' },
        { text: 'I can love my fate — even the painful parts', agreeTag: 'river', disagreeTag: 'fighter' },
        { text: 'Accepting bad things means giving up', agreeTag: 'fighter', disagreeTag: 'river' },
        { text: 'What happened to me made me who I am', agreeTag: 'river', disagreeTag: 'fighter' },
        { text: 'I would erase painful memories if I could', agreeTag: 'fighter', disagreeTag: 'river' },
        { text: 'I trust the process even when I can\'t see the plan', agreeTag: 'river', disagreeTag: 'fighter' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'river>=7', title: 'The River', description: 'You flow with fate instead of fighting it. Amor fati — love of fate — is already in your bones.', emoji: '🌊' },
        { tagPattern: 'river>=4', title: 'The Tributary', description: 'Part of you flows, part resists. The current is there — surrender to it more fully.', emoji: '💧' },
        { tagPattern: 'fighter>=5', title: 'The Dam', description: 'You block what you can\'t control. But the river always wins. Fighting fate exhausts you.', emoji: '🧱' },
        { tagPattern: 'fighter>=8', title: 'The Boulder', description: 'You stand firm against everything. But what if the current isn\'t your enemy? What if it\'s your path?', emoji: '🪨' },
      ],
      style: 'introspective' as const,
    },
  },
  {
    id: 'stoic-ex-12-priority-tower',
    type: 'priority-tower',
    title: 'Lessons from Hardship',
    content: {
      prompt: 'Rank the painful experiences by how much they ultimately taught you.',
      items: [
        { id: 'heartbreak', emoji: '💔', label: 'A heartbreak' },
        { id: 'failure', emoji: '📉', label: 'A major failure' },
        { id: 'loss', emoji: '🕊️', label: 'A significant loss' },
        { id: 'rejection', emoji: '🚫', label: 'A crushing rejection' },
        { id: 'betrayal', emoji: '🗡️', label: 'A betrayal of trust' },
        { id: 'illness', emoji: '🏥', label: 'A health crisis' },
      ],
      insightsByTopChoice: {
        heartbreak: 'Love lost taught you what love is. Amor fati says: this pain was the price of knowing how to love.',
        failure: 'Every master failed first. The failure wasn\'t a detour — it was the curriculum.',
        loss: 'Loss reveals what mattered. You couldn\'t see the shape of the gift until it was gone.',
        rejection: 'Rejection redirected you. The "no" you hated may have been the "yes" you needed.',
        betrayal: 'Trust broken taught you about trust itself. The wound became wisdom.',
        illness: 'The body\'s frailty awakened something eternal. Health crises are involuntary memento mori.',
      },
      completionMessage: 'Amor fati: love your fate. Not despite the pain — because of what the pain forged.',
      style: 'warm' as const,
    },
  },
  {
    id: 'stoic-ex-12-scenario-snap',
    type: 'scenario-snap',
    title: 'The Unwanted Transfer',
    content: {
      title: 'The Unwanted Transfer',
      frames: [
        {
          id: 'f1', emoji: '📋',
          narrative: 'Your company announces a restructuring. You\'re being transferred to a department you didn\'t choose, working on projects you don\'t care about. Effective immediately. No discussion.',
          choices: [
            { id: 'c1a', text: 'This is unfair — start fighting it immediately', trait: 'fighter', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Feel the resistance, then ask: what can I make of this?', trait: 'lover', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Resign on the spot — you won\'t be disrespected', trait: 'reactor', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '⚔️',
          narrative: 'You escalate. HR meetings, emails, veiled threats. Weeks pass fighting the inevitable. Your energy is consumed. Meanwhile, the new team is starting without you.',
          choices: [
            { id: 'c2a1', text: 'Accept reality and find the hidden opportunity', trait: 'lover', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Keep fighting — principles matter more', trait: 'fighter', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🌊',
          narrative: 'You let the disappointment flow through you without drowning in it. Then curiosity arrives: what skills might this new role teach you? Who will you meet? What doors open that you couldn\'t see?',
          choices: [
            { id: 'c2b1', text: 'Dive in and make this the best chapter yet', trait: 'lover', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Accept it but stay ready to return to your old role', trait: 'lover', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '🚪',
          narrative: 'You walk out. It feels powerful. Then reality sets in: you have no backup plan, bills are due, and the job market is cold. The reactive choice created a bigger problem.',
          choices: [
            { id: 'c2c1', text: 'Learn the lesson: reaction isn\'t the same as strength', trait: 'lover', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Double down — at least you have your dignity', trait: 'reactor', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🔥',
          narrative: 'Marcus Aurelius didn\'t choose to fight the Germanic wars. He didn\'t choose the plague. He didn\'t choose to be emperor. He chose to meet each fate with excellence. Amor fati.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'lover>=2', title: 'The Alchemist', insight: 'You found gold in unwanted circumstances. This is amor fati — not just accepting fate but LOVING it.', wisdomNudge: 'Every unwanted transfer in your life led you somewhere you needed to be. Trust the current.', emoji: '⚗️' },
        { traitPattern: 'fighter>=2', title: 'The Resistor', insight: 'You fought what couldn\'t be changed. Bravery, yes — but at what cost? Amor fati isn\'t surrender. It\'s redirection.', wisdomNudge: 'The river doesn\'t fight the rock. It flows around it. And eventually, the rock yields.', emoji: '🪨' },
        { traitPattern: 'reactor>=2', title: 'The Detonator', insight: 'You blew up the bridge before checking what was on the other side. Sometimes the unwanted path leads to the treasure.', wisdomNudge: 'Impulse feels like strength. But true strength is the pause before the action.', emoji: '💥' },
      ],
      style: 'vulnerable' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 13: The Unreachable Star (Sage Ideal)
// word-forge, heat-check, rapid-verdict
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson13Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-13-word-forge',
    type: 'word-forge',
    title: 'My Progress Mantra',
    content: {
      prompt: 'Forge a mantra about the beauty of never arriving. Tap words of becoming.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'am', category: 'value' as const },
        { id: 'w3', text: 'becoming', category: 'action' as const },
        { id: 'w4', text: 'not', category: 'value' as const },
        { id: 'w5', text: 'perfect', category: 'value' as const },
        { id: 'w6', text: 'but', category: 'value' as const },
        { id: 'w7', text: 'progressing', category: 'action' as const },
        { id: 'w8', text: 'the', category: 'value' as const },
        { id: 'w9', text: 'path', category: 'identity' as const },
        { id: 'w10', text: 'is', category: 'value' as const },
        { id: 'w11', text: 'enough', category: 'emotion' as const },
        { id: 'w12', text: 'star', category: 'emotion' as const },
        { id: 'w13', text: 'guides', category: 'action' as const },
        { id: 'w14', text: 'never', category: 'value' as const },
        { id: 'w15', text: 'arriving', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'The star you chase will never be caught. But the chase makes you luminous.',
      style: 'serene' as const,
    },
  },
  {
    id: 'stoic-ex-13-heat-check',
    type: 'heat-check',
    title: 'The Progress Map',
    content: {
      prompt: 'Map each virtue: how far you\'ve come vs. how far you have to go.',
      xAxis: { low: 'Just beginning', high: 'Well-practiced' },
      yAxis: { low: 'Easy for me', high: 'Deeply challenging' },
      items: [
        { id: 'v1', label: 'Wisdom — seeing clearly', emoji: '🦉' },
        { id: 'v2', label: 'Courage — doing what\'s right', emoji: '🦁' },
        { id: 'v3', label: 'Justice — treating others fairly', emoji: '⚖️' },
        { id: 'v4', label: 'Temperance — moderation', emoji: '🧘' },
        { id: 'v5', label: 'Patience — enduring difficulty', emoji: '🌊' },
      ],
      quadrantInsights: {
        topRight: 'Challenging but well-practiced — you\'re doing the hard work. The prokoptōn at their finest.',
        topLeft: 'Challenging and barely started — this is your growth edge. The star shines brightest here.',
        bottomRight: 'Easy and well-practiced — natural virtues. Honor them but don\'t confuse comfort for growth.',
        bottomLeft: 'Easy and just beginning — low-hanging fruit. Pick it while reaching for harder virtues.',
      },
      completionMessage: 'The Sage is unreachable. The prokoptōn — the one progressing — is you. That\'s better.',
      style: 'analytical' as const,
    },
  },
  {
    id: 'stoic-ex-13-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Perfectionism Test',
    content: {
      statements: [
        { text: 'If I can\'t do it perfectly, I\'d rather not try', agreeTag: 'perfectionist', disagreeTag: 'prokoptonist' },
        { text: 'Progress is more satisfying than perfection', agreeTag: 'prokoptonist', disagreeTag: 'perfectionist' },
        { text: 'I judge myself by an impossible standard', agreeTag: 'perfectionist', disagreeTag: 'prokoptonist' },
        { text: 'Making mistakes is how I learn', agreeTag: 'prokoptonist', disagreeTag: 'perfectionist' },
        { text: 'I feel fraudulent when I can\'t live up to my ideals', agreeTag: 'perfectionist', disagreeTag: 'prokoptonist' },
        { text: 'I celebrate small wins even when far from the goal', agreeTag: 'prokoptonist', disagreeTag: 'perfectionist' },
        { text: 'My best is never quite good enough', agreeTag: 'perfectionist', disagreeTag: 'prokoptonist' },
        { text: 'I\'m more interested in direction than destination', agreeTag: 'prokoptonist', disagreeTag: 'perfectionist' },
        { text: 'I compare my reality to an ideal that doesn\'t exist', agreeTag: 'perfectionist', disagreeTag: 'prokoptonist' },
        { text: 'Today I\'m better than yesterday — that\'s enough', agreeTag: 'prokoptonist', disagreeTag: 'perfectionist' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'prokoptonist>=7', title: 'The Prokoptōn', description: 'You\'ve embraced the Stoic ideal: endless progress, zero perfection. The journey IS the destination.', emoji: '🌟' },
        { tagPattern: 'prokoptonist>=4', title: 'The Climber', description: 'You value progress but perfectionism still whispers. Keep climbing — the star guides, not judges.', emoji: '🧗' },
        { tagPattern: 'perfectionist>=5', title: 'The Icarus', description: 'You fly toward an impossible sun. Beautiful ambition, but the fall is always built in. Aim for progress instead.', emoji: '🪽' },
        { tagPattern: 'perfectionist>=8', title: 'The Paralyzed', description: 'Perfection has become the enemy of action. The Stoic Sage is a compass heading, not a destination. Walk.', emoji: '🧊' },
      ],
      style: 'bold' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14: Citizens of Everywhere (Cosmopolitanism)
// scenario-snap, rapid-verdict, priority-tower
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson14Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-14-scenario-snap',
    type: 'scenario-snap',
    title: 'The Stranger on the Bus',
    content: {
      title: 'The Stranger on the Bus',
      frames: [
        {
          id: 'f1', emoji: '🚌',
          narrative: 'A stranger sits next to you on a crowded bus. They smell unwashed. They mutter to themselves. Other passengers give looks of disgust. You have 20 minutes left in the ride.',
          choices: [
            { id: 'c1a', text: 'Move seats — you don\'t owe strangers anything', trait: 'bordered', nextFrameId: 'f2a' },
            { id: 'c1b', text: 'Stay. This is a human being, like you.', trait: 'cosmopolitan', nextFrameId: 'f2b' },
            { id: 'c1c', text: 'Put in earbuds and ignore them completely', trait: 'indifferent', nextFrameId: 'f2c' },
          ],
        },
        {
          id: 'f2a', emoji: '🪑',
          narrative: 'You move. The stranger notices. Something shifts in their eyes — not anger, just... recognition. They\'ve been moved away from before. They go quieter.',
          choices: [
            { id: 'c2a1', text: 'Feel a pang of guilt — reconsider', trait: 'cosmopolitan', nextFrameId: 'f3' },
            { id: 'c2a2', text: 'Your comfort matters too — no guilt', trait: 'bordered', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2b', emoji: '🤝',
          narrative: 'You stay. After a few stops, they turn to you: "Nobody sits next to me." You nod. "I\'m just riding the bus," you say. They smile — the first smile maybe all day.',
          choices: [
            { id: 'c2b1', text: 'Ask their name — extend the humanity', trait: 'cosmopolitan', nextFrameId: 'f3' },
            { id: 'c2b2', text: 'Share a comfortable silence — presence is enough', trait: 'cosmopolitan', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f2c', emoji: '🎧',
          narrative: 'The music fills your ears. The person next to you doesn\'t exist anymore. But they do. They\'re right there. A human life, inches away, erased by a choice.',
          choices: [
            { id: 'c2c1', text: 'Take out the earbuds — be present', trait: 'cosmopolitan', nextFrameId: 'f3' },
            { id: 'c2c2', text: 'Not my responsibility — I\'m allowed boundaries', trait: 'indifferent', nextFrameId: 'f3' },
          ],
        },
        {
          id: 'f3', emoji: '🌍',
          narrative: 'Marcus Aurelius: "My city and my country is Rome — but as a human being, my city is the world." The stranger is your fellow citizen.',
          choices: [],
        },
      ],
      outcomes: [
        { traitPattern: 'cosmopolitan>=2', title: 'The Citizen', insight: 'You saw a fellow human where others saw a problem. This is cosmopolitanism: the radical equality of all people.', wisdomNudge: 'Every person you pass carries a universe inside them. Treat them accordingly.', emoji: '🌍' },
        { traitPattern: 'bordered>=2', title: 'The Gatekeeper', insight: 'You drew a line between "my people" and "not my people." The Stoics would erase that line entirely.', wisdomNudge: 'Comfort is not threatened by proximity to suffering. You can be comfortable AND compassionate.', emoji: '🧱' },
        { traitPattern: 'indifferent>=2', title: 'The Ghost', insight: 'You made someone invisible. It\'s the most common cruelty — and the easiest to reverse.', wisdomNudge: 'Acknowledgment costs nothing and can mean everything. See people.', emoji: '👻' },
      ],
      style: 'vulnerable' as const,
    },
  },
  {
    id: 'stoic-ex-14-rapid-verdict',
    type: 'rapid-verdict',
    title: 'The Boundary Check',
    content: {
      statements: [
        { text: 'I naturally empathize with people different from me', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
        { text: 'I feel more comfortable with "my kind" of people', agreeTag: 'tribal', disagreeTag: 'cosmopolitan' },
        { text: 'Every human being deserves basic dignity', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
        { text: 'Some people are simply beyond helping', agreeTag: 'tribal', disagreeTag: 'cosmopolitan' },
        { text: 'I would help a stranger as willingly as a friend', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
        { text: 'My compassion has limits based on who someone is', agreeTag: 'tribal', disagreeTag: 'cosmopolitan' },
        { text: 'Borders between people are mostly arbitrary', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
        { text: 'I prioritize people who are "like me"', agreeTag: 'tribal', disagreeTag: 'cosmopolitan' },
        { text: 'Suffering is suffering, regardless of who experiences it', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
        { text: 'My circle of concern should be the entire human race', agreeTag: 'cosmopolitan', disagreeTag: 'tribal' },
      ],
      timePerCard: 4,
      resultProfiles: [
        { tagPattern: 'cosmopolitan>=7', title: 'The Cosmopolite', description: 'Your circle of concern is the whole species. Marcus would recognize a fellow citizen.', emoji: '🌍' },
        { tagPattern: 'cosmopolitan>=4', title: 'The Expanding Circle', description: 'Your borders are widening. Each expansion is a victory for your humanity.', emoji: '⭕' },
        { tagPattern: 'tribal>=5', title: 'The Tribalist', description: 'You draw circles around "us" and "them." The Stoics drew one circle: humanity.', emoji: '🔺' },
        { tagPattern: 'tribal>=8', title: 'The Fortress', description: 'Your walls are high. But every wall that keeps others out also keeps you in.', emoji: '🏰' },
      ],
      style: 'bold' as const,
    },
  },
  {
    id: 'stoic-ex-14-priority-tower',
    type: 'priority-tower',
    title: 'Expanding the Circle',
    content: {
      prompt: 'Rank these circles of concern — who do you serve? From innermost to outermost.',
      items: [
        { id: 'self', emoji: '🪞', label: 'Yourself' },
        { id: 'family', emoji: '👨‍👩‍👧', label: 'Your family' },
        { id: 'friends', emoji: '🤝', label: 'Your friends' },
        { id: 'community', emoji: '🏘️', label: 'Your community' },
        { id: 'strangers', emoji: '🌐', label: 'Strangers across the world' },
        { id: 'future', emoji: '🔮', label: 'Future generations' },
      ],
      insightsByTopChoice: {
        self: 'Self-care is the foundation — but the Stoics say: you exist for others. Serve yourself so you can serve.',
        family: 'The natural starting point. But Marcus expanded this: my family is all of Rome. Then: all of humanity.',
        friends: 'Friendship was sacred to the Stoics. But they defined "friend" as any fellow rational being.',
        community: 'Your immediate world. The Stoics would ask: can you expand "community" to mean everyone?',
        strangers: 'You\'ve already transcended tribalism. This is Hierocles\' circle exercise in action.',
        future: 'You serve people you\'ll never meet. This is the ultimate cosmopolitan virtue.',
      },
      completionMessage: 'Hierocles imagined concentric circles of concern — self, family, city, humanity. The Stoic goal: pull every circle closer to the center.',
      style: 'warm' as const,
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15: The Philosopher's Life (Eudaimonia)
// priority-tower, word-forge, heat-check
// ─────────────────────────────────────────────────────────────────────────────
export const stoicLesson15Exercises: DailyExercise[] = [
  {
    id: 'stoic-ex-15-priority-tower',
    type: 'priority-tower',
    title: 'The Good Life',
    content: {
      prompt: 'Rank the components of a life well-lived — the Stoic eudaimonia.',
      items: [
        { id: 'virtue', emoji: '🏛️', label: 'Living virtuously' },
        { id: 'presence', emoji: '🧘', label: 'Being fully present' },
        { id: 'service', emoji: '🤲', label: 'Serving others' },
        { id: 'resilience', emoji: '💎', label: 'Resilience through adversity' },
        { id: 'wisdom', emoji: '🦉', label: 'Continuous learning' },
        { id: 'amor-fati', emoji: '🔥', label: 'Loving your fate' },
      ],
      insightsByTopChoice: {
        virtue: 'The Stoics agree: virtue is the only true good. Everything else — health, wealth, reputation — is "preferred indifferent." You found the core.',
        presence: 'Marcus Aurelius: "Never value anything as profitable that compels you to break your promise, lose your self-respect, or hate any man." Presence is integrity.',
        service: 'The Stoics believed we exist for each other. Your philosophy lives in your hands, not your head.',
        resilience: 'The obstacle is the way. You know this in your bones now. Fire tests gold; adversity tests the strong.',
        wisdom: 'The prokoptōn never stops learning. You are not wise — you are becoming wiser. That\'s the point.',
        'amor-fati': 'Love your fate. Not just the good parts — all of it. This is the pinnacle of Stoic practice.',
      },
      completionMessage: 'Eudaimonia: a flourishing life. Not happiness as pleasure — happiness as excellence. You\'ve walked the entire Stoic path.',
      style: 'warm' as const,
    },
  },
  {
    id: 'stoic-ex-15-word-forge',
    type: 'word-forge',
    title: 'My Philosophy of Life',
    content: {
      prompt: 'Forge your final mantra. The words that will carry your Stoic philosophy forward.',
      words: [
        { id: 'w1', text: 'I', category: 'identity' as const },
        { id: 'w2', text: 'live', category: 'action' as const },
        { id: 'w3', text: 'with', category: 'value' as const },
        { id: 'w4', text: 'wisdom', category: 'identity' as const },
        { id: 'w5', text: 'courage', category: 'emotion' as const },
        { id: 'w6', text: 'justice', category: 'identity' as const },
        { id: 'w7', text: 'temperance', category: 'action' as const },
        { id: 'w8', text: 'my', category: 'identity' as const },
        { id: 'w9', text: 'fate', category: 'emotion' as const },
        { id: 'w10', text: 'is', category: 'value' as const },
        { id: 'w11', text: 'loved', category: 'emotion' as const },
        { id: 'w12', text: 'philosophy', category: 'identity' as const },
        { id: 'w13', text: 'bleeds', category: 'action' as const },
        { id: 'w14', text: 'through', category: 'value' as const },
        { id: 'w15', text: 'action', category: 'action' as const },
      ],
      minSelections: 3,
      maxSelections: 6,
      forgeMessage: 'This is your philosophy, forged in fire and practice. Carry it into everything you do.',
      style: 'fiery' as const,
    },
  },
  {
    id: 'stoic-ex-15-heat-check',
    type: 'heat-check',
    title: 'The Stoic Integration Map',
    content: {
      prompt: 'Map each Stoic practice: how often you use it vs. how much it transforms you.',
      xAxis: { low: 'Rarely practice', high: 'Daily practice' },
      yAxis: { low: 'Minor effect', high: 'Life-changing effect' },
      items: [
        { id: 's1', label: 'Dichotomy of Control', emoji: '⚖️' },
        { id: 's2', label: 'Removing Judgment', emoji: '🔍' },
        { id: 's3', label: 'View from Above', emoji: '🌍' },
        { id: 's4', label: 'Memento Mori', emoji: '💀' },
        { id: 's5', label: 'Amor Fati', emoji: '🔥' },
        { id: 's6', label: 'Premeditatio Malorum', emoji: '🛡️' },
      ],
      quadrantInsights: {
        topRight: 'Daily and life-changing — this practice is your cornerstone. Protect it. Deepen it.',
        topLeft: 'Life-changing but neglected — you know it works. Why aren\'t you doing it daily? Start tomorrow.',
        bottomRight: 'Daily but low impact — maybe you\'re going through the motions. Reignite the intention behind it.',
        bottomLeft: 'Rarely used, minor effect — not your path. Focus on what transforms you.',
      },
      completionMessage: 'You have completed the Stoic path. Not as a Sage — as something better: a prokoptōn who will never stop.',
      style: 'emotional' as const,
    },
  },
];
