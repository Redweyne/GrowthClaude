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
    exercises: [
        {
            id: 'ex-11-scenario',
            type: 'scenario',
            title: 'The Annoying Colleague',
            content: {
                situation: "Your colleague constantly brags about their achievements, dominates conversations, and makes sure everyone knows about their successes. It drives you crazy. You find yourself thinking about how insufferable they are even when you're not at work.",
                question: "Using the mirror effect, what might this strong reaction be revealing about YOU? What shadow or fear might this person be triggering?",
                hints: [
                    "What might you fear about your own relationship with success?",
                    "Is there a part of you that also wants recognition but suppresses it?",
                    "What would it mean if you could be at peace with their behavior?"
                ]
            }
        },
        {
            id: 'ex-11-quote',
            type: 'quote',
            title: 'Jung on Shadow',
            content: {
                quote: "Everything that irritates us about others can lead us to an understanding of ourselves. Until you make the unconscious conscious, it will direct your life and you will call it fate.",
                author: "Carl Jung",
                source: "Psychology and Alchemy",
                reflectionPrompt: "What quality in others consistently triggers a strong reaction in you? What might that say about something unexamined in yourself?"
            }
        },
        {
            id: 'ex-11-application',
            type: 'application',
            title: 'The Mirror Practice',
            content: {
                instruction: "Tomorrow, when someone irritates you, pause and ask: 'What is this person showing me about myself? What am I projecting onto them?'",
                planPrompt: "Who are you likely to interact with tomorrow that often triggers you? What might they be mirroring?",
                examples: [
                    "When my critical parent annoys me, maybe I'm avoiding my own critical inner voice",
                    "When lazy people frustrate me, maybe I fear laziness in myself",
                    "When someone's confidence bothers me, maybe I'm suppressing my own"
                ]
            }
        },
        {
            id: 'ex-11-anchor',
            type: 'anchor',
            title: 'The Mirror Touch',
            content: {
                gesture: "Touch your fingertips together, as if your hands are reflecting each other in a mirror",
                meaning: "Each hand mirrors the other. What you see out there reflects what exists in here. This gesture reminds you that triggers are teachers.",
                breathPattern: "Breathe in and press fingertips together. Breathe out and acknowledge: what I react to reveals what I need to see in myself.",
                repetitions: 3
            }
        },
        {
            id: 'ex-11-reframe',
            type: 'reframe',
            title: 'From Blame to Mirror',
            content: {
                challengePrompt: "Who is someone that really gets under your skin? What specific behavior or quality do you find most frustrating about them?",
                reframeGuide: "Now look in the mirror. Where might this quality exist in you (perhaps in a different form)? Or what fear does their behavior trigger?",
                example: {
                    before: "My sister-in-law is so fake. She's always putting on a perfect image for social media while her real life is a mess. It's so dishonest and it drives me insane.",
                    after: "My strong reaction to her 'fakeness' might reveal my own discomfort with self-promotion. Maybe I also curate how I present myself but judge her for doing it more visibly. Or maybe I fear people seeing through my own presented image. Her behavior isn't the problem - my reaction is data about me."
                }
            }
        }
    ],
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
    exercises: [
        {
            id: 'ex-12-scenario',
            type: 'scenario',
            title: 'The Comfortable Lie',
            content: {
                situation: "Your friend asks your honest opinion about their business idea. You can see major problems with it, but they're really excited and have already invested money. They specifically say 'Please be honest, I need real feedback' - but you sense they want validation.",
                question: "What would radical honesty look like here? How do you balance truth with kindness?",
                hints: [
                    "What's the cost to them if you're not honest?",
                    "What's the cost to your relationship if you are?",
                    "How can truth be delivered with compassion?"
                ]
            }
        },
        {
            id: 'ex-12-quote',
            type: 'quote',
            title: 'Blanton on Lies',
            content: {
                quote: "Lying is the major source of all human stress. I consider lying to be any misrepresentation of what one knows to be the truth at the time. Each time we lie we build a thicker wall between ourselves and others.",
                author: "Brad Blanton",
                source: "Radical Honesty",
                reflectionPrompt: "What lie (even a small one) are you currently maintaining? What energy does it cost you?"
            }
        },
        {
            id: 'ex-12-application',
            type: 'application',
            title: 'The Micro-Truth',
            content: {
                instruction: "Tomorrow, catch yourself about to tell a small social lie - 'I'm fine', 'I'd love to', 'No problem' - and instead say something more true.",
                planPrompt: "What situation tomorrow might tempt you into a small lie? What's the more honest thing you could say instead?",
                examples: [
                    "Instead of 'I'm fine', try 'Actually, it's been a tough week but I'm working through it'",
                    "Instead of 'I'd love to', try 'I appreciate the invite. Let me check if I have the energy'",
                    "Instead of 'No problem', try 'It was extra work, but I was glad to help'"
                ]
            }
        },
        {
            id: 'ex-12-anchor',
            type: 'anchor',
            title: 'The Open Throat',
            content: {
                gesture: "Place your hand gently on your throat, then move it forward as if releasing something",
                meaning: "The throat is where truth gets stuck. This gesture represents releasing what you've been holding back - letting truth flow freely.",
                breathPattern: "Breathe in with hand on throat, feeling what's trapped there. Breathe out as you move your hand forward, releasing truth into the world.",
                repetitions: 3
            }
        },
        {
            id: 'ex-12-reframe',
            type: 'reframe',
            title: 'From Polite to True',
            content: {
                challengePrompt: "What truth have you been withholding from someone - or yourself - to keep the peace? What have you been too 'polite' to say?",
                reframeGuide: "Now write what radical honesty would actually sound like. Not brutal, but true. What would you say if you stopped managing their feelings?",
                example: {
                    before: "I keep agreeing to help my brother even though it exhausts me and he never reciprocates. I tell myself it's fine because family helps family.",
                    after: "The honest truth: I feel used. I love my brother, but this one-way dynamic isn't working for me anymore. What I need to say: 'I want to help you, but I've been overextending myself. I need us to find a more balanced way to support each other.'"
                }
            }
        }
    ],
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
    exercises: [
        {
            id: 'ex-13-scenario',
            type: 'scenario',
            title: 'The Boundary Test',
            content: {
                situation: "A good friend asks you to help them move this weekend. You're exhausted, have barely recovered from a brutal work week, and desperately need rest. But they've helped you before, and saying no feels selfish. You can already feel the guilt forming.",
                question: "How would you set a boundary with grace? What could you say that's both kind and honest?",
                hints: [
                    "Can you decline without lengthy justification?",
                    "Is there a partial yes that works for both of you?",
                    "What happens if you say yes when you mean no?"
                ]
            }
        },
        {
            id: 'ex-13-quote',
            type: 'quote',
            title: 'On Protection',
            content: {
                quote: "Daring to set boundaries is about having the courage to love ourselves even when we risk disappointing others. We can't base our own worthiness on others' approval.",
                author: "Brené Brown",
                source: "The Gifts of Imperfection",
                reflectionPrompt: "Where have you been trading your well-being for others' approval? What boundary would your healthiest self set?"
            }
        },
        {
            id: 'ex-13-application',
            type: 'application',
            title: 'The Graceful No',
            content: {
                instruction: "Tomorrow, practice setting one small boundary. It doesn't need to be dramatic - just one place where you honor your needs instead of automatically saying yes.",
                planPrompt: "What request might come up tomorrow where you'd normally say yes against your better judgment? How could you decline gracefully?",
                examples: [
                    "If asked to stay late: 'I need to protect my evening tonight. I can help first thing tomorrow.'",
                    "If invited somewhere I don't want to go: 'Thank you for including me. I'm going to pass this time.'",
                    "If asked to do something I don't have capacity for: 'I wish I could help, but I'm at capacity right now.'"
                ]
            }
        },
        {
            id: 'ex-13-anchor',
            type: 'anchor',
            title: 'The Shield',
            content: {
                gesture: "Cross your arms briefly, then uncross and open them - from protection to openness",
                meaning: "This gesture shows that boundaries aren't walls. You protect yourself (crossed arms), then open to genuine connection (open arms). Boundaries enable love by protecting energy.",
                breathPattern: "Breathe in and cross your arms, honoring your needs. Breathe out and open them, available for authentic connection.",
                repetitions: 3
            }
        },
        {
            id: 'ex-13-reframe',
            type: 'reframe',
            title: 'From Guilt to Gift',
            content: {
                challengePrompt: "What boundary do you need to set but feel too guilty to enforce? What 'yes' has been costing you?",
                reframeGuide: "Now reframe this boundary as a gift - not just to yourself, but to the relationship. How does your honest 'no' serve everyone better than your resentful 'yes'?",
                example: {
                    before: "My mom calls every day and the conversations drain me, but I can't tell her to call less because she'll be hurt.",
                    after: "Setting a boundary with my mom - maybe calls three times a week instead of daily - isn't rejection, it's protection of our relationship. My resentful 'yes' makes me dread her calls. My honest boundary means when we do talk, I'm actually present. The boundary is a gift to both of us."
                }
            }
        }
    ],
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
    exercises: [
        {
            id: 'ex-14-scenario',
            type: 'scenario',
            title: 'The Heated Disagreement',
            content: {
                situation: "You're in a heated argument with your partner about something important - maybe finances, or how to raise kids, or a life decision. Both of you are talking past each other, getting louder, and neither feels heard. The frustration is escalating.",
                question: "How could you apply 'seek first to understand' to break this cycle? What would it look like to truly hear them before demanding to be heard?",
                hints: [
                    "What if you stopped defending and started asking questions?",
                    "Can you repeat their position in a way they'd agree with?",
                    "What fear or need might be driving their stance?"
                ]
            }
        },
        {
            id: 'ex-14-quote',
            type: 'quote',
            title: 'Covey on Understanding',
            content: {
                quote: "Most people do not listen with the intent to understand; they listen with the intent to reply. They're either speaking or preparing to speak. They're filtering everything through their own paradigms.",
                author: "Stephen Covey",
                source: "The 7 Habits of Highly Effective People",
                reflectionPrompt: "Think of a recent disagreement. Were you listening to understand, or listening to prepare your response?"
            }
        },
        {
            id: 'ex-14-application',
            type: 'application',
            title: 'The Understanding First',
            content: {
                instruction: "Tomorrow, in one conversation, try this: before responding, summarize what the other person said in a way they'd agree with. Ask 'Did I understand you correctly?' before sharing your view.",
                planPrompt: "What conversation tomorrow could benefit from this approach? Who do you need to understand better before being understood?",
                examples: [
                    "In the meeting, I'll paraphrase the concern before responding with my solution",
                    "When my partner brings up an issue, I'll ask clarifying questions before explaining my side",
                    "If someone disagrees with me, I'll first say 'Help me understand your perspective'"
                ]
            }
        },
        {
            id: 'ex-14-anchor',
            type: 'anchor',
            title: 'The Cup Empty',
            content: {
                gesture: "Cup your hands together, then slowly turn them over and open them - emptying your cup",
                meaning: "You cannot fill a cup that's already full. To truly understand someone, you must first empty your cup of your own agenda, defenses, and preconceptions.",
                breathPattern: "Breathe in, holding your cup full of your own thoughts. Breathe out as you empty the cup, making space for their perspective.",
                repetitions: 3
            }
        },
        {
            id: 'ex-14-reframe',
            type: 'reframe',
            title: 'From Opponent to Puzzle',
            content: {
                challengePrompt: "Think of someone you've been in conflict with or simply don't understand. What's your current story about why they're wrong or difficult?",
                reframeGuide: "Now put on their shoes completely. Write their perspective as if you were their defense attorney - making the best possible case for their position.",
                example: {
                    before: "My manager is a micromanager who doesn't trust anyone. He's always checking up on my work and it's insulting.",
                    after: "As my manager: I was burned badly when a project failed because I wasn't monitoring closely enough. My job is on the line, and I have no visibility into whether things are on track unless I check. What looks like micromanagement to my team might just be my anxiety about being responsible for outcomes I can't see. Maybe what I need isn't less involvement but more natural ways to feel confident things are on track."
                }
            }
        }
    ],
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
    exercises: [
        {
            id: 'ex-15-scenario',
            type: 'scenario',
            title: 'The Betrayal',
            content: {
                situation: "A close friend betrayed your trust five years ago. They've apologized, tried to make amends, but you've kept your distance. You know the resentment is affecting you - it comes up in other relationships, you compare new friends to them, you're guarded. But forgiving feels like saying what they did was okay.",
                question: "How do you reconcile forgiveness with the reality that what they did was wrong? How is forgiveness FOR YOU, not FOR THEM?",
                hints: [
                    "What is unforgiveness actually costing you?",
                    "How is forgiveness different from reconciliation?",
                    "Can you release the resentment without approving the action?"
                ]
            }
        },
        {
            id: 'ex-15-quote',
            type: 'quote',
            title: 'Mandela on Chains',
            content: {
                quote: "Resentment is like drinking poison and then hoping it will kill your enemies. As I walked out the door toward the gate that would lead to my freedom, I knew if I didn't leave my bitterness and hatred behind, I'd still be in prison.",
                author: "Nelson Mandela",
                source: "Long Walk to Freedom",
                reflectionPrompt: "What bitterness are you carrying that's keeping YOU imprisoned? What would it feel like to walk free?"
            }
        },
        {
            id: 'ex-15-application',
            type: 'application',
            title: 'The Small Release',
            content: {
                instruction: "Tomorrow, practice forgiveness on something small - the driver who cut you off, the rude cashier, the friend who was insensitive. Notice the resentment, then consciously choose to release it.",
                planPrompt: "What small grievance could you practice releasing tomorrow? What phrase could you use to remind yourself to let go?",
                examples: [
                    "When annoyed by strangers, I'll think: 'I release you. I don't know your story.'",
                    "When slighted by a friend, I'll think: 'I won't let this rent space in my head.'",
                    "When remembering old wounds, I'll think: 'I choose my peace over their punishment.'"
                ]
            }
        },
        {
            id: 'ex-15-anchor',
            type: 'anchor',
            title: 'The Cord Cut',
            content: {
                gesture: "Clasp your hands together tightly, then slowly pull them apart as if breaking a cord",
                meaning: "Resentment is a cord that binds you to the person who hurt you. Forgiveness cuts that cord. This gesture represents releasing the energetic tie that keeps you connected to pain.",
                breathPattern: "Breathe in with hands clasped, feeling the tie to resentment. Breathe out as you slowly pull them apart, cutting the cord. You are free.",
                repetitions: 3
            }
        },
        {
            id: 'ex-15-reframe',
            type: 'reframe',
            title: 'From Prisoner to Free',
            content: {
                challengePrompt: "Who are you still holding resentment toward? What did they do that you haven't been able to release?",
                reframeGuide: "Now rewrite forgiveness not as something they deserve, but as something you need. What would your life look like without this weight? What energy would be freed?",
                example: {
                    before: "My father left when I was young. He doesn't deserve my forgiveness. He made his choice and I've lived with the consequences my whole life.",
                    after: "My father's choice hurt me deeply. Whether he deserves forgiveness is irrelevant - I deserve freedom. Every day I carry this resentment, I'm still the abandoned child waiting for him to make it right. He can't. Only I can release myself. Forgiveness isn't saying what he did was okay. It's saying I refuse to let that moment define the rest of my life. I take back my power by dropping this weight."
                }
            }
        }
    ],
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
