/**
 * Property E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Property Listing', () => {
  test('should display property search page', async ({ page }) => {
    await page.goto('/search');
    
    await expect(page.locator('h1')).toContainText(/Search Properties/i);
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should display filter options', async ({ page }) => {
    await page.goto('/search');
    
    // Check for filter elements
    await expect(page.locator('text=/City/i')).toBeVisible();
    await expect(page.locator('text=/Property Type/i')).toBeVisible();
    await expect(page.locator('text=/Price Range/i')).toBeVisible();
  });

  test('should navigate to property details', async ({ page }) => {
    await page.goto('/properties');
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 5000 });
    
    // Click first property
    await page.click('[data-testid="property-card"]:first-child');
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/.*properties\/[a-zA-Z0-9]+/);
  });
});

test.describe('Property Details', () => {
  test('should display property information', async ({ page }) => {
    // This would need a test property ID
    await page.goto('/properties/test-property-id');
    
    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=/₹/i')).toBeVisible();
    await expect(page.locator('text=/BHK/i')).toBeVisible();
  });

  test('should show contact owner button', async ({ page }) => {
    await page.goto('/properties/test-property-id');
    
    await expect(page.locator('button:has-text("Contact Owner")')).toBeVisible();
  });

  test('should show schedule visit button', async ({ page }) => {
    await page.goto('/properties/test-property-id');
    
    await expect(page.locator('button:has-text("Schedule Visit")')).toBeVisible();
  });
});

test.describe('Property Creation', () => {
  test('should require authentication for property creation', async ({ page }) => {
    await page.goto('/properties/create');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});
