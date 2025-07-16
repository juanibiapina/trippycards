import { test, expect } from '@playwright/test';

test.describe('Bottom Navigation Bar', () => {
  test('displays bottom navigation bar on activity page', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication (should be handled by auth.setup.ts)
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Navigate to questions page to test question functionality
    await page.getByRole('button', { name: 'Questions' }).click();
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Check that the bottom navigation bar is present
    const overviewButton = page.getByRole('button', { name: 'Overview' });
    const questionsButton = page.getByRole('button', { name: 'Questions' });

    await expect(overviewButton).toBeVisible();
    await expect(questionsButton).toBeVisible();

    // Check that the bottom bar has proper styling
    const bottomBar = page.locator('[class*="fixed"][class*="bottom-0"]');
    await expect(bottomBar).toBeVisible();

    // Check that the bottom bar contains both navigation icons
    await expect(bottomBar.locator('svg')).toHaveCount(2);

    // Check that the Overview button can be clicked
    await overviewButton.click();
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Check that the Questions button can be clicked
    await questionsButton.click();
    await expect(page.locator('text=Create a new question')).toBeVisible();
  });

  test('bottom navigation bar does not interfere with content', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for authentication
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Navigate to questions page to test question functionality
    await page.getByRole('button', { name: 'Questions' }).click();
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Create a question to ensure content is present
    const questionText = 'Test question for bottom bar';
    await page.fill('input[placeholder*="e.g., Can you lead climb?"]', questionText);
    await page.click('button:has-text("Create Question")');

    // Wait for question to appear
    await expect(page.locator(`text=${questionText}`)).toBeVisible();

    // Check that the bottom navigation bar is present
    const overviewButton = page.getByRole('button', { name: 'Overview' });
    const questionsButton = page.getByRole('button', { name: 'Questions' });

    await expect(overviewButton).toBeVisible();
    await expect(questionsButton).toBeVisible();

    // Check that the question is still visible and not covered by the bottom bar
    const questionCard = page.locator(`text=${questionText}`);
    await expect(questionCard).toBeVisible();

    // Check that the question card is not overlapped by the bottom bar
    const questionBounds = await questionCard.boundingBox();
    const bottomBarBounds = await overviewButton.boundingBox();

    expect(questionBounds).not.toBeNull();
    expect(bottomBarBounds).not.toBeNull();

    // The question should be above the bottom bar
    expect(questionBounds!.y + questionBounds!.height).toBeLessThan(bottomBarBounds!.y);
  });
});