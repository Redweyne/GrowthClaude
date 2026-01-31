// ═══════════════════════════════════════════════════════════════════════════
// SEED REFLECTIONS
// ═══════════════════════════════════════════════════════════════════════════
//
// These are human-sounding reflections used ONLY when no real reflections
// are available. They're designed to feel authentic - with real vulnerability,
// imperfect grammar, genuine insight, and human warmth.
//
// Each lesson has multiple seed reflections to provide variety.
//
// ═══════════════════════════════════════════════════════════════════════════

import type { SeedReflection, GenderIdentity } from '@/types/echoes';
import { type Locale } from '@/i18n';

// Helper to create seed reflections
function seed(lessonId: string, content: string, gender: GenderIdentity): SeedReflection {
  return { lessonId, content, gender };
}

const SEED_REFLECTIONS_BY_LOCALE: Record<Locale, SeedReflection[]> = {
  en: [
  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 1: The Compound Effect (modern-wisdom-1)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-1',
    `I've been so focused on the big moments that I forgot life is really just a series of small ones strung together. Today I chose to drink water instead of my usual soda. It felt insignificant in the moment, but reading this made me realize that's exactly the point. The insignificant moments are where change actually lives.`,
    'sister'
  ),
  seed(
    'modern-wisdom-1',
    `This hit different. I've started and quit so many things because I couldn't see immediate results. The gym, meditation, reading... I'd do it for a week, see nothing change, and give up. But what if I'd just kept going? What if I'd trusted the process? Starting again tomorrow, but this time I'm playing the long game.`,
    'brother'
  ),
  seed(
    'modern-wisdom-1',
    `My grandma used to say "little by little, a little becomes a lot." I never really understood what she meant until now. She built her whole life on small consistent actions - waking up early, saving a little money, being kind even when tired. She never did anything dramatic, but she built something beautiful. I want to be more like her.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-1',
    `I calculated it out and honestly it scared me a bit. If I keep scrolling social media for 2 hours a day like I have been, that's 730 hours a year. 30 full days. A whole month of my life, gone. But flip it around - 30 minutes of reading a day is 182 hours. Enough to read 50+ books. Same principle, different direction. Which way am I going to point my ship?`,
    'brother'
  ),
  seed(
    'modern-wisdom-1',
    `Been thinking about this all day. I'm not where I want to be in life, and I keep blaming circumstances - my job, where I live, my family situation. But if I'm honest, it's the thousands of small choices I made that got me here. Which means thousands of small choices can get me somewhere else. That's terrifying and liberating at the same time.`,
    'sister'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 2: The Power of Tiny (modern-wisdom-2)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-2',
    `The 2-minute rule genuinely changed something in me today. I've been avoiding exercise for months, telling myself I don't have time for a "real workout." But today I just did 2 minutes of stretching. That's it. And you know what? I ended up doing 15 minutes because once I started, stopping felt weird. The hardest part really is just starting.`,
    'brother'
  ),
  seed(
    'modern-wisdom-2',
    `I've been trying to journal for years. Years. Always failed because I thought I had to write pages of profound insights. Today I wrote one sentence: "I feel tired but hopeful." That's it. And somehow that one sentence made me feel more accomplished than all my failed attempts at writing essays about my feelings.`,
    'sister'
  ),
  seed(
    'modern-wisdom-2',
    `Making my bed this morning felt almost too simple to matter. But when I came home after a rough day, seeing that made bed did something to me. It was like past-me had left a small gift for present-me. A reminder that I'm someone who takes care of things. Someone who follows through. It's just a bed, but it's also not just a bed.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-2',
    `I realized I've been all-or-nothing my whole life. Either I work out for an hour or not at all. Either I eat perfectly clean or binge on junk. Either I wake up at 5am or sleep until noon. This lesson made me see how that thinking has kept me stuck. Maybe the middle path isn't weakness - maybe it's wisdom.`,
    'sister'
  ),
  seed(
    'modern-wisdom-2',
    `Started thinking about identity today. I've always said "I'm not a morning person" or "I'm not organized" like these are unchangeable facts about me. But what if identity is just accumulated evidence? If I make my bed for a month, don't I become "someone who makes their bed"? We become what we repeatedly do. That's both simple and profound.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 3: Deep Work (modern-wisdom-3)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-3',
    `I turned off notifications for the first time in... I honestly can't remember. Two hours later, I'd finished work that usually takes me a full day. Not because I worked harder - because I wasn't constantly context-switching. My brain feels clearer than it has in months. Why did I wait so long to try this?`,
    'brother'
  ),
  seed(
    'modern-wisdom-3',
    `The thing about "busyness as a badge of honor" really called me out. I've been proud of how overwhelmed I am, like it proves I matter. But being busy and being productive aren't the same thing. Some of the most impactful people I know seem calm, focused, almost slow. Maybe that's not despite their success - maybe it's part of it.`,
    'sister'
  ),
  seed(
    'modern-wisdom-3',
    `Did my first real deep work session today. Set a timer for 90 minutes, put my phone in another room, closed all tabs except what I needed. The first 20 minutes were uncomfortable - my brain kept wanting to check something, anything. But then something shifted. I got into this flow state I haven't felt since I was a kid drawing for hours. I forgot what that felt like.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-3',
    `I tracked my interruptions for one day and I'm genuinely embarrassed. 73 times. I broke my own focus 73 times in 8 hours. That's once every 6.5 minutes on average. No wonder I feel like I'm always working but never finishing anything. My attention isn't being stolen - I'm giving it away, constantly.`,
    'brother'
  ),
  seed(
    'modern-wisdom-3',
    `Started thinking about what "deep" work even means for me. It's not just about focus time - it's about doing the work that actually matters. I spend so much energy on tasks that feel urgent but aren't important. Emails. Messages. Small requests. Meanwhile the big scary meaningful projects sit untouched. I'm hiding in busyness.`,
    'sister'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 4: The Obstacle (modern-wisdom-4)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-4',
    `Lost my job last month. Been spiraling ever since, feeling like a failure. But this lesson made me ask a different question: what if this is happening FOR me, not TO me? What if this is the push I needed to finally pursue what I actually want to do? I'm not sure yet, but the reframe helped. The obstacle might actually be the way.`,
    'brother'
  ),
  seed(
    'modern-wisdom-4',
    `I've been avoiding a difficult conversation with my mom for years. Years. After this lesson, I realized the discomfort of having the conversation is nothing compared to the weight of carrying the unspoken. The obstacle isn't the conversation - it's my fear of it. And I've been letting fear win.`,
    'sister'
  ),
  seed(
    'modern-wisdom-4',
    `Something clicked today about how I view problems. I always saw them as interruptions to my "real life" - things to get past so I could get back to normal. But what if working through problems IS the real life? What if growth only happens in the struggle, never in the comfort? That changes everything about how I want to live.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-4',
    `My anxiety has always felt like my biggest weakness. But today I wondered - what if it's actually information? What if it's pointing me toward what I care about most? You don't get anxious about things that don't matter to you. Maybe my anxiety isn't something to eliminate. Maybe it's something to listen to and work with.`,
    'sister'
  ),
  seed(
    'modern-wisdom-4',
    `The stories we tell ourselves about our obstacles are wild. I've been telling myself I can't start a business because I don't have enough money. But people with less have done more. The real obstacle isn't money - it's my fear of failure dressed up as a practical concern. Once I saw that, I couldn't unsee it.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Lesson 5: Present Moment (modern-wisdom-5)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    'modern-wisdom-5',
    `I ate dinner tonight without my phone for the first time in I don't know how long. Actually tasted my food. Noticed the texture, the temperature, how it changed as I chewed. It was just rice and vegetables, nothing special, but it felt like the most luxurious meal I've had in months. I've been eating without being present for years.`,
    'sister'
  ),
  seed(
    'modern-wisdom-5',
    `Caught myself today doing that thing where I'm physically somewhere but mentally already in the next moment. Playing with my kid but thinking about work. At dinner but planning tomorrow. In the shower but rehearsing conversations. I'm never actually HERE. I'm always half-living in a future that doesn't exist yet.`,
    'brother'
  ),
  seed(
    'modern-wisdom-5',
    `The breathing exercise seemed too simple to work. Just noticing breath? That's it? But something happened when I did it. For maybe 30 seconds, my mind went quiet. No past, no future, just breath. And I realized how rare that is - how I'm almost never fully present. 30 seconds of presence felt like a vacation from my own mind.`,
    'traveler'
  ),
  seed(
    'modern-wisdom-5',
    `I took a walk today and left my phone at home. At first I felt naked, anxious, like I was missing something. But then... the sky looked different. More vivid. I noticed flowers I walk past every day. Heard birds. Felt the air. When did I stop experiencing the world? When did my phone become more real to me than reality?`,
    'sister'
  ),
  seed(
    'modern-wisdom-5',
    `Been thinking about how much of my life I've missed while being physically present. All the sunsets I scrolled through. Conversations I half-listened to. Moments with people I love where I was there but not THERE. You can't get that time back. But you can decide to be present starting now. That's what I'm choosing.`,
    'brother'
  ),

  // ─────────────────────────────────────────────────────────────────────────
  // Generic reflections (fallback for any lesson)
  // ─────────────────────────────────────────────────────────────────────────
  seed(
    '_generic',
    `Some lessons hit different depending on where you are in life. Today this one hit hard. Not because it told me something I didn't know, but because it reminded me of something I'd forgotten. Sometimes we need to hear the same truth from a different angle before it finally sticks.`,
    'traveler'
  ),
  seed(
    '_generic',
    `I almost skipped today. Told myself I was too tired, too busy, not in the right headspace. But I showed up anyway, and I'm glad I did. The showing up is the thing. The content matters, but the consistency matters more. I'm building something here, one day at a time.`,
    'brother'
  ),
  seed(
    '_generic',
    `Had one of those moments where something just clicks and you can't unthink it. The kind of understanding that changes how you see everything else. These lessons are building on each other in ways I didn't expect. I feel like I'm slowly becoming a different person - or maybe becoming more myself.`,
    'sister'
  ),
  ],
  fr: [
    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1: The Compound Effect (modern-wisdom-1)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-1',
      "Je me concentrais tellement sur les grands moments que j'ai oublié que la vie est surtout une série de petits instants enchaînés. Aujourd'hui j'ai choisi de boire de l'eau plutôt que mon soda habituel. Ça paraissait insignifiant sur le moment, mais cette leçon m'a fait comprendre que c'est exactement ça. Les moments insignifiants sont là où le changement vit vraiment.",
      'sister'
    ),
    seed(
      'modern-wisdom-1',
      "Ça m'a touché autrement. J'ai commencé et arrêté tant de choses parce que je ne voyais pas de résultats immédiats. La salle, la méditation, la lecture... Je le faisais une semaine, rien ne changeait, et j'abandonnais. Et si j'avais simplement continué ? Et si j'avais fait confiance au processus ? Je recommence demain, mais cette fois, je joue le long terme.",
      'brother'
    ),
    seed(
      'modern-wisdom-1',
      "Ma grand-mère disait : « petit à petit, ça devient beaucoup ». Je n'ai jamais vraiment compris avant aujourd'hui. Elle a bâti toute sa vie sur de petits gestes constants — se lever tôt, économiser un peu, être gentille même fatiguée. Elle n'a jamais fait quelque chose de spectaculaire, mais elle a construit quelque chose de beau. Je veux lui ressembler davantage.",
      'traveler'
    ),
    seed(
      'modern-wisdom-1',
      "J'ai fait le calcul et, honnêtement, ça m'a un peu fait peur. Si je continue à scroller 2 heures par jour, ça fait 730 heures par an. 30 jours complets. Un mois de ma vie, parti. Mais inversement — 30 minutes de lecture par jour, c'est 182 heures. De quoi lire 50+ livres. Même principe, direction différente. Où est-ce que je pointe mon navire ?",
      'brother'
    ),
    seed(
      'modern-wisdom-1',
      "J'y pense toute la journée. Je ne suis pas où je veux dans la vie, et je blâme les circonstances — mon boulot, l'endroit où je vis, ma famille. Mais si je suis honnête, ce sont des milliers de petits choix qui m'ont amené ici. Donc des milliers de petits choix peuvent m'amener ailleurs. C'est terrifiant et libérateur à la fois.",
      'sister'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2: The Power of Tiny (modern-wisdom-2)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-2',
      "La règle des 2 minutes a vraiment changé quelque chose aujourd'hui. J'évite l'exercice depuis des mois en me disant que je n'ai pas le temps pour un « vrai entraînement ». Aujourd'hui, j'ai juste fait 2 minutes d'étirements. C'est tout. Et au final, j'ai fait 15 minutes parce qu'une fois lancé, m'arrêter paraissait bizarre. Le plus dur, c'est vraiment de commencer.",
      'brother'
    ),
    seed(
      'modern-wisdom-2',
      "J'essaie d'écrire un journal depuis des années. Des années. J'ai toujours échoué parce que je pensais devoir écrire des pages d'idées profondes. Aujourd'hui j'ai écrit une seule phrase : « Je me sens fatiguée mais pleine d'espoir. » Et cette phrase m'a donné plus de satisfaction que tous mes essais ratés d'écrire des dissertations sur mes émotions.",
      'sister'
    ),
    seed(
      'modern-wisdom-2',
      "Faire mon lit ce matin paraissait presque trop simple pour compter. Mais quand je suis rentré après une journée difficile, voir ce lit fait m'a fait quelque chose. C'était comme si mon moi du matin avait laissé un petit cadeau à mon moi du soir. Un rappel que je suis quelqu'un qui prend soin des choses. Quelqu'un qui va au bout. C'est juste un lit, mais pas seulement un lit.",
      'traveler'
    ),
    seed(
      'modern-wisdom-2',
      "J'ai réalisé que j'ai vécu dans le tout-ou-rien toute ma vie. Soit je m'entraîne une heure, soit pas du tout. Soit je mange parfaitement, soit je me gave. Soit je me lève à 5h, soit je dors jusqu'à midi. Cette leçon m'a montré que cette pensée m'a bloqué. Peut-être que la voie du milieu n'est pas une faiblesse — peut-être que c'est de la sagesse.",
      'sister'
    ),
    seed(
      'modern-wisdom-2',
      "J'ai pensé à l'identité aujourd'hui. J'ai toujours dit « je ne suis pas du matin » ou « je ne suis pas organisé » comme si c'était des faits immuables. Et si l'identité n'était que des preuves accumulées ? Si je fais mon lit pendant un mois, ne deviens-je pas « quelqu'un qui fait son lit » ? On devient ce qu'on répète. C'est simple et profond.",
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 3: Deep Work (modern-wisdom-3)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-3',
      "J'ai coupé les notifications pour la première fois depuis... franchement je ne sais plus. Deux heures plus tard, j'avais terminé un travail qui me prend d'habitude une journée entière. Pas parce que j'ai travaillé plus dur — mais parce que je ne changeais pas de contexte en permanence. Mon esprit est plus clair qu'il ne l'a été depuis des mois. Pourquoi ai-je attendu si longtemps ?",
      'brother'
    ),
    seed(
      'modern-wisdom-3',
      "Le passage sur « l'occupation comme badge d'honneur » m'a remis à ma place. J'étais fière d'être débordée, comme si ça prouvait que je comptais. Mais être occupée et être productive, ce n'est pas la même chose. Certaines des personnes les plus impactantes que je connais semblent calmes, concentrées, presque lentes. Ce n'est peut-être pas malgré leur succès — c'est peut-être grâce à ça.",
      'sister'
    ),
    seed(
      'modern-wisdom-3',
      "J'ai fait ma première vraie session de deep work aujourd'hui. Timer de 90 minutes, téléphone dans une autre pièce, toutes les fenêtres fermées sauf celle dont j'avais besoin. Les 20 premières minutes étaient inconfortables — mon cerveau voulait vérifier quelque chose, n'importe quoi. Puis quelque chose a changé. Je suis entré dans un flow que je n'avais pas ressenti depuis l'enfance quand je dessinais des heures. J'avais oublié cette sensation.",
      'traveler'
    ),
    seed(
      'modern-wisdom-3',
      "J'ai suivi mes interruptions pendant une journée et j'ai honte. 73 fois. J'ai cassé ma concentration 73 fois en 8 heures. Une fois toutes les 6,5 minutes en moyenne. Pas étonnant que j'aie l'impression de toujours travailler sans jamais finir quoi que ce soit. Mon attention n'est pas volée — je la donne, constamment.",
      'brother'
    ),
    seed(
      'modern-wisdom-3',
      "Je me suis demandé ce que signifie vraiment « travail profond » pour moi. Ce n'est pas seulement du temps de concentration — c'est faire le travail qui compte vraiment. Je dépense tant d'énergie sur des tâches urgentes mais pas importantes. Emails. Messages. Petites demandes. Pendant ce temps, les gros projets qui ont du sens restent intouchés. Je me cache dans l'occupation.",
      'sister'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 4: The Obstacle (modern-wisdom-4)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-4',
      "J'ai perdu mon travail le mois dernier. Je suis en spirale depuis, avec le sentiment d'être un échec. Mais cette leçon m'a fait poser une autre question : et si c'était POUR moi, pas CONTRE moi ? Et si c'était la poussée dont j'avais besoin pour poursuivre ce que je veux vraiment ? Je ne sais pas encore, mais le reframe m'a aidé. L'obstacle pourrait être le chemin.",
      'brother'
    ),
    seed(
      'modern-wisdom-4',
      "J'évite une conversation difficile avec ma mère depuis des années. Des années. Après cette leçon, j'ai réalisé que l'inconfort de la conversation est rien face au poids du non-dit. L'obstacle, ce n'est pas la conversation — c'est ma peur d'elle. Et j'ai laissé la peur gagner.",
      'sister'
    ),
    seed(
      'modern-wisdom-4',
      "Un déclic aujourd'hui sur ma façon de voir les problèmes. Je les ai toujours vus comme des interruptions de ma « vraie vie » — des choses à dépasser pour revenir à la normale. Et si traverser les problèmes était la vraie vie ? Et si la croissance ne se produisait que dans la lutte, jamais dans le confort ? Ça change tout.",
      'traveler'
    ),
    seed(
      'modern-wisdom-4',
      "Mon anxiété m'a toujours semblé être ma plus grande faiblesse. Mais aujourd'hui, je me suis demandé : et si c'était une information ? Et si elle me montrait ce qui compte le plus pour moi ? On ne devient pas anxieux pour ce qui ne compte pas. Peut-être que mon anxiété n'est pas à éliminer. Peut-être qu'elle est à écouter.",
      'sister'
    ),
    seed(
      'modern-wisdom-4',
      "Les histoires qu'on se raconte sur nos obstacles sont folles. Je me disais que je ne pouvais pas lancer une entreprise parce que je n'avais pas assez d'argent. Mais des gens avec moins ont fait plus. Le vrai obstacle, ce n'est pas l'argent — c'est ma peur de l'échec déguisée en prudence. Une fois que je l'ai vu, je ne pouvais plus l'oublier.",
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 5: Present Moment (modern-wisdom-5)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-5',
      "J'ai dîné ce soir sans mon téléphone pour la première fois depuis je ne sais plus quand. J'ai réellement goûté ma nourriture. J'ai remarqué la texture, la température, comment elle changeait en mâchant. C'était juste du riz et des légumes, rien de spécial, mais ça a été le repas le plus luxueux que j'ai eu depuis des mois. Je mange sans être présent depuis des années.",
      'sister'
    ),
    seed(
      'modern-wisdom-5',
      "Je me suis surpris aujourd'hui à faire ce truc où je suis physiquement là, mais mentalement déjà dans le prochain moment. Jouer avec mon enfant en pensant au travail. À table en planifiant demain. Sous la douche en répétant des conversations. Je ne suis jamais vraiment ICI. Je vis toujours à moitié dans un futur qui n'existe pas encore.",
      'brother'
    ),
    seed(
      'modern-wisdom-5',
      "L'exercice de respiration paraissait trop simple pour marcher. Juste remarquer la respiration ? C'est tout ? Mais quelque chose s'est passé. Pendant peut-être 30 secondes, mon esprit s'est tu. Pas de passé, pas de futur, juste le souffle. Et j'ai réalisé à quel point c'est rare — je ne suis presque jamais pleinement présent. 30 secondes de présence ont ressemblé à des vacances dans ma propre tête.",
      'traveler'
    ),
    seed(
      'modern-wisdom-5',
      "J'ai fait une promenade aujourd'hui en laissant mon téléphone à la maison. Au début je me suis senti nu, anxieux, comme s'il manquait quelque chose. Puis... le ciel avait l'air différent. Plus vif. J'ai remarqué des fleurs que je vois tous les jours. J'ai entendu des oiseaux. J'ai senti l'air. Quand ai-je cessé d'expérimenter le monde ? Quand mon téléphone est-il devenu plus réel que la réalité ?",
      'sister'
    ),
    seed(
      'modern-wisdom-5',
      "Je pense à tout ce que j'ai manqué en étant physiquement présent. Tous les couchers de soleil sur lesquels j'ai scrollé. Des conversations écoutées à moitié. Des moments avec ceux que j'aime où j'étais là sans être là. On ne récupère pas ce temps. Mais on peut choisir d'être présent à partir de maintenant. C'est ce que je choisis.",
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Generic reflections (fallback for any lesson)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      '_generic',
      "Certaines leçons touchent différemment selon où on en est dans la vie. Celle-ci m'a frappé aujourd'hui. Pas parce qu'elle m'a appris quelque chose de nouveau, mais parce qu'elle m'a rappelé quelque chose que j'avais oublié. Parfois, il faut entendre la même vérité d'un autre angle pour qu'elle s'imprime.",
      'traveler'
    ),
    seed(
      '_generic',
      "J'ai failli passer aujourd'hui. Je me suis dit que j'étais trop fatigué, trop occupé, pas dans le bon état d'esprit. Mais je suis venu quand même, et je suis content de l'avoir fait. Le fait de se présenter, c'est ça. Le contenu compte, mais la constance compte davantage. Je construis quelque chose, un jour à la fois.",
      'brother'
    ),
    seed(
      '_generic',
      "J'ai eu un de ces moments où quelque chose s'aligne et on ne peut plus le désapprendre. Le genre de compréhension qui change la façon de voir tout le reste. Ces leçons s'empilent d'une manière que je n'avais pas prévue. J'ai l'impression de devenir lentement une autre personne — ou peut-être de devenir davantage moi-même.",
      'sister'
    ),
  ],
  ar: [
    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 1: The Compound Effect (modern-wisdom-1)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-1',
      'كنت أركز كثيراً على اللحظات الكبيرة لدرجة أنني نسيت أن الحياة في الأساس سلسلة من اللحظات الصغيرة المتصلة. اليوم اخترت أن أشرب الماء بدل صودتي المعتادة. بدا الأمر بسيطاً، لكن هذه القراءة جعلتني أرى أن هذا هو المعنى. اللحظات الصغيرة هي المكان الذي يعيش فيه التغيير فعلاً.',
      'sister'
    ),
    seed(
      'modern-wisdom-1',
      'هذا لمسني بشكل مختلف. بدأت وتوقفت في أشياء كثيرة لأنني لم أرَ نتائج فورية. النادي، التأمل، القراءة... أستمر أسبوعاً ثم أترك. لكن ماذا لو كنت قد واصلت؟ ماذا لو وثقت بالمسار؟ سأبدأ غداً من جديد، لكن هذه المرة ألعب لعبة المدى الطويل.',
      'brother'
    ),
    seed(
      'modern-wisdom-1',
      'كانت جدتي تقول دائماً: «قليلاً قليلاً يصبح كثيراً». لم أفهمها حتى الآن. لقد بنت حياتها على أفعال صغيرة ثابتة—الاستيقاظ مبكراً، ادخار قليل من المال، اللطف حتى مع التعب. لم تفعل شيئاً درامياً، لكنها بنت شيئاً جميلاً. أريد أن أكون مثلها أكثر.',
      'traveler'
    ),
    seed(
      'modern-wisdom-1',
      'حسبتها، وبصراحة أخافتني قليلاً. إذا واصلت التمرير على مواقع التواصل ساعتين يومياً، فهذا 730 ساعة في السنة. 30 يوماً كاملة. شهر من حياتي، يضيع. لكن لو قلبتها—30 دقيقة قراءة يومياً تساوي 182 ساعة. كافية لقراءة أكثر من 50 كتاباً. نفس المبدأ، اتجاه مختلف. إلى أين أوجّه سفينتي؟',
      'brother'
    ),
    seed(
      'modern-wisdom-1',
      'كنت أفكر بهذا طوال اليوم. أنا لست حيث أريد في الحياة، وألقي اللوم على الظروف—عملي، المكان الذي أعيش فيه، وضعي العائلي. لكن إذا كنت صادقاً، فالآلاف من الاختيارات الصغيرة هي التي أوصلتني هنا. وهذا يعني أن آلاف الاختيارات الصغيرة يمكن أن تأخذني إلى مكان آخر. مخيف ومحرر في الوقت نفسه.',
      'sister'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 2: The Power of Tiny (modern-wisdom-2)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-2',
      'قاعدة الدقيقتين غيّرت شيئاً في داخلي اليوم. كنت أتجنب التمرين منذ أشهر لأنني لا أملك وقتاً لـ«تمرين حقيقي». اليوم اكتفيت بدقيقتين من التمدد. هذا كل شيء. وانتهى بي الأمر إلى 15 دقيقة لأن التوقف بعد البدء بدا غريباً. أصعب جزء هو البدء فعلاً.',
      'brother'
    ),
    seed(
      'modern-wisdom-2',
      'كنت أحاول كتابة يوميات منذ سنوات. سنوات. كنت أفشل لأنني كنت أظن أن علي كتابة صفحات من الأفكار العميقة. اليوم كتبت جملة واحدة: «أشعر بالتعب لكني آمل». هذه الجملة الواحدة جعلتني أشعر بإنجاز أكبر من كل محاولاتي الفاشلة لكتابة مقالات عن مشاعري.',
      'sister'
    ),
    seed(
      'modern-wisdom-2',
      'ترتيب سريري صباحاً بدا بسيطاً جداً حتى لا يُحسب. لكن عندما عدت بعد يوم صعب ورأيت السرير مرتباً، شعرت بشيء داخلي. كأن نفسي في الصباح تركت هدية صغيرة لنفسي الآن. تذكير بأنني شخص يعتني بالأشياء. شخص ينجز ما يبدأه. إنه مجرد سرير، لكنه أيضاً ليس مجرد سرير.',
      'traveler'
    ),
    seed(
      'modern-wisdom-2',
      'أدركت أنني عشت طوال حياتي بعقلية الكل أو لا شيء. إما تمرين ساعة أو لا شيء. إما أكل صحي تماماً أو إفراط. إما الاستيقاظ 5 صباحاً أو النوم حتى الظهر. هذه الدرس جعلني أرى كيف أبقتني هذه العقلية عالقاً. ربما الطريق الأوسط ليس ضعفاً—ربما هو حكمة.',
      'sister'
    ),
    seed(
      'modern-wisdom-2',
      'بدأت أفكر في الهوية اليوم. لطالما قلت «أنا لست شخصاً صباحياً» أو «أنا غير منظم» كما لو أنها حقائق ثابتة. لكن ماذا لو كانت الهوية مجرد أدلة متراكمة؟ إذا رتبت سريري لمدة شهر، ألا أصبح «شخصاً يرتب سريره»؟ نحن نصبح ما نفعله مراراً. هذا بسيط وعميق في آن واحد.',
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 3: Deep Work (modern-wisdom-3)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-3',
      'أطفأت الإشعارات لأول مرة منذ... لا أتذكر. بعد ساعتين كنت قد أنهيت عملاً يأخذني عادة يوماً كاملاً. ليس لأنني عملت بجهد أكبر—بل لأنني لم أتنقل بين السياقات. ذهني أوضح مما كان منذ أشهر. لماذا انتظرت كل هذا؟',
      'brother'
    ),
    seed(
      'modern-wisdom-3',
      'الحديث عن «الانشغال كوسام شرف» ناداني بقوة. كنت أفتخر بكم أنا منهكة، وكأن هذا يثبت أنني مهمة. لكن الانشغال والإنتاجية ليسا الشيء نفسه. بعض أكثر الأشخاص تأثيراً أعرفهم يبدون هادئين، مركزين، وكأنهم بطيئون. ربما هذا ليس رغم نجاحهم—بل بسببه.',
      'sister'
    ),
    seed(
      'modern-wisdom-3',
      'قمت بأول جلسة عمل عميق حقيقية اليوم. ضبطت مؤقتاً لـ90 دقيقة، وضعت هاتفي في غرفة أخرى، وأغلقت كل الألسنة إلا ما أحتاجه. أول 20 دقيقة كانت غير مريحة—دماغي كان يريد تفقد أي شيء. ثم حدث تحول. دخلت حالة تدفق لم أشعر بها منذ طفولتي عندما كنت أرسم لساعات. كنت قد نسيت هذا الشعور.',
      'traveler'
    ),
    seed(
      'modern-wisdom-3',
      'تتبعت مقاطعاتي ليوم واحد وأنا أشعر بالخجل. 73 مرة. قطعت تركيزي 73 مرة في 8 ساعات. مرة كل 6.5 دقائق تقريباً. لا عجب أنني أشعر أنني أعمل دائماً ولا أنهي شيئاً. انتباهي لا يُسرق—أنا أقدمه باستمرار.',
      'brother'
    ),
    seed(
      'modern-wisdom-3',
      'بدأت أفكر في معنى «العمل العميق» بالنسبة لي. ليس فقط وقت التركيز—بل القيام بالعمل الذي يهم فعلاً. أستهلك الكثير من طاقتي في مهام عاجلة لكنها غير مهمة. رسائل. طلبات صغيرة. وبينما ذلك يحدث، تبقى المشاريع الكبيرة ذات المعنى بلا لمس. أنا أختبئ في الانشغال.',
      'sister'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 4: The Obstacle (modern-wisdom-4)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-4',
      'فقدت عملي الشهر الماضي. وأنا أدور في حلقة منذ ذلك، أشعر بالفشل. لكن هذا الدرس جعلني أسأل سؤالاً مختلفاً: ماذا لو كان هذا يحدث لأجلي لا ضدي؟ ماذا لو كانت هذه الدفعة التي أحتاجها لأطارد ما أريده فعلاً؟ لست متأكداً بعد، لكن إعادة الصياغة ساعدتني. ربما العائق هو الطريق.',
      'brother'
    ),
    seed(
      'modern-wisdom-4',
      'كنت أتجنب محادثة صعبة مع أمي منذ سنوات. سنوات. بعد هذه الدرس، أدركت أن ألم المحادثة لا يقارن بثقل الصمت الطويل. العائق ليس المحادثة — بل خوفي منها. وقد تركت الخوف ينتصر.',
      'sister'
    ),
    seed(
      'modern-wisdom-4',
      'حدث شيء اليوم حول نظرتي للمشكلات. كنت أراها دائماً كتعطيل لحياتي «الحقيقية» — أشياء يجب تجاوزها لأعود إلى الوضع الطبيعي. ماذا لو كان التعامل مع المشكلات هو الحياة نفسها؟ ماذا لو كان النمو يحدث فقط في الصراع، وليس في الراحة؟ هذا يغيّر كل شيء.',
      'traveler'
    ),
    seed(
      'modern-wisdom-4',
      'لطالما شعرت أن قلقي هو أكبر ضعف لدي. لكن اليوم تساءلت: ماذا لو كان معلومة؟ ماذا لو كان يشير إلى ما يهمني أكثر؟ لا نشعر بالقلق تجاه ما لا يهمنا. ربما لا يجب أن أتخلص من قلقي، بل أن أستمع إليه وأتعامل معه.',
      'sister'
    ),
    seed(
      'modern-wisdom-4',
      'القصص التي نخبر بها أنفسنا عن عوائقنا مجنونة. كنت أقول إنني لا أستطيع بدء عمل لأنني لا أملك المال الكافي. لكن أشخاصاً أقل فعلوا أكثر. العائق الحقيقي ليس المال — بل خوفي من الفشل متنكراً كواقعية. عندما رأيت ذلك، لم أستطع ألا أراه.',
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Lesson 5: Present Moment (modern-wisdom-5)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      'modern-wisdom-5',
      'تناولت العشاء الليلة بلا هاتف لأول مرة منذ لا أعرف متى. تذوقت الطعام فعلاً. لاحظت قوامه، حرارته، وكيف يتغير أثناء المضغ. كان أرزاً وخضاراً فقط، لا شيء مميز، لكنه كان أكثر وجبة فاخرة تناولتها منذ أشهر. أتناول الطعام دون حضور منذ سنوات.',
      'sister'
    ),
    seed(
      'modern-wisdom-5',
      'لاحظت نفسي اليوم أفعل ذلك الشيء حيث أكون جسدياً هنا لكن ذهني في اللحظة القادمة. ألعب مع طفلي لكن أفكر في العمل. على العشاء لكن أخطط للغد. في الحمام لكن أتدرب على محادثات. أنا لا أكون هنا أبداً. أعيش دائماً نصف حياة في مستقبل لم يأتِ بعد.',
      'brother'
    ),
    seed(
      'modern-wisdom-5',
      'تمرين التنفس بدا بسيطاً جداً ليعمل. مجرد ملاحظة التنفس؟ هذا كل شيء؟ لكن شيئاً ما حدث عندما فعلته. ربما لثلاثين ثانية، صمت ذهني. لا ماضٍ ولا مستقبل، فقط النفس. أدركت كم هذا نادر — أنا نادراً ما أكون حاضراً بالكامل. ثلاثون ثانية من الحضور بدت كإجازة من عقلي.',
      'traveler'
    ),
    seed(
      'modern-wisdom-5',
      'خرجت في مشي اليوم وتركت هاتفي في البيت. في البداية شعرت أنني عارية، قلقة، كأن شيئاً ينقص. ثم... بدا السماء مختلفة. أكثر وضوحاً. لاحظت زهوراً أمر بجانبها كل يوم. سمعت الطيور. شعرت بالهواء. متى توقفت عن اختبار العالم؟ متى أصبح هاتفي أكثر واقعية من الواقع؟',
      'sister'
    ),
    seed(
      'modern-wisdom-5',
      'أفكر في كم من حياتي فاتني وأنا حاضر جسدياً فقط. غروب الشمس الذي مررت خلاله بالتمرير. أحاديث استمعت إليها بنصف قلب. لحظات مع من أحب كنت فيها هناك لكن لست هناك. لا يمكن استرجاع ذلك الوقت. لكن يمكنني أن أقرر أن أكون حاضراً من الآن. وهذا ما أختاره.',
      'brother'
    ),

    // ─────────────────────────────────────────────────────────────────────────
    // Generic reflections (fallback for any lesson)
    // ─────────────────────────────────────────────────────────────────────────
    seed(
      '_generic',
      'بعض الدروس تضرب بشكل مختلف بحسب أين أنت في الحياة. هذه الدرس ضربني اليوم. ليس لأنه أخبرني شيئاً لم أكن أعرفه، بل لأنه ذكرني بشيء كنت قد نسيته. أحياناً نحتاج أن نسمع الحقيقة نفسها من زاوية مختلفة حتى تثبت.',
      'traveler'
    ),
    seed(
      '_generic',
      'كدت أن أتجاوز اليوم. قلت لنفسي إنني متعب، مشغول، لست في الحالة المناسبة. لكنني حضرت على أي حال، وأنا ممتن لأنني فعلت. الحضور هو الشيء. المحتوى مهم، لكن الثبات أهم. أبني شيئاً هنا، يوماً بعد يوم.',
      'brother'
    ),
    seed(
      '_generic',
      'كانت إحدى تلك اللحظات التي يحدث فيها نقرة داخلية ولا يمكنك أن تعود كما كنت. نوع الفهم الذي يغيّر طريقة رؤيتك لكل شيء. هذه الدروس تتراكم بطريقة لم أتوقعها. أشعر أنني أصبح تدريجياً شخصاً آخر — أو ربما أصبح أكثر نفسي.',
      'sister'
    ),
  ],
};

export const SEED_REFLECTIONS: SeedReflection[] = SEED_REFLECTIONS_BY_LOCALE.en;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get seed reflections for a specific lesson
 * Falls back to generic reflections if none exist for the lesson
 */
export function getSeedReflectionsForLesson(lessonId: string, locale: Locale = 'en'): SeedReflection[] {
  const reflections = SEED_REFLECTIONS_BY_LOCALE[locale] || SEED_REFLECTIONS_BY_LOCALE.en;
  const specific = reflections.filter(r => r.lessonId === lessonId);
  if (specific.length > 0) return specific;

  // Fall back to generic reflections
  return reflections.filter(r => r.lessonId === '_generic');
}

/**
 * Get a random seed reflection for a lesson
 */
export function getRandomSeedReflection(lessonId: string, locale: Locale = 'en'): SeedReflection | null {
  const reflections = getSeedReflectionsForLesson(lessonId, locale);
  if (reflections.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * reflections.length);
  return reflections[randomIndex];
}

/**
 * Convert a seed reflection to a PublicReflection format
 */
export function seedToPublicReflection(seed: SeedReflection, lessonTitle: string): {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorId: string;
  authorGender: GenderIdentity;
  content: string;
  createdAt: string;
  isOpenToConnect: boolean;
  isSeed: true;
} {
  // Create a deterministic ID based on content (so same seed = same ID)
  const id = `seed-${seed.lessonId}-${seed.content.slice(0, 20).replace(/\s/g, '-')}`;

  // Random time in the last 24-72 hours
  const hoursAgo = Math.floor(Math.random() * 48) + 24;
  const createdAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

  return {
    id,
    lessonId: seed.lessonId,
    lessonTitle,
    authorId: `seed-author-${seed.gender}`,
    authorGender: seed.gender,
    content: seed.content,
    createdAt,
    isOpenToConnect: false, // Seed reflections can't connect
    isSeed: true,
  };
}
