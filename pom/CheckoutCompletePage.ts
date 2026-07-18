import { Page, Locator } from '@playwright/test';

export class CheckoutCompletedPage {
  readonly page: Page;

  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;
  readonly backHomeButton: Locator;
  readonly generatePdfOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('title');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
    this.completeImage = page.getByTestId('pony-express');
    this.backHomeButton = page.getByTestId('back-to-products');
    this.generatePdfOrderButton = page.getByTestId('generate-pdf-order');
  }
}
