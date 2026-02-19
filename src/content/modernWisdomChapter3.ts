// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 3: RELATIONSHIPS - The Art of Human Connection
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';
import { lesson11Exercises, lesson12Exercises, lesson13Exercises, lesson14Exercises, lesson15Exercises } from './exerciseContent';

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
    exercises: lesson11Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Shadow work, branching by trigger type
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "There's someone who frustrates you. Someone who seems impossible to deal with, who pushes your buttons in ways that other people don't. Here's the uncomfortable truth: the people who trigger us most are often showing us something about ourselves we don't want to see.",
            subtext: "The world is a mirror, not a window.",
            continueLabel: "I'm curious",
            mood: 'curiosity',
            nextStepId: 'mirror-insight',
        },
        {
            id: 'mirror-insight',
            type: 'insight',
            text: "Carl Jung called it 'shadow work.' The parts of ourselves we deny, repress, or have never examined — they don't disappear. They get projected onto other people. When someone's behavior makes us unreasonably angry, it's worth asking: where does this exist in ME?",
            source: 'Carl Jung',
            style: 'principle',
            nextStepId: 'identify-trigger',
        },
        {
            id: 'identify-trigger',
            type: 'commitment',
            prompt: "Think of someone who frequently triggers or frustrates you. What specific quality or behavior bothers you most about them? Be precise — not 'they annoy me' but exactly what they do.",
            placeholder: "The person is... What bothers me most specifically is...",
            minimumWords: 10,
            guidanceHints: [
                'Name the specific behavior, not just "they\'re difficult"',
                'What do they do that makes your skin crawl?',
                'This stays private — be completely honest',
            ],
            continueLabel: "I see what triggers me",
            storeAs: 'trigger',
            nextStepId: 'trigger-type',
        },
        {
            id: 'trigger-type',
            type: 'choice',
            question: "Why might this bother you so intensely?",
            instruction: "Choose the possibility that feels most true — even if uncomfortable",
            options: [
                {
                    id: 'self-shadow',
                    label: 'It reminds me of something I dislike about myself',
                    subtext: 'A quality I also have, but judge in myself',
                    nextStepId: 'insight-self-shadow',
                    storeAs: 'trigger-root',
                },
                {
                    id: 'envy',
                    label: 'They have or do something I secretly want',
                    subtext: 'Their behavior touches something I crave or envy',
                    nextStepId: 'insight-envy',
                    storeAs: 'trigger-root',
                },
                {
                    id: 'repression',
                    label: 'They do what I wish I could — but don\'t allow myself',
                    subtext: 'They break rules I follow rigidly, and part of me is drawn to it',
                    nextStepId: 'insight-repression',
                    storeAs: 'trigger-root',
                },
            ],
        },
        {
            id: 'insight-self-shadow',
            type: 'insight',
            text: "The mirror is most painful when it shows us what we already know about ourselves but haven't accepted. The arrogance that enrages you in someone else? Ask honestly: where am I arrogant but blind to it? The judgment isn't about them — it's a finger pointing inward.",
            style: 'revelation',
            nextStepId: 'mirror-visualization',
        },
        {
            id: 'insight-envy',
            type: 'insight',
            text: "Envy is a compass, not a character flaw. When someone else's success, confidence, or freedom triggers you — it's pointing at something you want for yourself. The trigger isn't about them being wrong. It's about you wanting something you haven't yet claimed.",
            style: 'revelation',
            nextStepId: 'mirror-visualization',
        },
        {
            id: 'insight-repression',
            type: 'insight',
            text: "What we forbid in ourselves, we often condemn in others. The free spirit who enrages the rule-follower. The emotionally expressive person who disturbs the one who never shows weakness. What you judge them for may be the very thing your own soul is asking you to allow.",
            style: 'revelation',
            nextStepId: 'mirror-visualization',
        },
        {
            id: 'mirror-visualization',
            type: 'visualization',
            title: 'The Mirror',
            instructions: [
                'Hold that frustrating quality in your mind.',
                'Now ask: Where does this live in ME?',
                'Perhaps in a different form...',
                '...or perhaps you fear becoming this way.',
                'Or maybe you once were this way and judge yourself for it.',
                'What is this person showing you about yourself?',
                'There is no judgment here. Only seeing.',
            ],
            paceSeconds: 5,
            style: 'grounding',
            nextStepId: 'mirror-action',
        },
        {
            id: 'mirror-action',
            type: 'commitment',
            prompt: "What is one thing you can do differently with this person now that you see what the mirror is reflecting? What shifts in how you'll relate to them?",
            placeholder: "Now that I see this, I will... Instead of reacting, I can... The shift I'm making is...",
            minimumWords: 10,
            guidanceHints: [
                'Not about changing them — about changing how you show up',
                'What would a self-aware person do differently?',
                'Even small shifts in perception change everything',
            ],
            continueLabel: "This is my shift",
            storeAs: 'mirror-action',
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
                    "The Stoics said we cannot control others, only ourselves. Today you went further — you saw that others are often reflecting what needs attention within us.",
                    "Every person who frustrates you is offering a lesson. Not a comfortable truth, but a liberating one. You had the courage to look.",
                ],
                byChoice: {
                    'self-shadow': [
                        "You saw yourself in someone you judge. That's the hardest mirror to face — and the most liberating. The moment you stop condemning the quality in them, you stop condemning it in yourself.",
                    ],
                    'envy': [
                        "Envy is information. You don't hate what they have — you want it for yourself. That's not a character flaw. That's a compass. Now the question is: what are you going to do with that direction?",
                    ],
                    'repression': [
                        "What you forbid in yourself, you condemn in others. But the trigger is an invitation — to give yourself permission for what you've been denying. What would it mean to let yourself have that?",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Shadow mapping, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "The people who trigger us most are often showing us something about ourselves we don't want to see. The world isn't a window onto others — it's a mirror showing us ourselves.",
            subtext: "This is shadow work. It's uncomfortable. It's the most useful thing you'll do today.",
            continueLabel: "I'm willing to look",
            mood: 'curiosity',
            nextStepId: 'e-triggers',
        },
        {
            id: 'e-triggers',
            type: 'resonanceCheck',
            prompt: "What triggers you most in other people?",
            instruction: "Tap what genuinely irritates you — be honest",
            options: [
                { id: 'arrogance', text: 'Arrogance or entitlement' },
                { id: 'neediness', text: 'Excessive neediness or clinginess' },
                { id: 'dishonesty', text: 'Dishonesty or inauthenticity' },
                { id: 'laziness', text: 'Laziness or lack of ambition' },
                { id: 'volatility', text: 'Emotional volatility or drama' },
                { id: 'spotlight', text: 'People who always need the spotlight' },
            ],
            minSelections: 1,
            maxSelections: 3,
            storeAs: 'trigger-types',
            nextStepId: 'e-mirror-insight',
        },
        {
            id: 'e-mirror-insight',
            type: 'insight',
            text: "What irritates us most in others often whispers something about us. The arrogance that enrages you? Ask where you're arrogant but blind to it. The laziness you judge? Ask where you've given up on yourself. Not always — but worth asking.",
            style: 'reframe',
            nextStepId: 'e-shadow-map',
        },
        {
            id: 'e-shadow-map',
            type: 'tapFlow',
            title: 'The Shadow Map',
            instructions: [
                'Jung called it "the shadow" — the parts of ourselves we deny, repress, or haven\'t examined.',
                'What we reject in ourselves doesn\'t disappear. It gets projected onto others.',
                'When someone triggers you strongly, ask: "Where does this live in ME?" Not necessarily the same form — but the same root.',
                'Envy points to what you want but haven\'t claimed. Judgment often points to what you fear about yourself.',
                'The trigger isn\'t about them being wrong. It\'s about you being shown something. The question is whether you\'re willing to look.',
            ],
            style: 'grounding',
            nextStepId: 'e-willingness',
        },
        {
            id: 'e-willingness',
            type: 'scaleRating',
            prompt: "How willing are you to look at what your triggers reveal about you?",
            lowLabel: "Very uncomfortable",
            highLabel: "Completely open",
            steps: 5,
            storeAs: 'shadow-willingness',
            responsesByRange: {
                low: "Discomfort is appropriate here. Shadow work is not easy. The fact that you're even considering it puts you ahead of most people.",
                mid: "That partial openness is enough. You don't need to be fully ready — you just need to be willing to ask the question.",
                high: "That openness is your superpower. The more you can look without flinching, the faster you grow.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You named your triggers. You started looking in the mirror. Now:",
            statement: "Every trigger is a teacher. I choose to learn.",
            confirmLabel: "I choose to see",
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
                    "Carl Jung called this 'shadow work.' When you see your triggers as teachers rather than attacks, you gain power over your reactions. You did the work most people avoid.",
                    "Every person who frustrates you is offering a lesson. Not a comfortable truth, but a liberating one. You had the courage to look.",
                ],
                byMode: {
                    engagement: [
                        "You mapped your triggers. You started asking the harder question. The next step is to sit with one trigger this week and really examine it — not to judge yourself, but to understand yourself. That's the practice.",
                    ],
                },
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
    exercises: lesson12Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Branching by type of dishonesty, specific truth work
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Every 'I'm fine' when you're not. Every 'Sure, no problem' when it is. Every performance of certainty when you're lost, confidence when you're scared, or happiness when you're quietly falling apart. They seem harmless. But each one is a tiny brick in a prison you're building around yourself.",
            subtext: "The weight of small deceptions compounds daily.",
            continueLabel: "I feel that weight",
            mood: 'tension',
            nextStepId: 'honesty-insight',
        },
        {
            id: 'honesty-insight',
            type: 'insight',
            text: "Radical honesty isn't about being brutal. It's about being real. The energy you spend managing impressions, maintaining fictions, and protecting comfortable lies could be spent on actual living. Every truth you speak is a brick removed from your prison.",
            source: 'Brad Blanton',
            sourceBook: 'Radical Honesty',
            style: 'principle',
            nextStepId: 'dishonesty-type',
        },
        {
            id: 'dishonesty-type',
            type: 'choice',
            question: "Where has dishonesty crept into your life?",
            instruction: "Choose the one that's most alive for you right now",
            options: [
                {
                    id: 'social',
                    label: 'With others — I say what they want to hear',
                    subtext: 'I perform feelings I don\'t have, agree when I don\'t, hide what I actually think',
                    nextStepId: 'social-path',
                    storeAs: 'dishonesty-type',
                },
                {
                    id: 'self',
                    label: 'With myself — I deny what I know to be true',
                    subtext: 'I pretend not to know things I know. I avoid looking at certain truths.',
                    nextStepId: 'self-path',
                    storeAs: 'dishonesty-type',
                },
            ],
        },

        // SOCIAL PATH
        {
            id: 'social-path',
            type: 'commitment',
            prompt: "What is one thing you haven't been honest about with someone important? A feeling you're hiding, a boundary you haven't expressed, a truth you've been withholding?",
            placeholder: "I haven't told [person]... I've been pretending... What I actually think/feel is...",
            minimumWords: 10,
            guidanceHints: [
                'This stays private — be truly honest',
                'What would it feel like to actually say this?',
                'Name the specific truth, not a general area',
            ],
            continueLabel: "I've named it",
            storeAs: 'social-truth',
            nextStepId: 'social-say-it',
        },
        {
            id: 'social-say-it',
            type: 'commitment',
            prompt: "Write the exact words you would say if you were being radically honest. Not a softened version — the real thing, as if you were speaking it right now.",
            placeholder: "What I really need to say is...",
            minimumWords: 15,
            guidanceHints: [
                'Write it in first person, present tense',
                'Don\'t explain, justify, or soften — just say it',
                'This is the conversation that needs to happen',
            ],
            continueLabel: "I've written my truth",
            storeAs: 'honest-statement',
            nextStepId: 'action-commit-social',
        },
        {
            id: 'action-commit-social',
            type: 'choice',
            question: "Will you have this honest conversation in the next 48 hours?",
            options: [
                {
                    id: 'yes-commit',
                    label: 'Yes — I commit to having this conversation',
                    nextStepId: 'commitment-made',
                },
                {
                    id: 'not-yet',
                    label: 'Not yet — I need more time',
                    nextStepId: 'not-yet-insight',
                },
            ],
        },
        {
            id: 'commitment-made',
            type: 'insight',
            text: "The conversation may be uncomfortable for 5 minutes. But the freedom it creates lasts far longer. You're not choosing between comfort and discomfort — you're choosing between short discomfort now or long imprisonment later.",
            style: 'revelation',
            nextStepId: 'truth-commit',
        },
        {
            id: 'not-yet-insight',
            type: 'insight',
            text: "That's honest too. But ask yourself: is 'not yet' protecting you or imprisoning you? Sometimes 'not yet' is wisdom. Sometimes it's fear dressed as patience. Only you know which one this is.",
            style: 'reframe',
            nextStepId: 'truth-commit',
        },

        // SELF PATH
        {
            id: 'self-path',
            type: 'reflection',
            prompt: "Write the truth you've been avoiding about your own life. The thing you pretend not to know. Say it clearly to yourself — what have you been denying?",
            minimumWords: 20,
            encouragements: [
                'This is for you alone',
                'What does the most honest part of you already know?',
                'What would change if you fully accepted this truth?',
            ],
            nextStepId: 'truth-commit',
        },

        // CONVERGE
        {
            id: 'truth-commit',
            type: 'commitment',
            prompt: "What is the most important truth you need to live by this week? Write it as a declaration you'll actually hold yourself to.",
            placeholder: "The truth I'm choosing to live by is... I commit to being honest about...",
            minimumWords: 8,
            guidanceHints: [
                'One truth, fully held',
                'Would your most honest self recognize this?',
                'Small truth, consistently honored, builds a life',
            ],
            continueLabel: "This is my truth commitment",
            storeAs: 'truth-commitment',
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
                    social: [
                        "The conversations we avoid longest cause the most damage — in silence. You named it. You wrote it. That's already halfway there.",
                    ],
                    self: [
                        "Self-honesty is the hardest kind — there's no one to blame the discomfort on but yourself. You looked anyway. That's rare.",
                    ],
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

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Honest inventory, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "Every 'I'm fine' when you're not. Every 'Sure, no problem' when it is. They seem harmless — but each one is a tiny brick in a prison you're building around yourself.",
            subtext: "The energy spent maintaining lies could be spent on living.",
            continueLabel: "I feel that weight",
            mood: 'tension',
            nextStepId: 'e-dishonesty-check',
        },
        {
            id: 'e-dishonesty-check',
            type: 'resonanceCheck',
            prompt: "Where are you being dishonest right now?",
            instruction: "Be brutally honest — no one else sees this",
            options: [
                { id: 'pretending-ok', text: 'Pretending to be okay when I\'m not' },
                { id: 'yes-no', text: 'Saying yes when I mean no' },
                { id: 'hiding-feelings', text: 'Hiding how I really feel about someone or something' },
                { id: 'denying-change', text: 'Denying that something in my life needs to change' },
                { id: 'start-later', text: 'Telling myself I\'ll start tomorrow' },
                { id: 'dont-care', text: 'Pretending I don\'t care when I actually do' },
            ],
            minSelections: 1,
            maxSelections: 4,
            storeAs: 'dishonesty-areas',
            nextStepId: 'e-cost-insight',
        },
        {
            id: 'e-cost-insight',
            type: 'insight',
            text: "Every deception — even the small, social kind — costs energy to maintain. You have to remember what you said, adjust your behavior to match the fiction, and carry the low-grade stress of the gap between who you are and who you're performing.",
            style: 'revelation',
            nextStepId: 'e-cost-tapflow',
        },
        {
            id: 'e-cost-tapflow',
            type: 'tapFlow',
            title: 'The Cost of Small Lies',
            instructions: [
                'The first lie costs almost nothing. It slips out easily.',
                'But the second lie is required to protect the first. Then a third.',
                'Soon you\'re managing a version of yourself that doesn\'t actually exist.',
                'The exhaustion isn\'t from living your life — it\'s from maintaining the performance.',
                'Radical honesty is not about being brutal. It\'s about being free. Real, sustainable freedom — the kind that comes from having nothing to hide.',
            ],
            style: 'fearless',
            nextStepId: 'e-energy-check',
        },
        {
            id: 'e-energy-check',
            type: 'scaleRating',
            prompt: "How much energy are you currently spending maintaining deceptions — with others or yourself?",
            lowLabel: "Barely any",
            highLabel: "Exhausted by it",
            steps: 5,
            storeAs: 'deception-energy-cost',
            responsesByRange: {
                low: "Good. That means you're living closer to your truth than most. Now identify the one remaining gap — the one thing you're still performing.",
                mid: "You feel it. That's why you're here. The drain is real. Radical honesty doesn't demand everything at once — start with one truth.",
                high: "That exhaustion is real and it has a name. The energy you're spending maintaining fictions is energy stolen from your actual life.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You named the dishonesty. You felt the cost. Now:",
            statement: "I choose truth, even when it's uncomfortable. My energy belongs to living — not to maintaining fictions.",
            confirmLabel: "I choose truth",
            style: 'release',
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
                    "The truth sets you free, but first it scares you. Today you looked at something you've been avoiding. That takes courage.",
                    "Every honest word spoken is a brick removed from your prison. You acknowledged something real today. That's the beginning.",
                ],
                byMode: {
                    engagement: [
                        "You named your dishonesty. That's the first act of radical honesty — not with others, but with yourself. The conversations and the changes will follow. But it always starts here: with seeing clearly.",
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
    exercises: lesson13Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Branching by boundary type, specific script + commitment
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You said yes when you meant no. Again. You overcommitted, overextended, and now you resent the very things you agreed to. The inability to set boundaries doesn't make you kind — it makes you dishonest. And eventually, exhausted.",
            subtext: "'No' is a complete sentence.",
            continueLabel: "I know this pattern",
            mood: 'tension',
            nextStepId: 'boundary-insight',
        },
        {
            id: 'boundary-insight',
            type: 'insight',
            text: "Healthy boundaries aren't walls — they're filters. They protect your energy while allowing genuine connection. Every 'yes' to something is a 'no' to something else. Saying no to what drains you is saying yes to what matters. Guilt about boundaries is a lie — real generosity comes from overflow, not depletion.",
            style: 'principle',
            nextStepId: 'boundary-type',
        },
        {
            id: 'boundary-type',
            type: 'choice',
            question: "What type of boundary do you most struggle with?",
            instruction: "Choose what's most alive and real for you",
            options: [
                {
                    id: 'time',
                    label: 'Time — I give my time away and resent it',
                    subtext: 'I overcommit, can\'t say no to requests, and end up exhausted',
                    nextStepId: 'time-insight',
                    storeAs: 'boundary-type',
                },
                {
                    id: 'emotional',
                    label: 'Emotional — I absorb others\' feelings until I\'m depleted',
                    subtext: 'I take on other people\'s stress, drama, and emotions as my own',
                    nextStepId: 'emotional-insight',
                    storeAs: 'boundary-type',
                },
                {
                    id: 'verbal',
                    label: 'Verbal — I can\'t say no, even when I need to',
                    subtext: 'The word no gets stuck. I agree, then regret, then resent.',
                    nextStepId: 'verbal-insight',
                    storeAs: 'boundary-type',
                },
            ],
        },
        {
            id: 'time-insight',
            type: 'insight',
            text: "Time is not renewable. Every hour you give to something that doesn't matter is an hour stolen from what does. The people who respect you will respect your time. The ones who don't were benefiting from your inability to protect it.",
            style: 'principle',
            nextStepId: 'identify-breach',
        },
        {
            id: 'emotional-insight',
            type: 'insight',
            text: "Emotional boundaries aren't about being cold — they're about being present without being consumed. You can care deeply about someone's pain without drowning in it. You are not responsible for managing other people's emotional states. That's their work.",
            style: 'principle',
            nextStepId: 'identify-breach',
        },
        {
            id: 'verbal-insight',
            type: 'insight',
            text: "'No' is a complete sentence. It needs no explanation, no apology, no elaborate justification. The guilt you feel about saying no is the cost of a people-pleasing pattern — not evidence that you've done something wrong. The discomfort of disappointing someone is brief. The resentment of constant overextension is permanent.",
            style: 'principle',
            nextStepId: 'identify-breach',
        },
        {
            id: 'identify-breach',
            type: 'commitment',
            prompt: "Where are your boundaries being crossed right now? Name the specific situation — who, what, when — where you keep saying yes but need to say no.",
            placeholder: "I need to stop saying yes to... The specific situation is... I'm overcommitting when...",
            minimumWords: 10,
            guidanceHints: [
                'Be specific: who is asking, what are they asking for?',
                'Where do you regularly feel resentment or exhaustion?',
                'What\'s the pattern you keep repeating?',
            ],
            continueLabel: "I see where I need a boundary",
            storeAs: 'boundary-need',
            nextStepId: 'script-practice',
        },
        {
            id: 'script-practice',
            type: 'commitment',
            prompt: "Write the exact words you would use to set this boundary. Kind but clear — no lengthy explanations, no over-apologizing. Practice the actual sentence.",
            placeholder: "What I'll say: 'I appreciate you asking, but I'm not able to...' or 'I need to decline because...'",
            minimumWords: 10,
            guidanceHints: [
                'Kind ≠ weak. Clear ≠ cruel.',
                'You don\'t owe a detailed explanation',
                'Brief is better. What\'s the core of it?',
            ],
            continueLabel: "I have my words",
            storeAs: 'boundary-script',
            nextStepId: 'boundary-visualization',
        },
        {
            id: 'boundary-visualization',
            type: 'visualization',
            title: 'Holding the Boundary',
            instructions: [
                'Imagine the moment you set this boundary.',
                'You say the words you just wrote. Clearly. Calmly.',
                'Notice your own certainty. No apology in your eyes.',
                'The other person reacts. Maybe surprised. Maybe disappointed.',
                'You hold steady. You don\'t collapse. You don\'t over-explain.',
                'After the conversation ends, notice what you feel.',
                'That\'s what the other side of a boundary feels like.',
            ],
            paceSeconds: 4,
            style: 'grounding',
            nextStepId: 'first-boundary',
        },
        {
            id: 'first-boundary',
            type: 'commitment',
            prompt: "What is the first specific boundary you will set this week? Name the person, the request you'll decline, and when you'll do it.",
            placeholder: "This week I will tell [person]... The specific request I'll decline is... I'll do this by...",
            minimumWords: 10,
            guidanceHints: [
                'One boundary, specific and real',
                'Name the person and the ask',
                'Commit to a timeframe',
            ],
            continueLabel: "This is my commitment",
            storeAs: 'first-boundary',
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
                byChoice: {
                    time: [
                        "Time is the only non-renewable resource. Every hour you protect is an hour you can give to what actually matters. You just made a decision about what your life is for.",
                    ],
                    emotional: [
                        "You can be compassionate without being consumed. You can care deeply without losing yourself in someone else's chaos. That distinction is the boundary.",
                    ],
                    verbal: [
                        "'No' gets easier with practice. The first few times feel like breaking a rule. But the guilt fades. The freedom doesn't.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Energy audit, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "You said yes when you meant no. Again. You overcommitted, overextended, and now you resent the very things you agreed to. This isn't kindness. It's a habit of self-erasure.",
            subtext: "'No' is a complete sentence.",
            continueLabel: "I know this pattern",
            mood: 'tension',
            nextStepId: 'e-energy-audit',
        },
        {
            id: 'e-energy-audit',
            type: 'resonanceCheck',
            prompt: "Where are your boundaries being pushed right now?",
            instruction: "Tap everything that's draining you",
            options: [
                { id: 'time', text: 'Someone taking too much of my time' },
                { id: 'emotional', text: 'Someone draining my emotional energy' },
                { id: 'obligation', text: 'A relationship built on obligation, not genuine choice' },
                { id: 'conflict-avoidance', text: 'Saying yes to avoid conflict' },
                { id: 'work', text: 'Work invading my personal time and space' },
                { id: 'giving-more', text: 'Consistently giving more than I receive' },
            ],
            minSelections: 1,
            maxSelections: 4,
            storeAs: 'boundary-drains',
            nextStepId: 'e-what-boundaries-are',
        },
        {
            id: 'e-what-boundaries-are',
            type: 'tapFlow',
            title: 'What Boundaries Actually Are',
            instructions: [
                'A boundary isn\'t a wall. It\'s a filter. It lets genuine connection through while protecting your energy from being consumed.',
                'Every "yes" to something that drains you is a "no" to something that matters. You\'re not saying no to a person — you\'re saying yes to your own life.',
                'The guilt you feel about saying no is not evidence that you\'re wrong. It\'s the sound of a pattern being broken.',
                'Boundaries aren\'t about being cold. They\'re about being honest. The most loving thing you can do is show up fully — and you can only do that when you\'re not depleted.',
                'Real generosity comes from overflow, not depletion. You can\'t pour from an empty cup. Protect the cup.',
            ],
            style: 'grounding',
            nextStepId: 'e-energy-level',
        },
        {
            id: 'e-energy-level',
            type: 'scaleRating',
            prompt: "How well do you currently protect your energy and say no when you need to?",
            lowLabel: "I'm completely drained",
            highLabel: "I protect myself well",
            steps: 5,
            storeAs: 'boundary-strength',
            responsesByRange: {
                low: "Complete depletion is a signal. Something in your life is taking more than it should. The first boundary might just be one small 'no this week.'",
                mid: "You have some boundaries but they're inconsistent. The practice is catching yourself in the moment of the ask — and pausing before automatically saying yes.",
                high: "You've developed this muscle. Now the question is: where are the last few gaps? Which 'yes' is still costing you?",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You mapped where your energy is leaking. You understand what boundaries actually are. Now:",
            statement: "My 'no' is not a rejection. It's a declaration of what I value. And I value myself.",
            confirmLabel: "I claim this",
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
                    "Boundaries are the immune system of the soul. Without them, you absorb everyone else's demands until there's nothing left of you. You just fortified your defenses.",
                    "The people who respect you will respect your boundaries. The ones who don't were benefiting from your lack of them. Either way, you discover the truth.",
                ],
                byMode: {
                    engagement: [
                        "You audited where your energy is going. You named what's draining you. Now the practice is one small 'no' this week — one moment of choosing yourself instead of the pattern. Start there.",
                    ],
                },
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
    exercises: lesson14Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Perspective-taking work, branching by relationship type
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "In most conflicts, both people are fighting to be understood. Nobody is trying to understand. The result: two monologues disguised as a conversation, both parties walking away feeling unseen, unheard, and more certain than ever that they're right.",
            subtext: "The person who understands first wins the relationship, not the argument.",
            continueLabel: "I've felt this",
            mood: 'tension',
            nextStepId: 'covey-insight',
        },
        {
            id: 'covey-insight',
            type: 'insight',
            text: "'Seek first to understand, then to be understood.' — Stephen Covey. This isn't just politeness. It's strategy. When people feel truly heard, their defenses drop. Their nervous systems calm. Only then can they actually hear you. Understanding is the disarming move.",
            source: 'Stephen Covey',
            sourceBook: 'The 7 Habits of Highly Effective People',
            style: 'principle',
            nextStepId: 'conflict-type',
        },
        {
            id: 'conflict-type',
            type: 'choice',
            question: "Who are you currently in conflict with, or struggling to understand?",
            instruction: "Choose what's most real and present",
            options: [
                {
                    id: 'close',
                    label: 'Someone close to me — partner, friend, or family',
                    subtext: 'A relationship that matters deeply but has friction right now',
                    nextStepId: 'insight-close',
                    storeAs: 'conflict-type',
                },
                {
                    id: 'professional',
                    label: 'A colleague or professional contact',
                    subtext: 'A working relationship where alignment feels impossible',
                    nextStepId: 'insight-professional',
                    storeAs: 'conflict-type',
                },
                {
                    id: 'self',
                    label: 'I\'m in conflict with myself',
                    subtext: 'Inner conflict about a decision, direction, or who I\'m becoming',
                    nextStepId: 'insight-self',
                    storeAs: 'conflict-type',
                },
            ],
        },
        {
            id: 'insight-close',
            type: 'insight',
            text: "Close relationships are the hardest place to practice empathy — because the stakes feel highest, the history is longest, and you've built the most certainty about who they are and what they mean. But genuine curiosity about someone you thought you knew can change a relationship completely.",
            style: 'reframe',
            nextStepId: 'perspective-commit',
        },
        {
            id: 'insight-professional',
            type: 'insight',
            text: "Professional conflicts often feel like they're about tactics, decisions, or approaches — but they're almost always about unspoken needs, fears, or values underneath. The colleague who blocks every idea is afraid of something. The manager who micromanages is anxious about something. Understanding what drives the behavior changes everything.",
            style: 'reframe',
            nextStepId: 'perspective-commit',
        },
        {
            id: 'insight-self',
            type: 'insight',
            text: "The empathy shift works inward too. When you're in conflict with yourself — one part wanting one thing, another part resisting — the same rule applies: seek first to understand. What does the part of you that's resistant actually need? What is it protecting? It usually has a reason.",
            style: 'reframe',
            nextStepId: 'perspective-commit',
        },
        {
            id: 'perspective-commit',
            type: 'commitment',
            prompt: "Describe their perspective as fairly as possible. Not what's wrong with it — why it makes sense TO THEM. What fear, need, or experience might be driving their behavior?",
            placeholder: "From their perspective, they probably feel... They might be acting this way because... Their experience has taught them...",
            minimumWords: 20,
            guidanceHints: [
                'Resist the urge to explain why they\'re wrong',
                'Genuinely try to see through their eyes, not just acknowledge that they have eyes',
                'What fear or unmet need might be underneath the behavior?',
            ],
            continueLabel: "I tried to see their view",
            storeAs: 'their-perspective',
            nextStepId: 'deeper-why',
        },
        {
            id: 'deeper-why',
            type: 'insight',
            text: "Everyone is fighting a battle you know nothing about. The difficult colleague might be going through a divorce. The rude stranger might have just received terrible news. The resistant partner might be secretly scared. This doesn't excuse bad behavior — but it explains it. Explanation opens doors that judgment keeps locked.",
            style: 'reframe',
            nextStepId: 'empathy-question',
        },
        {
            id: 'empathy-question',
            type: 'commitment',
            prompt: "What is ONE question you could ask this person to genuinely understand them better? Write the exact question you'd ask — not to trap them, but to hear them.",
            placeholder: "The question I'd ask is: 'What do you need most from me right now?' or 'Help me understand what this means to you.'",
            minimumWords: 5,
            guidanceHints: [
                'Open-ended questions that invite them to be seen',
                'Not rhetorical — questions you actually want the answer to',
                'Simple is better. What do you genuinely want to know?',
            ],
            continueLabel: "This is my question",
            storeAs: 'empathy-question',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How might this conflict look different if you truly believed they're doing the best they can with what they have? What would change in how you show up?",
            minimumWords: 15,
            encouragements: [
                'Did any resistance come up when you tried to understand them?',
                'What shifted when you genuinely tried to see their view?',
                'What would genuine understanding change about your next interaction?',
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
                byChoice: {
                    close: [
                        "In close relationships, we often see through the lens of accumulated history. You just put down that lens for a moment and tried to actually see the person in front of you. That's rarer than it should be.",
                    ],
                    professional: [
                        "Professional conflict that feels tactical is almost always emotional underneath. You just looked beneath the surface. That's where real solutions live.",
                    ],
                    self: [
                        "Self-empathy is often the hardest kind. The part of you that's resistant isn't your enemy — it's trying to protect you from something. Understanding what it's protecting changes the whole conversation.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Perspective-training, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "In most conflicts, both people are fighting to be understood. Nobody is trying to understand. Two monologues disguised as a conversation — and both walk away certain they were right.",
            subtext: "The person who understands first wins the relationship, not the argument.",
            continueLabel: "I've felt this",
            mood: 'tension',
            nextStepId: 'e-conflict-check',
        },
        {
            id: 'e-conflict-check',
            type: 'resonanceCheck',
            prompt: "Who or what have you been struggling to understand?",
            instruction: "Tap everything that applies right now",
            options: [
                { id: 'family', text: 'A family member whose worldview differs from mine' },
                { id: 'partner', text: 'A partner whose needs I find hard to meet' },
                { id: 'colleague', text: 'A colleague I can\'t seem to get on the same page with' },
                { id: 'hurt', text: 'Someone who hurt me and I don\'t understand why' },
                { id: 'public', text: 'A group or worldview that seems alien to me' },
                { id: 'self', text: 'Myself — part of me wants something another part resists' },
            ],
            minSelections: 1,
            maxSelections: 3,
            storeAs: 'empathy-targets',
            nextStepId: 'e-method',
        },
        {
            id: 'e-method',
            type: 'tapFlow',
            title: 'The Empathy Method',
            instructions: [
                'Listen to understand, not to reply. Most of us are already forming our response while the other person is still speaking. The first shift: be completely present for what they\'re actually saying.',
                'Seek the fear behind the behavior. Difficult behavior is almost always fear or pain in disguise. The person who attacks is usually afraid. The person who withdraws is usually hurting.',
                'Ask: what story are they telling themselves? Every person is the hero of their own story. In their version, they\'re making perfect sense. What is their version?',
                'Remember: understanding is not agreement. You can completely understand someone and still disagree, still set boundaries, still walk away. But you do all those things with more clarity and less contempt.',
            ],
            style: 'grounding',
            nextStepId: 'e-understanding-check',
        },
        {
            id: 'e-understanding-check',
            type: 'scaleRating',
            prompt: "How much do you typically seek to understand before seeking to be understood?",
            lowLabel: "I usually need to be heard first",
            highLabel: "I almost always try to understand first",
            steps: 5,
            storeAs: 'empathy-habit',
            responsesByRange: {
                low: "That's honest and common. Most people lead with their need to be understood. The shift doesn't have to be permanent — just: in your next conflict, try one moment of genuine curiosity before making your case.",
                mid: "You have the instinct. The practice is making it more consistent — especially with the people closest to you, where the defensiveness runs deepest.",
                high: "That's a rare skill. The question is: is it working? Do the people in your life feel genuinely understood by you? That's the test.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You understand the method. You know it works. Now:",
            statement: "I choose to understand before I demand to be understood. This is how relationships transform.",
            confirmLabel: "I make this shift",
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
                    "The greatest gift you can give another person is to make them feel truly seen. Today you practiced the art of seeing. This changes relationships more than any argument ever could.",
                    "Empathy isn't agreement. You can understand someone completely and still disagree. But understanding opens doors that judgment keeps closed.",
                ],
                byMode: {
                    engagement: [
                        "You know the method. Now the practice is applying it in one real interaction this week — particularly with someone you find most difficult to understand. That's where the growth lives.",
                    ],
                },
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
    exercises: lesson15Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Wound typing, visualization, branching by readiness
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Someone hurt you. Maybe recently, maybe years ago. You carry it still — a weight that follows you, a grudge that costs you energy every day. Here's the hard truth: unforgiveness is like drinking poison and expecting the other person to die.",
            subtext: "The prisoner of resentment is always you.",
            continueLabel: "I'm ready to explore this",
            mood: 'tension',
            nextStepId: 'forgiveness-insight',
        },
        {
            id: 'forgiveness-insight',
            type: 'insight',
            text: "Forgiveness is not condoning what happened. It's not pretending it didn't hurt. It's not reconciliation, trust, or even contact with that person. Forgiveness is a decision to stop letting the past control your present. It's freedom for YOU — not absolution for them.",
            style: 'principle',
            nextStepId: 'wound-type',
        },
        {
            id: 'wound-type',
            type: 'choice',
            question: "What type of wound are you carrying?",
            instruction: "Name what fits most honestly",
            options: [
                {
                    id: 'betrayal',
                    label: 'A betrayal by someone I trusted',
                    subtext: 'They knew what would hurt me and did it anyway',
                    nextStepId: 'insight-betrayal',
                    storeAs: 'wound-type',
                },
                {
                    id: 'loss',
                    label: 'A loss I blame someone for',
                    subtext: 'An opportunity, relationship, or life chapter that ended because of someone else',
                    nextStepId: 'insight-loss',
                    storeAs: 'wound-type',
                },
                {
                    id: 'injustice',
                    label: 'Something deeply unjust that was done to me',
                    subtext: 'I was treated wrongly and the wound is still raw',
                    nextStepId: 'insight-injustice',
                    storeAs: 'wound-type',
                },
            ],
        },
        {
            id: 'insight-betrayal',
            type: 'insight',
            text: "Betrayal by someone trusted is one of the deepest wounds because it rewrites the story. You thought you knew them — or you thought you were safe. Forgiving a betrayal doesn't mean trusting them again. It means releasing the story from the center of your identity.",
            style: 'reframe',
            nextStepId: 'identify-wound',
        },
        {
            id: 'insight-loss',
            type: 'insight',
            text: "When someone's actions cost you something irreplaceable — time, a relationship, an opportunity — the grief and anger are valid. But carrying blame as a long-term practice means handing that person continued control over your energy. Forgiveness is reclaiming that energy for yourself.",
            style: 'reframe',
            nextStepId: 'identify-wound',
        },
        {
            id: 'insight-injustice',
            type: 'insight',
            text: "Some wounds don't come from people who meant to hurt us — they come from systems, from circumstances, from people who were thoughtless rather than cruel. The injustice was real. Your anger is valid. And the question isn't whether it was fair — it's whether you're ready to stop paying the price for what they did.",
            style: 'reframe',
            nextStepId: 'identify-wound',
        },
        {
            id: 'identify-wound',
            type: 'commitment',
            prompt: "Who are you still holding resentment toward? What happened that you haven't been able to release? Name it clearly — don't minimize it.",
            placeholder: "I still resent... What happened was... I can't let go of...",
            minimumWords: 15,
            guidanceHints: [
                'This is private — be completely honest',
                'You don\'t have to forgive yet. Just name it.',
                'Let it be as big as it actually is',
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
                "You didn't create the hurt. But you've been choosing to carry it.",
                'Now imagine slowly releasing that cord.',
                'Not for them. For you.',
                "The cord dissolves. You are lighter than you've been in years.",
                'This is forgiveness. Freedom is yours.',
            ],
            paceSeconds: 5,
            style: 'grounding',
            nextStepId: 'readiness-choice',
        },
        {
            id: 'readiness-choice',
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
                    label: "I'm not ready yet — and that's honest",
                    nextStepId: 'not-ready-insight',
                },
            ],
        },
        {
            id: 'forgiveness-declaration',
            type: 'commitment',
            prompt: "Write your forgiveness declaration. This isn't for them — it's for you. Complete freedom starts with a declaration, then a daily choice.",
            placeholder: "I release [name] from the prison of my resentment. I choose freedom. I take back the energy I've spent...",
            minimumWords: 10,
            guidanceHints: [
                'This is for you alone',
                'You may need to say it again tomorrow. That\'s okay.',
                'Forgiveness is a practice, not a moment',
            ],
            continueLabel: "I declare my freedom",
            storeAs: 'forgiveness',
            nextStepId: 'freedom-commit',
        },
        {
            id: 'not-ready-insight',
            type: 'insight',
            text: "Forgiveness can't be forced. The fact that you're here, considering it, is progress. Some wounds need more time. What matters is that the door is open. The seed is planted. When you're ready, you'll know.",
            style: 'reframe',
            nextStepId: 'freedom-commit',
        },
        {
            id: 'freedom-commit',
            type: 'commitment',
            prompt: "What is one specific way you will demonstrate that you're choosing your own freedom this week — regardless of whether you're fully ready to forgive?",
            placeholder: "I will reclaim my energy by... One thing I'll do differently is... I choose my own peace by...",
            minimumWords: 10,
            guidanceHints: [
                'Not about them — about you',
                'What does choosing your own freedom look like in practice?',
                'Small and concrete beats large and abstract',
            ],
            continueLabel: "I choose my freedom",
            storeAs: 'freedom-action',
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
                    betrayal: [
                        "Betrayal rewrites the story you thought was true. Forgiving doesn't mean rewriting it again — it means releasing that person from their role as the villain in your ongoing narrative. The story is yours now.",
                    ],
                    loss: [
                        "The loss was real. The anger is valid. And the energy you've spent in resentment has been a second loss on top of the first. Today you started the process of taking that energy back.",
                    ],
                    injustice: [
                        "The injustice happened. Forgiving it doesn't mean it was okay. It means you're no longer paying the price for something someone else did. That's not mercy for them — that's justice for yourself.",
                    ],
                    ready: [
                        "You chose freedom. The choice may need to be made again tomorrow, and the day after. It's a practice, not a moment. But today you started the journey.",
                    ],
                    'not-ready': [
                        "Honesty is always honored here. Forced forgiveness is suppression in disguise. Keep working these practices. The day will come — and when it does, the release will be complete.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Resentment mapping, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "Someone hurt you. Maybe recently, maybe years ago. You carry it still — a weight that follows you, a grudge that costs you energy every single day. The prisoner of resentment is always you.",
            subtext: "Forgiveness isn't for them. It's for you.",
            continueLabel: "I'm ready to explore this",
            mood: 'tension',
            nextStepId: 'e-resentment-check',
        },
        {
            id: 'e-resentment-check',
            type: 'resonanceCheck',
            prompt: "What form does your resentment take?",
            instruction: "Be honest about what it actually looks and feels like",
            options: [
                { id: 'replay', text: 'Replaying what they said or did, over and over' },
                { id: 'imagining', text: 'Imagining confrontations I\'ll probably never have' },
                { id: 'ruining', text: 'Letting their memory ruin otherwise good moments' },
                { id: 'comparing', text: 'Comparing my life to who I\'d be without what happened' },
                { id: 'physical', text: 'Feeling physically tight or tense when I think of them' },
                { id: 'self-blame', text: 'Punishing myself for what happened' },
            ],
            minSelections: 1,
            maxSelections: 4,
            storeAs: 'resentment-forms',
            nextStepId: 'e-insight',
        },
        {
            id: 'e-insight',
            type: 'insight',
            text: "Forgiveness is not condoning what happened. Not forgetting. Not trust or reconciliation. It's a decision to stop letting the past control your present energy. You are the one paying the cost of the resentment — not them.",
            style: 'revelation',
            nextStepId: 'e-what-forgiveness-is',
        },
        {
            id: 'e-what-forgiveness-is',
            type: 'tapFlow',
            title: 'What Forgiveness Actually Is',
            instructions: [
                'NOT condoning. What happened was wrong. Forgiving doesn\'t change that. It doesn\'t make it okay.',
                'NOT forgetting. You keep the memory. You keep the lesson. You keep the knowledge of who people are.',
                'NOT reconciling. Forgiveness doesn\'t require trusting them again, seeing them again, or having any relationship with them.',
                'Releasing the poison. Every day you carry resentment, you\'re drinking poison and hoping they suffer. They\'re not. You are.',
                'Choosing your own freedom. The resentment was a cage you didn\'t build — but you\'ve been living in it. Forgiveness is walking out. Not for them. For you.',
            ],
            style: 'grounding',
            nextStepId: 'e-readiness',
        },
        {
            id: 'e-readiness',
            type: 'scaleRating',
            prompt: "How ready are you to choose your own freedom?",
            lowLabel: "Not at all — the wound is still too fresh",
            highLabel: "I'm ready to let this go",
            steps: 5,
            storeAs: 'forgiveness-readiness',
            responsesByRange: {
                low: "That's honest. Forgiveness can't be forced. The fact that you showed up and looked at this is already progress. The seed is planted. It grows when you're ready.",
                mid: "You can feel it — the part of you that wants to be free, and the part that isn't done being angry. Both are valid. Keep working. The tipping point comes.",
                high: "Then this is the moment. Not a dramatic proclamation — just a quiet decision, made right now, to take your energy back.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You named the resentment. You understand what forgiveness actually is. Now:",
            statement: "I release what happened from its role in running my life. Not for them — for me. I choose freedom.",
            confirmLabel: "I choose my freedom",
            style: 'release',
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
                    "Nelson Mandela forgave 27 years of imprisonment. 'Resentment is like drinking poison and hoping it kills your enemies.' Today you began to put down the cup.",
                    "Forgiveness is the final freedom. Not because they deserve it, but because you do. Whatever you experienced today, you moved toward the light.",
                ],
                byMode: {
                    engagement: [
                        "You mapped your resentment. You understand what forgiveness is — and what it isn't. The work now is the daily practice: when the replay starts, notice it, and choose again. Not once — every time. That's how the cage opens.",
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
