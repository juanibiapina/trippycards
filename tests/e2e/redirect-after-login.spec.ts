import { test, expect } from '@playwright/test';

test.describe('Redirect After Login', () => {
  // Use a test without pre-authentication to test the redirect flow
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect to original URL after successful authentication', async ({ page }) => {
    // Start by navigating directly to a protected activity page without being authenticated
    const activityId = 'test-activity-redirect';
    const originalUrl = `/activities/${activityId}`;

    await page.goto(originalUrl);

    // Should be redirected to home page with redirect parameter
    await expect(page.getByText('Sign In with Google')).toBeVisible();

    // Check that the redirect parameter is in the URL (URL params are automatically decoded)
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/');
    expect(currentUrl.searchParams.get('redirect')).toBe(originalUrl);

    // Simulate authentication using the test endpoint
    await page.evaluate(async () => {
      const response = await fetch('/api/auth/test-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    });

    // Reload the page to pick up the new session state
    await page.reload();

    // Wait for authentication to be processed and redirect to happen
    await page.waitForURL(originalUrl, { timeout: 5000 });

    // Should now be on the original activity page
    expect(page.url()).toContain(originalUrl);

    // Should see activity page content (activity header)
    await expect(page.getByText('Cards')).toBeVisible();
  });
});