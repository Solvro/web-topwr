import type { Page } from "@playwright/test";

import type { Resource } from "@/config/enums";
import { GrammaticalCase, declineNoun } from "@/features/polish";

export async function returnFromArf(page: Page, resource: Resource) {
  await page
    .getByRole("link", {
      name: new RegExp(
        `wróć do ${declineNoun(resource, { case: GrammaticalCase.Genitive, plural: true })}`,
        "i",
      ),
    })
    .click();
  await page.waitForURL(`/${resource}`);
}
