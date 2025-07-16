import { test, expect } from '@playwright/test';

test.describe('Card Update and Delete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('New Activity').click();
    await page.waitForURL(/\/activities\/[^/]+/);

    // Click on Overview in the bottom navigation
    await page.getByRole('button', { name: 'Overview' }).click();
    await page.waitForURL(/\/activities\/[^/]+\/overview/);
  });

  test('should display context menu for existing cards', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Card');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for the card to appear
    await expect(page.getByText('Test Card')).toBeVisible();

    // Check that the context menu button is visible
    await expect(page.getByRole('button', { name: 'Card options' })).toBeVisible();
  });

  test('should open context menu and display edit and delete options', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Card');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Wait for the card to appear
    await expect(page.getByText('Test Card')).toBeVisible();

    // Click context menu button
    await page.getByRole('button', { name: 'Card options' }).click();

    // Check that edit and delete options are visible
    await expect(page.getByText('Edit')).toBeVisible();
    await expect(page.getByText('Delete')).toBeVisible();
  });

  test('should edit card when Edit is clicked', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Original Title');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Verify card is created
    await expect(page.getByText('Original Title')).toBeVisible();

    // Click context menu and edit
    await page.getByRole('button', { name: 'Card options' }).click();
    await page.getByText('Edit').click();

    // Check that the edit modal is opened with existing values
    await expect(page.getByText('Edit Link Card')).toBeVisible();
    await expect(page.getByLabel('URL *')).toHaveValue('https://example.com');
    await expect(page.getByLabel('Title (optional)')).toHaveValue('Original Title');

    // Update the title
    await page.getByLabel('Title (optional)').fill('Updated Title');
    await page.locator('form').getByRole('button', { name: 'Update Card' }).click();

    // Verify the card is updated
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Original Title')).not.toBeVisible();
  });

  test('should show delete confirmation dialog when Delete is clicked', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Card');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Click context menu and delete
    await page.getByRole('button', { name: 'Card options' }).click();
    await page.getByText('Delete').click();

    // Check that the delete confirmation dialog is shown
    await expect(page.getByText('Delete Card')).toBeVisible();
    await expect(page.getByText('Are you sure you want to delete this card? This action cannot be undone.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
  });

  test('should cancel delete when Cancel is clicked', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Card');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Click context menu and delete
    await page.getByRole('button', { name: 'Card options' }).click();
    await page.getByText('Delete').click();

    // Cancel the deletion
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify the card is still there
    await expect(page.getByText('Test Card')).toBeVisible();
    await expect(page.getByText('Delete Card')).not.toBeVisible();
  });

  test('should delete card when Delete is confirmed', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Card');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Verify card is created
    await expect(page.getByText('Test Card')).toBeVisible();

    // Click context menu and delete
    await page.getByRole('button', { name: 'Card options' }).click();
    await page.getByText('Delete').click();

    // Confirm the deletion
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify the card is deleted
    await expect(page.getByText('Test Card')).not.toBeVisible();
    await expect(page.getByText('No cards yet')).toBeVisible();
  });

  test('should update card with all fields', async ({ page }) => {
    // Create a card first
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Original Title');
    await page.getByLabel('Description (optional)').fill('Original Description');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Click context menu and edit
    await page.getByRole('button', { name: 'Card options' }).click();
    await page.getByText('Edit').click();

    // Update all fields
    await page.getByLabel('URL *').fill('https://updated.com');
    await page.getByLabel('Title (optional)').fill('Updated Title');
    await page.getByLabel('Description (optional)').fill('Updated Description');
    await page.getByLabel('Image URL (optional)').fill('https://updated.com/image.jpg');
    await page.locator('form').getByRole('button', { name: 'Update Card' }).click();

    // Verify all fields are updated
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Updated Description')).toBeVisible();
    await expect(page.getByText('https://updated.com')).toBeVisible();
  });

  test('should handle multiple cards update and delete', async ({ page }) => {
    // Create first card
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example1.com');
    await page.getByLabel('Title (optional)').fill('Card 1');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Create second card
    await page.getByRole('button', { name: 'Create Card' }).first().click();
    await page.getByLabel('URL *').fill('https://example2.com');
    await page.getByLabel('Title (optional)').fill('Card 2');
    await page.locator('form').getByRole('button', { name: 'Create Card' }).click();

    // Verify both cards exist
    await expect(page.getByText('Card 1')).toBeVisible();
    await expect(page.getByText('Card 2')).toBeVisible();

    // Edit first card
    await page.getByRole('button', { name: 'Card options' }).first().click();
    await page.getByText('Edit').click();
    await page.getByLabel('Title (optional)').fill('Updated Card 1');
    await page.locator('form').getByRole('button', { name: 'Update Card' }).click();

    // Delete second card
    await page.getByRole('button', { name: 'Card options' }).last().click();
    await page.getByText('Delete').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // Verify results
    await expect(page.getByText('Updated Card 1')).toBeVisible();
    await expect(page.getByText('Card 2')).not.toBeVisible();
  });
});