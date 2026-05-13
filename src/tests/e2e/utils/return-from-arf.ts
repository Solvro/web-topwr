import type { Page } from "@playwright/test";

import { GrammaticalCase, declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";

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
