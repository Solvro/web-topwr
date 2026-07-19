"use client";

import { toast } from "sonner";

import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { getResourceQueryName } from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  ResourcePk,
  ResourceRelation,
  XToManyResource,
} from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";
import { camelToSnakeCase, sanitizeId } from "@/utils";

import { useArfRelation } from "./use-arf-relation";

interface PivotOrderMutationVariables {
  id: ResourcePk;
  order: number;
  pivotKeys: Record<string, unknown>;
}

export function usePivotRelationOrderMutation<T extends Resource>({
  resource,
  resourceRelation,
  endpoint,
}: {
  resource: T;
  resourceRelation: ResourceRelation<T>;
  endpoint: string;
}) {
  const relationContext = useArfRelation();

  const mutation = useMutationWrapper<
    ModifyResourceResponse<T>,
    PivotOrderMutationVariables
  >(
    `update__${resource}__relation_order__${relationContext?.childResource ?? "unknown"}`,
    async ({ id, order, pivotKeys }) => {
      const queryName = getResourceQueryName(
        resourceRelation as XToManyResource,
      );
      const pathSegment = camelToSnakeCase(queryName);
      const response = await fetchMutation<ModifyResourceResponse<T>>(
        `${endpoint}/${pathSegment}/${sanitizeId(id)}`,
        {
          method: "PATCH",
          resource,
          body: {
            query: pivotKeys,
            update: { order },
          },
        },
      );
      return response;
    },
  );

  const mutateOrder = async (
    id: ResourcePk,
    order: number,
    pivotKeys: Record<string, unknown>,
  ) =>
    toast
      .promise(
        mutation.mutateAsync({ id, order, pivotKeys }),
        getToastMessages.resource(resourceRelation).modify,
      )
      .unwrap();

  return { mutateOrder, mutation };
}
