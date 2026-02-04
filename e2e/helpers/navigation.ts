import { Page, expect } from '@playwright/test';
import { testUser, testBurden, testCommitments, TIMEOUTS } from '../fixtures/test-data';

/**
 * Complete the full onboarding flow
 */
export async function completeOnboarding(page: Page, locale: 'en' | 'fr' | 'ar' = 'en') {
  // Language selection
  await page.click(`[data-testid="language-${locale}"]`);
  await page.waitForTimeout(300);
  await page.click('[data-testid="language-continue-btn"]', { force: true });
  await page.waitForTimeout(500);

  // Welcome
  await page.waitForSelector('[data-testid="welcome-continue-btn"]', { timeout: 10000 });
  await page.click('[data-testid="welcome-continue-btn"]', { force: true });

  // Name
  await page.waitForSelector('[data-testid="name-input"]', { timeout: 10000 });
  await page.fill('[data-testid="name-input"]', testUser.name);
  await page.click('[data-testid="name-continue-btn"]', { force: true });

  // Identity - select then click continue
  await page.waitForSelector(`[data-testid="identity-${testUser.identity}"]`, { timeout: 10000 });
  await page.click(`[data-testid="identity-${testUser.identity}"]`, { force: true });
  await page.waitForTimeout(300);
  await page.click('[data-testid="identity-continue-btn"]', { force: true });

  // Goal - select then click continue
  await page.waitForSelector(`[data-testid="goal-${testUser.goal}"]`, { timeout: 10000 });
  await page.click(`[data-testid="goal-${testUser.goal}"]`, { force: true });
  await page.waitForTimeout(300);
  await page.click('[data-testid="goal-continue-btn"]', { force: true });

  // Why
  await page.waitForSelector('[data-testid="why-input"]', { timeout: 10000 });
  await page.fill('[data-testid="why-input"]', testUser.why);
  await page.click('[data-testid="why-continue-btn"]', { force: true });

  // Path
  await page.waitForSelector('[data-testid="path-continue-btn"]', { timeout: 10000 });
  await page.click('[data-testid="path-continue-btn"]', { force: true });

  // Commitment - select time then click continue
  await page.waitForSelector(`[data-testid="commitment-${testUser.commitment}min"]`, { timeout: 10000 });
  await page.click(`[data-testid="commitment-${testUser.commitment}min"]`, { force: true });
  await page.waitForTimeout(500);
  await page.click('[data-testid="commitment-continue-btn"]', { force: true });

  // Ready - wait for phases to complete (summary -> mentor -> ready)
  await page.waitForSelector('[data-testid="ready-begin-btn"]', { timeout: 15000 });
  await page.click('[data-testid="ready-begin-btn"]', { force: true });

  // Verify home
  await expect(page.locator('[data-testid="daily-flow-home"]')).toBeVisible({ timeout: 10000 });
}

/**
 * Navigate through the lesson to the choice step
 */
export async function navigateToChoice(page: Page) {
  // Start lesson
  await page.click('[data-testid="start-lesson-btn"]', { force: true });
  
  // Check for First Lesson Coach Modal (appears after clicking start)
  try {
    // It might appear if this is the first session
    const modalButton = page.locator('[data-testid="coach-modal-btn-beforeFirstLesson"]');
    if (await modalButton.isVisible({ timeout: 15000 })) {
      await modalButton.click({ force: true });
      await modalButton.waitFor({ state: 'hidden', timeout: 15000 });
      await page.waitForTimeout(500); // Wait for transition into lesson
    }
  } catch (e) {
    // Ignore if modal doesn't appear (not first session)
    console.log('No coach modal appeared, proceeding...');
  }

  // Click through all scenarios until we hit the commitment input
  // Max 30 attempts, wait 1s between checks (text animations can be slow)
  let attempts = 0;
  while (attempts < 30) {
    // Check if we reached the commitment input
    if (await page.locator('[data-testid="commitment-input"]').isVisible()) {
      break;
    }
    
    // Check for scenario continue button
    const scenarioBtn = page.locator('[data-testid="scenario-continue-btn"]');
    if (await scenarioBtn.isVisible()) {
      await scenarioBtn.click();
      // Wait for the button to disappear (transition to next step)
      try {
        await scenarioBtn.waitFor({ state: 'hidden', timeout: 5000 });
      } catch (e) {
        // Ignore timeout
      }
      await page.waitForTimeout(1000); // Wait for next step to mount
    } else {
      // Wait a bit and check again - text might be animating
      await page.waitForTimeout(1000);
    }
    attempts++;
  }

  // Name burden (commitment input)
  await page.waitForSelector('[data-testid="commitment-input"]', { timeout: 15000 });
  await page.fill('[data-testid="commitment-input"]', testBurden);
  await page.click('[data-testid="commitment-submit-btn"]');

  // Timer: Feel it (wait for timer to complete - 30 seconds)
  await page.waitForSelector('[data-testid="timer-step"]', { timeout: 10000 });
  
  // Start timer
  await page.click('[data-testid="timer-start-btn"]');
  
  // Wait for timer to complete
  await page.waitForTimeout(TIMEOUTS.timerStep);
  
  // Complete timer
  await page.waitForSelector('[data-testid="timer-complete-btn"]', { timeout: 10000 });
  await page.click('[data-testid="timer-complete-btn"]');

  // Ancient question insight
  await page.waitForSelector('[data-testid="insight-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="insight-continue-btn"]');

  // Now at THE CHOICE - wait for choice options to appear
  await page.waitForSelector('[data-testid="choice-option-yes"]', { timeout: 15000 });
}

/**
 * Complete the reward flow (new 2-phase design: reveal auto-plays, then crown with single button)
 */
export async function completeRewardFlow(page: Page) {
  await page.waitForSelector('[data-testid="xp-celebration"]', { timeout: 15000 });
  
  // Wait for the continue button to appear and be enabled
  // The reveal phase auto-plays for ~2.5s, then crown phase shows the button
  let attempts = 0;
  while (attempts < 20) {
    const continueBtn = page.locator('[data-testid="reward-continue-btn"]');
    if (await continueBtn.isVisible()) {
      if (await continueBtn.isEnabled()) {
        await continueBtn.click();
        return; // Done!
      }
    }
    await page.waitForTimeout(500);
    attempts++;
  }
}

/**
 * Complete the YES path up to GoDoIt dismissal
 */
export async function completeYesPathToGoDoIt(page: Page) {
  // Select YES
  await page.click('[data-testid="choice-option-yes"]');
  await page.waitForTimeout(1000);

  // Action validation insight
  await page.waitForSelector('[data-testid="insight-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="insight-continue-btn"]');

  // Commit action
  await page.waitForSelector('[data-testid="commitment-input"]', { timeout: 15000 });
  await page.fill('[data-testid="commitment-input"]', testCommitments.action);
  await page.click('[data-testid="commitment-submit-btn"]');

  // GoDoIt - wait for dismiss button
  await page.waitForSelector('[data-testid="godoit-dismiss-btn"]', { timeout: 15000 });
  await page.click('[data-testid="godoit-dismiss-btn"]');
}

/**
 * Complete the NO path (acceptance)
 */
export async function completeNoPath(page: Page) {
  // Select NO
  await page.click('[data-testid="choice-option-no"]');
  await page.waitForTimeout(1000);

  // Acceptance validation insight
  await page.waitForSelector('[data-testid="insight-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="insight-continue-btn"]');

  // Acceptance depth scenario
  await page.waitForSelector('[data-testid="scenario-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="scenario-continue-btn"]');

  // Acceptance visualization (9 steps × ~5 sec)
  await page.waitForTimeout(TIMEOUTS.visualizationStep);
  
  // Click continue after visualization
  await page.waitForSelector('[data-testid="visualization-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="visualization-continue-btn"]');

  // Acceptance reflection
  await page.waitForSelector('[data-testid="reflection-input"]', { timeout: 15000 });
  await page.fill('[data-testid="reflection-input"]', testCommitments.reflection.acceptance);
  await page.click('[data-testid="reflection-submit-btn"]');

  // Reward flow
  await completeRewardFlow(page);

  // Closing insight
  await page.waitForSelector('[data-testid="insight-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="insight-continue-btn"]');

  // Mentor response
  await page.waitForSelector('[data-testid="mentor-response"]', { timeout: 15000 });
  await page.waitForSelector('[data-testid="mentor-complete-btn"]:not([disabled])', { timeout: 30000 });
  await page.click('[data-testid="mentor-complete-btn"]');

  // Check for "The Power of Teaching" coach modal (first session only)
  // We use text selector because data-testid might not be live on the server yet
  const modalBtn = page.locator('[data-testid="coach-modal-btn-afterLessonBeforeEcho"]');
  try {
    // Wait up to 15s for modal to appear
    await modalBtn.waitFor({ state: 'visible', timeout: 15000 });
    
    // Click until it disappears
    for (let i = 0; i < 5; i++) {
        if (await modalBtn.isVisible()) {
            await modalBtn.click({ force: true });
            await page.waitForTimeout(1000);
        } else {
            break;
        }
    }
  } catch (e) {
    // Modal didn't appear, move on
    console.log('Coach modal did not appear or timed out');
  }
}

/**
 * Complete the post-action flow after returning from GoDoIt
 */
export async function completePostActionFlow(page: Page, completed: boolean) {
  // Return confirm step
  if (completed) {
    await page.click('[data-testid="return-completed-btn"]');
  } else {
    await page.click('[data-testid="return-not-completed-btn"]');
  }
  await page.waitForTimeout(2000);

  // Action reflection
  await page.waitForSelector('[data-testid="reflection-input"]', { timeout: 15000 });
  const reflectionText = completed
    ? testCommitments.reflection.completed
    : testCommitments.reflection.notCompleted;
  await page.fill('[data-testid="reflection-input"]', reflectionText);
  await page.click('[data-testid="reflection-submit-btn"]');

  // Reward flow
  await completeRewardFlow(page);

  // Closing insight
  await page.waitForSelector('[data-testid="insight-continue-btn"]', { timeout: 15000 });
  await page.click('[data-testid="insight-continue-btn"]');

  // Mentor response
  await page.waitForSelector('[data-testid="mentor-response"]', { timeout: 15000 });
  await page.waitForSelector('[data-testid="mentor-complete-btn"]:not([disabled])', { timeout: 30000 });
  await page.click('[data-testid="mentor-complete-btn"]');

  // Check for "The Power of Teaching" coach modal
  const modalBtn = page.locator('[data-testid="coach-modal-btn-afterLessonBeforeEcho"]');
  try {
    await modalBtn.waitFor({ state: 'visible', timeout: 15000 });
    for (let i = 0; i < 5; i++) {
        if (await modalBtn.isVisible()) {
            await modalBtn.click({ force: true });
            await page.waitForTimeout(1000);
        } else {
            break;
        }
    }
  } catch (e) {
    console.log('Coach modal did not appear or timed out');
  }
}

/**
 * Complete the mandatory echo flow
 */
export async function completeMandatoryEcho(page: Page, echoResponse: string) {
  await page.waitForSelector('[data-testid="mandatory-echo"]', { timeout: 15000 });

  // The echo response input
  await page.waitForSelector('[data-testid="echo-response-input"]', { timeout: 15000 });
  await page.fill('[data-testid="echo-response-input"]', echoResponse);
  await page.click('[data-testid="echo-submit-btn"]');

  // Wait for completion and transition
  await page.waitForTimeout(3000);
}
