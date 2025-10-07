"use client";

import type { VariantProps } from "class-variance-authority";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { declineNoun } from "@/lib/polish";
import { cn } from "@/lib/utils";
import type { MessageResponse } from "@/types/api";

export function DeleteButtonWithDialog({
  resource,
  id,
  itemName,
  variant = "ghost",
}: {
  resource: Resource;
  id: string | number;
  itemName?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const sanitizedId = sanitizeId(String(id));
  const { mutateAsync, isPending, isSuccess } = useMutationWrapper<
    MessageResponse,
    null
  >(`delete__${resource}__${sanitizedId}`, async () => {
    const response = await fetchMutation<MessageResponse>(sanitizedId, {
      resource,
      method: "DELETE",
    });
    setIsDialogOpen(false);
    router.refresh();
    return response;
  });

  const declensions = declineNoun(resource);

  function handleDelete() {
    toast.promise(mutateAsync(null), TOAST_MESSAGES.object(declensions).delete);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "text-destructive hover:text-destructive h-10 w-10",
            variant === "destructive" && "text-accent hover:text-accent",
          )}
          aria-label={`Usuń ${declensions.accusative}`}
        >
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
                    prependDeterminer: true,
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
