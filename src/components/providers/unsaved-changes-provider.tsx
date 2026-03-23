"use client";

import { Link } from "@solvro/next-view-transitions";
import { CircleX } from "lucide-react";
import type { Route } from "next";
import { useEffect, useRef, useState } from "react";

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
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
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

  useEffect(() => {
    let ignoreNextPopState = false;

    const handlePopState = (_event: PopStateEvent) => {
      if (ignoreNextPopState) {
        ignoreNextPopState = false;
        return;
      }

      if (
        hasUnsavedChangesRef.current &&
        !env.NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION
      ) {
        ignoreNextPopState = true;
        window.history.go(1);
        // eslint-disable-next-line no-alert
        const shouldNavigate = window.confirm(
          "Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę? Wszelkie niezapisane zmiany będą utracone.",
        );

        if (shouldNavigate) {
          setHasUnsavedChanges(false);
          hasUnsavedChangesRef.current = false;
          window.history.back();
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
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
