import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type { ResourceDataType } from "@/types/app";

import { AbstractResourceForm } from "./resource-form";

async function fetchResource<T extends Resource>(
  resource: T,
  id: string,
): Promise<ResourceDataType<T> | null> {
  try {
    const response = await fetchQuery<{ data: ResourceDataType<T> }>(
      sanitizeId(id),
      { resource },
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return null;
  }
}

export async function AbstractResourceEditPage({
  resource,
  params,
}: {
  resource: Resource;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resourceData = await fetchResource(resource, id);

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
