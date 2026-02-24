import { useOrderMutation } from "@/features/abstract-resource-list";
import type { OrderableResource } from "@/features/resources/types";
import { sanitizeId } from "@/utils";

export function useRelationOrderMutation<T extends OrderableResource>({
  resourceRelation,
}: {
  resourceRelation: T;
}) {
  return useOrderMutation({
    resource: resourceRelation,
    buildPath: (id) => sanitizeId(id),
  });
}
