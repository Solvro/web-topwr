import { Badge } from "@/components/ui/badge";
import type { SortFiltersFormValues } from "@/types/forms";

export function AppliedFiltersCount({
  sortFilters: { filters = [] },
}: {
  sortFilters: Partial<SortFiltersFormValues>;
}) {
  if (filters.length === 0) {
    return null;
  }
  return (
    <Badge
      size="counter"
      className="absolute -top-2.5 left-full -ml-2.5"
      aria-label={`Liczba zastosowanych filtrów: ${String(filters.length)}`}
    >
      {filters.length}
    </Badge>
  );
}
