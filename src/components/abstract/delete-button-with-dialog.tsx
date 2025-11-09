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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { useRouter } from "@/hooks/use-router";
import { fetchMutation } from "@/lib/fetch-utils";
import { getKey, quoteText, sanitizeId } from "@/lib/helpers";
import { declineNoun } from "@/lib/polish";
import type { MessageResponse } from "@/types/api";
import type { Id } from "@/types/app";
import type { OptionalPromise } from "@/types/helpers";

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
  onDeleteSuccess?: () => OptionalPromise<boolean>;
} & VariantProps<typeof buttonVariants>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [getKey.query.resourceList(resource)],
      exact: false,
    });
    if ((await onDeleteSuccess?.()) !== false) {
      router.refresh();
    }
    return response;
  });

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
          variant="destructive-ghost"
          size="sm"
          aria-label={label}
          tooltip={showLabel ? undefined : label}
          {...props}
        >
          {showLabel ? label : null}
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-balance">
            Czy na pewno chcesz usunąć{" "}
            {
              itemName == null
                ? declineNoun(resource, {
                    case: DeclensionCase.Accusative,
                    prependDeterminer: "this",
                  }) // e.g. tę organizację studencką
                : `${declensions.accusative} ${quoteText(itemName)}` // e.g. organizację studencką „KN Solvro”
            }
            ?
          </DialogTitle>
          <DialogDescription>Ta operacja jest nieodwracalna.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Anuluj</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
            disabled={isSuccess}
          >
            <Shredder />
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
