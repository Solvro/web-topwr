import type { Resource } from "@/config/enums";
import type { Id } from "@/types/app";

import { sanitizeId } from "./transformations";

export const TANSTACK_KEYS = {
  query: {
    resourceList: (resource: Resource) => `${resource}-list-page`,
  },
  mutation: {
    deleteResource: (resource: Resource, id: Id) =>
      `delete__${resource}__${sanitizeId(id)}`,
  },
};
