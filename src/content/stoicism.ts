import type { World } from '@/types';

export const stoicismWorld: World = {
  id: 'world-stoicism',
  slug: 'stoicism',
  name: 'Stoicism',
  subtitle: 'The Art of Inner Freedom',
  description:
    'Master the ancient philosophy that has guided emperors, prisoners, and leaders for over 2,000 years. Learn to control what you can, accept what you cannot, and find peace in any circumstance.',
  iconName: 'Flame',
  color: '#6366F1', // Indigo
  order: 1,
  isPremium: false,
  estimatedDays: 15,
  totalLessons: 15,
  chapters: [
    {
      id: 'chapter-perception',
      slug: 'perception',
      name: 'Perception',
      subtitle: 'See clearly before you act',
      description:
        'The Stoics believed that our judgments about events—not the events themselves—cause our suffering. Learn to see reality without the distortions of fear, anger, or desire.',
      order: 1,
      iconName: 'Eye',
      lessons: [
        {
          id: 'lesson-1',
          slug: 'the-dichotomy-of-control',
          order: 1,
          title: 'The Dichotomy of Control',
          wisdomText:
            'Some things are within our power, while others are not. Within our power are opinion, motivation, desire, and aversion—in short, whatever is our own doing. Not within our power are our body, our reputation, positions of authority, and whatever is not our own doing. Make this distinction now, and you will never be frustrated.',
          wisdomSource: 'Epictetus',
          actionPrompt:
            'For the next 60 seconds, bring to mind one thing that is stressing you right now. Ask yourself: "Is this within my control?" If not, take three deep breaths and mentally release it. If yes, identify one small action you can take.',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'What did you notice when you asked whether your stress was within your control?',
          mentorResponses: [
            "This is the foundation of everything. Most of our suffering comes from fighting battles we cannot win. You're learning to choose your battles wisely.",
            "Epictetus was a slave who became one of history's greatest teachers. He knew that even in chains, your mind is free. You're tapping into that same freedom now.",
            "The dichotomy of control isn't about giving up—it's about focusing your energy where it matters. Today, you took the first step toward that focus.",
          ],
          xpReward: 15,
          coreConceptTag: 'control',
        },
        {
          id: 'lesson-2',
          slug: 'perception-is-everything',
          order: 2,
          title: 'Perception is Everything',
          wisdomText:
            'It is not things that disturb us, but our judgments about things. When you are upset, know that it is not the thing itself that upsets you, but your own judgment about it. And it is in your power to revoke that judgment now.',
          wisdomSource: 'Epictetus',
          actionPrompt:
            'Think of something that annoyed or upset you recently. Now reframe it: What is a neutral or even positive way to interpret that same event? Write down both interpretations.',
          actionType: 'write',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'How did it feel to find an alternative interpretation? Was it difficult?',
          mentorResponses: [
            "The gap between stimulus and response is where your freedom lives. You just widened that gap by questioning your first interpretation.",
            "Most people go their whole lives believing their first reaction is the only possible reaction. Today you proved that's not true.",
            "This is a superpower. Events don't change—but when you change how you see them, everything changes.",
          ],
          xpReward: 15,
          coreConceptTag: 'perception',
        },
        {
          id: 'lesson-3',
          slug: 'the-view-from-above',
          order: 3,
          title: 'The View From Above',
          wisdomText:
            'Think often on the swiftness with which things pass and disappear. The substance of the universe is like a river in perpetual flow. All things are not only in a constant flux, but their causes are subject to countless changes. Scarcely anything is stable. Consider the infinite past and future in which all things are dissolved.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Imagine rising above your current situation—above your room, your city, your country, until you see Earth from space. Hold that perspective for 60 seconds. From this view, how important is the thing troubling you?',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'What shifted in your perception when you zoomed out to a cosmic scale?',
          mentorResponses: [
            "Marcus Aurelius ruled the Roman Empire and still practiced this exercise daily. Perspective is the antidote to being overwhelmed.",
            "From space, there are no borders, no arguments, no deadlines. That peace is always available to you—one zoom-out away.",
            "The view from above doesn't minimize your life. It clarifies what actually deserves your energy.",
          ],
          xpReward: 15,
          coreConceptTag: 'perspective',
        },
        {
          id: 'lesson-4',
          slug: 'morning-preparation',
          order: 4,
          title: 'Morning Preparation',
          wisdomText:
            'Begin each day by saying to yourself: Today I shall meet with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness—all of them due to ignorance of what is good and evil. But I have seen the beauty of good, and the ugliness of evil, and have recognized that the wrongdoer has a nature related to my own. Therefore none of them can injure me.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Right now, think of your day ahead. Who might frustrate you? What might go wrong? Accept in advance that these things may happen. Now ask: How will I respond with grace when they do?',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'How does pre-accepting difficulties change your relationship with them?',
          mentorResponses: [
            "This is not pessimism—it's preparation. A warrior who expects battle is calm when it arrives.",
            "Most anger comes from violated expectations. By adjusting your expectations, you reclaim your peace.",
            "Marcus wrote these words before dawn, preparing to lead an empire. You're now using the same practice he trusted with the weight of the world.",
          ],
          xpReward: 15,
          coreConceptTag: 'preparation',
        },
        {
          id: 'lesson-5',
          slug: 'removing-judgment',
          order: 5,
          title: 'Removing Judgment',
          wisdomText:
            'If you are pained by any external thing, it is not the thing that disturbs you, but your own judgment about it. And it is in your power to wipe out this judgment now. Remove the judgment "this is terrible" and the feeling goes with it.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Identify something you have been calling "bad" or "terrible." Now describe it using only neutral, factual language—no opinions, no judgments. Just what happened, objectively.',
          actionType: 'write',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'What changed when you described the situation without emotional language?',
          mentorResponses: [
            "Facts don't hurt. Stories hurt. You just practiced separating the two.",
            "This is what philosophers call 'stripping away.' Remove the story, and only reality remains—and reality is always workable.",
            "Every judgment you add is weight you carry. Today, you put something down.",
          ],
          xpReward: 15,
          coreConceptTag: 'judgment',
        },
      ],
    },
    {
      id: 'chapter-action',
      slug: 'action',
      name: 'Action',
      subtitle: 'Do what must be done',
      description:
        'Seeing clearly is not enough. The Stoics demanded right action—doing your duty, acting with virtue, and contributing to the common good. This chapter teaches you to act decisively without being attached to outcomes.',
      order: 2,
      iconName: 'Sword',
      lessons: [
        {
          id: 'lesson-6',
          slug: 'do-the-work',
          order: 1,
          title: 'Do The Work',
          wisdomText:
            'Waste no more time arguing about what a good person should be. Be one. Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'What is one small thing you have been avoiding that you know you should do? Commit to doing it within the next hour. Write it down now.',
          actionType: 'write',
          actionDurationSeconds: 60,
          reflectionPrompt:
            'What was stopping you from doing this task before? What will it feel like to have it done?',
          mentorResponses: [
            "Philosophy without action is just entertainment. You just chose action.",
            "The gap between who you are and who you want to be closes with small acts, done consistently. This is one of them.",
            "Marcus ruled by day and wrote philosophy by candlelight. He knew that wisdom means nothing until it becomes action.",
          ],
          xpReward: 15,
          coreConceptTag: 'action',
        },
        {
          id: 'lesson-7',
          slug: 'obstacle-is-the-way',
          order: 2,
          title: 'The Obstacle is the Way',
          wisdomText:
            'The impediment to action advances action. What stands in the way becomes the way. In every obstacle lies an opportunity. A fire uses whatever fuel is thrown upon it—you too can transform obstacles into fuel.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Think of an obstacle you are currently facing. Now ask: "How could this obstacle be exactly what I need right now?" Find at least one way this challenge is secretly an opportunity.',
          actionType: 'reflect',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'What opportunity did you discover within your obstacle?',
          mentorResponses: [
            "This is alchemy—turning lead into gold. The obstacle you described is now fuel for your growth.",
            "Every setback, every rejection, every failure contains a hidden instruction. You're learning to read that instruction.",
            "Those who master this see problems differently. They become the calm in every storm.",
          ],
          xpReward: 15,
          coreConceptTag: 'obstacles',
        },
        {
          id: 'lesson-8',
          slug: 'reserve-clause',
          order: 3,
          title: 'The Reserve Clause',
          wisdomText:
            'The wise person will pursue a goal with full effort, but will add the reserve clause: "if nothing prevents me." They plan with commitment but hold outcomes loosely. Act as if success is certain, but be ready to accept whatever comes.',
          wisdomSource: 'Seneca',
          actionPrompt:
            'Think of a goal you are pursuing. Now say aloud: "I will [your goal], if nothing prevents me—and if I am prevented, I will adapt." Feel the difference between attachment and commitment.',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'How does adding "if nothing prevents me" change your relationship with your goal?',
          mentorResponses: [
            "This is not about expecting failure—it's about being unbreakable. You give your all AND stay free of the outcome.",
            "The Stoics called this 'acting with a reserve clause.' Modern psychology calls it 'psychological flexibility.' Both work.",
            "Attachment to outcomes is the source of anxiety. Commitment without attachment is the source of peace.",
          ],
          xpReward: 15,
          coreConceptTag: 'reserve-clause',
        },
        {
          id: 'lesson-9',
          slug: 'act-immediately',
          order: 4,
          title: 'Act Immediately',
          wisdomText:
            'How much time he gains who does not look to see what his neighbor says or does or thinks, but only at what he himself is doing, to make it just and holy. No wandering attention. No meanness. Just the straight line of virtue.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'For the next 2 minutes, focus completely on one single task. No phone, no distractions, no thoughts about anything else. Just one thing, done with full presence.',
          actionType: 'act',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'What did you notice when you gave something your complete, undivided attention?',
          mentorResponses: [
            "Most people have never experienced true focus. They skim the surface of everything. You just went deep.",
            "Presence is power. In those 2 minutes, you practiced what monks train for years to achieve.",
            "Distraction is the enemy of excellence. Focus is a muscle—and you just trained it.",
          ],
          xpReward: 15,
          coreConceptTag: 'focus',
        },
        {
          id: 'lesson-10',
          slug: 'voluntary-discomfort',
          order: 5,
          title: 'Voluntary Discomfort',
          wisdomText:
            'Set aside a certain number of days, during which you shall be content with the scantiest and cheapest fare, with coarse and rough dress, saying to yourself the while: Is this the condition that I feared? It is precisely in times of immunity from care that the soul should toughen itself.',
          wisdomSource: 'Seneca',
          actionPrompt:
            'Choose one small discomfort right now: a cold splash of water on your face, standing instead of sitting, or simply sitting in silence without your phone for 60 seconds. Do it.',
          actionType: 'act',
          actionDurationSeconds: 60,
          reflectionPrompt:
            'How did it feel to voluntarily choose discomfort? What does this teach you about your relationship with comfort?',
          mentorResponses: [
            "Comfort is a slow poison. By choosing discomfort, you stay sharp while others grow soft.",
            "The person who can choose discomfort fears nothing. You just proved you can choose it.",
            "Seneca was one of the richest men in Rome—yet he practiced poverty regularly. He knew that dependence on comfort is a weakness.",
          ],
          xpReward: 15,
          coreConceptTag: 'discomfort',
        },
      ],
    },
    {
      id: 'chapter-will',
      slug: 'will',
      name: 'Will',
      subtitle: 'Accept what must be accepted',
      description:
        'The final discipline: acceptance. Not passive resignation, but active agreement with reality. The Stoics called this amor fati—love of fate. Learn to embrace whatever happens as necessary and good.',
      order: 3,
      iconName: 'Mountain',
      lessons: [
        {
          id: 'lesson-11',
          slug: 'amor-fati',
          order: 1,
          title: 'Amor Fati: Love Your Fate',
          wisdomText:
            'Do not seek for things to happen the way you want them to; rather, wish that what happens happen the way it happens: then you will be content. Accept the things to which fate binds you, and love the people with whom fate brings you together.',
          wisdomSource: 'Epictetus & Marcus Aurelius',
          actionPrompt:
            'Think of something that happened to you that you wished had been different. Now say: "This had to happen exactly as it did. It is part of my story. I accept it fully." Notice how this feels.',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'What shifts when you accept something completely, rather than wishing it were different?',
          mentorResponses: [
            "Amor fati isn't about liking everything that happens. It's about stopping the war with reality—and winning by surrendering the fight.",
            "What you accept loses its power to hurt you. What you resist persists.",
            "This is the ultimate Stoic skill: not just tolerating fate, but embracing it as if you chose it.",
          ],
          xpReward: 15,
          coreConceptTag: 'amor-fati',
        },
        {
          id: 'lesson-12',
          slug: 'memento-mori',
          order: 2,
          title: 'Memento Mori: Remember Death',
          wisdomText:
            'You could leave life right now. Let that determine what you do and say and think. It is not death that a man should fear, but he should fear never beginning to live. Think of yourself as dead. You have lived your life. Now take what is left and live it properly.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Imagine you have only one year left to live. Ask yourself: What would I stop doing immediately? What would I start doing that I have been putting off? Write one thing for each.',
          actionType: 'write',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'How does remembering death clarify what actually matters to you?',
          mentorResponses: [
            "Memento mori is not morbid—it is the ultimate clarifier. Death strips away everything unimportant and reveals what you truly value.",
            "Marcus Aurelius wrote these words while ruling an empire and fighting wars. He knew each day could be his last—and it made him better, not worse.",
            "Most people sleepwalk through life because they assume they have infinite time. You just woke up.",
          ],
          xpReward: 15,
          coreConceptTag: 'memento-mori',
        },
        {
          id: 'lesson-13',
          slug: 'premeditatio-malorum',
          order: 3,
          title: 'Premeditatio Malorum: Premeditation of Evils',
          wisdomText:
            'We suffer more in imagination than in reality. What I advise you to do is not to be unhappy before the crisis comes; since it may be that the dangers before which you paled will never come upon you. Rehearse them in your mind, so that if they come, they hold no terror.',
          wisdomSource: 'Seneca',
          actionPrompt:
            'Think of something you fear might happen. Now visualize it happening in full detail—and yourself surviving, adapting, even growing stronger through it. Spend 90 seconds with this visualization.',
          actionType: 'reflect',
          actionDurationSeconds: 90,
          reflectionPrompt:
            'How did pre-imagining the worst change your fear of it?',
          mentorResponses: [
            "Fear thrives in the shadows. By looking directly at what you fear, you drain its power.",
            "The Stoics didn't practice this to be pessimistic—they practiced it to be fearless. A warrior who has rehearsed battle is calm when it comes.",
            "You just practiced what Navy SEALs, astronauts, and surgeons do before high-stakes moments. Mental rehearsal builds real courage.",
          ],
          xpReward: 15,
          coreConceptTag: 'negative-visualization',
        },
        {
          id: 'lesson-14',
          slug: 'eternal-recurrence',
          order: 4,
          title: 'The Eternal Recurrence',
          wisdomText:
            'What if a demon crept after you one day and said: This life as you live it now, you will have to live again, innumerable times; and there will be nothing new in it. Would you throw yourself down and curse? Or would you answer: Never have I heard anything more divine?',
          wisdomSource: 'Friedrich Nietzsche (Stoic-influenced)',
          actionPrompt:
            'If you had to live this exact day—with all its challenges and blessings—over and over for eternity, what would you change right now to make it worth repeating? Make one small change in this very moment.',
          actionType: 'act',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'What did you change? What does this reveal about how you want to live?',
          mentorResponses: [
            "This question cuts through all excuses. If this day will repeat forever, it better be a day worth living.",
            "Most people postpone their real life for 'someday.' The eternal recurrence forces you to live now.",
            "The change you just made, however small, is the beginning of living intentionally. That is the philosopher's life.",
          ],
          xpReward: 15,
          coreConceptTag: 'eternal-recurrence',
        },
        {
          id: 'lesson-15',
          slug: 'the-inner-citadel',
          order: 5,
          title: 'The Inner Citadel',
          wisdomText:
            'Retreat into yourself. The rational mind that rules has this nature: it is content with itself when it acts justly, and so gains tranquility. Nowhere can a person find a more peaceful retreat than in their own mind. Grant yourself this retreat often and renew yourself.',
          wisdomSource: 'Marcus Aurelius',
          actionPrompt:
            'Visualize an inner sanctuary—a place within you that no external event can ever touch. What does it look like? Feel like? This is your inner citadel. Visit it now.',
          actionType: 'reflect',
          actionDurationSeconds: 120,
          reflectionPrompt:
            'What does your inner citadel look like? How does it feel to know you can always return there?',
          mentorResponses: [
            "You have just completed the first journey of Stoicism. The outer world will always be chaotic. But now you have built a fortress within that nothing can breach.",
            "This is what Marcus Aurelius meant when he ruled by day and wrote philosophy by night. He was retreating to his inner citadel—as you now can too.",
            "The world cannot take what it does not give. Your peace, your clarity, your freedom—these were always yours. Now you know where to find them.",
          ],
          xpReward: 25,
          coreConceptTag: 'inner-citadel',
        },
      ],
    },
  ],
};

export default stoicismWorld;
