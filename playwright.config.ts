import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Transformation Hub E2E Tests
 * 
 * Devices: iPhone 14, Pixel 7
 * Tests: Onboarding → Lesson 1 (all branches) → Echo → Exercises
 */
export default defineConfig({
  testDir: './e2e',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],
  
  // Global test settings
  use: {
    // Base URL for navigation (includes basePath from next.config.ts)
    // Note: trailing slash is important for proper path resolution
    baseURL: 'http://localhost:3000/growthmvp/',
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshots on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'on-first-retry',
    
    // Viewport will be overridden by device settings
    viewport: null,
  },
  
  // Test timeout (lessons have timers, so we need more time)
  timeout: 120000, // 2 minutes per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  // Configure projects for different devices
  projects: [
    {
      name: 'iPhone 14',
      use: {
        ...devices['iPhone 14'],
        // Use WebKit for iOS simulation
        browserName: 'webkit',
      },
    },
    {
      name: 'Pixel 7',
      use: {
        ...devices['Pixel 7'],
        // Use Chromium for Android simulation
        browserName: 'chromium',
      },
    },
  ],

  // Run local dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/growthmvp',
    reuseExistingServer: true,
    timeout: 180000, // 3 minutes to start
  },
  
  // Output folder for screenshots and videos
  outputDir: 'e2e-results',
});
