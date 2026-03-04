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

export function CancelButton({
  resource,
  onClearData,
  disabled = false,
}: {
  resource: RoutableResource;
  onClearData?: () => void;
  disabled?: boolean;
}) {
  const declensions = declineNoun(resource);

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
            <Button variant="destructive" asChild>
              <Link href={`/${resource}`} onClick={onClearData}>
                Tak, anuluj <CircleX />
              </Link>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
