import { useQueryClient } from "@tanstack/react-query";
import { set } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchMutation, getKey, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { declineNoun } from "@/features/polish";
import { getFieldValue } from "@/features/resources";
import type {
  Resource,
  ResourceFormValues,
  ToggleFieldConfig,
} from "@/features/resources";
import { useRouter } from "@/hooks/use-router";
import { sanitizeId } from "@/utils";

export function ToggleStatusButton<T extends Resource>({
  id,
  resource,
  config,
  currentValue,
  onValueChange,
}: {
  id: number | string;
  resource: T;
  config: ToggleFieldConfig<T>;
  currentValue: unknown;
  onValueChange?: (newValue: unknown) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  type ModifyResponseType = ModifyResourceResponse<T>;

  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResponseType,
    Partial<ResourceFormValues<T>>
  >(`toggle__${resource}__${String(id)}__${config.field}`, async (body) => {
    const result = await fetchMutation<ModifyResponseType>(sanitizeId(id), {
      method: "PATCH",
      body,
      resource,
    });

    await queryClient.invalidateQueries({
      queryKey: [getKey.query.resourceList(resource)],
      exact: false,
    });

    router.refresh();
    const fieldValue = getFieldValue(body, config.field);
    onValueChange?.(fieldValue);

    return result;
  });

  // Determine current and next state
  const isActive = currentValue === config.states.active.value;
  const currentState = isActive ? config.states.active : config.states.inactive;
  const nextState = isActive ? config.states.inactive : config.states.active;

  const declensions = declineNoun(resource);
  const label = `${currentState.tooltip} ${declensions.accusative}`;

  return (
    <Button
      variant={currentState.variant ?? "ghost"}
      loading={isPending}
      tooltip={currentState.tooltip}
      aria-label={label}
      size="icon"
      onClick={() => {
        const body = {} as Partial<ResourceFormValues<T>>;
        set(body, config.field, nextState.value);

        toast.promise(
          mutateAsync(body),
          config.getToastMessages(currentState, nextState),
        );
      }}
    >
      <currentState.icon />
    </Button>
  );
}
