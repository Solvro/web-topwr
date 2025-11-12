import { SortDirection } from "../enums";

export const isValidSortDirection = (value: unknown): value is SortDirection =>
  value === SortDirection.Ascending || value === SortDirection.Descending;
