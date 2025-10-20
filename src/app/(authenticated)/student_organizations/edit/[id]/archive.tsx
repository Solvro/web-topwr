"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";

interface Props {
  id: number;
  resource: Resource;
  organizationStatus: "active" | "inactive";
}
interface ToggleStatusBody {
  organizationStatus: "active" | "inactive";
}
export function ToggleOrganizationStatusButton({
  id,
  resource,
  organizationStatus,
}: Props) {
  const [status, setStatus] = useState<"active" | "inactive">(
    organizationStatus,
  );

  const isActive = status === "active";

  const { mutateAsync, isPending } = useMutationWrapper<
    unknown,
    ToggleStatusBody
  >(`toggle-organization-status__${resource}__${String(id)}`, async (body) => {
    return fetchMutation(`/${sanitizeId(String(id))}`, {
      method: "PATCH",
      body,
      resource,
    });
  });

  const handleClick = () => {
    const newStatus = isActive ? "inactive" : "active";

    toast.promise(
      async () => {
        await mutateAsync({ organizationStatus: newStatus });
        setStatus(newStatus);
      },
      {
        loading: isActive
          ? "Dezaktywuję organizację..."
          : "Aktywuję organizację...",
        success: isActive
          ? "Organizacja została zdezaktywowana."
          : "Organizacja została ponownie aktywowana.",
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
      {isActive ? "Dezaktywuj" : "Aktywuj"}
    </Button>
  );
}
