import { SortDirection } from "../enums";

export const SORT_DIRECTION_NAMES = {
  [SortDirection.Ascending]: "rosnącej",
  [SortDirection.Descending]: "malejącej",
} satisfies Record<SortDirection, string>;
