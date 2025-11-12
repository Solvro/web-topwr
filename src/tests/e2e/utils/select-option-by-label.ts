import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/** Since shadcn's <Select> element combined with react-hook-form creates a weird element structure,
 *  we can't use the label text to select the <select> element directly. */
export async function selectOptionByLabel(
  page: Page,
  label: string | RegExp,
  optionLabel: string,
) {
  const selectTrigger = page.getByRole("combobox", { name: label });
  await selectTrigger.click();
  await page.getByRole("option", { name: optionLabel, exact: true }).click();
  await expect(selectTrigger).toHaveText(optionLabel);
}
