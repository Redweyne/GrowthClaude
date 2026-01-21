// ═══════════════════════════════════════════════════════════════════════════
// STOICISM - CHAPTER 2: ACTION
// Do what must be done
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 6: DO THE WORK
// ─────────────────────────────────────────────────────────────────────────────

const lesson6_DoTheWork: FlexibleLesson = {
    id: 'stoic-6-do-the-work',
    slug: 'do-the-work',
    order: 1,
    title: 'Do The Work',
    subtitle: 'Philosophy without action is entertainment',
    description: 'Stop thinking and start doing. The gap between knowing and acting.',
    coreConceptTag: 'action',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '⚡', color: '#f59e0b' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You already know what you need to do. That task you've been avoiding. That conversation you've been postponing. That project that lingers unfinished. Knowing is not the problem. Doing is.",
            subtext: "'Waste no more time arguing about what a good person should be. Be one.' — Marcus Aurelius",
            continueLabel: "I know what I've been avoiding",
            mood: 'tension',
        },
        {
            id: 'identify-avoided',
            type: 'commitment',
            prompt: "What is one small thing you've been avoiding that you KNOW you should do? Something you could complete in the next hour?",
            placeholder: "I've been avoiding... I need to finally...",
            minimumWords: 5,
            guidanceHints: [
                'Be honest—what keeps getting pushed to tomorrow?',
                'Choose something small but real',
            ],
            continueLabel: "This is what I've been avoiding",
            storeAs: 'avoided-task',
            nextStepId: 'why-avoiding',
        },
        {
            id: 'why-avoiding',
            type: 'choice',
            question: "Why haven't you done it?",
            options: [
                {
                    id: 'fear',
                    label: "Fear or discomfort",
                    subtext: "It feels scary or unpleasant",
                    nextStepId: 'fear-insight',
                },
                {
                    id: 'overwhelm',
                    label: "It feels too big",
                    subtext: "I don't know where to start",
                    nextStepId: 'overwhelm-insight',
                },
                {
                    id: 'perfectionism',
                    label: "Perfectionism",
                    subtext: "I want to do it perfectly or not at all",
                    nextStepId: 'perfectionism-insight',
                },
            ],
        },
        {
            id: 'fear-insight',
            type: 'insight',
            text: "The obstacle is the way. The thing you're avoiding because it's uncomfortable is exactly what's blocking your growth. Action is the antidote to anxiety. Do it scared.",
            style: 'reframe',
            nextStepId: 'commitment-action',
        },
        {
            id: 'overwhelm-insight',
            type: 'insight',
            text: "A mountain is climbed one step at a time. You don't need to do it all—you just need to start. What is the tiniest first step? The one that takes less than 5 minutes?",
            style: 'reframe',
            nextStepId: 'commitment-action',
        },
        {
            id: 'perfectionism-insight',
            type: 'insight',
            text: "Done is better than perfect. A messy start beats a perfect plan. Perfection is procrastination wearing a mask. Start badly—you can improve as you go.",
            style: 'reframe',
            nextStepId: 'commitment-action',
        },
        {
            id: 'commitment-action',
            type: 'goDoIt',
            sageMessage: "Go. Right now. Do the thing you've been avoiding. Not tomorrow. Not after this app. NOW. Close this, complete the task, and return. The only person you're lying to by not doing it is yourself.",
            sageSubtext: "Action is the antidote to anxiety.",
            dismissLabel: "I'm going to do it now",
            returnStepId: 'return-check',
        },
        {
            id: 'return-check',
            type: 'returnConfirm',
            welcomeMessage: 'You came back.',
            confirmationQuestion: 'Did you complete the task you were avoiding?',
            completedOption: {
                label: 'Yes, I did it',
                nextStepId: 'reflection',
            },
            didNotCompleteOption: {
                label: "I didn't do it",
                message: "Honesty takes courage. The task is still waiting. But what you learn from this resistance matters too.",
                nextStepId: 'reflection',
            },
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What did you learn from taking action (or from what held you back)? How did it feel compared to how you imagined it would feel?",
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
                    "The gap between who you are and who you want to be closes with small acts, done consistently. Philosophy without action is just entertainment.",
                ],
                byCompletion: {
                    completed: [
                        "You did what you said you would. That's integrity. That's how identity changes—one kept promise at a time. You're becoming someone who acts.",
                    ],
                    notCompleted: [
                        "The resistance you felt is data. What specifically held you back? The answer to that question may be more valuable than the task itself.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 7: THE OBSTACLE IS THE WAY
// ─────────────────────────────────────────────────────────────────────────────

const lesson7_ObstacleWay: FlexibleLesson = {
    id: 'stoic-7-obstacle-way',
    slug: 'obstacle-is-way',
    order: 2,
    title: 'The Obstacle Is The Way',
    subtitle: 'What stands in the way becomes the way',
    description: "Transform obstacles into opportunities using Marcus Aurelius's famous formula.",
    coreConceptTag: 'obstacles',
    xpReward: 22,
    estimatedMinutes: 5,
    thumbnail: { icon: '🔥', color: '#ef4444' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "There's something blocking your path. A person who won't cooperate. A situation that feels impossible. A door that closed. What if this obstacle is secretly the key to your next level?",
            subtext: "The fire uses whatever fuel is thrown upon it.",
            continueLabel: "I want to transform my obstacle",
            mood: 'curiosity',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'The impediment to action advances action. What stands in the way becomes the way.'",
            source: 'Marcus Aurelius',
            style: 'quote',
            followUp: "This might be the most powerful sentence ever written about adversity.",
            nextStepId: 'name-obstacle',
        },
        {
            id: 'name-obstacle',
            type: 'commitment',
            prompt: "What obstacle are you currently facing? Describe it specifically.",
            placeholder: "The obstacle I'm facing is... What's blocking me is...",
            minimumWords: 10,
            continueLabel: "This is my obstacle",
            storeAs: 'obstacle',
            nextStepId: 'flip-it',
        },
        {
            id: 'flip-it',
            type: 'commitment',
            prompt: "Now flip it: How could this obstacle be exactly what you NEED? What is it teaching you? What strength is it forcing you to build?",
            placeholder: "This obstacle could be what I need because... It's teaching me... It's forcing me to develop...",
            minimumWords: 15,
            guidanceHints: [
                'What skill does this challenge demand?',
                'How might your future self thank this obstacle?',
                'What door is opening because this one closed?',
            ],
            continueLabel: "I see the hidden gift",
            storeAs: 'transformation',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What shifted when you saw your obstacle as fuel rather than a wall? How might this change how you approach future challenges?",
            minimumWords: 15,
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
                    "Ryan Holiday wrote an entire book on this principle. Every setback, every rejection, every failure contains a hidden instruction. You're learning to read that instruction.",
                    "Those who master this see problems differently. They become the calm in every storm—because they know that storms are training.",
                    "This is alchemy—turning lead into gold. The obstacle you described is now fuel for your growth. The same obstacle. Different relationship to it.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 8: THE RESERVE CLAUSE
// ─────────────────────────────────────────────────────────────────────────────

const lesson8_ReserveClause: FlexibleLesson = {
    id: 'stoic-8-reserve-clause',
    slug: 'reserve-clause',
    order: 3,
    title: 'The Reserve Clause',
    subtitle: 'Commitment without attachment',
    description: 'How to pursue goals fully while staying free of outcomes.',
    coreConceptTag: 'reserve-clause',
    xpReward: 20,
    estimatedMinutes: 5,
    thumbnail: { icon: '🎯', color: '#10b981' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You have goals. Hopes. Things you're working toward. But the anxiety about whether they'll happen—the attachment to outcomes—steals your peace while you pursue them. The Stoics had a solution.",
            subtext: "Act as if success is certain, but be ready to accept whatever comes.",
            continueLabel: "Show me this secret",
            mood: 'curiosity',
        },
        {
            id: 'seneca-wisdom',
            type: 'insight',
            text: "'The wise person will pursue a goal with full effort, but will add the reserve clause: \"if nothing prevents me.\" They plan with commitment but hold outcomes loosely.'",
            source: 'Seneca',
            style: 'principle',
            nextStepId: 'name-goal',
        },
        {
            id: 'name-goal',
            type: 'commitment',
            prompt: "What goal are you pursuing that you feel attachment or anxiety about? What outcome are you gripping tightly?",
            placeholder: "I'm working toward... I really want...",
            minimumWords: 8,
            continueLabel: "This is my goal",
            storeAs: 'goal',
            nextStepId: 'practice-clause',
        },
        {
            id: 'practice-clause',
            type: 'timer',
            title: 'The Reserve Clause',
            instruction: "Say aloud or silently: 'I will [your goal], if nothing prevents me—and if I am prevented, I will adapt and grow.' Repeat this slowly for 45 seconds. Feel the difference between attachment and commitment.",
            durationSeconds: 45,
            timerStyle: 'breathing',
            guidanceMessages: [
                'Full effort + surrendered outcome = peace.',
                "You control effort. You don't control results.",
                'This is not giving up. It is freedom.',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How does adding 'if nothing prevents me' change your relationship with your goal? What would it feel like to pursue fully while holding lightly?",
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
                    "This is not about expecting failure—it's about being unbreakable. You give your all AND stay free of the outcome. That's Stoic in the truest sense.",
                    "Modern psychology calls this 'psychological flexibility.' The Stoics called it the reserve clause. Both work. Both liberate.",
                    "Attachment to outcomes is the source of anxiety. Commitment without attachment is the source of peace. You just practiced the shift.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 9: ACT IMMEDIATELY
// ─────────────────────────────────────────────────────────────────────────────

const lesson9_ActImmediately: FlexibleLesson = {
    id: 'stoic-9-act-immediately',
    slug: 'act-immediately',
    order: 4,
    title: 'Act Immediately',
    subtitle: 'The power of complete presence',
    description: 'Practice total focus on one thing.',
    coreConceptTag: 'focus',
    xpReward: 18,
    estimatedMinutes: 4,
    thumbnail: { icon: '⏱️', color: '#6366f1' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Your attention has been colonized. Notifications, tabs, half-formed thoughts—you're rarely fully present to anything. Marcus Aurelius, who had the weight of an empire on his shoulders, knew the antidote.",
            subtext: "No wandering attention. Just the straight line of virtue.",
            continueLabel: "Teach me focus",
            mood: 'hope',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'How much time he gains who does not look to see what his neighbor says or does or thinks, but only at what he himself is doing, to make it just and holy.'",
            source: 'Marcus Aurelius',
            style: 'quote',
            nextStepId: 'choose-focus',
        },
        {
            id: 'choose-focus',
            type: 'commitment',
            prompt: "What is ONE thing that deserves your complete attention? Something you've been doing half-heartedly?",
            placeholder: "I should be fully present to... One thing that deserves my focus...",
            minimumWords: 5,
            continueLabel: "This deserves my full attention",
            storeAs: 'focus-target',
            nextStepId: 'focus-practice',
        },
        {
            id: 'focus-practice',
            type: 'timer',
            title: 'Total Presence',
            instruction: "For 90 seconds, give your COMPLETE attention to THIS moment. No wandering thoughts. Just here, now, fully present. When your mind wanders, gently return.",
            durationSeconds: 90,
            timerStyle: 'focus',
            guidanceMessages: [
                'Where is your attention right now?',
                'Bring it back. Again and again.',
                'This is the practice. The wandering is part of it.',
            ],
            allowStruggle: true,
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What did you notice when you gave something your complete, undivided attention? How often did your mind wander?",
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
                    "Most people have never experienced true focus. They skim the surface of everything. In those 90 seconds, you practiced what monks train for years to achieve.",
                    "Distraction is the enemy of excellence. Focus is a muscle—and you just trained it. The more you practice, the stronger it becomes.",
                    "Presence is power. When you're fully here, you bring your whole self to whatever you're doing. That changes the quality of everything.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 10: VOLUNTARY DISCOMFORT
// ─────────────────────────────────────────────────────────────────────────────

const lesson10_VoluntaryDiscomfort: FlexibleLesson = {
    id: 'stoic-10-voluntary-discomfort',
    slug: 'voluntary-discomfort',
    order: 5,
    title: 'Voluntary Discomfort',
    subtitle: 'Practice poverty to eliminate fear of it',
    description: "Seneca's practice of intentional hardship for lasting strength.",
    coreConceptTag: 'discomfort',
    xpReward: 20,
    estimatedMinutes: 4,
    thumbnail: { icon: '🧊', color: '#0ea5e9' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Seneca was one of the wealthiest men in ancient Rome. Yet regularly, he would practice poverty—sleeping on a hard bed, eating simple food, wearing rough clothes. Why would a rich man practice being poor?",
            subtext: "'Is this the condition that I feared?'",
            continueLabel: "Show me why",
            mood: 'curiosity',
        },
        {
            id: 'seneca-wisdom',
            type: 'insight',
            text: "'Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare, with coarse and rough dress, saying to yourself the while: Is this the condition that I feared?'",
            source: 'Seneca',
            style: 'quote',
            followUp: "The voluntary practice of discomfort removes the fear of involuntary hardship.",
            nextStepId: 'choose-discomfort',
        },
        {
            id: 'choose-discomfort',
            type: 'choice',
            question: 'Choose a discomfort to practice right now:',
            options: [
                {
                    id: 'cold',
                    label: 'Cold splash on face',
                    subtext: '30 seconds of cold water',
                    nextStepId: 'do-cold',
                },
                {
                    id: 'stillness',
                    label: 'Complete stillness',
                    subtext: '60 seconds without moving',
                    nextStepId: 'do-stillness',
                },
                {
                    id: 'discomfort-seat',
                    label: 'Discomfort seat',
                    subtext: 'Stand when you could sit comfortably',
                    nextStepId: 'do-stand',
                },
            ],
        },
        {
            id: 'do-cold',
            type: 'goDoIt',
            sageMessage: "Go to your bathroom. Turn on cold water. Splash it on your face for 30 seconds. Feel the shock. Let it remind you that you can handle discomfort. Then return.",
            sageSubtext: "Voluntary hardship builds involuntary strength.",
            dismissLabel: "I'm going",
            returnStepId: 'return-check',
        },
        {
            id: 'do-stillness',
            type: 'timer',
            title: 'Complete Stillness',
            instruction: "Sit or stand completely still. No scratching, no adjusting, no fidgeting. Your body will want to move. Resist for 60 seconds.",
            durationSeconds: 60,
            timerStyle: 'focus',
            guidanceMessages: [
                'The urge to move is not a command.',
                'You are in control.',
                'Discomfort is temporary. The lesson lasts.',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'do-stand',
            type: 'timer',
            title: 'Stand When You Could Sit',
            instruction: "Stand up right now. Remain standing for the next 60 seconds when you could easily be comfortable. Notice the discomfort. Choose it anyway.",
            durationSeconds: 60,
            timerStyle: 'focus',
            guidanceMessages: [
                "Comfort is the enemy of growth.",
                'This small discomfort builds strength.',
                'You are choosing this. That is power.',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'return-check',
            type: 'returnConfirm',
            welcomeMessage: 'Welcome back.',
            confirmationQuestion: 'Did you practice the cold discomfort?',
            completedOption: {
                label: 'Yes, I did it',
                nextStepId: 'reflection',
            },
            didNotCompleteOption: {
                label: "I didn't do it",
                message: "The resistance tells you something about your relationship with discomfort. What held you back?",
                nextStepId: 'reflection',
            },
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How did it feel to voluntarily choose discomfort? What does this teach you about your relationship with comfort?",
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
                    "The person who can choose discomfort fears nothing. You just proved you can choose it. This is freedom.",
                    "Comfort is a slow poison when it becomes the only thing you seek. By choosing hard, you stay sharp while others grow soft.",
                    "Seneca was wealthy beyond imagination—yet he practiced poverty regularly. He knew that dependence on comfort is a vulnerability.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 2: ACTION
// ─────────────────────────────────────────────────────────────────────────────

export const stoic_chapter2_Action: FlexibleChapter = {
    id: 'chapter-stoic-action',
    slug: 'action',
    name: 'Action',
    subtitle: 'Do what must be done',
    description: "Seeing clearly is not enough. The Stoics demanded right action—doing your duty, acting with virtue, and contributing to the common good.",
    order: 2,
    iconName: 'Sword',
    lessons: [
        lesson6_DoTheWork,
        lesson7_ObstacleWay,
        lesson8_ReserveClause,
        lesson9_ActImmediately,
        lesson10_VoluntaryDiscomfort,
    ],
};

export default stoic_chapter2_Action;
