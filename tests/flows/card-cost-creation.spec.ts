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

    // Wait a moment for the user to be automatically added to the activity
    await page.waitForTimeout(1000);

    // Check if there are users available for selection and select them
    const payersSection = dialog.locator('label:has-text("Payers")').locator('..').locator('div').last();
    const noUsersText = payersSection.locator('text=No users in activity yet');

    // If there are users, select them; otherwise just try to submit (which should fail)
    const hasUsers = await noUsersText.count() === 0;
    if (hasUsers) {
      // Select the first user as payer and participant
      const firstPayerCheckbox = payersSection.locator('input[type="checkbox"]').first();
      await firstPayerCheckbox.check();

      const participantsSection = dialog.locator('label:has-text("Participants")').locator('..').locator('div').last();
      const firstParticipantCheckbox = participantsSection.locator('input[type="checkbox"]').first();
      await firstParticipantCheckbox.check();
    }

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