import { test, expect } from '@playwright/test';

test.describe('Activity Page Navigation', () => {
  test('activity page loads overview directly', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication (should be handled by auth.setup.ts)
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load (should show overview)
    await expect(page.getByRole('button', { name: /create card/i })).toBeVisible();
  });
});