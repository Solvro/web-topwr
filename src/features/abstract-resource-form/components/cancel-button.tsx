"use client";

import { CircleX, RotateCcw } from "lucide-react";

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
import type { Resource } from "@/features/resources";
import type { RoutableResource } from "@/features/resources/types";

interface CancelButtonProps<T extends Resource> {
  resource: T;
  isEditing: boolean;
  onClearData?: () => void;
  onResetForm?: () => void;
  disabled?: boolean;
}

export function CancelButton<T extends Resource>({
  resource,
  isEditing,
  onClearData,
  onResetForm,
  disabled = false,
}: CancelButtonProps<T>) {
  const declensions = declineNoun(resource);

  if (isEditing) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onResetForm}
        disabled={disabled}
      >
        Resetuj formularz <RotateCcw />
      </Button>
    );
  }

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
              <Link
                href={`/${resource as RoutableResource}`}
                onClick={onClearData}
              >
                Tak, anuluj <CircleX />
              </Link>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
