import { Page, Locator } from '@playwright/test';
import { CheckoutItemComponent } from '../components/CheckoutItemComponent';

export class CheckoutStepTwoPage {
  readonly page: Page;

  readonly title: Locator;
  readonly cartItems: Locator;
  readonly paymentInformation: Locator;
  readonly shippingInformation: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.title = page.getByTestId('title');
    this.cartItems = page.getByTestId('inventory-item');
    this.paymentInformation = page.getByTestId('payment-info-value');
    this.shippingInformation = page.getByTestId('shipping-info-value');
    this.summarySubtotal = page.getByTestId('subtotal-label');
    this.summaryTax = page.getByTestId('tax-label');
    this.summaryTotal = page.getByTestId('total-label');
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
  }

  checkoutItemByIndex(index: number) {
    return new CheckoutItemComponent(this.cartItems.nth(index));
  }
}
