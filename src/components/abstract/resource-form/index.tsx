import type { ReactNode } from "react";
import { get } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import type { Resource } from "@/config/enums";
import { getResourceMetadata } from "@/lib/helpers/app";
import type { ResourceDefaultValues } from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export function AbstractResourceForm<T extends Resource>({
  resource,
  defaultValues = getResourceMetadata(resource).form.defaultValues,
}: {
  resource: T;
  defaultValues?: ResourceDefaultValues<T>;
}) {
  const existingImages: ExistingImages<T> = {};
  const metadata = getResourceMetadata(resource);
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
      resource={resource}
      defaultValues={defaultValues}
      existingImages={existingImages}
    />
  );
}
