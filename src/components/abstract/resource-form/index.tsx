import type { ReactNode } from "react";
import { get } from "react-hook-form";
import type { DefaultValues } from "react-hook-form";

import { ApiImage } from "@/components/image/api/server";
import type { Resource } from "@/config/enums";
import type { ResourceDataType, ResourceFormValues } from "@/types/app";
import type {
  AbstractResourceFormInputs,
  ResourceSchemaKey,
} from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

export type WithOptionalId<T> = T & { id?: number };

export interface AbstractResourceFormProps<T extends Resource> {
  resource: T;
  defaultValues?: DefaultValues<ResourceFormValues<T> | ResourceDataType<T>>;
  formInputs: AbstractResourceFormInputs<T>;
}

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export function AbstractResourceForm<T extends Resource>(
  props: AbstractResourceFormProps<T>,
) {
  const existingImages: ExistingImages<T> = {};

  const defaultValues = (props.defaultValues ?? {}) as ResourceDataType<T>;
  for (const input of props.formInputs.imageInputs ?? []) {
    const imageKey = get(defaultValues, input.name, null) as string | null;
    if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
      continue;
    }
    existingImages[input.name] = (
      <ApiImage imageKey={imageKey} alt={input.label} />
    );
  }

  return (
    <AbstractResourceFormInternal {...props} existingImages={existingImages} />
  );
}
