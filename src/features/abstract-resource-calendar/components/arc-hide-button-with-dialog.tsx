"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
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
import type { Resource } from "@/features/resources";
import { useRouter } from "@/hooks/use-router";
import { getToastMessages } from "@/lib/get-toast-messages";
import type { OptionalPromise } from "@/types/helpers";
import { quoteText } from "@/utils";

export function ArcHideButtonWithDialog({
  resource,
  googleCalId,
  hidden,
  itemName,
  showLabel = false,
  onHideSuccess,
  ...props
}: {
  resource: Resource;
  googleCalId: string;
  hidden: boolean;
  itemName?: string;
  showLabel?: boolean;
  onHideSuccess?: () => OptionalPromise<boolean>;
} & VariantProps<typeof buttonVariants>) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutationWrapper<
    MessageResponse,
    string
  >(getKey.mutation.hideResource(resource, googleCalId), async (calId) => {
    const response = await fetchMutation<MessageResponse>(`hidden`, {
      resource,
      method: "POST",
      body: { googleCalId: calId, hide: !hidden },
    });
    setIsAlertDialogOpen(false);
    await queryClient.invalidateQueries({
      queryKey: [getKey.query.resourceList(resource)],
      exact: false,
    });
    if ((await onHideSuccess?.()) !== false) {
      router.refresh();
    }
    return response;
  });

  function handleHide() {
    toast.promise(
      mutateAsync(googleCalId),
      getToastMessages.resource(resource).modify,
    );
  }

  const declensions = declineNoun(resource);
  const label = hidden
    ? `Pokaż ${declensions.accusative}`
    : `Ukryj ${declensions.accusative}`;

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="icon"
          size={showLabel ? "sm" : "icon"}
          aria-label={label}
          tooltip={showLabel ? undefined : label}
          {...props}
        >
          {showLabel ? label : null}
          {hidden ? <Eye /> : <EyeOff />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            {hidden
              ? "Czy na pewno chcesz pokazać"
              : "Czy na pewno chcesz ukryć"}{" "}
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
            {hidden
              ? "Wydarzenie zostanie ponownie wyświetlone w kalendarzu."
              : "Wydarzenie zostanie ukryte w kalendarzu."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleHide}
              loading={isPending}
            >
              {hidden ? (
                <>
                  <Eye />
                  Pokaż
                </>
              ) : (
                <>
                  <EyeOff />
                  Ukryj
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
