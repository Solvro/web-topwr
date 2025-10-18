import type { ReactNode } from "react";
import { get } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { typedEntries } from "@/lib/helpers";
import {
  getResourceMetadata,
  getResourceRelationConfigurations,
} from "@/lib/helpers/app";
import type {
  LabelledRelationData,
  ResourceDataType,
  ResourceDefaultValues,
  ResourceRelation,
  ResourceRelations,
} from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const relations = getResourceRelationConfigurations(resource);
  const responses = await Promise.all(
    typedEntries(relations).map(
      async ([relation, config]) =>
        [
          relation,
          await fetchQuery<{ data: ResourceDataType<typeof relation>[] }>(
            config.apiPath,
          ).then(({ data }) => data),
        ] as LabelledRelationData<ResourceRelation<T>>,
    ),
  );
  return Object.fromEntries(responses);
}

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export async function AbstractResourceForm<T extends Resource>({
  resource,
  defaultValues = getResourceMetadata(resource).form.defaultValues,
}: {
  resource: T;
  defaultValues?: ResourceDefaultValues<T>;
}) {
  const existingImages: ExistingImages<T> = {};
  const metadata = getResourceMetadata(resource);
  if (metadata.form.inputs.imageInputs != null) {
    for (const [name, input] of typedEntries(
      metadata.form.inputs.imageInputs,
    )) {
      const imageKey = get(defaultValues, name, null) as string | null;
      if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
        continue;
      }
      existingImages[name] = (
        <ApiImage imageKey={imageKey} alt={input?.label ?? imageKey} />
      );
    }
  }

  const relatedResources = await fetchRelatedResources(resource);

  return (
    <AbstractResourceFormInternal
      resource={resource}
      defaultValues={defaultValues}
      existingImages={existingImages}
      relatedResources={relatedResources}
    />
  );
}
