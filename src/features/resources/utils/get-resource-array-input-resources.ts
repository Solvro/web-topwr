import type {
  ArrayInputField,
  ArrayInputOptions,
} from "@/features/abstract-resource-form/types";

import type { Resource } from "../enums";
import { getResourceMetadata } from "./get-resource-metadata";

export const getResourceArrayInputResources = <R extends Resource>(
  resource: R,
) =>
  (getResourceMetadata(resource).form.inputs.arrayInputs ?? {}) as Record<
    ArrayInputField<R>,
    ArrayInputOptions
  >;
