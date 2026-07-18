import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { CartPage } from '../pom/CartPage';
import { CheckoutStepOnePage } from '../pom/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pom/CheckoutStepTwoPage';
import { CheckoutCompletedPage } from '../pom/CheckoutCompletePage';
import { HeaderComponent } from '../components/HeaderComponent';

test.describe('Checkout complete tests', () => {
  let productsPage: ProductsPage;
  let checkoutCompletedPage: CheckoutCompletedPage;
  let header: HeaderComponent;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    header = new HeaderComponent(page);

    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    checkoutCompletedPage = new CheckoutCompletedPage(page);

    await productsPage.open();

    const product = productsPage.productCardByIndex(0);

    await product.addToCartButton.click();
    await expect(header.cartBadge).toHaveText('1');

    await header.cartLink.click();
    await expect(cartPage.title).toBeVisible();

    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutStepOnePage.title).toBeVisible();

    await checkoutStepOnePage.fillCustomerInformation({
      firstName: 'Jan',
      lastName: 'Tester',
      postalCode: '22-100',
    });
    await checkoutStepOnePage.continueButton.click();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(checkoutStepTwoPage.title).toBeVisible();

    await checkoutStepTwoPage.finishButton.click();
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutCompletedPage.title).toBeVisible();
  });

  test('checkout complete page displays order confirmation', async () => {
    await expect(checkoutCompletedPage.completeHeader).toHaveText('Thank you for your order!');

    await expect(checkoutCompletedPage.completeText).toBeVisible();
    await expect(checkoutCompletedPage.completeImage).toBeVisible();
    await expect(checkoutCompletedPage.backHomeButton).toBeVisible();

    await expect(header.cartBadge).toBeHidden();
  });

  test('user can download order document', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');

    await checkoutCompletedPage.generatePdfOrderButton.click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBeTruthy();
  });

  test('back home redirects to products page', async ({ page }) => {
    await checkoutCompletedPage.backHomeButton.click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(productsPage.inventoryList).toBeVisible();
    await expect(header.cartBadge).toBeHidden();
  });
});
