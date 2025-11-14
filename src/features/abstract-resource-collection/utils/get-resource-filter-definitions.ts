import type {
  FormInputBase,
  SelectInputOptions,
} from "@/features/abstract-resource-form/types";
import type { Resource } from "@/features/resources";
import {
  RESOURCE_SCHEMAS,
  getResourceMetadata,
} from "@/features/resources/node";
import type { ResourceSchemaKey } from "@/features/resources/types";
import type { ValueOf } from "@/types/helpers";
import { typedEntries, typedFromEntries } from "@/utils";

import { UNFILTERABLE_INPUT_TYPES } from "../constants";
import { FILTER_TYPE_MAPPINGS } from "../data/filter-type-mappings";
import { FilterType } from "../enums";
import type { FilterDefinitions } from "../types/sort-filters";

/** Obtains the filter definitions for a specific resource. */
export const getResourceFilterDefinitions = async <T extends Resource>(
  {
    resource,
    logMissingFields = false,
    includeRelations = false,
  }: {
    resource: T;
    logMissingFields?: boolean;
    includeRelations?: boolean;
  },
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<FilterDefinitions<T>> => {
  const metadata = getResourceMetadata(resource);
  const { relationInputs, ...inputs } = metadata.form.inputs;
  const inputEntries = typedEntries(inputs).flatMap(([inputType, input]) => {
    if (input == null || UNFILTERABLE_INPUT_TYPES.has(inputType)) {
      return [];
    }
    const type = FILTER_TYPE_MAPPINGS[inputType] ?? FilterType.Text;
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
        ] as [ResourceSchemaKey<T>, ValueOf<FilterDefinitions<T>>],
    );
  });
  const simpleInputs = typedFromEntries<FilterDefinitions<T>>(inputEntries);
  if (logMissingFields) {
    const schema = RESOURCE_SCHEMAS[resource];
    for (const field in schema.shape) {
      if (!(field in simpleInputs)) {
        console.warn("Missing label for filter field", { resource, field });
      }
    }
  }
  if (includeRelations) {
    // TODO: handle relation inputs
  }
  return simpleInputs;
};
