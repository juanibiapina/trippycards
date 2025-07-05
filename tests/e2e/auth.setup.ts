import { test as setup } from '@playwright/test';

const authFile = 'tests/e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // In test mode, navigate to the app which should automatically provide
  // a mock session via the /api/auth/session endpoint
  await page.goto('/');

  // The SessionProvider should automatically fetch from /api/auth/session
  // and get our mock session data in test mode, so we just need to wait
  // for the app to be ready

  // Save the current browser state as authenticated
  await page.context().storageState({ path: authFile });
});