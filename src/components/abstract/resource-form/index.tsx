import { get } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import {
  getResourceMetadata,
  getResourceRelationDefinitions,
  tryParseNumber,
  typedEntries,
  typedFromEntries,
} from "@/lib/helpers";
import type {
  ResourceDataType,
  ResourceDefaultValues,
  ResourceRelation,
} from "@/types/app";
import type {
  ExistingImages,
  ResourceCreatePageProps,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";

import { AbstractResourceFormInternal } from "./client";

type LabelledRelationData<T extends ResourceRelation<Resource>> = [
  T,
  ResourceDataType<T>[],
];

async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const responses = await Promise.all(
    typedEntries(getResourceRelationDefinitions(resource)).map(
      async ([relation, relationDefinition]) =>
        relationDefinition.type === RelationType.OneToMany
          ? []
          : [
              [
                relation,
                await fetchQuery<{ data: ResourceDataType<typeof relation>[] }>(
                  "",
                  { resource: relation as Resource, includeRelations: true },
                ).then(({ data }) => data),
              ] as LabelledRelationData<ResourceRelation<T>>,
            ],
    ),
  );
  return typedFromEntries<ResourceRelations<T>>(responses.flat());
}

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
      const imageKey = get(defaultValues, name, null) as string | null;
      if (imageKey == null || imageKey === "" || typeof imageKey !== "string") {
        continue;
      }
      existingImages[name] = (
        <ApiImage imageKey={imageKey} alt={input?.label ?? imageKey} />
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
