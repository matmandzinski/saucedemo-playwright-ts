import { Locator } from '@playwright/test';
import type { ProductData } from '../models/ProductData';

export class CartItemComponent {
  readonly root: Locator;

  readonly name: Locator;
  readonly description: Locator;
  readonly quantity: Locator;
  readonly price: Locator;
  readonly removeButton: Locator;

  constructor(root: Locator) {
    this.root = root;

    this.name = root.getByTestId('inventory-item-name');
    this.description = root.getByTestId('inventory-item-desc');
    this.quantity = root.getByTestId('item-quantity');
    this.price = root.getByTestId('inventory-item-price');
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
