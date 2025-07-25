// flow: docs/flows/delete-card.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Delete Card Flow', () => {
  test('delete card', async ({ page, request }) => {
    // --- Setup: Create an activity with a card via HTTP API ---
    const activityId = randomUUID();
    const testCard = {
      id: 'card-' + randomUUID(),
      type: 'link',
      title: 'Test Card to Delete',
      url: 'https://example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const resp = await request.post(`/parties/activitydo/${activityId}`, {
      data: {
        type: 'card-create',
        card: testCard,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(resp.ok()).toBeTruthy();

    // Step 1: Navigate to Activity Page
    await page.goto(`/activities/${activityId}`);
    // Verify the Cards section displays with existing cards
    await expect(page.getByRole('button', { name: /create card/i })).toBeVisible();
    await expect(page.getByText('Test Card to Delete')).toBeVisible();

    // Step 2: Access Card Actions
    // User locates the card they want to delete and clicks on the card context menu (three dots)
    const cardContextMenuButton = page.locator('[data-testid="card-context-menu"]').first();
    await cardContextMenuButton.click();

    // Context menu appears with available card actions
    await expect(page.getByRole('menuitem', { name: /delete/i })).toBeVisible();

    // Step 3: Select Delete Option
    // User clicks on the "Delete" option from the context menu
    await page.getByRole('menuitem', { name: /delete/i }).click();

    // Delete confirmation dialog appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /delete/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();

    // Step 4: Confirm Deletion
    // Delete confirmation dialog displays warning message about permanent removal
    await expect(page.getByText(/permanent/i)).toBeVisible();

    // Test alternative: User clicks "Cancel" to abort the deletion
    await page.getByRole('button', { name: /cancel/i }).click();

    // Dialog should close and card should still be visible
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Test Card to Delete')).toBeVisible();

    // Re-open the context menu and delete dialog to test actual deletion
    await cardContextMenuButton.click();
    await page.getByRole('menuitem', { name: /delete/i }).click();

    // User clicks "Delete" button to confirm the action
    await page.getByRole('button', { name: /delete/i }).click();

    // Step 5: Process Deletion
    // Card is removed from the activity immediately upon confirmation
    await expect(page.getByText('Test Card to Delete')).not.toBeVisible();

    // Delete confirmation dialog closes
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // UI updates to reflect the card's removal from the cards list
    // Verify the card is no longer in the DOM
    await expect(page.locator('[data-testid="card"]').filter({ hasText: 'Test Card to Delete' })).toHaveCount(0);

    // Verify other UI elements are still functional (Create Card button should still be visible)
    await expect(page.getByRole('button', { name: /create card/i })).toBeVisible();
  });
});