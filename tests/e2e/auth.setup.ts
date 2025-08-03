import { clerk, clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'

const authFile = 'playwright/.clerk/user.json';

// Configure Playwright with Clerk
setup('authenticate', async ({ page }) => {
  await clerkSetup()

  // Perform authentication steps.
  // This example uses a Clerk helper to authenticate
  await page.goto('/')
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: process.env.E2E_CLERK_USER_USERNAME!,
      password: process.env.E2E_CLERK_USER_PASSWORD!,
    },
  })
  // Ensure the user has successfully accessed the protected page
  // by checking an element on the page that only the authenticated user can access
  await page.waitForSelector("button:has-text('New Activity')");

  // Save the authentication state to a file
  await page.context().storageState({ path: authFile });
});
