# GrowthClaude Audio Overhaul - Handoff Instructions

## Context
- **Project**: Transformation Hub (GrowthClaude)
- **Goal**: Complete audio overhaul (generative music, emotional sound effects, ambience)
- **Branch**: `claude/transformation-hub-plan-Puzt4`
- **VPS**: 149.102.143.10 (deployment target)

## Status: IN PROGRESS
We have built the core audio engine and hooks, and started integrating them into the UI.

### ✅ Completed
1. **Core Audio Engine (`src/lib/audioEngine.ts`)**:
   - Web Audio API based generative system
   - Multi-layer support (music, ambience, UI sounds)
   - Procedural sounds for rain, fire, forest, bells, singing bowls
   - Musical scales for emotional context (calm, deep, triumph)

2. **React Hooks (`src/hooks/`)**:
   - `useAudio`: Main interface to the engine
   - `useContextualAudio`: Manages scene-based music transitions
   - `useBreathingGuide`: Syncs audio/visuals for breathing exercises
   - `useTypingAmbience`: Auto-plays ambience when typing

3. **UI Integration (Partial)**:
   - `Button.tsx`: Added global click sounds (`sound` prop)
   - `OnboardingFlow.tsx`: Added background music and step transition sounds
   - `RewardStep.tsx`: Added celebration sounds and level-up effects

### 🚧 Work In Progress / Next Steps
The following tasks need to be completed by the next agent:

1. **Lesson Integration**:
   - Update `FlexibleLessonExperience.tsx` to use `useContextualAudio` instead of the old `useLessonAmbience`
   - Update `ReflectionStep.tsx` to use `useTypingAmbience`
   - Update `VisualizationStep.tsx` to play 'visualization' music scene
   - Update `TimerStep.tsx` to use meditation sounds (gong/bowl)

2. **Settings & State**:
   - Update `src/store/useStore.ts` to persist audio preferences (volume, breathing enabled, etc.)
   - Create a `SettingsPanel` or `AudioSettings` component to let users control volume

3. **Cleanup**:
   - Remove or deprecate old audio files/hooks (`useSound.ts`, `useLessonAmbience.ts`) once fully migrated

4. **Deployment**:
   - Build and deploy to VPS (`npm run build && pm2 restart GrowthClaude`)

## Technical Details
- **Audio Engine**: Uses `AudioContext`. Must be initialized by a user interaction (click/touch). The `useAudio` hook handles this auto-initialization.
- **Ambience**: Writing ambience (rain/fire) is procedural noise. Music is generative oscillator pads.
- **Haptics**: `navigator.vibrate` is integrated into `audioEngine.ts`

## Deployment Info
- **URL**: https://redweyne.com/growthmvp
- **Config**: `next.config.ts` has `basePath: '/growthmvp'`

## Github Token
Use the token provided in the prompt to push changes.
