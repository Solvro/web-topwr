"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { Shredder, Trash2 } from "lucide-react";
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
import type { buttonVariants } from "@/components/ui/button/variants";
import { fetchMutation, getKey, useMutationWrapper } from "@/features/backend";
import type { MessageResponse } from "@/features/backend/types";
import { GrammaticalCase, declineNoun } from "@/features/polish";
import { useRouter } from "@/hooks/use-router";
import { getToastMessages } from "@/lib/get-toast-messages";
import type { OptionalPromise } from "@/types/helpers";
import { quoteText, sanitizeId } from "@/utils";

import type { Resource } from "../enums";
import type { ResourcePk } from "../types/internal";

export function DeleteButtonWithDialog({
  resource,
  id,
  itemName,
  showLabel = false,
  onDeleteSuccess,
  ...props
}: {
  resource: Resource;
  id: ResourcePk;
  itemName?: string;
  showLabel?: boolean;
  onDeleteSuccess?: () => OptionalPromise<boolean>;
} & VariantProps<typeof buttonVariants>) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isSuccess } = useMutationWrapper<
    MessageResponse,
    string
  >(getKey.mutation.deleteResource(resource, id), async (sanitizedId) => {
    const response = await fetchMutation<MessageResponse>(sanitizedId, {
      resource,
      method: "DELETE",
    });
    setIsAlertDialogOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [getKey.query.resourceList(resource)],
      exact: false,
    });
    if ((await onDeleteSuccess?.()) !== false) {
      router.refresh();
    }
    return response;
  });

  function handleDelete() {
    toast.promise(
      mutateAsync(sanitizeId(id)),
      getToastMessages.resource(resource).delete,
    );
  }

  const declensions = declineNoun(resource);
  const label = `Usuń ${declensions.accusative}`;

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive-ghost"
          size="sm"
          aria-label={label}
          tooltip={showLabel ? undefined : label}
          {...props}
        >
          {showLabel ? label : null}
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            Czy na pewno chcesz usunąć{" "}
            {
              itemName == null
                ? declineNoun(resource, {
                    case: GrammaticalCase.Accusative,
                    prependDeterminer: "this",
                  }) // e.g. tę organizację studencką
                : `${declensions.accusative} ${quoteText(itemName)}` // e.g. organizację studencką „KN Solvro”
            }
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ta operacja jest nieodwracalna.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={isPending}
              disabled={isSuccess}
            >
              <Shredder />
              Usuń
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
