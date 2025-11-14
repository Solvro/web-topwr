import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";

export const getResourceEndpointPrefix = (resource: Resource | undefined) =>
  resource == null ? "" : `${getResourceMetadata(resource).apiPath}/`;
