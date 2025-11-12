import { toast } from "sonner";

import { RelationType } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { getToastMessages } from "@/lib/get-toast-messages";
import {
  camelToSnakeCase,
  getResourceQueryName,
  getResourceRelationDefinitions,
  sanitizeId,
} from "@/lib/helpers";
import type { ModifyResourceResponse } from "@/types/api";
import type { Id, ResourceRelation, XToManyResource } from "@/types/app";

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
