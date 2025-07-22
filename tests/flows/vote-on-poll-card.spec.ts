// flow: docs/flows/vote-on-poll-card.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Poll Card Voting', () => {
  test('vote on poll card', async ({ page, request }) => {
    // --- Setup: Create a poll card via HTTP API ---
    const activityId = randomUUID();
    const pollQuestion = 'What is your favorite color?';
    const pollOptions = ['Red', 'Blue', 'Green'];
    const pollCard = {
      id: 'card-' + randomUUID(),
      type: 'poll',
      question: pollQuestion,
      options: pollOptions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const resp = await request.post(`/parties/activitydo/${activityId}`, {
      data: {
        type: 'card-create',
        card: pollCard,
      },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(resp.ok()).toBeTruthy();

    // Step 1: Navigate to Activity Page
    await page.goto(`/activities/${activityId}`);
    await expect(page.getByRole('button', { name: /create card/i })).toBeVisible();

    // Step 2: Locate Poll Card
    await expect(page.getByText(pollQuestion)).toBeVisible();
    for (const option of pollOptions) {
      await expect(page.getByText(option)).toBeVisible();
    }

    // Step 3: Vote
    // Click the first poll option
    const firstOption = await page.locator('[data-testid="poll-option-0"]');
    await firstOption.click();
    // Expect the selected option to have the correct classes for selection
    await expect(firstOption).toHaveClass(/bg-gray-700/);
    await expect(firstOption).toHaveClass(/text-white/);
    await expect(firstOption).toHaveClass(/border-gray-700/);

    // Step 4: Vote Submission
    // Expect the vote count to appear and update immediately (e.g., '1 vote')
    await expect(firstOption.locator('span').nth(1)).toHaveText(/1 vote/);

    // Step 5: Change Vote
    // Click the second poll option
    const secondOption = await page.locator('[data-testid="poll-option-1"]');
    await secondOption.click();
    // Expect the second option to be highlighted
    await expect(secondOption).toHaveClass(/bg-gray-700/);
    await expect(secondOption).toHaveClass(/text-white/);
    await expect(secondOption).toHaveClass(/border-gray-700/);
    // Expect the vote count to update: '0 votes' for Red, '1 vote' for Blue
    await expect(firstOption.locator('span').nth(1)).toHaveText(/0 votes/);
    await expect(secondOption.locator('span').nth(1)).toHaveText(/1 vote/);

    // Step 6: View Results
    // Check that the user's avatar appears on the second option (Blue) since that's where they voted
    const secondOptionAvatars = secondOption.locator('[title]').filter({ hasText: '' });
    await expect(secondOptionAvatars).toHaveCount(1);

    // Check that no avatar appears on the first option (Red) since the user moved their vote
    const firstOptionAvatars = firstOption.locator('[title]').filter({ hasText: '' });
    await expect(firstOptionAvatars).toHaveCount(0);
  });
});
