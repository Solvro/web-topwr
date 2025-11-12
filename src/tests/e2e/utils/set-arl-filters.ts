import type { Page } from "@playwright/test";

import {
  SORT_DIRECTION_NAMES,
  SORT_FILTER_DEFAULT_VALUES,
  SORT_FILTER_LABEL_DECLENSION_CASES,
  getResourceFilterDefinitions,
  serializeSortFilters,
} from "@/features/abstract-resource-collection/node";
import type {
  FilteredField,
  SortFiltersFormValuesNarrowed,
} from "@/features/abstract-resource-collection/types";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import type { ResourceSchemaKey } from "@/types/forms";

import { selectOptionByLabel } from "./select-option-by-label";

export async function setArlSortFilters<T extends Resource>(
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
      await page.getByLabel(`Wartość pola #${fieldNumber}`).fill(value);
    }
  }
  await page.getByRole("button", { name: /zatwierdź/i }).click();
  await page.waitForURL(
    `/*?${serializeSortFilters({ sortBy, sortDirection, filters })}`,
  );
}
