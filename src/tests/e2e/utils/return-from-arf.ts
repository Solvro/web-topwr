import type { Page } from "@playwright/test";

import { GrammaticalCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { declineNoun } from "@/lib/polish";

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
