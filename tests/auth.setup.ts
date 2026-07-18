import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pom/LoginPage';

const authFile = 'playwright/.auth/standardUser.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('/inventory.html');

  await page.context().storageState({ path: authFile });
});
