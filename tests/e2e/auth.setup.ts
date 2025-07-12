import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to the home page first to ensure cookies work
  await page.goto('/');

  // Use page.evaluate to make the POST request from within the page context
  // This ensures cookies are set properly
  const response = await page.evaluate(async () => {
    const res = await fetch('/api/auth/test-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  });

  expect(response.success).toBe(true);
  expect(response.user.email).toBe('test@example.com');

  // Reload the page to pick up the session
  await page.reload();

  // Wait for the authenticated page to load
  await expect(page.getByText('New Activity')).toBeVisible();

  // Save signed-in state to 'authFile'
  await page.context().storageState({ path: authFile });
});