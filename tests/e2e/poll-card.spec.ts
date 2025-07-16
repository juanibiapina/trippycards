import { test, expect } from '@playwright/test';

test.describe('Poll Card E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Create a new activity to test with
    await page.goto('/');
    await page.getByRole('button', { name: 'Create Activity' }).click();

    // Navigate to the activity overview page
    await page.waitForURL(/activity\/[^/]+$/);
    await expect(page.getByText('Cards')).toBeVisible();
  });

  test('should create a poll card', async ({ page }) => {
    // Open the card creation modal
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await expect(page.getByText('Create Card')).toBeVisible();

    // Select poll card type
    await page.getByText('Poll Card').click();
    await expect(page.getByText('Poll Card')).toHaveClass(/bg-blue-50/);

    // Fill in poll information
    await page.getByLabel('Question *').fill('What is your favorite programming language?');
    await page.getByPlaceholder('Option 1').fill('JavaScript');
    await page.getByPlaceholder('Option 2').fill('Python');

    // Add more options
    await page.getByText('Add Option').click();
    await page.getByPlaceholder('Option 3').fill('Go');

    // Create the poll card
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Verify poll card is created and visible
    await expect(page.getByText('What is your favorite programming language?')).toBeVisible();
    await expect(page.getByText('JavaScript')).toBeVisible();
    await expect(page.getByText('Python')).toBeVisible();
    await expect(page.getByText('Go')).toBeVisible();
    await expect(page.getByText('0 votes')).toBeVisible();
  });

  test('should allow voting on poll options', async ({ page }) => {
    // Create a poll card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Best frontend framework?');
    await page.getByPlaceholder('Option 1').fill('React');
    await page.getByPlaceholder('Option 2').fill('Vue');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Best frontend framework?')).toBeVisible();
    await expect(page.getByText('0 votes')).toBeVisible();

    // Vote on the first option
    await page.getByRole('button', { name: /React.*0.*0%/ }).click();

    // Verify vote was recorded
    await expect(page.getByText('1 vote')).toBeVisible();
    await expect(page.getByText('✓ Your vote')).toBeVisible();
    await expect(page.getByText(/React.*1.*100%/)).toBeVisible();
    await expect(page.getByText(/Vue.*0.*0%/)).toBeVisible();
  });

  test('should allow changing vote', async ({ page }) => {
    // Create a poll card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Preferred database?');
    await page.getByPlaceholder('Option 1').fill('PostgreSQL');
    await page.getByPlaceholder('Option 2').fill('MongoDB');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Preferred database?')).toBeVisible();

    // Vote on the first option
    await page.getByRole('button', { name: /PostgreSQL.*0.*0%/ }).click();
    await expect(page.getByText(/PostgreSQL.*1.*100%/)).toBeVisible();

    // Change vote to second option
    await page.getByRole('button', { name: /MongoDB.*0.*0%/ }).click();

    // Verify vote was changed
    await expect(page.getByText('1 vote')).toBeVisible();
    await expect(page.getByText(/PostgreSQL.*0.*0%/)).toBeVisible();
    await expect(page.getByText(/MongoDB.*1.*100%/)).toBeVisible();
    await expect(page.getByText('✓ Your vote')).toBeVisible();
  });

  test('should display poll card with multiple options', async ({ page }) => {
    // Create a poll card with multiple options
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('What is your favorite color?');
    await page.getByPlaceholder('Option 1').fill('Red');
    await page.getByPlaceholder('Option 2').fill('Blue');

    // Add more options
    await page.getByText('Add Option').click();
    await page.getByPlaceholder('Option 3').fill('Green');
    await page.getByText('Add Option').click();
    await page.getByPlaceholder('Option 4').fill('Yellow');

    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Verify all options are visible
    await expect(page.getByText('What is your favorite color?')).toBeVisible();
    await expect(page.getByText('Red')).toBeVisible();
    await expect(page.getByText('Blue')).toBeVisible();
    await expect(page.getByText('Green')).toBeVisible();
    await expect(page.getByText('Yellow')).toBeVisible();
    await expect(page.getByText('0 votes')).toBeVisible();
  });

  test('should handle poll card validation', async ({ page }) => {
    // Open the card creation modal
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();

    // Try to submit without question
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Should show validation error
    await expect(page.getByText('Question is required')).toBeVisible();

    // Fill in question but clear options
    await page.getByLabel('Question *').fill('Test question?');
    await page.getByPlaceholder('Option 1').fill('');
    await page.getByPlaceholder('Option 2').fill('');

    // Try to submit
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Should show validation error
    await expect(page.getByText('At least 2 options are required')).toBeVisible();
  });

  test('should allow editing poll cards', async ({ page }) => {
    // Create a poll card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Original question?');
    await page.getByPlaceholder('Option 1').fill('Option A');
    await page.getByPlaceholder('Option 2').fill('Option B');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Original question?')).toBeVisible();

    // Open context menu and edit
    await page.locator('.relative').first().hover();
    await page.getByRole('button', { name: 'More options' }).click();
    await page.getByText('Edit').click();

    // Verify edit modal shows poll data
    await expect(page.getByText('Edit Poll Card')).toBeVisible();
    await expect(page.getByDisplayValue('Original question?')).toBeVisible();
    await expect(page.getByDisplayValue('Option A')).toBeVisible();
    await expect(page.getByDisplayValue('Option B')).toBeVisible();

    // Edit the question
    await page.getByLabel('Question *').fill('Updated question?');
    await page.getByDisplayValue('Option A').fill('Updated Option A');

    // Save changes
    await page.getByRole('button', { name: 'Update Card' }).click();

    // Verify changes are saved
    await expect(page.getByText('Updated question?')).toBeVisible();
    await expect(page.getByText('Updated Option A')).toBeVisible();
    await expect(page.getByText('Option B')).toBeVisible();
  });

  test('should allow deleting poll cards', async ({ page }) => {
    // Create a poll card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Test question for deletion?');
    await page.getByPlaceholder('Option 1').fill('Option 1');
    await page.getByPlaceholder('Option 2').fill('Option 2');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Test question for deletion?')).toBeVisible();

    // Open context menu and delete
    await page.locator('.relative').first().hover();
    await page.getByRole('button', { name: 'More options' }).click();
    await page.getByText('Delete').click();

    // Confirm deletion
    await expect(page.getByText('Delete Card')).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();

    // Verify card is deleted
    await expect(page.getByText('Test question for deletion?')).not.toBeVisible();
    await expect(page.getByText('No cards yet')).toBeVisible();
  });

  test('should display vote percentages correctly', async ({ page }) => {
    // Create a poll card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Testing percentages?');
    await page.getByPlaceholder('Option 1').fill('First');
    await page.getByPlaceholder('Option 2').fill('Second');
    await page.getByText('Add Option').click();
    await page.getByPlaceholder('Option 3').fill('Third');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Testing percentages?')).toBeVisible();

    // Vote on first option
    await page.getByRole('button', { name: /First.*0.*0%/ }).click();

    // Verify percentages are updated
    await expect(page.getByText('1 vote')).toBeVisible();
    await expect(page.getByText(/First.*1.*100%/)).toBeVisible();
    await expect(page.getByText(/Second.*0.*0%/)).toBeVisible();
    await expect(page.getByText(/Third.*0.*0%/)).toBeVisible();
  });

  test('should handle empty poll card gracefully', async ({ page }) => {
    // Create a poll card with minimal data
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByText('Poll Card').click();
    await page.getByLabel('Question *').fill('Simple question?');
    await page.getByPlaceholder('Option 1').fill('Yes');
    await page.getByPlaceholder('Option 2').fill('No');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for poll to be created
    await expect(page.getByText('Simple question?')).toBeVisible();
    await expect(page.getByText('0 votes')).toBeVisible();

    // Both options should show 0 votes and 0%
    await expect(page.getByText(/Yes.*0.*0%/)).toBeVisible();
    await expect(page.getByText(/No.*0.*0%/)).toBeVisible();
  });
});