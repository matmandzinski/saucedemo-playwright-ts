import type { Locator, Page } from '@playwright/test';

export class FooterComponent {
  readonly footer: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedInLink: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.footer = page.getByTestId('footer');
    this.twitterLink = page.getByTestId('social-twitter');
    this.facebookLink = page.getByTestId('social-facebook');
    this.linkedInLink = page.getByTestId('social-linkedin');
    this.copyright = page.getByTestId('footer-copy');
  }
}
