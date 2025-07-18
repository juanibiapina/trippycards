// flow: docs/flows/create-activity.md

import { test, expect } from '@playwright/test';

test.describe('Create Activity Flow', () => {
  test('creates a new activity', async ({ page }) => {
    await page.goto('/');
    await page.click('text=New Activity');
    await page.waitForURL(/\/activities\/[^/]+$/);
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
  });
});