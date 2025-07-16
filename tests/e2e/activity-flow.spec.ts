import { test, expect } from '@playwright/test';

test.describe('Activity Page Navigation', () => {
  test('navigation between overview and questions pages', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication (should be handled by auth.setup.ts)
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Verify bottom navigation is present
    await expect(page.getByRole('button', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Questions' })).toBeVisible();

    // Navigate to questions page
    await page.getByRole('button', { name: 'Questions' }).click();
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Navigate back to overview page
    await page.getByRole('button', { name: 'Overview' }).click();
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();
  });
});