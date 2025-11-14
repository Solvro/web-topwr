import type { FormInputName } from "@/features/abstract-resource-form/types";

export const UNFILTERABLE_INPUT_TYPES = new Set<FormInputName>(["imageInputs"]);

/** The delimiter used to separate sort direction and sort by field. */
export const SORT_DIRECTION_SEPARATOR = ".";

export const LIST_RESULTS_PER_PAGE = 10;

export const WEEKDAY_ABBREVIATIONS = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

export const CALENDAR_MAX_EVENTS_PER_DAY = 5;
