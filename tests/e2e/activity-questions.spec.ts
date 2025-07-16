import { test, expect } from '@playwright/test';

test.describe('Activity Questions Page', () => {
  test('creates activity, adds question, and votes', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication (should be handled by auth.setup.ts)
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Navigate to questions page
    await page.getByRole('button', { name: 'Questions' }).click();
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Create a new question
    const questionText = 'Can you lead climb?';
    await page.fill('input[placeholder*="e.g., Can you lead climb?"]', questionText);
    await page.click('button:has-text("Create Question")');

    // Wait for question to appear
    await expect(page.locator(`text=${questionText}`)).toBeVisible();

    // Verify question card is displayed with voting buttons
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'No' })).toBeVisible();

    // Vote "Yes" on the question (use first occurrence since there's only one question)
    await page.getByRole('button', { name: 'Yes' }).first().click();

    // Verify vote was recorded (button should show selected state or vote count)
    // The exact verification depends on the UI implementation
    await expect(page.getByRole('button', { name: 'Yes' }).first()).toHaveClass(/bg-green/);

    // Vote "No" to change the vote
    await page.getByRole('button', { name: 'No' }).first().click();

    // Verify vote change was recorded
    await expect(page.getByRole('button', { name: 'No' }).first()).toHaveClass(/bg-red/);

    // Create another question to test multiple questions
    const secondQuestionText = 'Do you have outdoor experience?';
    await page.fill('input[placeholder*="e.g., Can you lead climb?"]', secondQuestionText);
    await page.click('button:has-text("Create Question")');

    // Wait for second question to appear
    await expect(page.locator(`text=${secondQuestionText}`)).toBeVisible();

    // Verify both questions are visible
    await expect(page.locator(`text=${questionText}`)).toBeVisible();
    await expect(page.locator(`text=${secondQuestionText}`)).toBeVisible();
  });
});