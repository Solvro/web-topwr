import { useQueryClient } from "@tanstack/react-query";
import { Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fetchMutation, getKey, useMutationWrapper } from "@/features/backend";
import type { ModifyResourceResponse } from "@/features/backend/types";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import { OrganizationStatus } from "@/features/resources";
import { useRouter } from "@/hooks/use-router";
import { getToastMessages } from "@/lib/get-toast-messages";
import { sanitizeId } from "@/utils";

/**
 * @deprecated Use the generic ToggleButton component instead.
 * This component is kept for backward compatibility but will be removed in a future version.
 *
 * Migration example:
 * ```tsx
 * // Old (deprecated):
 * <ToggleOrganizationStatusButton
 *   id={id}
 *   resource={Resource.StudentOrganizations}
 *   organizationStatus={item.organizationStatus}
 * />
 *
 * // New (recommended):
 * // Add toggle config to resource metadata, then:
 * {metadata.toggle !== undefined ? null : (
 *   <ToggleButton
 *     id={id}
 *     resource={resource}
 *     config={metadata.toggle}
 *     currentValue={item[metadata.toggle.field]}
 *   />
 * )}
 * ```
 */
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
