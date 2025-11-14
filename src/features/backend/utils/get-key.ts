import type { Resource } from "@/features/resources";
import type { ResourcePk } from "@/features/resources/types";
import { sanitizeId } from "@/utils";

/** Generates the key for Tanstack query or mutation operations. */
export const getKey = {
  query: {
    resourceList: (resource: Resource) => `${resource}-list-page`,
    pivotData: (resource: Resource) => `${resource}-pivot-data`,
  },
  mutation: {
    deleteResource: (resource: Resource, id: ResourcePk) =>
      `delete__${resource}__${sanitizeId(id)}`,
  },
};
