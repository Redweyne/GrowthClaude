import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeYesPathToGoDoIt, completePostActionFlow } from '../helpers/navigation';
import { testCommitments } from '../fixtures/test-data';

test.describe('Lesson 1: Path A - YES + Completed Action', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForLoadState('networkidle');
    await completeOnboarding(page);
  });

  test('completes YES path with action completed', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout
    // Navigate to the choice
    await navigateToChoice(page);

    // Complete YES path to GoDoIt
    await completeYesPathToGoDoIt(page);

    // Simulate returning (user comes back after taking action)
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForTimeout(2000);

    // Should show "Continue Lesson" button (pending action)
    await expect(page.locator('[data-testid="continue-lesson-btn"]')).toBeVisible({ timeout: 10000 });
    await page.click('[data-testid="continue-lesson-btn"]');

    // Complete post-action flow (Reflection -> Reward -> Mentor -> Coach Modal)
    await completePostActionFlow(page, true);

    // Should transition to Mandatory Echo
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible({ timeout: 15000 });
  });
});
