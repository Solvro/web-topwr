import { UNFILTERABLE_INPUT_TYPES } from "@/config/constants";
import { FilterType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import {
  fetchResources,
  getResourceMetadata,
  parseFilterSearchParameters,
  parseSortParameter,
  typedEntries,
  typedFromEntries,
} from "@/lib/helpers";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { RoutableResource } from "@/types/app";
import type { FilterOptions } from "@/types/components";
import type { FormInputBase, SelectInputOptions } from "@/types/forms";
import type { ValueOf } from "@/types/helpers";
import type { ResourceDeclinableField } from "@/types/polish";

import { BackToHomeButton } from "../back-to-home-button";
import { CreateButton } from "../create-button";
import { InfiniteScroller } from "./infinite-scroller";
import { SortFiltersPopover } from "./sort-filters/sort-filters-popover";

const getResourceFieldFilterOptions = (
  resource: Resource,
  logMissingFields = false,
): FilterOptions => {
  const metadata = getResourceMetadata(resource);
  const { relationInputs, ...inputs } = metadata.form.inputs;
  const inputEntries = typedEntries(inputs).flatMap(([inputType, input]) => {
    if (input == null || UNFILTERABLE_INPUT_TYPES.has(inputType)) {
      return [];
    }
    const type =
      inputType === "selectInputs" ? FilterType.Select : FilterType.Text;
    return typedEntries(
      input as Record<
        string,
        FormInputBase | (FormInputBase & SelectInputOptions)
      >,
    ).map(
      ([key, value]) =>
        [
          key,
          {
            type,
            ...value,
          },
        ] as [string, ValueOf<FilterOptions>],
    );
  });
  const simpleInputs = typedFromEntries<FilterOptions>(inputEntries);
  if (logMissingFields) {
    const schema = RESOURCE_SCHEMAS[resource];
    for (const field in schema.shape) {
      if (!(field in simpleInputs)) {
        console.warn("Missing label for filter field", { resource, field });
      }
    }
  }
  // TODO: handle relation inputs
  return simpleInputs;
};

export async function AbstractResourceList<T extends RoutableResource>({
  resource,
  searchParams,
  sortableFields = [],
}: {
  resource: T;
  sortableFields?: ResourceDeclinableField<T>[];
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const page = 1;
  const searchParameters = await searchParams;

  const filterOptions = getResourceFieldFilterOptions(resource);
  const firstPageData = await fetchResources(
    resource,
    page,
    searchParameters,
    filterOptions,
  );

  const initialSortFilters = {
    ...parseSortParameter(searchParameters.sort, sortableFields),
    filters: parseFilterSearchParameters(searchParameters, filterOptions),
  };

  return (
    <div className="flex h-full flex-col">
      <SortFiltersPopover
        sortableFields={sortableFields}
        filterableFields={filterOptions}
        defaultValues={initialSortFilters}
      />
      <div className="w-full grow basis-0 overflow-y-auto pr-2">
        <InfiniteScroller
          resource={resource}
          initialData={firstPageData}
          searchParameters={await searchParams}
        />
      </div>
      <div className="mt-4 flex w-full flex-col items-center gap-2 sm:flex-row-reverse sm:justify-between">
        <CreateButton resource={resource} />
        <BackToHomeButton />
      </div>
    </div>
  );
}
