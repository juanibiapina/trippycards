import { test, expect } from '@playwright/test';

test.describe('Travel Cards Application', () => {
  test('should display the trip card', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the trip card to load
    await expect(page.locator('text=Loading...')).toBeVisible();
    await expect(page.locator('text=Loading...')).toBeHidden();
    
    // Should display the trip name when loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display attendance question', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('text=Loading...')).toBeHidden();
    
    // Should display the attendance question
    await expect(page.locator('text=Are you going?')).toBeVisible();
    await expect(page.locator('text=Please confirm your attendance for the Red Rock climbing trip')).toBeVisible();
  });

  test('should allow selecting attendance options', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await expect(page.locator('text=Loading...')).toBeHidden();
    
    // Should display all attendance buttons
    const yesButton = page.locator('button:has-text("Yes")');
    const maybeButton = page.locator('button:has-text("Maybe")');
    const noButton = page.locator('button:has-text("No")');
    
    await expect(yesButton).toBeVisible();
    await expect(maybeButton).toBeVisible();
    await expect(noButton).toBeVisible();
    
    // Click Yes button
    await yesButton.click();
    await expect(yesButton).toHaveClass(/selected/);
    
    // Click Maybe button
    await maybeButton.click();
    await expect(maybeButton).toHaveClass(/selected/);
    await expect(yesButton).not.toHaveClass(/selected/);
    
    // Click No button
    await noButton.click();
    await expect(noButton).toHaveClass(/selected/);
    await expect(maybeButton).not.toHaveClass(/selected/);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('/api/trips/v2/1', route => {
      route.abort();
    });
    
    await page.goto('/');
    
    // Should display error message
    await expect(page.locator('text=Failed to load trip')).toBeVisible();
  });
});