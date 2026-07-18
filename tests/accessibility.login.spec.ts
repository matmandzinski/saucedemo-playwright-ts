import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';
import { scanAccessibility } from './support/accessibility';

test.describe('Login accessibility tests', () => {
  test('login page has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'login-page-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });

  test('login validation error matches the documented accessibility baseline', async ({
    page,
  }, testInfo) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'login-error-accessibility-scan'
    );

    // SauceDemo's error close button has no accessible name.
    expect(violationFingerprints).toEqual([
      {
        rule: 'button-name',
        targets: [['button']],
      },
    ]);
  });
});
