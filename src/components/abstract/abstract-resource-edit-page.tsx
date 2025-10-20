import { notFound } from "next/navigation";

import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { ResourceEditPageProps } from "@/types/components";

import { AbstractResourceForm } from "./resource-form";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: Resource;
}) {
  const { id } = await params;
  let resourceData;
  try {
    const response = await fetchQuery<
      GetResourceWithRelationsResponse<Resource>
    >(sanitizeId(id), { resource, includeRelations: true });
    resourceData = response.data;
  } catch {
    return notFound();
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
