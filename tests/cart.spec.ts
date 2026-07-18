import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartPage } from '../pom/CartPage';

test.describe('Cart page tests', () => {
  test('open cart from header', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    await header.cartLink.click();

    await expect(page).toHaveURL('/cart.html');
    await expect(cartPage.title).toBeVisible();
  });

  test('cart shows products added from products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const firstProduct = productsPage.productCardByIndex(0);
    const secondProduct = productsPage.productCardByIndex(1);

    const firstProductData = await firstProduct.getData();
    const secondProductData = await secondProduct.getData();

    await firstProduct.addToCartButton.click();
    await secondProduct.addToCartButton.click();

    await expect(header.cartBadge).toHaveText('2');
    await header.cartLink.click();

    await expect(cartPage.title).toBeVisible();
    await expect(cartPage.cartItems).toHaveCount(2);

    const firstCartItem = cartPage.cartItemByIndex(0);
    const secondCartItem = cartPage.cartItemByIndex(1);

    await expect(firstCartItem.name).toHaveText(firstProductData.name);
    await expect(firstCartItem.description).toHaveText(firstProductData.description);
    await expect(firstCartItem.price).toHaveText(firstProductData.price);

    await expect(secondCartItem.name).toHaveText(secondProductData.name);
    await expect(secondCartItem.description).toHaveText(secondProductData.description);
    await expect(secondCartItem.price).toHaveText(secondProductData.price);
  });

  test('remove multiple products from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const firstProduct = productsPage.productCardByIndex(0);
    const secondProduct = productsPage.productCardByIndex(1);
    await firstProduct.addToCartButton.click();
    await secondProduct.addToCartButton.click();

    await expect(header.cartBadge).toHaveText('2');

    await header.cartLink.click();

    await expect(cartPage.title).toBeVisible();
    await expect(cartPage.cartItems).toHaveCount(2);

    const firstCartItem = cartPage.cartItemByIndex(0);
    await firstCartItem.removeButton.click();

    await expect(header.cartBadge).toHaveText('1');
    await expect(cartPage.cartItems).toHaveCount(1);

    const remainingCartItem = cartPage.cartItemByIndex(0);
    await remainingCartItem.removeButton.click();

    await expect(header.cartBadge).toBeHidden();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('continue shopping from cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    await header.cartLink.click();

    await expect(cartPage.title).toBeVisible();
    await expect(page).toHaveURL('/cart.html');

    await cartPage.continueShoppingButton.click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(productsPage.inventoryList).toBeVisible();
  });
});
