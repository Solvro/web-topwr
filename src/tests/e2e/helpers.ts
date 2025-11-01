import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import assert from "node:assert/strict";

import type { IMPLICIT_SORT_BY_ATTRIBUTES } from "@/config/constants";
import {
  SORT_DIRECTIONS,
  SORT_FILTER_LABEL_DECLENSION_CASES,
} from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { env } from "@/config/env";
import { encodeQueryParameters } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import { SortFiltersSchema } from "@/schemas";
import type { SortFiltersFormValues } from "@/types/forms";

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
  await expect(page).not.toHaveURL("/login");
}

export async function logout(page: Page) {
  await expect(page).not.toHaveURL("/login");
  await page.getByRole("button", { name: /wyloguj się/i }).click();
  await expect(page).toHaveURL("/login");
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

type ImplicitSortByAttribute = (typeof IMPLICIT_SORT_BY_ATTRIBUTES)[number];
type SortKeys = "sortBy" | "sortDirection";
type FilterKeys = "searchField" | "searchTerm";
type Sort = Pick<SortFiltersFormValues, SortKeys> & {
  sortBy: ImplicitSortByAttribute;
};
type Filter = Pick<SortFiltersFormValues, FilterKeys> & {
  searchFieldLabel: string;
};
type SortOrFilter = Sort | Filter | (Sort & Filter);

const defaultSortFilters = SortFiltersSchema.parse({});

export async function setAbstractResourceListFilters(
  page: Page,
  options: SortOrFilter,
): Promise<void>;
export async function setAbstractResourceListFilters(
  page: Page,
  {
    sortBy,
    sortDirection = defaultSortFilters.sortDirection,
    searchField,
    searchTerm,
    searchFieldLabel,
  }: Partial<Sort & Filter>,
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
      SORT_DIRECTIONS[sortDirection],
    );
  }

  if (searchField != null && searchTerm != null && searchFieldLabel != null) {
    await selectOptionByLabel(page, /szukaj w/i, searchFieldLabel);
    await page.getByLabel(/wyrażenia/i).fill(searchTerm);
  }
  await page.getByRole("button", { name: /zatwierdź/i }).click();
  await page.waitForURL(
    `/*?${encodeQueryParameters({ sortBy, sortDirection, searchField, searchTerm })}`,
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
