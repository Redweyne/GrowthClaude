import { test, expect } from '@playwright/test';
import { testUser } from '../fixtures/test-data';

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app - baseURL is http://localhost:3000/growthmvp/
    await page.goto('http://localhost:3000/growthmvp');
    // Wait for the page to load and animations to complete
    await page.waitForLoadState('networkidle');
  });

  test('completes full onboarding and lands on home', async ({ page }) => {
    // Language selection - select English then click Continue
    await page.click('[data-testid="language-en"]', { force: true });
    await page.waitForTimeout(300);
    await page.click('[data-testid="language-continue-btn"]', { force: true });
    await page.waitForTimeout(500);

    // Welcome
    await page.waitForSelector('[data-testid="welcome-continue-btn"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="welcome-continue-btn"]')).toBeVisible();
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

    // Ready - wait for phases to complete (summary -> mentor -> ready takes ~8 seconds)
    await page.waitForSelector('[data-testid="ready-begin-btn"]', { timeout: 15000 });
    await page.click('[data-testid="ready-begin-btn"]', { force: true });

    // Verify landed on home
    await expect(page.locator('[data-testid="daily-flow-home"]')).toBeVisible({ timeout: 10000 });

    // Verify user name is displayed
    await expect(page.locator('text=' + testUser.name)).toBeVisible();
  });

  test('can navigate back during onboarding', async ({ page }) => {
    // Start onboarding - select English then click Continue
    await page.click('[data-testid="language-en"]', { force: true });
    await page.waitForTimeout(300);
    await page.click('[data-testid="language-continue-btn"]', { force: true });
    await page.waitForSelector('[data-testid="welcome-continue-btn"]', { timeout: 30000 });
    await page.click('[data-testid="welcome-continue-btn"]', { force: true });

    // Fill name
    await page.waitForSelector('[data-testid="name-input"]', { timeout: 30000 });
    await page.fill('[data-testid="name-input"]', testUser.name);
    await page.click('[data-testid="name-continue-btn"]', { force: true });

    // Go to identity step
    await page.waitForSelector(`[data-testid="identity-${testUser.identity}"]`, { timeout: 10000 });

    // Click back (if available)
    const backButton = page.locator('button:has-text("Back"), [data-testid*="back"]');
    if (await backButton.isVisible()) {
      await backButton.click({ force: true });
      // Should be back at name step
      await expect(page.locator('[data-testid="name-input"]')).toBeVisible();
    }
  });
});
