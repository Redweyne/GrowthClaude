// ═══════════════════════════════════════════════════════════════════════════
// STOICISM - CHAPTER 3: WILL
// Accept what must be accepted
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 11: AMOR FATI - LOVE YOUR FATE
// ─────────────────────────────────────────────────────────────────────────────

const lesson11_AmorFati: FlexibleLesson = {
    id: 'stoic-11-amor-fati',
    slug: 'amor-fati',
    order: 1,
    title: 'Amor Fati',
    subtitle: 'Love your fate',
    description: 'The ultimate Stoic practice: not just accepting what happens, but embracing it.',
    coreConceptTag: 'amor-fati',
    xpReward: 22,
    estimatedMinutes: 5,
    thumbnail: { icon: '💜', color: '#a855f7' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something happened that you wished hadn't. A loss. A rejection. A path that closed. You've accepted it, maybe. But can you go further? Can you EMBRACE it—even love it—as necessary to who you're becoming?",
            subtext: "This is the hardest practice. And the most liberating.",
            continueLabel: "I want to learn this",
            mood: 'curiosity',
        },
        {
            id: 'nietzsche-wisdom',
            type: 'insight',
            text: "'My formula for greatness in a human being is amor fati: that one wants nothing to be different, not forward, not backward, not in all eternity. Not merely bear what is necessary, still less conceal it—but love it.'",
            source: 'Friedrich Nietzsche',
            style: 'quote',
            followUp: "Amor fati—love of fate. Not tolerance. Not acceptance. LOVE.",
            nextStepId: 'identify-fate',
        },
        {
            id: 'identify-fate',
            type: 'commitment',
            prompt: "Think of something that happened to you that you wished had been different. Something you may have accepted but haven't yet embraced.",
            placeholder: "I wish... hadn't happened. I'm still not at peace with...",
            minimumWords: 10,
            continueLabel: "This is my struggle",
            storeAs: 'struggle',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Embracing Fate',
            instructions: [
                'Bring this event clearly to mind.',
                'Feel the resistance—the wish that it were different.',
                "Now imagine: what if this HAD to happen?",
                "What if it's secretly the best thing that could have happened?",
                "What if it's creating who you need to become?",
                "Say to yourself: 'This had to happen exactly as it did.'",
                "'I accept it fully. I embrace it.'",
                "Feel the shift from resistance to embrace.",
            ],
            paceSeconds: 4,
            style: 'grounding',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What shifts when you move from acceptance to embrace? How might this event be necessary to your story?",
            minimumWords: 15,
            encouragements: [
                'What has this taught you?',
                'Who are you becoming because of it?',
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
                    "Amor fati isn't about liking everything that happens. It's about stopping the war with reality—and winning by surrendering the fight.",
                    "What you resist persists. What you embrace loses its power to hurt you. You just practiced the ultimate freedom.",
                    "This is the final Stoic skill: not just tolerating fate, but loving it as if you chose it yourself. That is power nothing can take from you.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 12: MEMENTO MORI - REMEMBER DEATH
// ─────────────────────────────────────────────────────────────────────────────

const lesson12_MementoMori: FlexibleLesson = {
    id: 'stoic-12-memento-mori',
    slug: 'memento-mori',
    order: 2,
    title: 'Memento Mori',
    subtitle: 'Remember you will die',
    description: "Use death as your advisor for how to live.",
    coreConceptTag: 'memento-mori',
    xpReward: 25,
    estimatedMinutes: 6,
    thumbnail: { icon: '⏳', color: '#78716c' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "We live as if we have infinite time. We postpone. We assume tomorrow. We waste the present on what doesn't matter. The Stoics kept reminders of death on their desks—not to be morbid, but to be alive.",
            subtext: "'You could leave life right now. Let that determine what you do and say and think.' — Marcus Aurelius",
            continueLabel: "I'm ready to face this",
            mood: 'tension',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'It is not death that a man should fear, but he should fear never beginning to live. Think of yourself as dead. You have lived your life. Now take what is left and live it properly.'",
            source: 'Marcus Aurelius',
            style: 'quote',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'One Year Left',
            instructions: [
                'Take a moment to be still.',
                'Imagine you just learned you have one year left to live.',
                'One year. 365 days.',
                'What would you STOP doing immediately?',
                'What would you START doing that you have been postponing?',
                "Who would you tell you love them?",
                'What would suddenly matter—and what would fall away?',
                'Feel the clarity that death provides.',
            ],
            paceSeconds: 5,
            style: 'grounding',
            nextStepId: 'stop-doing',
        },
        {
            id: 'stop-doing',
            type: 'commitment',
            prompt: "If you had one year left, what would you STOP doing immediately?",
            placeholder: "I would stop... I'd quit spending time on...",
            minimumWords: 10,
            continueLabel: "I know what I'd stop",
            storeAs: 'stop',
            nextStepId: 'start-doing',
        },
        {
            id: 'start-doing',
            type: 'commitment',
            prompt: "What would you START doing that you've been postponing?",
            placeholder: "I would finally... I'd start...",
            minimumWords: 10,
            continueLabel: "I know what I'd start",
            storeAs: 'start',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "You DO have limited time—you just don't know how limited. How does remembering death clarify what actually matters to you?",
            minimumWords: 20,
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
                    "Memento mori is not morbid—it is the ultimate clarifier. Death strips away everything unimportant and reveals what you truly value. You just used it as an advisor.",
                    "Most people sleepwalk through life because they assume they have infinite time. You just woke up. The question now: will you live differently?",
                    "Steve Jobs said: 'Remembering that I'll be dead soon is the most important tool I've ever encountered to help me make the big choices in life.' You now have the same tool.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 13: PREMEDITATIO MALORUM
// ─────────────────────────────────────────────────────────────────────────────

const lesson13_PremeditatioMalorum: FlexibleLesson = {
    id: 'stoic-13-premeditatio-malorum',
    slug: 'premeditatio-malorum',
    order: 3,
    title: 'Premeditatio Malorum',
    subtitle: 'Premeditation of evils',
    description: "Rehearse hardship in your mind so it cannot surprise you.",
    coreConceptTag: 'negative-visualization',
    xpReward: 22,
    estimatedMinutes: 5,
    thumbnail: { icon: '🛡️', color: '#dc2626' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something you fear hangs over you. A possible failure. A potential rejection. A thing that might go terribly wrong. The fear steals your peace long before the thing actually happens—if it ever does.",
            subtext: "'We suffer more in imagination than in reality.' — Seneca",
            continueLabel: "Show me how to face it",
            mood: 'tension',
        },
        {
            id: 'seneca-wisdom',
            type: 'insight',
            text: "'What I advise you to do is not to be unhappy before the crisis comes; since it may be that the dangers before which you paled will never come upon you. Rehearse them in your mind, so that if they come, they hold no terror.'",
            source: 'Seneca',
            style: 'quote',
            nextStepId: 'name-fear',
        },
        {
            id: 'name-fear',
            type: 'commitment',
            prompt: "What is something you fear might happen? Something that generates anxiety when you think about it?",
            placeholder: "I fear that... I'm anxious about the possibility of...",
            minimumWords: 8,
            continueLabel: "This is my fear",
            storeAs: 'fear',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Face the Worst',
            instructions: [
                'Now visualize this fear happening.',
                'In full detail. The worst case.',
                "See it clearly. Don't look away.",
                'But also see yourself SURVIVING it.',
                'You are not destroyed. You adapt.',
                'You find a way forward.',
                'Even from the worst case, you rise.',
                'The fear is real. But so is your ability to endure.',
            ],
            paceSeconds: 4,
            style: 'fearless',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How did pre-imagining the worst change your fear of it? Could you survive what you're afraid of?",
            minimumWords: 15,
            encouragements: [
                'Fear thrives in the shadows.',
                'What happens when you look directly at it?',
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
                    "You just practiced what Navy SEALs, astronauts, and surgeons do before high-stakes moments. Mental rehearsal builds real courage.",
                    "The Stoics didn't practice this to be pessimistic—they practiced it to be fearless. A warrior who has rehearsed battle is calm when it comes.",
                    "Fear thrives in the undefined. By looking directly at what you fear, you drain its power. The worst case is survivable. Now you know.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 14: ETERNAL RECURRENCE
// ─────────────────────────────────────────────────────────────────────────────

const lesson14_EternalRecurrence: FlexibleLesson = {
    id: 'stoic-14-eternal-recurrence',
    slug: 'eternal-recurrence',
    order: 4,
    title: 'The Eternal Recurrence',
    subtitle: 'Live so that you would choose this life again',
    description: "Nietzsche's ultimate test for a life well-lived.",
    coreConceptTag: 'eternal-recurrence',
    xpReward: 22,
    estimatedMinutes: 5,
    thumbnail: { icon: '♾️', color: '#8b5cf6' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "What if you had to live this exact life—with all its choices, challenges, and ordinary moments—infinite times over, for all eternity? Would that thought fill you with dread... or with joy?",
            subtext: "This question is the ultimate test of whether you're living rightly.",
            continueLabel: "Test me",
            mood: 'curiosity',
        },
        {
            id: 'nietzsche-thought',
            type: 'insight',
            text: "'What if a demon crept after you one day and said: This life as you live it now, you will have to live again, innumerable times; and there will be nothing new in it. Would you throw yourself down and curse? Or would you answer: Never have I heard anything more divine?'",
            source: 'Friedrich Nietzsche',
            style: 'quote',
            nextStepId: 'today-question',
        },
        {
            id: 'today-question',
            type: 'commitment',
            prompt: "If you had to live THIS EXACT DAY—today—over and over for eternity, what ONE thing would you change right now to make it worth repeating?",
            placeholder: "To make today worth repeating eternally, I would change...",
            minimumWords: 10,
            continueLabel: "I know what I'd change",
            storeAs: 'change',
            nextStepId: 'do-it',
        },
        {
            id: 'do-it',
            type: 'goDoIt',
            sageMessage: "Go make that change. Right now. Not as a thought experiment—as reality. Change this day so that if you had to live it forever, it would be acceptable. I'll be here.",
            sageSubtext: "The eternal recurrence is not philosophy. It is a call to action.",
            dismissLabel: "I'll make the change now",
            returnStepId: 'return-check',
        },
        {
            id: 'return-check',
            type: 'returnConfirm',
            welcomeMessage: 'Welcome back.',
            confirmationQuestion: 'Did you make the change?',
            completedOption: {
                label: 'Yes, I changed something',
                nextStepId: 'reflection',
            },
            didNotCompleteOption: {
                label: "Not yet",
                message: "The opportunity isn't gone. But ask yourself: if not now, when?",
                nextStepId: 'reflection',
            },
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What did you change (or what do you intend to change)? What does the eternal recurrence reveal about how you want to live?",
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
                    "This question cuts through all excuses. If this day will repeat forever, it better be a day worth living. You just made it more so.",
                    "Most people postpone their real life for 'someday.' The eternal recurrence forces you to live NOW. Not tomorrow. Today.",
                ],
                byCompletion: {
                    completed: [
                        "You didn't just think about the eternal recurrence—you lived it. You changed today. That's the difference between philosophy and transformation.",
                    ],
                    notCompleted: [
                        "The thought experiment only works if it leads to action. Perhaps the message is that even your resistance is part of what needs to change.",
                    ],
                },
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LESSON 15: THE INNER CITADEL
// ─────────────────────────────────────────────────────────────────────────────

const lesson15_InnerCitadel: FlexibleLesson = {
    id: 'stoic-15-inner-citadel',
    slug: 'inner-citadel',
    order: 5,
    title: 'The Inner Citadel',
    subtitle: 'Your fortress within',
    description: "Build an unassailable sanctuary inside yourself that nothing external can breach.",
    coreConceptTag: 'inner-citadel',
    xpReward: 30,
    estimatedMinutes: 6,
    thumbnail: { icon: '🏰', color: '#6366f1' },
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "The world is chaos. Things happen that you cannot control. People disappoint. Plans fail. But within you, there is a place that nothing can touch. A fortress of mind that no external storm can breach. The Stoics called it the Inner Citadel.",
            subtext: "You have completed the journey. Now you build the fortress.",
            continueLabel: "Show me the inner citadel",
            mood: 'hope',
        },
        {
            id: 'aurelius-wisdom',
            type: 'insight',
            text: "'Retreat into yourself. The rational mind that rules has this nature: it is content with itself when it acts justly, and so gains tranquility. Nowhere can a person find a more peaceful retreat than in their own mind. Grant yourself this retreat often and renew yourself.'",
            source: 'Marcus Aurelius',
            sourceBook: 'Meditations',
            style: 'quote',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Build Your Citadel',
            instructions: [
                'Breathe deeply. Let yourself settle.',
                'Imagine a fortress. YOUR fortress.',
                'It exists within you. Always has.',
                'What does it look like? See the walls.',
                'This is where no external event can reach.',
                'Here, you are safe. Here, you choose your response.',
                'Feel its solidity. Its permanence.',
                'External storms rage. Inside, there is peace.',
                'This citadel is always available to you.',
                'All you have to do is retreat within.',
            ],
            paceSeconds: 4,
            style: 'grounding',
            nextStepId: 'describe-citadel',
        },
        {
            id: 'describe-citadel',
            type: 'commitment',
            prompt: "Describe your inner citadel. What does it look like? What does it feel like inside?",
            placeholder: "My inner citadel looks like... When I'm there, I feel...",
            minimumWords: 15,
            continueLabel: "I've built my fortress",
            storeAs: 'citadel',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "You have completed the Stoicism journey. What is the single most important lesson you'll carry forward? How will you live differently?",
            minimumWords: 25,
            encouragements: [
                'What has transformed in you?',
                'What practice will you continue?',
                'Who are you now compared to when you started?',
            ],
            nextStepId: 'reward',
        },
        {
            id: 'reward',
            type: 'reward',
            customMessage: "You have completed Stoicism. The Inner Citadel is yours.",
            nextStepId: 'mentor',
        },
        {
            id: 'mentor',
            type: 'mentor',
            responses: {
                default: [
                    "You have completed the first journey of Stoicism. The outer world will always be chaotic. But now you have built a fortress within that nothing can breach.",
                    "This is what Marcus Aurelius meant when he ruled by day and wrote philosophy by night. He was retreating to his inner citadel—as you now can too.",
                    "The world cannot take what it does not give. Your peace, your clarity, your freedom—these were always yours. Now you know where to find them. Return to your citadel whenever you need.",
                ],
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ASSEMBLE CHAPTER 3: WILL
// ─────────────────────────────────────────────────────────────────────────────

export const stoic_chapter3_Will: FlexibleChapter = {
    id: 'chapter-stoic-will',
    slug: 'will',
    name: 'Will',
    subtitle: 'Accept what must be accepted',
    description: "The final discipline: acceptance. Not passive resignation, but active agreement with reality. Learn to embrace whatever happens as necessary and good.",
    order: 3,
    iconName: 'Mountain',
    lessons: [
        lesson11_AmorFati,
        lesson12_MementoMori,
        lesson13_PremeditatioMalorum,
        lesson14_EternalRecurrence,
        lesson15_InnerCitadel,
    ],
};

export default stoic_chapter3_Will;
