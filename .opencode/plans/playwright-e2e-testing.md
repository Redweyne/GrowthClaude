# Playwright E2E Testing Implementation Plan

## Overview

This plan implements comprehensive E2E testing for the Transformation Hub app using Playwright, testing on iPhone 14 and Pixel 7 devices. It covers:

1. Onboarding happy path
2. Lesson 1 with ALL branch paths exhaustively tested
3. Mandatory Echo flow
4. All 5 exercise types

---

## Phase 1: Playwright Configuration

### File: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: null,
  },
  
  timeout: 120000,
  expect: { timeout: 10000 },

  projects: [
    {
      name: 'iPhone 14',
      use: {
        ...devices['iPhone 14'],
        browserName: 'webkit',
      },
    },
    {
      name: 'Pixel 7',
      use: {
        ...devices['Pixel 7'],
        browserName: 'chromium',
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  
  outputDir: 'e2e-results',
});
```

---

## Phase 2: Directory Structure

Create the following directory structure:

```
e2e/
├── fixtures/
│   └── test-data.ts
├── helpers/
│   └── navigation.ts
├── onboarding/
│   └── happy-path.spec.ts
├── lesson-1/
│   ├── path-a-yes-completed.spec.ts
│   ├── path-b-yes-not-completed.spec.ts
│   └── path-c-no-acceptance.spec.ts
├── echo/
│   └── mandatory-echo.spec.ts
└── exercises/
    └── all-types.spec.ts
```

---

## Phase 3: Add data-testid Attributes to Components

### 3.1 Language Selector (`src/components/language/LanguageSelector.tsx`)

Add `data-testid` to each language button:

```tsx
<button data-testid="language-en" onClick={() => handleSelect('en')}>English</button>
<button data-testid="language-fr" onClick={() => handleSelect('fr')}>Français</button>
<button data-testid="language-ar" onClick={() => handleSelect('ar')}>العربية</button>
```

### 3.2 Onboarding Steps

#### WelcomeStep.tsx
```tsx
<button data-testid="welcome-continue-btn" onClick={onNext}>Begin Your Journey</button>
```

#### NameStep.tsx
```tsx
<input data-testid="name-input" ... />
<button data-testid="name-continue-btn" onClick={handleContinue}>Continue</button>
<button data-testid="name-back-btn" onClick={onBack}>Back</button>
```

#### IdentityStep.tsx
```tsx
<button data-testid="identity-brother" onClick={() => handleSelect('brother')}>Brother</button>
<button data-testid="identity-sister" onClick={() => handleSelect('sister')}>Sister</button>
<button data-testid="identity-traveler" onClick={() => handleSelect('traveler')}>Traveler</button>
```

#### GoalStep.tsx
```tsx
<button data-testid="goal-calmer" onClick={() => handleSelect('calmer')}>Calmer</button>
<button data-testid="goal-disciplined" onClick={() => handleSelect('disciplined')}>Disciplined</button>
<button data-testid="goal-confident" onClick={() => handleSelect('confident')}>Confident</button>
<button data-testid="goal-leader" onClick={() => handleSelect('leader')}>Leader</button>
<button data-testid="goal-focused" onClick={() => handleSelect('focused')}>Focused</button>
<button data-testid="goal-resilient" onClick={() => handleSelect('resilient')}>Resilient</button>
```

#### WhyStep.tsx
```tsx
<textarea data-testid="why-input" ... />
<button data-testid="why-continue-btn" onClick={handleContinue}>Continue</button>
```

#### PathStep.tsx
```tsx
<button data-testid="path-continue-btn" onClick={onNext}>Continue</button>
```

#### CommitmentStep.tsx (Onboarding)
```tsx
<button data-testid="commitment-5min" onClick={() => handleSelect(5)}>5 min</button>
<button data-testid="commitment-10min" onClick={() => handleSelect(10)}>10 min</button>
<button data-testid="commitment-15min" onClick={() => handleSelect(15)}>15 min</button>
<button data-testid="commitment-20min" onClick={() => handleSelect(20)}>20 min</button>
```

#### ReadyStep.tsx
```tsx
<button data-testid="ready-begin-btn" onClick={onNext}>Begin My Journey</button>
```

### 3.3 Daily Flow Home (`src/components/daily/DailyFlowHome.tsx`)

```tsx
<div data-testid="daily-flow-home">
  <button data-testid="start-lesson-btn" onClick={onStartLesson}>Start Today's Lesson</button>
  <button data-testid="continue-lesson-btn" onClick={onContinueLesson}>Continue Lesson</button>
  <button data-testid="start-echo-btn" onClick={onStartEcho}>Start Echo</button>
  <button data-testid="start-exercises-btn" onClick={onStartExercises}>Start Exercises</button>
</div>
```

### 3.4 Lesson Step Components

#### ScenarioStep.tsx (`src/components/lesson/steps/ScenarioStep.tsx`)
```tsx
<button data-testid="scenario-continue-btn" onClick={onComplete}>Continue</button>
```

#### ChoiceStep.tsx (`src/components/lesson/steps/ChoiceStep.tsx`)
```tsx
{step.options.map((option) => (
  <button 
    key={option.id}
    data-testid={`choice-option-${option.id}`}
    onClick={() => handleSelect(option)}
  >
    {option.label}
  </button>
))}
```

#### CommitmentStep.tsx (Lesson) (`src/components/lesson/steps/CommitmentStep.tsx`)
```tsx
<textarea data-testid="commitment-input" ... />
<button data-testid="commitment-submit-btn" onClick={handleSubmit}>Continue</button>
```

#### InsightStep.tsx (`src/components/lesson/steps/InsightStep.tsx`)
```tsx
<button data-testid="insight-continue-btn" onClick={onComplete}>Continue</button>
```

#### TimerStep.tsx (`src/components/lesson/steps/TimerStep.tsx`)
```tsx
<div data-testid="timer-step">
  {/* Timer content */}
</div>
```

#### GoDoItStep.tsx (`src/components/lesson/steps/GoDoItStep.tsx`)
```tsx
<button data-testid="godoit-dismiss-btn" onClick={onDismiss}>I'm going now</button>
```

#### ReturnConfirmStep.tsx (`src/components/lesson/steps/ReturnConfirmStep.tsx`)
```tsx
<button data-testid="return-completed-btn" onClick={() => onComplete(true)}>
  Yes — I did it
</button>
<button data-testid="return-not-completed-btn" onClick={() => onComplete(false)}>
  No — I didn't do it
</button>
```

#### ReflectionStep.tsx (`src/components/lesson/steps/ReflectionStep.tsx`)
```tsx
<textarea data-testid="reflection-input" ... />
<button data-testid="reflection-submit-btn" onClick={handleSubmit}>Continue</button>
```

#### RewardStep.tsx (`src/components/lesson/steps/RewardStep.tsx`)
```tsx
<div data-testid="xp-celebration">
  <span data-testid="xp-amount">{xpEarned}</span>
</div>
<button data-testid="reward-continue-btn" onClick={onComplete}>Continue</button>
```

#### MentorStep.tsx (`src/components/lesson/steps/MentorStep.tsx`)
```tsx
<div data-testid="mentor-response">{response}</div>
<button data-testid="mentor-complete-btn" onClick={onComplete}>Complete Lesson</button>
```

### 3.5 Echo Components

#### MandatoryEchoFlow.tsx (`src/components/daily/MandatoryEchoFlow.tsx`)
```tsx
<div data-testid="mandatory-echo">
  <div data-testid="echo-reflection-text">{reflection.text}</div>
  <textarea data-testid="echo-response-input" ... />
  <button data-testid="echo-submit-btn" onClick={handleSubmit}>Send Response</button>
</div>
```

### 3.6 Exercise Components

#### ExerciseExperience.tsx (`src/components/exercises/ExerciseExperience.tsx`)
```tsx
<div data-testid="exercise-experience">
  {exercises.map((ex) => (
    <button 
      key={ex.id}
      data-testid={`exercise-${ex.type}`}
      onClick={() => startExercise(ex)}
    >
      {ex.title}
    </button>
  ))}
</div>
```

#### Individual Exercise Components
```tsx
<textarea data-testid="exercise-input" ... />
<button data-testid="exercise-complete-btn" onClick={handleComplete}>Complete</button>
```

---

## Phase 4: Test Files

### 4.1 Test Fixtures (`e2e/fixtures/test-data.ts`)

```typescript
export const testUser = {
  name: 'TestUser',
  identity: 'traveler',
  goal: 'calmer',
  why: 'I want to find inner peace and control my emotions',
  commitment: 10,
};

export const testBurden = 'My anxiety about work is overwhelming me and I cannot stop thinking about it';

export const testCommitments = {
  action: 'I will send that difficult email to my manager right now',
  reflection: {
    completed: 'I feel so much lighter now. The weight has lifted from my shoulders. Taking action was the hardest part but now that I did it, I feel empowered.',
    notCompleted: 'Fear stopped me. I was afraid of the response and kept making excuses. I realize now that the anticipation is worse than the action itself.',
    acceptance: 'For a moment I felt the weight lift from my shoulders. The visualization helped me see that this burden does not belong to me.',
  },
};

export const testEchoResponse = 'This really resonates with my experience. I have felt this same weight and struggle. Thank you for sharing.';

export const exerciseResponses = {
  scenario: 'Using the dichotomy of control, the traffic itself is not within my control. What IS within my control is my reaction, my breathing, and how I use this time.',
  quote: 'This quote reminds me that I spend too much energy trying to control things outside my influence. I need to focus on what I can actually change.',
  application: 'Tomorrow during my morning commute, when I notice frustration building, I will pause and ask: Is this within my control?',
  reframe: 'Before: My coworker undermines me and I cannot stop it. After: I cannot control my coworker, but I CAN control how I prepare and respond.',
};
```

### 4.2 Navigation Helpers (`e2e/helpers/navigation.ts`)

```typescript
import { Page, expect } from '@playwright/test';
import { testUser, testBurden, testCommitments } from '../fixtures/test-data';

export async function completeOnboarding(page: Page) {
  // Language selection
  await page.click('[data-testid="language-en"]');
  
  // Welcome
  await page.click('[data-testid="welcome-continue-btn"]');
  
  // Name
  await page.fill('[data-testid="name-input"]', testUser.name);
  await page.click('[data-testid="name-continue-btn"]');
  
  // Identity
  await page.click(`[data-testid="identity-${testUser.identity}"]`);
  
  // Goal
  await page.click(`[data-testid="goal-${testUser.goal}"]`);
  
  // Why
  await page.fill('[data-testid="why-input"]', testUser.why);
  await page.click('[data-testid="why-continue-btn"]');
  
  // Path
  await page.click('[data-testid="path-continue-btn"]');
  
  // Commitment
  await page.click(`[data-testid="commitment-${testUser.commitment}min"]`);
  
  // Ready
  await page.click('[data-testid="ready-begin-btn"]');
  
  // Verify home
  await expect(page.locator('[data-testid="daily-flow-home"]')).toBeVisible();
}

export async function navigateToChoice(page: Page) {
  // Start lesson
  await page.click('[data-testid="start-lesson-btn"]');
  
  // Opening scenario
  await page.click('[data-testid="scenario-continue-btn"]');
  
  // Scenario 2
  await page.click('[data-testid="scenario-continue-btn"]');
  
  // Name burden
  await page.fill('[data-testid="commitment-input"]', testBurden);
  await page.click('[data-testid="commitment-submit-btn"]');
  
  // Timer: Feel it (wait 31 seconds)
  await page.waitForTimeout(31000);
  
  // Ancient question insight
  await page.click('[data-testid="insight-continue-btn"]');
  
  // Now at THE CHOICE
}

export async function completeYesPathToGoDoIt(page: Page) {
  // Select YES
  await page.click('[data-testid="choice-option-yes"]');
  
  // Action validation insight
  await page.click('[data-testid="insight-continue-btn"]');
  
  // Commit action
  await page.fill('[data-testid="commitment-input"]', testCommitments.action);
  await page.click('[data-testid="commitment-submit-btn"]');
  
  // GoDoIt - dismiss
  await page.click('[data-testid="godoit-dismiss-btn"]');
}

export async function completeNoPath(page: Page) {
  // Select NO
  await page.click('[data-testid="choice-option-no"]');
  
  // Acceptance validation insight
  await page.click('[data-testid="insight-continue-btn"]');
  
  // Acceptance depth scenario
  await page.click('[data-testid="scenario-continue-btn"]');
  
  // Acceptance visualization (9 steps × 4 sec = 36 sec + buffer)
  await page.waitForTimeout(45000);
  
  // Acceptance reflection
  await page.fill('[data-testid="reflection-input"]', testCommitments.reflection.acceptance);
  await page.click('[data-testid="reflection-submit-btn"]');
}
```

### 4.3 Onboarding Test (`e2e/onboarding/happy-path.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { testUser } from '../fixtures/test-data';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('completes full onboarding and lands on home', async ({ page }) => {
    // Language selection
    await page.click('[data-testid="language-en"]');
    await page.screenshot({ path: 'e2e-results/onboarding/01-language-selected.png' });
    
    // Welcome
    await expect(page.locator('[data-testid="welcome-continue-btn"]')).toBeVisible();
    await page.click('[data-testid="welcome-continue-btn"]');
    
    // Name
    await page.fill('[data-testid="name-input"]', testUser.name);
    await page.click('[data-testid="name-continue-btn"]');
    await page.screenshot({ path: 'e2e-results/onboarding/02-name-entered.png' });
    
    // Identity
    await page.click(`[data-testid="identity-${testUser.identity}"]`);
    
    // Goal
    await page.click(`[data-testid="goal-${testUser.goal}"]`);
    await page.screenshot({ path: 'e2e-results/onboarding/03-goal-selected.png' });
    
    // Why
    await page.fill('[data-testid="why-input"]', testUser.why);
    await page.click('[data-testid="why-continue-btn"]');
    
    // Path
    await page.click('[data-testid="path-continue-btn"]');
    
    // Commitment
    await page.click(`[data-testid="commitment-${testUser.commitment}min"]`);
    
    // Ready
    await page.click('[data-testid="ready-begin-btn"]');
    
    // Verify landed on home
    await expect(page.locator('[data-testid="daily-flow-home"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/onboarding/04-complete.png' });
  });
});
```

### 4.4 Lesson 1 Path A: YES + Completed (`e2e/lesson-1/path-a-yes-completed.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeYesPathToGoDoIt } from '../helpers/navigation';
import { testCommitments } from '../fixtures/test-data';

test.describe('Lesson 1: Path A - YES + Completed Action', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
  });

  test('completes YES path with action completed', async ({ page }) => {
    // Navigate to the choice
    await navigateToChoice(page);
    await page.screenshot({ path: 'e2e-results/lesson1/path-a-01-at-choice.png' });
    
    // Complete YES path to GoDoIt
    await completeYesPathToGoDoIt(page);
    await page.screenshot({ path: 'e2e-results/lesson1/path-a-02-dismissed.png' });
    
    // Simulate returning (user comes back after taking action)
    await page.goto('/');
    
    // Should show "Continue Lesson" button (pending action)
    await expect(page.locator('[data-testid="continue-lesson-btn"]')).toBeVisible();
    await page.click('[data-testid="continue-lesson-btn"]');
    
    // Return confirm - select "Yes - I did it"
    await expect(page.locator('[data-testid="return-completed-btn"]')).toBeVisible();
    await page.click('[data-testid="return-completed-btn"]');
    await page.screenshot({ path: 'e2e-results/lesson1/path-a-03-action-completed.png' });
    
    // Action reflection (for completed)
    await page.fill('[data-testid="reflection-input"]', testCommitments.reflection.completed);
    await page.click('[data-testid="reflection-submit-btn"]');
    
    // Reward
    await expect(page.locator('[data-testid="xp-celebration"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/lesson1/path-a-04-reward.png' });
    await page.click('[data-testid="reward-continue-btn"]');
    
    // Closing insight
    await page.click('[data-testid="insight-continue-btn"]');
    
    // Mentor - should have COMPLETED response
    await expect(page.locator('[data-testid="mentor-response"]')).toContainText('you did');
    await page.screenshot({ path: 'e2e-results/lesson1/path-a-05-mentor-completed.png' });
    await page.click('[data-testid="mentor-complete-btn"]');
    
    // Should transition to Mandatory Echo
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible();
  });
});
```

### 4.5 Lesson 1 Path B: YES + Not Completed (`e2e/lesson-1/path-b-yes-not-completed.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeYesPathToGoDoIt } from '../helpers/navigation';
import { testCommitments } from '../fixtures/test-data';

test.describe('Lesson 1: Path B - YES + Not Completed Action', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
  });

  test('completes YES path without completing action', async ({ page }) => {
    await navigateToChoice(page);
    await completeYesPathToGoDoIt(page);
    
    // Simulate returning
    await page.goto('/');
    await page.click('[data-testid="continue-lesson-btn"]');
    
    // Return confirm - select "No - I didn't do it"
    await page.click('[data-testid="return-not-completed-btn"]');
    await page.screenshot({ path: 'e2e-results/lesson1/path-b-01-not-completed.png' });
    
    // Action reflection (for NOT completed - different step)
    await page.fill('[data-testid="reflection-input"]', testCommitments.reflection.notCompleted);
    await page.click('[data-testid="reflection-submit-btn"]');
    
    // Reward
    await expect(page.locator('[data-testid="xp-celebration"]')).toBeVisible();
    await page.click('[data-testid="reward-continue-btn"]');
    
    // Closing insight
    await page.click('[data-testid="insight-continue-btn"]');
    
    // Mentor - should have NOT_COMPLETED response
    await expect(page.locator('[data-testid="mentor-response"]')).toContainText('told the truth');
    await page.screenshot({ path: 'e2e-results/lesson1/path-b-02-mentor-not-completed.png' });
    await page.click('[data-testid="mentor-complete-btn"]');
    
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible();
  });
});
```

### 4.6 Lesson 1 Path C: NO - Acceptance (`e2e/lesson-1/path-c-no-acceptance.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeNoPath } from '../helpers/navigation';

test.describe('Lesson 1: Path C - NO (Acceptance Path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
  });

  test('completes NO path with acceptance visualization', async ({ page }) => {
    await navigateToChoice(page);
    
    // Select NO
    await page.click('[data-testid="choice-option-no"]');
    await page.screenshot({ path: 'e2e-results/lesson1/path-c-01-choice-no.png' });
    
    // Acceptance validation insight
    await expect(page.locator('text=told yourself the truth')).toBeVisible();
    await page.click('[data-testid="insight-continue-btn"]');
    
    // Acceptance depth scenario
    await page.click('[data-testid="scenario-continue-btn"]');
    
    // Acceptance visualization (wait for it to complete)
    await page.screenshot({ path: 'e2e-results/lesson1/path-c-02-visualization-start.png' });
    await page.waitForTimeout(45000); // 9 steps × 4-5 sec
    
    // Acceptance reflection
    await page.fill('[data-testid="reflection-input"]', 
      'For a moment I felt the weight lift from my shoulders. The visualization helped me see that this burden does not belong to me.');
    await page.click('[data-testid="reflection-submit-btn"]');
    
    // Reward
    await expect(page.locator('[data-testid="xp-celebration"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/lesson1/path-c-03-reward.png' });
    await page.click('[data-testid="reward-continue-btn"]');
    
    // Closing insight
    await page.click('[data-testid="insight-continue-btn"]');
    
    // Mentor - should have NO path response
    await expect(page.locator('[data-testid="mentor-response"]')).toContainText('accepting');
    await page.screenshot({ path: 'e2e-results/lesson1/path-c-04-mentor-no.png' });
    await page.click('[data-testid="mentor-complete-btn"]');
    
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible();
  });
});
```

### 4.7 Mandatory Echo Test (`e2e/echo/mandatory-echo.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice } from '../helpers/navigation';
import { testEchoResponse, testCommitments } from '../fixtures/test-data';

test.describe('Mandatory Echo Flow', () => {
  test('completes mandatory echo after lesson', async ({ page }) => {
    await page.goto('/');
    await completeOnboarding(page);
    
    // Complete a quick lesson path (NO path is shorter - no GoDoIt)
    await navigateToChoice(page);
    await page.click('[data-testid="choice-option-no"]');
    await page.click('[data-testid="insight-continue-btn"]');
    await page.click('[data-testid="scenario-continue-btn"]');
    await page.waitForTimeout(45000); // Visualization
    await page.fill('[data-testid="reflection-input"]', testCommitments.reflection.acceptance);
    await page.click('[data-testid="reflection-submit-btn"]');
    await page.click('[data-testid="reward-continue-btn"]');
    await page.click('[data-testid="insight-continue-btn"]');
    await page.click('[data-testid="mentor-complete-btn"]');
    
    // Now on Mandatory Echo
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/echo/01-echo-screen.png' });
    
    // Should see another user's reflection
    await expect(page.locator('[data-testid="echo-reflection-text"]')).toBeVisible();
    
    // Write response (minimum 10 words)
    await page.fill('[data-testid="echo-response-input"]', testEchoResponse);
    await page.screenshot({ path: 'e2e-results/echo/02-response-written.png' });
    
    // Submit
    await page.click('[data-testid="echo-submit-btn"]');
    
    // Should transition to exercises
    await expect(page.locator('[data-testid="exercise-experience"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/echo/03-echo-complete.png' });
  });
});
```

### 4.8 Exercises Test (`e2e/exercises/all-types.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { exerciseResponses } from '../fixtures/test-data';

test.describe('All Exercise Types', () => {
  // This test assumes we're already on the exercise experience screen
  // (after completing lesson and echo)
  
  test('completes all 5 exercise types', async ({ page }) => {
    // Note: This would typically run after echo completion
    // For standalone testing, you'd need to set up state
    
    // We'll test each exercise type
    const exercises = [
      { type: 'scenario', response: exerciseResponses.scenario },
      { type: 'quote', response: exerciseResponses.quote },
      { type: 'application', response: exerciseResponses.application },
      { type: 'anchor', response: null }, // Breathing exercise - no text input
      { type: 'reframe', response: exerciseResponses.reframe },
    ];
    
    for (const exercise of exercises) {
      // Click on exercise card
      await page.click(`[data-testid="exercise-${exercise.type}"]`);
      await page.screenshot({ path: `e2e-results/exercises/${exercise.type}-01-started.png` });
      
      // Fill in response if needed
      if (exercise.response) {
        await page.fill('[data-testid="exercise-input"]', exercise.response);
      }
      
      // For anchor exercise, wait for breathing timer
      if (exercise.type === 'anchor') {
        await page.waitForTimeout(15000); // 3 reps × ~5 sec
      }
      
      // Complete exercise
      await page.click('[data-testid="exercise-complete-btn"]');
      await page.screenshot({ path: `e2e-results/exercises/${exercise.type}-02-completed.png` });
    }
    
    // All exercises complete - should show celebration
    await expect(page.locator('[data-testid="daily-complete-celebration"]')).toBeVisible();
    await page.screenshot({ path: 'e2e-results/exercises/all-complete.png' });
  });
});
```

---

## Phase 5: Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## Phase 6: .gitignore Updates

Add to `.gitignore`:

```
# Playwright
/e2e-results/
/playwright-report/
/playwright/.cache/
```

---

## Execution Order

1. Create `playwright.config.ts`
2. Create directory structure: `e2e/fixtures/`, `e2e/helpers/`, etc.
3. Add `data-testid` attributes to all components listed in Phase 3
4. Create test fixture file
5. Create navigation helpers
6. Create all test files
7. Update `package.json` with scripts
8. Update `.gitignore`
9. Run `npm run test:e2e:headed` to verify

---

## Running Tests

```bash
# Run all tests (headless)
npm run test:e2e

# Run all tests with browser visible
npm run test:e2e:headed

# Run with interactive UI
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/lesson-1/path-a-yes-completed.spec.ts --headed

# Run specific device only
npx playwright test --project="iPhone 14" --headed
```

---

## Expected Output

After running tests, you'll have:

```
e2e-results/
├── onboarding/
│   ├── 01-language-selected.png
│   ├── 02-name-entered.png
│   ├── 03-goal-selected.png
│   └── 04-complete.png
├── lesson1/
│   ├── path-a-01-at-choice.png
│   ├── path-a-02-dismissed.png
│   ├── path-a-03-action-completed.png
│   ├── path-a-04-reward.png
│   ├── path-a-05-mentor-completed.png
│   ├── path-b-01-not-completed.png
│   ├── path-b-02-mentor-not-completed.png
│   ├── path-c-01-choice-no.png
│   ├── path-c-02-visualization-start.png
│   ├── path-c-03-reward.png
│   └── path-c-04-mentor-no.png
├── echo/
│   ├── 01-echo-screen.png
│   ├── 02-response-written.png
│   └── 03-echo-complete.png
└── exercises/
    ├── scenario-01-started.png
    ├── scenario-02-completed.png
    ├── quote-01-started.png
    ├── quote-02-completed.png
    ├── application-01-started.png
    ├── application-02-completed.png
    ├── anchor-01-started.png
    ├── anchor-02-completed.png
    ├── reframe-01-started.png
    ├── reframe-02-completed.png
    └── all-complete.png
```

---

## Total Components Requiring data-testid

| Component | Test IDs Count |
|-----------|----------------|
| LanguageSelector | 3 |
| WelcomeStep | 1 |
| NameStep | 3 |
| IdentityStep | 3 |
| GoalStep | 6 |
| WhyStep | 2 |
| PathStep | 1 |
| CommitmentStep (onboarding) | 4 |
| ReadyStep | 1 |
| DailyFlowHome | 4 |
| ScenarioStep | 1 |
| ChoiceStep | 2 (per choice) |
| CommitmentStep (lesson) | 2 |
| InsightStep | 1 |
| TimerStep | 1 |
| GoDoItStep | 1 |
| ReturnConfirmStep | 2 |
| ReflectionStep | 2 |
| RewardStep | 3 |
| MentorStep | 2 |
| MandatoryEchoFlow | 3 |
| ExerciseExperience | 6 |
| **TOTAL** | ~50 |

---

This plan is ready for implementation. Switch to execute mode to proceed.
