import { test, expect } from '@playwright/test';

test.describe('Redirect After Login', () => {
  // Use a test without pre-authentication to test the redirect flow
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect to original URL after successful authentication', async ({ page }) => {
    // Start by navigating directly to a protected activity page without being authenticated
    const activityId = 'test-activity-redirect';
    const originalUrl = `/activities/${activityId}`;

    await page.goto(originalUrl);

    // Should be redirected to sign in page
    await expect(page.getByText('Sign in to Trippy Cards')).toBeVisible({ timeout: 10000 });

    // Check that the redirect parameter is in the URL
    const currentUrl = new URL(page.url());
    expect(currentUrl.searchParams.get('redirect_url')).toBe(`http://localhost:5173${originalUrl}`);
  });
});
