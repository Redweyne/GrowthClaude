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
    add: 'Add',
    copy: 'Copy',
    copied: 'Copied!',
    share: 'Share',
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
    word: 'word',
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
    selectPrompt: 'Select a language',
    helper: 'You can change this anytime in settings',
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
  // PRACTICE MODE
  // ─────────────────────────────────────────────────────────────────────────
  practiceMode: {
    noPracticeAvailable: 'No Practice Available',
    completeLessonsFirst: "Complete some lessons first, then return here to practice and reinforce what you've learned.",
    title: 'Practice Mode',
    progressOf: '{current} of {total}',
    practiceSession: 'Practice Session',
    applyWhatYouLearned: "Apply what you've learned to real-world scenarios. This strengthens your understanding and builds lasting wisdom.",
    scenarioCount: '{count} scenarios',
    estimatedTime: '~{minutes} min',
    beginPractice: 'Begin Practice',
    scenarioLabel: 'Scenario',
    writeResponsePlaceholder: 'Write your response...',
    reflectionLabel: 'Reflection',
    yourResponseLabel: 'Your response:',
    reflectPlaceholder: 'Reflect on this...',
    nextScenario: 'Next Scenario',
    completePractice: 'Complete Practice',
    practiceComplete: 'Practice Complete!',
    practiceCompleteBody: "You've strengthened your understanding through application. This is how wisdom becomes instinct.",
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

    // Quote of the day
    quoteOfTheDay: 'Daily Wisdom',

    // Journey map labels
    chapterLabels: {
      start: 'Start',
      chapter2: 'Ch. 2',
      mid: 'Mid',
      chapter4: 'Ch. 4',
      end: 'End',
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
      {
        text: 'The obstacle is the way.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'Focus on what you can control.',
        author: 'Seneca',
      },
      {
        text: 'Begin at once to live.',
        author: 'Epictetus',
      },
      {
        text: 'The best revenge is not to be like your enemy.',
        author: 'Seneca',
      },
      {
        text: 'Waste no more time arguing about what a good person should be. Be one.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'You have power over your mind - not outside events. Realize this, and you will find strength.',
        author: 'Epictetus',
      },
      {
        text: 'It is not death that a man should fear, but never beginning to live.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'The happiness of your life depends upon the quality of your thoughts.',
        author: 'Seneca',
      },
      {
        text: 'Accept the things to which fate binds you.',
        author: 'Epictetus',
      },
      {
        text: 'When you arise in the morning, think of what a privilege it is to be alive.',
        author: 'Marcus Aurelius',
      },
    ],
    navigation: {
      progress: 'Progress',
      achievements: 'Achievements',
      identity: 'Identity',
      practice: 'Practice',
      growth: 'Growth',
      echoes: 'Echoes',
      map: 'Map',
      worlds: 'Worlds',
    },
    streakMessage: {
      singular: '{count} day of consistent growth',
      plural: '{count} days of consistent growth',
      none: 'Start your journey today',
    },
    level: {
      progressToNext: '{percent}% to next level',
      motivation: {
        almostThere: 'Almost there! Keep pushing forward.',
        halfway: 'Halfway there. Every lesson brings you closer.',
        firstStep: 'The journey of a thousand miles begins with a single step.',
      },
    },
    lessonCard: {
      actionAwaits: 'Your Action Awaits',
      completeThenReturn: 'Complete it, then return here',
      youCommittedTo: 'You committed to:',
      rememberPrefix: 'Remember:',
      rememberEmphasis: 'action is the antidote to anxiety.',
      rememberSuffix: "Don't just think about it. Do it. Then come back to reflect.",
    },
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

    // Danger Zone
    dangerZone: 'Danger Zone',
    resetProgress: 'Reset All Progress',
    resetDesc: 'Delete all data and start fresh',
    resetWarning: 'This will permanently delete all your progress, reflections, and echoes. This action cannot be undone.',
    resetConfirm: 'Yes, Reset Everything',
    resetCancel: 'Cancel',
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
    // Echo Prompt
    bestWayToLearn: 'The Best Way to Learn',
    roleOfTeacher: '...is to take on the role of a teacher.',
    reflectOnJourney: "Would you like to reflect on another student's journey and offer them encouragement?",
    byTeachingOthers: 'By teaching others, we teach ourselves.',
    proverb: 'Proverb',
    letsDoThat: "Let's do that",
    notRightNow: 'Not right now',
    // Echo Inbox
    fromFellow: 'From a fellow',
    viewAll: 'View All',
    noResponses: 'No responses yet',
    yourReflections: 'Your reflections are out there, gathering wisdom.',
    pending: 'Pending',
    hoursAgo: '{hours}h ago',
    daysAgo: '{days}d ago',
    justNow: 'Just now',
    // Echo Review
    teacherWisdom: 'Your words will guide a fellow traveler.',
    submitEcho: 'Submit Echo',
    skipForNow: 'Skip for now',
    // Echo Inbox
    reflections: 'Reflections',
    invitations: 'Invitations',
    connectionsTab: 'Connections',
    noReflectionsYet: 'No reflections yet',
    whenSomeoneReflects: "When someone reflects on your words, you'll see it here",
    fellowReflected: 'A fellow {gender} reflected',
    fellowReflectedOnYourWords: 'A fellow {gender} reflected on your words',
    fellowLabel: 'A fellow {gender}',
    openToConnecting: 'Open to connecting',
    yourReflectionLabel: 'Your reflection:',
    theirReflection: '{possessive} reflection for you:',
    theyreOpenToConnect: '{subject} is open to connecting',
    wouldYouLikeToConnect: 'Would you like to connect with this person?',
    writeInvitationMessage: 'Write a message with your invitation...',
    invitationMessageLabel: '{possessive} message:',
    inviteToConnect: 'Invite to Connect',
    closeWithoutConnecting: 'Close without connecting',
    noPendingInvitations: 'No pending invitations',
    invitationsWillAppear: 'Connection invitations will appear here',
    wantsToConnect: 'A fellow {gender} wants to connect',
    connectionRequest: 'Connection Request',
    decline: 'Decline',
    acceptConnect: 'Accept & Connect',
    noConnectionsYet: 'No connections yet',
    conversationsWillAppear: 'When you connect with someone, your conversations will appear here',
    growthConversation: 'Growth Conversation',
    withFellow: 'with a fellow {gender}',
    youConnectedThrough: 'You connected through:',
    startConversation: 'Start your growth conversation...',
    typeMessage: 'Type a message...',
    // Echo Review
    reflectingOnJourney: "Reflecting on Another's Journey",
    skip: 'Skip',
    fellowReflectedOn: 'A fellow {gender} reflected on "{title}":',
    absorbWords: 'Take a moment to absorb their words...',
    writeYourReflection: 'Write Your Reflection',
    fellowWrote: 'A fellow {gender} wrote:',
    whatDoesTheirJourney: 'What does their journey make you think about?',
    whatEncouragement: 'What encouragement can you offer?',
    pronounHim: 'him',
    pronounHer: 'her',
    pronounThem: 'them',
    pronounHe: 'he',
    pronounShe: 'she',
    pronounThey: 'they',
    pronounHis: 'his',
    pronounHerPossessive: 'her',
    pronounTheir: 'their',
    yourReflectionFor: 'Your reflection for {pronoun}:',
    writeYourThoughts: 'Write your thoughts...',
    word: 'word',
    wordsPlural: 'words',
    readyToSend: 'Ready to send',
    aBitMore: 'A bit more...',
    openToConnectingIf: "I'm open to connecting if {pronoun}'d like to",
    sendReflection: 'Send Reflection',
    pressToSend: 'Press ⌘+Enter to send',
    sendingReflection: 'Sending your reflection...',
    reflectionSent: 'Reflection Sent',
    yourWordsWillReach: 'Your words will reach them.',
    connectedThroughReflection: 'Connected through reflection',
    // Mandatory Echo Flow
    mandatory: {
      phaseLabel: 'Phase 2: The Echo',
      communityConnection: 'Community Connection',
      connectBeforePractice: 'Connect Before You Practice',
      encourageTraveler: "Before your exercises, take a moment to encourage a fellow traveler. Your words might be exactly what they need today.",
      whyMatters: 'Why this matters:',
      whyMattersDesc: "When you reflect on someone else's journey, you deepen your own understanding. Teaching is the highest form of learning.",
      readReflection: "Read a Fellow Traveler's Reflection",
      fellowReflectedOn: 'A fellow {gender} reflected on "{title}":',
      absorbWords: 'Take a moment to really absorb their words...',
      writeYourEcho: 'Write Your Echo',
      fellowWrote: 'A fellow {gender} wrote:',
      yourEchoFor: 'Your echo for {pronoun}:',
      shareInsight: 'Share an insight, word of encouragement, or connection to your own journey.',
      writeThoughts: 'Write your thoughts...',
      readyToSend: 'Ready to send',
      moreWords: '{count} more words',
      openToConnect: "I'm open to connecting further",
      sendAndUnlock: 'Send Echo & Unlock Exercises',
      cmdEnterToSend: 'Press Cmd+Enter to send',
      sendingEcho: 'Sending your echo...',
      echoSent: 'Echo Sent!',
      wordsWillBrighten: "Your words will brighten someone's journey.",
      continueToExercises: 'Continue to Exercises',
    },
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
    backToToday: 'Back to Today',
    completed: 'completed',
    minRemaining: '~{min} min remaining',
    practiceComplete: 'Practice Complete!',
    wisdomTakingRoot: "You've completed all 5 exercises for today. The wisdom is taking root.",
    xpEarnedAmount: '+{amount} XP Earned',
    exercisesCount: 'Exercises',
    completeTodaysPractice: "Complete Today's Practice",
    completeInAnyOrder: "Complete these exercises in any order to embody today's wisdom.",
    scenarioTitle: 'Scenario',
    quoteTitle: 'Quote',
    applicationTitle: 'Application',
    anchorTitle: 'Anchor',
    reframeTitle: 'Reframe',
    whatWouldYouDo: 'What would you do?',
    chooseResponse: 'Choose a response',
    selectOption: 'Select an option',
    yourThoughts: 'Your thoughts...',
    typeResponse: 'Type your response...',
    submitResponse: 'Submit Response',
    nextExercise: 'Next Exercise',
    exerciseComplete: 'Exercise Complete',
    wellDone: 'Well done!',
    back: 'Back',
    continueText: 'Continue',
    // Application Exercise
    tomorrowOpportunity: "Tomorrow is a new opportunity to practice what you've learned today.",
    tomorrowIWill: 'Tomorrow, I will...',
    setTomorrowsIntention: "Set Tomorrow's Intention",
    // Anchor Exercise
    createYourAnchor: 'Create Your Anchor',
    beginBreaths: 'Begin {count} Breaths',
    breathOf: 'Breath {current} of {total}',
    breatheIn: 'Breathe in...',
    breatheOut: 'Breathe out...',
    hold: 'Hold...',
    keepAnchorGesture: 'Keep your anchor gesture while breathing',
    anchorSet: 'Anchor Set',
    gestureLinked: "Your gesture is now linked to today's wisdom. Use it whenever you need a reminder.",
    // Reframe Exercise
    shiftPerspective: 'Shift Your Perspective',
    shiftPerspectiveDesc: "Use today's wisdom to see this situation differently. The obstacle often contains the opportunity.",
    example: 'Example',
    before: 'Before:',
    after: 'After:',
    describeChallenge: "Describe the challenge, then reframe it using today's wisdom...",
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
      startPractice: 'Start Practice',
    },
    // Stage labels for LessonExperience progress indicator
    stages: {
      receivingWisdom: 'Receiving Wisdom',
      practicing: 'Practicing',
      reflecting: 'Reflecting',
      celebrating: 'Celebrating',
      integration: 'Integration',
    },
    // Step labels for FlexibleLessonExperience
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
      // Additional step labels
      theSituation: 'The Situation',
      yourChoice: 'Your Choice',
      yourCommitment: 'Your Commitment',
      takeAction: 'Take Action',
      welcomeBack: 'Welcome Back',
      innerVision: 'Inner Vision',
      practice: 'Practice',
      sageWisdom: 'Sage Wisdom',
      celebration: 'Celebration',
    },
    scenario: {
      continue: 'Continue',
    },
    visualization: {
      continue: 'I have seen',
      continueToReflect: 'Continue to reflect',
    },
    commitment: {
      placeholder: 'I will...',
      word: 'word',
      words: 'words',
      readyToCommit: 'Ready to commit',
      moreNeeded: '{count} more needed',
      commitButton: 'I commit to this',
      pressToSubmit: 'Press {key}+Enter to continue',
    },
    // Wisdom Step
    wisdom: {
      settleInto: 'Settle into this moment...',
      letGo: 'Let go of what came before...',
      openToReceive: 'Open to receive...',
      todaysWisdom: "Today's Wisdom",
      iReceiveWisdom: 'I receive this wisdom. What is the practice?',
      pressEnter: 'Press Enter to continue',
    },
    // Action Step
    action: {
      breathingPractice: 'Breathing Practice',
      innerReflection: 'Inner Reflection',
      mindfulObservation: 'Mindful Observation',
      freeWriting: 'Free Writing',
      mindfulAction: 'Mindful Action',
      practice: 'Practice',
      remaining: 'remaining',
      readyToContinue: "I'm ready to continue",
      practiceComplete: 'Practice complete',
      iPracticedFully: 'I practiced fully',
      iStruggled: 'I struggled with this one',
      honestyIsPractice: 'Honesty is part of the practice',
      breatheIn: 'Breathe in...',
      hold: 'Hold...',
      release: 'Release...',
      breath: 'breath',
      breaths: 'breaths',
      breathsComplete: 'complete',
      // Guidance messages
      guidance: {
        breathe: [
          'Let your breath find its natural rhythm...',
          'Each breath anchors you deeper into presence...',
          'There is nothing to fix. Just breathe...',
          'Your breath knows the way...',
          'Let go of the last breath. Welcome this one...',
        ],
        reflect: [
          'Turn your attention inward...',
          'What arises when you sit with this?',
          'Notice without judging...',
          'Let the question work on you...',
          'The answer is already forming...',
        ],
        observe: [
          'Soften your gaze...',
          'Notice what you usually miss...',
          'Everything is speaking if you listen...',
          'Stay with what you see...',
          'Let awareness expand...',
        ],
        write: [
          'Let the words come without editing...',
          'Write from the body, not the mind...',
          'There is no wrong answer here...',
          'Follow the thread wherever it leads...',
          'Your hand knows what to write...',
        ],
        act: [
          'Feel the energy building...',
          'You are ready for this...',
          'Action flows from stillness...',
          'Trust your instincts...',
          'Move with intention...',
        ],
      },
      integration: [
        'Let this settle into your being...',
        'Carry this presence with you...',
        'This moment is now part of you...',
        'The practice continues in daily life...',
      ],
    },
    // Reflection Step
    reflection: {
      nowReflect: 'Now, reflect...',
      yourReflection: 'Your Reflection',
      beginWriting: 'Begin writing...',
      word: 'word',
      words: 'words',
      readyToContinue: 'Ready to continue',
      aBitMoreDepth: 'A bit more depth...',
      keepWriting: 'Keep writing...',
      private: 'Private',
      shareAnonymously: 'Share Anonymously',
      publicDesc: 'Others can read and reflect on your words. You may receive thoughtful responses.',
      privateDesc: 'This reflection is just for you. No one else will see it.',
      completeReflection: 'Complete Reflection',
      continueOrWriteMore: 'Continue (or write more)',
      reflectionComplete: 'Reflection complete',
      pressToSubmit: 'Press ⌘+Enter to continue',
      encouragement: [
        "What's present for you right now?",
        "There's no rush. Let the thoughts come.",
        'Write as if no one will ever read this.',
        'What would honesty look like here?',
        "Go deeper. What's underneath that?",
      ],
      depth: [
        'Why does this matter to you?',
        'When have you felt this before?',
        'What would change if you truly believed this?',
        'What are you avoiding saying?',
        'What would your wisest self write here?',
      ],
      milestones: {
        finding: "You're finding your voice...",
        keepGoing: 'Keep going. This is where the gold is.',
        goingDeep: "Beautiful. You're going deep.",
      },
    },
    // Reward Step
    reward: {
      takeABreath: 'Take a breath.',
      youShowedUp: 'You showed up today.',
      growth: 'growth',
      youveGrown: "You've grown",
      dayStreak: 'Day Streak',
      continueToMentor: 'Continue to Mentor',
    },
    // Mentor Step
    mentor: {
      sageIsSpeaking: 'Sage is speaking...',
      completeLesson: 'Complete Lesson',
      tryAgain: 'Try Again',
      reflectionNeedsDepth: 'Your reflection needs more depth',
      daysToStreak: '{days} more {dayWord} to your first week streak',
      day: 'day',
      days: 'days',
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
    title: 'Identity Journey',
    journey: 'Identity Journey',
    whoYoureBecoming: "Who You're Becoming",
    statements: 'Identity Statements',
    noStatements: 'No identity statements yet',
    noStatementsDesc: 'Complete lessons to discover who you are becoming.',
    latestStatement: 'Latest Statement',
    addStatement: 'Add Statement',
    yourStatement: 'I am someone who...',
    save: 'Save Statement',
    // IdentityJourney.tsx
    defineWhoYouAre: 'Define who you are becoming',
    statementsCount: '{count} identity statement(s) claimed',
    whoAreYouBecoming: 'Who are you becoming?',
    emptyStateDescription: 'Identity statements help you define and reinforce who you want to be. The person you claim to be today shapes who you become tomorrow.',
    createFirstStatement: 'Create Your First Statement',
    iAmSomeoneWho: 'I am someone who',
    yourEvolution: 'Your Evolution',
    evolutionMessage: "{name}, you've claimed {count} identities. Each statement is a promise to yourself - a declaration of who you are becoming. Keep showing up as this person.",
    selfInitiated: 'Self-initiated',
    // IdentityPromptModal.tsx
    completeStatement: '{name}, complete this statement to claim your identity.',
    promptInspiration: 'Prompt inspiration',
    tapForAnother: 'tap for another',
    yourIdentityStatement: 'Your identity statement',
    statementPlaceholder: 'shows up every day...',
    example: 'Example',
    identityClaimed: 'Identity Claimed',
    claiming: 'Claiming...',
    claimThisIdentity: 'Claim This Identity',
    minCharacters: 'Please write at least 10 characters',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKIN & ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  checkin: {
    title: 'Weekly Check-in',
    weekCheckin: 'Week {week} Check-in',
    introMessage: 'Take a few minutes to reflect on your journey this week. Your insights shape your growth.',
    reflectionsCount: '{count} reflections',
    duration: '~5 min',
    completedCount: "You've completed {count} check-in(s) so far",
    beginReflection: 'Begin Reflection',
    categories: {
      yourProgress: 'Your Progress',
      challengesFaced: 'Challenges Faced',
      keyInsights: 'Key Insights',
      lookingAhead: 'Looking Ahead',
      reflection: 'Reflection',
    },
    takeYourTime: 'Take your time to reflect...',
    yourReflection: 'Your reflection',
    digDeeper: 'Dig a little deeper...',
    nextReflection: 'Next Reflection',
    completeCheckin: 'Complete Check-in',
    checkinComplete: 'Check-in Complete!',
    completeMessage: 'Week {week} reflection captured. Your self-awareness is growing.',
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
      xpEarned: '+{xp} XP earned for completing assessment',
      submit: 'Complete Assessment',
      skip: 'Skip this month',
      progress: '{current} / {total}',
      scoreTitle: 'Your Monthly Score',
      snapshot: "Here's your growth snapshot",
      snapshotWithName: '{name}, here\'s your growth snapshot',
      viewResults: 'View Results',
      minReflectionChars: 'Write at least {count} characters to continue',
      saving: 'Saving...',
      scoreLabels: {
        exceptional: 'Exceptional',
        strong: 'Strong',
        developing: 'Developing',
        needsWork: 'Needs Work',
        justStarting: 'Just Starting',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COACHING
  // ─────────────────────────────────────────────────────────────────────────
  coaching: {
    beforeFirstLesson: {
      title: 'Your First Lesson',
      message: '{name}, today thousands of people are learning this same wisdom alongside you.',
      subMessage: 'Take your time. Let the words sink in. This is where transformation begins.',
      button: 'Begin My Journey',
      cta: "I'm ready",
    },
    afterLessonBeforeEcho: {
      title: 'The Power of Teaching',
      message: "You've learned something powerful. Now, deepen it by helping someone else.",
      subMessage: "Responding to another's reflection isn't just connection - it's how wisdom becomes wisdom. When you teach, you truly understand.",
      button: "I'm Ready to Connect",
      cta: 'Continue to Echo',
    },
    afterEchoBeforeExercises: {
      title: 'Make It Real',
      message: "Knowledge without practice is just information. Now it's time to apply today's wisdom to YOUR life.",
      subMessage: 'Five short exercises. Each one brings the lesson into your world, your challenges, your growth.',
      button: "Let's Practice",
      cta: 'Begin Practice',
    },
    afterFirstDayComplete: {
      title: 'Day One Complete',
      message: '{name}, you did it. This is how transformation begins.',
      subMessage: 'One day at a time. One lesson at a time. One choice at a time. Come back tomorrow - your next lesson will be waiting.',
      button: "I'll Be Back",
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
    // WorldMap.tsx
    lessonsProgress: '{completed} of {total} lessons complete',
    complete: 'Complete!',
    summit: 'Summit',
    // WorldSwitcher.tsx
    chooseYourPath: 'Choose Your Path',
    switchBetweenWorlds: 'Switch between wisdom worlds',
    active: 'Active',
    lessonsCount: '{completed}/{total} lessons',
    progressSaved: 'Your progress is saved across all worlds',
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
  // STORY
  // ─────────────────────────────────────────────────────────────────────────
  story: {
    trigger: {
      label: 'View Your Story',
      keepGrowing: 'Keep growing to unlock',
      tapToExperience: 'Tap to experience',
      demoTitle: 'Try with demo data',
      demoSubtitle: 'Experience your transformation story preview',
    },
    slides: {
      unknownType: 'Unknown slide type',
      firstLessonWas: 'Your first lesson was',
      daysSinceMoment: 'days since that moment',
      before: 'Before',
      after: 'After',
      patternShift: {
        title: 'Your Mind Shifted',
      },
      streak: {
        best: 'Best',
        totalDays: 'Total Days',
        consistency: 'Consistency',
      },
      achievementUnlockedCount: '{unlocked} of {total} unlocked',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SHARE
  // ─────────────────────────────────────────────────────────────────────────
  share: {
    hubLabel: 'TRANSFORMATION HUB',
    achievedBy: 'Achieved by',
    messageLabel: 'Share message:',
    cards: {
      streak: {
        title: '{count} Day Streak',
        subtitle: 'Daily Stoic Practice',
        message: "I've practiced Stoic wisdom for {count} days straight!",
        stats: {
          days: 'Days',
          lessons: 'Lessons',
          xp: 'XP',
        },
      },
      achievement: {
        titleFallback: 'Milestone Reached',
        messageFallback: 'I reached a new milestone on my journey!',
        stats: {
          virtue: 'Virtue',
          wisdom: 'wisdom',
          totalXp: 'Total XP',
        },
      },
      level: {
        title: 'Level {level}',
        message: 'I reached Level {level}: {title} on my journey of self-mastery!',
        stats: {
          level: 'Level',
          title: 'Title',
          xp: 'XP',
        },
      },
      journey: {
        title: '{days} Days of Growth',
        subtitle: 'My Transformation Journey',
        message: '{days} days, {lessons} lessons, {words} words of reflection. This is my transformation journey.',
        stats: {
          days: 'Days',
          lessons: 'Lessons',
          words: 'Words',
        },
      },
    },
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
