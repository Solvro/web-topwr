import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Playwright test helper that asserts the presence of success messages
 * indicating a successful abstract resource form submission.
 */
export async function expectArfSuccess(page: Page, count = 1) {
  const successMessages = page.getByText(/pomyślnie zapisano/i);
  await expect(successMessages).toHaveCount(count);
  for (let index = 0; index < count; index++) {
    await expect(successMessages.nth(index)).toBeVisible();
  }
}
