import type { z } from "zod";

import type { DeclinableNoun } from "@/features/polish/types";
import type { Resource } from "@/features/resources";
import type {
  FormInputBase,
  ResourceSchemaKey,
  SelectInputOptions,
} from "@/types/forms";

import type { FilterType } from "../enums";
import type { FilteredFieldSchema } from "../schemas/filtered-field-schema";
import type { SortFiltersSchema } from "../schemas/sort-filters-schema";

export type FilteredField = z.infer<typeof FilteredFieldSchema>;
export type SortFiltersFormValues = z.infer<typeof SortFiltersSchema>;

export type SortFiltersFormValuesNarrowed = SortFiltersFormValues & {
  sortBy: DeclinableNoun | null | undefined;
};

/** The definitions of all filterable fields for a given resource. */
export type FilterDefinitions<T extends Resource = Resource> = Record<
  [T] extends [Resource] ? string : ResourceSchemaKey<T>,
  FormInputBase &
    (
      | (SelectInputOptions & {
          type: FilterType.Select;
        })
      | {
          type: FilterType.Text | FilterType.Checkbox;
        }
    )
>;
