"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { Shredder, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { buttonVariants } from "@/components/ui/button/variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { sanitizeId } from "@/lib/helpers";
import { TANSTACK_KEYS } from "@/lib/helpers/app";
import { declineNoun } from "@/lib/polish";
import type { MessageResponse } from "@/types/api";
import type { Id } from "@/types/app";

export function DeleteButtonWithDialog({
  resource,
  id,
  itemName,
  showLabel = false,
  onDeleteSuccess,
  ...props
}: {
  resource: Resource;
  id: Id;
  itemName?: string;
  showLabel?: boolean;
  onDeleteSuccess?: () => void | Promise<void>;
} & VariantProps<typeof buttonVariants>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending, isSuccess } = useMutationWrapper<
    MessageResponse,
    string
  >(
    TANSTACK_KEYS.mutation.deleteResource(resource, id),
    async (sanitizedId) => {
      const response = await fetchMutation<MessageResponse>(sanitizedId, {
        resource,
        method: "DELETE",
      });
      setIsDialogOpen(false);
      await queryClient.invalidateQueries({
        queryKey: [TANSTACK_KEYS.query.resourceList(resource)],
        exact: false,
      });
      await onDeleteSuccess?.();
      return response;
    },
  );

  const declensions = declineNoun(resource);

  function handleDelete() {
    toast.promise(
      mutateAsync(sanitizeId(id)),
      TOAST_MESSAGES.object(declensions).delete,
    );
  }

  const label = `Usuń ${declensions.accusative}`;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive/90"
          aria-label={label}
          {...props}
        >
          {showLabel ? label : null}
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none">
        <DialogHeader>
          <DialogTitle>
            Czy na pewno chcesz usunąć{" "}
            {
              itemName == null
                ? declineNoun(resource, {
                    case: DeclensionCase.Accusative,
                    prependDeterminer: "this",
                  }) // e.g. tę organizację studencką
                : `${declensions.accusative} „${itemName}”` // e.g. organizację studencką „KN Solvro”
            }
            ?
          </DialogTitle>
          <DialogDescription>Ta operacja jest nieodwracalna.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex w-full gap-2 p-4">
          <Button
            variant="destructive"
            className="h-12 w-1/2"
            onClick={handleDelete}
            loading={isPending}
            disabled={isSuccess}
          >
            <Shredder />
            Usuń
          </Button>
          <DialogTrigger asChild>
            <Button variant="secondary" className="h-12 w-1/2">
              Anuluj
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
