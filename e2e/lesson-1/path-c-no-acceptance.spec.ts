import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeNoPath } from '../helpers/navigation';
import { testCommitments, TIMEOUTS } from '../fixtures/test-data';

test.describe('Lesson 1: Path C - NO (Acceptance Path)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForLoadState('networkidle');
    await completeOnboarding(page);
  });

  test('completes NO path with acceptance visualization', async ({ page }) => {
    test.setTimeout(300000); // Increase timeout to 5 minutes for long visualization steps
    await navigateToChoice(page);
    await completeNoPath(page);

    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible({ timeout: 15000 });
  });
});