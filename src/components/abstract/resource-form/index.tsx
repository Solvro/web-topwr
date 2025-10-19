import type { ReactNode } from "react";
import { get } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { typedEntries, typedFromEntries } from "@/lib/helpers";
import { getResourceMetadata } from "@/lib/helpers/app";
import type {
  ResourceDataType,
  ResourceDefaultValues,
  ResourceRelation,
} from "@/types/app";
import type { ResourceSchemaKey } from "@/types/forms";

import { AbstractResourceFormInternal } from "./client";

type LabelledRelationData<T extends ResourceRelation<Resource>> = [
  T,
  ResourceDataType<T>[],
];

export type ExistingImages<T extends Resource> = Partial<
  Record<ResourceSchemaKey<T>, ReactNode>
>;
export type ResourceRelations<T extends Resource> = {
  [L in ResourceRelation<T>]: ResourceDataType<L>[];
};

export interface AbstractResourceFormProps<T extends Resource> {
  resource: T;
  isEmbedded?: boolean;
  className?: string;
}

async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const metadata = getResourceMetadata(resource);
  const responses = await Promise.all(
    typedEntries(metadata.form.inputs.relationInputs ?? {}).map(
      async ([relation]) =>
        [
          relation,
          await fetchQuery<{ data: ResourceDataType<typeof relation>[] }>(
            getResourceMetadata(relation).apiPath,
          ).then(({ data }) => data),
        ] as LabelledRelationData<ResourceRelation<T>>,
    ),
  );
  return typedFromEntries<ResourceRelations<T>>(responses);
}

export async function AbstractResourceForm<T extends Resource>({
  resource,
  defaultValues = getResourceMetadata(resource).form.defaultValues,
  ...props
}: AbstractResourceFormProps<T> & {
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
      {...props}
    />
  );
}
