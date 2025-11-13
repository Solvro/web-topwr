import type { Resource } from "@/features/resources";
import type { Id } from "@/features/resources/types";
import { sanitizeId } from "@/lib/helpers/transformations";

/** Generates the key for Tanstack query or mutation operations. */
export const getKey = {
  query: {
    resourceList: (resource: Resource) => `${resource}-list-page`,
    pivotData: (resource: Resource) => `${resource}-pivot-data`,
  },
  mutation: {
    deleteResource: (resource: Resource, id: Id) =>
      `delete__${resource}__${sanitizeId(id)}`,
  },
};
