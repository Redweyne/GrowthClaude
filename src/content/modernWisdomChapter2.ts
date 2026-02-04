// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2: RESILIENCE - Becoming Unbreakable
// ═══════════════════════════════════════════════════════════════════════════

import type { FlexibleLesson, FlexibleChapter } from '@/types/lessons';

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
    exercises: [
        {
            id: 'ex-6-scenario',
            type: 'scenario',
            title: 'The Public Failure',
            content: {
                situation: "You gave a presentation at work that bombed. You stumbled over your words, forgot key points, and you could see people checking their phones. Your manager's feedback was polite but clearly disappointed. You feel humiliated and want to avoid presenting forever.",
                question: "Using the Comeback Formula (Feel, Learn, Rise), how would you process this setback and turn it into fuel?",
                hints: [
                    "Step 1: What would 'feeling it fully' look like?",
                    "Step 2: What lesson is hiding in this failure?",
                    "Step 3: What specific comeback action would you take?"
                ]
            }
        },
        {
            id: 'ex-6-quote',
            type: 'quote',
            title: 'Jordan on Failure',
            content: {
                quote: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. 26 times I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.",
                author: "Michael Jordan",
                source: "Nike Commercial, 1997",
                reflectionPrompt: "What's a failure in your past that you now realize was essential to who you've become?"
            }
        },
        {
            id: 'ex-6-application',
            type: 'application',
            title: 'The Mini Comeback',
            content: {
                instruction: "Tomorrow, intentionally notice any small setback or frustration. Practice the full formula: 30 seconds to feel it, ask what it's teaching you, then immediately declare one small action forward.",
                planPrompt: "What type of setback might you encounter tomorrow? How will you remind yourself to apply the formula?",
                examples: [
                    "If my code has a bug - feel the frustration, learn what I missed, write one test to prevent it",
                    "If someone criticizes my work - feel the sting, find the valid kernel, make one improvement",
                    "If plans fall through - feel the disappointment, see what I can learn, make a new plan"
                ]
            }
        },
        {
            id: 'ex-6-anchor',
            type: 'anchor',
            title: 'The Reset Strike',
            content: {
                gesture: "Make a fist with your dominant hand, then open it completely - fingers spread wide",
                meaning: "The fist holds the pain. The open hand releases it and reaches for what's next. This is the physical motion of the comeback - acknowledge, then move.",
                breathPattern: "Breathe in and make a fist, feeling the setback. Breathe out and open your hand, releasing it and reaching forward.",
                repetitions: 3
            }
        },
        {
            id: 'ex-6-reframe',
            type: 'reframe',
            title: 'From Failure to Chapter One',
            content: {
                challengePrompt: "What recent setback or failure are you still carrying? Something that still stings when you think about it?",
                reframeGuide: "Now rewrite this as Chapter One of your comeback story. If this setback is the beginning, what does the next chapter look like?",
                example: {
                    before: "I got passed over for promotion and I feel like my career is stuck. All that hard work for nothing.",
                    after: "Chapter One: I got passed over for promotion. This is where I learned that working hard isn't enough - I need to make my work visible. Chapter Two begins now: I schedule a meeting with my manager to understand exactly what I need to do differently, and I start documenting my wins weekly."
                }
            }
        }
    ],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Something didn't go the way you wanted. A rejection. A failure. A door that slammed shut. The sting is real. But what if this moment is exactly where champions are made?",
            subtext: "Every comeback story starts with a setback.",
            bridgeQuestion: "Think of a recent disappointment or failure you're carrying.",
            continueLabel: "I have one in mind",
            mood: 'tension',
        },
        {
            id: 'name-setback',
            type: 'commitment',
            prompt: "Name your setback. What happened that didn't go as planned?",
            placeholder: "I got rejected from... I failed at... I lost...",
            minimumWords: 5,
            guidanceHints: [
                'Be specific about what happened',
                'Name the disappointment honestly',
            ],
            continueLabel: 'This is my setback',
            storeAs: 'setback',
            nextStepId: 'step-one',
        },
        {
            id: 'step-one',
            type: 'insight',
            text: "STEP 1: FEEL IT FULLY. Most people either suppress their pain or drown in it. The comeback demands a third way: feel it completely for 60 seconds, then move forward. Suppressed emotions become invisible chains. Processed emotions become fuel.",
            style: 'principle',
            followUp: "Let's practice this now.",
            nextStepId: 'feel-timer',
        },
        {
            id: 'feel-timer',
            type: 'timer',
            title: 'Feel It Fully',
            instruction: "For 60 seconds, let yourself feel the disappointment completely. Don't fight it. Don't analyze it. Just feel it.",
            durationSeconds: 60,
            timerStyle: 'breathing',
            guidanceMessages: [
                'Let the feeling be exactly what it is.',
                'You are bigger than this moment.',
                'This too shall pass.',
            ],
            nextStepId: 'step-two',
        },
        {
            id: 'step-two',
            type: 'insight',
            text: "STEP 2: EXTRACT THE LESSON. Every setback contains a hidden curriculum. The question isn't 'Why did this happen TO me?' It's 'What is this teaching me FOR my future?'",
            style: 'principle',
            nextStepId: 'lesson-commit',
        },
        {
            id: 'lesson-commit',
            type: 'commitment',
            prompt: "What is this setback teaching you? What lesson can you extract?",
            placeholder: "This is teaching me that... I'm learning to... I now understand...",
            minimumWords: 10,
            guidanceHints: [
                'What would you do differently?',
                'What skill does this demand you develop?',
                'What assumption was proven wrong?',
            ],
            continueLabel: "I see the lesson",
            storeAs: 'lesson',
            nextStepId: 'step-three',
        },
        {
            id: 'step-three',
            type: 'insight',
            text: "STEP 3: DECLARE YOUR COMEBACK. A comeback isn't passive. It's a deliberate act of rising. You must name what you will do next—the specific action that transforms victim into victor.",
            style: 'revelation',
            nextStepId: 'comeback-commit',
        },
        {
            id: 'comeback-commit',
            type: 'commitment',
            prompt: "What is your comeback? What will you do in the next 48 hours to rise from this setback?",
            placeholder: "I will... My next step is... Tomorrow I'm going to...",
            minimumWords: 8,
            guidanceHints: [
                'Make it specific and time-bound',
                'Choose action over rumination',
                'What would your strongest self do?',
            ],
            continueLabel: "This is my comeback",
            storeAs: 'commitment',
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "How does it feel to have a comeback plan? What shifted in you during this process?",
            minimumWords: 15,
            encouragements: [
                'Notice the difference between before and now',
                'What power did you reclaim?',
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
                    "The comeback is always stronger than the setback. You've just proven you have what it takes: the willingness to feel, learn, and rise.",
                    "Most people let setbacks define them. You just used yours to refine you. That's the difference between those who fade and those who become legendary.",
                ],
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
    exercises: [
        {
            id: 'ex-7-scenario',
            type: 'scenario',
            title: 'The Comfort Trap',
            content: {
                situation: "Your friend has optimized their life for maximum comfort: food delivery, working from home, entertainment on demand. But they're increasingly anxious, can't handle small inconveniences, and feel fragile. They don't understand why they feel worse when their life is 'easier' than ever.",
                question: "Using today's wisdom about voluntary hardship, how would you explain what's happening and what they could do?",
                hints: [
                    "What happens to muscles that are never challenged?",
                    "Why might comfort be weakening instead of strengthening?",
                    "What small voluntary discomforts could rebuild their resilience?"
                ]
            }
        },
        {
            id: 'ex-7-quote',
            type: 'quote',
            title: 'Goggins on Callusing',
            content: {
                quote: "You have to build calluses on your brain just like how you build calluses on your hands. Callus your mind through pain and suffering.",
                author: "David Goggins",
                source: "Can't Hurt Me",
                reflectionPrompt: "Where in your life have you been avoiding discomfort? What mental callus might you be failing to develop?"
            }
        },
        {
            id: 'ex-7-application',
            type: 'application',
            title: 'Tomorrow\'s Hard Choice',
            content: {
                instruction: "Tomorrow, make ONE choice where you deliberately choose the harder path instead of the easier one. Take the stairs. Have the difficult conversation. Do the task you've been avoiding first.",
                planPrompt: "What specific hard choice will you make tomorrow? When will the opportunity arise?",
                examples: [
                    "When I want to hit snooze, I'll get up immediately",
                    "Instead of texting, I'll make the phone call I've been avoiding",
                    "I'll take a cold shower for the last 30 seconds"
                ]
            }
        },
        {
            id: 'ex-7-anchor',
            type: 'anchor',
            title: 'The Iron Grip',
            content: {
                gesture: "Squeeze both fists as tight as you can for 5 seconds, then release",
                meaning: "This brief voluntary discomfort - the squeeze, the burn, the release - represents choosing hard over easy. You just proved you can endure discomfort by choice.",
                breathPattern: "Breathe in and squeeze your fists tight. Hold. Feel the burn. Breathe out and release. You chose the hard path. You're still here.",
                repetitions: 3
            }
        },
        {
            id: 'ex-7-reframe',
            type: 'reframe',
            title: 'From Avoiding to Embracing',
            content: {
                challengePrompt: "What's something uncomfortable that you've been avoiding? A task, a conversation, a physical challenge?",
                reframeGuide: "Now rewrite this discomfort as training - an opportunity to callus your mind. How could seeking this discomfort make you stronger?",
                example: {
                    before: "I hate cold mornings and always delay getting out of my warm bed. I know it makes me rush and feel behind all day.",
                    after: "Getting out of bed into the cold is my daily training. Every morning I prove to myself that comfort doesn't control me. The 10 seconds of cold is the price I pay for mental strength. I'm building a callus against softness, one morning at a time."
                }
            }
        }
    ],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "You have a choice in life: seek comfort now and struggle later, or embrace struggle now and earn peace later. The paradox is this—the more you avoid discomfort, the more it controls you.",
            subtext: "The path to becoming unbreakable runs through voluntary hardship.",
            continueLabel: "I'm ready to understand",
            mood: 'curiosity',
        },
        {
            id: 'comfort-insight',
            type: 'insight',
            text: "What you don't use, you lose. Muscles that aren't challenged atrophy. A mind that's never tested becomes fragile. The Spartans, the Stoics, the Navy SEALs—all knew that voluntary discomfort is the vaccine against being broken by involuntary hardship.",
            source: 'Ancient Wisdom',
            style: 'principle',
            nextStepId: 'choice',
        },
        {
            id: 'choice',
            type: 'choice',
            question: 'Which type of discomfort challenge do you want to practice?',
            instruction: 'Choose what feels right for today',
            options: [
                {
                    id: 'physical',
                    label: 'Physical Discomfort',
                    subtext: 'Challenge the body: cold water, holding a plank, etc.',
                    nextStepId: 'physical-challenge',
                },
                {
                    id: 'mental',
                    label: 'Mental Discomfort',
                    subtext: 'Challenge the mind: silence, delayed gratification, etc.',
                    nextStepId: 'mental-challenge',
                },
            ],
        },
        {
            id: 'physical-challenge',
            type: 'goDoIt',
            sageMessage: "Your challenge: Go splash cold water on your face for 30 seconds. Or hold a plank until it burns. Or take 20 stairs instead of the elevator. Choose physical discomfort NOW. The small act of choosing hard when easy is available rewires who you are.",
            sageSubtext: "Discomfort chosen is discomfort transformed into power.",
            dismissLabel: "I'm going to do it",
            returnStepId: 'return-check',
        },
        {
            id: 'mental-challenge',
            type: 'timer',
            title: 'The Silence Challenge',
            instruction: "Sit in complete silence for 90 seconds. No phone. No distraction. Just you and your thoughts. This is harder than it sounds—and that's the point.",
            durationSeconds: 90,
            timerStyle: 'presence',
            guidanceMessages: [
                'Your mind will resist. Let it.',
                'Boredom is not dangerous.',
                'Stillness is where strength is forged.',
            ],
            nextStepId: 'reflection',
        },
        {
            id: 'return-check',
            type: 'returnConfirm',
            welcomeMessage: 'You returned.',
            confirmationQuestion: 'Did you complete a physical discomfort challenge?',
            completedOption: {
                label: 'Yes, I did something hard',
                nextStepId: 'reflection',
            },
            didNotCompleteOption: {
                label: "I didn't do it",
                message: "Honesty is its own form of courage. The challenge will still be there when you're ready. But ask yourself: what held you back?",
                nextStepId: 'reflection',
            },
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What did you notice during the challenge? How did it feel to voluntarily choose something hard?",
            minimumWords: 12,
            encouragements: [
                'What resistance came up?',
                'What did you learn about yourself?',
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
                    "David Goggins calls this 'callousing the mind.' Every time you choose hard over easy, you're building mental calluses that protect you when life gets truly difficult.",
                    "The person who voluntarily does hard things doesn't fear involuntary hardship. You just became a little more unbreakable.",
                ],
                byChoice: {
                    physical: [
                        "Physical challenges are the gateway to mental toughness. The body leads, the mind follows. Cold showers, hard workouts, physical discomfort—these are the training ground for an unbreakable spirit.",
                    ],
                    mental: [
                        "Silence is the ultimate modern challenge. In a world of endless stimulation, the ability to sit with yourself is a superpower. You just practiced what most people run from.",
                    ],
                },
                byCompletion: {
                    completed: [
                        "You chose hard. Not many people do. Today you proved something to yourself that goes beyond this lesson.",
                    ],
                    notCompleted: [
                        "Recognizing resistance is the first step to overcoming it. The challenge isn't going anywhere. Tomorrow is another opportunity.",
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
    exercises: [
        {
            id: 'ex-8-scenario',
            type: 'scenario',
            title: 'The Paralyzed Friend',
            content: {
                situation: "Your friend has been talking about quitting their unfulfilling job to pursue their passion for years. They have savings, skills, and a plan - but they can't pull the trigger. They say they're 'not ready yet' and list vague fears about 'what could go wrong.'",
                question: "How would you walk them through fear-setting to help them see their fears clearly?",
                hints: [
                    "What would help them define the SPECIFIC worst case?",
                    "How could they prevent or minimize that worst case?",
                    "What's the cost of staying stuck forever?"
                ]
            }
        },
        {
            id: 'ex-8-quote',
            type: 'quote',
            title: 'Seneca on Fear',
            content: {
                quote: "We suffer more often in imagination than in reality. There are more things likely to frighten us than there are to crush us; we suffer more in imagination than in reality.",
                author: "Seneca",
                source: "Letters from a Stoic",
                reflectionPrompt: "Think of a fear that once seemed huge but turned out to be smaller when you faced it. What does that teach you about your current fears?"
            }
        },
        {
            id: 'ex-8-application',
            type: 'application',
            title: 'Mini Fear-Setting',
            content: {
                instruction: "Tomorrow, take one thing you've been procrastinating on due to vague fear. Spend 3 minutes doing a quick fear-set: what's the worst case, how could you prevent it, how could you recover?",
                planPrompt: "What's one decision or action you've been avoiding? What fear has been keeping you stuck?",
                examples: [
                    "Sending that email I've been drafting for a week",
                    "Having that conversation I keep postponing",
                    "Making that appointment I've been avoiding"
                ]
            }
        },
        {
            id: 'ex-8-anchor',
            type: 'anchor',
            title: 'The Clear Eyes',
            content: {
                gesture: "Place your fingertips gently on your closed eyelids, then slowly open your eyes and remove your fingers - moving from darkness to sight",
                meaning: "Fear thrives in darkness. This gesture represents moving from blind worry to clear seeing. When you define your fears, you take away their shadow power.",
                breathPattern: "Breathe in with fingers covering eyes, feeling the unknown. Breathe out as you open your eyes - seeing clearly. Defined fears are manageable fears.",
                repetitions: 3
            }
        },
        {
            id: 'ex-8-reframe',
            type: 'reframe',
            title: 'From Paralysis to Action',
            content: {
                challengePrompt: "What decision have you been avoiding because of fear? What leap have you been too scared to take?",
                reframeGuide: "Now apply fear-setting: What's the true worst case? How could you prevent it? How could you recover? What's the cost of NOT taking this leap?",
                example: {
                    before: "I want to ask for a raise but I'm terrified. What if they say no? What if they think I'm greedy? What if it backfires?",
                    after: "Worst case: They say no and think I'm overconfident. Prevent: I'll prepare data on my contributions and market rates. Recover: Even if rejected, I'll know where I stand and can plan accordingly. Cost of inaction: I stay resentful, underpaid, and never know what was possible. The fear of asking is worse than any realistic outcome."
                }
            }
        }
    ],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "There's something you've been avoiding. A decision you keep postponing. A leap you're afraid to take. The unknown feels dangerous, so you stay stuck. But what if the REAL danger is inaction?",
            subtext: "Clear seeing defeats unseen fears.",
            bridgeQuestion: "What decision have you been avoiding?",
            continueLabel: "I know what it is",
            mood: 'tension',
        },
        {
            id: 'name-fear',
            type: 'commitment',
            prompt: "Name the decision or action you've been avoiding out of fear.",
            placeholder: "I've been afraid to... I keep postponing... I haven't done...",
            minimumWords: 5,
            continueLabel: "This is what I've been avoiding",
            storeAs: 'fear',
            nextStepId: 'ferriss-intro',
        },
        {
            id: 'ferriss-intro',
            type: 'insight',
            text: "Tim Ferriss developed 'Fear-Setting' after nearly taking his own life. He realized: we rarely define our fears in detail. The undefined stays terrifying. The defined becomes manageable. Let's define yours now.",
            source: 'Tim Ferriss',
            sourceBook: 'The 4-Hour Workweek',
            style: 'principle',
            nextStepId: 'step-one-define',
        },
        {
            id: 'step-one-define',
            type: 'commitment',
            prompt: "DEFINE: What is the absolute WORST that could happen if you took this action? Be specific and catastrophize freely.",
            placeholder: "The worst case would be... I could lose... People might...",
            minimumWords: 15,
            guidanceHints: [
                'Let yourself imagine the darkest scenario',
                'Be specific, not vague',
                'What would you lose? What would happen?',
            ],
            continueLabel: "I see the worst case",
            storeAs: 'worst-case',
            nextStepId: 'step-two-prevent',
        },
        {
            id: 'step-two-prevent',
            type: 'commitment',
            prompt: "PREVENT: What could you do to prevent or minimize the worst case? What steps would reduce the probability?",
            placeholder: "I could prevent this by... To minimize risk I would...",
            minimumWords: 10,
            guidanceHints: [
                'What preparation would help?',
                'Who could support you?',
                'What safety nets could you create?',
            ],
            continueLabel: "I have preventions",
            storeAs: 'preventions',
            nextStepId: 'step-three-repair',
        },
        {
            id: 'step-three-repair',
            type: 'commitment',
            prompt: "REPAIR: If the worst happened anyway, what would you do to recover? How would you pick up the pieces?",
            placeholder: "To recover I would... I could rebuild by... I'd ask for help from...",
            minimumWords: 10,
            guidanceHints: [
                'You are more resourceful than you think',
                'What have you recovered from before?',
                'Who has overcome similar situations?',
            ],
            continueLabel: "I know I could recover",
            storeAs: 'repairs',
            nextStepId: 'flip-question',
        },
        {
            id: 'flip-question',
            type: 'insight',
            text: "Now the crucial question: What is the COST of inaction? If you don't take this leap in 6 months, 1 year, 3 years—what will your life look like? The real risk isn't failure. It's never trying.",
            style: 'revelation',
            nextStepId: 'cost-reflection',
        },
        {
            id: 'cost-reflection',
            type: 'reflection',
            prompt: "What is the true cost of NOT taking this action? What will you regret if you stay stuck?",
            minimumWords: 20,
            encouragements: [
                'Project forward: where does inaction lead?',
                'What would your 80-year-old self say?',
                'What opportunity cost are you paying?',
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
                    "You just did what Tim Ferriss credits with saving his life. By defining the fear, you took away its power. Most people never look their fears in the eye. You just did.",
                    "The fear didn't disappear—but it became manageable. That's the point. Now you can make a decision based on reality, not phantom terrors.",
                    "Ferriss says: 'What we fear doing most is usually what we most need to do.' You've done the hard work of clarity. The action is now a choice, not a mystery.",
                ],
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
    exercises: [
        {
            id: 'ex-9-scenario',
            type: 'scenario',
            title: 'The Market Crash',
            content: {
                situation: "The economy tanks. Two entrepreneurs face the same crisis. One panics, cuts everything, and hunkers down in survival mode. The other sees opportunity - they negotiate better deals with suppliers, hire talented people who are suddenly available, and double down on innovation. Same external event, opposite responses.",
                question: "What makes the second entrepreneur antifragile? How are they gaining from disorder while the first is being crushed by it?",
                hints: [
                    "What mindset allows someone to see opportunity in chaos?",
                    "How does preparation for volatility create advantage?",
                    "What's the difference between fragile, robust, and antifragile?"
                ]
            }
        },
        {
            id: 'ex-9-quote',
            type: 'quote',
            title: 'Taleb on Fire',
            content: {
                quote: "Wind extinguishes a candle and energizes fire. Likewise with randomness, uncertainty, chaos: you want to use them, not hide from them. You want to be the fire and wish for the wind.",
                author: "Nassim Nicholas Taleb",
                source: "Antifragile",
                reflectionPrompt: "In what area of your life are you the candle (fragile to change) and where could you become the fire (fueled by change)?"
            }
        },
        {
            id: 'ex-9-application',
            type: 'application',
            title: 'The Stress Transmutation',
            content: {
                instruction: "Tomorrow, when you encounter any stressor or unexpected change, immediately ask: 'How could this be making me stronger? What is this forcing me to develop?'",
                planPrompt: "What's a current source of stress in your life? How might you start seeing it as a training stimulus rather than a threat?",
                examples: [
                    "The deadline pressure is building my ability to focus under stress",
                    "The difficult colleague is teaching me negotiation and patience",
                    "The uncertainty is forcing me to become more adaptable"
                ]
            }
        },
        {
            id: 'ex-9-anchor',
            type: 'anchor',
            title: 'The Absorb and Rise',
            content: {
                gesture: "Push your palms down as if absorbing pressure, then flip them and push upward - like absorbing force from below and redirecting it upward",
                meaning: "The antifragile don't resist pressure - they absorb it and use it to rise higher. This gesture embodies converting downward force into upward momentum.",
                breathPattern: "Breathe in as you push down, absorbing the stress. Breathe out as you push up, transmuting pressure into power.",
                repetitions: 3
            }
        },
        {
            id: 'ex-9-reframe',
            type: 'reframe',
            title: 'From Victim to Beneficiary',
            content: {
                challengePrompt: "What current challenge or stressor feels like it's happening TO you? Something that seems purely negative?",
                reframeGuide: "Now rewrite this challenge as something that's happening FOR you. What strength, skill, or capability is this forcing you to develop?",
                example: {
                    before: "My company keeps changing priorities and it's impossible to plan anything. I'm constantly having to adapt and it's exhausting.",
                    after: "My company's constant changes are training me in adaptability - the most valuable skill in an uncertain world. While others need stability, I'm becoming someone who thrives in change. Every pivot is making me more antifragile. Companies will pay a premium for people who can navigate chaos."
                }
            }
        }
    ],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "Some things break under stress. Some survive. But a rare few actually get STRONGER when stressed. Muscles grow from resistance. Immune systems strengthen from exposure. What if your mind could work the same way?",
            subtext: "Beyond resilience lies antifragility.",
            continueLabel: "Tell me more",
            mood: 'curiosity',
        },
        {
            id: 'taleb-insight',
            type: 'insight',
            text: "Nassim Taleb coined 'antifragile' to describe things that gain from disorder. The opposite of fragile isn't robust—robust just survives. The opposite of fragile is antifragile: it IMPROVES from stressors, shocks, and volatility.",
            source: 'Nassim Taleb',
            sourceBook: 'Antifragile',
            style: 'principle',
            nextStepId: 'visualization',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Becoming Antifragile',
            instructions: [
                'Think of something stressful happening right now.',
                "Imagine you're not just surviving it...",
                "...you're actually getting stronger because of it.",
                'What skill is this forcing you to develop?',
                'What weakness is it exposing for you to fix?',
                'What would it mean to THANK this stressor?',
                'You are not fragile. You are antifragile.',
            ],
            paceSeconds: 5,
            style: 'fearless',
            nextStepId: 'identify-stressor',
        },
        {
            id: 'identify-stressor',
            type: 'commitment',
            prompt: "Name a current stressor in your life. How could it be making you STRONGER rather than just hurting you?",
            placeholder: "My stressor is... It could be making me stronger by...",
            minimumWords: 12,
            guidanceHints: [
                'What skill is it forcing you to build?',
                'What weakness is it revealing?',
                'How might future you thank this challenge?',
            ],
            continueLabel: "I see how it strengthens me",
            nextStepId: 'reflection',
        },
        {
            id: 'reflection',
            type: 'reflection',
            prompt: "What would change if you truly believed that stress makes you stronger, not weaker?",
            minimumWords: 15,
            encouragements: [
                'How would you approach challenges differently?',
                'What would you stop avoiding?',
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
                    "The antifragile don't fear volatility—they need it to grow. You just practiced seeing stress as fertilizer, not poison. This shift changes everything.",
                    "Taleb writes: 'Wind extinguishes a candle but energizes fire.' You're learning to be the fire, not the candle.",
                    "Most people spend their lives trying to eliminate stress. The antifragile spend theirs learning to gain from it. You're joining their ranks.",
                ],
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
    exercises: [
        {
            id: 'ex-10-scenario',
            type: 'scenario',
            title: 'The Disconnected Present',
            content: {
                situation: "Your friend is struggling with motivation. They can't see the point of their daily habits because they don't connect to any clear future. They know they should exercise, save money, and work on their skills, but it all feels pointless because the future version of themselves feels like a stranger.",
                question: "How would you help them connect with their future self? Why does that connection matter for present behavior?",
                hints: [
                    "Why do people treat their future self like a stranger?",
                    "How does visualizing your future self change today's choices?",
                    "What's the research on future-self connection and decision making?"
                ]
            }
        },
        {
            id: 'ex-10-quote',
            type: 'quote',
            title: 'On Becoming',
            content: {
                quote: "The only person you are destined to become is the person you decide to be.",
                author: "Ralph Waldo Emerson",
                source: "Self-Reliance",
                reflectionPrompt: "Who have you decided to become? Are your daily actions actually building that person, or are you drifting?"
            }
        },
        {
            id: 'ex-10-application',
            type: 'application',
            title: 'Future Self Check-In',
            content: {
                instruction: "Tomorrow, before making any significant choice, pause and ask: 'What would my future self want me to do here? Will they thank me or regret this decision?'",
                planPrompt: "What decision or choice do you know you'll face tomorrow? What would your best future self want you to do?",
                examples: [
                    "When I want to skip the workout, I'll ask if future me will be grateful I pushed through",
                    "Before an impulse purchase, I'll consider whether future me would want that money",
                    "When procrastinating, I'll imagine future me having to deal with the rushed result"
                ]
            }
        },
        {
            id: 'ex-10-anchor',
            type: 'anchor',
            title: 'The Bridge Reach',
            content: {
                gesture: "Extend your hand forward as if reaching across time to shake hands with your future self",
                meaning: "This reach bridges present and future. Your future self exists - they're being built by your choices right now. This gesture connects you across time.",
                breathPattern: "Breathe in and extend your hand forward. Breathe out and imagine your future self reaching back. You are connected. Your choices matter.",
                repetitions: 3
            }
        },
        {
            id: 'ex-10-reframe',
            type: 'reframe',
            title: 'From Stranger to Self',
            content: {
                challengePrompt: "What's something you keep putting off even though you know future you will pay the price?",
                reframeGuide: "Now imagine your future self as someone you deeply care about. Write about how your present behavior is affecting them - not a stranger, but YOU, older.",
                example: {
                    before: "I keep staying up late scrolling my phone even though I'm always tired. I know it's bad but I can't stop.",
                    after: "Every night I stay up late, I'm stealing energy from the person I'll be tomorrow. That tired, foggy person trying to focus at work? That's me, betrayed by the me from last night. The me who succeeds is the me who protects his sleep - because future me and present me are the same person."
                }
            }
        }
    ],
    steps: [
        {
            id: 'scenario',
            type: 'scenario',
            narrative: "One year from today, a future version of you exists. They have lived through everything that's coming. They know which decisions mattered, which fears were overblown, and what truly changed their life.",
            subtext: "What if you could receive a letter from that person?",
            continueLabel: "I want to hear from them",
            mood: 'hope',
        },
        {
            id: 'visualization',
            type: 'visualization',
            title: 'Meet Your Future Self',
            instructions: [
                'Breathe deeply. Let yourself settle.',
                "It's one year from today.",
                'Imagine the best realistic version of yourself.',
                'What habits did they build?',
                'What fear did they overcome?',
                'What are they most proud of?',
                'See them clearly. They are waiting to speak to you.',
            ],
            paceSeconds: 5,
            style: 'cosmic',
            nextStepId: 'letter-intro',
        },
        {
            id: 'letter-intro',
            type: 'insight',
            text: "Now let's reverse it. Instead of receiving a letter, you'll WRITE one TO your future self. This letter will be a promise, a vision, and a reminder of who you're becoming.",
            style: 'reframe',
            nextStepId: 'letter-write',
        },
        {
            id: 'letter-write',
            type: 'reflection',
            prompt: "Write a letter to yourself one year from now. What do you hope they've accomplished? What do you want to remind them about who you are today? What promise are you making?",
            minimumWords: 50,
            placeholder: "Dear Future Me,\n\nI'm writing to you from a moment of clarity...",
            encouragements: [
                'Be specific about what you hope to achieve',
                'Include what you want to remember feeling today',
                "What would make you proud if you read this in a year?",
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
                    "You've just done something that bridges present and future. This letter is a contract with yourself. The person you wrote to is real—they're built by decisions you make starting today.",
                    "Research shows that feeling connected to your future self leads to better decisions RIGHT NOW. You just built that bridge.",
                    "Save this letter somewhere you'll find it in a year. Reading your own words from a pivotal moment has a power nothing else can match.",
                ],
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
