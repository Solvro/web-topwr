"use client";

import { CircleX } from "lucide-react";

import { Link } from "@/components/core/link";
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
import { declineNoun } from "@/features/polish";
import type { RoutableResource } from "@/features/resources/types";

export function ArfCancelButton({
  resource,
  disabled = false,
  onClearData,
  navigateOnClearData,
}: {
  resource: RoutableResource;
  disabled?: boolean;
  onClearData?: () => void;
  navigateOnClearData: boolean;
}) {
  const declensions = declineNoun(resource);

  const cancelContent = (
    <>
      Tak, anuluj <CircleX />
    </>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled}>
          Anuluj tworzenie <CircleX />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anulować tworzenie?</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz anulować tworzenie {declensions.genitive}?
            Wszystkie wprowadzone dane zostaną utracone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Nie</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              asChild={navigateOnClearData}
              onClick={onClearData}
            >
              {navigateOnClearData ? (
                <Link href={`/${resource}`}>{cancelContent}</Link>
              ) : (
                cancelContent
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
