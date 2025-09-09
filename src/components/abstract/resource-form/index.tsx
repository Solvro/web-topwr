import type { ReactNode } from "react";
import { get } from "react-hook-form";
import type { DefaultValues } from "react-hook-form";

import { ApiImage } from "@/components/image/api/server";
import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

export interface AbstractResourceFormProps<T extends Resource> {
  resource: T;
  defaultValues?: DefaultValues<
    ResourceFormValues<T> | ResourceDataType<T>
  > | null;
}

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export function AbstractResourceForm<T extends Resource>(
  props: AbstractResourceFormProps<T>,
) {
  const existingImages: ExistingImages<T> = {};
  const metadata = RESOURCE_METADATA[props.resource];
  const defaultValues = props.defaultValues ?? metadata.form.defaultValues;
  for (const input of metadata.form.inputs.imageInputs ?? []) {
    const imageKey = get(defaultValues, input.name, null) as string | null;
    if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
      continue;
    }
    existingImages[input.name] = (
      <ApiImage imageKey={imageKey} alt={input.label} />
    );
  }

  return (
    <AbstractResourceFormInternal
      {...props}
      formInputs={metadata.form.inputs}
      existingImages={existingImages}
    />
  );
}
