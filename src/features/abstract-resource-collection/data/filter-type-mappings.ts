import type { FormInputName } from "@/types/forms";

import { FilterType } from "../enums";

export const FILTER_TYPE_MAPPINGS: Partial<Record<FormInputName, FilterType>> =
  {
    selectInputs: FilterType.Select,
    checkboxInputs: FilterType.Checkbox,
    relationInputs: FilterType.Relation,
  };
