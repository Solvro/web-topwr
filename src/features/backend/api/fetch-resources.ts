import type { Resource } from "@/features/resources";
import type {
  ResourceDataType,
  ResourceDataWithRelations,
} from "@/features/resources/types";

import type { GetResourcesWithRelationsResponse } from "../types/responses";
import { fetchQuery } from "./fetch-query";

export async function fetchResources<
  T extends Resource,
  B extends boolean = false,
>(
  resource: T,
  includeRelations: B = false as B,
): Promise<
  B extends true ? ResourceDataWithRelations<T>[] : ResourceDataType<T>[]
> {
  const result = await fetchQuery<GetResourcesWithRelationsResponse<T>>("", {
    resource,
    includeRelations,
  });
  return result.data;
}
