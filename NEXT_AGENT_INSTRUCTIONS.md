# GrowthClaude: The Transformation Master Plan (Phases 5-9)

## Context

Phases 0-4 are complete. The app has a working lesson system (15 lessons, 3 chapters), Supabase auth (built but never wired up), gamification (XP, streaks, achievements), i18n, and a rich audio/visual engine. However:

- **Exercises are stale**: The 3 existing types (TruthMirror, SoulCompass, PresenceAnchor) are repetitive, template-like, and rely on breathing mechanics
- **10 of 15 lessons have zero exercises** (empty arrays in chapters 2 & 3)
- **Only 5 of 15 lessons have the no-writing path** — the other 10 are writing-only
- **Auth exists but is invisible** — LoginModal/SignupModal never rendered anywhere
- **Mobile has bugs** — viewport issues, keyboard overlap, no swipe gestures
- **Lesson paths for 6-15 need redesigning** — both writing AND no-writing paths

This plan replaces the entire exercise system with 5 game-like interaction types, redesigns both lesson paths for lessons 6-15, adds a breathtaking auth experience, and polishes every mobile pixel.

---

## PHASE 5: REVOLUTIONARY EXERCISE SYSTEM

### 5A. Delete Old Exercise System

**Delete these files entirely:**
- [TruthMirrorExercise.tsx](src/components/exercises/TruthMirrorExercise.tsx)
- [SoulCompassExercise.tsx](src/components/exercises/SoulCompassExercise.tsx)
- [PresenceAnchorExercise.tsx](src/components/exercises/PresenceAnchorExercise.tsx)

**Strip old exercise content from:**
- [modernWisdom.ts](src/content/modernWisdom.ts) — remove all `exercises: [...]` content in lessons 1-5
- [modernWisdomChapter2.ts](src/content/modernWisdomChapter2.ts) — currently empty arrays
- [modernWisdomChapter3.ts](src/content/modernWisdomChapter3.ts) — currently empty arrays

### 5B. New Type System

**File**: [dailyPractice.ts](src/types/dailyPractice.ts)

Replace `ExerciseType` (line 21-24), all 3 old content interfaces (lines 30-96), `DailyExercise.content` union (line 106), and type guards (lines 110-120):

```typescript
export type ExerciseType =
  | 'rapid-verdict'    // Tinder-style swipe cards with timer
  | 'priority-tower'   // Drag-and-drop value ranking
  | 'scenario-snap'    // Interactive branching story
  | 'heat-check'       // 2D emotional spectrum plotting
  | 'word-forge';      // Tap words to forge a personal mantra

// ── RAPID VERDICT ──
export interface RapidVerdictContent {
  statements: Array<{
    text: string;
    agreeTag: string;
    disagreeTag: string;
  }>;
  timePerCard: number;
  resultProfiles: Array<{
    tagPattern: string;
    title: string;
    description: string;
    emoji: string;
  }>;
  style: 'bold' | 'introspective' | 'playful';
}

// ── PRIORITY TOWER ──
export interface PriorityTowerContent {
  prompt: string;
  items: Array<{ id: string; emoji: string; label: string }>;
  insightsByTopChoice: Record<string, string>;
  completionMessage: string;
  style: 'warm' | 'stark' | 'cosmic';
}

// ── SCENARIO SNAP ──
export interface ScenarioSnapContent {
  title: string;
  frames: Array<{
    id: string;
    narrative: string;
    emoji: string;
    choices: Array<{
      id: string;
      text: string;
      trait: string;
      nextFrameId?: string;
    }>;
  }>;
  outcomes: Array<{
    traitPattern: string;
    title: string;
    insight: string;
    wisdomNudge: string;
    emoji: string;
  }>;
  style: 'tense' | 'awkward' | 'empowering' | 'vulnerable';
}

// ── HEAT CHECK ──
export interface HeatCheckContent {
  prompt: string;
  xAxis: { low: string; high: string };
  yAxis: { low: string; high: string };
  items: Array<{ id: string; label: string; emoji: string }>;
  quadrantInsights: {
    topLeft: string; topRight: string;
    bottomLeft: string; bottomRight: string;
  };
  completionMessage: string;
  style: 'analytical' | 'emotional' | 'raw';
}

// ── WORD FORGE ──
export interface WordForgeContent {
  prompt: string;
  words: Array<{
    id: string;
    text: string;
    category: 'action' | 'identity' | 'emotion' | 'value';
  }>;
  minSelections: number;
  maxSelections: number;
  forgeMessage: string;
  style: 'fiery' | 'serene' | 'electric';
}

export interface DailyExercise {
  id: string;
  type: ExerciseType;
  title: string;
  content: RapidVerdictContent | PriorityTowerContent | ScenarioSnapContent
         | HeatCheckContent | WordForgeContent;
}
```

Type guards for each using unique field checks (`statements` + `timePerCard` for RapidVerdict, `frames` + `outcomes` for ScenarioSnap, etc.)

### 5C. New Exercise Components

**Create 5 files:**

#### `src/components/exercises/RapidVerdictExercise.tsx`
- Full-screen draggable card stack (Framer Motion `drag="x"`)
- Green glow on right-drag, red on left-drag, with threshold (~100px)
- Spring physics snap-back if not dragged far enough
- Depleting timer bar at top per card (amber → rose color transition)
- Haptic pulse on each swipe
- Card count indicator ("4/10")
- Results screen: animated profile card with emoji, title, description
- Sound: swipe-left.mp3, swipe-right.mp3, result-reveal.mp3

#### `src/components/exercises/PriorityTowerExercise.tsx`
- Framer Motion `Reorder.Group` and `Reorder.Item` for drag-and-drop
- Items visually scale based on position — #1 is largest with glow, lower items progressively smaller
- Crown animation (scale from 0 → 1 with spring) on the top item
- Each reorder triggers haptic and subtle sound
- After confirming order: personalized insight based on top choice
- Completion message with gentle particle effect

#### `src/components/exercises/ScenarioSnapExercise.tsx`
- Full-screen frame-by-frame presentation
- Narrative text with typewriter effect (25ms/char)
- Emoji displayed large above narrative
- 2-3 choice cards appear below with stagger animation
- Selected card: expands slightly, others fade to 0.2 opacity
- Frame transitions: cinematic slide-left with 300ms duration
- Outcome screen: trait title + emoji, insight paragraph, wisdom nudge in amber italic
- Tracks trait accumulation across frames for final outcome matching

#### `src/components/exercises/HeatCheckExercise.tsx`
- Beautiful 2D grid (responsive, fills ~70% of screen height)
- Axis labels at edges, subtle grid lines
- Gradient quadrant tinting (soft, not overwhelming)
- Current item prompt at top with emoji
- Draggable circular marker (48px) with glow trail
- Each placed item persists as a smaller colored dot (24px) on the grid
- After all items: quadrant with most dots highlighted, insight displayed
- Haptic on each marker placement

#### `src/components/exercises/WordForgeExercise.tsx`
- Words in a floating scattered layout (Framer Motion `layoutId` for smooth transitions)
- Gentle drift animation on unselected words (translate Y by ±5px, 3s cycle)
- Category-coded glow colors: action=amber, identity=purple, emotion=rose, value=emerald
- Tap to select: word pulses, glows brighter, haptic
- Selected words magnetically animate to "forge zone" at bottom (reorder-aware)
- "Forge" button appears when minSelections reached
- On forge: words animate into a composed line, dramatic glow burst
- Forged statement displayed with subtle particle effect

### 5D. Update Exercise Orchestrator

**File**: [ExerciseExperience.tsx](src/components/exercises/ExerciseExperience.tsx)
- Replace imports (lines 9-11): old components → 5 new components
- Replace type imports (lines 13-23): old types → new types + guards
- Update rendering logic: 5 new `if` blocks with type guards routing to new components
- Update [ExerciseCard.tsx](src/components/exercises/ExerciseCard.tsx): new labels, icons, colors per type

### 5E. Exercise Content — Representative Lessons

#### LESSON 1: "The Weight You Carry" (Control)

**Exercise 1: Rapid Verdict — "What Can You Actually Control?"**
```
id: "ex-1-rapid-verdict"
statements: [
  { text: "Other people's opinions of me", agreeTag: "over-responsible", disagreeTag: "self-aware" },
  { text: "How I respond to criticism", agreeTag: "self-aware", disagreeTag: "reactive" },
  { text: "Whether my boss likes my work", agreeTag: "over-responsible", disagreeTag: "self-aware" },
  { text: "My effort level today", agreeTag: "self-aware", disagreeTag: "checked-out" },
  { text: "The outcome of a job interview", agreeTag: "over-responsible", disagreeTag: "self-aware" },
  { text: "What I eat for breakfast tomorrow", agreeTag: "self-aware", disagreeTag: "checked-out" },
  { text: "Whether someone texts me back", agreeTag: "over-responsible", disagreeTag: "self-aware" },
  { text: "My attitude when things go wrong", agreeTag: "self-aware", disagreeTag: "reactive" },
  { text: "Traffic on my commute", agreeTag: "over-responsible", disagreeTag: "self-aware" },
  { text: "How much I scroll my phone tonight", agreeTag: "self-aware", disagreeTag: "checked-out" }
]
timePerCard: 4
resultProfiles: [
  { tagPattern: "self-aware>=7", title: "The Stoic", description: "You instinctively know what's yours to control and what isn't. Your energy goes where it matters.", emoji: "🏛️" },
  { tagPattern: "over-responsible>=5", title: "The Atlas", description: "You carry the world on your shoulders — even the parts that aren't yours. Today's lesson was written for you.", emoji: "🌍" },
  { tagPattern: "reactive>=3", title: "The Storm Chaser", description: "You're drawn to what you can't control. The chaos feels familiar. Time to redirect that energy.", emoji: "⛈️" },
  { tagPattern: "checked-out>=3", title: "The Drifter", description: "You've let go of things you should probably hold onto. Control isn't bad — it's a tool.", emoji: "🌊" }
]
style: "bold"
```

**Exercise 2: Scenario Snap — "The Delayed Flight"**
```
id: "ex-1-scenario-snap"
title: "The Delayed Flight"
frames: [
  {
    id: "frame-1",
    narrative: "You're at the airport. Your flight just got delayed 3 hours. You have a meeting tomorrow morning that you absolutely cannot miss. The airline desk has a 40-person line.",
    emoji: "✈️",
    choices: [
      { id: "rage", text: "Storm to the desk and demand answers", trait: "control-seeker", nextFrameId: "frame-2a" },
      { id: "freeze", text: "Sit down and spiral about missing the meeting", trait: "catastrophizer", nextFrameId: "frame-2b" },
      { id: "adapt", text: "Pull out your phone and start looking for alternatives", trait: "adapter", nextFrameId: "frame-2c" }
    ]
  },
  {
    id: "frame-2a",
    narrative: "You wait 25 minutes in line. The agent tells you there are no other flights tonight. Your anger changed nothing. You lost 25 minutes you could have used to solve the problem.",
    emoji: "😤",
    choices: [
      { id: "double-down", text: "Demand to speak to a supervisor", trait: "control-seeker", nextFrameId: "frame-3" },
      { id: "pivot", text: "Step back, take a breath, and start problem-solving", trait: "adapter", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2b",
    narrative: "Your mind races: 'I'll get fired. This always happens to me. Nothing ever works out.' 20 minutes pass. You haven't done anything except worry.",
    emoji: "😰",
    choices: [
      { id: "keep-spiraling", text: "Text 3 people about how stressed you are", trait: "catastrophizer", nextFrameId: "frame-3" },
      { id: "snap-out", text: "Stop. Ask yourself: what CAN I do right now?", trait: "adapter", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2c",
    narrative: "You find a train that gets you there by 6am. It's not perfect, but it works. You book it in 3 minutes while others are still in the complaint line.",
    emoji: "🚄",
    choices: [
      { id: "relief", text: "Feel proud you found a solution", trait: "adapter", nextFrameId: "frame-3" },
      { id: "still-angry", text: "Still frustrated — the airline SHOULD fix this", trait: "control-seeker", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-3",
    narrative: "The next morning, you made it. Whether you raged, spiraled, or adapted — the flight was still delayed. The only thing that changed was how much energy you burned.",
    emoji: "🌅",
    choices: []
  }
]
outcomes: [
  { traitPattern: "adapter>=2", title: "The Adapter", insight: "You default to solving what you can. When the world throws chaos, you redirect instead of resist.", wisdomNudge: "Your instinct is right. Energy spent on what you can't control is energy stolen from what you can.", emoji: "🧭" },
  { traitPattern: "control-seeker>=2", title: "The Fighter", insight: "Your instinct is to wrestle reality into submission. Sometimes that's strength. But when the flight is delayed, the fight is with yourself.", wisdomNudge: "Not every battle is yours to fight. The Stoics knew: control your response, release the outcome.", emoji: "⚔️" },
  { traitPattern: "catastrophizer>=2", title: "The Forecaster", insight: "Your mind runs worst-case simulations constantly. It feels like preparation, but it's actually pre-suffering.", wisdomNudge: "You suffered the meeting disaster a hundred times in your head. It happened zero times in reality.", emoji: "🌪️" }
]
style: "tense"
```

**Exercise 3: Word Forge — "My Letting Go Mantra"**
```
id: "ex-1-word-forge"
prompt: "Forge your personal letting-go mantra. Tap the words that speak to you."
words: [
  { id: "w1", text: "I release", category: "action" },
  { id: "w2", text: "what I cannot", category: "emotion" },
  { id: "w3", text: "control", category: "value" },
  { id: "w4", text: "my peace", category: "identity" },
  { id: "w5", text: "is mine", category: "identity" },
  { id: "w6", text: "I choose", category: "action" },
  { id: "w7", text: "to protect", category: "action" },
  { id: "w8", text: "the weight", category: "emotion" },
  { id: "w9", text: "isn't mine", category: "emotion" },
  { id: "w10", text: "I am free", category: "identity" },
  { id: "w11", text: "surrender", category: "action" },
  { id: "w12", text: "my energy", category: "value" },
  { id: "w13", text: "what matters", category: "value" },
  { id: "w14", text: "enough", category: "identity" },
  { id: "w15", text: "let go", category: "action" }
]
minSelections: 3
maxSelections: 5
forgeMessage: "You forged this from your own truth. Return to it when the weight feels heavy."
style: "serene"
```

---

#### LESSON 6: "The Comeback Formula" (Resilience)

**Exercise 1: Rapid Verdict — "Are You Still Holding On?"**
```
id: "ex-6-rapid-verdict"
statements: [
  { text: "I still replay my biggest failure in my head", agreeTag: "holding-on", disagreeTag: "moved-on" },
  { text: "I've used a past failure to fuel something better", agreeTag: "alchemist", disagreeTag: "holding-on" },
  { text: "I avoid situations similar to where I failed before", agreeTag: "avoidant", disagreeTag: "moved-on" },
  { text: "I secretly believe some failures define me", agreeTag: "holding-on", disagreeTag: "moved-on" },
  { text: "I can talk about my setbacks without shame", agreeTag: "alchemist", disagreeTag: "holding-on" },
  { text: "I've let a failure stop me from trying again", agreeTag: "avoidant", disagreeTag: "alchemist" },
  { text: "My biggest setback taught me something I couldn't learn any other way", agreeTag: "alchemist", disagreeTag: "holding-on" },
  { text: "I compare where I am to where I 'should' be", agreeTag: "holding-on", disagreeTag: "moved-on" },
  { text: "I bounce back faster now than I used to", agreeTag: "alchemist", disagreeTag: "avoidant" },
  { text: "There's a comeback I'm overdue to make", agreeTag: "ready", disagreeTag: "comfortable" }
]
timePerCard: 4
resultProfiles: [
  { tagPattern: "alchemist>=5", title: "The Phoenix", description: "You don't just survive setbacks — you transform them into fuel. Your comeback muscle is strong.", emoji: "🔥" },
  { tagPattern: "holding-on>=5", title: "The Wounded Warrior", description: "Old battles still echo in your mind. The wound is real, but it's time to let it become a scar — proof you survived.", emoji: "🩹" },
  { tagPattern: "avoidant>=3", title: "The Once-Bitten", description: "You've learned to dodge what hurt you. Smart for survival. But the comeback requires walking back into the arena.", emoji: "🛡️" },
  { tagPattern: "ready>=1", title: "The Coiled Spring", description: "There's something inside you ready to launch. You know exactly what comeback you need to make. The question is: when?", emoji: "🚀" }
]
style: "bold"
```

**Exercise 2: Priority Tower — "What Matters Most in a Comeback"**
```
id: "ex-6-priority-tower"
prompt: "When you're rebuilding after a setback, which of these matters most? Drag to rank — your #1 goes to the top."
items: [
  { id: "pt-grit", emoji: "💪", label: "Raw determination" },
  { id: "pt-plan", emoji: "📋", label: "A clear plan" },
  { id: "pt-support", emoji: "🤝", label: "People who believe in me" },
  { id: "pt-lesson", emoji: "📖", label: "Understanding why I fell" },
  { id: "pt-patience", emoji: "⏳", label: "Patience with myself" },
  { id: "pt-anger", emoji: "🔥", label: "Healthy anger as fuel" }
]
insightsByTopChoice: {
  "pt-grit": "You believe willpower is the engine of comeback. You're right — but even engines need fuel. Don't forget the people and lessons that keep you going.",
  "pt-plan": "Strategy over emotion. You know that comebacks aren't random — they're engineered. Just don't plan so long that you forget to start.",
  "pt-support": "You know the secret most people miss: nobody comes back alone. The strongest people aren't self-made — they're well-supported.",
  "pt-lesson": "Understanding before action. You refuse to repeat the same mistake. That's wisdom — but don't let analysis become another form of avoidance.",
  "pt-patience": "You know that healing has its own timeline. Rare and mature. Just make sure patience doesn't become permission to stay still.",
  "pt-anger": "You channel pain into power. Anger is jet fuel — explosive and effective. Just make sure you're building something, not just burning something down."
}
completionMessage: "Your comeback formula is uniquely yours. No one else ranks these the same way. That's your edge."
style: "warm"
```

**Exercise 3: Scenario Snap — "The Second Chance"**
```
id: "ex-6-scenario-snap"
title: "The Second Chance"
frames: [
  {
    id: "frame-1",
    narrative: "You pour 6 months into a project — a business idea, a creative work, a relationship repair. You give it everything. Then it falls apart spectacularly. Not a quiet fade. A public, visible failure.",
    emoji: "💔",
    choices: [
      { id: "hide", text: "Withdraw. Avoid everyone who saw it fail.", trait: "retreater", nextFrameId: "frame-2a" },
      { id: "blame", text: "Find what went wrong — was it me or the circumstances?", trait: "analyzer", nextFrameId: "frame-2b" },
      { id: "immediately", text: "Start planning the next attempt before the dust settles", trait: "charger", nextFrameId: "frame-2c" }
    ]
  },
  {
    id: "frame-2a",
    narrative: "Three months pass. You've avoided the topic, changed the subject whenever it comes up. But at 3am, it's all you think about. The avoidance didn't make it smaller. It made it louder.",
    emoji: "🌙",
    choices: [
      { id: "face-it", text: "Okay. Time to face this.", trait: "analyzer", nextFrameId: "frame-3" },
      { id: "numb", text: "Distract yourself. Scroll. Stay busy. Don't feel it.", trait: "retreater", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2b",
    narrative: "You identify 3 mistakes: you moved too fast, you didn't ask for help, and you ignored warning signs. It hurts to see so clearly. But now you KNOW.",
    emoji: "🔍",
    choices: [
      { id: "use-it", text: "Good. Now I know exactly what to do differently.", trait: "charger", nextFrameId: "frame-3" },
      { id: "shame", text: "How could I have been so blind? I should have known.", trait: "retreater", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2c",
    narrative: "You launch version 2 within a month. Same energy, same drive. But you haven't processed what went wrong. Six weeks in, the same cracks appear.",
    emoji: "⚡",
    choices: [
      { id: "pause", text: "Stop. I need to understand before I rebuild.", trait: "analyzer", nextFrameId: "frame-3" },
      { id: "push", text: "Push harder. Force it to work this time.", trait: "charger", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-3",
    narrative: "A year later, you look back. The failure wasn't the end of the story — it was the middle. What you built next was shaped by what broke. The comeback was always in you. The failure just showed you where to aim it.",
    emoji: "🌅",
    choices: []
  }
]
outcomes: [
  { traitPattern: "analyzer>=2", title: "The Strategist", insight: "You process before you rebuild. Your comebacks are calculated, not reckless. The scar becomes a blueprint.", wisdomNudge: "Your method works. Just don't let analysis become its own form of hiding. At some point, you have to move.", emoji: "🧠" },
  { traitPattern: "retreater>=2", title: "The Hibernator", insight: "Your instinct is to protect yourself by withdrawing. It's not weakness — it's a survival pattern. But the cave isn't where comebacks happen.", wisdomNudge: "Healing in silence is valid. But at some point, you have to step back into the light. The world is waiting for your second act.", emoji: "🐻" },
  { traitPattern: "charger>=2", title: "The Relentless", insight: "You don't stop moving. Failure is just a speed bump. That energy is your superpower — but only if you point it at the right target.", wisdomNudge: "Speed without reflection is just running in circles. Pause long enough to aim, then charge.", emoji: "🐎" }
]
style: "vulnerable"
```

---

#### LESSON 11: "The Mirror Effect" (Relationships)

**Exercise 1: Rapid Verdict — "Trigger Check"**
```
id: "ex-11-rapid-verdict"
statements: [
  { text: "People who brag make my blood boil", agreeTag: "triggered", disagreeTag: "unbothered" },
  { text: "I can listen to opinions I disagree with without getting angry", agreeTag: "unbothered", disagreeTag: "triggered" },
  { text: "When someone succeeds easily, I feel a sting", agreeTag: "shadow", disagreeTag: "secure" },
  { text: "Overly emotional people drain me", agreeTag: "triggered", disagreeTag: "empathic" },
  { text: "I get annoyed by people who can't make decisions", agreeTag: "triggered", disagreeTag: "patient" },
  { text: "When someone ignores me, I take it personally", agreeTag: "shadow", disagreeTag: "secure" },
  { text: "I respect people who are brutally honest", agreeTag: "honest-seeker", disagreeTag: "comfort-seeker" },
  { text: "Fake positivity irritates me more than negativity", agreeTag: "triggered", disagreeTag: "unbothered" },
  { text: "I judge people who give up too easily", agreeTag: "shadow", disagreeTag: "empathic" },
  { text: "I can genuinely celebrate a rival's success", agreeTag: "secure", disagreeTag: "shadow" }
]
timePerCard: 4
resultProfiles: [
  { tagPattern: "secure>=6", title: "The Clear Mirror", description: "You see others without your own wounds distorting the image. That's rare emotional maturity.", emoji: "🪞" },
  { tagPattern: "triggered>=4", title: "The Reactive Mirror", description: "Other people's behavior hits your nerve endings hard. Every trigger is a message about something unresolved in YOU.", emoji: "⚡" },
  { tagPattern: "shadow>=4", title: "The Shadow Spotter", description: "What you judge in others is often what you fear in yourself. The mirror is trying to show you something.", emoji: "🌑" },
  { tagPattern: "empathic>=3", title: "The Absorber", description: "You feel others deeply. But sometimes what you call empathy is actually your own wounds resonating.", emoji: "🫧" }
]
style: "introspective"
```

**Exercise 2: Heat Check — "My Relationship Triggers"**
```
id: "ex-11-heat-check"
prompt: "Where do these land on YOUR grid?"
xAxis: { low: "Doesn't bother me", high: "Deeply triggers me" }
yAxis: { low: "I see it in others", high: "I recognize it in myself" }
items: [
  { id: "hc-dishonesty", label: "Dishonesty", emoji: "🎭" },
  { id: "hc-arrogance", label: "Arrogance", emoji: "👑" },
  { id: "hc-neediness", label: "Neediness", emoji: "🫠" },
  { id: "hc-laziness", label: "Laziness", emoji: "🛋️" },
  { id: "hc-criticism", label: "Harsh criticism", emoji: "🔪" }
]
quadrantInsights: {
  topRight: "You're triggered AND you see it in yourself. This is shadow work territory — the mirror is crystal clear.",
  topLeft: "You see it in yourself but it doesn't bother you. Self-awareness without reactivity. That's growth.",
  bottomRight: "It triggers you but you only see it in others. The mirror is foggy — look closer.",
  bottomLeft: "Doesn't bother you and you see it in others. This isn't your wound. Move on."
}
completionMessage: "Your trigger map is a blueprint for self-understanding. The things that bother you most about others are often the things you haven't resolved in yourself."
style: "emotional"
```

**Exercise 3: Scenario Snap — "The Dinner Table"**
```
id: "ex-11-scenario-snap"
title: "The Dinner Table"
frames: [
  {
    id: "frame-1",
    narrative: "You're at dinner with friends. One friend starts dominating the conversation — interrupting everyone, making everything about them. You feel your jaw tighten.",
    emoji: "🍽️",
    choices: [
      { id: "confront", text: "Interrupt them back. Give them a taste of their own medicine.", trait: "mirror-fighter", nextFrameId: "frame-2a" },
      { id: "observe", text: "Notice your reaction. Why does this bother me so much?", trait: "mirror-seeker", nextFrameId: "frame-2b" },
      { id: "withdraw", text: "Go quiet. Check your phone. Disengage.", trait: "mirror-avoider", nextFrameId: "frame-2c" }
    ]
  },
  {
    id: "frame-2a",
    narrative: "You cut in loudly. The table goes quiet. Your friend looks hurt. You got their attention — but now you're the one dominating. The mirror just reflected.",
    emoji: "😬",
    choices: [
      { id: "realize", text: "Wait... am I doing exactly what triggered me?", trait: "mirror-seeker", nextFrameId: "frame-3" },
      { id: "justify", text: "Someone had to put them in their place.", trait: "mirror-fighter", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2b",
    narrative: "You sit with the discomfort. Why does their need for attention bother you? Maybe... because you also want to be heard but never let yourself take up space?",
    emoji: "💡",
    choices: [
      { id: "deep", text: "That's uncomfortable but probably true.", trait: "mirror-seeker", nextFrameId: "frame-3" },
      { id: "deflect", text: "No, they're just rude. This isn't about me.", trait: "mirror-fighter", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-2c",
    narrative: "You disappear into your phone. Nobody notices. You feel relieved — and then lonely. You're physically at the table but emotionally gone.",
    emoji: "📱",
    choices: [
      { id: "pattern", text: "I do this a lot. Withdraw instead of engage.", trait: "mirror-seeker", nextFrameId: "frame-3" },
      { id: "fine", text: "Better than conflict. I just don't need the drama.", trait: "mirror-avoider", nextFrameId: "frame-3" }
    ]
  },
  {
    id: "frame-3",
    narrative: "Later that night, you think about it. The friend was annoying, sure. But your REACTION — that was yours. The intensity of it. The way it gripped you. That part has nothing to do with them.",
    emoji: "🌙",
    choices: []
  }
]
outcomes: [
  { traitPattern: "mirror-seeker>=2", title: "The Self-Examiner", insight: "You turned the mirror inward. Most people never do this. The trigger became a teacher.", wisdomNudge: "Keep looking. Every strong reaction to another person is data about yourself. Not pleasant data — but the most valuable kind.", emoji: "🔬" },
  { traitPattern: "mirror-fighter>=2", title: "The Reactor", insight: "You fight what triggers you. But the fight often puts you in the exact position you were judging someone else for.", wisdomNudge: "Before you react to someone's behavior, ask: am I about to do the same thing I'm criticizing? The mirror doesn't lie.", emoji: "⚔️" },
  { traitPattern: "mirror-avoider>=2", title: "The Disappearer", insight: "Your defense is to leave — physically or emotionally. It protects you, but it also isolates you.", wisdomNudge: "Withdrawal feels safe, but it's also a mirror. If someone's presence triggers you to leave, ask what you're really running from.", emoji: "👻" }
]
style: "awkward"
```

### 5F. Exercise Distribution (All 15 Lessons)

| Lesson | Ex 1 | Ex 2 | Ex 3 |
|--------|------|------|------|
| 1 — The Weight You Carry | rapid-verdict | scenario-snap | word-forge |
| 2 — The Power of Tiny | heat-check | rapid-verdict | priority-tower |
| 3 — The Hidden Gift | scenario-snap | word-forge | heat-check |
| 4 — Own Your Morning | priority-tower | heat-check | rapid-verdict |
| 5 — The Gratitude Shift | word-forge | scenario-snap | priority-tower |
| 6 — Comeback Formula | rapid-verdict | priority-tower | scenario-snap |
| 7 — Embrace the Struggle | heat-check | word-forge | rapid-verdict |
| 8 — Fear-Setting | scenario-snap | rapid-verdict | heat-check |
| 9 — Antifragile Mind | word-forge | heat-check | priority-tower |
| 10 — Future Self Letter | priority-tower | scenario-snap | word-forge |
| 11 — Mirror Effect | rapid-verdict | heat-check | scenario-snap |
| 12 — Radical Honesty | scenario-snap | word-forge | rapid-verdict |
| 13 — Boundaries | heat-check | priority-tower | word-forge |
| 14 — Empathy Shift | word-forge | rapid-verdict | priority-tower |
| 15 — Forgiveness | priority-tower | scenario-snap | heat-check |

Remaining 12 lessons follow the same content depth and quality as lessons 1, 6, and 11 above — all thematically specific, never generic.

### 5G. Verification

- [ ] `npx tsc --noEmit` passes — zero type errors
- [ ] Each of 5 exercise components renders with mock data
- [ ] ExerciseExperience routes to correct component by type
- [ ] All 15 lessons have 3 exercises with valid, thematic content
- [ ] Zero imports of old exercise components remain anywhere
- [ ] End-to-end: complete all exercises for lessons 1, 6, and 11

---

## PHASE 6: DUAL-PATH REDESIGN (ALL 15 LESSONS)

### Goal
- Lessons 6-15: Add `engagementSteps` (no-writing path)
- Lessons 6-15: Redesign `steps` (writing path) to be more engaging and less formulaic
- Both paths must feel genuinely different — not one being a watered-down version of the other

### Files to Modify
- [modernWisdomChapter2.ts](src/content/modernWisdomChapter2.ts) — lessons 6-10 (both paths)
- [modernWisdomChapter3.ts](src/content/modernWisdomChapter3.ts) — lessons 11-15 (both paths)

### Writing Path Redesign Principles (lessons 6-15)
The current writing steps are functional but formulaic. Redesign to:
- Use more `choice` steps with branching (not just linear progression)
- Add `mentor` responses that feel genuinely personalized
- Include at least one `visualization` or `tapFlow` per lesson (not all writing)
- Keep timers short (30-60s max, not 120s)
- End with a specific, actionable `commitment` (not vague reflection)

### Engagement Path Design (lessons 6-15)
Each engagement path uses these step types:
- `resonanceCheck` (multi-select tap) — replaces `commitment`
- `scaleRating` (1-5 scale) — replaces `reflection`
- `affirmation` (dramatic confirm) — replaces `goDoIt`
- `tapFlow` (user-paced tap-through) — replaces `visualization`/`timer`
- Keep shared: `scenario`, `insight`, `choice`, `mentor`, `reward`

### Representative: Lesson 6 Engagement Path
```
1. scenario: "You pour everything into something. Then it collapses." (mood: tension)
2. resonanceCheck: "Which setback is still echoing?"
   options: [
     "A career failure I haven't recovered from",
     "A relationship that ended badly",
     "A dream I gave up on",
     "A financial loss that still stings",
     "A public embarrassment I replay",
     "A betrayal I didn't see coming"
   ]
3. insight: "Every setback carries a hidden curriculum..." (style: revelation)
4. tapFlow: "The Comeback Formula" — 4 taps:
   - "Step 1: Name the wound. Don't dress it up."
   - "Step 2: Extract the lesson. What did the failure TEACH you?"
   - "Step 3: Identify what you'd do differently. Not 'everything.' Specifically."
   - "Step 4: Take one action in the next 24 hours. Not a plan. An action."
5. scaleRating: "How ready are you to make your comeback?"
   lowLabel: "Not yet" / highLabel: "Right now"
   responses: low="Readiness isn't required. Just willingness." / mid="You're closer than you think." / high="Then what are you waiting for?"
6. affirmation: "I am not defined by what happened to me. I am defined by what I do next." (style: strength)
7. reward
```

### Representative: Lesson 6 Redesigned Writing Path
```
1. scenario: same opening
2. insight: "Tim Ferriss failed at 7 businesses before writing The 4-Hour Workweek..." (style: principle)
3. commitment: "Name your setback. Don't soften it. Write it raw." (storeAs: setback, minimumWords: 10)
4. choice: "What did this failure actually teach you?"
   - "It taught me about myself" → insight about self-discovery in failure
   - "It taught me about others" → insight about trust/boundaries
   - "It taught me about my priorities" → insight about clarity through loss
5. commitment: "Write your one-sentence comeback declaration. Start with 'I will...'" (storeAs: comeback, minimumWords: 8)
6. visualization: "Close your eyes. See yourself one year from now, having made this comeback. What does your life look like? What are you most proud of?" (paceSeconds: 5)
7. reflection: "What is ONE specific action you can take in the next 24 hours toward your comeback? Not a plan — an action." (minimumWords: 10)
8. reward + mentor response based on comeback declaration
```

Each of lessons 7-15 follows this same depth for BOTH paths. Content is thematically unique to each lesson.

### Verification
- [ ] `LessonModeSelector` shows both options for ALL 15 lessons
- [ ] Each engagement path completes end-to-end without text input
- [ ] Each writing path has branching choices and specific commitments
- [ ] Deep and engagement paths never share identical step sequences

---

## PHASE 7: BREATHTAKING AUTH EXPERIENCE

### 7A. The "Origin Point" Onboarding Step

**New flow** (9 steps, was 8):
```
Welcome → Name → Identity → Goal → Why → Path → Commitment → ORIGIN POINT (new) → Celebration
```

**Create**: `src/components/onboarding/steps/AuthStep.tsx`

**Modify**: [OnboardingFlow.tsx](src/components/onboarding/OnboardingFlow.tsx)
- `TOTAL_STEPS`: 8 → 9 (line 35)
- `STEP_KEYS`: insert `'createOrigin'` at index 7 (line 38)
- Import and render `AuthStep` at step 7
- Shift `ReadyStep` to step 8

**AuthStep Design — "The Origin Point":**

Framing text (animated fade-in, staggered lines):
> *"Every transformation has an origin point."*
> *"The exact moment you stopped watching and started becoming."*
> *"This is yours."*
> *"Seal it."*

**Three-phase component:**

1. **Reveal** (2s): Text fades in line-by-line against vivid AmbientBackground. Particles converge to a central glowing point.

2. **Form**: Minimalist, emotionally designed:
   - Email field with glowing amber border on focus, floating label
   - Password field with same treatment + strength indicator (not a bar — a small flame that grows)
   - **"Seal with Google"** button (prominent, styled like a golden seal)
   - **"Continue as a wanderer"** link (subtle, bottom — NEVER blocks the journey)
   - Error states: gentle, poetic ("That path is already marked — try another")

3. **Seal Animation**: On success — a circular golden seal stamp scales from 0→1 with spring physics, golden particle burst, then auto-advance to celebration step

**Mobile keyboard:**
- `visualViewport` API to detect keyboard
- Auto-scroll input into view on focus
- `inputMode="email"`, `autoComplete="email"` / `autoComplete="new-password"`
- 16px font (prevents iOS auto-zoom)

### 7B. Auth Across the App

**Modify**: [page.tsx](src/app/page.tsx)
- Add `showLogin`/`showSignup` state
- Render `LoginModal` and `SignupModal` (currently never rendered)
- Pass callbacks to child components

**Modify**: [SettingsPanel.tsx](src/components/settings/SettingsPanel.tsx)
- Add Account section:
  - Authenticated + real email: show email, "Sign Out" button
  - Authenticated + anonymous: show "Link Your Account" button
  - Not authenticated: show "Sign In" / "Create Account"

### 7C. i18n
Add auth step translations to [en.ts](src/i18n/locales/en.ts), [fr.ts](src/i18n/locales/fr.ts), [ar.ts](src/i18n/locales/ar.ts)

### Verification
- [ ] 9-step onboarding with auth after Commitment
- [ ] "Continue as wanderer" skips auth cleanly
- [ ] Google OAuth works on mobile
- [ ] Email/password creates Supabase account
- [ ] Settings shows auth state with sign in/out
- [ ] Mobile keyboard doesn't overlap fields

---

## PHASE 8: MOBILE-FIRST PERFECTION

### 8A. Viewport & Height Fixes

| File | Fix |
|------|-----|
| [EchoInbox.tsx](src/components/echoes/EchoInbox.tsx) | `100vh` → `100dvh` |
| [globals.css](src/app/globals.css) | Add `.h-screen-safe { height: 100dvh }` utility |
| All step components with `min-h-[70vh]` | Standardize to `min-h-[70dvh]` |

### 8B. Keyboard Handling

**Create**: `src/hooks/useKeyboardAware.ts`
- `visualViewport` API for keyboard detection
- Returns `{ keyboardHeight, isKeyboardOpen }`
- Auto-scrolls focused input into view

**Apply to**: LoginModal, SignupModal, AuthStep, CommitmentStep, ReflectionStep

### 8C. Focus Trap

**Create**: `src/hooks/useFocusTrap.ts` — Tab trapping, Escape to close, focus return

**Apply to**: LoginModal, SignupModal, CoachModal

### 8D. Swipe Gestures

| Location | Gesture |
|----------|---------|
| [OnboardingFlow.tsx](src/components/onboarding/OnboardingFlow.tsx) | Swipe left/right between steps |
| [FlexibleLessonExperience.tsx](src/components/lesson/FlexibleLessonExperience.tsx) | Swipe left to advance (non-writing steps only) |
| [EchoInbox.tsx](src/components/echoes/EchoInbox.tsx) | Swipe between tabs |

Implementation: Framer Motion `drag="x"` with velocity threshold on `onDragEnd`

### 8E. Enhanced PWA

| File | Changes |
|------|---------|
| [manifest.json](public/manifest.json) | Maskable icons, shortcuts (Home, Today's Lesson), categories, screenshots |
| [layout.tsx](src/app/layout.tsx) | `<link rel="apple-touch-icon">`, verify apple-mobile-web-app-capable |
| Create `public/icon-*-maskable.png` | 192px and 512px with safe-zone padding |

### 8F. Performance
- Dynamic imports for exercise components (`next/dynamic`)
- Animation audit: all Framer Motion uses `transform`/`opacity` only
- Verify AmbientBackground GPU optimization on mobile

### 8G. Touch Polish
- `active:scale-95` on all interactive cards/buttons
- Haptic patterns: completion (double-pulse), achievement (triple-pulse), swipe (single)
- Verify all touch targets ≥ 44px

### Verification
- [ ] Real iPhone Safari + Android Chrome — zero overflow/address bar issues
- [ ] Keyboard never overlaps input fields
- [ ] Focus trapped in all modals
- [ ] Swipe gestures work in onboarding, lessons, echoes
- [ ] PWA install works on both platforms with correct icons
- [ ] Lighthouse mobile > 90
- [ ] No animation jank on mid-tier Android

---

## PHASE 9: POLISH & DELIGHT

### 9A. Dynamic Lesson Theme Colors
Each lesson gets an accent color tinting AmbientBackground and progress bars.
- Ch1 (Foundations): amber/gold spectrum
- Ch2 (Resilience): rose/crimson spectrum
- Ch3 (Relationships): violet/indigo spectrum
- Add `themeColor` to lesson type, pass to AmbientBackground

### 9B. Exercise Sound Library
Each exercise type gets unique audio:
- RapidVerdict: swipe-left.mp3, swipe-right.mp3
- PriorityTower: place-item.mp3, reorder.mp3
- ScenarioSnap: frame-advance.mp3, choice-select.mp3
- HeatCheck: marker-place.mp3
- WordForge: word-select.mp3, forge-complete.mp3
- Shared: result-reveal.mp3

### 9C. Lesson Preview Animation
2-3s cinematic intro before each lesson: title zooms in, subtitle fades up, theme color washes, icon pulses.
**Create**: `src/components/lesson/LessonPreview.tsx`

### 9D. "Week in Review" Summary Card
Beautiful summary after 7 active days: lessons done, exercises completed, streak length. Shareable as image.
**Create**: `src/components/weekly/WeekSummaryCard.tsx`

### 9E. Streak Shield
Earned at 7-day streak. Protects one missed day. Shield icon on home screen.
**Modify**: [useStore.ts](src/store/useStore.ts) — add `streakShieldCount`, shield consumption logic

### 9F. Contextual Home Greeting
Dynamic greeting based on time of day, streak length, recent lesson topic.
**Create**: `src/lib/greetingEngine.ts`
**Modify**: [HeroGreeting.tsx](src/components/home/HeroGreeting.tsx)

### 9G. Adaptive Exercise Difficulty
Track speed. Fast users get tighter timers. Struggling users get fewer items.
**Create**: `src/lib/adaptiveDifficulty.ts`
**Modify**: `useDailyPracticeStore` — add performance tracking

### 9H. Streak Calendar Heatmap
GitHub-style contribution grid in TransformationHub. SVG, 7×N weeks, gold color scale.
**Add to**: [TransformationHub.tsx](src/components/transformation/TransformationHub.tsx)

### Verification
- [ ] Each lesson has distinct theme color
- [ ] All exercise types have audio signatures
- [ ] Lesson preview plays before each lesson
- [ ] Week summary appears after 7 active days
- [ ] Streak shield earns and protects correctly
- [ ] Greeting changes by time of day
- [ ] Difficulty adapts after 5+ completions
- [ ] Calendar renders in Transformation Hub

---

## IMPLEMENTATION SEQUENCE

```
PHASE 5 — Exercise Revolution (foundation — everything depends on this)
  ├─ 5A: Delete old types + components
  ├─ 5B: New type system
  ├─ 5C: Build 5 exercise components
  ├─ 5D: Update orchestrator
  └─ 5E: Write content for all 15 lessons

PHASE 6 — Dual-Path (depends on Phase 5)
  └─ Redesign both paths for lessons 6-15

PHASE 7 — Auth Experience (independent, can parallel Phase 6)
  ├─ 7A: AuthStep onboarding component
  ├─ 7B: Wire auth to Settings + page.tsx
  └─ 7C: i18n

PHASE 8 — Mobile-First (after feature work)
  ├─ 8A-B: Viewport + keyboard fixes
  ├─ 8C-D: Focus traps + swipe gestures
  └─ 8E-G: PWA + performance + touch

PHASE 9 — Polish & Delight (final layer)
  └─ Enhancements 9A through 9H
```
