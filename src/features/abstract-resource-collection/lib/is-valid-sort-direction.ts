import { SortDirection } from "../data/sort-direction";

export const isValidSortDirection = (value: unknown): value is SortDirection =>
  value === SortDirection.Ascending || value === SortDirection.Descending;
