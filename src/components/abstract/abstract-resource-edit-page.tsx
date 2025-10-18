import { notFound } from "next/navigation";

import type { Resource } from "@/config/enums";
import { fetchQuery } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { getResourceRelations } from "@/lib/helpers/app";
import type { GetResourceWithRelationsResponse } from "@/types/api";
import type { ResourceEditPageProps } from "@/types/app";

import { AbstractResourceForm } from "./resource-form";

export async function AbstractResourceEditPage({
  resource,
  params,
}: ResourceEditPageProps & {
  resource: Resource;
}) {
  const { id } = await params;
  const relations = getResourceRelations(resource);

  let resourceData;
  try {
    const response = await fetchQuery<
      GetResourceWithRelationsResponse<Resource>
    >(sanitizeId(id), { resource, relations });
    resourceData = response.data;
  } catch {
    return notFound();
  }

  return (
    <AbstractResourceForm resource={resource} defaultValues={resourceData} />
  );
}
