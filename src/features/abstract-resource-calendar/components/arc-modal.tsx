import type { ReactNode } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export function GenericModal({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="h-max max-h-[80vh] max-w-lg"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
