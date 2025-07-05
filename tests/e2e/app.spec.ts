import { test, expect } from '@playwright/test';

test.describe('Travel Cards Application', () => {
  test('home', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Sign in')).toBeVisible();
  });
});
