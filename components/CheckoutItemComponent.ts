import { Locator } from '@playwright/test';
import type { ProductData } from '../models/ProductData';

export class CheckoutItemComponent {
  readonly root: Locator;

  readonly quantity: Locator;
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;

  constructor(root: Locator) {
    this.root = root;

    this.quantity = root.getByTestId('item-quantity');
    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.price = root.getByTestId('inventory-item-price');
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
