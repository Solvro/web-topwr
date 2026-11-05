"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  fetchMutation,
  getErrorMessage,
  getKey,
  useMutationWrapper,
} from "@/features/backend";
import { declineNoun } from "@/features/polish";
import type { Resource } from "@/features/resources";
import type { EditableResource, ResourcePk } from "@/features/resources/types";
import { useRouter } from "@/hooks/use-router";
import { quoteText, sanitizeId } from "@/utils";

interface ApproveDraftResponse {
  success: boolean;
  approvedId: number;
}

export function ApproveButton({
  id,
  resource,
  itemName,
  showLabel = false,
  disabled = false,
  redirectOnSuccess = true,
}: {
  id: ResourcePk;
  resource: Resource;
  itemName?: string;
  showLabel?: boolean;
  disabled?: boolean;
  /** Whether to navigate to the approved resource afterwards. If `false`, the current page is refreshed instead. */
  redirectOnSuccess?: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, isSuccess } = useMutationWrapper<
    ApproveDraftResponse,
    null
  >(`approve-draft__${resource}__${String(id)}`, async () => {
    const response = await fetchMutation<ApproveDraftResponse>(
      `${sanitizeId(id)}/approve`,
      { method: "POST", resource, draft: true },
    );
    setIsDialogOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [getKey.query.resourceList(resource)],
      exact: false,
    });
    if (redirectOnSuccess) {
      router.push(
        `/${resource as EditableResource}/edit/${sanitizeId(response.approvedId)}`,
      );
    } else {
      router.refresh();
    }
    return response;
  });

  const declensions = declineNoun(resource);
  const label = "Zatwierdź";
  const tooltip = `Zatwierdź draft ${declensions.genitive}`;

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant={showLabel ? "default" : "icon"}
          size={showLabel ? "default" : "icon"}
          loading={isPending}
          disabled={disabled}
          aria-label={tooltip}
          tooltip={
            disabled
              ? "Zapisz lub cofnij zmiany przed zatwierdzeniem"
              : showLabel
                ? undefined
                : tooltip
          }
        >
          {showLabel ? label : null}
          <Check />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            Czy na pewno chcesz zatwierdzić draft {declensions.genitive}
            {itemName == null ? null : ` ${quoteText(itemName)}`}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Zmiany zostaną opublikowane, a draft zostanie usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => {
                toast.promise(mutateAsync(null), {
                  loading: "Trwa zatwierdzanie draftu...",
                  success: "Pomyślnie zatwierdzono draft!",
                  error: (error: unknown) =>
                    getErrorMessage(
                      error,
                      "Wystąpił błąd podczas zatwierdzania draftu",
                    ),
                });
              }}
              loading={isPending}
              disabled={isSuccess}
            >
              <Check />
              Zatwierdź
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
