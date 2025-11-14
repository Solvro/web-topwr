import type { Resource } from "@/features/resources";
import { getResourceMetadata } from "@/features/resources/node";

import { DEFAULT_API_VERSION } from "../constants";

export const getResourceApiVersion = (
  resource: Resource | undefined,
): number =>
  resource == null
    ? DEFAULT_API_VERSION
    : (getResourceMetadata(resource).apiVersion ?? DEFAULT_API_VERSION);
