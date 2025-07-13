import { test, expect } from '@playwright/test';

test.describe('Google Calendar Integration', () => {
  test('Google Calendar button is visible on activity page', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');

    // Authenticate using the mock endpoint
    await page.evaluate(async () => {
      const res = await fetch('/api/auth/test-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.json();
    });

    // Reload the page to pick up the session
    await page.reload();

    // Wait for the authenticated page to load
    await expect(page.getByText('New Activity')).toBeVisible();

    // Click to create a new activity
    await page.getByText('New Activity').click();

    // Wait for the activity page to load
    await expect(page.getByText('Click to name this activity')).toBeVisible();

    // Check if the Google Calendar button is visible
    await expect(page.getByText('Add to Calendar')).toBeVisible();

    // Click on the Google Calendar button
    await page.getByText('Add to Calendar').click();

    // Check if the modal opens
    await expect(page.getByText('Add to Google Calendar')).toBeVisible();

    // Check if the form fields are present
    await expect(page.locator('label:has-text("Activity Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Date")')).toBeVisible();
    await expect(page.getByText('Create Event')).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();

    // Take a screenshot for documentation
    await page.screenshot({ path: 'google-calendar-modal.png' });
  });
});