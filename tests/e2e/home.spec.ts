import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('displays home page', async ({ page }) => {
    // Navigate to the home page
    await page.goto(`/`);

    // Check for New Activity button
    await expect(page.locator('text=New Activity')).toBeVisible();
  });
});
