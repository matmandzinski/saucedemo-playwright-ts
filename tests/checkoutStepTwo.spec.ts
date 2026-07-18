import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { CartPage } from '../pom/CartPage';
import { CheckoutStepOnePage } from '../pom/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pom/CheckoutStepTwoPage';
import { HeaderComponent } from '../components/HeaderComponent';
import type { ProductData } from '../models/ProductData';
import { parsePrice, formatPrice, roundPrice } from '../utils/priceUtils';

test.describe('Checkout step two tests', () => {
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let productsPage: ProductsPage;
  let header: HeaderComponent;

  let firstProduct: ProductData;
  let secondProduct: ProductData;

  test.beforeEach(async ({ page }) => {
    const cartPage = new CartPage(page);

    header = new HeaderComponent(page);
    productsPage = new ProductsPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);

    await productsPage.open();

    await productsPage.productCardByIndex(0).addToCartButton.click();
    await productsPage.productCardByIndex(1).addToCartButton.click();
    await expect(header.cartBadge).toHaveText('2');

    await header.cartLink.click();
    await expect(cartPage.title).toBeVisible();

    const firstCartItem = cartPage.cartItemByIndex(0);
    const secondCartItem = cartPage.cartItemByIndex(1);

    firstProduct = await firstCartItem.getData();
    secondProduct = await secondCartItem.getData();

    await cartPage.checkoutButton.click();

    await expect(checkoutStepOnePage.title).toBeVisible();

    await checkoutStepOnePage.fillCustomerInformation({
      firstName: 'Jan',
      lastName: 'Tester',
      postalCode: '22-100',
    });
    await checkoutStepOnePage.continueButton.click();

    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(checkoutStepTwoPage.title).toBeVisible();
  });

  test('checkout overview shows products from cart', async () => {
    const expectedProducts = [firstProduct, secondProduct];

    await expect(header.cartBadge).toHaveText('2');
    await expect(checkoutStepTwoPage.cartItems).toHaveCount(2);

    for (let index = 0; index < expectedProducts.length; index++) {
      const expectedProduct = expectedProducts[index];
      const checkoutItem = checkoutStepTwoPage.checkoutItemByIndex(index);

      await expect(checkoutItem.quantity).toHaveText('1');
      await expect(checkoutItem.name).toHaveText(expectedProduct.name);
      await expect(checkoutItem.description).toHaveText(expectedProduct.description);
      await expect(checkoutItem.price).toHaveText(expectedProduct.price);
    }
  });

  test('checkout overview displays payment and shipping information', async () => {
    // SauceDemo uses static payment and shipping information, so exact values are verified.
    await expect(checkoutStepTwoPage.paymentInformation).toHaveText('SauceCard #31337');

    await expect(checkoutStepTwoPage.shippingInformation).toHaveText('Free Pony Express Delivery!');
  });

  test('cancel redirects to products page', async ({ page }) => {
    await checkoutStepTwoPage.cancelButton.click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(productsPage.inventoryList).toBeVisible();
  });

  test('finish redirects to checkout completed page', async ({ page }) => {
    await checkoutStepTwoPage.finishButton.click();

    await expect(page).toHaveURL('/checkout-complete.html');
  });

  test('checkout overview calculates price summary correctly', async () => {
    const firstProductPrice = parsePrice(firstProduct.price);
    const secondProductPrice = parsePrice(secondProduct.price);

    const expectedSubtotal = firstProductPrice + secondProductPrice;
    const expectedTax = roundPrice(expectedSubtotal * 0.08);
    const expectedTotal = roundPrice(expectedSubtotal + expectedTax);

    await expect(checkoutStepTwoPage.summarySubtotal).toHaveText(
      `Item total: $${formatPrice(expectedSubtotal)}`
    );

    await expect(checkoutStepTwoPage.summaryTax).toHaveText(`Tax: $${formatPrice(expectedTax)}`);

    await expect(checkoutStepTwoPage.summaryTotal).toHaveText(
      `Total: $${formatPrice(expectedTotal)}`
    );
  });
});
