// ═══════════════════════════════════════════════════════════════════════════
// ENGLISH TRANSLATIONS
// Base language for Transformation Hub
// ═══════════════════════════════════════════════════════════════════════════

const en = {
  // ─────────────────────────────────────────────────────────────────────────
  // COMMON / SHARED
  // ─────────────────────────────────────────────────────────────────────────
  common: {
    back: 'Back',
    continue: 'Continue',
    next: 'Next',
    skip: 'Skip',
    save: 'Save',
    cancel: 'Cancel',
    done: 'Done',
    close: 'Close',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    settings: 'Settings',
    profile: 'Profile',
    complete: 'Complete',
    incomplete: 'Incomplete',
    locked: 'Locked',
    unlocked: 'Unlocked',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    days: 'days',
    minutes: 'minutes',
    hours: 'hours',
    words: 'words',
    xp: 'XP',
    level: 'Level',
    streak: 'Streak',
    lessons: 'Lessons',
    exercises: 'Exercises',
    reflections: 'Reflections',
    achievements: 'Achievements',
    milestones: 'Milestones',
    daily: 'daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    phase: 'Phase',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGE SELECTOR
  // ─────────────────────────────────────────────────────────────────────────
  languageSelector: {
    title: 'Choose Your Language',
    subtitle: 'Select the language for your journey',
    continue: 'Continue',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────────────────────────────────
  onboarding: {
    // Step labels
    steps: {
      welcome: 'Welcome',
      yourName: 'Your Name',
      community: 'Community',
      vision: 'Vision',
      purpose: 'Purpose',
      thePath: 'The Path',
      commitment: 'Commitment',
      begin: 'Begin',
    },

    // Welcome Step
    welcome: {
      takeBreath: 'Take a breath.',
      hereForReason: "You're here for a reason.",
      notWorking: "Something in your life isn't working",
      theWayYouWant: 'the way you want it to.',
      thatsWhy: "That's why you're here.",
      whatIf: 'What if 5 minutes a day',
      couldChange: 'could change who you are?',
      ancientWisdom: 'Ancient wisdom. Modern practice. Real transformation.',
      learn: 'Learn',
      practice: 'Practice',
      transform: 'Transform',
      readyToBegin: "I'm ready to begin",
      noAccount: 'No account needed. Takes 2 minutes.',
    },

    // Name Step
    name: {
      beforeWeBegin: 'Before we begin...',
      whatShallICall: 'What shall I call you?',
      placeholder: 'Your first name',
      honorToMeet: "It's an honor to meet you,",
      enterName: 'Enter your name',
      staysPrivate: "This stays private. It's just between us.",
    },

    // Identity Step
    identity: {
      title: 'Your Anonymous Identity',
      subtitle: 'When you share reflections with fellow travelers,',
      subtitleLine2: 'how would you like to be referred to?',
      brother: 'Brother',
      sister: 'Sister',
      traveler: 'Traveler',
      heHim: 'He/Him',
      sheHer: 'She/Her',
      theyThem: 'They/Them',
      fellowBrother: 'A fellow brother',
      fellowSister: 'A fellow sister',
      fellowTraveler: 'A fellow traveler',
      othersWillSee: 'Others will see:',
      reflected: 'reflected...',
      privacyNote: 'Your name and identity are never revealed.',
      privacyNote2: 'Only this label is shown when you share anonymously.',
    },

    // Goal Step
    goal: {
      whoDoYouWant: 'who do you want to become?',
      chooseTransformation: 'Choose the transformation that calls to you',
      thisIsMyPath: 'This is my path',
      chooseYour: 'Choose your transformation',
      goals: {
        calmer: {
          title: 'More Calm',
          description: 'To respond instead of react. To find stillness in chaos. To be unshaken.',
        },
        disciplined: {
          title: 'More Disciplined',
          description: 'To follow through on every commitment. To become someone you can trust.',
        },
        confident: {
          title: 'More Confident',
          description: 'To stop second-guessing. To trust your own judgment. To act decisively.',
        },
        leader: {
          title: 'A Better Leader',
          description: 'To take responsibility. To inspire through action. To serve others.',
        },
        focused: {
          title: 'More Focused',
          description: 'To protect your attention. To do what matters. To finish what you start.',
        },
        resilient: {
          title: 'More Resilient',
          description: 'To bend without breaking. To grow stronger through every adversity.',
        },
      },
    },

    // Why Step
    why: {
      yourPath: 'Your path:',
      whatsTheCost: {
        calmer: "What's the cost of not finding calm?",
        disciplined: "What have you lost by not following through?",
        confident: "What's holding you back from trusting yourself?",
        leader: "Why does the world need you to step up?",
        focused: "What could you create with undivided attention?",
        resilient: "What challenge are you preparing for?",
      },
      subtext: {
        calmer: "Think about how stress is affecting your life, your relationships, your health.",
        disciplined: "Think about the promises you've broken to yourself. The goals abandoned.",
        confident: "Think about the opportunities you've missed. The words left unsaid.",
        leader: "Think about who's counting on you. What you could create.",
        focused: "Think about your deepest work. The project that matters most.",
        resilient: "Think about what's coming. What you need to be ready for.",
      },
      placeholder: {
        calmer: "When I'm reactive, I hurt the people I love. I make decisions I regret. I can't sleep. I need to change because...",
        disciplined: "Every time I give up, I trust myself less. I've let go of dreams because I couldn't show up consistently. I need to change because...",
        confident: "I stay quiet when I should speak. I don't go for what I want because I'm afraid I'm not enough. I need to change because...",
        leader: "People look to me but I shrink back. I have ideas but I don't act on them. I need to become a leader because...",
        focused: "I scatter my energy on everything and master nothing. My best work never gets done because I'm always distracted. I need to change because...",
        resilient: "Life has knocked me down before and I stayed down too long. I know harder times will come, and I need to be stronger because...",
      },
      wordCount: '{count} words',
      moreNeeded: '({count} more needed)',
      anchorText: "This will be your anchor. You can always come back to this.",
      beHonest: "Write at least 10 words. Be honest with yourself.",
      thisIsMyTruth: 'This is my truth',
      writeYourWhy: 'Write your why...',
      pressToSubmit: 'Press {key}+Enter to continue',
    },

    // Path Step
    path: {
      heresHow: "Here's How It Works",
      yourDailyPath: 'Your Daily Path',
      phase1: {
        title: 'The Lesson',
        subtitle: 'Ancient wisdom made real',
        description: 'Each day, learn a powerful principle that can transform how you see the world.',
        duration: '~3 min',
      },
      phase2: {
        title: 'The Echo',
        subtitle: 'Teach what you learn',
        description: "Respond to another traveler's reflection. Teaching deepens your own understanding.",
        duration: '~1 min',
      },
      phase3: {
        title: 'The Practice',
        subtitle: 'Apply it to your life',
        description: "Five exercises to make today's wisdom real. This is where transformation happens.",
        duration: '~3 min',
      },
      sameLesson: 'Same lesson. Same day. Together.',
      neverAlone: "Everyone learns the same wisdom on the same day. You're never alone on this journey.",
      totalTime: 'Total:',
      intentionalGrowth: 'of intentional growth, every day',
      iUnderstand: 'I understand the path',
    },

    // Commitment Step
    commitment: {
      howMuchTime: 'how much time will you give yourself each day?',
      smallConsistent: "Small and consistent beats big and sporadic. Choose what you'll actually do.",
      iCommit: 'I,',
      commitTo: 'commit to',
      minutesDaily: 'minutes daily',
      toBecome: 'to become',
      canChangeAnytime: "You can change this anytime. What matters is that you show up.",
      iCommitToThis: 'I commit to this',
      chooseYour: 'Choose your commitment',
      commitments: {
        fiveMin: '5 min',
        fiveMinDesc: 'Just start',
        tenMin: '10 min',
        tenMinDesc: 'Recommended',
        fifteenMin: '15 min',
        fifteenMinDesc: 'Go deeper',
        twentyMin: '20 min',
        twentyMinDesc: 'Transform',
      },
    },

    // Ready Step
    ready: {
      youveChosen: "you've chosen to",
      min: 'min',
      daily: 'daily',
      stoicWisdom: 'Stoic wisdom',
      wontWalkAlone: "You won't walk this path alone.",
      mentorWillGuide: 'A mentor will guide you—responding to your reflections',
      wisdomTailored: 'with wisdom tailored to your journey.',
      youreReady: "you're ready.",
      firstLessonAwaits: 'Your first lesson awaits.',
      beginMyJourney: 'Begin My Journey',
      personYouBecome: 'The person you become is shaped by what you do every day.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DAILY FLOW HOME
  // ─────────────────────────────────────────────────────────────────────────
  dailyFlow: {
    dayOf: 'Day {current} of {total}',
    todaysPracticeComplete: "Today's Practice Complete",
    doneTheWork: "You've done the work. Let the wisdom integrate.",
    tomorrowsGlimpse: "Tomorrow's Glimpse",
    wantToGoDeeper: 'Want to go deeper?',
    browseMoreEchoes: 'Browse More Echoes',
    connectWithTravelers: 'Connect with fellow travelers',
    redoPastLesson: 'Redo a Past Lesson',
    revisitDeepen: 'Revisit and deepen',
    viewDashboard: 'View Dashboard',
    progressStats: 'Progress, stats, and more',

    // Phases
    phases: {
      lesson: {
        title: "Today's Lesson",
        description: 'Learn wisdom',
        beginLesson: 'Begin Lesson',
        continueLesson: 'Continue Lesson',
      },
      echo: {
        title: 'The Echo',
        subtitle: 'Connect with a fellow traveler',
        description: "Respond to someone's reflection",
        respondToReflection: 'Respond to Reflection',
      },
      practice: {
        title: "Today's Practice",
        subtitle: '{count} exercises',
        description: "Embody today's wisdom",
        beginPractice: 'Begin Practice',
        continuePractice: 'Continue Practice',
        completed: '{current}/{total} completed',
      },
    },
    completePrevious: 'Complete previous phase to unlock',
    yourCommitment: 'Your commitment',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  dashboard: {
    yourJourney: 'Your Journey',
    dayOfTransformation: 'Day {day} of Your Transformation',
    youAreBecoming: 'You are becoming someone who is',
    latestIdentity: 'Your latest identity statement',
    goals: {
      calmer: 'finding inner calm',
      disciplined: 'building discipline',
      confident: 'growing confidence',
      leader: 'becoming a leader',
      focused: 'sharpening focus',
      resilient: 'building resilience',
      growing: 'growing',
      transforming: 'transforming',
    },

    // Sections
    sections: {
      today: 'Today',
      yourJourney: 'Your Journey',
      community: 'Community',
    },

    // Today's practice
    todaysPractice: "Today's Practice",
    todaysPracticeComplete: "Today's Practice Complete",
    lesson: 'Lesson',
    echo: 'Echo',

    // Journey section
    weeklyCheckin: 'Weekly Check-in',
    monthlyReview: 'Monthly Review',
    identity: 'Identity',
    whoYoureBecoming: "Who you're becoming",
    statements: '{count} statements',
    unlocked: '{count} unlocked',

    // Community section
    browseEchoes: 'Browse Echoes',
    readRespond: 'Read & respond to reflections',
    yourInbox: 'Your Inbox',
    responsesToReflections: 'Responses to your reflections',

    // Stats
    bestStreak: 'Best Streak',
    viewAllStats: 'View all stats',
    due: 'Due',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HOME / HERO GREETING
  // ─────────────────────────────────────────────────────────────────────────
  home: {
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
    wisdomQuotes: [
      'The obstacle is the way.',
      'Focus on what you can control.',
      'Begin at once to live.',
      'The best revenge is not to be like your enemy.',
      'Waste no more time arguing about what a good person should be. Be one.',
      'You have power over your mind - not outside events. Realize this, and you will find strength.',
      'It is not death that a man should fear, but never beginning to live.',
      'The happiness of your life depends upon the quality of your thoughts.',
      'Accept the things to which fate binds you.',
      'When you arise in the morning, think of what a privilege it is to be alive.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────────────────────────────────
  settings: {
    title: 'Settings',
    personalize: 'Personalize your experience',

    // Profile
    profile: 'Profile',
    onPathOf: 'On the path of transformation',
    seeker: 'Seeker',

    // Language
    language: 'Language',
    selectLanguage: 'Select your language',

    // Audio & Haptics
    audioHaptics: 'Audio & Haptics',
    soundEffects: 'Sound Effects',
    soundDesc: 'UI sounds, chimes, and feedback',
    hapticFeedback: 'Haptic Feedback',
    hapticDesc: 'Vibration on interactions',

    // Test Audio
    testAudio: 'Test Audio',
    previewAudio: 'Preview the immersive audio experience',
    uiSounds: 'UI Sounds',
    ambience: 'Ambience',
    meditation: 'Meditation',

    // About
    about: 'About',
    appName: 'Transformation Hub',
    appDesc: 'Your daily journey to growth',
    version: 'Version',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ECHOES / REFLECTIONS
  // ─────────────────────────────────────────────────────────────────────────
  echoes: {
    title: 'Echoes',
    inbox: 'Echo Inbox',
    noEchoes: 'No echoes yet',
    noEchosDesc: 'Complete your first lesson to start receiving echoes.',
    tabs: {
      received: 'Received',
      sent: 'Sent',
      invitations: 'Invitations',
      messages: 'Messages',
    },
    respondToReflection: 'Respond to Reflection',
    sendEcho: 'Send Echo',
    yourResponse: 'Your response...',
    characterMin: 'Write at least {min} characters',
    reflectedOn: 'reflected on',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISES
  // ─────────────────────────────────────────────────────────────────────────
  exercises: {
    title: 'Practice',
    todaysPractice: "Today's Practice",
    exerciseOf: 'Exercise {current} of {total}',
    scenario: 'Scenario',
    reflection: 'Reflection',
    complete: 'Complete Exercise',
    allComplete: 'All exercises complete!',
    xpEarned: '+{xp} XP earned',
    backToHome: 'Back to Home',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSONS
  // ─────────────────────────────────────────────────────────────────────────
  lessons: {
    title: 'Lesson',
    continue: 'Continue',
    complete: 'Complete Lesson',
    takeAction: 'Take Action',
    returnWhenReady: 'Return when ready',
    reflect: 'Reflect on this...',
    yourReflection: 'Your reflection...',
    chooseWisely: 'Choose wisely',
    timer: {
      breathe: 'Breathe',
      contemplate: 'Contemplate',
      timeRemaining: 'Time remaining',
    },
    steps: {
      scenario: 'Scenario',
      choice: 'Choice',
      commitment: 'Commitment',
      goDoIt: 'Go Do It',
      returnConfirm: 'Welcome Back',
      reflection: 'Reflection',
      visualization: 'Visualization',
      insight: 'Insight',
      mentor: 'Mentor',
      reward: 'Complete',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────
  achievements: {
    title: 'Achievements',
    gallery: 'Achievement Gallery',
    unlocked: 'Unlocked',
    locked: 'Locked',
    progress: 'Progress',
    earned: 'Earned',
    unlockedAt: 'Unlocked on {date}',
    keepGoing: 'Keep going to unlock!',
    celebration: 'Achievement Unlocked!',
    newMilestone: 'New Milestone',
    continue: 'Continue',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROGRESS
  // ─────────────────────────────────────────────────────────────────────────
  progress: {
    title: 'Progress',
    dashboard: 'Progress Dashboard',
    stats: {
      totalLessons: 'Total Lessons',
      totalReflections: 'Total Reflections',
      totalWords: 'Words Written',
      identityStatements: 'Identity Statements',
      achievements: 'Achievements',
      daysSinceStart: 'Days Active',
      avgReflectionLength: 'Avg. Reflection Length',
    },
    streakCalendar: 'Streak Calendar',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    activityLog: 'Activity Log',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  identity: {
    title: 'Identity',
    journey: 'Identity Journey',
    whoYoureBecoming: "Who You're Becoming",
    statements: 'Identity Statements',
    noStatements: 'No identity statements yet',
    noStatementsDesc: 'Complete lessons to discover who you are becoming.',
    latestStatement: 'Latest Statement',
    addStatement: 'Add Statement',
    yourStatement: 'I am someone who...',
    save: 'Save Statement',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKIN & ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  checkin: {
    weekly: {
      title: 'Weekly Check-in',
      subtitle: 'Reflect on your week',
      question: 'How has this week been?',
      submit: 'Complete Check-in',
      skip: 'Skip this week',
    },
    monthly: {
      title: 'Monthly Assessment',
      subtitle: 'Measure your growth',
      dimensions: {
        emotionalMastery: 'Emotional Mastery',
        discipline: 'Discipline',
        perspective: 'Perspective',
        selfAwareness: 'Self-Awareness',
        growth: 'Growth',
      },
      submit: 'Complete Assessment',
      skip: 'Skip this month',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COACHING
  // ─────────────────────────────────────────────────────────────────────────
  coaching: {
    beforeFirstLesson: {
      title: "Welcome to your first lesson, {name}!",
      message: "This is where your transformation begins. Take your time with each step. There's no rush.",
      cta: "I'm ready",
    },
    afterLessonBeforeEcho: {
      title: 'Beautiful reflection!',
      message: "Now you'll connect with another traveler by responding to their reflection. This is the Echo - where teaching deepens your own learning.",
      cta: 'Continue to Echo',
    },
    afterEchoBeforeExercises: {
      title: "You've connected with a fellow traveler!",
      message: "Now it's time for today's practice - 5 short exercises to embody what you've learned.",
      cta: 'Begin Practice',
    },
    afterFirstDayComplete: {
      title: 'Congratulations, {name}!',
      message: "You've completed your first day of transformation. This is just the beginning. Come back tomorrow for your next lesson.",
      cta: 'Celebrate!',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WORLD / MAP
  // ─────────────────────────────────────────────────────────────────────────
  world: {
    title: 'Journey Map',
    currentWorld: 'Current World',
    switchWorld: 'Switch World',
    progress: 'Progress',
    dayOf: 'Day {current} of {total}',
    chapters: 'Chapters',
    lessons: 'Lessons',
    completed: 'Completed',
    locked: 'Locked',
    worlds: {
      modernWisdom: 'Modern Wisdom',
      stoicism: 'Stoic Philosophy',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSFORMATION HUB
  // ─────────────────────────────────────────────────────────────────────────
  transformation: {
    title: 'Transformation Hub',
    hub: 'Your Transformation',
    patterns: 'Patterns',
    wisdom: 'Wisdom Logs',
    assessment: 'Assessment',
    radar: 'Growth Radar',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HELP TOOLTIPS
  // ─────────────────────────────────────────────────────────────────────────
  help: {
    exercises: {
      title: 'Daily Exercises',
      description: 'Five short exercises to practice what you learned today. This is where transformation happens.',
    },
    echoes: {
      title: 'Echoes',
      description: "Anonymous reflections from fellow travelers. Respond to their thoughts to deepen your own understanding.",
    },
    worlds: {
      title: 'Wisdom Worlds',
      description: 'Different journeys of wisdom. Each world has its own lessons and practices.',
    },
    streak: {
      title: 'Your Streak',
      description: 'The number of consecutive days you\'ve practiced. Keep it going!',
    },
    xp: {
      title: 'Experience Points',
      description: 'Earned by completing lessons, echoes, and exercises. Level up as you grow.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ERROR MESSAGES
  // ─────────────────────────────────────────────────────────────────────────
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    notFound: 'Content not found.',
    loadingFailed: 'Failed to load content.',
  },
} as const;

export default en;
