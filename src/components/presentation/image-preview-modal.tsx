"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ImagePreviewModal({
  isOpen,
  setIsOpen,
  image,
  footer,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  image: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:w-fit md:max-w-4/5 lg:max-w-2/3">
        <DialogHeader>
          <DialogTitle>Podgląd zdjęcia</DialogTitle>
        </DialogHeader>
        <div className="grid h-fit min-h-[30svh] flex-1 place-items-center">
          {image}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Zamknij</Button>
          </DialogClose>
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
