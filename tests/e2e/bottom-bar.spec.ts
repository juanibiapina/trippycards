import { test, expect } from '@playwright/test';

test.describe('Bottom Bar and Overview', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('bottom bar is visible and overview works', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Create a new activity
    await page.click('text=New Activity');
    
    // Wait for the activity page to load
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
    
    // Check that bottom bar is visible
    await expect(page.locator('button[aria-label="Overview"]')).toBeVisible();
    
    // Check that the Overview button shows "Overview" text
    await expect(page.locator('text=Overview')).toBeVisible();
    
    // Click on Overview button
    await page.click('button[aria-label="Overview"]');
    
    // Check that the overview modal opens
    await expect(page.locator('text=No questions yet').first()).toBeVisible();
    await expect(page.locator('text=Create your first question to get started!')).toBeVisible();
    
    // Close the modal
    await page.click('button[aria-label="Close overview"]');
    
    // Verify modal is closed
    await expect(page.locator('text=Create your first question to get started!')).not.toBeVisible();
    
    // Create a question
    await page.fill('input[placeholder="e.g., Can you lead climb?"]', 'Test question for bottom bar');
    await page.click('button[type="submit"]');
    
    // Wait for the question to be created
    await expect(page.locator('text=Test question for bottom bar')).toBeVisible();
    
    // Check that the overview button now shows a badge with question count
    await expect(page.locator('button[aria-label="Overview"] >> text=1')).toBeVisible();
    
    // Open overview again
    await page.click('button[aria-label="Overview"]');
    
    // Check that the overview modal is open and has content
    await expect(page.locator('h2:has-text("Overview")')).toBeVisible();
    
    // Close the modal
    await page.click('button[aria-label="Close overview"]');
    
    // Verify the modal is closed
    await expect(page.locator('h2:has-text("Overview")')).not.toBeVisible();
  });
});