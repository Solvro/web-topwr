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

  for (const input of metadata.form.inputs.imageInputs ?? []) {
    const imageKey = get(nonNullDefaultValues, input.name, null) as
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
      defaultValues={nonNullDefaultValues}
      existingImages={existingImages}
    />
  );
}
