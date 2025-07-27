// flow: docs/flows/create-card-cost.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Cost Card Creation', () => {
  test('create cost card', async ({ page }) => {
    // Step 1: Go to activity page
    await page.goto(`/activities/${randomUUID()}`);

    // Step 2: Check Create Card button is visible
    await expect(page.getByRole('button', { name: /create card/i })).toBeVisible();

    // Step 3: Open card creation modal
    await page.getByRole('button', { name: /create card/i }).click();
    // Click the Create Card menu item that appears
    await page.getByText('Create Card').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeVisible();

    // Step 4: Select Cost card type
    await dialog.getByRole('button', { name: 'Cost' }).click();

    // Step 5: Fill Cost Information
    await dialog.getByLabel('Description').fill('Dinner at restaurant');
    await dialog.getByLabel('Total Amount').fill('120.50');

    // Select payers (for now, assume user is added as a payer)
    // This will be updated when we implement user management

    // Step 6: Submit
    await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'Create', exact: true }).click();

    // Step 7: Card Created and Displayed
    // Modal closes automatically
    await expect(dialog).not.toBeVisible();

    // New cost card appears in the list
    await expect(page.getByText('Dinner at restaurant')).toBeVisible();
    await expect(page.getByText('Total: $120.50')).toBeVisible();
  });
});