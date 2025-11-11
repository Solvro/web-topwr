import { get } from "react-hook-form";

import { ApiImage } from "@/components/api-image/server";
import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { fetchPivotResources } from "@/lib/abstract-resource-form";
import { fetchQuery } from "@/lib/fetch-utils";
import {
  getResourceArrayInputResources,
  getResourceMetadata,
  getResourceRelationDefinitions,
  tryParseNumber,
  typedEntries,
  typedFromEntries,
} from "@/lib/helpers";
import type { GetResourcesResponse } from "@/types/api";
import type { ArrayResources, ResourceDefaultValues } from "@/types/app";
import type {
  ExistingImages,
  ResourceCreatePageProps,
  ResourceFormProps,
  ResourceRelations,
} from "@/types/components";
import type { ValueOf } from "@/types/helpers";

import { AbstractResourceFormClient } from "./client";

type LabelledRelationData<T extends Resource> = [
  keyof ResourceRelations<T>,
  ValueOf<ResourceRelations<T>>,
];

async function fetchRelatedResources<T extends Resource>(
  resource: T,
): Promise<ResourceRelations<T>> {
  const arrayInputResources = typedEntries(
    getResourceArrayInputResources(resource),
  ).map(async ([_field, inputOptions]) => [
    [
      inputOptions.itemsResource as ArrayResources<T>,
      await fetchQuery<GetResourcesResponse<typeof inputOptions.itemsResource>>(
        "",
        { resource: inputOptions.itemsResource },
      ).then(({ data }) => data),
    ] as LabelledRelationData<T>,
  ]);
  const relationDefinitionResourcePromises = typedEntries(
    getResourceRelationDefinitions(resource),
  ).map(async ([relation, relationDefinition]) =>
    relationDefinition.type === RelationType.OneToMany
      ? []
      : [
          [
            relation,
            await fetchQuery<GetResourcesResponse<typeof relation>>("", {
              resource: relation,
              includeRelations: true,
            }).then(({ data }) => data),
          ] as LabelledRelationData<T>,
        ],
  );
  const responses = await Promise.all([
    ...arrayInputResources,
    ...relationDefinitionResourcePromises,
  ]);
  const labelledRelationData = responses.flat();
  return typedFromEntries<ResourceRelations<T>>(labelledRelationData);
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
    <AbstractResourceFormClient
      resource={resource}
      defaultValues={defaultValues}
      existingImages={existingImages}
      relatedResources={relatedResources}
      pivotResources={pivotResources}
      {...props}
    />
  );
}
