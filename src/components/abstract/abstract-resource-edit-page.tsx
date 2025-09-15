import { toast } from "sonner";

import { TOAST_MESSAGES } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { ResourceDataType } from "@/types/app";

import { AbstractResourceForm } from "./resource-form";

async function fetchResource<T extends Resource>(
  resource: T,
  id: string,
): Promise<ResourceDataType<T> | null> {
  const declensions = declineNoun(resource);
  try {
    const response = await fetchQuery<{ data: ResourceDataType<T> }>(
      sanitizeId(id),
      { resource },
    );
    return response.data;
  } catch {
    toast.error(TOAST_MESSAGES.object(declensions).read.error);
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
