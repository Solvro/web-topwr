import { toast } from "sonner";

import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import {
  RelationType,
  getResourceQueryName,
  getResourceRelationDefinitions,
} from "@/features/resources";
import type { Resource } from "@/features/resources";
import type {
  Id,
  ResourceRelation,
  XToManyResource,
} from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";
import { camelToSnakeCase, sanitizeId } from "@/lib/helpers";

import { useArfRelation } from "./use-arf-relation";

interface MutateRelationOptions {
  deleted: boolean;
  id: Id;
  body: unknown;
}

export const useArfRelationMutation = <T extends Resource>({
  resource,
  resourceRelation,
  endpoint,
}: {
  resource: T;
  resourceRelation: ResourceRelation<T>;
  endpoint: string;
}) => {
  const relationContext = useArfRelation();

  const relationDefinitions = getResourceRelationDefinitions(resource);
  const relationDefinition = relationDefinitions[resourceRelation];

  const relationMutation = useMutationWrapper<
    ModifyResourceResponse<T>,
    MutateRelationOptions
  >(
    `update__${resource}__relation__${relationContext?.childResource ?? "unknown"}`,
    async ({ deleted, id, body }) => {
      if (relationDefinition.type !== RelationType.ManyToMany) {
        throw new Error(
          "Attempted to mutate an invalid relation. Only many-to-many relations are allowed to have non-readonly multiselects.",
        );
      }

      const queryName = getResourceQueryName(
        resourceRelation as XToManyResource,
      );
      const pathSegment = camelToSnakeCase(queryName);
      const response = await fetchMutation<ModifyResourceResponse<T>>(
        `${endpoint}/${pathSegment}/${sanitizeId(id)}`,
        {
          method: deleted ? "DELETE" : "POST",
          resource,
          body,
        },
      );
      return response;
    },
  );

  const mutateRelation = async (mutationOptions: MutateRelationOptions) =>
    toast
      .promise(
        relationMutation.mutateAsync(mutationOptions),
        getToastMessages.resource(resourceRelation).modify,
      )
      .unwrap();

  return { mutateRelation };
};
