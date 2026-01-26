// ═══════════════════════════════════════════════════════════════════════════
// STOICISM - CHAPTER 1: PERCEPTION
// The art of seeing clearly before you act
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 1: THE DICHOTOMY OF CONTROL
// ─────────────────────────────────────────────────────────────────────────────

const lesson1_DichotomyControl: FlexibleLesson = {
    id: 'stoic-1-dichotomy-control',
    slug: 'dichotomy-of-control',
    order: 1,
    title: 'The Dichotomy of Control',
    subtitle: 'The foundation of all inner peace',
    description: 'Learn the single distinction that eliminates most suffering.',
    coreConceptTag: 'control',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '⚖️', color: '#6366f1' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You're carrying something heavy right now. A worry. A frustration. Something that keeps circling in your mind, demanding attention, stealing your peace.",
            subtext: "What if one question could cut through all of it?",
            bridgeQuestion: "Bring to mind something that's been weighing on you.",
            continueLabel: "I have something in mind",
            mood: 'tension',
        },
        {
            id: 'epictetus-wisdom',
            type: 'insight',
            text: "'Some things are within our power, while others are not. Within our power are opinion, motivation, desire, and aversion. Not within our power are our body, our reputation, positions of authority, and whatever is not our own doing.'",
            source: 'Epictetus',
            sourceBook: 'Enchiridion',
            style: 'quote',
            followUp: "This 2,000-year-old distinction is the foundation of everything.",
            nextStepId: 'name-worry',
        },
        {
            id: 'name-worry',
            type: 'commitment',
            prompt: "Name the thing that's been weighing on you. What are you worried or frustrated about?",
            placeholder: "I'm worried about... I'm frustrated by... I can't stop thinking about...",
            minimumWords: 5,
            continueLabel: "This is what's weighing on me",
            storeAs: 'worry',
            nextStepId: 'control-question',
        },
        {
            id: 'control-question',
            type: 'choice',
            question: 'Ask yourself honestly: Is this within your control?',
            instruction: 'Can YOU directly change this through your own actions?',
            options: [
                {
                    id: 'in-control',
                    label: 'Yes, I can do something about this',
                    subtext: "There's action I can take",
                    nextStepId: 'action-path',
                },
                {
                    id: 'out-control',
                    label: "No, it's outside my control",
                    subtext: "It depends on others or circumstances",
                    nextStepId: 'acceptance-path',
                },
                {
                    id: 'partial',
                    label: "Partially - some aspects are in my control",
                    subtext: "It's mixed",
                    nextStepId: 'partial-path',
                },
            ],
        },
        {
            id: 'action-path',
            type: 'commitment',
            prompt: "Since this IS in your control, what is one specific action you can take in the next 24 hours?",
            placeholder: "I will... I can start by... Tomorrow I'm going to...",
            minimumWords: 8,
            guidanceHints: [
                'Small and specific is better than big and vague',
                'What would your wisest self do?',
            ],
            continueLabel: "This is my action",
            storeAs: 'action',
            nextStepId: 'reflection',
        },
        {
            id: 'acceptance-path',
            type: 'visualization',
            title: 'The Release',
            instructions: [
                'Breathe deeply. Let yourself settle.',
                'See this worry in your hands.',
                'Feel its weight. Acknowledge it fully.',
                'Now... recognize: this was never yours to carry.',
                'You cannot change what you cannot control.',
                'Slowly open your hands. Let it go.',
                'What remains is peace.',
            ],
            paceSeconds: 4,
            style: 'grounding',
            nextStepId: 'acceptance-insight',
        },
        {
            id: 'acceptance-insight',
            type: 'insight',
            text: "You just practiced what Epictetus called the source of all freedom. You cannot control external events. You can only control your response. In releasing what isn't yours to carry, you reclaim your energy.",
            style: 'reframe',
            nextStepId: 'reflection',
        },
        {
            id: 'partial-path',
            type: 'commitment',
            prompt: "Separate what you CAN control from what you CANNOT. What specific aspect is within your power?",
            placeholder: "I can control... But I cannot control... My focus should be on...",
            minimumWords: 15,
            guidanceHints: [
                'Be precise about the boundary',
                'Focus energy only where it can make a difference',
            ],
            continueLabel: "I see the distinction",
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How does it feel to apply this distinction? What shifted when you asked 'Is this within my control?'",
            minimumWords: 12,
            encouragements: [
                'What weight did you put down?',
                'How might this question serve you daily?',
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
                    "Epictetus was born a slave—yet became one of history's greatest teachers of freedom. He knew that even in chains, your mind is free. This is the foundation of everything Stoic.",
                    "Most suffering comes from fighting battles we cannot win. Today you learned to choose your battles wisely. This simple question, asked daily, will transform your relationship with stress.",
                ],
                byChoice: {
                    'in-control': [
                        "You identified something you can change and committed to action. That's power. The Stoics didn't just think about virtue—they practiced it. You're doing the same.",
                    ],
                    'out-control': [
                        "You practiced the hardest skill: releasing what isn't yours to carry. This isn't giving up—it's growing up. Your energy is now free for battles you can actually win.",
                    ],
                    partial: [
                        "The wisdom to see the boundary between control and chaos—this is rare. Most people either try to control everything or give up entirely. You found the middle way.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 2: PERCEPTION IS EVERYTHING
// ─────────────────────────────────────────────────────────────────────────────

const lesson2_PerceptionEverything: FlexibleLesson = {
    id: 'stoic-2-perception-everything',
    slug: 'perception-everything',
    order: 2,
    title: 'Perception is Everything',
    subtitle: 'It is not things, but judgments about things, that disturb us',
    description: 'Learn to separate events from your interpretations.',
    coreConceptTag: 'perception',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '👁️', color: '#8b5cf6' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something happened recently that upset you. A comment. A rejection. An unexpected turn. But here's the Stoic secret: it wasn't the event that upset you—it was your judgment about the event.",
            subtext: "Between stimulus and response is a space. In that space is your power.",
            continueLabel: "Show me what you mean",
            mood: 'curiosity',
        },
        {
            id: 'epictetus-wisdom',
            type: 'insight',
            text: "'It is not things that disturb us, but our judgments about things. When you are upset, know that it is not the thing itself that upsets you, but your own judgment about it. And it is in your power to revoke that judgment now.'",
            source: 'Epictetus',
            style: 'quote',
            nextStepId: 'identify-event',
        },
        {
            id: 'identify-event',
            type: 'commitment',
            prompt: "Think of something that annoyed or upset you recently. Describe the EVENT only—what actually happened, with no judgments or interpretations.",
            placeholder: "What happened: Someone said... I didn't get... They did...",
            minimumWords: 8,
            guidanceHints: [
                'Just the facts—what a camera would record',
                'No opinions, no stories, just what occurred',
            ],
            continueLabel: "I've described the event",
            storeAs: 'event',
            nextStepId: 'identify-judgment',
        },
        {
            id: 'identify-judgment',
            type: 'commitment',
            prompt: "Now describe your JUDGMENT about that event. What story did you tell yourself? What did you make it mean?",
            placeholder: "I interpreted this as... I told myself it meant... My story was...",
            minimumWords: 10,
            guidanceHints: [
                'This is where the emotion lives',
                'What conclusions did you draw?',
            ],
            continueLabel: "I see my judgment",
            storeAs: 'judgment',
            nextStepId: 'reframe-challenge',
        },
        {
            id: 'reframe-challenge',
            type: 'commitment',
            prompt: "Now create an ALTERNATIVE interpretation. A neutral or even positive way to see the same event. What else could this mean?",
            placeholder: "Another way to see this is... Maybe it actually means... A kinder interpretation...",
            minimumWords: 10,
            guidanceHints: [
                'What would a wise mentor say?',
                'How might this be a gift in disguise?',
            ],
            continueLabel: "I found a new perspective",
            storeAs: 'reframe',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What shifted when you separated the event from your judgment? How might this practice change your daily experience?",
            minimumWords: 15,
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
                    "The gap between stimulus and response is where your freedom lives. You just widened that gap by questioning your first interpretation. Most people never do this.",
                    "Facts don't hurt. Stories hurt. You just practiced separating the two. This is the foundation of emotional intelligence.",
                    "Modern psychology calls this 'cognitive reframing.' The Stoics knew it 2,000 years ago. The ability to choose your interpretation is the ultimate freedom.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 3: THE VIEW FROM ABOVE
// ─────────────────────────────────────────────────────────────────────────────

const lesson3_ViewFromAbove: FlexibleLesson = {
    id: 'stoic-3-view-from-above',
    slug: 'view-from-above',
    order: 3,
    title: 'The View From Above',
    subtitle: 'Cosmic perspective for daily problems',
    description: 'Use the vastness of space and time to gain perspective on your troubles.',
    coreConceptTag: 'perspective',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🌍', color: '#3b82f6' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something is troubling you. It feels big. Urgent. All-consuming. But Marcus Aurelius, who ruled the entire Roman Empire, had a practice for moments like this. He would zoom out—far, far out.",
            subtext: "Perspective is the antidote to being overwhelmed.",
            continueLabel: "Take me to the view from above",
            mood: 'curiosity',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'Think often on the swiftness with which things pass and disappear. All things are subject to countless changes. Consider the infinite past and future in which all things are dissolved.'",
            source: 'Marcus Aurelius',
            sourceBook: 'Meditations',
            style: 'quote',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'The Cosmic Zoom',
            instructions: [
                'Bring to mind something troubling you right now.',
                'Now... imagine rising above your room.',
                'Higher... above your city.',
                'Higher still... you see your entire country.',
                'The Earth curves below you. Clouds drift silently.',
                "From space, there are no arguments. No deadlines. Just Earth, slowly turning.",
                'Your problem still exists. But how large is it from here?',
                'What truly matters from this vantage point?',
            ],
            paceSeconds: 5,
            style: 'cosmic',
            nextStepId: 'time-zoom',
        },
        {
            id: 'time-zoom',
            type: 'timer',
            title: 'The Time Zoom',
            instruction: "Now zoom through time. Imagine this moment from 10 years in the future. Will this problem even be remembered? Sit with that perspective for 60 seconds.",
            durationSeconds: 60,
            timerStyle: 'presence',
            guidanceMessages: [
                'Your 90-year-old self looks back at today.',
                'What would they tell you is actually important?',
                'Most of what we worry about is forgotten within months.',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What shifted when you zoomed out in space and time? How does your problem look from the cosmic perspective?",
            minimumWords: 15,
            encouragements: [
                'What actually deserves your energy?',
                'What can you release as too small to matter?',
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
                    "Marcus Aurelius ruled an empire and still practiced this exercise daily. From space, there are no borders, no arguments, no deadlines. That peace is always available—one zoom-out away.",
                    "The view from above doesn't minimize your life. It clarifies what actually deserves your precious energy. You just gained a tool for instant perspective.",
                    "Astronauts call it the 'overview effect'—a cognitive shift from seeing Earth from space. Today you practiced achieving it without a rocket.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 4: MORNING PREPARATION
// ─────────────────────────────────────────────────────────────────────────────

const lesson4_MorningPreparation: FlexibleLesson = {
    id: 'stoic-4-morning-preparation',
    slug: 'morning-preparation',
    order: 4,
    title: 'Morning Preparation',
    subtitle: 'Pre-accept the difficulties of the day',
    description: "Marcus Aurelius's daily practice for remaining calm in chaos.",
    coreConceptTag: 'preparation',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🌅', color: '#f97316' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Every morning, before Marcus Aurelius left his tent to lead the Roman army, he would sit and write. He would name the difficulties awaiting him—so they couldn't surprise him.",
            subtext: "A warrior who expects battle is calm when it arrives.",
            continueLabel: "Show me his practice",
            mood: 'hope',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'Begin each day by saying to yourself: Today I shall meet with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness—all of them due to ignorance. But I have recognized that the wrongdoer has a nature related to my own. Therefore none of them can injure me.'",
            source: 'Marcus Aurelius',
            sourceBook: 'Meditations',
            style: 'quote',
            nextStepId: 'anticipate-challenges',
        },
        {
            id: 'anticipate-challenges',
            type: 'commitment',
            prompt: "Think of your day ahead. Who might frustrate you? What might go wrong? Name 2-3 difficulties you might encounter.",
            placeholder: "I might face... Someone who could frustrate me is... Something that could go wrong...",
            minimumWords: 15,
            guidanceHints: [
                'Be specific—name actual people and situations',
                'This is not pessimism—it is preparation',
            ],
            continueLabel: "I see what might challenge me",
            storeAs: 'anticipated-challenges',
            nextStepId: 'plan-response',
        },
        {
            id: 'plan-response',
            type: 'commitment',
            prompt: "Now pre-plan your response. When these difficulties arise, how will you respond with grace and wisdom?",
            placeholder: "When [challenge] happens, I will... If I feel frustrated, I'll remember... My calm response will be...",
            minimumWords: 15,
            guidanceHints: [
                'Choose your response in advance',
                "What would your calmest, wisest self do?",
            ],
            continueLabel: "I have my plan",
            storeAs: 'planned-response',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How does pre-accepting difficulties change your relationship with them? What power do you gain by expecting challenges?",
            minimumWords: 12,
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
                    "This is not pessimism—it is inoculation. A warrior who expects battle is calm when it arrives. Most anger comes from violated expectations. By adjusting yours in advance, you reclaim your peace.",
                    "Marcus wrote these words before dawn, preparing to lead an empire. You now use the same practice he trusted with the weight of the world. Different stakes, same wisdom.",
                    "Modern psychology calls this 'implementation intentions'—pre-planning responses to obstacles. The Stoics knew it as morning preparation. It works.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 5: REMOVING JUDGMENT
// ─────────────────────────────────────────────────────────────────────────────

const lesson5_RemovingJudgment: FlexibleLesson = {
    id: 'stoic-5-removing-judgment',
    slug: 'removing-judgment',
    order: 5,
    title: 'Removing Judgment',
    subtitle: 'Strip away the story to find peace',
    description: 'Practice describing reality without emotional labels.',
    coreConceptTag: 'judgment',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🔍', color: '#14b8a6' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something is 'terrible.' Someone is 'impossible.' A situation is 'the worst.' But are these facts—or stories you've attached to facts? The Stoics practiced stripping away judgment to see reality clearly.",
            subtext: "Remove the judgment, and the feeling goes with it.",
            continueLabel: "I want to see this clearly",
            mood: 'curiosity',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: `'If you are pained by any external thing, it is not the thing that disturbs you, but your own judgment about it. And it is in your power to wipe out this judgment now. Remove the judgment "this is terrible" and the feeling goes with it.'`,
            source: 'Marcus Aurelius',
            style: 'quote',
            nextStepId: 'identify-terrible',
        },
        {
            id: 'identify-terrible',
            type: 'commitment',
            prompt: "Think of something you've been calling 'bad' or 'terrible.' What have you been judging harshly?",
            placeholder: "I've been calling... terrible. I've been judging... as awful.",
            minimumWords: 5,
            continueLabel: "I've identified my judgment",
            storeAs: 'judgment-target',
            nextStepId: 'neutral-description',
        },
        {
            id: 'neutral-description',
            type: 'commitment',
            prompt: "Now describe the same thing using ONLY neutral, factual language. No opinions. No judgments. Just what happened, objectively.",
            placeholder: "What actually occurred: [facts only]...",
            minimumWords: 15,
            guidanceHints: [
                'What would a camera record?',
                'What would a neutral news reporter say?',
                'Remove all emotional language',
            ],
            continueLabel: "I've stripped away the judgment",
            storeAs: 'neutral-description',
            nextStepId: 'notice-difference',
        },
        {
            id: 'notice-difference',
            type: 'timer',
            title: 'Notice the Difference',
            instruction: "Sit for 45 seconds with the neutral description. Notice how different it feels from the judged version. The facts without the story.",
            durationSeconds: 45,
            timerStyle: 'presence',
            guidanceMessages: [
                'Facts don\'t hurt. Stories hurt.',
                'The judgment was added. It can be removed.',
                'What remains when you strip away the story?',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What changed when you described the situation without emotional language? How does the neutral version feel compared to the judged version?",
            minimumWords: 15,
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
                    "This is what philosophers call 'stripping away.' Remove the story, and only reality remains—and reality is always workable. You just put down weight you didn't need to carry.",
                    "Every judgment you add is weight you bear. Today, you practiced putting something down. The event didn't change—but your relationship to it transformed.",
                    "This takes practice. The judgments are habitual. But each time you strip them away, you build a new habit: seeing clearly instead of reactively.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 1: PERCEPTION
// ─────────────────────────────────────────────────────────────────────────────

export const stoic_chapter1_Perception: FlexibleChapter = {
    id: 'chapter-stoic-perception',
    slug: 'perception',
    name: 'Perception',
    subtitle: 'See clearly before you act',
    description: "The Stoics believed that our judgments—not events themselves—cause our suffering. Learn to see reality without the distortions of fear, anger, or desire.",
    order: 1,
    iconName: 'Eye',
    lessons: [
        lesson1_DichotomyControl,
        lesson2_PerceptionEverything,
        lesson3_ViewFromAbove,
        lesson4_MorningPreparation,
        lesson5_RemovingJudgment,
    ],
};

export default stoic_chapter1_Perception;
