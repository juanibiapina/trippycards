import { test, expect } from '@playwright/test';

test.describe('Activity Overview Page', () => {
  test('direct link to activity page shows overview', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();
    await expect(page.locator('text=Click to name this activity')).toBeVisible();

    // Navigate to questions page to check it's available
    await page.getByRole('button', { name: 'Questions' }).click();
    await expect(page.locator('text=Create a new question')).toBeVisible();
  });

  test('activity name editing and persistence', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Verify placeholder text is shown when no name is set
    await expect(page.locator('text=Click to name this activity')).toBeVisible();

    // Click on placeholder to enter edit mode
    await page.click('text=Click to name this activity');

    // Verify edit mode is active (input field appears)
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();

    // Enter activity name
    const activityName = 'Rock Climbing Adventure';
    await page.fill('input[placeholder="Enter activity name"]', activityName);

    // Submit the name change
    await page.click('button:has-text("Save")');

    // Verify name is displayed
    await expect(page.locator(`text=${activityName}`)).toBeVisible();

    // Verify placeholder is no longer shown
    await expect(page.locator('text=Click to name this activity')).not.toBeVisible();

    // Reload page to test persistence
    await page.reload();

    // Wait for page to load and verify name persists
    await expect(page.locator(`text=${activityName}`)).toBeVisible();

    // Test changing existing name
    await page.click(`text=${activityName}`);
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();

    const newName = 'Mountain Hiking Trip';
    await page.fill('input[placeholder="Enter activity name"]', newName);
    await page.click('button:has-text("Save")');

    // Verify new name is displayed
    await expect(page.locator(`text=${newName}`)).toBeVisible();
    await expect(page.locator(`text=${activityName}`)).not.toBeVisible();
  });

  test('activity name editing cancel functionality', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Click on placeholder to enter edit mode
    await page.click('text=Click to name this activity');

    // Verify edit mode is active and both buttons are present
    await expect(page.locator('input[placeholder="Enter activity name"]')).toBeVisible();
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();

    // Enter activity name
    const activityName = 'Rock Climbing Adventure';
    await page.fill('input[placeholder="Enter activity name"]', activityName);

    // Click Cancel button
    await page.click('button:has-text("Cancel")');

    // Verify edit mode is closed and original placeholder is shown
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter activity name"]')).not.toBeVisible();

    // Test escape key functionality
    await page.click('text=Click to name this activity');
    await page.fill('input[placeholder="Enter activity name"]', activityName);
    await page.keyboard.press('Escape');

    // Verify edit mode is closed again
    await expect(page.locator('text=Click to name this activity')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter activity name"]')).not.toBeVisible();
  });

  test('activity date', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Step 1: Select start date
    const button = page.locator('button:has-text("Select date")');
    await button.click();

    // Find the hidden date input and set a start date
    const dateInput = page.locator('input[type="date"]').first();
    await dateInput.fill('2025-07-16');

    // Verify start date is displayed
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('text=Select activity date')).not.toBeVisible();

    // Step 2: Select end date
    // Click on the date dropdown to access options
    const dropdownButton = page.locator('button[aria-label="Date options"]');
    await dropdownButton.click();

    // Click "Set end date" option
    await page.click('text=Set end date');

    // Set the end date
    const endDateInput = page.locator('input[type="date"]').nth(1);
    await endDateInput.fill('2025-07-20');

    // Verify date range is displayed
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('text=Jul 20, 2025')).toBeVisible();

    // Step 3: Remove end date
    // Click on the date dropdown again
    await dropdownButton.click();

    // Click "Remove end date" option
    await page.click('text=Remove end date');

    // Verify only start date is displayed (end date removed)
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('text=Jul 20, 2025')).not.toBeVisible();

    // Test persistence after reload
    await page.reload();
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('text=Jul 20, 2025')).not.toBeVisible();
  });

  test('activity start time', async ({ page }) => {
    // Generate a random activity ID for this test
    const activityId = crypto.randomUUID();

    // Navigate to activity page directly
    await page.goto(`/activities/${activityId}`);

    // Wait for activity page to load (should redirect to overview)
    await expect(page.getByRole('heading', { name: 'Cards' })).toBeVisible();

    // Step 1: First set a start date
    const button = page.locator('button:has-text("Select date")');
    await button.click();

    // Set a start date
    const dateInput = page.locator('input[type="date"]').first();
    await dateInput.fill('2025-07-16');

    // Verify start date is displayed
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();

    // Step 2: Set start time
    // Click on the date dropdown to access time options
    const dropdownButton = page.locator('button[aria-label="Date options"]');
    await dropdownButton.click();

    // Click "Set start time" option
    await page.click('text=Set start time');

    // Wait for the time picker popup to appear
    await expect(page.locator('text=Set Start Time')).toBeVisible();

    // Find the time input in the popup and set the time
    const timeInput = page.locator('input[type="time"]');
    await timeInput.fill('14:30'); // 2:30 PM

    // Click Save button
    await page.click('text=Save');

    // Wait for popup to close
    await expect(page.locator('text=Set Start Time')).not.toBeVisible();

    // Wait a bit for state to update
    await page.waitForTimeout(1000);

    // Verify time is displayed alongside date (format depends on locale, but should show time)
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    // Look for the time display more specifically - should be in the date/time section
    await expect(page.locator('.group').locator('text=at')).toBeVisible(); // Should show "at [time]"
    await expect(page.locator('.group').locator('text=2:30')).toBeVisible(); // Should show formatted time

    // Step 3: Change the time
    // Click on the time dropdown again
    await dropdownButton.click();

    // Click "Change start time" option
    await page.click('text=Change start time');

    // Wait for the time picker popup to appear
    await expect(page.locator('text=Set Start Time')).toBeVisible();

    // Change the time
    await timeInput.fill('09:15'); // 9:15 AM

    // Click Save button
    await page.click('text=Save');

    // Verify updated time is displayed
    await expect(page.locator('text=9:15')).toBeVisible();

    // Step 4: Remove start time
    // Click on the dropdown again
    await dropdownButton.click();

    // Click "Remove start time" option
    await page.click('text=Remove start time');

    // Verify time is removed but date remains
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('.group').locator('text=at')).not.toBeVisible();
    await expect(page.locator('.group').locator('text=9:15')).not.toBeVisible();

    // Test persistence after setting time again
    await dropdownButton.click();
    await page.click('text=Set start time');

    // Wait for the time picker popup to appear
    await expect(page.locator('text=Set Start Time')).toBeVisible();

    await timeInput.fill('16:00'); // 4:00 PM

    // Click Save button
    await page.click('text=Save');

    // Verify time is displayed
    await expect(page.locator('text=4:00')).toBeVisible();

    // Reload page to test persistence
    await page.reload();
    await expect(page.locator('text=Jul 16, 2025')).toBeVisible();
    await expect(page.locator('text=4:00')).toBeVisible();
  });
});