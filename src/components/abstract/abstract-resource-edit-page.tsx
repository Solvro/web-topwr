import { notFound } from "next/navigation";

import type { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type { RelationConfigurations } from "@/config/resources";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type {
  ResourceDataType,
  ResourceEditPageProps,
  ResourceRelations,
} from "@/types/app";

import { AbstractResourceForm } from "./resource-form";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: Resource;
}) {
  const { id } = await params;

  const metadata = RESOURCE_METADATA[resource] as {
    relations?: RelationConfigurations;
  };
  const relations = Object.values(metadata.relations ?? {}).map(
    (r) => r.name,
  ) as ResourceRelations<Resource>[];

  let resourceData: ResourceDataType<Resource> | null = null;
  try {
    const response = await fetchQuery<{ data: ResourceDataType<Resource> }>(
      sanitizeId(id),
      { resource, relations },
    );
    resourceData = response.data;
  } catch {
    return notFound();
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
