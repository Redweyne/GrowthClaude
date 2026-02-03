import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeYesPathToGoDoIt, completePostActionFlow } from '../helpers/navigation';
import { testCommitments } from '../fixtures/test-data';

test.describe('Lesson 1: Path B - YES + Not Completed Action', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForLoadState('networkidle');
    await completeOnboarding(page);
  });

  test('completes YES path without completing action', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes timeout
    await navigateToChoice(page);
    await completeYesPathToGoDoIt(page);

    // Simulate returning
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForTimeout(2000);

    await page.click('[data-testid="continue-lesson-btn"]');

    // Complete post-action flow with completed=false
    await completePostActionFlow(page, false);

    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible({ timeout: 15000 });
  });
});
