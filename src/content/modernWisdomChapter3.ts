// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 3: RELATIONSHIPS - The Art of Human Connection
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11: THE MIRROR EFFECT
// ─────────────────────────────────────────────────────────────────────────────

const lesson11_MirrorEffect: FlexibleLesson = {
    id: 'modern-11-mirror-effect',
    slug: 'mirror-effect',
    order: 1,
    title: 'The Mirror Effect',
    subtitle: 'Others reflect what you project',
    description: 'Discover how changing yourself changes everyone around you.',
    coreConceptTag: 'projection',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🪞', color: '#a855f7' },
    teaserText: "Tomorrow you'll discover why the people who frustrate you most might be your greatest teachers.",
    exercises: [],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "There's someone who frustrates you. Someone who seems impossible. Here's the uncomfortable truth: the people who trigger us most are often showing us something about ourselves we don't want to see.",
            subtext: "The world is a mirror, not a window.",
            continueLabel: "I'm curious",
            mood: 'curiosity',
        },
        {
            id: 'mirror-insight',
            type: 'insight',
            text: "What we react to strongly in others often exists within us. The anger that enrages us in someone else? We might fear our own anger. The laziness we judge? Perhaps we secretly fear we're not working hard enough. This isn't blame—it's liberation.",
            style: 'principle',
            nextStepId: 'identify-trigger',
        },
        {
            id: 'identify-trigger',
            type: 'commitment',
            prompt: "Think of someone who frequently triggers or frustrates you. What specific quality or behavior bothers you most?",
            placeholder: "The person is... What bothers me most is their...",
            minimumWords: 10,
            continueLabel: "I see what triggers me",
            storeAs: 'trigger',
            nextStepId: 'mirror-question',
        },
        {
            id: 'mirror-question',
            type: 'visualization',
            title: 'The Mirror',
            instructions: [
                'Hold that frustrating quality in your mind.',
                'Now ask: Where does this exist in ME?',
                'Perhaps in a different form...',
                '...or perhaps you fear becoming this way.',
                'Or maybe you once were this way and judge yourself.',
                'What is this person showing you about yourself?',
                'There is no judgment here. Only seeing.',
            ],
            paceSeconds: 5,
            style: 'grounding',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What did you discover? What might this trigger be reflecting about your own fears, shadows, or hidden qualities?",
            minimumWords: 20,
            encouragements: [
                'Be honest with yourself',
                "What you can see, you can heal",
                "This isn't about blame—it's about freedom",
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
                    "Carl Jung called this 'shadow work.' When you see your triggers as teachers rather than attacks, you gain power over your reactions. You did the work most people avoid.",
                    "The Stoics said we cannot control others, only ourselves. Today you went further—you saw that others are often reflecting what needs attention within us.",
                    "Every person who frustrates you is offering a lesson. Not a comfortable truth, but a liberating one. You had the courage to look.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12: RADICAL HONESTY
// ─────────────────────────────────────────────────────────────────────────────

const lesson12_RadicalHonesty: FlexibleLesson = {
    id: 'modern-12-radical-honesty',
    slug: 'radical-honesty',
    order: 2,
    title: 'Radical Honesty',
    subtitle: 'The truth will set you free (but first it will make you uncomfortable)',
    description: 'Learn why small lies imprison you and radical honesty liberates.',
    coreConceptTag: 'honesty',
    xpReward: 22,
    estimatedMinutes: 6,
    thumbnail: { icon: '🔓', color: '#06b6d4' },
    teaserText: "Tomorrow you'll understand why small lies build prisons and radical honesty sets you free.",
    exercises: [],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Every 'I'm fine' when you're not. Every 'Sure, no problem' when it is. Every polite lie. They seem harmless. But each one is a tiny brick in a prison you're building around yourself.",
            subtext: "The weight of small deceptions compounds daily.",
            continueLabel: "I feel that weight",
            mood: 'tension',
        },
        {
            id: 'honesty-insight',
            type: 'insight',
            text: "Radical honesty isn't about being brutal. It's about being real. The energy we spend managing impressions and protecting lies could be spent on actual living. When you tell the truth, you stop carrying the burden of maintaining the fiction.",
            source: 'Brad Blanton',
            sourceBook: 'Radical Honesty',
            style: 'principle',
            nextStepId: 'identify-lie',
        },
        {
            id: 'identify-lie',
            type: 'commitment',
            prompt: "What is one thing you haven't been honest about? A conversation you've been avoiding, a feeling you're hiding, a truth you've been withholding from yourself or others?",
            placeholder: "I haven't been honest about... I've been hiding... I need to admit...",
            minimumWords: 10,
            guidanceHints: [
                'This stays private—be truly honest',
                'What would it feel like to release this?',
            ],
            continueLabel: "This is my hidden truth",
            storeAs: 'hidden-truth',
            nextStepId: 'choice',
        },
        {
            id: 'choice',
            type: 'choice',
            question: 'This truth involves:',
            instruction: 'Choose which applies',
            options: [
                {
                    id: 'others',
                    label: 'Honesty with someone else',
                    subtext: "There's a conversation I need to have",
                    nextStepId: 'others-path',
                },
                {
                    id: 'self',
                    label: 'Honesty with myself',
                    subtext: "There's something I've been denying to myself",
                    nextStepId: 'self-path',
                },
            ],
        },
        {
            id: 'others-path',
            type: 'commitment',
            prompt: "What would you say if you were being radically honest? Write the exact words, as if you were speaking them right now.",
            placeholder: "What I really need to say is...",
            minimumWords: 15,
            continueLabel: "I've written my truth",
            storeAs: 'honest-statement',
            nextStepId: 'action-question',
        },
        {
            id: 'self-path',
            type: 'reflection',
            prompt: "Write the truth you've been avoiding. Say it clearly to yourself. What have you been pretending not to know?",
            minimumWords: 20,
            encouragements: [
                'This is for you alone',
                'What would change if you fully accepted this truth?',
            ],
            nextStepId: 'reward',
        },
        {
            id: 'action-question',
            type: 'choice',
            question: "Will you have this honest conversation in the next 48 hours?",
            options: [
                {
                    id: 'yes-commit',
                    label: 'Yes, I commit to having this conversation',
                    nextStepId: 'commitment-made',
                },
                {
                    id: 'not-yet',
                    label: 'Not yet—I need more time',
                    nextStepId: 'not-yet-insight',
                },
            ],
        },
        {
            id: 'commitment-made',
            type: 'insight',
            text: "You've made a commitment to truth. The conversation may be uncomfortable for 5 minutes, but the freedom it creates lasts far longer than the temporary discomfort.",
            style: 'revelation',
            nextStepId: 'reflection-final',
        },
        {
            id: 'not-yet-insight',
            type: 'insight',
            text: "That's honest too. But ask yourself: is 'not yet' protecting you or imprisoning you? Sometimes 'not yet' is wisdom. Sometimes it's fear dressed as patience.",
            style: 'reframe',
            nextStepId: 'reflection-final',
        },
        {
            id: 'reflection-final',
            type: 'reflection',
            prompt: "What would your life look like if you were radically honest? What truth is most important for you to embrace?",
            minimumWords: 15,
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
                    "The truth sets you free, but first it scares you. Today you looked at something you've been avoiding. That takes courage.",
                    "Every honest word spoken is a brick removed from your prison. You may not have spoken it yet, but you've acknowledged it. That's the first step.",
                ],
                byChoice: {
                    'yes-commit': [
                        "You chose truth over comfort. Whatever happens in that conversation, you'll be lighter for having had it. The weight of unspoken words is heavier than any difficult conversation.",
                    ],
                    'not-yet': [
                        "Timing matters. But watch that 'not yet' carefully. If it's been 'not yet' for weeks or months, the timing may never feel right. Sometimes we must make the moment right rather than wait for it.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 13: BOUNDARIES WITH GRACE
// ─────────────────────────────────────────────────────────────────────────────

const lesson13_BoundariesGrace: FlexibleLesson = {
    id: 'modern-13-boundaries-grace',
    slug: 'boundaries-grace',
    order: 3,
    title: 'Boundaries with Grace',
    subtitle: 'Saying no without guilt',
    description: "Learn why healthy boundaries aren't selfish—they're essential.",
    coreConceptTag: 'boundaries',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🛡️', color: '#f59e0b' },
    teaserText: "Tomorrow you'll learn how to say 'no' without guilt - the skill that protects everything you care about.",
    exercises: [],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You said yes when you meant no. Again. You overcommitted, overextended, and now you resent the very things you agreed to. The inability to set boundaries doesn't make you kind. It makes you dishonest—and eventually, exhausted.",
            subtext: "'No' is a complete sentence.",
            continueLabel: "I know this pattern",
            mood: 'tension',
        },
        {
            id: 'boundary-insight',
            type: 'insight',
            text: "Healthy boundaries aren't walls—they're filters. They protect your energy while allowing genuine connection. Every 'yes' to something is a 'no' to something else. Saying no isn't rejection of others; it's protection of your integrity.",
            style: 'principle',
            nextStepId: 'identify-breach',
        },
        {
            id: 'identify-breach',
            type: 'commitment',
            prompt: "Where are your boundaries being crossed? What 'yes' do you need to change to a 'no'?",
            placeholder: "I need to stop saying yes to... I'm overcommitting when... A boundary I need to set is...",
            minimumWords: 10,
            continueLabel: "I see where I need boundaries",
            storeAs: 'boundary-need',
            nextStepId: 'script-practice',
        },
        {
            id: 'script-practice',
            type: 'commitment',
            prompt: "Write a graceful but firm way to communicate this boundary. Practice the exact words you would use.",
            placeholder: "I'm honored you asked, but I'm not able to... Thank you for thinking of me. I need to decline because...",
            minimumWords: 10,
            guidanceHints: [
                'You don\'t owe lengthy explanations',
                'Kind but clear',
                'No justification needed—just the truth',
            ],
            continueLabel: "I have my words",
            storeAs: 'boundary-script',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How does it feel to have words for protecting your energy? What would change if you consistently honored your own boundaries?",
            minimumWords: 15,
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
                    "Boundaries are the immune system of the soul. Without them, you absorb everyone else's demands until there's nothing left of you. You just fortified your defenses.",
                    "The people who respect you will respect your boundaries. The ones who don't were benefiting from your lack of them. Either way, you discover the truth.",
                    "Guilt about boundaries is a lie we tell ourselves. The truth: people-pleasing is often about our need to be liked, not genuine generosity. Real generosity comes from overflow, not depletion.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14: THE EMPATHY SHIFT
// ─────────────────────────────────────────────────────────────────────────────

const lesson14_EmpathyShift: FlexibleLesson = {
    id: 'modern-14-empathy-shift',
    slug: 'empathy-shift',
    order: 4,
    title: 'The Empathy Shift',
    subtitle: 'Seek first to understand',
    description: 'Transform conflict by understanding before demanding to be understood.',
    coreConceptTag: 'empathy',
    xpReward: 22,
    estimatedMinutes: 6,
    thumbnail: { icon: '💗', color: '#ec4899' },
    teaserText: "Tomorrow you'll learn the single shift that transforms conflict into connection.",
    exercises: [],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "In most conflicts, both people are fighting to be understood. Nobody is trying to understand. The result: two monologues disguised as a conversation, both parties walking away feeling unheard.",
            subtext: "The person who understands first wins the relationship, not the argument.",
            continueLabel: "I've felt this",
            mood: 'tension',
        },
        {
            id: 'covey-insight',
            type: 'insight',
            text: "'Seek first to understand, then to be understood.' — Stephen Covey. This isn't just politeness. It's strategy. When people feel truly heard, their defenses drop. Only then can they hear you.",
            source: 'Stephen Covey',
            sourceBook: 'The 7 Habits of Highly Effective People',
            style: 'principle',
            nextStepId: 'identify-conflict',
        },
        {
            id: 'identify-conflict',
            type: 'commitment',
            prompt: "Think of someone you've been in conflict with, or simply don't understand. Describe their perspective—not what's wrong with it, but why it makes sense TO THEM.",
            placeholder: "From their perspective, they probably feel... They might be acting this way because... Their experience has taught them...",
            minimumWords: 20,
            guidanceHints: [
                'Resist the urge to explain why they\'re wrong',
                'Genuinely try to see through their eyes',
                'What fear or need might be driving them?',
            ],
            continueLabel: "I tried to see their view",
            storeAs: 'their-perspective',
            nextStepId: 'deeper-why',
        },
        {
            id: 'deeper-why',
            type: 'insight',
            text: "Everyone is fighting a battle you know nothing about. The difficult colleague might be going through a divorce. The rude stranger might have just received terrible news. This doesn't excuse bad behavior—but it explains it.",
            style: 'reframe',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How did it feel to genuinely try to understand someone you've been in conflict with? What shifted?",
            minimumWords: 15,
            encouragements: [
                'Did any resistance come up?',
                'What might understanding change?',
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
                    "The greatest gift you can give another person is to make them feel truly seen. Today you practiced the art of seeing. This changes relationships more than any argument ever could.",
                    "Marcus Aurelius wrote: 'Begin each day by telling yourself: Today I will meet with interference, ingratitude, insolence... all due to ignorance.' Understanding others' ignorance transforms anger into compassion.",
                    "Empathy isn't agreement. You can understand someone completely and still disagree. But understanding opens doors that judgment keeps closed.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15: FORGIVENESS IS FREEDOM
// ─────────────────────────────────────────────────────────────────────────────

const lesson15_ForgivenessFreedm: FlexibleLesson = {
    id: 'modern-15-forgiveness-freedom',
    slug: 'forgiveness-freedom',
    order: 5,
    title: 'Forgiveness is Freedom',
    subtitle: 'Letting go of resentment',
    description: "The hardest practice that offers the greatest freedom. Forgiveness isn't for them—it's for you.",
    coreConceptTag: 'forgiveness',
    xpReward: 25,
    estimatedMinutes: 7,
    thumbnail: { icon: '🕊️', color: '#22c55e' },
    teaserText: "Tomorrow you'll explore the hardest practice of all - and understand why forgiveness is freedom for YOU, not absolution for them.",
    exercises: [],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Someone hurt you. Maybe recently, maybe years ago. You carry it still—a weight that follows you, a grudge that costs you energy every day. Here's the hard truth: unforgiveness is like drinking poison and expecting the other person to die.",
            subtext: "The prisoner of resentment is always you.",
            continueLabel: "I'm ready to explore this",
            mood: 'tension',
        },
        {
            id: 'forgiveness-insight',
            type: 'insight',
            text: "Forgiveness is not condoning what happened. It's not pretending it didn't hurt. It's not reconciliation or trust. Forgiveness is a decision to stop letting the past control your present. It's freedom for YOU, not absolution for them.",
            style: 'principle',
            nextStepId: 'identify-wound',
        },
        {
            id: 'identify-wound',
            type: 'commitment',
            prompt: "Who are you still holding resentment toward? What happened that you haven't been able to release?",
            placeholder: "I still resent... What happened was... I can't let go of...",
            minimumWords: 15,
            guidanceHints: [
                'This is private—be completely honest',
                'You don\'t have to forgive yet. Just name it.',
            ],
            continueLabel: "I've named my wound",
            storeAs: 'wound',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'The Release',
            instructions: [
                'Imagine the person who hurt you standing before you.',
                'See the cord of resentment connecting you to them.',
                'This cord costs you energy every single day.',
                "You didn't create the hurt. But you're choosing to carry it.",
                'Now imagine slowly releasing that cord.',
                'Not for them. For you.',
                "The cord dissolves. You are lighter than you've been in years.",
                'This is forgiveness. Freedom is yours.',
            ],
            paceSeconds: 5,
            style: 'grounding',
            nextStepId: 'choice',
        },
        {
            id: 'choice',
            type: 'choice',
            question: 'How do you feel about forgiveness right now?',
            options: [
                {
                    id: 'ready',
                    label: "I'm ready to choose forgiveness",
                    nextStepId: 'forgiveness-declaration',
                },
                {
                    id: 'not-ready',
                    label: "I'm not ready yet—and that's honest",
                    nextStepId: 'not-ready-insight',
                },
            ],
        },
        {
            id: 'forgiveness-declaration',
            type: 'commitment',
            prompt: "Write your forgiveness declaration. This isn't for them—it's for you. 'I release [name] from the prison of my resentment. I choose freedom.'",
            placeholder: "I release... I forgive... I choose to let go of...",
            minimumWords: 10,
            continueLabel: "I declare my freedom",
            storeAs: 'forgiveness',
            nextStepId: 'reflection',
        },
        {
            id: 'not-ready-insight',
            type: 'insight',
            text: "Forgiveness can't be forced. The fact that you're here, considering it, is progress. Some wounds need more time. The seed is planted. It will grow when you're ready.",
            style: 'reframe',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What would your life look like without this resentment? What energy would be freed if you truly let this go?",
            minimumWords: 20,
            encouragements: [
                'What would change in your daily experience?',
                'What could you create with that reclaimed energy?',
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
                    "Nelson Mandela forgave 27 years of imprisonment. He said: 'Resentment is like drinking poison and hoping it kills your enemies.' Today you began to put down the cup.",
                    "Forgiveness is the final freedom. Not because they deserve it, but because you do. Whatever you experienced today, you moved toward the light.",
                ],
                byChoice: {
                    ready: [
                        "You chose freedom. The choice to forgive may need to be made again tomorrow, and the day after. It's a practice, not a moment. But today you started the journey.",
                    ],
                    'not-ready': [
                        "Honesty is always honored here. Forced forgiveness is just suppression in disguise. Keep working these practices. The day will come when you're ready—and when it does, the release will be complete.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 3: RELATIONSHIPS
// ─────────────────────────────────────────────────────────────────────────────

export const chapter3_Relationships: FlexibleChapter = {
    id: 'chapter-modern-relationships',
    slug: 'relationships',
    name: 'Relationships',
    subtitle: 'The art of human connection',
    description: 'Five powerful practices for deeper connections. Learn to set boundaries, communicate honestly, and transform conflict into understanding.',
    order: 3,
    iconName: 'Heart',
    lessons: [
        lesson11_MirrorEffect,
        lesson12_RadicalHonesty,
        lesson13_BoundariesGrace,
        lesson14_EmpathyShift,
        lesson15_ForgivenessFreedm,
    ],
};

export default chapter3_Relationships;
