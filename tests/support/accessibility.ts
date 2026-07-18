import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

export async function scanAccessibility(page: Page, testInfo: TestInfo, attachmentName: string) {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  await testInfo.attach(attachmentName, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  return results.violations.map(({ id, nodes }) => ({
    rule: id,
    targets: nodes.map(({ target }) => target),
  }));
}
