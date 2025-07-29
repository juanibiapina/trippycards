// flow: docs/flows/create-card-ailink.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('AILink Card Creation', () => {
  test('create ailink card', async ({ page }) => {
    // Step 1: Navigate to Activity Page
    await page.goto(`/activities/${randomUUID()}`);
    // Verify the Cards section is visible (with existing cards or "No cards yet" message)
    await expect(page.getByText(/cards/i)).toBeVisible();

    // Step 2: Open Card Creation Modal
    // User clicks the "Create Card" button (with plus icon)
    await page.getByRole('button', { name: /create card/i }).click();
    // Click the Create Card menu item that appears
    await page.getByText('Create Card').click();
    // A modal opens titled "Create Card"
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
    // Select AI Link card type
    await dialog.getByRole('button', { name: 'AI Link' }).click();

    // Step 3: Fill Card Information
    // User enters a URL (required field)
    const urlInput = dialog.getByLabel('URL');
    await expect(urlInput).toBeVisible();
    await urlInput.fill('https://example.com');
    // URL is validated in real-time for proper format
    await expect(dialog.getByText('Please enter a valid URL')).not.toBeVisible();

    // Test invalid URL shows error message
    await urlInput.fill('invalid-url');
    await expect(dialog.getByText('Please enter a valid URL')).toBeVisible();

    // Enter valid URL again
    await urlInput.fill('https://example.com');
    await expect(dialog.getByText('Please enter a valid URL')).not.toBeVisible();

    // Step 4: Submit or Cancel
    // User clicks "Create AILink Card" to submit the form
    const createButton = dialog.getByRole('button', { name: 'Create AILink Card' });
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Step 5: AILink Card Created and Processing Begins
    // Modal closes automatically on successful creation
    await expect(dialog).not.toBeVisible();
    // New AILink card appears immediately in the cards list showing "Processing..." state
    await expect(page.getByText('Processing...')).toBeVisible();
  });
});