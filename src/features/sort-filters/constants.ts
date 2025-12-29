import type { FormInputName } from "@/features/abstract-resource-form/types";

export const UNFILTERABLE_INPUT_TYPES = new Set<FormInputName>(["imageInputs"]);

/** The delimiter used to separate sort direction and sort by field. */
export const SORT_DIRECTION_SEPARATOR = ".";
