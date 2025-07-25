import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

export async function login(page: Page) {
  await page.goto("/login");
  expect(TEST_USER_EMAIL).toBeDefined();
  expect(TEST_USER_PASSWORD).toBeDefined();
  await page.fill('input[name="email"]', TEST_USER_EMAIL ?? "");
  await page.fill('input[name="password"]', TEST_USER_PASSWORD ?? "");
  await page.click('button[type="submit"]');
}

/** Since shadcn's <Select> element combined with react-hook-form creates a weird element structure,
 *  we can't use the label text to select the <select> element directly. */
export async function selectOptionByLabel(
  page: Page,
  label: string | RegExp,
  value: string,
) {
  const selectTrigger = page.getByLabel(label);
  await selectTrigger.click();
  await selectTrigger
    .locator("xpath=following-sibling::select")
    .selectOption(value);
  await expect(selectTrigger).toHaveText(value);
}
