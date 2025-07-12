import { test, expect } from '@playwright/test';

test.describe('Activity Date Selector', () => {
  test('displays date selector and allows date selection', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Check that date selector is present with placeholder text
    await expect(page.locator('text=Select activity date')).toBeVisible();
    await expect(page.locator('text=Please select an activity date.')).toBeVisible();

    // Click on date selector to open date picker
    await page.click('button:has-text("Select activity date")');

    // Verify date picker is visible
    await expect(page.locator('text=Activity Date *')).toBeVisible();
    await expect(page.locator('text=End Date (Optional)')).toBeVisible();

    // Fill in start date
    await page.fill('input[type="date"]#start-date', '2025-07-16');

    // Fill in end date
    await page.fill('input[type="date"]#end-date', '2025-07-18');

    // Save dates
    await page.click('button:has-text("Save")');

    // Verify dates are displayed in the correct format
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).toBeVisible();
    await expect(page.locator('text=Select activity date')).not.toBeVisible();
    await expect(page.locator('text=Please select an activity date.')).not.toBeVisible();

    // Refresh page to test persistence
    await page.reload();

    // Wait for page to load and verify dates persist
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).toBeVisible();
  });

  test('handles single date selection', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Click on date selector to open date picker
    await page.click('button:has-text("Select activity date")');

    // Fill in only start date
    await page.fill('input[type="date"]#start-date', '2025-07-16');

    // Save dates
    await page.click('button:has-text("Save")');

    // Verify only start date is displayed
    await expect(page.locator('text=2025-07-16')).toBeVisible();
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).not.toBeVisible();
  });

  test('validates date selection', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Click on date selector to open date picker
    await page.click('button:has-text("Select activity date")');

    // Try to save without selecting start date
    await page.click('button:has-text("Save")');

    // Verify error message is displayed
    await expect(page.locator('text=Please select an activity date.')).toBeVisible();

    // Fill in start date
    await page.fill('input[type="date"]#start-date', '2025-07-20');

    // Fill in end date that's before start date
    await page.fill('input[type="date"]#end-date', '2025-07-18');

    // Try to save
    await page.click('button:has-text("Save")');

    // Verify error message about end date
    await expect(page.locator('text=End date cannot be before the activity date.')).toBeVisible();
  });

  test('allows canceling date selection', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Click on date selector to open date picker
    await page.click('button:has-text("Select activity date")');

    // Fill in dates
    await page.fill('input[type="date"]#start-date', '2025-07-16');
    await page.fill('input[type="date"]#end-date', '2025-07-18');

    // Cancel
    await page.click('button:has-text("Cancel")');

    // Verify we're back to the original state
    await expect(page.locator('text=Select activity date')).toBeVisible();
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).not.toBeVisible();
  });

  test('date selector works with activity name editing', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // First, set activity name
    await page.click('text=Click to name this activity');
    await page.fill('input[placeholder="Enter activity name"]', 'Rock Climbing Trip');
    await page.click('button:has-text("Save")');

    // Now set dates
    await page.click('button:has-text("Select activity date")');
    await page.fill('input[type="date"]#start-date', '2025-07-16');
    await page.fill('input[type="date"]#end-date', '2025-07-18');
    await page.click('button:has-text("Save")');

    // Verify both name and dates are displayed
    await expect(page.locator('text=Rock Climbing Trip')).toBeVisible();
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).toBeVisible();

    // Edit name again to make sure date selector is still accessible
    await page.click('text=Rock Climbing Trip');
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();
    
    // Cancel name edit
    await page.keyboard.press('Escape');
    
    // Verify date selector is still visible and functional
    await expect(page.locator('text=2025-07-16 – 2025-07-18')).toBeVisible();
  });

  test('keyboard navigation works in date selector', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load
    await expect(page.locator('text=Create a new question')).toBeVisible();

    // Click on date selector to open date picker
    await page.click('button:has-text("Select activity date")');

    // Fill in start date
    await page.fill('input[type="date"]#start-date', '2025-07-16');

    // Press Enter to save
    await page.keyboard.press('Enter');

    // Verify date is saved
    await expect(page.locator('text=2025-07-16')).toBeVisible();
  });
});