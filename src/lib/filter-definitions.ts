import {
  FILTER_TYPE_MAPPINGS,
  UNFILTERABLE_INPUT_TYPES,
} from "@/config/constants";
import { FilterType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { RESOURCE_SCHEMAS } from "@/schemas";
import type { FilterDefinitions } from "@/types/components";
import type { FormInputBase, SelectInputOptions } from "@/types/forms";
import type { ValueOf } from "@/types/helpers";

import { getResourceMetadata, typedEntries, typedFromEntries } from "./helpers";

/** Obtains the filter definitions for a specific resource. */
export const getResourceFilterDefinitions = async (
  resource: Resource,
  logMissingFields = false,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<FilterDefinitions> => {
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
        ] as [string, ValueOf<FilterDefinitions>],
    );
  });
  const simpleInputs = typedFromEntries<FilterDefinitions>(inputEntries);
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
