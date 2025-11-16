import { get } from "react-hook-form";

import { ApiImage } from "@/features/backend/server";
import { getResourceMetadata } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type { ResourceDefaultValues } from "@/features/resources/types";
import type {
  ExistingImages,
  ResourceCreatePageProps,
  ResourceFormProps,
} from "@/types/components";
import { tryParseNumber, typedEntries } from "@/utils";

import { fetchPivotResources } from "../api/fetch-pivot-resources";
import { fetchRelatedResources } from "../api/fetch-related-resources";
import { ArfController } from "./arf-controller";

/** Server-side entry point for the Abstract Resource Form. Fetches all required data and renders the form. */
export async function AbstractResourceForm<T extends Resource>({
  resource,
  defaultValues = getResourceMetadata(resource).form.defaultValues,
  searchParams,
  ...props
}: ResourceFormProps<T> &
  ResourceCreatePageProps & {
    defaultValues?: ResourceDefaultValues<T>;
  }) {
  const existingImages: ExistingImages<T> = {};
  const metadata = getResourceMetadata(resource);
  if (metadata.form.inputs.imageInputs != null) {
    for (const [name, input] of typedEntries(
      metadata.form.inputs.imageInputs,
    )) {
      if (input == null) {
        continue;
      }
      const imageKey = get(defaultValues, name, null) as string | null;
      if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
        continue;
      }
      existingImages[name] = (
        <ApiImage
          imageKey={imageKey}
          alt={input.label}
          type={input.type}
          resourceData={defaultValues}
        />
      );
    }
  }

  for (const [key, value] of typedEntries((await searchParams) ?? {})) {
    if (value == null || value === "") {
      continue;
    }
    if (!(key in defaultValues)) {
      continue;
    }
    const parsed = tryParseNumber(value);
    (defaultValues as Record<string, string | number>)[key] = parsed;
  }

  const relatedResources = await fetchRelatedResources(resource);
  const pivotResources = await fetchPivotResources(
    metadata.form.inputs.relationInputs,
  );

  return (
    <ArfController
      resource={resource}
      defaultValues={defaultValues}
      existingImages={existingImages}
      relatedResources={relatedResources}
      pivotResources={pivotResources}
      {...props}
    />
  );
}
