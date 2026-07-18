import { Page, Locator } from '@playwright/test';
import { CartItemComponent } from '../components/CartItemComponent';

export class CartPage {
  readonly page: Page;

  readonly title: Locator;
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('title');
    this.cartList = page.getByTestId('cart-list');
    this.cartItems = page.getByTestId('inventory-item');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  cartItemByIndex(index: number): CartItemComponent {
    return new CartItemComponent(this.cartItems.nth(index));
  }
}
