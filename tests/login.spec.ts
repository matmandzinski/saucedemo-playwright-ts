import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';

test.describe('Login tests', () => {
  test('standard user can log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('/inventory.html');
  });

  test('shows username required error when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('', 'password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('shows password required error when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('username', '');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Password is required');
  });

  test('shows invalid credentials error when credentials are incorrect', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('wrong_username', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('shows username required error when submitting empty login form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('shows locked out error when locked out user tries to log in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});

test.describe('Authentication guard', () => {
  const protectedRoutes = ['/inventory.html', '/cart.html', '/checkout-step-one.html'];

  for (const route of protectedRoutes) {
    test(`redirects unauthenticated user from ${route} to login`, async ({ page }) => {
      await page.goto(route);

      const loginPage = new LoginPage(page);
      await expect(page).toHaveURL('/');
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText(
        `You can only access '${route}' when you are logged in.`
      );
    });
  }
});
