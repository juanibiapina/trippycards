// flow: docs/flows/vote-on-poll-card.md

import { test, expect } from '@playwright/test';
import { randomUUID } from 'crypto';

test.describe('Poll Card Voting', () => {
  test('vote on poll card', async ({ page, request }) => {
    // --- Setup: Create an activity and a poll card via HTTP API ---
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
    await expect(page.getByRole('heading', { name: 'Cards', level: 2 })).toBeVisible();

    // Step 2: Locate Poll Cards
    await expect(page.getByText(pollQuestion)).toBeVisible();
    for (const option of pollOptions) {
      await expect(page.getByText(option)).toBeVisible();
    }

    // Step 3: Select Poll Option
    // Click the first poll option
    const firstOption = page.getByText(pollOptions[0]);
    await firstOption.click();
    // Expect the selected option to be highlighted (e.g., have a selected class)
    await expect(firstOption).toHaveClass(/selected/);

    // Step 4: Vote Submission and Immediate Update
    // Expect the vote count to appear and update immediately (e.g., 'Red (1)')
    await expect(page.getByText(/Red \(1\)/)).toBeVisible();

    // Step 5: Change Vote (Optional)
    // Click the second poll option
    const secondOption = page.getByText(pollOptions[1]);
    await secondOption.click();
    // Expect the second option to be highlighted
    await expect(secondOption).toHaveClass(/selected/);
    // Expect the vote count to update: 'Red (0)', 'Blue (1)'
    await expect(page.getByText(/Red \(0\)/)).toBeVisible();
    await expect(page.getByText(/Blue \(1\)/)).toBeVisible();
  });
});
