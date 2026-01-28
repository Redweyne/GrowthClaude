// ═══════════════════════════════════════════════════════════════════════════
// ARABIC TRANSLATIONS
// الترجمة العربية لمركز التحول
// ═══════════════════════════════════════════════════════════════════════════

const ar = {
  // ─────────────────────────────────────────────────────────────────────────
  // COMMON / SHARED
  // ─────────────────────────────────────────────────────────────────────────
  common: {
    back: 'رجوع',
    continue: 'متابعة',
    next: 'التالي',
    skip: 'تخطي',
    save: 'حفظ',
    cancel: 'إلغاء',
    done: 'تم',
    close: 'إغلاق',
    loading: 'جارٍ التحميل...',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة',
    yes: 'نعم',
    no: 'لا',
    ok: 'حسناً',
    submit: 'إرسال',
    delete: 'حذف',
    edit: 'تعديل',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',
    complete: 'مكتمل',
    incomplete: 'غير مكتمل',
    locked: 'مقفل',
    unlocked: 'مفتوح',
    today: 'اليوم',
    tomorrow: 'غداً',
    yesterday: 'أمس',
    days: 'أيام',
    minutes: 'دقائق',
    hours: 'ساعات',
    words: 'كلمات',
    word: 'كلمة',
    xp: 'نقاط الخبرة',
    level: 'المستوى',
    streak: 'السلسلة',
    lessons: 'الدروس',
    exercises: 'التمارين',
    reflections: 'التأملات',
    achievements: 'الإنجازات',
    milestones: 'المراحل',
    daily: 'يومياً',
    weekly: 'أسبوعي',
    monthly: 'شهري',
    phase: 'المرحلة',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGE SELECTOR
  // ─────────────────────────────────────────────────────────────────────────
  languageSelector: {
    title: 'اختر لغتك',
    subtitle: 'اختر اللغة لرحلتك',
    continue: 'متابعة',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────────────────────────────────
  onboarding: {
    // Step labels
    steps: {
      welcome: 'مرحباً',
      yourName: 'اسمك',
      community: 'المجتمع',
      vision: 'الرؤية',
      purpose: 'الهدف',
      thePath: 'الطريق',
      commitment: 'الالتزام',
      begin: 'البداية',
    },

    // Welcome Step
    welcome: {
      takeBreath: 'خذ نفساً عميقاً.',
      hereForReason: 'أنت هنا لسبب ما.',
      notWorking: 'شيء ما في حياتك لا يسير',
      theWayYouWant: 'بالطريقة التي تريدها.',
      thatsWhy: 'لهذا السبب أنت هنا.',
      whatIf: 'ماذا لو 5 دقائق يومياً',
      couldChange: 'يمكنها تغيير من أنت؟',
      ancientWisdom: 'حكمة قديمة. ممارسة حديثة. تحول حقيقي.',
      learn: 'تعلّم',
      practice: 'مارس',
      transform: 'تحوّل',
      readyToBegin: 'أنا مستعد للبدء',
      noAccount: 'لا حاجة لحساب. دقيقتان فقط.',
    },

    // Name Step
    name: {
      beforeWeBegin: 'قبل أن نبدأ...',
      whatShallICall: 'بماذا أناديك؟',
      placeholder: 'اسمك الأول',
      honorToMeet: 'تشرفت بلقائك،',
      enterName: 'أدخل اسمك',
      staysPrivate: 'هذا يبقى خاصاً. بيننا فقط.',
    },

    // Identity Step
    identity: {
      title: 'هويتك المجهولة',
      subtitle: 'عندما تشارك تأملاتك مع المسافرين الآخرين،',
      subtitleLine2: 'كيف تريد أن يُشار إليك؟',
      brother: 'أخ',
      sister: 'أخت',
      traveler: 'مسافر',
      heHim: 'هو',
      sheHer: 'هي',
      theyThem: 'هم',
      fellowBrother: 'أخ زميل',
      fellowSister: 'أخت زميلة',
      fellowTraveler: 'مسافر زميل',
      othersWillSee: 'سيرى الآخرون:',
      reflected: 'تأمل...',
      privacyNote: 'اسمك وهويتك لا يُكشف عنهما أبداً.',
      privacyNote2: 'فقط هذا اللقب يظهر عند المشاركة بشكل مجهول.',
    },

    // Goal Step
    goal: {
      whoDoYouWant: 'من تريد أن تصبح؟',
      chooseTransformation: 'اختر التحول الذي يناديك',
      thisIsMyPath: 'هذا هو طريقي',
      chooseYour: 'اختر تحولك',
      goals: {
        calmer: {
          title: 'أكثر هدوءاً',
          description: 'الاستجابة بدلاً من ردة الفعل. إيجاد السكينة في الفوضى. أن تكون راسخاً.',
        },
        disciplined: {
          title: 'أكثر انضباطاً',
          description: 'الوفاء بكل التزام. أن تصبح شخصاً يمكنك الوثوق به.',
        },
        confident: {
          title: 'أكثر ثقة',
          description: 'التوقف عن الشك. الثقة بحكمك. التصرف بحزم.',
        },
        leader: {
          title: 'قائد أفضل',
          description: 'تحمل المسؤولية. الإلهام بالعمل. خدمة الآخرين.',
        },
        focused: {
          title: 'أكثر تركيزاً',
          description: 'حماية انتباهك. فعل ما يهم. إنهاء ما تبدأه.',
        },
        resilient: {
          title: 'أكثر مرونة',
          description: 'الانحناء دون الانكسار. النمو أقوى من خلال كل محنة.',
        },
      },
    },

    // Why Step
    why: {
      yourPath: 'طريقك:',
      whatsTheCost: {
        calmer: 'ما هو ثمن عدم إيجاد الهدوء؟',
        disciplined: 'ماذا خسرت بعدم المتابعة؟',
        confident: 'ما الذي يمنعك من الثقة بنفسك؟',
        leader: 'لماذا يحتاج العالم أن تتقدم؟',
        focused: 'ماذا يمكنك أن تخلق باهتمام غير منقسم؟',
        resilient: 'لأي تحدٍ تستعد؟',
      },
      subtext: {
        calmer: 'فكر في كيف يؤثر التوتر على حياتك وعلاقاتك وصحتك.',
        disciplined: 'فكر في الوعود التي قطعتها لنفسك ولم تفِ بها. الأهداف المهجورة.',
        confident: 'فكر في الفرص التي فاتتك. الكلمات التي لم تُقال.',
        leader: 'فكر في من يعتمد عليك. ما يمكنك خلقه.',
        focused: 'فكر في أعمق أعمالك. المشروع الأكثر أهمية.',
        resilient: 'فكر في ما هو قادم. ما تحتاج أن تكون مستعداً له.',
      },
      placeholder: {
        calmer: 'عندما أكون ردة فعل، أؤذي من أحب. أتخذ قرارات أندم عليها. لا أستطيع النوم. أحتاج للتغيير لأن...',
        disciplined: 'كلما استسلمت، أثق بنفسي أقل. تركت أحلاماً لأنني لم أستطع الاستمرار. أحتاج للتغيير لأن...',
        confident: 'أبقى صامتاً عندما يجب أن أتكلم. لا أسعى لما أريد لأنني خائف من عدم كفايتي. أحتاج للتغيير لأن...',
        leader: 'الناس ينظرون إليّ لكنني أتراجع. لدي أفكار لكنني لا أتصرف. أحتاج لأصبح قائداً لأن...',
        focused: 'أبعثر طاقتي على كل شيء ولا أتقن شيئاً. أفضل أعمالي لا تُنجز لأنني دائماً مشتت. أحتاج للتغيير لأن...',
        resilient: 'الحياة أسقطتني من قبل وبقيت على الأرض طويلاً. أعلم أن أوقاتاً أصعب ستأتي، وأحتاج لأكون أقوى لأن...',
      },
      wordCount: '{count} كلمات',
      moreNeeded: '({count} أخرى مطلوبة)',
      anchorText: 'سيكون هذا مرساتك. يمكنك دائماً العودة إليه.',
      beHonest: 'اكتب 10 كلمات على الأقل. كن صادقاً مع نفسك.',
      thisIsMyTruth: 'هذه هي حقيقتي',
      writeYourWhy: 'اكتب لماذا...',
      pressToSubmit: 'اضغط {key}+Enter للمتابعة',
    },

    // Path Step
    path: {
      heresHow: 'هكذا يعمل',
      yourDailyPath: 'طريقك اليومي',
      phase1: {
        title: 'الدرس',
        subtitle: 'الحكمة القديمة تصبح حقيقية',
        description: 'كل يوم، تعلم مبدأ قوياً يمكنه تحويل رؤيتك للعالم.',
        duration: '~3 دقائق',
      },
      phase2: {
        title: 'الصدى',
        subtitle: 'علّم ما تتعلم',
        description: 'استجب لتأمل مسافر آخر. التعليم يعمق فهمك.',
        duration: '~1 دقيقة',
      },
      phase3: {
        title: 'التمرين',
        subtitle: 'طبقه في حياتك',
        description: 'خمسة تمارين لجعل حكمة اليوم حقيقية. هنا يحدث التحول.',
        duration: '~3 دقائق',
      },
      sameLesson: 'نفس الدرس. نفس اليوم. معاً.',
      neverAlone: 'الجميع يتعلم نفس الحكمة في نفس اليوم. أنت لست وحدك في هذه الرحلة.',
      totalTime: 'المجموع:',
      intentionalGrowth: 'من النمو المقصود، كل يوم',
      iUnderstand: 'أفهم الطريق',
    },

    // Commitment Step
    commitment: {
      howMuchTime: 'كم من الوقت ستعطي لنفسك كل يوم؟',
      smallConsistent: 'صغير ومستمر يتفوق على كبير ومتقطع. اختر ما ستفعله فعلاً.',
      iCommit: 'أنا،',
      commitTo: 'ألتزم بـ',
      minutesDaily: 'دقائق يومياً',
      toBecome: 'لأصبح',
      canChangeAnytime: 'يمكنك تغيير هذا في أي وقت. ما يهم هو أن تحضر.',
      iCommitToThis: 'أنا ألتزم بهذا',
      chooseYour: 'اختر التزامك',
      commitments: {
        fiveMin: '5 دقائق',
        fiveMinDesc: 'فقط ابدأ',
        tenMin: '10 دقائق',
        tenMinDesc: 'موصى به',
        fifteenMin: '15 دقيقة',
        fifteenMinDesc: 'اذهب أعمق',
        twentyMin: '20 دقيقة',
        twentyMinDesc: 'تحوّل',
      },
    },

    // Ready Step
    ready: {
      youveChosen: 'اخترت أن تصبح',
      min: 'دقيقة',
      daily: 'يومياً',
      stoicWisdom: 'الحكمة الرواقية',
      wontWalkAlone: 'لن تسير في هذا الطريق وحدك.',
      mentorWillGuide: 'سيرشدك مرشد—يستجيب لتأملاتك',
      wisdomTailored: 'بحكمة مصممة لرحلتك.',
      youreReady: 'أنت جاهز.',
      firstLessonAwaits: 'درسك الأول ينتظرك.',
      beginMyJourney: 'ابدأ رحلتي',
      personYouBecome: 'الشخص الذي تصبحه يتشكل بما تفعله كل يوم.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DAILY FLOW HOME
  // ─────────────────────────────────────────────────────────────────────────
  dailyFlow: {
    dayOf: 'اليوم {current} من {total}',
    todaysPracticeComplete: 'تم إكمال تمرين اليوم',
    doneTheWork: 'أنجزت العمل. دع الحكمة تتكامل.',
    tomorrowsGlimpse: 'لمحة عن الغد',
    wantToGoDeeper: 'تريد الذهاب أعمق؟',
    browseMoreEchoes: 'تصفح المزيد من الأصداء',
    connectWithTravelers: 'تواصل مع المسافرين الآخرين',
    redoPastLesson: 'أعد درساً سابقاً',
    revisitDeepen: 'راجع وتعمق',
    viewDashboard: 'عرض لوحة المعلومات',
    progressStats: 'التقدم والإحصائيات والمزيد',

    // Phases
    phases: {
      lesson: {
        title: 'درس اليوم',
        description: 'تعلم الحكمة',
        beginLesson: 'ابدأ الدرس',
        continueLesson: 'أكمل الدرس',
      },
      echo: {
        title: 'الصدى',
        subtitle: 'تواصل مع مسافر آخر',
        description: 'استجب لتأمل شخص ما',
        respondToReflection: 'استجب للتأمل',
      },
      practice: {
        title: 'تمرين اليوم',
        subtitle: '{count} تمارين',
        description: 'جسّد حكمة اليوم',
        beginPractice: 'ابدأ التمرين',
        continuePractice: 'أكمل التمرين',
        completed: '{current}/{total} مكتمل',
      },
    },
    completePrevious: 'أكمل المرحلة السابقة للفتح',
    yourCommitment: 'التزامك',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  dashboard: {
    yourJourney: 'رحلتك',
    dayOfTransformation: 'اليوم {day} من تحولك',
    youAreBecoming: 'أنت تصبح شخصاً',
    latestIdentity: 'آخر بيان هوية لك',
    goals: {
      calmer: 'يجد الهدوء الداخلي',
      disciplined: 'يبني الانضباط',
      confident: 'يطور الثقة',
      leader: 'يصبح قائداً',
      focused: 'يصقل التركيز',
      resilient: 'يبني المرونة',
      growing: 'ينمو',
      transforming: 'يتحول',
    },

    // Sections
    sections: {
      today: 'اليوم',
      yourJourney: 'رحلتك',
      community: 'المجتمع',
    },

    // Today's practice
    todaysPractice: 'تمرين اليوم',
    todaysPracticeComplete: 'تم إكمال تمرين اليوم',
    lesson: 'الدرس',
    echo: 'الصدى',

    // Journey section
    weeklyCheckin: 'المراجعة الأسبوعية',
    monthlyReview: 'المراجعة الشهرية',
    identity: 'الهوية',
    whoYoureBecoming: 'من تصبح',
    statements: '{count} بيانات',
    unlocked: '{count} مفتوح',

    // Community section
    browseEchoes: 'تصفح الأصداء',
    readRespond: 'اقرأ واستجب للتأملات',
    yourInbox: 'صندوق الوارد',
    responsesToReflections: 'ردود على تأملاتك',

    // Stats
    bestStreak: 'أفضل سلسلة',
    viewAllStats: 'عرض كل الإحصائيات',
    due: 'مستحق',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HOME / HERO GREETING
  // ─────────────────────────────────────────────────────────────────────────
  home: {
    greetings: {
      morning: 'صباح الخير',
      afternoon: 'مساء الخير',
      evening: 'مساء الخير',
    },
    wisdomQuotes: [
      'العقبة هي الطريق.',
      'ركز على ما تستطيع التحكم به.',
      'ابدأ العيش فوراً.',
      'أفضل انتقام هو ألا تكون مثل عدوك.',
      'لا تضيع المزيد من الوقت في الجدال حول ما يجب أن يكون عليه الشخص الصالح. كن واحداً.',
      'لديك القوة على عقلك - وليس الأحداث الخارجية. أدرك هذا، وستجد القوة.',
      'ليس الموت ما يجب أن يخافه المرء، بل عدم البدء في العيش أبداً.',
      'سعادة حياتك تعتمد على جودة أفكارك.',
      'اقبل الأشياء التي يربطك بها القدر.',
      'عندما تستيقظ في الصباح، فكر في امتياز أن تكون على قيد الحياة.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────────────────────────────────
  settings: {
    title: 'الإعدادات',
    personalize: 'خصص تجربتك',

    // Profile
    profile: 'الملف الشخصي',
    onPathOf: 'على طريق التحول',
    seeker: 'الباحث',

    // Language
    language: 'اللغة',
    selectLanguage: 'اختر لغتك',

    // Audio & Haptics
    audioHaptics: 'الصوت والاهتزاز',
    soundEffects: 'المؤثرات الصوتية',
    soundDesc: 'أصوات واجهة المستخدم والأجراس والتغذية الراجعة',
    hapticFeedback: 'ردود الفعل اللمسية',
    hapticDesc: 'الاهتزاز عند التفاعل',

    // Test Audio
    testAudio: 'اختبار الصوت',
    previewAudio: 'معاينة تجربة الصوت الغامرة',
    uiSounds: 'أصوات واجهة المستخدم',
    ambience: 'الأجواء',
    meditation: 'التأمل',

    // About
    about: 'حول',
    appName: 'مركز التحول',
    appDesc: 'رحلتك اليومية نحو النمو',
    version: 'الإصدار',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ECHOES / REFLECTIONS
  // ─────────────────────────────────────────────────────────────────────────
  echoes: {
    title: 'الأصداء',
    inbox: 'صندوق الأصداء',
    noEchoes: 'لا توجد أصداء بعد',
    noEchosDesc: 'أكمل درسك الأول لبدء استقبال الأصداء.',
    tabs: {
      received: 'المستلمة',
      sent: 'المرسلة',
      invitations: 'الدعوات',
      messages: 'الرسائل',
    },
    respondToReflection: 'استجب للتأمل',
    sendEcho: 'أرسل صدى',
    yourResponse: 'ردك...',
    characterMin: 'اكتب {min} حرف على الأقل',
    reflectedOn: 'تأمل في',
    // Echo Prompt
    bestWayToLearn: 'أفضل طريقة للتعلم',
    roleOfTeacher: '...هي أن تتقمص دور المعلم.',
    reflectOnJourney: 'هل تودّ التأمل في رحلة طالب آخر وتقديم التشجيع له؟',
    byTeachingOthers: 'بتعليم الآخرين، نعلّم أنفسنا.',
    proverb: 'مثل',
    letsDoThat: 'هيا نفعل ذلك',
    notRightNow: 'ليس الآن',
    // Echo Inbox
    fromFellow: 'من',
    viewAll: 'عرض الكل',
    noResponses: 'لا توجد ردود بعد',
    yourReflections: 'تأملاتك هناك، تجمع الحكمة.',
    pending: 'قيد الانتظار',
    hoursAgo: 'منذ {hours} ساعة',
    daysAgo: 'منذ {days} يوم',
    justNow: 'الآن',
    // Echo Review
    teacherWisdom: 'كلماتك ستوجه مسافراً آخر.',
    submitEcho: 'إرسال الصدى',
    skipForNow: 'تخطي الآن',
    // Echo Inbox
    reflections: 'التأملات',
    invitations: 'الدعوات',
    connectionsTab: 'الاتصالات',
    noReflectionsYet: 'لا توجد تأملات بعد',
    whenSomeoneReflects: 'عندما يتأمل شخص ما في كلماتك، سترى ذلك هنا',
    fellowReflected: 'تأمل {gender} زميل',
    openToConnecting: 'منفتح للتواصل',
    yourReflectionLabel: 'تأملك:',
    theirReflection: 'تأمل{possessive} لك:',
    theyreOpenToConnect: '{subject} منفتح للتواصل',
    wouldYouLikeToConnect: 'هل تريد التواصل مع هذا الشخص؟',
    writeInvitationMessage: 'اكتب رسالة مع دعوتك...',
    inviteToConnect: 'دعوة للتواصل',
    closeWithoutConnecting: 'إغلاق بدون تواصل',
    noPendingInvitations: 'لا توجد دعوات معلقة',
    invitationsWillAppear: 'ستظهر دعوات التواصل هنا',
    wantsToConnect: '{gender} زميل يريد التواصل',
    connectionRequest: 'طلب تواصل',
    decline: 'رفض',
    acceptConnect: 'قبول والتواصل',
    noConnectionsYet: 'لا توجد اتصالات بعد',
    conversationsWillAppear: 'عندما تتواصل مع شخص ما، ستظهر محادثاتكم هنا',
    growthConversation: 'محادثة النمو',
    withFellow: 'مع {gender} زميل',
    youConnectedThrough: 'تواصلتم عبر:',
    startConversation: 'ابدأ محادثة النمو...',
    typeMessage: 'اكتب رسالة...',
    // Echo Review
    reflectingOnJourney: 'التأمل في رحلة آخر',
    skip: 'تخطي',
    fellowReflectedOn: 'تأمل {gender} زميل في "{title}":',
    absorbWords: 'خذ لحظة لاستيعاب كلماته...',
    writeYourReflection: 'اكتب تأملك',
    fellowWrote: 'كتب {gender} زميل:',
    yourReflectionFor: 'تأملك لـ{pronoun}:',
    whatDoesTheirJourney: 'ما الذي تجعلك رحلتهم تفكر فيه؟',
    whatEncouragement: 'ما التشجيع الذي يمكنك تقديمه؟',
    pronounHim: 'ه',
    pronounHer: 'ها',
    pronounThem: 'هم',
    pronounHe: 'هو',
    pronounShe: 'هي',
    pronounThey: 'هم',
    writeYourThoughts: 'اكتب أفكارك...',
    word: 'كلمة',
    wordsPlural: 'كلمات',
    readyToSend: 'جاهز للإرسال',
    aBitMore: 'قليلاً أكثر...',
    openToConnectingIf: 'أنا منفتح للتواصل إذا أراد {pronoun} ذلك',
    sendReflection: 'إرسال التأمل',
    pressToSend: 'اضغط ⌘+Enter للإرسال',
    sendingReflection: 'جارٍ إرسال تأملك...',
    reflectionSent: 'تم إرسال التأمل',
    yourWordsWillReach: 'كلماتك ستصل إليهم.',
    connectedThroughReflection: 'متصل عبر التأمل',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISES
  // ─────────────────────────────────────────────────────────────────────────
  exercises: {
    title: 'التمرين',
    todaysPractice: 'تمرين اليوم',
    exerciseOf: 'التمرين {current} من {total}',
    scenario: 'السيناريو',
    reflection: 'التأمل',
    complete: 'أكمل التمرين',
    allComplete: 'تم إكمال جميع التمارين!',
    xpEarned: '+{xp} نقاط خبرة مكتسبة',
    backToHome: 'العودة للرئيسية',
    backToToday: 'العودة لليوم',
    completed: 'مكتمل',
    minRemaining: '~{min} دقيقة متبقية',
    practiceComplete: 'اكتمل التمرين!',
    wisdomTakingRoot: 'لقد أكملت جميع التمارين الخمسة لليوم. الحكمة تترسخ.',
    xpEarnedAmount: '+{amount} نقطة خبرة مكتسبة',
    exercisesCount: 'التمارين',
    completeTodaysPractice: 'أكمل تمرين اليوم',
    completeInAnyOrder: 'أكمل هذه التمارين بأي ترتيب لتجسيد حكمة اليوم.',
    scenarioTitle: 'السيناريو',
    quoteTitle: 'الاقتباس',
    applicationTitle: 'التطبيق',
    anchorTitle: 'المرساة',
    reframeTitle: 'إعادة الصياغة',
    whatWouldYouDo: 'ماذا ستفعل؟',
    chooseResponse: 'اختر رداً',
    selectOption: 'اختر خياراً',
    yourThoughts: 'أفكارك...',
    typeResponse: 'اكتب ردك...',
    submitResponse: 'إرسال الرد',
    nextExercise: 'التمرين التالي',
    exerciseComplete: 'اكتمل التمرين',
    wellDone: 'أحسنت!',
    back: 'رجوع',
    continueText: 'متابعة',
    // Application Exercise
    tomorrowOpportunity: 'غداً فرصة جديدة لممارسة ما تعلمته اليوم.',
    tomorrowIWill: 'غداً، سوف...',
    setTomorrowsIntention: 'حدد نية الغد',
    // Anchor Exercise
    createYourAnchor: 'أنشئ مرساتك',
    beginBreaths: 'ابدأ {count} أنفاس',
    breathOf: 'النفس {current} من {total}',
    breatheIn: 'استنشق...',
    breatheOut: 'ازفر...',
    hold: 'احبس...',
    keepAnchorGesture: 'حافظ على إيماءة المرساة أثناء التنفس',
    anchorSet: 'تم تثبيت المرساة',
    gestureLinked: 'إيماءتك مرتبطة الآن بحكمة اليوم. استخدمها كلما احتجت إلى تذكير.',
    // Reframe Exercise
    shiftPerspective: 'غيّر منظورك',
    shiftPerspectiveDesc: 'استخدم حكمة اليوم لرؤية هذا الموقف بشكل مختلف. العقبة غالباً ما تحتوي على الفرصة.',
    example: 'مثال',
    before: 'قبل:',
    after: 'بعد:',
    describeChallenge: 'صف التحدي، ثم أعد صياغته باستخدام حكمة اليوم...',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSONS
  // ─────────────────────────────────────────────────────────────────────────
  lessons: {
    title: 'الدرس',
    continue: 'متابعة',
    complete: 'أكمل الدرس',
    takeAction: 'اتخذ إجراء',
    returnWhenReady: 'عُد عندما تكون جاهزاً',
    reflect: 'تأمل في هذا...',
    yourReflection: 'تأملك...',
    chooseWisely: 'اختر بحكمة',
    timer: {
      breathe: 'تنفس',
      contemplate: 'تأمل',
      timeRemaining: 'الوقت المتبقي',
    },
    steps: {
      scenario: 'السيناريو',
      choice: 'الاختيار',
      commitment: 'الالتزام',
      goDoIt: 'اذهب ونفذ',
      returnConfirm: 'مرحباً بعودتك',
      reflection: 'التأمل',
      visualization: 'التصور',
      insight: 'البصيرة',
      mentor: 'المرشد',
      reward: 'مكتمل',
    },
    // Wisdom Step
    wisdom: {
      settleInto: 'استقر في هذه اللحظة...',
      letGo: 'دع ما مضى يرحل...',
      openToReceive: 'انفتح للاستقبال...',
      todaysWisdom: 'حكمة اليوم',
      iReceiveWisdom: 'أتلقى هذه الحكمة. ما هي الممارسة؟',
      pressEnter: 'اضغط Enter للمتابعة',
    },
    // Action Step
    action: {
      breathingPractice: 'تمرين التنفس',
      innerReflection: 'التأمل الداخلي',
      mindfulObservation: 'الملاحظة الواعية',
      freeWriting: 'الكتابة الحرة',
      mindfulAction: 'الفعل الواعي',
      practice: 'ممارسة',
      remaining: 'متبقي',
      readyToContinue: 'أنا مستعد للمتابعة',
      practiceComplete: 'اكتملت الممارسة',
      iPracticedFully: 'مارست بالكامل',
      iStruggled: 'واجهت صعوبة',
      honestyIsPractice: 'الصدق جزء من الممارسة',
      breatheIn: 'استنشق...',
      hold: 'احبس...',
      release: 'أطلق...',
      breath: 'نَفَس',
      breaths: 'أنفاس',
      breathsComplete: 'مكتمل',
      // Guidance messages
      guidance: {
        breathe: [
          'دع نَفَسك يجد إيقاعه الطبيعي...',
          'كل نَفَس يثبتك أعمق في الحضور...',
          'لا شيء يحتاج للإصلاح. فقط تنفس...',
          'نَفَسك يعرف الطريق...',
          'دع النَفَس الأخير يرحل. رحب بهذا...',
        ],
        reflect: [
          'وجّه انتباهك للداخل...',
          'ما الذي يظهر عندما تجلس مع هذا؟',
          'لاحظ دون حكم...',
          'دع السؤال يعمل عليك...',
          'الجواب يتشكل بالفعل...',
        ],
        observe: [
          'ليّن نظرتك...',
          'لاحظ ما تفوتك عادة...',
          'كل شيء يتحدث إذا استمعت...',
          'ابقَ مع ما تراه...',
          'دع الوعي يتوسع...',
        ],
        write: [
          'دع الكلمات تأتي دون تحرير...',
          'اكتب من الجسد، لا من العقل...',
          'لا توجد إجابة خاطئة هنا...',
          'اتبع الخيط أينما قاد...',
          'يدك تعرف ماذا تكتب...',
        ],
        act: [
          'اشعر بالطاقة تتراكم...',
          'أنت مستعد لهذا...',
          'الفعل ينبع من السكون...',
          'ثق بحدسك...',
          'تحرك بنية...',
        ],
      },
      integration: [
        'دع هذا يستقر في كيانك...',
        'احمل هذا الحضور معك...',
        'هذه اللحظة أصبحت جزءاً منك...',
        'الممارسة تستمر في الحياة اليومية...',
      ],
    },
    // Reflection Step
    reflection: {
      nowReflect: 'الآن، تأمل...',
      yourReflection: 'تأملك',
      beginWriting: 'ابدأ الكتابة...',
      word: 'كلمة',
      words: 'كلمات',
      readyToContinue: 'جاهز للمتابعة',
      aBitMoreDepth: 'قليلاً من العمق...',
      keepWriting: 'استمر في الكتابة...',
      private: 'خاص',
      shareAnonymously: 'مشاركة مجهولة',
      publicDesc: 'يمكن للآخرين قراءة كلماتك والتأمل فيها. قد تتلقى ردوداً مدروسة.',
      privateDesc: 'هذا التأمل لك فقط. لن يراه أحد آخر.',
      completeReflection: 'إكمال التأمل',
      continueOrWriteMore: 'متابعة (أو اكتب أكثر)',
      reflectionComplete: 'اكتمل التأمل',
      pressToSubmit: 'اضغط ⌘+Enter للمتابعة',
      encouragement: [
        'ما الذي يحضر لديك الآن؟',
        'لا تستعجل. دع الأفكار تأتي.',
        'اكتب كأن لا أحد سيقرأ هذا أبداً.',
        'كيف سيبدو الصدق هنا؟',
        'اذهب أعمق. ما الذي تحته؟',
      ],
      depth: [
        'لماذا هذا مهم لك؟',
        'متى شعرت بهذا من قبل؟',
        'ما الذي سيتغير لو صدقت هذا حقاً؟',
        'ما الذي تتجنب قوله؟',
        'ماذا سيكتب أحكم نسخة منك هنا؟',
      ],
      milestones: {
        finding: 'أنت تجد صوتك...',
        keepGoing: 'استمر. هنا يوجد الذهب.',
        goingDeep: 'جميل. أنت تغوص عميقاً.',
      },
    },
    // Reward Step
    reward: {
      takeABreath: 'خذ نفَساً.',
      youShowedUp: 'لقد حضرت اليوم.',
      growth: 'نمو',
      youveGrown: 'لقد نمَوت',
      dayStreak: 'يوم متتالي',
      continueToMentor: 'متابعة إلى المرشد',
    },
    // Mentor Step
    mentor: {
      sageIsSpeaking: 'الحكيم يتحدث...',
      completeLesson: 'إكمال الدرس',
      tryAgain: 'حاول مرة أخرى',
      reflectionNeedsDepth: 'تأملك يحتاج مزيداً من العمق',
      daysToStreak: '{days} {dayWord} أخرى لسلسلة أسبوعك الأولى',
      day: 'يوم',
      days: 'أيام',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────
  achievements: {
    title: 'الإنجازات',
    gallery: 'معرض الإنجازات',
    unlocked: 'مفتوح',
    locked: 'مقفل',
    progress: 'التقدم',
    earned: 'مكتسب',
    unlockedAt: 'فُتح في {date}',
    keepGoing: 'استمر للفتح!',
    celebration: 'تم فتح إنجاز!',
    newMilestone: 'مرحلة جديدة',
    continue: 'متابعة',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROGRESS
  // ─────────────────────────────────────────────────────────────────────────
  progress: {
    title: 'التقدم',
    dashboard: 'لوحة التقدم',
    stats: {
      totalLessons: 'إجمالي الدروس',
      totalReflections: 'إجمالي التأملات',
      totalWords: 'الكلمات المكتوبة',
      identityStatements: 'بيانات الهوية',
      achievements: 'الإنجازات',
      daysSinceStart: 'الأيام النشطة',
      avgReflectionLength: 'متوسط طول التأمل',
    },
    streakCalendar: 'تقويم السلسلة',
    currentStreak: 'السلسلة الحالية',
    longestStreak: 'أطول سلسلة',
    activityLog: 'سجل النشاط',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  identity: {
    title: 'الهوية',
    journey: 'رحلة الهوية',
    whoYoureBecoming: 'من تصبح',
    statements: 'بيانات الهوية',
    noStatements: 'لا توجد بيانات هوية بعد',
    noStatementsDesc: 'أكمل الدروس لاكتشاف من تصبح.',
    latestStatement: 'آخر بيان',
    addStatement: 'أضف بياناً',
    yourStatement: 'أنا شخص...',
    save: 'حفظ البيان',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKIN & ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  checkin: {
    weekly: {
      title: 'المراجعة الأسبوعية',
      subtitle: 'تأمل في أسبوعك',
      question: 'كيف كان هذا الأسبوع؟',
      submit: 'أكمل المراجعة',
      skip: 'تخطي هذا الأسبوع',
    },
    monthly: {
      title: 'التقييم الشهري',
      subtitle: 'قِس نموك',
      dimensions: {
        emotionalMastery: 'السيطرة العاطفية',
        discipline: 'الانضباط',
        perspective: 'المنظور',
        selfAwareness: 'الوعي الذاتي',
        growth: 'النمو',
      },
      submit: 'أكمل التقييم',
      skip: 'تخطي هذا الشهر',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COACHING
  // ─────────────────────────────────────────────────────────────────────────
  coaching: {
    beforeFirstLesson: {
      title: 'مرحباً بك في درسك الأول، {name}!',
      message: 'هنا يبدأ تحولك. خذ وقتك في كل خطوة. لا داعي للاستعجال.',
      cta: 'أنا جاهز',
    },
    afterLessonBeforeEcho: {
      title: 'تأمل جميل!',
      message: 'الآن ستتواصل مع مسافر آخر بالرد على تأمله. هذا هو الصدى - حيث التعليم يعمق تعلمك.',
      cta: 'متابعة إلى الصدى',
    },
    afterEchoBeforeExercises: {
      title: 'لقد تواصلت مع مسافر آخر!',
      message: 'الآن حان وقت تمرين اليوم - 5 تمارين قصيرة لتجسيد ما تعلمته.',
      cta: 'ابدأ التمرين',
    },
    afterFirstDayComplete: {
      title: 'تهانينا، {name}!',
      message: 'لقد أكملت يومك الأول من التحول. هذه مجرد البداية. عُد غداً لدرسك التالي.',
      cta: 'احتفل!',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WORLD / MAP
  // ─────────────────────────────────────────────────────────────────────────
  world: {
    title: 'خريطة الرحلة',
    currentWorld: 'العالم الحالي',
    switchWorld: 'تغيير العالم',
    progress: 'التقدم',
    dayOf: 'اليوم {current} من {total}',
    chapters: 'الفصول',
    lessons: 'الدروس',
    completed: 'مكتمل',
    locked: 'مقفل',
    worlds: {
      modernWisdom: 'الحكمة الحديثة',
      stoicism: 'الفلسفة الرواقية',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSFORMATION HUB
  // ─────────────────────────────────────────────────────────────────────────
  transformation: {
    title: 'مركز التحول',
    hub: 'تحولك',
    patterns: 'الأنماط',
    wisdom: 'سجلات الحكمة',
    assessment: 'التقييم',
    radar: 'رادار النمو',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HELP TOOLTIPS
  // ─────────────────────────────────────────────────────────────────────────
  help: {
    exercises: {
      title: 'التمارين اليومية',
      description: 'خمسة تمارين قصيرة لممارسة ما تعلمته اليوم. هنا يحدث التحول.',
    },
    echoes: {
      title: 'الأصداء',
      description: 'تأملات مجهولة من المسافرين الآخرين. استجب لأفكارهم لتعميق فهمك.',
    },
    worlds: {
      title: 'عوالم الحكمة',
      description: 'رحلات مختلفة من الحكمة. لكل عالم دروسه وتمارينه الخاصة.',
    },
    streak: {
      title: 'سلسلتك',
      description: 'عدد الأيام المتتالية التي مارست فيها. استمر!',
    },
    xp: {
      title: 'نقاط الخبرة',
      description: 'تُكتسب بإكمال الدروس والأصداء والتمارين. ارتقِ بالمستوى وأنت تنمو.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ERROR MESSAGES
  // ─────────────────────────────────────────────────────────────────────────
  errors: {
    generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    network: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    notFound: 'المحتوى غير موجود.',
    loadingFailed: 'فشل تحميل المحتوى.',
  },
} as const;

export default ar;
