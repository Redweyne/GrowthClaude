// ═══════════════════════════════════════════════════════════════════════════
// FRENCH TRANSLATIONS
// Traductions françaises pour Transformation Hub
// ═══════════════════════════════════════════════════════════════════════════

const fr = {
  // ─────────────────────────────────────────────────────────────────────────
  // COMMON / SHARED
  // ─────────────────────────────────────────────────────────────────────────
  common: {
    back: 'Retour',
    continue: 'Continuer',
    next: 'Suivant',
    skip: 'Passer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    done: 'Terminé',
    close: 'Fermer',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    retry: 'Réessayer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    submit: 'Soumettre',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    copy: 'Copier',
    copied: 'Copié !',
    share: 'Partager',
    settings: 'Paramètres',
    profile: 'Profil',
    complete: 'Terminé',
    incomplete: 'Incomplet',
    locked: 'Verrouillé',
    unlocked: 'Déverrouillé',
    today: "Aujourd'hui",
    tomorrow: 'Demain',
    yesterday: 'Hier',
    days: 'jours',
    minutes: 'minutes',
    hours: 'heures',
    words: 'mots',
    word: 'mot',
    xp: 'XP',
    level: 'Niveau',
    streak: 'Série',
    lessons: 'Leçons',
    exercises: 'Exercices',
    reflections: 'Réflexions',
    achievements: 'Accomplissements',
    milestones: 'Étapes',
    daily: 'quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    phase: 'Phase',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGE SELECTOR
  // ─────────────────────────────────────────────────────────────────────────
  languageSelector: {
    title: 'Choisissez Votre Langue',
    subtitle: 'Sélectionnez la langue de votre parcours',
    continue: 'Continuer',
    selectPrompt: 'Sélectionnez une langue',
    helper: 'Vous pouvez changer cela à tout moment dans les paramètres',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ONBOARDING
  // ─────────────────────────────────────────────────────────────────────────
  onboarding: {
    // Step labels
    steps: {
      welcome: 'Bienvenue',
      yourName: 'Votre Nom',
      community: 'Communauté',
      vision: 'Vision',
      purpose: 'Objectif',
      thePath: 'Le Chemin',
      commitment: 'Engagement',
      createOrigin: 'Point d\'Origine',
      begin: 'Commencer',
    },

    // Auth Step — Le Point d'Origine
    auth: {
      line1: 'Chaque transformation a un point d\'origine.',
      line2: 'Le moment exact où vous avez arrêté d\'observer et commencé à devenir.',
      line3: 'C\'est le vôtre.',
      line4: 'Scellez-le.',
      formTitle: 'Votre Point d\'Origine',
      formSubtitle: 'Sauvegardez votre transformation. Ne perdez jamais votre progression.',
      sealWithGoogle: 'Sceller avec Google',
      or: 'ou',
      emailPlaceholder: 'Votre e-mail',
      passwordPlaceholder: 'Créer un mot de passe',
      sealOrigin: 'Sceller Mon Origine',
      continueAsWanderer: 'Continuer en tant que voyageur',
      alreadySealed: 'Votre origine est déjà scellée.',
      sealedTitle: 'Votre origine est scellée.',
      sealedSubtitle: 'Le voyage commence maintenant.',
      notConfigured: 'Authentification non configurée — vous pouvez quand même continuer.',
      errorAlreadyExists: 'Ce chemin est déjà marqué — essayez de vous connecter',
      errorWeakPassword: 'Le sceau a besoin de plus de force — essayez un mot de passe plus long',
    },

    // Welcome Step
    welcome: {
      takeBreath: 'Respirez un instant.',
      hereForReason: 'Vous êtes ici pour une raison.',
      notWorking: 'Quelque chose dans votre vie ne fonctionne pas',
      theWayYouWant: 'comme vous le souhaitez.',
      thatsWhy: "C'est pour cela que vous êtes ici.",
      whatIf: 'Et si 5 minutes par jour',
      couldChange: 'pouvaient changer qui vous êtes ?',
      ancientWisdom: 'Sagesse ancienne. Pratique moderne. Transformation réelle.',
      learn: 'Apprendre',
      practice: 'Pratiquer',
      transform: 'Transformer',
      readyToBegin: 'Je suis prêt à commencer',
      noAccount: 'Pas de compte nécessaire. 2 minutes suffisent.',
    },

    // Name Step
    name: {
      beforeWeBegin: 'Avant de commencer...',
      whatShallICall: 'Comment dois-je vous appeler ?',
      placeholder: 'Votre prénom',
      honorToMeet: "C'est un honneur de vous rencontrer,",
      enterName: 'Entrez votre nom',
      staysPrivate: "Cela reste privé. C'est entre nous.",
    },

    // Identity Step
    identity: {
      title: 'Votre Identité Anonyme',
      subtitle: 'Lorsque vous partagez des réflexions avec les autres voyageurs,',
      subtitleLine2: 'comment souhaitez-vous être désigné(e) ?',
      brother: 'Frère',
      sister: 'Sœur',
      traveler: 'Voyageur',
      heHim: 'Il/Lui',
      sheHer: 'Elle',
      theyThem: 'Iel',
      fellowBrother: 'Un frère',
      fellowSister: 'Une sœur',
      fellowTraveler: 'Un voyageur',
      othersWillSee: 'Les autres verront :',
      reflected: 'a réfléchi...',
      privacyNote: 'Votre nom et identité ne sont jamais révélés.',
      privacyNote2: "Seul ce titre est affiché lorsque vous partagez anonymement.",
    },

    // Goal Step
    goal: {
      whoDoYouWant: 'qui voulez-vous devenir ?',
      chooseTransformation: 'Choisissez la transformation qui vous appelle',
      thisIsMyPath: "C'est mon chemin",
      chooseYour: 'Choisissez votre transformation',
      goals: {
        calmer: {
          title: 'Plus Calme',
          description: 'Répondre au lieu de réagir. Trouver la sérénité dans le chaos. Être inébranlable.',
        },
        disciplined: {
          title: 'Plus Discipliné',
          description: 'Tenir chaque engagement. Devenir quelqu\'un en qui vous pouvez avoir confiance.',
        },
        confident: {
          title: 'Plus Confiant',
          description: 'Arrêter de douter. Faire confiance à votre jugement. Agir avec détermination.',
        },
        leader: {
          title: 'Un Meilleur Leader',
          description: 'Prendre ses responsabilités. Inspirer par l\'action. Servir les autres.',
        },
        focused: {
          title: 'Plus Concentré',
          description: 'Protéger votre attention. Faire ce qui compte. Terminer ce que vous commencez.',
        },
        resilient: {
          title: 'Plus Résilient',
          description: 'Plier sans rompre. Devenir plus fort à travers chaque adversité.',
        },
      },
    },

    // Why Step
    why: {
      yourPath: 'Votre chemin :',
      whatsTheCost: {
        calmer: 'Quel est le prix de ne pas trouver le calme ?',
        disciplined: "Qu'avez-vous perdu en ne tenant pas vos engagements ?",
        confident: "Qu'est-ce qui vous empêche de vous faire confiance ?",
        leader: 'Pourquoi le monde a-t-il besoin que vous vous leviez ?',
        focused: 'Que pourriez-vous créer avec une attention indivisée ?',
        resilient: 'À quel défi vous préparez-vous ?',
      },
      subtext: {
        calmer: 'Pensez à comment le stress affecte votre vie, vos relations, votre santé.',
        disciplined: 'Pensez aux promesses que vous vous êtes faites et non tenues. Les objectifs abandonnés.',
        confident: 'Pensez aux opportunités manquées. Les mots non prononcés.',
        leader: 'Pensez à qui compte sur vous. Ce que vous pourriez créer.',
        focused: 'Pensez à votre travail le plus profond. Le projet qui compte le plus.',
        resilient: 'Pensez à ce qui vient. Ce pour quoi vous devez être prêt.',
      },
      placeholder: {
        calmer: 'Quand je suis réactif, je blesse les gens que j\'aime. Je prends des décisions que je regrette. Je ne peux pas dormir. Je dois changer parce que...',
        disciplined: 'Chaque fois que j\'abandonne, je me fais moins confiance. J\'ai laissé tomber des rêves parce que je ne pouvais pas être constant. Je dois changer parce que...',
        confident: 'Je reste silencieux quand je devrais parler. Je ne poursuis pas ce que je veux parce que j\'ai peur de ne pas être à la hauteur. Je dois changer parce que...',
        leader: 'Les gens comptent sur moi mais je me retiens. J\'ai des idées mais je n\'agis pas. Je dois devenir un leader parce que...',
        focused: 'Je disperse mon énergie sur tout et ne maîtrise rien. Mon meilleur travail n\'est jamais fait car je suis toujours distrait. Je dois changer parce que...',
        resilient: 'La vie m\'a fait tomber avant et je suis resté à terre trop longtemps. Je sais que des temps plus durs viendront, et je dois être plus fort parce que...',
      },
      wordCount: '{count} mots',
      moreNeeded: '({count} de plus nécessaires)',
      anchorText: 'Ceci sera votre ancre. Vous pourrez toujours y revenir.',
      beHonest: 'Écrivez au moins 10 mots. Soyez honnête avec vous-même.',
      thisIsMyTruth: 'Ceci est ma vérité',
      writeYourWhy: 'Écrivez votre pourquoi...',
      pressToSubmit: 'Appuyez sur {key}+Entrée pour continuer',
    },

    // Path Step
    path: {
      heresHow: 'Voici Comment Ça Marche',
      yourDailyPath: 'Votre Chemin Quotidien',
      phase1: {
        title: 'La Leçon',
        subtitle: 'La sagesse ancienne rendue réelle',
        description: 'Chaque jour, apprenez un principe puissant qui peut transformer votre vision du monde.',
        duration: '~3 min',
      },
      phase2: {
        title: "L'Écho",
        subtitle: 'Enseignez ce que vous apprenez',
        description: "Répondez à la réflexion d'un autre voyageur. Enseigner approfondit votre propre compréhension.",
        duration: '~1 min',
      },
      phase3: {
        title: 'La Pratique',
        subtitle: 'Appliquez-le à votre vie',
        description: "Cinq exercices pour rendre concrète la sagesse d'aujourd'hui. C'est là que la transformation se produit.",
        duration: '~3 min',
      },
      sameLesson: 'Même leçon. Même jour. Ensemble.',
      neverAlone: "Tout le monde apprend la même sagesse le même jour. Vous n'êtes jamais seul sur ce chemin.",
      totalTime: 'Total :',
      intentionalGrowth: 'de croissance intentionnelle, chaque jour',
      iUnderstand: 'Je comprends le chemin',
    },

    // Commitment Step
    commitment: {
      howMuchTime: 'combien de temps vous accorderez-vous chaque jour ?',
      smallConsistent: 'Petit et constant bat grand et sporadique. Choisissez ce que vous ferez vraiment.',
      iCommit: 'Moi,',
      commitTo: "m'engage à",
      minutesDaily: 'minutes par jour',
      toBecome: 'pour devenir',
      canChangeAnytime: "Vous pouvez changer cela à tout moment. Ce qui compte, c'est d'être présent.",
      iCommitToThis: "Je m'engage",
      chooseYour: 'Choisissez votre engagement',
      commitments: {
        fiveMin: '5 min',
        fiveMinDesc: 'Juste commencer',
        tenMin: '10 min',
        tenMinDesc: 'Recommandé',
        fifteenMin: '15 min',
        fifteenMinDesc: 'Aller plus loin',
        twentyMin: '20 min',
        twentyMinDesc: 'Se transformer',
      },
    },

    // Ready Step
    ready: {
      youveChosen: 'vous avez choisi de devenir',
      min: 'min',
      daily: 'par jour',
      stoicWisdom: 'Sagesse stoïque',
      wontWalkAlone: 'Vous ne marcherez pas seul sur ce chemin.',
      mentorWillGuide: 'Un mentor vous guidera—répondant à vos réflexions',
      wisdomTailored: 'avec une sagesse adaptée à votre parcours.',
      youreReady: 'vous êtes prêt.',
      firstLessonAwaits: 'Votre première leçon vous attend.',
      beginMyJourney: 'Commencer Mon Voyage',
      personYouBecome: 'La personne que vous devenez est façonnée par ce que vous faites chaque jour.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DAILY FLOW HOME
  // ─────────────────────────────────────────────────────────────────────────
  dailyFlow: {
    dayOf: 'Jour {current} sur {total}',
    todaysPracticeComplete: "Pratique d'Aujourd'hui Terminée",
    doneTheWork: 'Vous avez fait le travail. Laissez la sagesse s\'intégrer.',
    tomorrowsGlimpse: 'Aperçu de Demain',
    wantToGoDeeper: 'Envie d\'aller plus loin ?',
    browseMoreEchoes: 'Parcourir Plus d\'Échos',
    connectWithTravelers: 'Connectez-vous avec les autres voyageurs',
    redoPastLesson: 'Refaire une Leçon Passée',
    revisitDeepen: 'Revisiter et approfondir',
    viewDashboard: 'Voir le Tableau de Bord',
    progressStats: 'Progrès, statistiques, et plus',

    // Phases
    phases: {
      lesson: {
        title: "Leçon d'Aujourd'hui",
        description: 'Apprendre la sagesse',
        beginLesson: 'Commencer la Leçon',
        continueLesson: 'Continuer la Leçon',
      },
      echo: {
        title: "L'Écho",
        subtitle: 'Connectez-vous avec un voyageur',
        description: 'Répondez à la réflexion de quelqu\'un',
        respondToReflection: 'Répondre à la Réflexion',
      },
      practice: {
        title: "Pratique d'Aujourd'hui",
        subtitle: '{count} exercices',
        description: 'Incarnez la sagesse du jour',
        beginPractice: 'Commencer la Pratique',
        continuePractice: 'Continuer la Pratique',
        completed: '{current}/{total} terminés',
      },
    },
    completePrevious: 'Terminez la phase précédente pour débloquer',
    yourCommitment: 'Votre engagement',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PRACTICE MODE
  // ─────────────────────────────────────────────────────────────────────────
  practiceMode: {
    noPracticeAvailable: 'Aucune pratique disponible',
    completeLessonsFirst: 'Terminez quelques leçons, puis revenez ici pour pratiquer et renforcer ce que vous avez appris.',
    title: 'Mode Pratique',
    progressOf: '{current} sur {total}',
    practiceSession: 'Session de Pratique',
    applyWhatYouLearned: 'Appliquez ce que vous avez appris à des situations réelles. Cela renforce votre compréhension et développe une sagesse durable.',
    scenarioCount: '{count} scénarios',
    estimatedTime: '~{minutes} min',
    beginPractice: 'Commencer la Pratique',
    scenarioLabel: 'Scénario',
    writeResponsePlaceholder: 'Écrivez votre réponse...',
    reflectionLabel: 'Réflexion',
    yourResponseLabel: 'Votre réponse :',
    reflectPlaceholder: 'Réfléchissez à cela...',
    nextScenario: 'Scénario suivant',
    completePractice: 'Terminer la Pratique',
    practiceComplete: 'Pratique terminée !',
    practiceCompleteBody: 'Vous avez renforcé votre compréhension par la mise en pratique. C’est ainsi que la sagesse devient instinct.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  dashboard: {
    yourJourney: 'Votre Voyage',
    dayOfTransformation: 'Jour {day} de Votre Transformation',
    youAreBecoming: 'Vous devenez quelqu\'un qui',
    latestIdentity: 'Votre dernière déclaration d\'identité',
    goals: {
      calmer: 'trouve le calme intérieur',
      disciplined: 'développe la discipline',
      confident: 'développe la confiance',
      leader: 'devient un leader',
      focused: 'aiguise sa concentration',
      resilient: 'construit la résilience',
      growing: 'grandit',
      transforming: 'se transforme',
    },

    // Quote of the day
    quoteOfTheDay: 'Sagesse du Jour',

    // Journey map labels
    chapterLabels: {
      start: 'Début',
      chapter2: 'Ch. 2',
      mid: 'Milieu',
      chapter4: 'Ch. 4',
      end: 'Fin',
    },

    // Sections
    sections: {
      today: "Aujourd'hui",
      yourJourney: 'Votre Voyage',
      community: 'Communauté',
    },

    // Today's practice
    todaysPractice: "Pratique d'Aujourd'hui",
    todaysPracticeComplete: "Pratique d'Aujourd'hui Terminée",
    lesson: 'Leçon',
    echo: 'Écho',

    // Journey section
    weeklyCheckin: 'Bilan Hebdomadaire',
    monthlyReview: 'Revue Mensuelle',
    identity: 'Identité',
    whoYoureBecoming: 'Qui vous devenez',
    statements: '{count} déclarations',
    unlocked: '{count} débloqués',

    // Community section
    browseEchoes: 'Parcourir les Échos',
    readRespond: 'Lire et répondre aux réflexions',
    yourInbox: 'Votre Boîte de Réception',
    responsesToReflections: 'Réponses à vos réflexions',

    // Stats
    bestStreak: 'Meilleure Série',
    viewAllStats: 'Voir toutes les stats',
    due: 'À faire',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HOME / HERO GREETING
  // ─────────────────────────────────────────────────────────────────────────
  home: {
    greetings: {
      morning: 'Bonjour',
      afternoon: 'Bon après-midi',
      evening: 'Bonsoir',
    },
    wisdomQuotes: [
      {
        text: "L'obstacle est le chemin.",
        author: 'Marcus Aurelius',
      },
      {
        text: 'Concentrez-vous sur ce que vous pouvez contrôler.',
        author: 'Seneca',
      },
      {
        text: 'Commencez à vivre immédiatement.',
        author: 'Epictetus',
      },
      {
        text: 'La meilleure vengeance est de ne pas ressembler à votre ennemi.',
        author: 'Seneca',
      },
      {
        text: 'Ne perdez plus de temps à discuter de ce que devrait être un homme bon. Soyez-en un.',
        author: 'Marcus Aurelius',
      },
      {
        text: 'Vous avez le pouvoir sur votre esprit - pas sur les événements extérieurs. Réalisez cela, et vous trouverez la force.',
        author: 'Epictetus',
      },
      {
        text: "Ce n'est pas la mort qu'un homme devrait craindre, mais ne jamais commencer à vivre.",
        author: 'Marcus Aurelius',
      },
      {
        text: 'Le bonheur de votre vie dépend de la qualité de vos pensées.',
        author: 'Seneca',
      },
      {
        text: 'Acceptez les choses auxquelles le destin vous lie.',
        author: 'Epictetus',
      },
      {
        text: "Quand vous vous levez le matin, pensez au privilège qu'est d'être en vie.",
        author: 'Marcus Aurelius',
      },
    ],
    navigation: {
      progress: 'Progrès',
      achievements: 'Accomplissements',
      identity: 'Identité',
      practice: 'Pratique',
      growth: 'Croissance',
      echoes: 'Échos',
      map: 'Carte',
      worlds: 'Mondes',
    },
    streakMessage: {
      singular: '{count} jour de croissance régulière',
      plural: '{count} jours de croissance régulière',
      none: "Commencez votre parcours aujourd'hui",
    },
    level: {
      progressToNext: '{percent}% avant le niveau suivant',
      motivation: {
        almostThere: 'Presque là ! Continuez à avancer.',
        halfway: 'À mi-chemin. Chaque leçon vous rapproche.',
        firstStep: 'Un voyage de mille lieues commence par un seul pas.',
      },
    },
    lessonCard: {
      actionAwaits: 'Votre action vous attend',
      completeThenReturn: 'Terminez-la, puis revenez ici',
      youCommittedTo: 'Vous vous êtes engagé à :',
      rememberPrefix: 'Rappelez-vous :',
      rememberEmphasis: "l'action est l'antidote à l'anxiété.",
      rememberSuffix: "Ne vous contentez pas d'y penser. Agissez. Puis revenez pour réfléchir.",
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────────────────────────────────
  settings: {
    title: 'Paramètres',
    personalize: 'Personnalisez votre expérience',

    // Profile
    profile: 'Profil',
    onPathOf: 'Sur le chemin de la transformation',
    seeker: 'Chercheur',

    // Language
    language: 'Langue',
    selectLanguage: 'Sélectionnez votre langue',

    // Appearance
    appearance: 'Apparence',
    theme: 'Thème',
    themeDesc: 'Basculez entre les modes sombre et clair',

    // Audio & Haptics
    audioHaptics: 'Audio et Haptique',
    soundEffects: 'Effets Sonores',
    soundDesc: 'Sons UI, carillons et retours',
    hapticFeedback: 'Retour Haptique',
    hapticDesc: 'Vibration lors des interactions',

    // Test Audio
    testAudio: 'Tester l\'Audio',
    previewAudio: 'Prévisualisez l\'expérience audio immersive',
    uiSounds: 'Sons UI',
    ambience: 'Ambiance',
    meditation: 'Méditation',

    // About
    about: 'À Propos',
    appName: 'Transformation Hub',
    appDesc: 'Votre voyage quotidien vers la croissance',
    version: 'Version',

    // Account
    account: 'Compte',
    signedInAs: 'Connecté en tant que',
    signOut: 'Se Déconnecter',
    linkAccount: 'Associer Votre Compte',
    linkAccountDesc: 'Synchronisez votre progression sur tous vos appareils',
    signIn: 'Se Connecter',
    createAccount: 'Créer un Compte',
    wanderingMode: 'Mode voyageur',
    wanderingModeDesc: 'Progression sauvegardée localement uniquement',
    accountLinked: 'Associé',
    anonymous: 'Anonyme',

    // Danger Zone
    dangerZone: 'Zone Dangereuse',
    resetProgress: 'Réinitialiser Tout',
    resetDesc: 'Supprimer toutes les données et recommencer',
    resetWarning: 'Cela supprimera définitivement tous vos progrès, réflexions et échos. Cette action est irréversible.',
    resetConfirm: 'Oui, Tout Réinitialiser',
    resetCancel: 'Annuler',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ECHOES / REFLECTIONS
  // ─────────────────────────────────────────────────────────────────────────
  echoes: {
    title: 'Échos',
    inbox: 'Boîte des Échos',
    noEchoes: 'Pas encore d\'échos',
    noEchosDesc: 'Terminez votre première leçon pour commencer à recevoir des échos.',
    tabs: {
      received: 'Reçus',
      sent: 'Envoyés',
      invitations: 'Invitations',
      messages: 'Messages',
    },
    respondToReflection: 'Répondre à la Réflexion',
    sendEcho: 'Envoyer un Écho',
    yourResponse: 'Votre réponse...',
    characterMin: 'Écrivez au moins {min} caractères',
    reflectedOn: 'a réfléchi sur',
    // Echo Prompt
    bestWayToLearn: 'La Meilleure Façon d\'Apprendre',
    roleOfTeacher: '...est de prendre le rôle d\'un enseignant.',
    reflectOnJourney: 'Aimeriez-vous réfléchir au parcours d\'un autre étudiant et lui offrir des encouragements ?',
    byTeachingOthers: 'En enseignant aux autres, nous nous enseignons à nous-mêmes.',
    proverb: 'Proverbe',
    letsDoThat: 'Faisons cela',
    notRightNow: 'Pas maintenant',
    // Echo Inbox
    fromFellow: 'D\'un(e)',
    viewAll: 'Voir Tout',
    noResponses: 'Pas encore de réponses',
    yourReflections: 'Vos réflexions sont là-bas, recueillant la sagesse.',
    pending: 'En attente',
    hoursAgo: 'Il y a {hours}h',
    daysAgo: 'Il y a {days}j',
    justNow: 'À l\'instant',
    // Echo Review
    teacherWisdom: 'Vos mots guideront un voyageur.',
    submitEcho: 'Soumettre l\'Écho',
    skipForNow: 'Passer pour l\'instant',
    // Echo Inbox
    reflections: 'Réflexions',
    invitations: 'Invitations',
    connectionsTab: 'Connexions',
    noReflectionsYet: 'Pas encore de réflexions',
    whenSomeoneReflects: 'Quand quelqu\'un réfléchit sur vos mots, vous le verrez ici',
    fellowReflected: 'Un(e) {gender} a réfléchi',
    fellowReflectedOnYourWords: 'Un(e) {gender} a réfléchi à vos mots',
    fellowLabel: 'Un(e) {gender}',
    openToConnecting: 'Ouvert à la connexion',
    yourReflectionLabel: 'Votre réflexion :',
    theirReflection: 'Réflexion de {gender} pour vous :',
    theyreOpenToConnect: '{subject} est ouvert(e) à la connexion',
    wouldYouLikeToConnect: 'Aimeriez-vous vous connecter avec cette personne ?',
    writeInvitationMessage: 'Écrivez un message avec votre invitation...',
    invitationMessageLabel: 'Message de {gender} :',
    inviteToConnect: 'Inviter à Se Connecter',
    closeWithoutConnecting: 'Fermer sans se connecter',
    noPendingInvitations: 'Pas d\'invitations en attente',
    invitationsWillAppear: 'Les invitations de connexion apparaîtront ici',
    wantsToConnect: 'Un(e) {gender} veut se connecter',
    connectionRequest: 'Demande de Connexion',
    decline: 'Refuser',
    acceptConnect: 'Accepter et Se Connecter',
    noConnectionsYet: 'Pas encore de connexions',
    conversationsWillAppear: 'Quand vous vous connectez avec quelqu\'un, vos conversations apparaîtront ici',
    growthConversation: 'Conversation de Croissance',
    withFellow: 'avec un(e) {gender}',
    youConnectedThrough: 'Vous vous êtes connecté(e) via :',
    startConversation: 'Commencez votre conversation de croissance...',
    typeMessage: 'Tapez un message...',
    // Echo Review
    reflectingOnJourney: 'Réfléchir au Parcours d\'un Autre',
    skip: 'Passer',
    fellowReflectedOn: 'Un(e) {gender} a réfléchi sur "{title}" :',
    absorbWords: 'Prenez un moment pour absorber ses mots...',
    writeYourReflection: 'Écrire Votre Réflexion',
    fellowWrote: 'Un(e) {gender} a écrit :',
    yourReflectionFor: 'Votre réflexion pour {pronoun} :',
    whatDoesTheirJourney: 'Que vous fait penser leur parcours ?',
    whatEncouragement: 'Quels encouragements pouvez-vous offrir ?',
    pronounHim: 'lui',
    pronounHer: 'elle',
    pronounThem: 'eux',
    pronounHe: 'il',
    pronounShe: 'elle',
    pronounThey: 'ils',
    pronounHis: 'sa',
    pronounHerPossessive: 'sa',
    pronounTheir: 'leur',
    writeYourThoughts: 'Écrivez vos pensées...',
    word: 'mot',
    wordsPlural: 'mots',
    readyToSend: 'Prêt à envoyer',
    aBitMore: 'Un peu plus...',
    openToConnectingIf: 'Je suis ouvert(e) à me connecter si {pronoun} le souhaite',
    sendReflection: 'Envoyer la Réflexion',
    pressToSend: 'Appuyez sur ⌘+Entrée pour envoyer',
    sendingReflection: 'Envoi de votre réflexion...',
    reflectionSent: 'Réflexion Envoyée',
    yourWordsWillReach: 'Vos mots les atteindront.',
    connectedThroughReflection: 'Connecté(e) via la réflexion',
    // Mandatory Echo Flow
    mandatory: {
      phaseLabel: 'Phase 2 : L\'Écho',
      communityConnection: 'Connexion Communautaire',
      connectBeforePractice: 'Connectez-vous Avant de Pratiquer',
      encourageTraveler: 'Avant vos exercices, prenez un moment pour encourager un(e) voyageur(se). Vos mots pourraient être exactement ce dont cette personne a besoin aujourd\'hui.',
      whyMatters: 'Pourquoi c\'est important :',
      whyMattersDesc: 'Quand vous réfléchissez au parcours de quelqu\'un d\'autre, vous approfondissez votre propre compréhension. Enseigner est la plus haute forme d\'apprentissage.',
      readReflection: 'Lire la Réflexion d\'un(e) Voyageur(se)',
      fellowReflectedOn: 'Un(e) {gender} a réfléchi sur « {title} » :',
      absorbWords: 'Prenez un moment pour vraiment absorber ses mots...',
      writeYourEcho: 'Écrire Votre Écho',
      fellowWrote: 'Un(e) {gender} a écrit :',
      yourEchoFor: 'Votre écho pour {pronoun} :',
      shareInsight: 'Partagez une réflexion, un mot d\'encouragement ou un lien avec votre propre parcours.',
      writeThoughts: 'Écrivez vos pensées...',
      readyToSend: 'Prêt à envoyer',
      moreWords: '{count} mots de plus',
      openToConnect: 'Je suis ouvert(e) à me connecter davantage',
      sendAndUnlock: 'Envoyer l\'Écho et Débloquer les Exercices',
      cmdEnterToSend: 'Appuyez sur Cmd+Entrée pour envoyer',
      sendingEcho: 'Envoi de votre écho...',
      echoSent: 'Écho Envoyé !',
      wordsWillBrighten: 'Vos mots illumineront le parcours de quelqu\'un.',
      continueToExercises: 'Continuer vers les Exercices',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXERCISES
  // ─────────────────────────────────────────────────────────────────────────
  exercises: {
    title: 'Pratique',
    todaysPractice: "Pratique d'Aujourd'hui",
    exerciseOf: 'Exercice {current} sur {total}',
    scenario: 'Scénario',
    reflection: 'Réflexion',
    complete: 'Terminer l\'Exercice',
    allComplete: 'Tous les exercices sont terminés !',
    xpEarned: '+{xp} XP gagnés',
    backToHome: 'Retour à l\'Accueil',
    backToToday: "Retour à Aujourd'hui",
    completed: 'terminés',
    minRemaining: '~{min} min restantes',
    practiceComplete: 'Pratique Terminée !',
    wisdomTakingRoot: "Vous avez terminé les 5 exercices du jour. La sagesse prend racine.",
    xpEarnedAmount: '+{amount} XP Gagnés',
    exercisesCount: 'Exercices',
    completeTodaysPractice: "Terminer la Pratique d'Aujourd'hui",
    completeInAnyOrder: "Complétez ces exercices dans l'ordre de votre choix pour incarner la sagesse du jour.",
    scenarioTitle: 'Scénario',
    quoteTitle: 'Citation',
    applicationTitle: 'Application',
    anchorTitle: 'Ancrage',
    reframeTitle: 'Recadrage',
    whatWouldYouDo: 'Que feriez-vous ?',
    chooseResponse: 'Choisissez une réponse',
    selectOption: 'Sélectionnez une option',
    yourThoughts: 'Vos pensées...',
    typeResponse: 'Tapez votre réponse...',
    submitResponse: 'Soumettre la Réponse',
    nextExercise: 'Exercice Suivant',
    exerciseComplete: 'Exercice Terminé',
    wellDone: 'Bien joué !',
    back: 'Retour',
    continueText: 'Continuer',
    // Application Exercise
    tomorrowOpportunity: "Demain est une nouvelle opportunité de pratiquer ce que vous avez appris aujourd'hui.",
    tomorrowIWill: 'Demain, je vais...',
    setTomorrowsIntention: "Fixer l'Intention de Demain",
    // Anchor Exercise
    createYourAnchor: 'Créez Votre Ancrage',
    beginBreaths: 'Commencer {count} Respirations',
    breathOf: 'Respiration {current} sur {total}',
    breatheIn: 'Inspirez...',
    breatheOut: 'Expirez...',
    hold: 'Retenez...',
    keepAnchorGesture: 'Gardez votre geste d\'ancrage en respirant',
    anchorSet: 'Ancrage Établi',
    gestureLinked: "Votre geste est maintenant lié à la sagesse d'aujourd'hui. Utilisez-le chaque fois que vous avez besoin d'un rappel.",
    // Reframe Exercise
    shiftPerspective: 'Changez de Perspective',
    shiftPerspectiveDesc: "Utilisez la sagesse d'aujourd'hui pour voir cette situation différemment. L'obstacle contient souvent l'opportunité.",
    example: 'Exemple',
    before: 'Avant :',
    after: 'Après :',
    describeChallenge: "Décrivez le défi, puis recadrez-le en utilisant la sagesse d'aujourd'hui...",
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSONS
  // ─────────────────────────────────────────────────────────────────────────
  lessons: {
    title: 'Leçon',
    continue: 'Continuer',
    complete: 'Terminer la Leçon',
    takeAction: 'Passer à l\'Action',
    returnWhenReady: 'Revenez quand vous êtes prêt',
    reflect: 'Réfléchissez à cela...',
    yourReflection: 'Votre réflexion...',
    chooseWisely: 'Choisissez sagement',
    timer: {
      breathe: 'Respirez',
      contemplate: 'Contemplez',
      timeRemaining: 'Temps restant',
      startPractice: 'Commencer la pratique',
    },
    // Stage labels for LessonExperience progress indicator
    stages: {
      receivingWisdom: 'Réception de la Sagesse',
      practicing: 'Pratique',
      reflecting: 'Réflexion',
      celebrating: 'Célébration',
      integration: 'Intégration',
    },
    // Step labels for FlexibleLessonExperience
    steps: {
      scenario: 'Scénario',
      choice: 'Choix',
      commitment: 'Engagement',
      goDoIt: 'Passez à l\'Action',
      returnConfirm: 'Bon Retour',
      reflection: 'Réflexion',
      visualization: 'Visualisation',
      insight: 'Aperçu',
      mentor: 'Mentor',
      reward: 'Terminé',
      // Additional step labels
      theSituation: 'La Situation',
      yourChoice: 'Votre Choix',
      yourCommitment: 'Votre Engagement',
      takeAction: 'Passez à l\'Action',
      welcomeBack: 'Bon Retour',
      innerVision: 'Vision Intérieure',
      practice: 'Pratique',
      sageWisdom: 'Sagesse du Sage',
      celebration: 'Célébration',
    },
    scenario: {
      continue: 'Je le ressens',
    },
    visualization: {
      continue: "Je l'ai vu",
      continueToReflect: 'Continuer la réflexion',
    },
    commitment: {
      placeholder: 'Je vais...',
      word: 'mot',
      words: 'mots',
      readyToCommit: 'Prêt(e) à m’engager',
      moreNeeded: 'Encore {count} requis',
      commitButton: 'Je m’engage',
      pressToSubmit: 'Appuyez sur {key}+Entrée pour continuer',
    },
    // Wisdom Step
    wisdom: {
      settleInto: 'Installez-vous dans ce moment...',
      letGo: 'Laissez aller ce qui est venu avant...',
      openToReceive: 'Ouvrez-vous pour recevoir...',
      todaysWisdom: 'La Sagesse du Jour',
      iReceiveWisdom: 'Je reçois cette sagesse. Quelle est la pratique ?',
      pressEnter: 'Appuyez sur Entrée pour continuer',
    },
    // Action Step
    action: {
      breathingPractice: 'Pratique de Respiration',
      innerReflection: 'Réflexion Intérieure',
      mindfulObservation: 'Observation Consciente',
      freeWriting: 'Écriture Libre',
      mindfulAction: 'Action Consciente',
      practice: 'Pratique',
      remaining: 'restant',
      readyToContinue: 'Je suis prêt à continuer',
      practiceComplete: 'Pratique terminée',
      iPracticedFully: 'J\'ai pratiqué pleinement',
      iStruggled: 'J\'ai eu des difficultés',
      honestyIsPractice: 'L\'honnêteté fait partie de la pratique',
      breatheIn: 'Inspirez...',
      hold: 'Retenez...',
      release: 'Relâchez...',
      breath: 'respiration',
      breaths: 'respirations',
      breathsComplete: 'terminée(s)',
      // Guidance messages
      guidance: {
        breathe: [
          'Laissez votre souffle trouver son rythme naturel...',
          'Chaque respiration vous ancre plus profondément dans la présence...',
          'Il n\'y a rien à corriger. Respirez simplement...',
          'Votre souffle connaît le chemin...',
          'Laissez partir la dernière respiration. Accueillez celle-ci...',
        ],
        reflect: [
          'Tournez votre attention vers l\'intérieur...',
          'Qu\'est-ce qui surgit quand vous restez avec cela ?',
          'Observez sans juger...',
          'Laissez la question agir sur vous...',
          'La réponse se forme déjà...',
        ],
        observe: [
          'Adoucissez votre regard...',
          'Remarquez ce que vous manquez habituellement...',
          'Tout parle si vous écoutez...',
          'Restez avec ce que vous voyez...',
          'Laissez la conscience s\'étendre...',
        ],
        write: [
          'Laissez les mots venir sans les modifier...',
          'Écrivez depuis le corps, pas depuis l\'esprit...',
          'Il n\'y a pas de mauvaise réponse ici...',
          'Suivez le fil où qu\'il mène...',
          'Votre main sait quoi écrire...',
        ],
        act: [
          'Sentez l\'énergie qui s\'accumule...',
          'Vous êtes prêt pour cela...',
          'L\'action découle de la tranquillité...',
          'Faites confiance à vos instincts...',
          'Bougez avec intention...',
        ],
      },
      integration: [
        'Laissez cela s\'installer dans votre être...',
        'Emportez cette présence avec vous...',
        'Ce moment fait maintenant partie de vous...',
        'La pratique continue dans la vie quotidienne...',
      ],
    },
    // Reflection Step
    reflection: {
      nowReflect: 'Maintenant, réfléchissez...',
      yourReflection: 'Votre Réflexion',
      beginWriting: 'Commencez à écrire...',
      word: 'mot',
      words: 'mots',
      readyToContinue: 'Prêt à continuer',
      aBitMoreDepth: 'Un peu plus de profondeur...',
      keepWriting: 'Continuez à écrire...',
      private: 'Privé',
      shareAnonymously: 'Partager Anonymement',
      publicDesc: 'D\'autres peuvent lire et réfléchir à vos mots. Vous pourriez recevoir des réponses réfléchies.',
      privateDesc: 'Cette réflexion est juste pour vous. Personne d\'autre ne la verra.',
      completeReflection: 'Terminer la Réflexion',
      continueOrWriteMore: 'Continuer (ou écrire plus)',
      reflectionComplete: 'Réflexion terminée',
      pressToSubmit: 'Appuyez sur ⌘+Entrée pour continuer',
      encouragement: [
        'Qu\'est-ce qui est présent pour vous en ce moment ?',
        'Il n\'y a pas d\'urgence. Laissez les pensées venir.',
        'Écrivez comme si personne ne lirait jamais ceci.',
        'À quoi ressemblerait l\'honnêteté ici ?',
        'Allez plus profond. Qu\'y a-t-il en dessous ?',
      ],
      depth: [
        'Pourquoi est-ce important pour vous ?',
        'Quand avez-vous ressenti cela avant ?',
        'Qu\'est-ce qui changerait si vous croyiez vraiment cela ?',
        'Qu\'évitez-vous de dire ?',
        'Qu\'écrirait votre moi le plus sage ici ?',
      ],
      milestones: {
        finding: 'Vous trouvez votre voix...',
        keepGoing: 'Continuez. C\'est ici que se trouve l\'or.',
        goingDeep: 'Magnifique. Vous allez en profondeur.',
      },
    },
    // Reward Step
    reward: {
      wellDone: 'Bravo',
      youMastered: 'Vous avez maîtrisé',
      youveGrown: 'Vous avez grandi',
      continueToMentor: 'Continuer vers le Mentor',
      day: 'jour',
      days: 'jours',
      streak: 'série',
      levelUp: 'Niveau supérieur !',
    },
    // Mentor Step
    mentor: {
      sageIsSpeaking: 'Sage parle...',
      completeLesson: 'Terminer la Leçon',
      tryAgain: 'Réessayer',
      reflectionNeedsDepth: 'Votre réflexion a besoin de plus de profondeur',
      daysToStreak: '{days} {dayWord} de plus pour votre première semaine de suite',
      day: 'jour',
      days: 'jours',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACHIEVEMENTS
  // ─────────────────────────────────────────────────────────────────────────
  achievements: {
    title: 'Accomplissements',
    gallery: 'Galerie des Accomplissements',
    unlocked: 'Débloqué',
    locked: 'Verrouillé',
    progress: 'Progrès',
    earned: 'Gagné',
    unlockedAt: 'Débloqué le {date}',
    keepGoing: 'Continuez pour débloquer !',
    celebration: 'Accomplissement Débloqué !',
    newMilestone: 'Nouvelle Étape',
    continue: 'Continuer',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROGRESS
  // ─────────────────────────────────────────────────────────────────────────
  progress: {
    title: 'Progrès',
    dashboard: 'Tableau de Bord des Progrès',
    stats: {
      totalLessons: 'Leçons Totales',
      totalReflections: 'Réflexions Totales',
      totalWords: 'Mots Écrits',
      identityStatements: 'Déclarations d\'Identité',
      achievements: 'Accomplissements',
      daysSinceStart: 'Jours Actifs',
      avgReflectionLength: 'Longueur Moy. des Réflexions',
    },
    streakCalendar: 'Calendrier des Séries',
    currentStreak: 'Série Actuelle',
    longestStreak: 'Plus Longue Série',
    activityLog: 'Journal d\'Activité',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  identity: {
    title: 'Voyage d\'Identité',
    journey: 'Voyage d\'Identité',
    whoYoureBecoming: 'Qui Vous Devenez',
    statements: 'Déclarations d\'Identité',
    noStatements: 'Pas encore de déclarations d\'identité',
    noStatementsDesc: 'Terminez des leçons pour découvrir qui vous devenez.',
    latestStatement: 'Dernière Déclaration',
    addStatement: 'Ajouter une Déclaration',
    yourStatement: 'Je suis quelqu\'un qui...',
    save: 'Enregistrer la Déclaration',
    // IdentityJourney.tsx
    defineWhoYouAre: 'Définissez qui vous devenez',
    statementsCount: '{count} déclaration(s) d\'identité revendiquée(s)',
    whoAreYouBecoming: 'Qui devenez-vous ?',
    emptyStateDescription: 'Les déclarations d\'identité vous aident à définir et renforcer qui vous voulez être. La personne que vous revendiquez aujourd\'hui façonne qui vous deviendrez demain.',
    createFirstStatement: 'Créez Votre Première Déclaration',
    iAmSomeoneWho: 'Je suis quelqu\'un qui',
    yourEvolution: 'Votre Évolution',
    evolutionMessage: '{name}, vous avez revendiqué {count} identités. Chaque déclaration est une promesse à vous-même - une déclaration de qui vous devenez. Continuez à incarner cette personne.',
    selfInitiated: 'Auto-initié',
    // IdentityPromptModal.tsx
    completeStatement: '{name}, complétez cette déclaration pour revendiquer votre identité.',
    promptInspiration: 'Inspiration',
    tapForAnother: 'touchez pour une autre',
    yourIdentityStatement: 'Votre déclaration d\'identité',
    statementPlaceholder: 'se montre chaque jour...',
    example: 'Exemple',
    identityClaimed: 'Identité Revendiquée',
    claiming: 'Revendication...',
    claimThisIdentity: 'Revendiquer Cette Identité',
    minCharacters: 'Veuillez écrire au moins 10 caractères',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKIN & ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  checkin: {
    title: 'Bilan Hebdomadaire',
    weekCheckin: 'Bilan Semaine {week}',
    introMessage: 'Prenez quelques minutes pour réfléchir à votre parcours cette semaine. Vos réflexions façonnent votre croissance.',
    reflectionsCount: '{count} réflexions',
    duration: '~5 min',
    completedCount: 'Vous avez complété {count} bilan(s) jusqu\'à présent',
    beginReflection: 'Commencer la Réflexion',
    categories: {
      yourProgress: 'Vos Progrès',
      challengesFaced: 'Défis Rencontrés',
      keyInsights: 'Aperçus Clés',
      lookingAhead: 'Regarder Vers l\'Avant',
      reflection: 'Réflexion',
    },
    takeYourTime: 'Prenez votre temps pour réfléchir...',
    yourReflection: 'Votre réflexion',
    digDeeper: 'Creusez un peu plus...',
    nextReflection: 'Réflexion Suivante',
    completeCheckin: 'Terminer le Bilan',
    checkinComplete: 'Bilan Terminé !',
    completeMessage: 'Réflexion semaine {week} capturée. Votre conscience de soi grandit.',
    weekly: {
      title: 'Bilan Hebdomadaire',
      subtitle: 'Réfléchissez à votre semaine',
      question: 'Comment s\'est passée cette semaine ?',
      submit: 'Terminer le Bilan',
      skip: 'Passer cette semaine',
    },
    monthly: {
      title: 'Évaluation Mensuelle',
      subtitle: 'Mesurez votre croissance',
      dimensions: {
        emotionalMastery: 'Maîtrise Émotionnelle',
        discipline: 'Discipline',
        perspective: 'Perspective',
        selfAwareness: 'Conscience de Soi',
        growth: 'Croissance',
      },
      xpEarned: '+{xp} XP gagnés pour avoir complété l\'évaluation',
      submit: 'Terminer l\'Évaluation',
      skip: 'Passer ce mois',
      progress: '{current} / {total}',
      scoreTitle: 'Votre score mensuel',
      snapshot: 'Voici votre aperçu de croissance',
      snapshotWithName: '{name}, voici votre aperçu de croissance',
      viewResults: 'Voir les résultats',
      minReflectionChars: 'Écrivez au moins {count} caractères pour continuer',
      saving: 'Enregistrement...',
      scoreLabels: {
        exceptional: 'Exceptionnel',
        strong: 'Solide',
        developing: 'En progression',
        needsWork: 'À renforcer',
        justStarting: 'Tout juste commencé',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // COACHING
  // ─────────────────────────────────────────────────────────────────────────
  coaching: {
    beforeFirstLesson: {
      title: 'Votre Première Leçon',
      message: '{name}, aujourd\'hui des milliers de personnes apprennent cette même sagesse à vos côtés.',
      subMessage: 'Prenez votre temps. Laissez les mots s\'imprégner. C\'est ici que commence la transformation.',
      button: 'Commencer Mon Voyage',
      cta: 'Je suis prêt',
    },
    afterLessonBeforeEcho: {
      title: 'Le Pouvoir d\'Enseigner',
      message: 'Vous avez appris quelque chose de puissant. Maintenant, approfondissez-le en aidant quelqu\'un d\'autre.',
      subMessage: 'Répondre à la réflexion d\'un autre n\'est pas seulement une connexion - c\'est ainsi que la sagesse devient sagesse. Quand vous enseignez, vous comprenez vraiment.',
      button: 'Je Suis Prêt à Me Connecter',
      cta: 'Continuer vers l\'Écho',
    },
    afterEchoBeforeExercises: {
      title: 'Rendez-le Réel',
      message: 'La connaissance sans pratique n\'est que de l\'information. Il est temps d\'appliquer la sagesse du jour à VOTRE vie.',
      subMessage: 'Cinq courts exercices. Chacun amène la leçon dans votre monde, vos défis, votre croissance.',
      button: 'Pratiquons',
      cta: 'Commencer la Pratique',
    },
    afterFirstDayComplete: {
      title: 'Premier Jour Terminé',
      message: '{name}, vous l\'avez fait. C\'est ainsi que commence la transformation.',
      subMessage: 'Un jour à la fois. Une leçon à la fois. Un choix à la fois. Revenez demain - votre prochaine leçon vous attend.',
      button: 'Je Reviendrai',
      cta: 'Célébrer !',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WORLD / MAP
  // ─────────────────────────────────────────────────────────────────────────
  world: {
    title: 'Carte du Voyage',
    currentWorld: 'Monde Actuel',
    switchWorld: 'Changer de Monde',
    progress: 'Progrès',
    dayOf: 'Jour {current} sur {total}',
    chapters: 'Chapitres',
    lessons: 'Leçons',
    completed: 'Terminé',
    locked: 'Verrouillé',
    worlds: {
      modernWisdom: 'Sagesse Moderne',
      stoicism: 'Philosophie Stoïque',
    },
    // WorldMap.tsx
    lessonsProgress: '{completed} sur {total} leçons terminées',
    complete: 'Terminé !',
    summit: 'Sommet',
    // WorldSwitcher.tsx
    chooseYourPath: 'Choisissez Votre Chemin',
    switchBetweenWorlds: 'Passez d\'un monde de sagesse à l\'autre',
    active: 'Actif',
    lessonsCount: '{completed}/{total} leçons',
    progressSaved: 'Votre progression est sauvegardée dans tous les mondes',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSFORMATION HUB
  // ─────────────────────────────────────────────────────────────────────────
  transformation: {
    title: 'Hub de Transformation',
    hub: 'Votre Transformation',
    patterns: 'Schémas',
    wisdom: 'Journaux de Sagesse',
    assessment: 'Évaluation',
    radar: 'Radar de Croissance',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STORY
  // ─────────────────────────────────────────────────────────────────────────
  story: {
    trigger: {
      label: 'Voir votre histoire',
      keepGrowing: 'Continuez à grandir pour débloquer',
      tapToExperience: "Appuyez pour vivre l'expérience",
      demoTitle: 'Essayer avec des données de démonstration',
      demoSubtitle: 'Découvrez un aperçu de votre histoire de transformation',
    },
    slides: {
      unknownType: 'Type de diapositive inconnu',
      firstLessonWas: 'Votre première leçon était',
      daysSinceMoment: 'jours depuis ce moment',
      before: 'Avant',
      after: 'Après',
      patternShift: {
        title: 'Votre esprit a basculé',
      },
      streak: {
        best: 'Meilleur',
        totalDays: 'Total de jours',
        consistency: 'Régularité',
      },
      achievementUnlockedCount: '{unlocked} sur {total} débloqués',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SHARE
  // ─────────────────────────────────────────────────────────────────────────
  share: {
    hubLabel: 'HUB DE TRANSFORMATION',
    achievedBy: 'Réalisé par',
    messageLabel: 'Message de partage :',
    cards: {
      streak: {
        title: 'Série de {count} jours',
        subtitle: 'Pratique stoïcienne quotidienne',
        message: "J'ai pratiqué la sagesse stoïcienne pendant {count} jours d'affilée !",
        stats: {
          days: 'Jours',
          lessons: 'Leçons',
          xp: 'XP',
        },
      },
      achievement: {
        titleFallback: 'Étape franchie',
        messageFallback: "J'ai atteint une nouvelle étape dans mon parcours !",
        stats: {
          virtue: 'Vertu',
          wisdom: 'sagesse',
          totalXp: 'XP total',
        },
      },
      level: {
        title: 'Niveau {level}',
        message: "J'ai atteint le niveau {level} : {title} dans mon parcours de maîtrise de soi !",
        stats: {
          level: 'Niveau',
          title: 'Titre',
          xp: 'XP',
        },
      },
      journey: {
        title: '{days} jours de croissance',
        subtitle: 'Mon parcours de transformation',
        message: '{days} jours, {lessons} leçons, {words} mots de réflexion. Voici mon parcours de transformation.',
        stats: {
          days: 'Jours',
          lessons: 'Leçons',
          words: 'Mots',
        },
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HELP TOOLTIPS
  // ─────────────────────────────────────────────────────────────────────────
  help: {
    exercises: {
      title: 'Exercices Quotidiens',
      description: 'Cinq courts exercices pour pratiquer ce que vous avez appris aujourd\'hui. C\'est là que la transformation se produit.',
    },
    echoes: {
      title: 'Échos',
      description: 'Réflexions anonymes d\'autres voyageurs. Répondez à leurs pensées pour approfondir votre propre compréhension.',
    },
    worlds: {
      title: 'Mondes de Sagesse',
      description: 'Différents voyages de sagesse. Chaque monde a ses propres leçons et pratiques.',
    },
    streak: {
      title: 'Votre Série',
      description: 'Le nombre de jours consécutifs où vous avez pratiqué. Continuez !',
    },
    xp: {
      title: 'Points d\'Expérience',
      description: 'Gagnés en terminant des leçons, échos et exercices. Montez de niveau en grandissant.',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ERROR MESSAGES
  // ─────────────────────────────────────────────────────────────────────────
  errors: {
    generic: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    network: 'Erreur réseau. Veuillez vérifier votre connexion.',
    notFound: 'Contenu introuvable.',
    loadingFailed: 'Échec du chargement du contenu.',
  },
} as const;

export default fr;
