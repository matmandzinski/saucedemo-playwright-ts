import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { HeaderComponent } from '../components/HeaderComponent';

test.describe('Products page tests', () => {
  test('shows all available products', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();

    await expect(productsPage.title).toBeVisible();
    await expect(productsPage.inventoryList).toBeVisible();
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('add multiple products to cart from products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(header.cartBadge).toBeHidden();
    await expect(productsPage.inventoryList).toBeVisible();

    const firstItem = productsPage.productCardByIndex(0);
    const secondItem = productsPage.productCardByIndex(1);

    await firstItem.addToCartButton.click();
    await expect(firstItem.addToCartButton).toBeHidden();
    await expect(firstItem.removeButton).toBeVisible();

    await expect(header.cartBadge).toBeVisible();
    await expect(header.cartBadge).toHaveText('1');

    await secondItem.addToCartButton.click();
    await expect(secondItem.addToCartButton).toBeHidden();
    await expect(secondItem.removeButton).toBeVisible();

    await expect(header.cartBadge).toHaveText('2');
  });

  test('remove previously added product from products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const header = new HeaderComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const item = productsPage.productCardByIndex(0);
    await item.addToCartButton.click();
    await expect(item.removeButton).toBeVisible();
    await expect(header.cartBadge).toHaveText('1');

    await item.removeButton.click();

    await expect(item.removeButton).toBeHidden();
    await expect(item.addToCartButton).toBeVisible();
    await expect(header.cartBadge).toBeHidden();
  });

  test('sort products by name Z to A', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();
    const productNamesBeforeSort = await productsPage.productsNames.allTextContents();
    const expectedNames = [...productNamesBeforeSort].sort().reverse();

    await expect(productsPage.sortDropdown).toBeVisible();
    await productsPage.sortDropdown.selectOption('za');

    await expect(productsPage.productsNames).toHaveText(expectedNames);
  });

  test('sort products by price lowest to highest', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const pricesBeforeSort = await productsPage.getProductPrices();
    const expectedPrices = [...pricesBeforeSort].sort((a, b) => a - b);

    await productsPage.sortDropdown.selectOption('lohi');

    const pricesAfterSort = await productsPage.getProductPrices();

    expect(pricesAfterSort).toEqual(expectedPrices);
  });

  test('sort products by price highest to lowest', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();

    const pricesBeforeSort = await productsPage.getProductPrices();
    const expectedPrices = [...pricesBeforeSort].sort((a, b) => b - a);

    await productsPage.sortDropdown.selectOption('hilo');

    const pricesAfterSort = await productsPage.getProductPrices();

    expect(pricesAfterSort).toEqual(expectedPrices);
  });
});
