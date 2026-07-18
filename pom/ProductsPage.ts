import { Page, Locator } from '@playwright/test';
import { ProductCardComponent } from '../components/ProductCardComponent';

export class ProductsPage {
  readonly page: Page;

  readonly title: Locator;
  readonly inventoryContainer: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly productsNames: Locator;
  readonly productsPrices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('title');
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.inventoryList = page.getByTestId('inventory-list');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productsNames = page.getByTestId('inventory-item-name');
    this.productsPrices = page.getByTestId('inventory-item-price');
  }

  async open() {
    await this.page.goto('/inventory.html');
  }

  async getProductPrices(): Promise<number[]> {
    const pricesText = await this.productsPrices.allTextContents();

    return pricesText.map((priceText) => Number(priceText.replace('$', '')));
  }

  productCardByIndex(index: number): ProductCardComponent {
    return new ProductCardComponent(this.inventoryItems.nth(index));
  }
}
