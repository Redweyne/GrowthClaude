# Lesson Presentation Revamp: From 3/10 to 10/10

## Context

The lesson content is great, but the presentation is a 3/10. Every step looks identical: same dark background, same centered column, same barely-visible glow, same fade animation. The result is a monotonous slideshow that doesn't match the quality of the content. This plan is a complete visual overhaul of how lessons are presented — not a polish, a transformation.

The design system already has powerful tools (glass morphism, gradient text, 20+ animations, glow intensities, spring presets, display fonts, card variants) that are barely being used. This plan puts them to work.

---

## Architecture: 7 Problems, 7 Solutions

| # | Problem | Root Cause | Solution |
|---|---------|------------|----------|
| 1 | Visual Monotony | Every step renders identically | Unique visual identity per step type |
| 2 | Text Walls | Same size/color/weight everywhere | Typography revolution with display font + size contrast |
| 3 | Weak Transitions | Same fade for every step | Step-aware directional transitions |
| 4 | Invisible Atmosphere | Glows at 8-15% opacity | 3x bolder atmospheres + step-specific backgrounds |
| 5 | Passive Reading | Read text -> press button | Richer interactions + gestural design |
| 6 | Generic UI | Same Button/spacing everywhere | Step-specific interactive elements |
| 7 | Flat Emotional Arc | Step 1 = Step 7 visually | Progressive intensity + atmosphere evolution |

---

## Phase 1: The Orchestrator Revolution

**File:** `src/components/lesson/FlexibleLessonExperience.tsx`

### 1A. Step-Aware Transition System

Replace the single fade animation with a transition map. Each step-type pair gets a distinct transition:

```
TRANSITION_MAP = {
  // Default: gentle vertical dissolve
  default:     { enter: { opacity: 0, y: 30 },  exit: { opacity: 0, y: -20 } }

  // Scenario -> anything: slide forward (story progresses)
  scenario:    { enter: { opacity: 0, x: 60 },   exit: { opacity: 0, x: -40 } }

  // Choice: zoom in (going deeper into decision)
  choice:      { enter: { opacity: 0, scale: 0.92 }, exit: { opacity: 0, scale: 1.05 } }

  // Insight: blur-in reveal (wisdom materializing)
  insight:     { enter: { opacity: 0, scale: 0.95, filter: 'blur(8px)' }, exit: { opacity: 0, filter: 'blur(4px)' } }

  // Reflection: slow vertical rise (settling inward)
  reflection:  { enter: { opacity: 0, y: 50 },   exit: { opacity: 0, y: -30 }, duration: 0.7 }

  // Reward: burst open (celebration)
  reward:      { enter: { opacity: 0, scale: 0.8 }, exit: { opacity: 0, scale: 1.1 }, duration: 0.6 }

  // Mentor: soft cross-fade (intimate)
  mentor:      { enter: { opacity: 0 },           exit: { opacity: 0 }, duration: 0.8 }

  // Affirmation: rise with gravity (commitment weight)
  affirmation: { enter: { opacity: 0, y: 40, scale: 0.96 }, exit: { opacity: 0, y: -20 } }

  // TapFlow: horizontal slide (journey continues)
  tapFlow:     { enter: { opacity: 0, x: 40 },    exit: { opacity: 0, x: -30 } }
}
```

**Implementation:** In `renderStep()` wrapper, look up `currentStep.type` in transition map. Pass to `motion.div` key-frame for enter/exit. Vary duration per step type (0.4s-0.8s). Use `ease-out-expo` (`[0.16, 1, 0.3, 1]`) for all transitions.

### 1B. Bolder Atmospheric Background

Current glow opacity: 0.08-0.15. New opacity: **0.25-0.45** depending on step type.

Update `STEP_THEMES` glow values:
```
scenario:       rgba(244, 63, 94, 0.30)   // was 0.12
choice:         rgba(251, 191, 36, 0.28)   // was 0.12
insight:        rgba(167, 139, 250, 0.35)  // was 0.12 -- insight is the "aha" moment
reflection:     rgba(34, 211, 238, 0.22)   // was 0.10
mentor:         rgba(168, 85, 247, 0.25)   // was 0.12
reward:         rgba(251, 191, 36, 0.45)   // was 0.20
resonanceCheck: rgba(99, 102, 241, 0.25)   // was 0.12
scaleRating:    rgba(251, 191, 36, 0.22)   // was 0.10
affirmation:    rgba(16, 185, 129, 0.30)   // was 0.15
tapFlow:        rgba(99, 102, 241, 0.28)   // was 0.12
```

Also: enlarge the glow ellipse from `80% 60%` to `100% 80%` so it actually fills the viewport.

Increase `AmbientBackground` from `intensity="subtle"` to `intensity="normal"`. Increase default `particleCount` from 4 to 8.

### 1C. Progress Indicator Overhaul

Replace the thin 1px progress bar + tiny step label with a **segmented progress bar**:

- Each lesson step gets a segment (like Duolingo/Instagram stories)
- Current segment fills with theme color gradient + glow
- Completed segments are solid (theme color at 40% opacity)
- Future segments are dark (stone-800)
- Segment height: `h-1` (same as current, but segmented)
- Gap between segments: `2px`
- Remove the floating step label text entirely -- let each step speak for itself visually

### 1D. Remove Bottom Gradient Fade

The `h-24 bottom gradient` eats into the content area and adds visual clutter. Remove it. Each step already has its own bottom spacing.

---

## Phase 2: Step-by-Step Visual Identity

### 2A. Scenario Step -- "The Immersion"

**File:** `src/components/lesson/steps/ScenarioStep.tsx`

**Current:** Flat text reveal, barely-visible glow, generic continue button.

**Changes:**

1. **Typography Drama**: First sentence of the narrative renders at `text-2xl sm:text-3xl` with `font-serif` (display font). Remaining sentences at current `text-lg sm:text-xl`. This creates a dramatic "opening line" effect.
   - Implementation: In ScenarioStep, split narrative into sentences. Render first sentence separately with larger display styling, then pass remaining sentences to WisdomText.

2. **Mood-Driven Background Intensity**: Increase mood glow opacity from 0.12 to 0.30. Add a second, lower glow layer:
   ```
   background:
     radial-gradient(ellipse 90% 70% at 50% 30%, ${colors.glow_strong} 0%, transparent 50%),
     radial-gradient(ellipse 60% 40% at 50% 80%, ${colors.glow_subtle} 0%, transparent 40%)
   ```

3. **Bridge Question Treatment**: Instead of a plain border-top separator, use a visual "descent" -- add `mt-10 pt-8` with a centered `*  *  *` divider (three dots, stone-500, tracking-[1em]) before the bridge question. Bridge question in `font-serif italic text-xl`.

4. **Continue Button**: Replace generic button with a more atmospheric one: `variant="glass"` with `glow` prop. Text changes to match mood (e.g., "What would you do?" for tension, "Let's explore..." for curiosity).

### 2B. Choice Step -- "The Crossroads"

**File:** `src/components/lesson/steps/ChoiceStep.tsx`

**Current:** Standard list of rounded buttons that look like settings toggles.

**Changes:**

1. **Card-Based Options**: Replace flat buttons with `Card variant="glass"` containers:
   - Resting: `bg-stone-900/40 backdrop-blur-sm border border-stone-700/40`
   - Hover: `border-amber-500/40 bg-stone-900/60` with inner glow
   - Selected: `border-amber-500/60 bg-amber-500/10` with `glow-gold` shadow
   - Rejected (after selection): `opacity-30 scale-[0.97]` with 400ms ease-out

2. **Stagger Reveal**: Increase stagger delay from `0.1s` to `0.15s`. Add `scale: 0.95 -> 1` to entry animation (not just opacity+y). Use `spring-responsive` preset.

3. **Selection Animation**: On select, the chosen card does:
   - Scale to 1.03 (spring)
   - Border glows with `box-shadow: 0 0 30px rgba(251, 191, 36, 0.25)`
   - A `GoldShimmer variant="gold" intensity="subtle"` fires briefly
   - `playReveal()` sound instead of just `playTapConfirm()`
   - Other cards animate out: `opacity -> 0.2, scale -> 0.96, y -> 5` over 400ms

4. **Question Typography**: Question text in `font-serif text-2xl sm:text-3xl` (display heading).

### 2C. Insight Step -- "The Revelation"

**File:** `src/components/lesson/steps/InsightStep.tsx`

**Current:** Small icon circle + text below. Feels like every other step.

**Changes:**

1. **Full-Screen Typographic Moment**: The insight text IS the design. Remove the small icon circle. Instead:
   - Style label (e.g., "Ancient Wisdom", "Core Principle") at top: `text-overline` class (12px, uppercase, widest tracking, accent color)
   - Insight text: `font-serif text-2xl sm:text-3xl md:text-4xl leading-[1.6]` -- dramatically larger than other steps
   - For `quote` style: Add large decorative `"` marks using `text-7xl font-serif opacity-20` positioned above the text
   - For `principle` style: Apply `gradient-text-gold` class to the entire insight text
   - For `revelation` style: Apply `gradient-text-insight` class
   - For `reframe` style: Apply `gradient-text-growth` class

2. **Source Attribution**: Style as `text-wisdom` (italic serif) + `text-attribution` (small caps) for the author name. Add `mt-8` spacing. Add a thin decorative line above: `w-12 h-px bg-gradient-to-r from-transparent via-{accent}/40 to-transparent mx-auto`.

3. **Background**: Strongest glow of any step (0.35 opacity). Add a very subtle `animate-breathe` to the glow layer (opacity oscillates 0.25-0.35 over 4s).

4. **Follow-Up**: Style as instruction text but with more top margin (`mt-10`). Replace the border-t with the centered dot divider.

5. **Continue Button Text**: Change from "I receive this" -> more specific per style: "I understand" (principle), "This resonates" (quote), "I see it now" (revelation), "Shifting my lens" (reframe).

### 2D. Reflection Step -- "The Sanctuary"

**File:** `src/components/lesson/steps/ReflectionStep.tsx`

**Current:** Clinical cyan textarea with word count dots. Feels like a homework form.

**Changes:**

1. **Warm Color Shift**: Change the entire reflection color scheme from clinical cyan to warm amber/gold:
   - Border focus: `border-amber-500/30` (was cyan)
   - Caret color: `#fbbf24` (gold, was cyan)
   - Progress indicators: amber-400 (was cyan-400)
   - Milestone toasts: amber color scheme
   - The entering phase icon: Warm gold glow instead of cyan

2. **Entering Phase**: Make the transition more dramatic:
   - Instead of Feather icon, use a simple warm glow orb that pulses (`animate-breathe-glow`)
   - Text: Use `font-serif text-2xl` for "Now, reflect..."
   - Duration extended from 2.2s to 2.8s for more gravitas
   - The progress bar during entering: use `gradient-gold`

3. **Writing Space Upgrade**:
   - Remove the visible 2px border entirely when not focused. Instead: subtle `border-stone-800/30` at rest, `border-amber-500/20` on focus
   - Add `glass-warm` background to the textarea container
   - Increase min-height from 180px to 220px
   - Font: Add `font-serif` to the textarea for a journal-like feel (Georgia)
   - Placeholder text in `text-stone-600 italic`

4. **Remove Clinical Word Count**: Replace the bottom bar (word count + dots + readiness indicator) with a single organic indicator:
   - A thin gradient bar at the bottom of the textarea that fills as you write
   - Color transitions: stone-700 (empty) -> amber-600 (5 words) -> amber-400 (15 words) -> emerald-400 (30+ words)
   - No numbers, no dots -- just the visual bar
   - Height: `h-0.5` (subtle), rounds to `rounded-full`

5. **Encouragement Prompts**: Change from the cyan pill/badge to a simple `italic text-stone-500 text-sm` line that fades in below the textarea. No emoji, no container -- just gentle text.

6. **Privacy Toggle**: Move it to BELOW the submit button, smaller. It's important but shouldn't interrupt the writing flow. Make it `text-xs` with icon only, `opacity-60`.

### 2E. Affirmation Step -- "The Oath"

**File:** `src/components/lesson/steps/AffirmationStep.tsx`

**Current:** Word-by-word reveal + colored button. Good bones, needs more drama.

**Changes:**

1. **Statement Typography**: `font-serif text-3xl sm:text-4xl md:text-5xl font-medium` -- make this the biggest text in any step. Apply `gradient-text-{style}` matching the affirmation style:
   - commitment -> `gradient-text-growth`
   - release -> `gradient-text-wisdom`
   - gratitude -> `gradient-text-gold`
   - strength -> `gradient-text-sunset`

2. **Word Reveal Enhancement**: Slow down from 120ms to 160ms per word. Add a subtle `text-glow` to each word as it appears (glow fades after 300ms). The last word lingers slightly longer (300ms).

3. **Solidification Moment**: When all words are visible and before the button appears, add a 500ms "solidification" phase:
   - All text briefly scales to 1.01 and back (spring)
   - A single `playBell()` sound
   - Glow layer opacity pulses from current to +0.15 and back

4. **Confirm Button**: Use `variant="warm"` for strength, `variant="primary"` for commitment, custom gradient for others. Increase padding: `py-6` (taller). Add `animate-pulse-glow` while waiting for tap.

5. **Confirmed State**: After confirming, instead of small check circle:
   - Brief full-screen flash (white at 0.03 opacity, 200ms)
   - `GoldShimmer intensity="medium"` fires
   - `hapticCelebration()`
   - Text fades to 60% opacity
   - Small "Committed" text with check appears

### 2F. Resonance Check -- "The Mirror"

**File:** `src/components/lesson/steps/ResonanceCheckStep.tsx`

**Current:** Vertical checkbox list. Feels like a survey form.

**Changes:**

1. **2-Column Grid**: Switch from `space-y-3` to a responsive grid:
   - `grid grid-cols-1 sm:grid-cols-2 gap-3`
   - Each option: equal height within row, centered content

2. **Option Cards**: Replace the checkbox+text layout:
   - Emoji LARGE and centered: `text-3xl mb-2` (if emoji exists)
   - Text below emoji, centered: `text-sm sm:text-base font-medium text-center`
   - Card style: `rounded-xl p-5 border border-stone-700/40 bg-stone-900/40`
   - Selected: `border-indigo-500/50 bg-indigo-500/10` with `box-shadow: 0 0 20px rgba(99, 102, 241, 0.15)`
   - Remove the checkbox circle -- selection is indicated by the card's glow state

3. **Selection Feedback**: On tap, the card does a quick `scale: [1, 0.96, 1.02, 1]` spring (bouncy) with `playPop()` sound.

4. **Question Typography**: `font-serif text-2xl sm:text-3xl` for the prompt heading.

### 2G. Scale Rating -- "The Gauge"

**File:** `src/components/lesson/steps/ScaleRatingStep.tsx`

**Changes:**

1. **Larger Touch Targets**: Scale points from `w-11 h-11` -> `w-14 h-14`. Text from `text-base` -> `text-lg font-semibold`.

2. **Visual Track Enhancement**: The connecting track between points: `h-1 bg-stone-800/60`. Selected fill: gradient from-amber-500 to-amber-400 with `box-shadow: 0 0 15px rgba(251, 191, 36, 0.3)`. The fill should animate smoothly (not jump) using Framer Motion `layout` transition.

3. **Selected Point**: Add `animate-pulse-warm` to the active point. Ring shadow: `0 0 0 4px rgba(251, 191, 36, 0.15)`.

4. **Contextual Response**: Render in `font-serif italic text-lg` (was plain text). Fade in with `blur-in` animation (opacity 0 + blur 6px -> opacity 1 + blur 0).

### 2H. Tap Flow -- "The Inner Journey"

**File:** `src/components/lesson/steps/TapFlowStep.tsx`

**Changes:**

1. **Instruction Typography**: `font-serif text-2xl sm:text-3xl leading-relaxed text-center` (display font, larger).

2. **Remove "TAP TO CONTINUE" text**: Replace with a subtle pulsing glow at the bottom center of the tap zone -- a `w-16 h-1 rounded-full` bar with `animate-breathe` + accent color. No text. The tap area is the whole screen, users intuit it.

3. **Progressive Atmosphere**: Background glow opacity increases with each tap: `0.15 + (progress / total) * 0.25`. This creates a tangible sense of deepening.

4. **Transition Between Instructions**: Use cross-dissolve with slight scale shift: exit `scale: 0.97, opacity: 0`, enter `scale: 1.03 -> 1, opacity: 0 -> 1`. Slower: 0.6s with `ease-out-expo`.

5. **Closing Text**: When all instructions done, closing text appears with `font-serif italic` + accent color + the style-specific gradient text class.

### 2I. Mentor Step -- Refinements

**File:** `src/components/lesson/steps/MentorStep.tsx`

**Changes:**

1. **Remove Speech Bubble Pointer**: Delete the rotated triangle div. It looks app-like. The message container already has enough visual context.

2. **Message Container**: Apply `glass-warm` class instead of the custom gradient bg. This gives it depth and sophistication.

3. **Typing Cursor**: Change from the rectangular block (`w-2 h-5 rounded-sm`) to a thin line: `w-[2px] h-5 rounded-full` -- feels more like real typing.

4. **Avatar Spacing**: Increase from `mb-6` to `mb-8` below avatar. Add a subtle glow ring around the avatar: `box-shadow: 0 0 40px rgba(168, 85, 247, 0.12)` in a wrapper div.

### 2J. Reward Step -- Refinements

**File:** `src/components/lesson/steps/RewardStep.tsx`

**Changes:**

1. **XP Count-Up Animation**: Instead of the XP number appearing instantly at its final value, animate a count-up from 0 to the earned XP over 1.2s with `playXpCounting(safeXpEarned, 1200)`.

2. **Card Background**: Apply `glass-premium` class to the reward card for a frosted-glass look.

3. **Reveal Phase Concept Title**: Apply `gradient-text-gold` class + `text-glow-gold` for extra shine.

---

## Phase 3: WisdomText Evolution

**File:** `src/components/ui/WisdomText.tsx`

### 3A. New "dramatic" Variant

Add a 5th variant for the first sentence of scenarios:
```typescript
dramatic: {
  base: 'text-stone-100 light:text-stone-900 font-serif',
  leading: 'leading-[1.5]',
  size: 'text-2xl sm:text-3xl',
  spacing: 'space-y-5',
}
```

### 3B. Slower Initial Reveal

For `speed: "slow"`, increase `initialDelay` from 700ms to 900ms. The first sentence should have a moment of anticipation before it appears.

### 3C. Entry Animation Enhancement

Change the sentence entry animation from `y: 12` to `y: 16` and add a subtle blur:
```typescript
initial={{ opacity: 0, y: 16, filter: 'blur(2px)' }}
animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
```
This makes text feel like it's emerging from depth rather than just sliding in.

---

## Phase 4: Lesson Preview Polish

**File:** `src/components/lesson/LessonPreview.tsx`

### Changes:

1. **Title**: Apply `font-serif` (display font) to the `h1`. Currently it's the default sans-serif.

2. **Glow Orb**: Increase size from 300px to 400px. Increase blur from 40px to 60px. This makes the atmospheric effect more immersive.

3. **Hold Phase**: Add a very subtle particle effect during the hold phase -- 4-6 small dots that float upward at low opacity (amber/theme colored). Use simple CSS animation, not a component.

4. **"Tap anywhere" replacement**: Replace text with a small pulsing circle at the bottom center: `w-2 h-2 rounded-full bg-white/30 animate-breathe`.

---

## Implementation Order (Priority)

Execute in this exact order for maximum impact at each stage:

| Order | What | Impact | Files |
|-------|------|--------|-------|
| 1 | Orchestrator: Bolder glows + transitions | HIGH | `FlexibleLessonExperience.tsx` |
| 2 | Scenario: Display font + mood intensity | HIGH | `ScenarioStep.tsx` |
| 3 | Insight: Full-screen typography + gradient text | HIGH | `InsightStep.tsx` |
| 4 | Choice: Glass cards + selection animation | HIGH | `ChoiceStep.tsx` |
| 5 | Affirmation: Display font + gradient text + solidification | HIGH | `AffirmationStep.tsx` |
| 6 | Reflection: Warm colors + journal feel + remove clinical UI | HIGH | `ReflectionStep.tsx` |
| 7 | WisdomText: Dramatic variant + blur entry | MEDIUM | `WisdomText.tsx` |
| 8 | TapFlow: Display font + progressive atmosphere | MEDIUM | `TapFlowStep.tsx` |
| 9 | ResonanceCheck: 2-column grid + card style | MEDIUM | `ResonanceCheckStep.tsx` |
| 10 | ScaleRating: Larger targets + better fill | MEDIUM | `ScaleRatingStep.tsx` |
| 11 | Mentor: Glass container + thin cursor | LOW | `MentorStep.tsx` |
| 12 | Reward: Count-up XP + glass card | LOW | `RewardStep.tsx` |
| 13 | LessonPreview: Display font + bigger orb | LOW | `LessonPreview.tsx` |
| 14 | Progress: Segmented bar | LOW | `FlexibleLessonExperience.tsx` |

---

## Files Modified

| File | Type of Change |
|------|---------------|
| `src/components/lesson/FlexibleLessonExperience.tsx` | Transitions, glows, progress bar, remove bottom fade |
| `src/components/lesson/steps/ScenarioStep.tsx` | Typography, mood intensity, bridge question, button |
| `src/components/lesson/steps/InsightStep.tsx` | Full typography overhaul, gradient text, remove icon circle |
| `src/components/lesson/steps/ChoiceStep.tsx` | Glass cards, selection animation, shimmer |
| `src/components/lesson/steps/AffirmationStep.tsx` | Display font, gradient text, solidification, confirm style |
| `src/components/lesson/steps/ReflectionStep.tsx` | Warm colors, journal feel, remove word count, restyle |
| `src/components/lesson/steps/ResonanceCheckStep.tsx` | Grid layout, card options, remove checkboxes |
| `src/components/lesson/steps/ScaleRatingStep.tsx` | Larger targets, fill animation, response styling |
| `src/components/lesson/steps/TapFlowStep.tsx` | Display font, remove tap text, progressive glow |
| `src/components/lesson/steps/MentorStep.tsx` | Glass container, cursor style, remove bubble pointer |
| `src/components/lesson/steps/RewardStep.tsx` | XP count-up, glass card, gradient text |
| `src/components/lesson/LessonPreview.tsx` | Display font, larger orb, particle hints |
| `src/components/ui/WisdomText.tsx` | New variant, blur entry animation |

## Existing Design System Reuse

These existing tools will be leveraged (currently underused):

| Tool | File | Where Used |
|------|------|-----------|
| `gradient-text-gold` | `globals.css` | InsightStep (principle), AffirmationStep (gratitude), RewardStep |
| `gradient-text-wisdom` | `globals.css` | InsightStep (revelation), AffirmationStep (release) |
| `gradient-text-growth` | `globals.css` | InsightStep (reframe), AffirmationStep (commitment) |
| `gradient-text-sunset` | `globals.css` | AffirmationStep (strength) |
| `glass-warm` | `globals.css` | ReflectionStep textarea, MentorStep message |
| `glass-premium` | `globals.css` | RewardStep card |
| `font-serif` (Georgia) | `globals.css` | ScenarioStep first sentence, InsightStep, AffirmationStep, ChoiceStep question, ReflectionStep textarea |
| `animate-breathe` | `globals.css` | Insight glow layer, TapFlow glow indicator |
| `animate-pulse-glow` | `globals.css` | AffirmationStep confirm button |
| `animate-breathe-glow` | `globals.css` | ReflectionStep entering phase |
| `text-overline` | `globals.css` | InsightStep style label |
| `text-wisdom` | `globals.css` | InsightStep source, ScaleRating response |
| `text-attribution` | `globals.css` | InsightStep author name |
| `GoldShimmer` | `effects/GoldShimmer.tsx` | ChoiceStep selection, AffirmationStep confirm |
| `Card variant="glass"` | `ui/Card.tsx` | ChoiceStep options |
| `Button variant="glass"` | `ui/Button.tsx` | ScenarioStep continue |
| `Button variant="warm"` | `ui/Button.tsx` | AffirmationStep (strength) |
| `playReveal()` | `useAudio` | ChoiceStep selection |
| `playBell()` | `useAudio` | AffirmationStep solidification |
| `playPop()` | `useAudio` | ResonanceCheck selection |
| `playXpCounting()` | `useAudio` | RewardStep count-up |
| `ease-out-expo` | `globals.css` | All step transitions |

---

## Verification

After implementation, verify by:

1. **Run the dev server**: `npm run dev`
2. **Walk through every lesson step type**: Start a lesson and progress through each step. Verify:
   - Each step type looks visually distinct from the others
   - Transitions between steps are smooth and varied (not all the same fade)
   - Display font (serif) appears on key text (scenario opener, insight, choice question, affirmation statement)
   - Gradient text classes are visible on insight and affirmation text
   - Background glows are noticeably present (not barely visible)
   - Reflection step has warm gold tones (not cyan), no visible word count numbers
   - Choice selection triggers shimmer effect and other cards fade
   - Resonance check shows 2-column grid on wider screens
3. **Test on mobile viewport** (375px width): Ensure all touch targets are 48px+, text is readable, animations are smooth
4. **Test light mode**: Toggle theme and verify light mode variants still work
5. **Run `npm run build`**: Ensure no build errors
6. **Check for regressions**: All step completion callbacks still fire correctly, lesson progress saves, XP calculation works
