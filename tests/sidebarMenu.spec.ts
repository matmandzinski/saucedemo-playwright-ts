import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { CartPage } from '../pom/CartPage';
import { LoginPage } from '../pom/LoginPage';
import { HeaderComponent } from '../components/HeaderComponent';
import { SidebarMenuComponent } from '../components/SidebarMenuComponent';

test.describe('Application sidebar menu tests', () => {
  let productsPage: ProductsPage;
  let header: HeaderComponent;
  let sidebarMenu: SidebarMenuComponent;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    header = new HeaderComponent(page);
    sidebarMenu = new SidebarMenuComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();
  });

  test('user can log out from sidebar menu', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await header.menuButton.click();
    await expect(sidebarMenu.logoutLink).toBeVisible();

    await sidebarMenu.logoutLink.click();

    await expect(page).toHaveURL('/');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('reset app state removes all products from cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    const firstProduct = productsPage.productCardByIndex(0);
    const secondProduct = productsPage.productCardByIndex(1);

    await firstProduct.addToCartButton.click();
    await secondProduct.addToCartButton.click();

    await expect(header.cartBadge).toHaveText('2');

    await header.menuButton.click();
    await sidebarMenu.resetAppStateLink.click();
    await sidebarMenu.closeButton.click();

    await expect(header.cartBadge).toBeHidden();

    await header.cartLink.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test.fail(
    'reset app state restores Add to cart button on products page',
    {
      tag: '@known-issue',
      annotation: {
        type: 'issue',
        description: 'https://github.com/matmandzinski/saucedemo-playwright-ts/issues/1',
      },
    },
    async () => {
      const product = productsPage.productCardByIndex(0);

      await product.addToCartButton.click();
      await expect(header.cartBadge).toHaveText('1');
      await expect(product.removeButton).toBeVisible();

      await header.menuButton.click();
      await sidebarMenu.resetAppStateLink.click();
      await sidebarMenu.closeButton.click();

      await expect(header.cartBadge).toBeHidden();
      await expect(product.addToCartButton).toBeVisible();
    }
  );
});
