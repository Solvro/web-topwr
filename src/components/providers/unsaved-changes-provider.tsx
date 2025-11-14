"use client";

import { Link } from "@solvro/next-view-transitions";
import { CircleX } from "lucide-react";
import type { Route } from "next";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { UnsavedChangesContext } from "@/hooks/use-unsaved-changes";
import type { WrapperProps } from "@/types/components";

const DEFAULT_CONFIRM_NAVIGATION_ROUTE: Route = "/";

export function UnsavedChangesProvider({ children }: WrapperProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmNavigationTo, setConfirmNavigationTo] = useState<Route | null>(
    null,
  );

  useEffect(() => {
    const handleBeforeUnload = (event_: BeforeUnloadEvent) => {
      if (
        hasUnsavedChanges &&
        !env.NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION
      ) {
        event_.preventDefault();
        return true;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showConfirmDialog: (value) => {
          setConfirmNavigationTo(value as Route);
        },
      }}
    >
      <AlertDialog
        open={confirmNavigationTo != null}
        onOpenChange={(open) => {
          setConfirmNavigationTo(
            open ? DEFAULT_CONFIRM_NAVIGATION_ROUTE : null,
          );
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Niezapisane zmiany</AlertDialogTitle>
            <AlertDialogDescription>
              Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?
              Wszelkie niezapisane zmiany będą utracone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Anuluj</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" asChild>
                <Link
                  href={confirmNavigationTo ?? DEFAULT_CONFIRM_NAVIGATION_ROUTE}
                >
                  Kontynuuj <CircleX />
                </Link>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </UnsavedChangesContext.Provider>
  );
}
