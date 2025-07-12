import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Home - Not Authenticated', () => {
  test('home', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Sign in')).toBeVisible();
  });
});
