import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { CartPage } from '../pom/CartPage';
import { CheckoutStepOnePage } from '../pom/CheckoutStepOnePage';
import { HeaderComponent } from '../components/HeaderComponent';

test.describe('Checkout step one tests', () => {
  let checkoutStepOnePage: CheckoutStepOnePage;
  let cartPage: CartPage;
  let header: HeaderComponent;

  test.beforeEach(async ({ page }) => {
    const productsPage = new ProductsPage(page);

    header = new HeaderComponent(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);

    await productsPage.open();

    const product = productsPage.productCardByIndex(0);

    await product.addToCartButton.click();
    await expect(header.cartBadge).toHaveText('1');

    await header.cartLink.click();
    await expect(cartPage.title).toBeVisible();

    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutStepOnePage.title).toBeVisible();
  });

  test('continue with valid checkout information', async ({ page }) => {
    await expect(header.cartBadge).toHaveText('1');
    await checkoutStepOnePage.fillCustomerInformation({
      firstName: 'Jan',
      lastName: 'Tester',
      postalCode: '22-100',
    });

    await checkoutStepOnePage.continueButton.click();

    await expect(page).toHaveURL('/checkout-step-two.html');
  });

  test('shows error when first name is missing', async () => {
    await checkoutStepOnePage.continueButton.click();

    await expect(checkoutStepOnePage.errorMessage).toContainText('First Name is required');
  });

  test('shows error when last name is missing', async () => {
    await checkoutStepOnePage.firstNameInput.fill('Jan');
    await checkoutStepOnePage.continueButton.click();

    await expect(checkoutStepOnePage.errorMessage).toContainText('Last Name is required');
  });

  test('shows error when postal code is missing', async () => {
    await checkoutStepOnePage.firstNameInput.fill('Jan');
    await checkoutStepOnePage.lastNameInput.fill('Tester');
    await checkoutStepOnePage.continueButton.click();

    await expect(checkoutStepOnePage.errorMessage).toContainText('Postal Code is required');
  });

  test('cancel redirects to cart', async ({ page }) => {
    await checkoutStepOnePage.cancelButton.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.title).toBeVisible();
  });
});
