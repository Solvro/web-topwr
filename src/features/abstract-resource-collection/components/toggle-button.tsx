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

export function ToggleButton<R extends Resource>({
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
  const currentStateIndex = config.states.findIndex(
    (state) => state.value === currentValue,
  );
  const currentState = config.states[currentStateIndex] ?? config.states[0];
  const nextStateIndex = currentStateIndex === -1 ? 1 : (currentStateIndex === 0 ? 1 : 0);
  const nextState = config.states[nextStateIndex];

  const declensions = declineNoun(resource);
  const label = `${currentState.tooltip} ${declensions.accusative}`;

  return (
    <Button
      variant={
        currentState.variant ?? "ghost"
      }
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
