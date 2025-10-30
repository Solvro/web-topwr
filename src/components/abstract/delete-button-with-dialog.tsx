"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { Shredder, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TOAST_MESSAGES } from "@/config/constants";
import { DeclensionCase } from "@/config/enums";
import type { Resource } from "@/config/enums";
import { useMutationWrapper } from "@/hooks/use-mutation-wrapper";
import { fetchMutation } from "@/lib/fetch-utils";
import { quoteText, sanitizeId } from "@/lib/helpers";
import { getKey } from "@/lib/helpers/app";
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

  const button = (
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
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {showLabel ? (
        button
      ) : (
        <Tooltip>
          <TooltipTrigger asChild></TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      )}
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
            <Button variant="secondary" className="h-12 w-1/2">
              Anuluj
            </Button>
          </DialogClose>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
