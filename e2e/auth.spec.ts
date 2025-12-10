/**
 * Authentication E2E Tests
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText(/Login/i);
  });

  test('should display signup page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.locator('h1')).toContainText(/Sign Up/i);
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=/required/i')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });

  test('should navigate to signup from login', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=/Sign Up/i');
    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to login from signup', async ({ page }) => {
    await page.goto('/signup');
    await page.click('text=/Login/i');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Signup Flow', () => {
  test('should display role selection', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.locator('text=/Client/i')).toBeVisible();
    await expect(page.locator('text=/Owner/i')).toBeVisible();
    await expect(page.locator('text=/Agent/i')).toBeVisible();
  });

  test('should validate password requirements', async ({ page }) => {
    await page.goto('/signup');
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    await page.click('button[type="submit"]');
    
    // Should show password requirements error
    await expect(page.locator('text=/password/i')).toBeVisible();
  });
});
