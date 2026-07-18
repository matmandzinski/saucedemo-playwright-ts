import { Locator } from '@playwright/test';
import type { ProductData } from '../models/ProductData';

export class ProductCardComponent {
  readonly root: Locator;

  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly image: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;

  constructor(root: Locator) {
    this.root = root;

    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
    this.image = root.locator('img.inventory_item_img');
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' });
    this.removeButton = root.getByRole('button', { name: 'Remove' });
  }

  async getData(): Promise<ProductData> {
    const [name, description, price] = await Promise.all([
      this.name.innerText(),
      this.description.innerText(),
      this.price.innerText(),
    ]);

    return { name, description, price };
  }
}
