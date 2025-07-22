// flow: docs/flows/create-card-poll.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Poll Card Creation', () => {
  test('create poll card', async ({ page }) => {
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
    await dialog.getByRole('button', { name: 'Poll' }).click();
    // Step 4: Fill Poll Information
    await dialog.getByLabel('Poll Question').fill('What is your favorite color?');
    await dialog.getByLabel('Option 1').fill('Red');
    await dialog.getByLabel('Option 2').fill('Blue');
    // Step 5: Submit
    await expect(dialog.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
    await dialog.getByRole('button', { name: 'Create', exact: true }).click();

    // Step 6: Card Created and Displayed
    // Modal closes automatically
    await expect(dialog).not.toBeVisible();
    // New Poll card appears in the cards list
    await expect(page.getByText('What is your favorite color?')).toBeVisible();
    await expect(page.getByText('Red')).toBeVisible();
    await expect(page.getByText('Blue')).toBeVisible();
  });
});
