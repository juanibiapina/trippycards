import { test } from '@playwright/test';

test.describe('UI Screenshots', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('screenshot bottom bar functionality', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Create a new activity
    await page.click('text=New Activity');

    // Wait for the activity page to load
    await page.waitForSelector('text=Click to name this activity');

    // Take a screenshot to show the UI
    await page.screenshot({ path: 'activity-page-with-bottom-bar.png', fullPage: true });

    // Check if the bottom bar is visible
    await page.waitForSelector('button[aria-label="Overview"]');

    // Add a question to test the functionality
    await page.fill('input[placeholder="e.g., Can you lead climb?"]', 'Test question for demonstration');
    await page.click('button[type="submit"]');

    // Wait for the question to appear
    await page.waitForSelector('text=Test question for demonstration');

    // Take another screenshot showing the question counter
    await page.screenshot({ path: 'activity-page-with-question-counter.png', fullPage: true });

    // Click on the Overview button to open the modal
    await page.click('button[aria-label="Overview"]');

    // Wait for the modal to open
    await page.waitForSelector('h2:has-text("Overview")');

    // Take a screenshot of the overview modal
    await page.screenshot({ path: 'overview-modal-screenshot.png', fullPage: true });

    console.log('Screenshots saved successfully!');
  });
});