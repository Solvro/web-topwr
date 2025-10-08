import { notFound } from "next/navigation";

import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type { ResourceDataType, ResourceEditPageProps } from "@/types/app";

import { AbstractResourceForm } from "./resource-form";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: Resource;
}) {
  const { id } = await params;
  let resourceData: ResourceDataType<Resource> | null = null;
  try {
    const response = await fetchQuery<{ data: ResourceDataType<Resource> }>(
      sanitizeId(id),
      { resource },
    );
    resourceData = response.data;
  } catch {
    return notFound();
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
