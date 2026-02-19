// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2: RESILIENCE - Becoming Unbreakable
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';
import { lesson6Exercises, lesson7Exercises, lesson8Exercises, lesson9Exercises, lesson10Exercises } from './exerciseContent';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6: THE COMEBACK FORMULA
// ─────────────────────────────────────────────────────────────────────────────

const lesson6_ComebackFormula: FlexibleLesson = {
    id: 'modern-6-comeback-formula',
    slug: 'comeback-formula',
    order: 1,
    title: 'The Comeback Formula',
    subtitle: 'Turn any setback into a setup',
    description: 'Learn the 3-step process that transforms failures into fuel.',
    coreConceptTag: 'resilience',
    xpReward: 22,
    estimatedMinutes: 6,
    thumbnail: { icon: '🔄', color: '#ec4899' },
    teaserText: "Tomorrow you'll learn the 3-step formula that turned Michael Jordan's greatest failure into his greatest strength.",
    exercises: lesson6Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Deep, specific, branching
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You pour everything into something. Then it collapses. Not a quiet fade — a visible fall. The rejection email. The project killed. The relationship over. The opportunity that went to someone else. The sting is real and the replay button is stuck on.",
            subtext: "Every comeback story starts with exactly this moment.",
            bridgeQuestion: "Think of a setback that's still echoing in you.",
            continueLabel: "I have one in mind",
            mood: 'tension',
            nextStepId: 'principle',
        },
        {
            id: 'principle',
            type: 'insight',
            text: "Tim Ferriss failed at 7 businesses before writing The 4-Hour Workweek. Oprah Winfrey was fired from her first TV job. J.K. Rowling was a single mother on welfare when she wrote Harry Potter. The pattern isn't talent. It's what they did with the failure.",
            style: 'principle',
            followUp: "The formula exists. Let's run you through it.",
            nextStepId: 'name-setback',
        },
        {
            id: 'name-setback',
            type: 'commitment',
            prompt: "Name your setback. Don't soften it. Don't make it sound better than it was. Write it raw — exactly what happened.",
            placeholder: "What failed, fell apart, or didn't go the way I needed...",
            minimumWords: 10,
            guidanceHints: [
                'Be specific — name the exact thing that happened',
                'Don\'t minimize it. It deserves to be named clearly.',
                'No one else sees this.',
            ],
            continueLabel: 'This is my setback',
            storeAs: 'setback',
            nextStepId: 'lesson-choice',
        },
        {
            id: 'lesson-choice',
            type: 'choice',
            question: "What did this failure actually teach you?",
            instruction: "Choose the one that hits truest",
            options: [
                {
                    id: 'about-self',
                    label: 'It taught me something about myself',
                    subtext: 'A character flaw, a blind spot, something I needed to face',
                    nextStepId: 'insight-self',
                    storeAs: 'lessonType',
                },
                {
                    id: 'about-others',
                    label: 'It taught me something about others',
                    subtext: 'Trust, alignment, who shows up when it matters',
                    nextStepId: 'insight-others',
                    storeAs: 'lessonType',
                },
                {
                    id: 'about-priorities',
                    label: 'It taught me what actually matters',
                    subtext: 'What I was chasing wasn\'t actually what I needed',
                    nextStepId: 'insight-priorities',
                    storeAs: 'lessonType',
                },
            ],
        },
        {
            id: 'insight-self',
            type: 'insight',
            text: "The most valuable failures are the ones that show you something you couldn't see about yourself. Not comfortable knowledge — the kind you can only earn through falling. The failure wasn't the end of your story. It was the mirror.",
            style: 'revelation',
            nextStepId: 'comeback-commit',
        },
        {
            id: 'insight-others',
            type: 'insight',
            text: "Some failures don't break your plans — they break your illusions about people. That's more valuable. Knowing who to trust, who shows up, and who disappears when things get hard is information that protects your future. The failure sorted your world.",
            style: 'revelation',
            nextStepId: 'comeback-commit',
        },
        {
            id: 'insight-priorities',
            type: 'insight',
            text: "Sometimes a failure is the universe canceling an order you placed when you were less clear about what you wanted. The door that slammed shut may have been a door to somewhere you didn't actually need to go. Clarity through loss is still clarity.",
            style: 'revelation',
            nextStepId: 'comeback-commit',
        },
        {
            id: 'comeback-commit',
            type: 'commitment',
            prompt: "Write your one-sentence comeback declaration. Start with 'I will...' Make it specific and real — not a vague aspiration but a defined next move.",
            placeholder: "I will... My comeback starts with... The next thing I'm building is...",
            minimumWords: 8,
            guidanceHints: [
                'One sentence. One direction. Specific.',
                'Not \'I will try\' — \'I will do\'',
                'What would your strongest self say here?',
            ],
            continueLabel: "This is my comeback",
            storeAs: 'comeback',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'One Year From Now',
            instructions: [
                'Close your eyes. Breathe slowly.',
                'It\'s one year from today.',
                'You made the comeback.',
                'See yourself — what does your life look like now?',
                'What are you most proud of?',
                'What does it feel like to have risen from that exact low point?',
                'That version of you is not a fantasy. They\'re built by what you do next.',
            ],
            paceSeconds: 5,
            style: 'fearless',
            nextStepId: 'action-reflection',
        },
        {
            id: 'action-reflection',
            type: 'reflection',
            prompt: "What is ONE specific action you can take in the next 24 hours toward your comeback? Not a plan — a single, concrete action.",
            minimumWords: 10,
            encouragements: [
                'Specific beats vague every time',
                'What would take 5 minutes to start?',
                'The comeback begins with one move',
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
                    "Michael Jordan was cut from his high school basketball team. Oprah was fired from her first TV job. Steve Jobs was ousted from Apple. Every legend has a setback story. You're writing yours now.",
                    "The comeback is always stronger than the setback. You've just proven you have what it takes: the willingness to name what broke, extract what it taught, and move.",
                    "Most people let setbacks define them. You just used yours to refine you. That's the difference between those who fade and those who become legendary.",
                ],
                byChoice: {
                    'about-self': [
                        "You turned the mirror inward. That's the rarest kind of courage — not to fight what happened outside you, but to face what it revealed inside. That's where real comebacks are built.",
                    ],
                    'about-others': [
                        "You learned who your people are. Every real failure does this — it sorts the room. The ones still standing next to you when it falls apart are the ones worth building with.",
                    ],
                    'about-priorities': [
                        "Clarity through loss is still clarity. You know now what you actually want. Not what you were supposed to want — what you actually want. That's the most expensive knowledge there is.",
                    ],
                },
                byMode: {
                    engagement: [
                        "You named the wound. You didn't flinch from it. The comeback doesn't start when everything is perfect. It starts when you decide to move — and you just decided.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Kinetic, no writing, deeply personal
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "You pour everything into something. Then it collapses. Not a quiet fade — a visible fall. The sting is real and the replay button is stuck on.",
            subtext: "Every comeback story starts with exactly this moment.",
            continueLabel: "I know this feeling",
            mood: 'tension',
            nextStepId: 'e-resonance',
        },
        {
            id: 'e-resonance',
            type: 'resonanceCheck',
            prompt: "Which setback is still echoing in you?",
            instruction: "Tap all that apply",
            options: [
                { id: 'career', text: 'A career failure I haven\'t recovered from' },
                { id: 'relationship', text: 'A relationship that ended badly' },
                { id: 'dream', text: 'A dream I gave up on' },
                { id: 'financial', text: 'A financial loss that still stings' },
                { id: 'public', text: 'A public embarrassment I replay' },
                { id: 'betrayal', text: 'A betrayal I didn\'t see coming' },
            ],
            minSelections: 1,
            maxSelections: 3,
            storeAs: 'setback-type',
            nextStepId: 'e-hidden-curriculum',
        },
        {
            id: 'e-hidden-curriculum',
            type: 'insight',
            text: "Every setback carries a hidden curriculum. The question isn't 'Why did this happen to me?' It's 'What is this teaching me FOR my future?' The failure wasn't the full stop. It was a comma.",
            style: 'revelation',
            nextStepId: 'e-formula',
        },
        {
            id: 'e-formula',
            type: 'tapFlow',
            title: 'The Comeback Formula',
            instructions: [
                'Step 1: Name the wound. Don\'t dress it up. Don\'t minimize it. What broke is what broke.',
                'Step 2: Extract the lesson. Not \'why me\' — \'what for\'. What did this failure TEACH you that nothing else could?',
                'Step 3: Identify the one thing you\'d do differently. Not everything. One specific, concrete thing.',
                'Step 4: Take one action in the next 24 hours. Not a plan — an action. Something that moves.',
            ],
            style: 'fearless',
            nextStepId: 'e-readiness',
        },
        {
            id: 'e-readiness',
            type: 'scaleRating',
            prompt: "How ready are you to make your comeback?",
            lowLabel: "Not yet",
            highLabel: "Right now",
            steps: 5,
            storeAs: 'comeback-readiness',
            responsesByRange: {
                low: "Readiness isn't required. Just willingness. You don't have to feel ready — you just have to move.",
                mid: "You're closer than you think. The fact that you're here, doing this work, is already the beginning.",
                high: "Then what are you waiting for? The comeback started the moment you decided not to stay down.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You named your setback. You found the lesson. You know the formula.",
            statement: "I am not defined by what happened to me. I am defined by what I do next.",
            confirmLabel: "This is my truth",
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
                    "Michael Jordan was cut from his high school basketball team. Oprah was fired from her first TV job. Steve Jobs was ousted from Apple. Every legend has a setback story. You're writing yours now.",
                    "The comeback is always stronger than the setback. You named what broke. You found the lesson. Now you move.",
                ],
                byMode: {
                    engagement: [
                        "You named the wound. You didn't flinch from it. The comeback doesn't start when everything is perfect. It starts when you decide to move — and you just decided.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7: EMBRACE THE STRUGGLE
// ─────────────────────────────────────────────────────────────────────────────

const lesson7_EmbraceStruggle: FlexibleLesson = {
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
    teaserText: "Tomorrow you'll learn why the Navy SEALs, Spartans, and Stoics all embraced voluntary discomfort - and why you should too.",
    exercises: lesson7Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Branching, visceral, action-oriented
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You have a choice every day: seek comfort now and struggle later — or embrace struggle now and earn peace later. The paradox is brutal: the more you avoid discomfort, the more it controls you. The soft life makes everything hard.",
            subtext: "The path to becoming unbreakable runs through voluntary hardship.",
            continueLabel: "I'm ready to understand",
            mood: 'curiosity',
            nextStepId: 'insight-why',
        },
        {
            id: 'insight-why',
            type: 'insight',
            text: "What you don't use, you lose. Muscles that aren't challenged atrophy. A mind that's never tested becomes fragile. The Spartans, the Stoics, the Navy SEALs — all knew that voluntary discomfort is the vaccine against being broken by involuntary hardship. You build the callus before the blister.",
            source: 'Ancient Wisdom & David Goggins',
            style: 'principle',
            nextStepId: 'comfort-check',
        },
        {
            id: 'comfort-check',
            type: 'choice',
            question: "Where does comfort most hold you back right now?",
            instruction: "Choose the most honest answer",
            options: [
                {
                    id: 'body',
                    label: 'My body — I avoid physical challenge',
                    subtext: 'Exercise, cold, physical discomfort I know would build me',
                    nextStepId: 'body-insight',
                    storeAs: 'struggle-domain',
                },
                {
                    id: 'mind',
                    label: 'My mind — I avoid discomfort by staying distracted',
                    subtext: 'Scrolling, numbing, filling silence rather than sitting with myself',
                    nextStepId: 'mind-insight',
                    storeAs: 'struggle-domain',
                },
                {
                    id: 'social',
                    label: 'My relationships — I avoid hard conversations',
                    subtext: 'Letting tension fester instead of confronting it with honesty',
                    nextStepId: 'social-insight',
                    storeAs: 'struggle-domain',
                },
            ],
        },
        {
            id: 'body-insight',
            type: 'insight',
            text: "Physical discomfort is the gateway to mental toughness. The body leads and the mind follows. David Goggins ran 100 miles on broken legs. Not because he had to — because choosing the hard physical path trains the mind to stop negotiating when things get difficult.",
            style: 'principle',
            nextStepId: 'physical-challenge',
        },
        {
            id: 'physical-challenge',
            type: 'goDoIt',
            sageMessage: "Your challenge: Right now, do something physically hard. Splash cold water on your face for 30 seconds. Hold a plank until it burns. Take the stairs. Walk around the block at a fast pace. The specific action matters less than choosing hard over easy when easy was available.",
            sageSubtext: "Discomfort chosen is discomfort transformed into power.",
            dismissLabel: "I'm going to do it",
            returnStepId: 'return-check',
        },
        {
            id: 'mind-insight',
            type: 'insight',
            text: "Silence is the ultimate modern challenge. In a world of endless stimulation, the ability to sit with yourself without reaching for distraction is a genuine superpower. The mind that can tolerate boredom is the mind that can tolerate anything.",
            style: 'principle',
            nextStepId: 'silence-challenge',
        },
        {
            id: 'silence-challenge',
            type: 'timer',
            title: 'The Silence Challenge',
            instruction: "Sit in complete silence for 60 seconds. No phone. No distraction. Just you and your thoughts. Let whatever comes up, come up. Don't fight it. Don't fix it. Just stay.",
            durationSeconds: 60,
            timerStyle: 'presence',
            guidanceMessages: [
                'Your mind will resist. Let it.',
                'Boredom is not dangerous.',
                'Stillness is where strength is forged.',
            ],
            nextStepId: 'struggle-commit',
        },
        {
            id: 'social-insight',
            type: 'insight',
            text: "Avoiding hard conversations is a comfort tax. Every difficult truth you don't speak compounds like debt. The discomfort of honesty is short. The cost of avoidance is a life built on what you didn't say — relationships that never got the depth they deserved.",
            style: 'principle',
            nextStepId: 'conversation-challenge',
        },
        {
            id: 'conversation-challenge',
            type: 'commitment',
            prompt: "Name the hard conversation you've been avoiding. Write it out as if you're actually saying it — what you would say, to whom, and what truth you've been holding back.",
            placeholder: "The conversation I've been avoiding is with... What I need to say is...",
            minimumWords: 15,
            guidanceHints: [
                'Writing it makes it real',
                'You don\'t have to send it — but you have to say it here',
                'What would you say if there were no consequences?',
            ],
            continueLabel: "I said it",
            storeAs: 'hard-conversation',
            nextStepId: 'struggle-commit',
        },
        {
            id: 'return-check',
            type: 'returnConfirm',
            welcomeMessage: 'You returned.',
            confirmationQuestion: 'Did you complete a physical discomfort challenge?',
            completedOption: {
                label: 'Yes, I chose something hard',
                nextStepId: 'struggle-commit',
            },
            didNotCompleteOption: {
                label: "I didn't do it",
                message: "Honesty is its own form of courage. The challenge will still be there. But ask yourself: what held you back? That resistance — that exact feeling — is the thing you're training to override.",
                nextStepId: 'struggle-commit',
            },
        },
        {
            id: 'struggle-commit',
            type: 'commitment',
            prompt: "What is one form of voluntary discomfort you will practice every day this week? Be specific — not 'exercise more' but 'walk 20 minutes before checking my phone each morning'.",
            placeholder: "This week I will voluntarily embrace... Every day I will...",
            minimumWords: 10,
            guidanceHints: [
                'Specific beats vague every time',
                'Small but consistent builds the callus',
                'What would your strongest self do?',
            ],
            continueLabel: "This is my struggle practice",
            storeAs: 'struggle-commitment',
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
                    "David Goggins calls this 'callousing the mind.' Every time you choose hard over easy, you're building mental calluses that protect you when life gets truly difficult.",
                    "The person who voluntarily does hard things doesn't fear involuntary hardship. You just became a little more unbreakable.",
                ],
                byChoice: {
                    body: [
                        "Physical challenges are the gateway to mental toughness. The body leads, the mind follows. Cold showers, hard workouts, physical discomfort — these are the training ground for an unbreakable spirit.",
                    ],
                    mind: [
                        "Silence is the ultimate modern challenge. In a world of endless stimulation, the ability to sit with yourself is a superpower. You just practiced what most people run from.",
                    ],
                    social: [
                        "Hard conversations are a form of courage most people never develop. You named what needed to be said. That takes more strength than any physical challenge.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Fast, visceral, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "The more you avoid discomfort, the more it controls you. The person who never chooses hard is eventually broken by it. The person who chooses hard is ready for it.",
            subtext: "Voluntary discomfort is the vaccine against life's forced hardships.",
            continueLabel: "Tell me more",
            mood: 'curiosity',
            nextStepId: 'e-comfort-check',
        },
        {
            id: 'e-comfort-check',
            type: 'resonanceCheck',
            prompt: "Where does comfort most hold you back?",
            instruction: "Tap everything that's honest",
            options: [
                { id: 'sleep', text: 'Staying in bed instead of getting up when I should' },
                { id: 'phone', text: 'Reaching for my phone when I should sit with myself' },
                { id: 'exercise', text: 'Avoiding physical challenge because it\'s uncomfortable' },
                { id: 'conversations', text: 'Avoiding hard conversations to keep the peace' },
                { id: 'routines', text: 'Staying in familiar routines instead of stretching' },
                { id: 'saying-no', text: 'Saying yes when I should say no, to avoid tension' },
            ],
            minSelections: 1,
            maxSelections: 4,
            storeAs: 'comfort-zones',
            nextStepId: 'e-philosophy',
        },
        {
            id: 'e-philosophy',
            type: 'tapFlow',
            title: 'The Struggle Philosophy',
            instructions: [
                'The Spartans said: "What doesn\'t kill you makes you stronger." They built a civilization on voluntary hardship.',
                'The Stoics practiced "voluntary poverty" — occasionally giving up comforts to prove they didn\'t NEED them.',
                'The Navy SEALs say: "The only easy day was yesterday." They seek discomfort as proof of capability.',
                'David Goggins runs 100 miles on broken legs. Not because he must. Because choosing the hard thing trains the mind to stop negotiating.',
                'Every time you choose hard over easy when easy was available — you build a callus. Calluses don\'t blister.',
            ],
            style: 'fearless',
            nextStepId: 'e-willingness',
        },
        {
            id: 'e-willingness',
            type: 'scaleRating',
            prompt: "How willing are you to embrace discomfort this week?",
            lowLabel: "Still prefer comfort",
            highLabel: "Ready to choose hard",
            steps: 5,
            storeAs: 'discomfort-willingness',
            responsesByRange: {
                low: "That honesty is valuable. The first step is just noticing where you choose soft. You're already doing it.",
                mid: "Good. Willingness is all that's required. The action follows the decision.",
                high: "Then make it concrete. What specific discomfort will you choose tomorrow morning?",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You know where comfort is costing you. You know the philosophy. Now the only question is:",
            statement: "I will choose one hard thing today. Not because I have to. Because I choose to.",
            confirmLabel: "I choose hard",
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
                    "David Goggins calls this 'callousing the mind.' Every time you choose hard over easy, you're building mental calluses that protect you when life gets truly difficult.",
                    "The person who voluntarily does hard things doesn't fear involuntary hardship. You just became a little more unbreakable.",
                ],
                byMode: {
                    engagement: [
                        "You identified your comfort zones. You chose the harder path anyway. That's the practice. Every day, one hard choice. Over time, that's an identity.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8: FEAR-SETTING
// ─────────────────────────────────────────────────────────────────────────────

const lesson8_FearSetting: FlexibleLesson = {
    id: 'modern-8-fear-setting',
    slug: 'fear-setting',
    order: 3,
    title: 'Fear-Setting',
    subtitle: "Tim Ferriss's antidote to paralysis",
    description: 'Define your fears to disarm them. A powerful exercise for making hard decisions.',
    coreConceptTag: 'fear',
    xpReward: 24,
    estimatedMinutes: 7,
    thumbnail: { icon: '🎯', color: '#ef4444' },
    teaserText: "Tomorrow you'll learn the fear-dissolving technique that Tim Ferriss credits with saving his life.",
    exercises: lesson8Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Deep fear analysis, branching by fear type
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "There's something you've been avoiding. A decision you keep postponing. A leap you're afraid to take. The unknown feels dangerous, so you stay stuck — comfortable in the discomfort of not deciding. But what if the REAL danger is inaction?",
            subtext: "Clear seeing defeats unseen fears.",
            bridgeQuestion: "What decision have you been avoiding?",
            continueLabel: "I know what it is",
            mood: 'tension',
            nextStepId: 'fear-type-choice',
        },
        {
            id: 'fear-type-choice',
            type: 'choice',
            question: "What kind of fear are you working with?",
            instruction: "Choose what resonates most",
            options: [
                {
                    id: 'professional',
                    label: 'A professional leap I haven\'t taken',
                    subtext: 'Starting something, leaving something, asking for something',
                    nextStepId: 'insight-professional',
                    storeAs: 'fear-domain',
                },
                {
                    id: 'relational',
                    label: 'A relationship conversation I\'ve been avoiding',
                    subtext: 'A truth I need to say, a need I haven\'t expressed, a boundary uncrossed',
                    nextStepId: 'insight-relational',
                    storeAs: 'fear-domain',
                },
                {
                    id: 'personal',
                    label: 'A personal change I keep resisting',
                    subtext: 'A habit, a move, a commitment to myself I keep breaking',
                    nextStepId: 'insight-personal',
                    storeAs: 'fear-domain',
                },
            ],
        },
        {
            id: 'insight-professional',
            type: 'insight',
            text: "Tim Ferriss developed Fear-Setting specifically for professional paralysis — the gap between knowing what you should do and actually doing it. He realized: it's never the action that's scary. It's the undefined story we tell ourselves about what might happen if we try.",
            source: 'Tim Ferriss',
            sourceBook: 'Tribe of Mentors',
            style: 'principle',
            nextStepId: 'name-fear',
        },
        {
            id: 'insight-relational',
            type: 'insight',
            text: "The conversations we avoid the longest are usually the ones that would change things the most. Fear of conflict, fear of loss, fear of being seen — these keep us in relationships built on half-truths. Tim Ferriss found that defining the fear precisely is how you stop it from running your life.",
            source: 'Tim Ferriss',
            style: 'principle',
            nextStepId: 'name-fear',
        },
        {
            id: 'insight-personal',
            type: 'insight',
            text: "Personal change is resisted most fiercely because it threatens your sense of self. Who are you if you change? Fear-setting works here too — by exposing that the worst case of changing is almost always better than the slow erosion of staying the same.",
            source: 'Tim Ferriss',
            sourceBook: 'The 4-Hour Workweek',
            style: 'principle',
            nextStepId: 'name-fear',
        },
        {
            id: 'name-fear',
            type: 'commitment',
            prompt: "Name the decision or action you've been avoiding. Be specific — not 'I should do something about my career' but 'I should quit my job and start my own business by March.'",
            placeholder: "I've been avoiding... The specific thing I keep postponing is...",
            minimumWords: 8,
            guidanceHints: [
                'Specific fears can be examined. Vague fears only grow.',
                'Name the exact action, not the general area',
            ],
            continueLabel: "This is what I've been avoiding",
            storeAs: 'fear',
            nextStepId: 'define-worst',
        },
        {
            id: 'define-worst',
            type: 'commitment',
            prompt: "DEFINE: What is the absolute WORST that could happen if you took this action? Catastrophize freely. Be specific and darkest-case.",
            placeholder: "The worst case would be... I could lose... People might think...",
            minimumWords: 15,
            guidanceHints: [
                'Let yourself imagine the darkest scenario',
                'Be specific, not vague — name the actual outcomes',
                'What would you lose? What would happen?',
            ],
            continueLabel: "I see the worst case",
            storeAs: 'worst-case',
            nextStepId: 'prevent-worst',
        },
        {
            id: 'prevent-worst',
            type: 'commitment',
            prompt: "PREVENT: What could you do to reduce the probability of that worst case? What preparation, safety nets, or backup plans could you create?",
            placeholder: "I could prevent this by... To reduce the risk I would... A safety net I could build is...",
            minimumWords: 10,
            guidanceHints: [
                'What preparation would minimize the risk?',
                'Who could support you through this?',
                'What would a 3-month experiment look like?',
            ],
            continueLabel: "I have preventions in mind",
            storeAs: 'preventions',
            nextStepId: 'repair-worst',
        },
        {
            id: 'repair-worst',
            type: 'commitment',
            prompt: "REPAIR: If the worst happened anyway, what would you do to recover? How resourceful have you been before? How would you rebuild?",
            placeholder: "To recover I would... I've bounced back from... I could rebuild by...",
            minimumWords: 10,
            guidanceHints: [
                'You are more resourceful than you think',
                'What have you recovered from before?',
                'Who has overcome similar situations?',
            ],
            continueLabel: "I know I could recover",
            storeAs: 'repairs',
            nextStepId: 'cost-insight',
        },
        {
            id: 'cost-insight',
            type: 'insight',
            text: "Now the crucial question: What is the COST of inaction? If you don't take this leap in 6 months, 1 year, 3 years — what will your life look like? The real risk isn't failure. It's never trying and living with the question of what could have been.",
            style: 'revelation',
            nextStepId: 'action-commit',
        },
        {
            id: 'action-commit',
            type: 'commitment',
            prompt: "What is ONE specific action you can take in the next 48 hours to move toward this decision? Not 'think about it' — something concrete that creates momentum.",
            placeholder: "In the next 48 hours I will... The concrete first step is...",
            minimumWords: 10,
            guidanceHints: [
                'Small first step is still a step',
                'What takes less than 30 minutes to start?',
                'Research, a conversation, a draft — something real',
            ],
            continueLabel: "This is my first move",
            storeAs: 'action',
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
                    "You just did what Tim Ferriss credits with saving his life. By defining the fear, you took away its power. Most people never look their fears in the eye. You just did.",
                    "The fear didn't disappear — but it became manageable. That's the point. Now you can make a decision based on reality, not phantom terrors.",
                    "Ferriss says: 'What we fear doing most is usually what we most need to do.' You've done the hard work of clarity. The action is now a choice, not a mystery.",
                ],
                byChoice: {
                    professional: [
                        "Professional paralysis is the most expensive kind of fear. The cost is years of your life, not just a moment of discomfort. You just chose clarity over paralysis.",
                    ],
                    relational: [
                        "The conversations we avoid the longest cause the most damage — in silence. You named what needed to be said. That's the first act of courage.",
                    ],
                    personal: [
                        "Personal change is the hardest kind because it requires you to become someone new. You just mapped out that the person you'd become is far better than the cost of staying stuck.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Method-focused, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "There's something you've been avoiding. A decision you keep postponing. The unknown feels dangerous — so you stay stuck. But what if the REAL danger is inaction?",
            subtext: "Clear seeing defeats unseen fears.",
            continueLabel: "I know what I've been avoiding",
            mood: 'tension',
            nextStepId: 'e-fear-resonance',
        },
        {
            id: 'e-fear-resonance',
            type: 'resonanceCheck',
            prompt: "What fear has been holding you back?",
            instruction: "Select all that apply to you right now",
            options: [
                { id: 'failure', text: 'Fear of failure — what if I try and it doesn\'t work?' },
                { id: 'rejection', text: 'Fear of rejection — what if they say no?' },
                { id: 'judgment', text: 'Fear of being judged — what will people think?' },
                { id: 'loss', text: 'Fear of loss — what if I lose what I have?' },
                { id: 'unknown', text: 'Fear of the unknown — I can\'t see how it plays out' },
                { id: 'enough', text: 'Fear of not being enough — what if I can\'t handle it?' },
            ],
            minSelections: 1,
            maxSelections: 3,
            storeAs: 'fear-type',
            nextStepId: 'e-method',
        },
        {
            id: 'e-method',
            type: 'tapFlow',
            title: 'The Fear-Setting Method',
            instructions: [
                'Tim Ferriss developed this after nearly taking his own life. He realized: we never define our fears precisely. The undefined stays terrifying. The defined becomes manageable.',
                'Step 1 — DEFINE: Ask yourself: what is the absolute worst that could happen? Be specific. Name the actual outcomes, not just a vague sense of disaster.',
                'Step 2 — PREVENT: What could you do to reduce the probability of that worst case? Most worst-case scenarios are far more preventable than we think.',
                'Step 3 — REPAIR: If the worst happened anyway, how would you recover? You have survived hard things before. You\'d survive this too.',
                'The final question: What is the cost of INACTION? Not in some abstract sense — what is your life like in 1 year, 3 years, 10 years if you never take this step?',
            ],
            style: 'fearless',
            nextStepId: 'e-manageable',
        },
        {
            id: 'e-manageable',
            type: 'scaleRating',
            prompt: "After walking through the fear-setting method, how manageable does your fear feel?",
            lowLabel: "Still overwhelming",
            highLabel: "Much more manageable",
            steps: 5,
            storeAs: 'fear-manageability',
            responsesByRange: {
                low: "That's honest. Some fears take more than one pass. The important thing is you looked at it. Looking is always the first step.",
                mid: "Good. That shift — even small — is the proof the method works. The fear didn't change. Your relationship to it did.",
                high: "That's exactly what Ferriss discovered. Defined fears aren't nearly as terrifying as undefined ones. You just took the blindfold off.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You looked at the fear directly. You ran it through the method. Now:",
            statement: "I define my fears so they cannot define me.",
            confirmLabel: "This is my stance",
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
                    "You just did what Tim Ferriss credits with saving his life. By defining the fear, you took away its power. Most people never look their fears in the eye. You just did.",
                    "The fear didn't disappear — but it became manageable. Now you can make a decision based on reality, not phantom terrors.",
                ],
                byMode: {
                    engagement: [
                        "You identified the fear. You walked through the method. The next step is yours — but you're no longer operating in the dark.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9: THE ANTIFRAGILE MIND
// ─────────────────────────────────────────────────────────────────────────────

const lesson9_AntifragileMind: FlexibleLesson = {
    id: 'modern-9-antifragile-mind',
    slug: 'antifragile-mind',
    order: 4,
    title: 'The Antifragile Mind',
    subtitle: 'How to grow from chaos',
    description: "Based on Nassim Taleb's concept: become someone who gains from disorder.",
    coreConceptTag: 'antifragile',
    xpReward: 22,
    estimatedMinutes: 5,
    thumbnail: { icon: '⚡', color: '#3b82f6' },
    teaserText: "Tomorrow you'll discover why some people get STRONGER from chaos while others break - and how to become the former.",
    exercises: lesson9Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Taleb's framework applied personally
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Some things break under stress. Some survive. But a rare few actually get STRONGER when stressed. Muscles grow from resistance. Immune systems strengthen from exposure. Diamonds form under pressure. What if your mind could work the same way?",
            subtext: "Beyond resilience lies antifragility.",
            continueLabel: "Tell me more",
            mood: 'curiosity',
            nextStepId: 'taleb-insight',
        },
        {
            id: 'taleb-insight',
            type: 'insight',
            text: "Nassim Taleb coined 'antifragile' to describe things that gain from disorder. Resilience is just surviving. Robustness is just not breaking. But antifragile things IMPROVE from stressors, shocks, and volatility. The opposite of fragile isn't strong — it's antifragile.",
            source: 'Nassim Taleb',
            sourceBook: 'Antifragile',
            style: 'principle',
            nextStepId: 'stress-relationship',
        },
        {
            id: 'stress-relationship',
            type: 'choice',
            question: "How do you currently relate to stress and difficulty?",
            instruction: "Be honest — this is your starting point",
            options: [
                {
                    id: 'breaks',
                    label: 'Stress breaks me — I recover slowly',
                    subtext: 'Difficulty tends to drain me and takes time to bounce back from',
                    nextStepId: 'insight-builds',
                    storeAs: 'stress-relationship',
                },
                {
                    id: 'survives',
                    label: 'I survive stress — I get through it',
                    subtext: 'I manage, but it doesn\'t seem to make me stronger',
                    nextStepId: 'insight-beyond',
                    storeAs: 'stress-relationship',
                },
                {
                    id: 'grows',
                    label: 'Sometimes stress makes me stronger',
                    subtext: 'I\'ve noticed that certain pressures sharpen me',
                    nextStepId: 'insight-double-down',
                    storeAs: 'stress-relationship',
                },
            ],
        },
        {
            id: 'insight-builds',
            type: 'insight',
            text: "Antifragility is a skill, not a personality trait. You start wherever you are. The key shift: stop trying to eliminate stress and start asking what each stressor is building in you. Even the smallest amount of adaptation makes you stronger than before the stressor arrived.",
            style: 'reframe',
            nextStepId: 'visualization',
        },
        {
            id: 'insight-beyond',
            type: 'insight',
            text: "Surviving is the floor, not the ceiling. The goal is to find the signal in the noise — what specific capability is each stressor forcing you to develop? You're already doing the hard work of getting through. The upgrade is asking: 'What am I becoming because of this?'",
            style: 'reframe',
            nextStepId: 'visualization',
        },
        {
            id: 'insight-double-down',
            type: 'insight',
            text: "You already know what antifragility feels like from the inside. The next move is deliberate: design your life to expose yourself to the kinds of stress that build you. Not all stress is equal — the stress that creates growth is the stress you choose, not the stress that finds you.",
            style: 'revelation',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Becoming Antifragile',
            instructions: [
                'Think of something stressful happening in your life right now.',
                'Imagine you\'re not just surviving it...',
                '...you\'re actually getting stronger because of it.',
                'What specific skill is this forcing you to develop?',
                'What weakness is it exposing so you can finally fix it?',
                'What would it mean to be GRATEFUL for this stressor?',
                'You are not fragile. You are antifragile.',
            ],
            paceSeconds: 4,
            style: 'fearless',
            nextStepId: 'stressor-commit',
        },
        {
            id: 'stressor-commit',
            type: 'commitment',
            prompt: "Name a current stressor. How is it — or how could it be — making you specifically stronger? Name the exact capability it's forcing you to build.",
            placeholder: "My stressor is... It could be building my capacity to... The specific strength it's developing in me is...",
            minimumWords: 12,
            guidanceHints: [
                'Be specific about the capability, not just "strength"',
                'What would future you thank this difficulty for?',
                'What weakness is it finally forcing you to address?',
            ],
            continueLabel: "I see how it strengthens me",
            storeAs: 'antifragile-reframe',
            nextStepId: 'action-commit',
        },
        {
            id: 'action-commit',
            type: 'commitment',
            prompt: "What specific action will you take this week to actively GAIN from this stressor — not just survive it?",
            placeholder: "To gain from this, I will... Instead of just enduring this, I'll use it to...",
            minimumWords: 10,
            guidanceHints: [
                'What would a person who thrives on challenge do?',
                'How can you add one more stressor that forces growth?',
            ],
            continueLabel: "This is my antifragile action",
            storeAs: 'antifragile-action',
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
                    "The antifragile don't fear volatility — they need it to grow. You just practiced seeing stress as fertilizer, not poison. This shift changes everything.",
                    "Taleb writes: 'Wind extinguishes a candle but energizes fire.' You're learning to be the fire, not the candle.",
                    "Most people spend their lives trying to eliminate stress. The antifragile spend theirs learning to gain from it. You're joining their ranks.",
                ],
                byChoice: {
                    breaks: [
                        "Starting from fragile isn't a weakness — it's an honest baseline. Every antifragile person started somewhere. What you just did — naming the stressor and seeing how it could build you — is the first iteration of the muscle.",
                    ],
                    survives: [
                        "You've already mastered survival. That's not nothing. The upgrade to antifragile is a mindset shift: what if every stressor had a curriculum? You just started asking that question.",
                    ],
                    grows: [
                        "You already know this feeling from the inside. Now it's about being deliberate — designing exposure to the stress that builds you, not just enduring the stress that finds you.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Concept + personal mapping
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "Some things break under stress. Some survive. But a rare few get STRONGER when stressed. What if your mind could work the same way?",
            subtext: "Beyond resilience lies antifragility.",
            continueLabel: "Tell me how",
            mood: 'curiosity',
            nextStepId: 'e-insight',
        },
        {
            id: 'e-insight',
            type: 'insight',
            text: "Nassim Taleb coined 'antifragile.' Resilience is surviving. Robustness is not breaking. Antifragile is IMPROVING from disorder. The immune system, markets, creativity — they all gain from volatility. The question: does your mind?",
            source: 'Nassim Taleb',
            sourceBook: 'Antifragile',
            style: 'principle',
            nextStepId: 'e-stressors',
        },
        {
            id: 'e-stressors',
            type: 'resonanceCheck',
            prompt: "What stressors are currently active in your life?",
            instruction: "Tap what's real right now",
            options: [
                { id: 'financial', text: 'Financial pressure or uncertainty' },
                { id: 'relationships', text: 'Friction or difficulty in a key relationship' },
                { id: 'health', text: 'Health challenges or concerns' },
                { id: 'career', text: 'Career uncertainty or professional challenge' },
                { id: 'workload', text: 'High workload or time pressure' },
                { id: 'change', text: 'A major life change I didn\'t choose' },
            ],
            minSelections: 1,
            maxSelections: 4,
            storeAs: 'active-stressors',
            nextStepId: 'e-reframe',
        },
        {
            id: 'e-reframe',
            type: 'tapFlow',
            title: 'The Antifragile Shift',
            instructions: [
                'Most people ask: "Why is this happening to me?" The antifragile ask: "What is this building in me?"',
                'Financial pressure builds resourcefulness, creativity, and the clarity of what actually matters.',
                'Relationship friction builds communication skills, emotional intelligence, and self-knowledge.',
                'Career uncertainty builds adaptability, self-reliance, and the ability to create rather than just respond.',
                'The stressor didn\'t become less real. But your relationship to it just changed. That\'s the shift.',
            ],
            style: 'fearless',
            nextStepId: 'e-growth-check',
        },
        {
            id: 'e-growth-check',
            type: 'scaleRating',
            prompt: "How much are you currently gaining from stress vs. just surviving it?",
            lowLabel: "Just surviving",
            highLabel: "Actually growing from it",
            steps: 5,
            storeAs: 'antifragile-level',
            responsesByRange: {
                low: "Survival mode is real. Start there. The shift to antifragile begins with one question: 'What is this building in me?' Ask it once today.",
                mid: "You're somewhere in between — which means the antifragile mindset is already available to you. You just need to apply it more deliberately.",
                high: "You've already found the key. Now the move is to design your life to expose yourself to more of the stress that builds you.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "You named your stressors. You walked through the reframe. Now:",
            statement: "I am not fragile. Disorder is my training ground.",
            confirmLabel: "This is who I'm becoming",
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
                    "Taleb writes: 'Wind extinguishes a candle but energizes fire.' You're learning to be the fire, not the candle.",
                    "The antifragile don't fear volatility — they need it to grow. You just practiced seeing stress as fertilizer, not poison.",
                ],
                byMode: {
                    engagement: [
                        "You identified your stressors and started the reframe. That's the first step. The next is asking — every time something hard happens — 'What is this building in me?' Ask it daily. It changes everything.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10: LETTER TO YOUR FUTURE SELF
// ─────────────────────────────────────────────────────────────────────────────

const lesson10_FutureSelf: FlexibleLesson = {
    id: 'modern-10-future-self',
    slug: 'future-self',
    order: 5,
    title: 'Letter to Your Future Self',
    subtitle: 'Bridge the gap between who you are and who you will become',
    description: 'A powerful visualization and writing exercise that clarifies your trajectory.',
    coreConceptTag: 'vision',
    xpReward: 25,
    estimatedMinutes: 7,
    thumbnail: { icon: '✉️', color: '#14b8a6' },
    teaserText: "Tomorrow you'll write a letter to yourself one year from now - a powerful practice that bridges present and future.",
    exercises: lesson10Exercises,

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITING PATH — Visualization + deeply specific letter + promise
    // ═══════════════════════════════════════════════════════════════════════════
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "One year from today, a future version of you exists. They have lived through everything that's coming. They know which decisions mattered, which fears were overblown, and what truly changed their life. They're not imaginary — they're real, and they're being built by every choice you make right now.",
            subtext: "What if you could send them a message from this exact moment?",
            continueLabel: "I want to reach them",
            mood: 'hope',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Meet Your Future Self',
            instructions: [
                'Breathe deeply. Let yourself settle.',
                'It\'s one year from today.',
                'Imagine the best realistic version of yourself.',
                'What habits did they finally build?',
                'What fear did they finally face?',
                'What are they most proud of right now?',
                'See them clearly. They\'re waiting for this message.',
            ],
            paceSeconds: 5,
            style: 'cosmic',
            nextStepId: 'letter-focus',
        },
        {
            id: 'letter-focus',
            type: 'choice',
            question: "What feels most important to address in your letter?",
            instruction: "Choose what you most need your future self to hear",
            options: [
                {
                    id: 'fear',
                    label: 'The fear I need to face this year',
                    subtext: 'Something I\'ve been avoiding that my future self will be glad I confronted',
                    nextStepId: 'letter-insight-fear',
                    storeAs: 'letter-focus',
                },
                {
                    id: 'habit',
                    label: 'The habit that could change everything',
                    subtext: 'A practice I know matters but keep starting and stopping',
                    nextStepId: 'letter-insight-habit',
                    storeAs: 'letter-focus',
                },
                {
                    id: 'relationship',
                    label: 'A relationship that needs work',
                    subtext: 'Something I need to repair, deepen, or let go of',
                    nextStepId: 'letter-insight-relationship',
                    storeAs: 'letter-focus',
                },
                {
                    id: 'purpose',
                    label: 'The purpose I\'m searching for',
                    subtext: 'The work or life that feels most aligned with who I really am',
                    nextStepId: 'letter-insight-purpose',
                    storeAs: 'letter-focus',
                },
            ],
        },
        {
            id: 'letter-insight-fear',
            type: 'insight',
            text: "A year from now, you'll either have faced it or still be carrying it. The fear doesn't go away with time — it just gets heavier. Your future self is on the other side of the leap you keep postponing. Let your letter be a promise that you're ready to jump.",
            style: 'revelation',
            nextStepId: 'letter-write',
        },
        {
            id: 'letter-insight-habit',
            type: 'insight',
            text: "A year of consistent practice creates a different human. Not a better version — a different one. The habit isn't really about the action; it's about who you become by choosing it every day. Your future self is built from the small decisions your current self makes starting now.",
            style: 'revelation',
            nextStepId: 'letter-write',
        },
        {
            id: 'letter-insight-relationship',
            type: 'insight',
            text: "Relationships don't improve passively. They either evolve through intentional effort or slowly drift toward distance. A year from now, you'll have either invested in what matters most or watched it quietly erode. Let your letter name the relationship and what it deserves from you.",
            style: 'revelation',
            nextStepId: 'letter-write',
        },
        {
            id: 'letter-insight-purpose',
            type: 'insight',
            text: "Purpose isn't found — it's built. It emerges at the intersection of what you're good at, what the world needs, and what you can't stop thinking about. A year from now, you'll either be moving toward it or still searching. Let your letter name what you actually want to build.",
            style: 'revelation',
            nextStepId: 'letter-write',
        },
        {
            id: 'letter-write',
            type: 'reflection',
            prompt: "Write your letter to yourself one year from now. Be specific: what do you hope they've accomplished? What do you want them to remember about who you are today? What are you promising them?",
            minimumWords: 50,
            placeholder: "Dear Future Me,\n\nI'm writing to you from a moment of clarity...",
            encouragements: [
                'Be specific about what you hope to achieve',
                'Tell them what it feels like to be you right now',
                "Make a promise they'll be glad you kept",
            ],
            nextStepId: 'promise-commit',
        },
        {
            id: 'promise-commit',
            type: 'commitment',
            prompt: "What is the ONE thing you're promising your future self right now? Write it as a declaration.",
            placeholder: "I promise you that I will... This is the one thing I commit to...",
            minimumWords: 8,
            guidanceHints: [
                'One thing, not ten',
                'Make it specific and measurable',
                'Would your future self believe you?',
            ],
            continueLabel: "I make this promise",
            storeAs: 'promise',
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
                    "You've just done something that bridges present and future. This letter is a contract with yourself. The person you wrote to is real — they're built by decisions you make starting today.",
                    "Research shows that feeling connected to your future self leads to better decisions RIGHT NOW. You just built that bridge.",
                    "Save this letter somewhere you'll find it in a year. Reading your own words from a pivotal moment has a power nothing else can match.",
                ],
                byChoice: {
                    fear: [
                        "You chose to address the fear. Your future self will either thank you for having faced it — or know exactly what's still waiting. Either way, you've made it real.",
                    ],
                    habit: [
                        "A year of a habit changes who you are. Not incrementally — fundamentally. The promise you made today is the agreement your future self will have lived by.",
                    ],
                    relationship: [
                        "Relationships are the most honest indicator of who we're becoming. You named what needed attention. Now it's a choice, not an oversight.",
                    ],
                    purpose: [
                        "Purpose is built in the gap between who you are and who you're becoming. You just looked into that gap clearly. That's where the work begins.",
                    ],
                },
            },
        },
    ],

    // ═══════════════════════════════════════════════════════════════════════════
    // ENGAGEMENT PATH — Visualization-led, no writing
    // ═══════════════════════════════════════════════════════════════════════════
    engagementSteps: [
        {
            id: 'e-scenario',
            type: 'scenario',
            narrative: "One year from today, a future version of you exists. They've lived through everything that's coming. They know which decisions mattered and what truly changed their life.",
            subtext: "What would you tell them? What would they tell you?",
            continueLabel: "I want to reach them",
            mood: 'hope',
            nextStepId: 'e-future-self',
        },
        {
            id: 'e-future-self',
            type: 'tapFlow',
            title: 'Meet Your Future Self',
            instructions: [
                'Breathe slowly. Close your eyes if you can.',
                'It\'s one year from today. The best realistic version of you exists right now.',
                'They woke up this morning with a sense of purpose. Something specific changed — and they know exactly what it was.',
                'They faced something you\'re currently afraid of. They\'re glad they did.',
                'They have a habit you don\'t have yet. It changed everything.',
                'They are looking back at this exact moment — when you were standing at the beginning of the year — and they want you to know something.',
            ],
            style: 'cosmic',
            nextStepId: 'e-needs',
        },
        {
            id: 'e-needs',
            type: 'resonanceCheck',
            prompt: "What does your future self most need from you right now?",
            instruction: "Select what resonates most deeply",
            options: [
                { id: 'health', text: 'Consistency with my physical health' },
                { id: 'fear', text: 'To face a specific fear I keep avoiding' },
                { id: 'relationship', text: 'To invest in a key relationship' },
                { id: 'project', text: 'To start the project I keep delaying' },
                { id: 'letting-go', text: 'To let go of something that\'s holding me back' },
                { id: 'practice', text: 'To build a daily practice that grounds me' },
            ],
            minSelections: 1,
            maxSelections: 3,
            storeAs: 'future-needs',
            nextStepId: 'e-connection',
        },
        {
            id: 'e-connection',
            type: 'scaleRating',
            prompt: "How connected do you feel to your future self right now?",
            lowLabel: "They feel like a stranger",
            highLabel: "I can see them clearly",
            steps: 5,
            storeAs: 'future-connection',
            responsesByRange: {
                low: "Research shows that people who feel disconnected from their future self treat them like a stranger — making choices that hurt them. This visualization is the bridge. Use it often.",
                mid: "You can see them forming. The clearer your future self becomes, the better decisions your current self makes for them.",
                high: "That clarity is precious. The more vividly you can see your future self, the more powerfully you're drawn toward them.",
            },
            nextStepId: 'e-affirmation',
        },
        {
            id: 'e-affirmation',
            type: 'affirmation',
            preText: "Your future self is real. They're being built right now. They're asking you for one thing:",
            statement: "I am building my future self with every decision I make today.",
            confirmLabel: "I accept this",
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
                    "Research shows that feeling connected to your future self leads to better decisions right now. You just built that bridge.",
                    "The person you visualized today is real. They're built by every choice you make starting now. Today you started building with intention.",
                ],
                byMode: {
                    engagement: [
                        "You met your future self. You named what they need from you. Now it's about closing the gap — one decision at a time, starting today.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 2: RESILIENCE
// ─────────────────────────────────────────────────────────────────────────────

export const chapter2_Resilience: FlexibleChapter = {
    id: 'chapter-modern-resilience',
    slug: 'resilience',
    name: 'Resilience',
    subtitle: 'Becoming unbreakable',
    description: 'Five advanced practices for developing mental toughness. Learn to thrive in chaos, recover from setbacks, and become antifragile.',
    order: 2,
    iconName: 'Shield',
    lessons: [
        lesson6_ComebackFormula,
        lesson7_EmbraceStruggle,
        lesson8_FearSetting,
        lesson9_AntifragileMind,
        lesson10_FutureSelf,
    ],
};

export default chapter2_Resilience;
