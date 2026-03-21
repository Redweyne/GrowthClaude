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
    add: 'إضافة',
    copy: 'نسخ',
    copied: '\ت\م \ا\ل\ن\س\خ!',
    tapToContinue: '\ا\ض\غ\ط \ل\ل\م\ت\ا\ب\ع\ة',
    share: 'مشاركة',
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
    Milestones: 'الإنجازات',
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
    selectPrompt: 'اختر لغة',
    helper: 'يمكنك تغيير ذلك في أي وقت من الإعدادات',
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
      createOrigin: 'نقطة الأصل',
      begin: 'البداية',
    },

    // Auth Step — نقطة الأصل
    auth: {
      line1: 'لكل تحوّل نقطة أصل.',
      line2: 'اللحظة الدقيقة التي توقفت فيها عن المشاهدة وبدأت تصبح.',
      line3: 'هذه لحظتك.',
      line4: 'اختمها.',
      formTitle: 'نقطة أصلك',
      formSubtitle: 'احفظ تحوّلك. لا تفقد تقدمك أبداً.',
      sealWithGoogle: 'الختم بجوجل',
      or: 'أو',
      emailPlaceholder: 'بريدك الإلكتروني',
      passwordPlaceholder: 'أنشئ كلمة مرور',
      sealOrigin: 'اختم أصلي',
      continueAsWanderer: 'المتابعة كمسافر',
      alreadySealed: 'أصلك مختوم بالفعل.',
      sealedTitle: 'أصلك مختوم.',
      sealedSubtitle: 'الرحلة تبدأ الآن.',
      notConfigured: 'المصادقة غير مُهيأة — يمكنك المتابعة على أي حال.',
      errorAlreadyExists: 'هذا الطريق مُحدَّد بالفعل — حاول تسجيل الدخول بدلاً من ذلك',
      errorWeakPassword: 'الختم يحتاج المزيد من القوة — جرب كلمة مرور أطول',
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
    progressStats: '\ا\ل\ت\ق\د\م \و\ا\ل\إ\ح\ص\ا\ئ\ي\ا\ت \و\ا\ل\م\ز\ي\د',
    becoming: '\م\ا \ت\ص\ب\ح \ع\ل\ي\ه',
    becomingMore: '\ت\ص\ب\ح \أ\ك\ث\ر',
    lessons: '\د\ر\و\س',
    days: '\أ\ي\ا\م',
    bestStreak: '\أ\ف\ض\ل \س\ل\س\ل\ة',

    // World completion
    worldComplete: {
      label: 'اكتمل العالم',
      message: 'لقد مشيت كل خطوة في هذا العالم. الحكمة ملكك الآن.',
      daysCompleted: 'أيام',
      exploreWorlds: 'استكشف عوالم جديدة',
    },

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
  // PRACTICE MODE
  // ─────────────────────────────────────────────────────────────────────────
  practiceMode: {
    noPracticeAvailable: 'لا يوجد تمرين متاح',
    completeLessonsFirst: 'أكمل بعض الدروس أولاً، ثم عد هنا للتدرب وتعزيز ما تعلمته.',
    title: 'وضع التمرين',
    progressOf: '{current} من {total}',
    practiceSession: 'جلسة تمرين',
    applyWhatYouLearned: 'طبّق ما تعلمته على مواقف واقعية. هذا يعمّق فهمك ويبني حكمة دائمة.',
    scenarioCount: '{count} سيناريو',
    estimatedTime: '~{minutes} دقيقة',
    beginPractice: 'ابدأ التمرين',
    scenarioLabel: 'سيناريو',
    writeResponsePlaceholder: 'اكتب ردك...',
    reflectionLabel: 'تأمل',
    yourResponseLabel: 'ردك:',
    reflectPlaceholder: 'تأمل في هذا...',
    nextScenario: 'السيناريو التالي',
    completePractice: 'إنهاء التمرين',
    practiceComplete: 'تم إكمال التمرين!',
    practiceCompleteBody: 'لقد عززت فهمك بالتطبيق. هكذا تصبح الحكمة غريزة.',
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

    // Quote of the day
    quoteOfTheDay: 'حكمة اليوم',

    // Journey map labels
    chapterLabels: {
      start: 'البداية',
      chapter2: 'الفصل 2',
      mid: 'المنتصف',
      chapter4: 'الفصل 4',
      end: 'النهاية',
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
      {
        text: 'العقبة هي الطريق.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'ركز على ما تستطيع التحكم به.',
        author: 'Seneca',
      },
      {
        text: 'ابدأ العيش فوراً.',
        author: 'Epictetus',
      },
      {
        text: 'أفضل انتقام هو ألا تكون مثل عدوك.',
        author: 'Seneca',
      },
      {
        text: 'لا تضيع المزيد من الوقت في الجدال حول ما يجب أن يكون عليه الشخص الصالح. كن واحداً.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'لديك القوة على عقلك - وليس الأحداث الخارجية. أدرك هذا، وستجد القوة.',
        author: 'Epictetus',
      },
      {
        text: 'ليس الموت ما يجب أن يخافه المرء، بل عدم البدء في العيش أبداً.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'سعادة حياتك تعتمد على جودة أفكارك.',
        author: 'Seneca',
      },
      {
        text: 'اقبل الأشياء التي يربطك بها القدر.',
        author: 'Epictetus',
      },
      {
        text: 'عندما تستيقظ في الصباح، فكر في امتياز أن تكون على قيد الحياة.',
        author: 'Marcus Aurelius',
      },
    ],
    navigation: {
      progress: 'التقدم',
      Milestones: 'الإنجازات',
      identity: 'الهوية',
      practice: 'الممارسة',
      growth: 'النمو',
      echoes: 'الأصداء',
      map: 'الخريطة',
      worlds: 'العوالم',
    },
    streakMessage: {
      singular: 'يوم واحد من النمو المستمر',
      plural: '{count} أيام من النمو المستمر',
      none: 'ابدأ رحلتك اليوم',
    },
    level: {
      progressToNext: '{percent}% حتى المستوى التالي',
      motivation: {
        almostThere: 'اقتربت! واصل التقدم.',
        halfway: 'في منتصف الطريق. كل درس يقربك أكثر.',
        firstStep: 'رحلة الألف ميل تبدأ بخطوة واحدة.',
      },
    },
    lessonCard: {
      allCaughtUpTitle: 'أكملت كل شيء!',
      allCaughtUpBody: 'لقد أكملت جميع الدروس المتاحة في {world}. واصل الممارسة لترسيخ حكمتك.',
      actionInProgress: 'إجراء قيد التنفيذ',
      iveDoneItContinue: 'أنجزته — متابعة',
      todaysLesson: 'درس اليوم',
      estimatedMinutes: '~{minutes} د',
      lessonOfTotal: 'الدرس {current} من {total}',
      beginYourJourney: 'ابدأ رحلتك',
      actionAwaits: 'فعلك ينتظرك',
      completeThenReturn: 'أكملها ثم عد إلى هنا',
      youCommittedTo: 'لقد التزمت بـ:',
      rememberPrefix: 'تذكر:',
      rememberEmphasis: 'الفعل هو علاج القلق.',
      rememberSuffix: 'لا تكتفِ بالتفكير. افعل ذلك. ثم عد للتأمل.',
    },
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

    // Appearance
    appearance: 'المظهر',
    theme: 'السمة',
    themeDesc: 'بدّل بين الوضع الداكن والوضع الفاتح',

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

    // Account
    account: 'الحساب',
    signedInAs: 'مسجّل الدخول بوصفك',
    signOut: 'تسجيل الخروج',
    linkAccount: 'ربط حسابك',
    linkAccountDesc: 'زامن تقدمك على جميع أجهزتك',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    wanderingMode: 'وضع المسافر',
    wanderingModeDesc: 'التقدم محفوظ محلياً فقط',
    accountLinked: 'مرتبط',
    anonymous: 'مجهول',

    // Danger Zone
    dangerZone: 'منطقة الخطر',
    resetProgress: 'إعادة تعيين كل شيء',
    resetDesc: 'حذف جميع البيانات والبدء من جديد',
    resetButton: '\إ\ع\ا\د\ة \ت\ع\ي\ي\ن \ك\ل \ش\ي\ء',
    confirmResetTitle: '\إ\ع\ا\د\ة \ت\ع\ي\ي\ن \ك\ل \ا\ل\ت\ق\د\م\؟',
    confirmResetDesc: '\س\ي\ؤ\د\ي \ه\ذ\ا \إ\ل\ى \ح\ذ\ف \ج\م\ي\ع \د\ر\و\س\ك \و\ت\أ\م\ل\ا\ت\ك \و\س\ل\س\ل\ة \ا\ل\ا\س\ت\م\ر\ا\ر \و\ب\ي\ا\ن\ا\ت \ه\و\ي\ت\ك \ب\ش\ك\ل \ن\ه\ا\ئ\ي. \س\ت\ب\د\أ \م\ن \ا\ل\ص\ف\ر \ت\م\ا\م\ً\ا.',
    confirmReset: '\ن\ع\م\، \إ\ع\ا\د\ة \ا\ل\ت\ع\ي\ي\ن',
    resetWarning: 'سيؤدي هذا إلى حذف جميع تقدمك وتأملاتك وأصدائك نهائياً. لا يمكن التراجع عن هذا الإجراء.',
    resetConfirm: 'نعم، إعادة تعيين الكل',
    resetCancel: 'إلغاء',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROFILE PAGE
  // ─────────────────────────────────────────────────────────────────────────
  profilePage: {
    quickAccess: 'وصول سريع',
    todaysPractice: 'تمرين اليوم',
    weeklyCheckin: 'المراجعة الأسبوعية',
    monthlyAssessment: 'التقييم الشهري',
    browseEchoes: 'تصفح الأصداء',
    pastLessons: 'الدروس السابقة',
    identity: 'الهوية',
    statsDashboard: 'لوحة الإحصائيات',
    settings: 'الإعدادات',
    customize: 'تخصيص',
    accentColor: 'لون التمييز',
    title: 'اللقب',
    banner: 'البانر',
    autoAura: 'هالة تلقائية',
    motto: 'الشعار',
    mottoPlaceholder: 'شعارك الشخصي...',
    echoVisibility: 'ظهور الأصداء',
    visibleInEchoes: 'مرئي في الأصداء',
    hiddenInEchoes: 'مخفي في الأصداء',
    visibleDesc: 'يمكن للآخرين رؤية اسمك ولقبك على أصدائك',
    hiddenDesc: 'تظهر أصداؤك بشكل مجهول',
    shareProfileCard: 'مشاركة بطاقة الملف الشخصي',
    shareYourJourney: 'شارك رحلتك',
    download: 'تحميل',
    share: 'مشاركة',
    copied: 'تم النسخ!',
    due: 'مستحق',
    // Stats
    level: 'المستوى',
    streak: 'السلسلة',
    xp: 'XP',
    best: 'الأفضل',
    toNext: 'للتالي',
    // Avatar modal
    chooseAvatar: 'اختر صورتك الرمزية',
    avatarUpload: 'رفع',
    avatarInitials: 'الأحرف الأولى',
    avatarSilhouettes: 'صور رمزية',
    tapToUpload: 'انقر للرفع',
    chooseDifferent: 'اختر آخر',
    saveAvatar: 'حفظ الصورة',
    saving: 'جارٍ الحفظ...',
    chooseGradient: 'اختر تدرج لونى لصورتك الرمزية',
    choosePhilosophicalAvatar: 'اختر صورة رمزية فلسفية',
    // Tabs
    tabOverview: 'نظرة عامة',
    tabFrames: 'الإطارات',
    tabBadges: 'الشارات',
    tabJourney: 'الرحلة',
    // Frames
    frames: 'الإطارات',
    framesDesc: 'جهّز إطاراً لتخصيص حلقة صورتك الرمزية',
    supporterExclusive: 'حصري للداعمين',
    frameEquippedNote: 'انقر على إطارك مرة أخرى لاستخدام الإطار التلقائي',
    frameAutoNote: 'يتم تعيين إطارك تلقائياً بناءً على مستواك',
    // Badges
    myBadges: 'شاراتي',
    featuredBadge: 'الشارة المميزة',
    setFeaturedBadge: 'تعيين كمميزة',
    unfeaturedBadge: 'إزالة التمييز',
    earnedOn: 'حصلت عليها في',
    keepGoingToUnlock: 'استمر لفتح هذه الشارة',
    badgeCatStreak: 'السلسلة',
    badgeCatWorlds: 'العوالم',
    badgeCatSocial: 'اجتماعي',
    badgeCatMastery: 'إتقان',
    badgeCatSpecial: 'خاص',
    // Journey / Timeline
    transformationTimeline: 'خط زمني للتحول',
    noJourneyYet: 'ستظهر رحلتك هنا مع تقدمك',
    showLess: 'عرض أقل',
    showAllEvents: 'عرض جميع الأحداث ({count})',
    myEvolution: 'تطوري',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIMELINE
  // ─────────────────────────────────────────────────────────────────────────
  timeline: {
    journeyBegan: 'بداية الرحلة',
    journeyBeganDesc: 'خطوت أولى خطواتك على طريق التحول.',
    firstLesson: 'أول درس مكتمل',
    firstLessonDesc: 'أكملت درسك الأول.',
    streakMilestone: 'سلسلة {days} يوم',
    streakDesc: 'حافظت على سلسلة {days} يوم من الممارسة اليومية.',
    streakDescApprox: 'حافظت على سلسلة {days} يوم من الممارسة اليومية. (تقريبي)',
    levelUp: 'وصلت للمستوى {level}: {levelTitle}',
    levelUpDesc: 'تقدمت إلى {levelTitle} بـ {minXp} XP.',
    levelUpDescApprox: 'تقدمت إلى {levelTitle} بـ {minXp} XP. (تقريبي)',
    identityStatement: 'بيان الهوية',
    badgeUnlocked: 'شارة مفتوحة: {badgeName}',
    firstCheckin: 'أول مراجعة أسبوعية',
    firstCheckinDesc: 'تأملت في أسبوعك الأول من الممارسة.',
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
    fellowReflectedOnYourWords: 'تأمل {gender} زميل في كلماتك',
    fellowLabel: '{gender} زميل',
    openToConnecting: 'منفتح للتواصل',
    yourReflectionLabel: 'تأملك:',
    theirReflection: 'تأمل{possessive} لك:',
    theyreOpenToConnect: '{subject} منفتح للتواصل',
    wouldYouLikeToConnect: 'هل تريد التواصل مع هذا الشخص؟',
    writeInvitationMessage: 'اكتب رسالة مع دعوتك...',
    invitationMessageLabel: 'رسالت{possessive}:',
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
    pronounHis: 'ه',
    pronounHerPossessive: 'ها',
    pronounTheir: 'هم',
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
    // Mandatory Echo Flow
    mandatory: {
      phaseLabel: 'المرحلة 2: الصدى',
      communityConnection: 'اتصال المجتمع',
      connectBeforePractice: 'تواصل قبل الممارسة',
      encourageTraveler: 'قبل تمارينك، خذ لحظة لتشجيع مسافر آخر. كلماتك قد تكون بالضبط ما يحتاجه اليوم.',
      whyMatters: 'لماذا هذا مهم:',
      whyMattersDesc: 'عندما تتأمل في رحلة شخص آخر، تعمق فهمك الخاص. التعليم هو أعلى أشكال التعلم.',
      readReflection: 'اقرأ تأمل مسافر آخر',
      fellowReflectedOn: 'تأمل {gender} في "{title}":',
      absorbWords: 'خذ لحظة لاستيعاب كلماتهم حقًا...',
      writeYourEcho: 'اكتب صداك',
      fellowWrote: 'كتب {gender}:',
      yourEchoFor: 'صداك لـ {pronoun}:',
      shareInsight: 'شارك رؤية أو كلمة تشجيع أو اتصال برحلتك الخاصة.',
      writeThoughts: 'اكتب أفكارك...',
      readyToSend: 'جاهز للإرسال',
      moreWords: '{count} كلمات إضافية',
      openToConnect: 'أنا منفتح للتواصل أكثر',
      sendAndUnlock: 'إرسال الصدى وفتح التمارين',
      cmdEnterToSend: 'اضغط Cmd+Enter للإرسال',
      sendingEcho: 'جاري إرسال صداك...',
      echoSent: 'تم إرسال الصدى!',
      wordsWillBrighten: 'كلماتك ستضيء رحلة شخص ما.',
      continueToExercises: 'الاستمرار إلى التمارين',
    },
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
    continue: '\م\ت\ا\ب\ع\ة',
    agree: '\ن\ع\م',
    disagree: '\ل\ا',
    swipeHint: '\ا\س\ح\ب \ي\م\ي\ن\ً\ا \ل\ل\م\و\ا\ف\ق\ة \و\ي\س\ا\ر\ً\ا \ل\ع\د\م \ا\ل\م\و\ا\ف\ق\ة',
    seeResults: '\ش\ا\ه\د \م\ا \ي\ك\ش\ف\ه \ه\ذ\ا',
    dragToReorder: '\ا\س\ح\ب \ل\إ\ع\ا\د\ة \ا\ل\ت\ر\ت\ي\ب. \خ\ي\ا\ر\ك \ر\ق\م 1 \ي\ذ\ه\ب \إ\ل\ى \ا\ل\أ\ع\ل\ى.',
    lockInRanking: '\ث\ب\ّ\ت \ت\ر\ت\ي\ب\ي',
    yourTopChoice: '\خ\ي\ا\ر\ك \ر\ق\م 1:',
    forging: '\ج\ا\ر\ٍ \ا\ل\ص\ي\ا\غ\ة...',
    yourMantra: '\م\ا\ن\ت\ر\ا\ك',
    forgeMantra: '\ا\ص\ن\ع \م\ا\ن\ت\ر\ا\ي',
    selectMore: '\ا\خ\ت\ر {count} \أ\خ\ر\ى',
    dragToPlace: '\ا\ض\غ\ط \أ\و \ا\س\ح\ب \ل\ت\ح\د\ي\د \ا\ل\م\و\ض\ع\، \ث\م \ض\ع\ه\ا',
    placeHere: '\ض\ع \ه\ن\ا',
    somethingWentWrong: '\ح\د\ث \خ\ط\أ \م\ا',
    selected: '\م\ح\د\د',
    minRequired: '\ا\ل\ح\د \ا\ل\أ\د\ن\ى {min}',
    rapidVerdictLabel: '\ح\ك\م \س\ر\ي\ع',
    priorityTowerLabel: '\ب\ر\ج \ا\ل\أ\و\ل\و\ي\ا\ت',
    scenarioSnapLabel: '\ل\ق\ط\ة \ا\ل\س\ي\ن\ا\ر\ي\و',
    heatCheckLabel: '\م\ق\ي\ا\س \ا\ل\ش\د\ة',
    wordForgeLabel: '\ص\ي\ا\غ\ة \ا\ل\ك\ل\م\ا\ت',
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
      startPractice: 'ابدأ التمرين',
    },
    // Stage labels for LessonExperience progress indicator
    stages: {
      receivingWisdom: 'تلقي الحكمة',
      practicing: 'الممارسة',
      reflecting: 'التأمل',
      celebrating: 'الاحتفال',
      integration: 'التكامل',
    },
    // Step labels for FlexibleLessonExperience
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
      // Additional step labels
      theSituation: 'الموقف',
      yourChoice: 'اختيارك',
      yourCommitment: 'التزامك',
      takeAction: 'اتخذ إجراء',
      welcomeBack: 'مرحباً بعودتك',
      innerVision: 'الرؤية الداخلية',
      practice: 'الممارسة',
      sageWisdom: 'حكمة الحكيم',
      celebration: 'الاحتفال',
    },
    scenario: {
      continue: 'أشعر بهذا',
    },
    visualization: {
      continue: 'لقد رأيت',
      continueToReflect: 'متابعة التأمل',
    },
    commitment: {
      placeholder: 'سأفعل...',
      word: 'كلمة',
      words: 'كلمات',
      readyToCommit: 'جاهز للالتزام',
      moreNeeded: 'يتبقى {count}',
      commitButton: 'ألتزم بهذا',
      pressToSubmit: 'اضغط {key}+إدخال للمتابعة',
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
      wellDone: 'أحسنت',
      youMastered: 'لقد أتقنت',
      youveGrown: 'لقد نمَوت',
      continueToMentor: 'متابعة إلى المرشد',
      day: 'يوم',
      days: 'أيام',
      streak: 'سلسلة',
      levelUp: 'ارتقيت!',
    },
    // Mentor Step
    mentor: {
      sageIsSpeaking: 'الحكيم يتحدث...',
      completeLesson: 'إكمال الدرس',
      tryAgain: 'حاول مرة أخرى',
      reflectionNeedsDepth: 'تأملك يحتاج عمقاً أكثر',
      dayStreak: 'سلسلة {count} يومًا',
      daysToStreak: '{days} {dayWord} أخرى لسلسلة أسبوعك الأولى',
      day: 'يوم',
      days: 'أيام',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Milestones
  // ─────────────────────────────────────────────────────────────────────────
  Milestones: {
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
      Milestones: 'الإنجازات',
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
    title: 'رحلة الهوية',
    journey: 'رحلة الهوية',
    whoYoureBecoming: 'من تصبح',
    statements: 'بيانات الهوية',
    noStatements: 'لا توجد بيانات هوية بعد',
    noStatementsDesc: 'أكمل الدروس لاكتشاف من تصبح.',
    latestStatement: 'آخر بيان',
    addStatement: 'أضف بياناً',
    yourStatement: 'أنا شخص...',
    save: 'حفظ البيان',
    // IdentityJourney.tsx
    defineWhoYouAre: 'حدد من تصبح',
    statementsCount: '{count} بيان(ات) هوية مُدّعاة',
    whoAreYouBecoming: 'من تصبح؟',
    emptyStateDescription: 'بيانات الهوية تساعدك على تحديد وتعزيز من تريد أن تكون. الشخص الذي تدعيه اليوم يشكل من ستصبح غداً.',
    createFirstStatement: 'أنشئ بيانك الأول',
    iAmSomeoneWho: 'أنا شخص',
    yourEvolution: 'تطورك',
    evolutionMessage: '{name}، لقد ادعيت {count} هويات. كل بيان هو وعد لنفسك - إعلان عن من تصبح. استمر في الظهور كهذا الشخص.',
    selfInitiated: 'بدأ ذاتياً',
    // IdentityPromptModal.tsx
    completeStatement: '{name}، أكمل هذا البيان للمطالبة بهويتك.',
    promptInspiration: 'إلهام',
    tapForAnother: 'انقر لآخر',
    yourIdentityStatement: 'بيان هويتك',
    statementPlaceholder: 'يحضر كل يوم...',
    example: 'مثال',
    identityClaimed: 'تم المطالبة بالهوية',
    claiming: 'جارٍ المطالبة...',
    claimThisIdentity: 'طالب بهذه الهوية',
    minCharacters: 'يرجى كتابة 10 أحرف على الأقل',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKIN & ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  checkin: {
    title: 'المراجعة الأسبوعية',
    weekCheckin: 'مراجعة الأسبوع {week}',
    introMessage: 'خذ بضع دقائق للتأمل في رحلتك هذا الأسبوع. رؤاك تشكل نموك.',
    reflectionsCount: '{count} تأملات',
    duration: '~5 دقائق',
    completedCount: 'لقد أكملت {count} مراجعة(ات) حتى الآن',
    beginReflection: 'ابدأ التأمل',
    categories: {
      yourProgress: 'تقدمك',
      challengesFaced: 'التحديات المواجهة',
      keyInsights: 'الرؤى الرئيسية',
      lookingAhead: 'النظر للأمام',
      reflection: 'التأمل',
    },
    takeYourTime: 'خذ وقتك للتأمل...',
    yourReflection: 'تأملك',
    digDeeper: 'تعمق قليلاً...',
    nextReflection: 'التأمل التالي',
    completeCheckin: 'أكمل المراجعة',
    checkinComplete: 'اكتملت المراجعة!',
    completeMessage: 'تم التقاط تأمل الأسبوع {week}. وعيك الذاتي ينمو.',
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
      xpEarned: '+{xp} XP تم كسبها لإكمال التقييم',
      submit: 'أكمل التقييم',
      skip: 'تخطي هذا الشهر',
      progress: '{current} / {total}',
      scoreTitle: 'نتيجتك الشهرية',
      snapshot: 'إليك لمحة عن نموك',
      snapshotWithName: '{name}، إليك لمحة عن نموك',
      viewResults: 'عرض النتائج',
      minReflectionChars: 'اكتب ما لا يقل عن {count} حرفاً للمتابعة',
      saving: 'جارٍ الحفظ...',
      scoreLabels: {
        exceptional: 'استثنائي',
        strong: 'قوي',
        developing: 'يتطور',
        needsWork: 'بحاجة إلى عمل',
        justStarting: 'في البداية',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COACHING
  // ─────────────────────────────────────────────────────────────────────────
  coaching: {
    beforeFirstLesson: {
      title: 'درسك الأول',
      message: '{name}، اليوم الآلاف من الناس يتعلمون نفس الحكمة إلى جانبك.',
      subMessage: 'خذ وقتك. دع الكلمات تتغلغل. هنا يبدأ التحول.',
      button: 'ابدأ رحلتي',
      cta: 'أنا جاهز',
    },
    afterLessonBeforeEcho: {
      title: 'قوة التعليم',
      message: 'لقد تعلمت شيئاً قوياً. الآن، عمّقه بمساعدة شخص آخر.',
      subMessage: 'الرد على تأمل آخر ليس مجرد اتصال - هكذا تصبح الحكمة حكمة. عندما تُعلّم، تفهم حقاً.',
      button: 'أنا مستعد للتواصل',
      cta: 'متابعة إلى الصدى',
    },
    afterEchoBeforeExercises: {
      title: 'اجعلها حقيقية',
      message: 'المعرفة بدون ممارسة مجرد معلومات. حان الوقت لتطبيق حكمة اليوم في حياتك.',
      subMessage: 'خمسة تمارين قصيرة. كل منها يجلب الدرس إلى عالمك، تحدياتك، نموك.',
      button: 'هيا نمارس',
      cta: 'ابدأ التمرين',
    },
    afterFirstDayComplete: {
      title: 'اكتمل اليوم الأول',
      message: '{name}، لقد فعلتها. هكذا يبدأ التحول.',
      subMessage: 'يوم واحد في كل مرة. درس واحد في كل مرة. اختيار واحد في كل مرة. عُد غداً - درسك التالي سينتظرك.',
      button: 'سأعود',
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
    // WorldMap.tsx
    lessonsProgress: '{completed} من {total} درساً مكتملاً',
    complete: 'مكتمل!',
    summit: 'القمة',
    // WorldSwitcher.tsx
    chooseYourPath: 'اختر طريقك',
    switchBetweenWorlds: 'انتقل بين عوالم الحكمة',
    active: 'نشط',
    lessonsCount: '{completed}/{total} دروس',
    progressSaved: 'يتم حفظ تقدمك في جميع العوالم',
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
  // STORY
  // ─────────────────────────────────────────────────────────────────────────
  story: {
    trigger: {
      label: 'اعرض قصتك',
      keepGrowing: 'واصل النمو لفتحها',
      tapToExperience: 'اضغط لتجرب',
      demoTitle: 'جرّب ببيانات تجريبية',
      demoSubtitle: 'استكشف معاينة لقصة تحولك',
    },
    slides: {
      unknownType: 'نوع شريحة غير معروف',
      firstLessonWas: 'كان درسك الأول',
      daysSinceMoment: 'أيام منذ تلك اللحظة',
      identityStatementsCreated: 'تم إنشاء {count} عبارات هوية',
      wordsWrittenInReflection: 'تمت كتابة {count} كلمة في التأمل',
      before: 'قبل',
      after: 'بعد',
      patternShift: {
        title: 'تغيرت طريقة تفكيرك',
      },
      streak: {
        best: 'الأفضل',
        totalDays: 'إجمالي الأيام',
        consistency: 'الاتساق',
      },
      MilestoneUnlockedCount: '{unlocked} من {total} مفتوحة',
    },
    viewer: {
      title: 'قصة تحوّلك',
      keyboardHints: '← → للتنقل • مسافة للتقدم • p للإيقاف • m للصوت',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SHARE
  // ─────────────────────────────────────────────────────────────────────────
  share: {
    hubLabel: 'مركز التحول',
    achievedBy: 'حققه',
    messageLabel: 'رسالة المشاركة:',
    cards: {
      streak: {
        title: 'سلسلة {count} يوما',
        subtitle: 'ممارسة رواقية يومية',
        message: 'لقد مارست الحكمة الرواقية لمدة {count} يوما متتالية!',
        stats: {
          days: 'أيام',
          lessons: 'دروس',
          xp: 'XP',
        },
      },
      Milestone: {
        titleFallback: 'تم تحقيق إنجاز',
        messageFallback: 'حققت إنجازا جديدا في رحلتي!',
        stats: {
          virtue: 'فضيلة',
          wisdom: 'الحكمة',
          totalXp: 'إجمالي XP',
        },
      },
      level: {
        title: 'المستوى {level}',
        message: 'وصلت إلى المستوى {level}: {title} في رحلة إتقان الذات!',
        stats: {
          level: 'المستوى',
          title: 'اللقب',
          xp: 'XP',
        },
      },
      journey: {
        title: '{days} يوما من النمو',
        subtitle: 'رحلة تحولي',
        message: '{days} يوما، {lessons} دروس، {words} كلمة من التأمل. هذه رحلة تحولي.',
        stats: {
          days: 'أيام',
          lessons: 'دروس',
          words: 'كلمات',
        },
      },
    },
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
  site: {
    nav: {
      features: 'المميزات',
      howItWorks: 'كيف يعمل',
      pricing: 'الأسعار',
      faq: 'الأسئلة الشائعة',
      joinBeta: 'انضم للنسخة التجريبية',
    },
    hero: {
      overline: 'نسخة تجريبية مفتوحة — مجاني',
      headline: 'حوّل الحكمة إلى تغيير يومي.',
      subhead: 'تطبيق تحول ذاتي موجّه. دروس يومية من الرواقية والفلسفة الحديثة والمزيد. تأملات مجهولة. دليل مرئي على النمو. 10 دقائق في اليوم.',
      cta: 'ابدأ النسخة التجريبية',
      secondary: 'شاهد كيف يعمل',
    },
    proof: {
      daily: 'ممارسة يومية موجهة',
      worlds: 'عالمان متاحان',
      exercises: '5 تمارين يومية',
      anonymous: 'مجهول تماماً',
      free: 'مجاني للبدء',
    },
    howItWorks: {
      title: 'كيف يعمل',
      subtitle: 'ثلاث خطوات. عشر دقائق. تغيير حقيقي.',
      step1: {
        title: 'تعلّم',
        desc: 'درس حكمة يُفتح للجميع — مستوحى من الرواقية والفلسفة الحديثة والمزيد. استوعب، أبرز، تأمّل.',
      },
      step2: {
        title: 'تأمّل',
        desc: 'شارك صداك المجهول. اقرأ ما يشعر به الآخرون. لا ملفات شخصية، لا أحكام — فقط بصيرة إنسانية خالصة.',
      },
      step3: {
        title: 'تحوّل',
        desc: 'أكمل تمارين تعيد برمجة تفكيرك. شاهد هويتك تتطور. انظر الدليل في جدولك الزمني.',
      },
    },
    showcase: {
      title: 'شاهده أثناء العمل',
      subtitle: 'شاشات حقيقية من التطبيق. بدون نماذج.',
      screens: {
        home: 'الممارسة اليومية',
        lesson: 'دروس الحكمة',
        echo: 'الأصداء المجهولة',
        exercises: 'التمارين اليومية',
        sparks: 'فيديوهات تحفيزية',
      },
    },
    arc: {
      title: 'أول 30 يوماً لك',
      subtitle: 'هكذا تبدو الرحلة فعلاً.',
      day1: {
        label: 'اليوم 1-3',
        desc: 'اعثر على إيقاعك. أول درس، أول صدى، أولى التمارين.',
      },
      day7: {
        label: 'اليوم 7',
        desc: 'سلسلة 7 أيام. شارة محارب الأسبوع مفتوحة.',
      },
      day14: {
        label: 'اليوم 14',
        desc: 'تصريحات هويتك تُظهر تطوراً حقيقياً. الجدول الزمني للتحول ينمو.',
      },
      day30: {
        label: 'اليوم 30',
        desc: 'مستوى 5+. شارات متعددة مكتسبة. ممارسة يومية ثبتت.',
      },
    },
    sticks: {
      title: 'لماذا يستمر',
      subtitle: 'معظم تطبيقات تحسين الذات تُهجر خلال أسبوع. إليك لماذا هذا التطبيق مختلف.',
      headers: {
        feature: 'الميزة',
        others: 'تطبيقات أخرى',
        solonsway: 'SolonsWay',
      },
      rows: {
        content: {
          label: 'المحتوى اليومي',
          others: 'تكرار نفس النصائح',
          ours: 'فلسفة جديدة يومياً',
        },
        social: {
          label: 'الطبقة الاجتماعية',
          others: 'عام، استعراضي',
          ours: 'مجهول، أصيل',
        },
        progress: {
          label: 'تتبع التقدم',
          others: 'سلاسل فقط',
          ours: 'تطور الهوية + جدول زمني',
        },
        time: {
          label: 'الوقت المطلوب',
          others: '30-60 دقيقة',
          ours: '10 دقائق',
        },
        gamification: {
          label: 'التحفيز',
          others: 'ذنب وتذكيرات',
          ours: 'شارات، إطارات، مستويات',
        },
      },
    },
    pricing: {
      title: 'اختر مسارك',
      subtitle: 'ابدأ مجاناً. ادعم المهمة إذا كانت تصدح معك.',
      free: {
        name: 'بيتا مجانية',
        price: '$0',
        period: 'مجاني خلال البيتا',
        cta: 'انضم مجاناً',
        features: {
          f1: 'الممارسة اليومية الكاملة',
          f2: 'دروس + أصداء + تمارين',
          f3: 'سباركس (فيديوهات تحفيزية)',
          f4: 'عالمان (الرواقية، الحكمة الحديثة)',
          f5: 'تطور الهوية والجدول الزمني',
          f6: 'ملف شخصي مع إطارات وشارات',
        },
      },
      supporter: {
        name: 'داعم',
        price: '$4.99',
        period: '/شهر',
        cta: 'كن داعماً',
        features: {
          f1: 'كل شيء في المجاني',
          f2: 'بدون إعلانات عند الإطلاق',
          f3: 'شهر مجاني من الخطة المدفوعة (قيمة $19.99)',
          f4: 'إطارات وبانرات متحركة حصرية',
          f5: 'تمارين تعاونية',
          f6: 'شارة + لقب داعم',
          f7: 'المزيد من المزايا قادمة',
        },
      },
      founder: {
        name: 'عضو مؤسس',
        badge: 'أفضل قيمة',
        price: '$19.99',
        period: '/شهر',
        cta: 'كن عضواً مؤسساً',
        features: {
          f1: 'كل شيء في خطة الداعم',
          f2: '3 أشهر مجانية من الخطة المدفوعة (قيمة $59.97)',
          f3: 'شارة عضو مؤسس متحركة (دائمة)',
          f4: 'إطار وبانر متحرك حصري',
          f5: 'وصول مبكر للعوالم الجديدة',
          f6: 'اسمك في الشكر',
          f7: 'تقدير دائم',
        },
      },
      checkout: {
        desc: 'أدخل بريدك الإلكتروني لبدء الدفع. يمكنك إنشاء حسابك لاحقاً — مزاياك ستكون بانتظارك.',
        placeholder: 'بريدك@الإلكتروني.com',
        submit: 'متابعة إلى الدفع',
        cancel: 'إلغاء',
      },
      success: {
        title: 'تم الدفع بنجاح!',
        desc: 'شكراً لدعمك. أنشئ حسابك الآن لتفعيل مزاياك، أو عد لاحقاً — ستكون بانتظارك.',
        cta: 'إنشاء حسابي',
        later: 'سأفعل ذلك لاحقاً',
      },
      cancelled: {
        title: 'تم إلغاء الدفع',
        desc: 'لا مشكلة — يمكنك المحاولة مرة أخرى في أي وقت، أو البدء بالخطة المجانية.',
        cta: 'حاول مرة أخرى',
        free: 'انضم مجاناً بدلاً من ذلك',
      },
    },
    faq: {
      title: 'أسئلة وأجوبة',
      q1: {
        q: 'ما هو SolonsWay؟',
        a: 'تطبيق تحول ذاتي يومي مبني على الفلسفة والتأمل المجتمعي المجهول والتمارين المنظمة. فكر فيه كصالة رياضية لعقلك — 10 دقائق في اليوم.',
      },
      q2: {
        q: 'هل سيبقى مجانياً دائماً؟',
        a: 'الخطة المجانية تتضمن الممارسة اليومية الكاملة. نؤمن بأن التجربة الأساسية يجب أن تبقى متاحة دائماً. الخطط المدفوعة تفتح حصريات.',
      },
      q3: {
        q: 'ما هي السباركس؟',
        a: 'فيديوهات تحفيزية قصيرة مختارة لإلهام ممارستك اليومية. سباركس جديدة تُضاف بانتظام.',
      },
      q4: {
        q: 'هل بياناتي خاصة؟',
        a: 'الأصداء (التأملات) مجهولة تماماً. لا أسماء، لا ملفات شخصية مرفقة. رحلة تحولك لك وحدك.',
      },
      q5: {
        q: 'ماذا يحصل الداعمون والمؤسسون؟',
        a: 'تجميلات حصرية (إطارات، شارات، بانرات)، بدون إعلانات، أشهر مجانية من الخطة المدفوعة المستقبلية، وتقدير كمن آمن بهذا من البداية.',
      },
      q6: {
        q: 'هل يمكنني الإلغاء في أي وقت؟',
        a: 'نعم. بدون عقود، بدون التزام. ألغِ من لوحة تحكم Stripe في أي وقت.',
      },
    },
    final: {
      headline: 'تحوّلك يبدأ اليوم.',
      subhead: 'انضم لآلاف يبنون ممارسة يومية تستمر فعلاً.',
      cta: 'ابدأ النسخة التجريبية — مجاناً',
    },
    sticky: {
      cta: 'انضم مجاناً',
    },
    footer: {
      copy: '© 2026 SolonsWay. جميع الحقوق محفوظة.',
    },
  },

  agora: {
    title: 'الأغورا',
    subtitle: 'أصوات المجتمع',
    ctaTitle: 'شارك صوتك',
    ctaSubtitle: 'ساهم في تشكيل مستقبل طريق سولون',
    filterAll: 'الكل',
    filterIdeas: 'أفكار',
    filterBugs: 'أخطاء',
    filterLove: 'إعجاب',
    filterQuestions: 'أسئلة',
    sortTop: 'الأعلى',
    sortNew: 'الأحدث',
    posts: 'منشورات',
    newPost: 'منشور جديد',
    pickCategory: 'ما نوع المنشور؟',
    postPlaceholder: 'شارك فكرة، أبلغ عن خطأ، أو أخبرنا بما يعجبك...',
    minWords: 'كلمات كحد أدنى',
    submitPost: 'انشر في الأغورا',
    posting: 'جاري النشر...',
    postPublished: 'تم سماع صوتك',
    thankYou: 'شكراً لمساهمتك في تشكيل هذه الرحلة',
    categoryIdea: 'فكرة',
    categoryBug: 'خطأ',
    categoryLove: 'إعجاب',
    categoryQuestion: 'سؤال',
    statusHeard: 'تم الاطلاع',
    statusInProgress: 'قيد التنفيذ',
    statusDone: 'تم',
    emptyTitle: 'الأغورا هادئة',
    emptyDescription: 'كن أول من يشارك أفكاره ويشكّل هذا المجتمع.',
    votes: 'أصوات',
    comments: 'تعليقات',
    tapToRead: 'اضغط للقراءة والتعليق',
    noCommentsYet: 'لا توجد تعليقات بعد — كن أول من يشارك',
    writeComment: 'اكتب تعليقاً...',
    communityVoice: 'صوت المجتمع',
    you: 'أنت',
    member: 'عضو',
  },
} as const;

export default ar;




