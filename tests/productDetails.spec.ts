import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { ProductDetails } from '../pom/ProductDetailsPage';
import { HeaderComponent } from '../components/HeaderComponent';

test.describe('product details page tests', () => {
  test('open product details by clicking product name', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();
    const productCard = productsPage.productCardByIndex(0);
    const productName = await productCard.name.innerText();
    await productCard.name.click();

    await expect(page).toHaveURL(/.*inventory-item\.html\?id=.*/);
    await expect(productDetailsPage.name).toHaveText(productName);
    await expect(productDetailsPage.backToProductsButton).toBeVisible();
  });

  test('open product details by clicking product image', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();
    const productCard = await productsPage.productCardByIndex(0);
    const productName = await productCard.name.innerText();
    await productCard.image.click();

    await expect(page).toHaveURL(/.*inventory-item\.html\?id=.*/);
    await expect(productDetailsPage.name).toHaveText(productName);
    await expect(productDetailsPage.backToProductsButton).toBeVisible();
  });

  test('go back to product list from product details', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const productCard = await productsPage.productCardByIndex(0);
    await productCard.name.click();

    await expect(productDetailsPage.backToProductsButton).toBeVisible();

    await productDetailsPage.backToProductsButton.click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(productsPage.inventoryList).toBeVisible();
    await expect(productsPage.title).toBeVisible();
  });

  test('product details show selected product information', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const productCard = productsPage.productCardByIndex(0);
    const productData = await productCard.getData();

    await productCard.name.click();

    await expect(productDetailsPage.name).toHaveText(productData.name);
    await expect(productDetailsPage.description).toHaveText(productData.description);
    await expect(productDetailsPage.price).toHaveText(productData.price);
    await expect(productDetailsPage.image).toBeVisible();
  });

  test('add product to cart from product details page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const productCard = productsPage.productCardByIndex(0);

    await productCard.name.click();

    await expect(header.cartBadge).toBeHidden();

    await productDetailsPage.addToCartButton.click();

    await expect(productDetailsPage.removeButton).toBeVisible();
    await expect(productDetailsPage.addToCartButton).toBeHidden();
    await expect(header.cartBadge).toHaveText('1');
  });

  test('remove product from cart from product details page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const productDetailsPage = new ProductDetails(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const productCard = productsPage.productCardByIndex(0);

    await productCard.name.click();

    await productDetailsPage.addToCartButton.click();
    await expect(productDetailsPage.removeButton).toBeVisible();
    await expect(header.cartBadge).toHaveText('1');

    await productDetailsPage.removeButton.click();

    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await expect(productDetailsPage.removeButton).toBeHidden();
    await expect(header.cartBadge).toBeHidden();
  });
});
