import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Resource } from "@/config/enums";
import { OrganizationStatus } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";

export function ToggleOrganizationStatusButton({
  id,
  resource,
  organizationStatus,
  onStatusChange,
}: {
  id: number;
  resource: Resource;
  organizationStatus: OrganizationStatus;
  onStatusChange: (newStatus: OrganizationStatus) => void;
}) {
  const router = useRouter();
  const isActive = organizationStatus === OrganizationStatus.Active;

  const { mutateAsync, isPending } = useMutationWrapper<
    unknown,
    { organizationStatus: OrganizationStatus }
  >(`toggle-organization-status__${resource}__${String(id)}`, async (body) => {
    const result = await fetchMutation(sanitizeId(id), {
      method: "PATCH",
      body,
      resource,
    });
    router.refresh();
    return result;
  });

  const handleClick = () => {
    const newStatus = isActive
      ? OrganizationStatus.Inactive
      : OrganizationStatus.Active;

    toast.promise(
      mutateAsync({ organizationStatus: newStatus }).then(() => {
        onStatusChange(newStatus);
      }),
      {
        loading:
          newStatus === OrganizationStatus.Inactive
            ? "Archiwizuje organizację..."
            : "Przywracam organizację...",
        success:
          newStatus === OrganizationStatus.Inactive
            ? "Organizacja została zarchiwizowana."
            : "Organizacja została przywrócona.",
        error: "Nie udało się zmienić statusu organizacji.",
      },
    );
  };

  return (
    <Button
      variant={isActive ? "destructive" : "default"}
      loading={isPending}
      onClick={handleClick}
    >
      {isActive ? "Archiwizuj" : "Przywróć"}
    </Button>
  );
}
