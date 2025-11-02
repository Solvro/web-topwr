import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import assert from "node:assert/strict";

import {
  SORT_DIRECTION_NAMES,
  SORT_FILTER_DEFAULT_VALUES,
  SORT_FILTER_LABEL_DECLENSION_CASES,
} from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { env } from "@/config/env";
import { getResourceFilterDefinitions } from "@/lib/filter-definitions";
import { getSearchParametersFromSortFilters, quoteText } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type {
  FilteredField,
  ResourceSchemaKey,
  SortFiltersFormValuesNarrowed,
} from "@/types/forms";

interface Credentials {
  email: string;
  password: string;
}

export function getTestUserCredentials(): Credentials {
  const email = env.TEST_USER_EMAIL;
  const password = env.TEST_USER_PASSWORD;
  assert.ok(email != null, "TEST_USER_EMAIL must be set in env variables");
  assert.ok(
    password != null,
    "TEST_USER_PASSWORD must be set in env variables",
  );
  return { email, password };
}

export async function login(page: Page, { email, password }: Credentials) {
  await page.goto("/login");

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/hasło/i).fill(password);
  await page.getByRole("button", { name: /zaloguj się/i }).click();
}

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

export async function setAbstractResourceListFilters<T extends Resource>(
  page: Page,
  resource: T,
  {
    sortBy,
    sortDirection = SORT_FILTER_DEFAULT_VALUES.sortDirection,
    filters = [],
  }: Partial<
    SortFiltersFormValuesNarrowed & {
      filters: (FilteredField & { field: ResourceSchemaKey<T> })[];
    }
  >,
) {
  await page.getByRole("button", { name: /pokaż filtry/i }).click();
  if (sortBy != null) {
    await selectOptionByLabel(
      page,
      /sortuj według/i,
      declineNoun(sortBy, {
        case: SORT_FILTER_LABEL_DECLENSION_CASES.sortBy,
      }),
    );
    await selectOptionByLabel(
      page,
      /w kolejności/i,
      SORT_DIRECTION_NAMES[sortDirection],
    );
  }

  if (filters.length > 0) {
    const filterDefinitions = await getResourceFilterDefinitions({ resource });
    for (const [index, { field, value }] of Object.entries(filters)) {
      if (!(field in filterDefinitions)) {
        throw new Error(
          `Field '${field}' is not filterable for resource '${resource}'.`,
        );
      }
      const filterDefinition = filterDefinitions[field];
      const fieldNumber = String(Number(index) + 1);
      await page.getByRole("button", { name: /dodaj filtr/i }).click();
      await selectOptionByLabel(
        page,
        `Pole #${fieldNumber}`,
        filterDefinition.label,
      );
      await page.getByLabel(`Wartość pola ${quoteText(field)}`).fill(value);
    }
  }
  await page.getByRole("button", { name: /zatwierdź/i }).click();
  await page.waitForURL(
    `/*?${getSearchParametersFromSortFilters({ sortBy, sortDirection, filters })}`,
  );
}

export async function expectAbstractResourceFormSuccess(page: Page, count = 1) {
  const successMessages = page.getByText(/pomyślnie zapisano/i);
  await expect(successMessages).toHaveCount(count);
  for (let index = 0; index < count; index++) {
    await expect(successMessages.nth(index)).toBeVisible();
  }
}

export async function returnFromAbstractResourceForm(
  page: Page,
  resource: Resource,
) {
  await page
    .getByRole("link", {
      name: new RegExp(
        `wróć do ${declineNoun(resource, { case: DeclensionCase.Genitive, plural: true })}`,
        "i",
      ),
    })
    .click();
  await page.waitForURL(`/${resource}`);
}
