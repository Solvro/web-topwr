import { useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import { OrganizationStatus } from "@/features/resources";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { useRouter } from "@/hooks/use-router";
import { fetchMutation } from "@/lib/fetch-utils";
import { getToastMessages } from "@/lib/get-toast-messages";
import { getKey, sanitizeId } from "@/lib/helpers";
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
  const tooltip = isActive ? "Archiwizuj" : "Przywróć";
  const label = `${tooltip} ${declensions.accusative}`;

  return (
    <Button
      variant={isActive ? "destructive-ghost" : "ghost"}
      loading={isPending}
      tooltip={tooltip}
      aria-label={label}
      size="icon"
      onClick={() => {
        toast.promise(
          mutateAsync({
            organizationStatus: isActive
              ? OrganizationStatus.Inactive
              : OrganizationStatus.Active,
          }),
          getToastMessages.resource(resource).toggleArchived(isActive),
        );
      }}
    >
      {isActive ? <Archive /> : <ArchiveRestore />}
    </Button>
  );
}
