import type { Resource } from "@/features/resources";

import { getResourceApiVersion } from "./get-resource-api-version";
import { getVersionedApiBase } from "./get-versioned-api-base";

export const getResourceApiBase = (resource: Resource | undefined) =>
  getVersionedApiBase(getResourceApiVersion(resource));
