import type { ComponentType } from "react";

import { RESOURCE_API_PATHS } from "@/config/constants";
import type { Resource } from "@/lib/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type { ResourceTypes } from "@/types/app";

async function fetchResource<T extends Resource>(
  resource: T,
  id: string,
): Promise<ResourceTypes[T] | null> {
  try {
    const response = await fetchQuery<{ data: ResourceTypes[T] }>(
      `${RESOURCE_API_PATHS[resource]}/${sanitizeId(id)}`,
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return null;
  }
}

export async function AbstractResourceEditPage<T extends Resource>({
  resource,
  params,
  FormComponent,
}: {
  resource: T;
  params: Promise<{ id: string }>;
  FormComponent: ComponentType<{ initialData: ResourceTypes[T] | null }>;
}) {
  const { id } = await params;
  const resourceData = await fetchResource(resource, id);

  return <FormComponent initialData={resourceData} />;
}
