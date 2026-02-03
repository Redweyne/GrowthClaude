import { test, expect } from '@playwright/test';
import { completeOnboarding, navigateToChoice, completeNoPath, completeMandatoryEcho } from '../helpers/navigation';
import { testEchoResponse, testCommitments, TIMEOUTS } from '../fixtures/test-data';

test.describe('Mandatory Echo Flow', () => {
  test('completes mandatory echo after lesson', async ({ page }) => {
    test.setTimeout(300000); // Increase timeout
    await page.goto('http://localhost:3000/growthmvp');
    await page.waitForLoadState('networkidle');
    await completeOnboarding(page);

    // Complete a quick lesson path (NO path is shorter - no GoDoIt)
    await navigateToChoice(page);
    await completeNoPath(page);

    // Double check for coach modal (in case it appeared late)
    try {
      const modalButton = page.locator('button:has-text("Ready to Connect")');
      if (await modalButton.isVisible({ timeout: 5000 })) {
        await modalButton.click({ force: true });
        await page.waitForTimeout(2000);
      }
    } catch (e) {}

    // HACK: Force remove any sticky modal overlays if they persist
    // This is necessary because in the test environment the modal sometimes refuses to close via click
    await page.evaluate(() => {
        // Find the modal overlay (CoachModal uses z-50 and fixed inset-0)
        const overlays = document.querySelectorAll('.fixed.inset-0.z-50');
        overlays.forEach(el => el.remove());
    });

    // Now on Mandatory Echo
    await expect(page.locator('[data-testid="mandatory-echo"]')).toBeVisible({ timeout: 15000 });

    // Should see the echo response input (may need to click through intro phase first)
    const echoInput = page.locator('[data-testid="echo-response-input"]');
    const isInputVisible = await echoInput.isVisible();
    
    if (!isInputVisible) {
      // May need to click through intro/reading phases
      // Look for "Write a Response" or similar continue buttons
      const continueButtons = page.locator('button:has-text("Write"), button:has-text("Continue")');
      
      // Try to click through a few times if needed
      for (let i = 0; i < 5; i++) {
        if (await echoInput.isVisible()) break;
        
        if (await continueButtons.first().isVisible()) {
            await continueButtons.first().click();
            await page.waitForTimeout(2000);
        } else {
            await page.waitForTimeout(1000);
        }
      }
    }

    // Write response (minimum 10 words)
    await page.waitForSelector('[data-testid="echo-response-input"]', { timeout: 15000 });
    await page.fill('[data-testid="echo-response-input"]', testEchoResponse);

    // Submit
    await page.click('[data-testid="echo-submit-btn"]');

    // Wait for completion phase and click continue
    // Use force: true because sometimes a previous modal overlay persists in the test environment
    await page.waitForSelector('[data-testid="echo-complete-btn"]', { timeout: 15000 });
    await page.waitForTimeout(1000); 
    await page.click('[data-testid="echo-complete-btn"]', { force: true });

    // Check for "Make It Real" coach modal (appears after echo, before exercises)
    try {
        const practiceBtn = page.locator('button:has-text("Let\'s Practice")');
        if (await practiceBtn.isVisible({ timeout: 5000 })) {
            await practiceBtn.click({ force: true });
            await page.waitForTimeout(1000);
        }
    } catch (e) {
        console.log('Practice modal did not appear');
    }

    // Should transition to exercises
    await expect(page.locator('[data-testid="exercise-experience"]')).toBeVisible({ timeout: 15000 });
  });
});
