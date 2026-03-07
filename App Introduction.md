# App Introduction

## 1) What This Application Is

This project is a mobile-first personal transformation app built as a daily practice system, not a content library.

At a product level, it combines:
- Guided philosophy-based lessons
- Structured reflection
- Mandatory social resonance through "Echo"
- Embodiment exercises
- Long-term identity and progress tracking

Internal naming in code often refers to it as "Transformation Hub" (for example in `package.json` and store naming), while the user experience frames it as a journey through "Wisdom Worlds".

The current implementation centers on one fully active world:
- `modern-wisdom`
- 3 chapters
- 15 lessons total
- 45 exercise units (3 per lesson)

## 2) Product Thesis and Philosophy

### Core thesis
People do not transform by reading ideas. They transform by repeating meaningful practice in a stable rhythm.

### Design philosophy encoded in the product
The codebase repeatedly reinforces these principles:
- One day, one lesson, one shared rhythm (synchronized daily flow)
- Depth over volume (single focused daily sequence)
- Teach-to-learn (mandatory Echo response to another person)
- Embodiment over passive consumption (post-lesson exercises)
- Identity formation over vanity metrics (identity statements, progress narrative)

### What makes this more than a lesson app
The app intentionally forces sequence and commitment:
1. Lesson
2. Mandatory Echo
3. Exercises
4. Daily completion

This sequence is not optional in normal flow and is a key product differentiator.

## 3) High-Level User Experience

## 3.1 First launch path
Entry flow controlled in `src/app/page.tsx`:
1. Language selector
2. Onboarding flow
3. Daily home flow

The app also uses a hydration guard to avoid showing wrong pre-hydrated screens before persisted Zustand state is loaded.

## 3.2 Onboarding (initiation)
`src/components/onboarding/OnboardingFlow.tsx` implements a 9-step initiation-style onboarding, with audio atmosphere and swipe support.

Order in code comments and rendering:
- Welcome
- Name
- Community identity
- Goal
- Why
- Path
- Commitment
- Origin/auth step
- Ready

This is positioned as identity commitment, not form filling.

## 3.3 Daily flow
Daily orchestration uses `useDailyPracticeStore` and `DailyFlowHome`.

Phases:
- `lesson`
- `echo`
- `practice`
- `complete`

The home state and CTA set are phase-aware and route users to the exact next required action.

## 3.4 Post-completion behavior
After first full daily completion:
- Spark unlock can trigger (`spark-unlock` view)
- User can enter short-form motivational video feed (`spark`)

## 3.5 Secondary surfaces
After onboarding, the app has multiple additional surfaces:
- Dashboard/profile hub
- Journey/world map
- Echo inbox
- Tasks view
- Progress dashboard
- Transformation hub
- Identity screen
- Story presentation/share card
- Settings

## 4) Content Model and Learning Architecture

## 4.1 World and chapter structure
Main world source: `src/content/modernWisdom.ts` plus chapter files.

Current active world:
- World slug: `modern-wisdom`
- Estimated days: 15
- Total lessons: 15

Chapters:
- Foundations (chapter 1)
- Resilience (chapter 2)
- Relationships (chapter 3)

## 4.2 Lesson architecture (flexible engine)
Core schema in `src/types/lessons.ts`.

Lesson step system is intentionally flexible and supports branching.
Step types include:
- scenario
- choice
- reflection
- insight
- mentor
- reward
- resonanceCheck
- scaleRating
- affirmation
- tapFlow

Engine component: `src/components/lesson/FlexibleLessonExperience.tsx`.

Important capabilities:
- Dynamic step rendering by type
- Branching by chosen option
- Fallback navigation if step mapping breaks
- In-progress lesson persistence and resume
- XP computation with streak multiplier

## 4.3 Exercise architecture
Schema in `src/types/dailyPractice.ts`.

Exercise types:
- rapid-verdict
- priority-tower
- scenario-snap
- heat-check
- word-forge

Orchestrator: `src/components/exercises/ExerciseExperience.tsx`.
Exercises are code-split via dynamic imports for performance.

## 4.4 Community reflection seed strategy
`useEchoesStore` can source from real reflections and falls back to localized seed reflections when needed.
This keeps mandatory Echo viable even with low early community volume.

## 5) Social Layer: Echoes

Echo functionality is handled primarily through `useEchoesStore` and Echo components.

Capabilities include:
- Publish reflections publicly
- Fetch reflection to respond to (prioritizing relevant real data)
- Send Echo response
- Optional connection intent
- Invitations and connection lifecycle
- Simple direct message system
- Unread count aggregation

### Mandatory Echo enforcement
`src/components/daily/MandatoryEchoFlow.tsx` is explicit: no skip path in intended UX.
User must submit a substantial response before moving to exercises.

## 6) Progress, Identity, and Transformation Intelligence

## 6.1 Core progress tracking
`useStore.ts` tracks:
- XP, streak, longest streak
- Completed lessons
- Reflections and all reflections
- Weekly check-ins
- Monthly assessments
- Wisdom-in-action logs
- Identity statements
- Activity day log
- In-progress lesson state

## 6.2 Streak and resilience mechanics
Includes grace-day and streak-shield behavior (including earn/use logic), designed to reduce fragile streak collapse.

## 6.3 Analytical and narrative layer
Progress interpretation is not only numeric.

`src/lib/progressInsights.ts` provides:
- transformation score
- milestone generation
- personalized insight generation
- hero messaging

`src/lib/story/*` and `useTransformationStory` provide:
- reflection and pattern analysis
- insight generation
- mood determination
- slide-by-slide story construction
- localized story copy and shareable cards

This is a major "meaning-making" layer that turns data into a narrative artifact.

## 7) Spark Module (Motivational Video Feed)

Primary files:
- `src/components/spark/SparkFeed.tsx`
- `src/store/useSparkStore.ts`
- `src/content/sparkVideos.ts`

Behavior:
- Vertical full-screen feed (TikTok-style interaction model)
- Watch tracking and save tracking
- Session analytics
- Daily XP cap for video reward (`MAX_DAILY_VIDEO_XP = 12`)
- Unlock gating tied to completion of daily core flow

## 8) Tasks Module

Primary files:
- `src/components/tasks/DailyTasksView.tsx`
- `src/store/useTasksStore.ts`

Model:
- Lightweight daily scratch list
- Add, complete, remove
- Daily keying and retention cleanup
- Celebration effects for all-complete state

This module is motivational support, not core transformation logic.

## 9) Localization and Language System

## 9.1 Language support
Supported locales:
- English (`en`)
- French (`fr`)
- Arabic (`ar`)

Core i18n files:
- `src/i18n/TranslationProvider.tsx`
- `src/i18n/locales/en.ts`
- `src/i18n/locales/fr.ts`
- `src/i18n/locales/ar.ts`

Provider responsibilities:
- Key-based translation lookup
- Parameter interpolation
- RTL direction handling for Arabic
- HTML document `dir` and `lang` updates

## 9.2 Content-level localization for lessons
`src/content/localizeModernWisdomContent.ts` deep-localizes world content objects using translation maps:
- `modernWisdomContent.fr.json`
- `modernWisdomContent.ar.json`

It translates only intended content fields while protecting structural keys like IDs and slugs.

## 9.3 Practical localization note for future agents
The codebase uses both approaches:
- centralized `useTranslation()` keys
- localized inline `copy` objects keyed by locale in some components/lib modules

A future localization hardening pass should standardize on one pattern where practical, then lint for untranslated literals.

## 10) Frontend Architecture

## 10.1 Tech stack
From `package.json`:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand

## 10.2 App shell and view state
Single-page orchestration in `src/app/page.tsx` with explicit view state union (`AppView`) and conditional rendering.

The app acts as a client-side state machine for flow progression and feature routing.

## 10.3 Provider chain
`src/app/providers.tsx` wraps app in:
- ThemeProvider
- TranslationProvider
- AuthProvider
- SupabaseSyncProvider
- ActivityLoggerProvider
- AudioProvider

This means translation/auth/sync/logging/audio are globally available very early in the component tree.

## 11) State Management Architecture

Persisted stores:
- `useStore`
- `useDailyPracticeStore`
- `useEchoesStore`
- `useSparkStore`
- `useTasksStore`

All are persisted in browser storage and participate in sync logic.

Broad responsibility split:
- `useStore`: identity, progression, reflection analytics, streaks, settings
- `useDailyPracticeStore`: synchronized daily lesson and phase progression
- `useEchoesStore`: social reflection and messaging interactions
- `useSparkStore`: video engagement and reward accounting
- `useTasksStore`: daily task list

## 12) Backend and Data Architecture

## 12.1 Primary backend
Supabase is the primary backend path.

Used for:
- Auth (password, Google OAuth, anonymous)
- Profile and progress tables
- Reflections, echoes, identity statements, assessments, etc.
- RLS-secured user-owned data

## 12.2 Dual sync strategy (important)
The app intentionally uses two sync layers in parallel:

1) Granular table sync
- Hook: `useSupabaseStoreSync`
- Writes/reads specific tables (users, lesson_progress, reflections, etc.)

2) Full-state blob backup
- Hook: `useProgressBlobSync`
- Library: `src/lib/progressSync.ts`
- Stores whole serialized Zustand snapshots in `user_progress` JSONB row

Reason:
- Granular model gives queryable normalized data
- Blob model gives robust full restore and safety net

## 12.3 Schema and policies
Supabase migrations in `supabase/migrations` include:
- Core schema and RLS policies
- Echo metadata additions
- Echo response metadata additions
- `user_progress` blob table

Core domain tables include:
- users
- lesson_progress
- reflections
- streak_records
- exercises_completed
- identity_statements
- weekly_checkins
- monthly_assessments
- community_echoes
- echo_responses
- user_progress

## 12.4 Legacy analytics path (optional)
There is a separate Prisma + SQLite analytics subsystem controlled by:
- `ENABLE_LEGACY_ACTIVITY_DB`

When enabled:
- `/api/log/session`
- `/api/log/event`
- `/api/admin`
- `/admin`

Admin route protection:
- Requires `ADMIN_SECRET` bearer token.

This subsystem is currently framed as legacy and optional.

## 13) Logging and Observability

Activity logging is integrated via `ActivityLoggerProvider`.
It subscribes to store changes and logs product events such as:
- onboarding progression
- lesson starts/completions
- phase transitions
- reflection creation
- streak updates
- echo interactions
- settings changes

This allows behavior analytics without manually instrumenting every UI action.

## 14) Deployment and Runtime Configuration

## 14.1 Base path strategy
`next.config.ts` sets production base path and asset prefix to:
- `/growthmvp`

This affects routing and static asset URLs in production.

## 14.2 Required environment variables
From `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_SECRET`
- `ENABLE_LEGACY_ACTIVITY_DB`

## 14.3 Scripts
Standard scripts:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- Playwright e2e scripts

## 15) Testing and Quality Surface

Current E2E specs cover critical flows like:
- onboarding happy path
- lesson branch paths
- mandatory echo flow
- exercise types
- translation checks for modern wisdom content

This gives baseline confidence on core product loop behavior.

## 16) Current Scope, Maturity, and Product Status

### Implemented and substantive
- Deep daily transformation loop with enforced sequencing
- Rich lesson engine with branching
- Community reflection exchange
- Exercise embodiment layer
- Progress and narrative intelligence
- Multi-language support with RTL
- Supabase sync + backup architecture

### Still visibly evolving
- Only one active world today (world switcher/coming soon scaffolding exists)
- Some non-core surfaces still have "coming soon" or expansion posture
- Legacy analytics system coexists with modern Supabase path (operational complexity)

## 17) Strategic Value for Investors

Why this can be interesting beyond another wellness app:
- Strong ritual architecture: it creates daily habit loops, not passive browsing
- Differentiated social mechanic: mandatory echo enforces contribution and reciprocity
- High-leverage data layer: reflections + behavior create longitudinal transformation signal
- Narrative output: transformation stories convert raw activity into emotionally meaningful proof
- Multi-language readiness (en/fr/ar) with RTL support broadens reachable market

Potential growth levers:
- New worlds (content expansion)
- Mentor personalization quality improvements
- Better social graph and matching for Echo
- Team/cohort or B2B modes
- Premium layering on advanced worlds and analytics

## 18) Known Risks and Constraints

- Single-app-page orchestration in `page.tsx` is powerful but can become hard to maintain as view count grows.
- Localization patterns are mixed (central key-based plus inline locale copy objects), so governance is needed for consistency.
- Dual-sync strategy improves resilience but increases conceptual complexity and edge-case surface.
- Legacy analytics path can confuse operations if not clearly disabled or removed in some environments.

## 19) How Another Agent Should Work in This Repo

Recommended onboarding path for a new engineer/agent:
1. Read `src/app/page.tsx` to understand the app state machine.
2. Read all five stores in `src/store` to understand source-of-truth boundaries.
3. Read `src/types/lessons.ts` and `src/types/dailyPractice.ts` for domain model.
4. Read `src/content/modernWisdom*.ts` and `src/content/exerciseContent.ts` for product content scope.
5. Read `src/providers/AuthProvider.tsx`, `useSupabaseStoreSync.ts`, and `progressSync.ts` before changing persistence.
6. Read `src/i18n/*` and `localizeModernWisdomContent.ts` before touching language behavior.

High-safety implementation practices in this codebase:
- Prefer updating stores and types first, then UI.
- Preserve daily phase gating semantics unless intentionally redesigning the product.
- Validate changes with existing Playwright specs and add tests for new flow-critical behavior.

## 20) One-Sentence Definition

This app is a structured, multilingual, community-anchored daily transformation system that combines philosophy lessons, mandatory social reflection, embodied exercises, and narrative progress intelligence to help users become a different person through consistent practice.
