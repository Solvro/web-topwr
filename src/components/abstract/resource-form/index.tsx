import type { ReactNode } from "react";
import { get } from "react-hook-form";
import type { DefaultValues } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type { ResourceDataType } from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export function AbstractResourceForm<T extends Resource>({
  resource,
  defaultValues,
}: {
  resource: T;
  defaultValues?: DefaultValues<ResourceDataType<T> | null>;
}) {
  const existingImages: ExistingImages<T> = {};
  const metadata = RESOURCE_METADATA[resource];
  const nonNullDefaultValues = defaultValues ?? metadata.form.defaultValues;

  // Transform date strings to Date objects for time inputs
  const transformedDefaultValues = { ...nonNullDefaultValues };
  const timeInputs = metadata.form.inputs.timeInputs ?? [];

  for (const input of timeInputs) {
    const value = get(transformedDefaultValues, input.name) as unknown;
    if (typeof value === "string") {
      // Handle timezone-aware date conversion
      // If the string contains timezone info (Z or +/-), use it directly
      // Otherwise, treat it as local time to avoid unexpected timezone shifts
      const dateValue =
        value.includes("Z") ||
        value.includes("+") ||
        value.lastIndexOf("-") > 10
          ? new Date(value) // String has timezone info, use as-is but be aware of potential shifts
          : new Date(value); // No timezone info, treat as local time

      if (!Number.isNaN(dateValue.getTime())) {
        // Update the transformed values with the Date object
        const typedTransformedValues = transformedDefaultValues as Record<
          string,
          unknown
        >;
        typedTransformedValues[input.name] = dateValue;
      }
    }
  }

  for (const input of metadata.form.inputs.imageInputs ?? []) {
    const imageKey = get(transformedDefaultValues, input.name, null) as
      | string
      | null;
    if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
      continue;
    }
    existingImages[input.name] = (
      <ApiImage imageKey={imageKey} alt={input.label} />
    );
  }

  return (
    <AbstractResourceFormInternal
      resource={resource}
      defaultValues={transformedDefaultValues}
      existingImages={existingImages}
    />
  );
}
