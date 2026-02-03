import { test, expect } from '@playwright/test';
import { exerciseResponses } from '../fixtures/test-data';

test.describe('All Exercise Types', () => {
  // Note: This test assumes we're already on the exercise experience screen
  // In a full flow, this would run after completing lesson and echo
  
  // For standalone testing, we would need to set up the state
  // This test is a template that shows how to test each exercise type

  test.skip('completes all 5 exercise types', async ({ page }) => {
    // This test requires the full flow to be completed first
    // Skipped for now - can be run as part of a full integration test
    
    // We'll test each exercise type
    const exercises = [
      { type: 'scenario', response: exerciseResponses.scenario },
      { type: 'quote', response: exerciseResponses.quote },
      { type: 'application', response: exerciseResponses.application },
      { type: 'anchor', response: null }, // Breathing exercise - no text input
      { type: 'reframe', response: exerciseResponses.reframe },
    ];

    // Verify we're on the exercise experience screen
    await expect(page.locator('[data-testid="exercise-experience"]')).toBeVisible();

    for (const exercise of exercises) {
      // Click on exercise card
      const exerciseCard = page.locator(`[data-testid="exercise-${exercise.type}"]`);
      if (await exerciseCard.isVisible()) {
        await exerciseCard.click();

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
        await page.waitForTimeout(1000);
      }
    }

    // All exercises complete - should show celebration
    await expect(page.locator('[data-testid="daily-complete-celebration"]')).toBeVisible({ timeout: 10000 });
  });
});
