import { test, expect } from '@playwright/test';

test.describe('Card Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Create New Activity').click();
    await page.waitForURL(/\/activity\/[^/]+/);

    // Click on Overview in the bottom navigation
    await page.getByRole('button', { name: 'Overview' }).click();
    await page.waitForURL(/\/activity\/[^/]+\/overview/);
  });

  test('should display card creation interface', async ({ page }) => {
    await expect(page.getByText('Cards')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Card' })).toBeVisible();
    await expect(page.getByText('No cards yet')).toBeVisible();
    await expect(page.getByText('Create your first card to get started')).toBeVisible();
  });

  test('should open card creation modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Card' }).click();

    await expect(page.getByText('Create Link Card')).toBeVisible();
    await expect(page.getByLabel('URL *')).toBeVisible();
    await expect(page.getByLabel('Title (optional)')).toBeVisible();
    await expect(page.getByLabel('Description (optional)')).toBeVisible();
    await expect(page.getByLabel('Image URL (optional)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Card' })).toBeVisible();
  });

  test('should close modal when cancel is clicked', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Card' }).click();
    await expect(page.getByText('Create Link Card')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Create Link Card')).not.toBeVisible();
  });

  test('should create a link card with required fields only', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Card' }).click();

    const urlInput = page.getByLabel('URL *');
    await urlInput.fill('https://example.com');

    await page.getByRole('button', { name: 'Create Card' }).click();

    // Modal should close
    await expect(page.getByText('Create Link Card')).not.toBeVisible();

    // Card should appear in the list
    await expect(page.getByText('https://example.com')).toBeVisible();
    await expect(page.getByText('No cards yet')).not.toBeVisible();
  });

  test('should create a link card with all fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Card' }).click();

    await page.getByLabel('URL *').fill('https://example.com');
    await page.getByLabel('Title (optional)').fill('Test Title');
    await page.getByLabel('Description (optional)').fill('Test Description');
    await page.getByLabel('Image URL (optional)').fill('https://example.com/image.jpg');

    await page.getByRole('button', { name: 'Create Card' }).click();

    // Modal should close
    await expect(page.getByText('Create Link Card')).not.toBeVisible();

    // Card should appear in the list with all content
    await expect(page.getByText('Test Title')).toBeVisible();
    await expect(page.getByText('Test Description')).toBeVisible();
    await expect(page.getByText('https://example.com')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Test Title' })).toBeVisible();
  });
});