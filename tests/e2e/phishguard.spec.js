import { test, expect } from '@playwright/test';

test.describe('PhishGuard AI - End-to-End System Test Suite', () => {
  const timestamp = Date.now();
  const testUser = {
    name: 'E2E Cyber Lead',
    email: `e2e_analyst_${timestamp}@phishguard.test`,
    password: 'SecurePassword2026!',
  };

  test('1. Landing page loads with branding, features, and quick tester', async ({ page }) => {
    await page.goto('/');

    // Check title and branding
    await expect(page).toHaveTitle(/PhishGuard AI/i);
    await expect(page.locator('text=PhishGuard').first()).toBeVisible();
    await expect(page.locator('text=Intelligent Defense Against')).toBeVisible();

    // Check 15 Heuristic Checks section
    await expect(page.locator('text=15 Heuristic Security Checks')).toBeVisible();

    // Check Call-to-Action button
    const ctaButton = page.locator('text=Start Scanning').first();
    await expect(ctaButton).toBeVisible();
  });

  test('2. Complete Analyst Registration and Dashboard entry', async ({ page }) => {
    await page.goto('/register');

    // Fill registration form
    await page.fill('input[type="text"]', testUser.name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);

    await page.click('button[type="submit"]');

    // Should navigate to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('text=PhishGuard SOC Command Center')).toBeVisible();

    // Verify user display in sidebar
    await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
  });

  test('3. URL Phishing Detection Engine execution & results report', async ({ page }) => {
    // Log in
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate to URL Scanner
    await page.locator('a[href="/dashboard/scan-url"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/scan-url/);

    // Submit a known suspicious phishing test fixture
    await page.fill('input[placeholder*="https://example.com/login"]', 'https://paypal.com.account-update.xyz/login');
    await page.click('button[type="submit"]');

    // Verify navigation to Scan Result Page
    await expect(page).toHaveURL(/\/dashboard\/scan\//);
    await expect(page.locator('text=Security Intelligence Report')).toBeVisible();

    // Verify Risk Score & Indicators
    await expect(page.locator('text=Brand Impersonation Detected')).toBeVisible();
    await expect(page.locator('text=Security Recommendations & Mitigation Steps')).toBeVisible();

    // Check Export JSON button presence
    await expect(page.locator('text=Export JSON')).toBeVisible();
  });

  test('4. Email Phishing & Social Engineering Analyzer execution', async ({ page }) => {
    // Log in
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Navigate to Email Analyzer
    await page.locator('a[href="/dashboard/analyze-email"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/analyze-email/);

    // Load sample phishing template
    await page.click('text=Credential Harvesting & Threat');

    // Submit analysis
    await page.click('button[type="submit"]');

    // Verify navigation to results
    await expect(page).toHaveURL(/\/dashboard\/scan\//);
    await expect(page.locator('text=Security Intelligence Report')).toBeVisible();
    await expect(page.locator('text=Email Content Evaluation')).toBeVisible();
  });

  test('5. Scan Audit History, Filter, and Pagination', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Navigate to history
    await page.locator('a[href="/dashboard/history"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/history/);

    // Verify previous scans appear
    await expect(page.locator('text=paypal.com.account-update.xyz')).toBeVisible();

    // Test filter tabs
    await page.click('button:has-text("url")');
    await expect(page.locator('text=paypal.com.account-update.xyz')).toBeVisible();
  });

  test('6. Threat Intelligence feeds and live lookup tool', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=PhishGuard SOC Command Center')).toBeVisible();

    // Navigate to Threat Intel
    await page.locator('a[href="/dashboard/threat-intel"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/threat-intel/);

    await expect(page.locator('text=PhishGuard Heuristic Core')).toBeVisible();
    await expect(page.locator('text=Google Safe Browsing v4')).toBeVisible();
  });

  test('7. Profile settings and Analyst Logout', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page.locator('text=PhishGuard SOC Command Center')).toBeVisible();

    // Navigate to profile
    await page.locator('a[href="/dashboard/profile"]').first().click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);

    // Test Sign Out
    const logoutBtn = page.locator('button[title="Sign Out"]').first();
    await logoutBtn.click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('8. Mobile viewport responsive layout and drawer menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check brand on mobile
    await expect(page.locator('text=PhishGuard').first()).toBeVisible();

    // Open mobile menu
    const menuBtn = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Check mobile drawer menu option
    const mobileLink = page.locator('.md\\:hidden a[href="#detection-engine"]');
    await expect(mobileLink).toBeVisible();
  });
});
