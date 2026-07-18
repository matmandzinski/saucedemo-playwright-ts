import { Page, Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;

  // locators
  readonly primaryHeader: Locator;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.primaryHeader = page.getByTestId('primary-header');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }
}
