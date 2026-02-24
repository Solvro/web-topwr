"use client";

import { toast } from "sonner";

import { fetchMutation, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import type { Resource } from "@/features/resources";
import type { ResourcePk } from "@/features/resources/types";
import { getToastMessages } from "@/lib/get-toast-messages";

interface UseOrderMutationOptions<T extends Resource> {
  resource: T;
  buildPath: (itemId: ResourcePk) => string;
  onError?: () => void;
}

interface OrderMutationVariables {
  id: ResourcePk;
  order: number;
}

export function useOrderMutation<T extends Resource>({
  resource,
  buildPath,
  onError,
}: UseOrderMutationOptions<T>) {
  const mutation = useMutationWrapper<
    ModifyResourceResponse<T>,
    OrderMutationVariables
  >(
    `update__${resource}__order`,
    async ({ id, order }) => {
      const endpoint = buildPath(id);
      const response = await fetchMutation<ModifyResourceResponse<T>>(
        endpoint,
        {
          body: { order },
          resource,
          method: "PATCH",
        },
      );
      return response;
    },
    { onError },
  );

  const mutateOrder = async (id: ResourcePk, order: number) =>
    toast
      .promise(
        mutation.mutateAsync({ id, order }),
        getToastMessages.resource(resource).modify,
      )
      .unwrap();

  return { mutateOrder, mutation };
}
