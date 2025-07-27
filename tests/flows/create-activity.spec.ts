// flow: docs/flows/create-activity.md

import { test, expect } from '@playwright/test';

test.describe('Create Activity Flow', () => {
  test('creates a new activity', async ({ page }) => {
    await page.goto('/');
    await page.click('text=New Activity');
    await page.waitForURL(/\/activities\/[^/]+$/);
    await expect(page.locator('text=Click to name this activity')).toBeVisible();

    // Assert initial title for untitled activity
    await expect(page).toHaveTitle('Untitled Activity');

    // Rename the activity
    await page.click('text=Click to name this activity');
    await page.fill('input[placeholder*="activity name"]', 'My Summer Vacation');
    await page.press('input[placeholder*="activity name"]', 'Enter');

    // Wait for the activity name to update in the UI
    await expect(page.locator('text=My Summer Vacation')).toBeVisible();

    // Assert new title with activity name
    await expect(page).toHaveTitle('My Summer Vacation');
  });
});