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
import { useRouter } from "@/hooks/use-router";
import { UnsavedChangesContext } from "@/hooks/use-unsaved-changes";
import type { PendingNavigation, WrapperProps } from "@/types/components";

const DEFAULT_CONFIRM_NAVIGATION_ROUTE: Route = "/";

export function UnsavedChangesProvider({ children }: WrapperProps) {
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  const ignoreNextPopStateRef = useRef(false);

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
    const handlePopState = (event: PopStateEvent) => {
      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false;
        event.stopImmediatePropagation();
        return;
      }

      if (
        !hasUnsavedChangesRef.current ||
        env.NEXT_PUBLIC_DISABLE_NAVIGATION_CONFIRMATION
      ) {
        return;
      }

      event.stopImmediatePropagation();
      ignoreNextPopStateRef.current = true;
      window.history.go(1);
      setPendingNavigation({ type: "back" });
    };

    window.addEventListener("popstate", handlePopState, { capture: true });

    return () => {
      window.removeEventListener("popstate", handlePopState, { capture: true });
    };
  }, []);

  const clearNavState = () => {
    hasUnsavedChangesRef.current = false;
    setHasUnsavedChanges(false);
    setPendingNavigation(null);
  };

  const handleConfirm = () => {
    clearNavState();
    router.back();
  };

  const handleCancel = () => {
    setPendingNavigation(null);
  };

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        setHasUnsavedChanges,
        showConfirmDialog: (value) => {
          setPendingNavigation({ type: "href", href: value as Route });
        },
      }}
    >
      <AlertDialog
        open={pendingNavigation != null}
        onOpenChange={(open) => {
          if (!open) {
            handleCancel();
          }
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
            <AlertDialogCancel onClick={handleCancel}>Anuluj</AlertDialogCancel>
            {pendingNavigation?.type === "back" ? (
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleConfirm}>
                  Kontynuuj <CircleX />
                </Button>
              </AlertDialogAction>
            ) : (
              <AlertDialogAction asChild>
                <Button variant="destructive" asChild onClick={clearNavState}>
                  <Link
                    href={
                      pendingNavigation?.href ??
                      DEFAULT_CONFIRM_NAVIGATION_ROUTE
                    }
                  >
                    Kontynuuj <CircleX />
                  </Link>
                </Button>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {children}
    </UnsavedChangesContext.Provider>
  );
}
