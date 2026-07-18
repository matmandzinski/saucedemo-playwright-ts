import { test, expect } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartPage } from '../pom/CartPage';
import { CheckoutStepOnePage } from '../pom/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pom/CheckoutStepTwoPage';
import { CheckoutCompletedPage } from '../pom/CheckoutCompletePage';
import { ProductDetails } from '../pom/ProductDetailsPage';
import { ProductsPage } from '../pom/ProductsPage';
import { scanAccessibility } from './support/accessibility';
import { SidebarMenuComponent } from '../components/SidebarMenuComponent';

test.describe('Catalog accessibility tests', () => {
  test('products page matches the documented accessibility baseline', async ({
    page,
  }, testInfo) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'products-page-accessibility-scan'
    );

    // SauceDemo's product sort select has no accessible name.
    expect(violationFingerprints).toEqual([
      {
        rule: 'select-name',
        targets: [['select']],
      },
    ]);
  });

  test('product details page has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);

    await productsPage.open();
    await productsPage.productCardByIndex(0).name.click();

    await expect(page).toHaveURL(/inventory-item\.html\?id=/);
    await expect(productDetailsPage.name).toBeVisible();

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'product-details-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });
});

test.describe('Cart accessibility tests', () => {
  test('cart with product has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await productsPage.productCardByIndex(0).addToCartButton.click();
    await header.cartLink.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.cartItems).toHaveCount(1);

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'cart-with-product-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });
});

test.describe('Checkout accessibility tests', () => {
  let checkoutStepOnePage: CheckoutStepOnePage;

  test.beforeEach(async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    checkoutStepOnePage = new CheckoutStepOnePage(page);

    await productsPage.open();
    await productsPage.productCardByIndex(0).addToCartButton.click();
    await header.cartLink.click();

    await expect(cartPage.cartItems).toHaveCount(1);

    await cartPage.checkoutButton.click();

    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(checkoutStepOnePage.title).toBeVisible();
  });

  test('checkout step one page has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'checkout-step-one-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });

  test('checkout validation error matches the documented accessibility baseline', async ({
    page,
  }, testInfo) => {
    await checkoutStepOnePage.continueButton.click();

    await expect(checkoutStepOnePage.errorMessage).toContainText('First Name is required');

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'checkout-validation-error-accessibility-scan'
    );

    // SauceDemo's error close button has no accessible name.
    expect(violationFingerprints).toEqual([
      {
        rule: 'button-name',
        targets: [['.error-button']],
      },
    ]);
  });

  test('checkout step two page has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await checkoutStepOnePage.fillCustomerInformation({
      firstName: 'Jan',
      lastName: 'Tester',
      postalCode: '22-100',
    });
    await checkoutStepOnePage.continueButton.click();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(checkoutStepTwoPage.cartItems).toHaveCount(1);

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'checkout-step-two-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });

  test('checkout completed page has no automatically detectable WCAG A or AA violations', async ({
    page,
  }, testInfo) => {
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompleted = new CheckoutCompletedPage(page);

    await checkoutStepOnePage.fillCustomerInformation({
      firstName: 'Jan',
      lastName: 'Tester',
      postalCode: '22-100',
    });
    await checkoutStepOnePage.continueButton.click();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(checkoutStepTwoPage.cartItems).toHaveCount(1);
    await checkoutStepTwoPage.finishButton.click();

    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(checkoutCompleted.completeHeader).toBeVisible();

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'checkout-completed-accessibility-scan'
    );

    expect(violationFingerprints).toEqual([]);
  });
});

test.describe('Sidebar accessibility tests', () => {
  test('opened sidebar matches the documented accessibility baseline', async ({
    page,
  }, testInfo) => {
    const productsPage = new ProductsPage(page);
    const header = new HeaderComponent(page);
    const sidebar = new SidebarMenuComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    await header.menuButton.click();

    await expect(sidebar.closeButton).toBeVisible();
    await expect(sidebar.logoutLink).toBeVisible();

    const violationFingerprints = await scanAccessibility(
      page,
      testInfo,
      'opened-sidebar-accessibility-scan'
    );

    // The products page still contains the known unnamed sort select.
    expect(violationFingerprints).toEqual([
      {
        rule: 'select-name',
        targets: [['select']],
      },
    ]);
  });
});
