import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TOAST_MESSAGES } from "@/config/constants";
import type { Resource } from "@/config/enums";
import { OrganizationStatus } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { getKey } from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import type { ModifyResourceResponse } from "@/types/api";

// TODO: make this more generic to support other resources with property toggles
export function ToggleOrganizationStatusButton({
  id,
  resource,
  organizationStatus,
  onStatusChange,
}: {
  id: number;
  resource: Resource;
  organizationStatus: OrganizationStatus;
  onStatusChange?: (newStatus: OrganizationStatus) => void;
}) {
  const router = useRouter();
  const isActive = organizationStatus === OrganizationStatus.Active;

  type ModifyResponseType = ModifyResourceResponse<typeof resource>;

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutationWrapper<
    ModifyResponseType,
    { organizationStatus: OrganizationStatus }
  >(`toggle-organization-status__${resource}__${String(id)}`, async (body) => {
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
    onStatusChange?.(body.organizationStatus);
    return result;
  });

  const declensions = declineNoun(resource);
  const shortLabel = isActive ? "Archiwizuj" : "Przywróć";
  const label = `${shortLabel} ${declensions.accusative}`;

  return (
    <Button
      variant={isActive ? "destructive" : "default"}
      loading={isPending}
      aria-label={label}
      onClick={() => {
        toast.promise(
          mutateAsync({
            organizationStatus: isActive
              ? OrganizationStatus.Inactive
              : OrganizationStatus.Active,
          }),
          TOAST_MESSAGES.object(declensions).toggleArchived(isActive),
        );
      }}
    >
      {shortLabel}
    </Button>
  );
}
