import { toast } from "sonner";

import { TOAST_MESSAGES } from "@/config/constants";
import { RelationType, type Resource } from "@/config/enums";
import { fetchMutation } from "@/lib/fetch-utils";
import {
  camelToSnakeCase,
  getResourceQueryName,
  getResourceRelationDefinitions,
  sanitizeId,
} from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { ModifyResourceResponse } from "@/types/api";
import type { Id, ResourceRelation, XToManyResource } from "@/types/app";

import { useArfRelation } from "./use-arf-relation";
import { useMutationWrapper } from "./use-mutation-wrapper";

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

  const declensions = declineNoun(resourceRelation);

  const mutateRelation = async (mutationOptions: MutateRelationOptions) =>
    toast
      .promise(
        relationMutation.mutateAsync(mutationOptions),
        TOAST_MESSAGES.object(declensions).modify,
      )
      .unwrap();

  return { mutateRelation };
};
