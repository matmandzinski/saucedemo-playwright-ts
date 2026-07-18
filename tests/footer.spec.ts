import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pom/ProductsPage';
import { FooterComponent } from '../components/FooterComponent';

test.describe('Footer tests', () => {
  let footer: FooterComponent;

  test.beforeEach(async ({ page }) => {
    const productsPage = new ProductsPage(page);
    footer = new FooterComponent(page);

    await productsPage.open();
    await expect(productsPage.inventoryList).toBeVisible();
  });

  test('displays social media links and copyright information', async () => {
    await expect(footer.footer).toBeVisible();
    await expect(footer.twitterLink).toBeVisible();
    await expect(footer.facebookLink).toBeVisible();
    await expect(footer.linkedInLink).toBeVisible();

    await expect(footer.copyright).toContainText('Sauce Labs');
    await expect(footer.copyright).toContainText('All Rights Reserved');
  });

  test('social media links point to correct external pages', async () => {
    const socialLinks = [
      {
        locator: footer.twitterLink,
        expectedUrl: 'https://twitter.com/saucelabs',
      },
      {
        locator: footer.facebookLink,
        expectedUrl: 'https://www.facebook.com/saucelabs',
      },
      {
        locator: footer.linkedInLink,
        expectedUrl: 'https://www.linkedin.com/company/sauce-labs/',
      },
    ];

    for (const { locator, expectedUrl } of socialLinks) {
      await expect(locator).toHaveAttribute('href', expectedUrl);
      await expect(locator).toHaveAttribute('target', '_blank');
    }
  });
});
