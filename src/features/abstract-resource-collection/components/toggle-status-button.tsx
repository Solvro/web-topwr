import { useQueryClient } from "@tanstack/react-query";
import { get, set } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchMutation, getKey, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { declineNoun } from "@/features/polish";
import type {
  Resource,
  ResourceFormValues,
  ToggleFieldConfig,
} from "@/features/resources";
import { useRouter } from "@/hooks/use-router";
import { sanitizeId } from "@/utils";

export function ToggleStatusButton<R extends Resource>({
  id,
  resource,
  config,
  currentValue,
  onValueChange,
}: {
  id: number | string;
  resource: R;
  config: ToggleFieldConfig<R>;
  currentValue: unknown;
  onValueChange?: (newValue: unknown) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  type ModifyResponseType = ModifyResourceResponse<typeof resource>;

  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResponseType,
    Partial<ResourceFormValues<R>>
  >(`toggle-${resource}-${config.field}-${String(id)}`, async (body) => {
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
    const fieldValue = get(body, config.field) as unknown;
    if (fieldValue !== undefined) {
      onValueChange?.(fieldValue);
    }

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
        const body = {} as Partial<ResourceFormValues<R>>;
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
