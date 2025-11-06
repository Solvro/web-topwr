"use client";

import { CircleX } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { LinkProps } from "next/link";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/config/env";
import { UnsavedChangesContext } from "@/hooks/use-unsaved-changes";
import type { LayoutProps } from "@/types/components";

import { Button } from "../ui/button";

const DEFAULT_CONFIRM_NAVIGATION_ROUTE: Route = "/";

export function UnsavedChangesProvider({ children }: LayoutProps) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmNavigationTo, setConfirmNavigationTo] = useState<
    LinkProps<Route>["href"] | null
  >(null);

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
        showConfirmDialog: setConfirmNavigationTo,
      }}
    >
      <Dialog
        open={confirmNavigationTo != null}
        onOpenChange={(open) => {
          setConfirmNavigationTo(
            open ? DEFAULT_CONFIRM_NAVIGATION_ROUTE : null,
          );
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Niezapisane zmiany</DialogTitle>
            <DialogDescription>
              Masz niezapisane zmiany. Czy na pewno chcesz opuścić tę stronę?
              Wszelkie niezapisane zmiany będą utracone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive" asChild>
                <Link
                  href={confirmNavigationTo ?? DEFAULT_CONFIRM_NAVIGATION_ROUTE}
                >
                  Kontynuuj <CircleX />
                </Link>
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="secondary">Anuluj</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </UnsavedChangesContext.Provider>
  );
}
