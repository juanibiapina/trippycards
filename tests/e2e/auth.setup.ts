import { test as setup, expect } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // In test mode, navigate to the app which should automatically provide
  // a mock session via the /api/auth/session endpoint
  await page.goto('/');

  // Wait for the SessionProvider to load the session and the app to render
  // We'll wait for either the sign-in button (if auth failed) or the trip content (if auth succeeded)
  try {
    // Wait for the h1 element to appear, which means the app loaded with authentication
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  } catch {
    // If h1 doesn't appear, check if there's a sign in button (auth failed)
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible({ timeout: 5000 });
    throw new Error('Authentication failed - sign in button is visible');
  }

  // Save the current browser state as authenticated
  await page.context().storageState({ path: authFile });
});