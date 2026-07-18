import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pom/LoginPage';
import { ProductsPage } from '../../pom/ProductsPage';
import { CartPage } from '../../pom/CartPage';
import { CheckoutStepOnePage } from '../../pom/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pom/CheckoutStepTwoPage';
import { CheckoutCompletedPage } from '../../pom/CheckoutCompletePage';
import { HeaderComponent } from '../../components/HeaderComponent';

test('@smoke standard user can complete an order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletedPage = new CheckoutCompletedPage(page);
  const header = new HeaderComponent(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL('/inventory.html');

  const product = productsPage.productCardByIndex(0);
  const productData = await product.getData();

  await product.addToCartButton.click();
  await expect(header.cartBadge).toHaveText('1');

  await header.cartLink.click();
  await expect(page).toHaveURL('/cart.html');

  const cartItem = cartPage.cartItemByIndex(0);
  await expect(cartItem.name).toHaveText(productData.name);

  await cartPage.checkoutButton.click();

  await checkoutStepOnePage.fillCustomerInformation({
    firstName: 'Jan',
    lastName: 'Tester',
    postalCode: '22-100',
  });

  await checkoutStepOnePage.continueButton.click();

  const checkoutItem = checkoutStepTwoPage.checkoutItemByIndex(0);

  await expect(checkoutItem.name).toHaveText(productData.name);
  await expect(checkoutItem.price).toHaveText(productData.price);

  await checkoutStepTwoPage.finishButton.click();

  await expect(page).toHaveURL('/checkout-complete.html');
  await expect(checkoutCompletedPage.completeHeader).toHaveText('Thank you for your order!');

  await expect(header.cartBadge).toBeHidden();
});
