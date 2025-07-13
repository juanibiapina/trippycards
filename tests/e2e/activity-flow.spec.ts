import { test, expect } from '@playwright/test';

test.describe('Activity Integration Flow', () => {
  test('creates activity, adds question, and votes', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication (should be handled by auth.setup.ts)
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load
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

  test('direct link to activity page', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
  });

  test('activity name editing and persistence', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Verify placeholder text is shown when no name is set
    await expect(page.locator('text=Click to name this activity')).toBeVisible();

    // Click on placeholder to enter edit mode
    await page.click('text=Click to name this activity');

    // Verify edit mode is active (input field appears)
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();

    // Enter activity name
    const activityName = 'Rock Climbing Adventure';
    await page.fill('input[placeholder="Enter activity name"]', activityName);

    // Submit the name change
    await page.click('button:has-text("Save")');

    // Verify name is displayed
    await expect(page.locator(`text=${activityName}`)).toBeVisible();

    // Verify placeholder is no longer shown
    await expect(page.locator('text=Click to name this activity')).not.toBeVisible();

    // Reload page to test persistence
    await page.reload();

    // Wait for page to load and verify name persists
    await expect(page.locator(`text=${activityName}`)).toBeVisible();

    // Test changing existing name
    await page.click(`text=${activityName}`);
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();

    const newName = 'Mountain Hiking Trip';
    await page.fill('input[placeholder="Enter activity name"]', newName);
    await page.click('button:has-text("Save")');

    // Verify new name is displayed
    await expect(page.locator(`text=${newName}`)).toBeVisible();
    await expect(page.locator(`text=${activityName}`)).not.toBeVisible();
  });

  test('activity name editing cancel functionality', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Click on placeholder to enter edit mode
    await page.click('text=Click to name this activity');

    // Verify edit mode is active and both buttons are present
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();

    // Enter activity name
    const activityName = 'Rock Climbing Adventure';
    await page.fill('input[placeholder="Enter activity name"]', activityName);

    // Click Cancel button
    await page.click('button:has-text("Cancel")');

    // Verify edit mode is closed and original placeholder is shown
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter activity name"]')).not.toBeVisible();

    // Test escape key functionality
    await page.click('text=Click to name this activity');
    await page.fill('input[placeholder="Enter activity name"]', activityName);
    await page.keyboard.press('Escape');

    // Verify edit mode is closed again
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter activity name"]')).not.toBeVisible();
  });
});
