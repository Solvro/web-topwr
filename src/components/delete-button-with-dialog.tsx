import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Resource } from "@/types/app";

export function DeleteButtonWithDialog({
  resource,
  id,
}: {
  resource: Resource;
  id: number;
}) {
  const handleDelete = () => {
    // TODO
    // eslint-disable-next-line no-console
    console.log(`Delete called for resource: ${resource}, id: ${String(id)}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-destructive h-10 w-10">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy na pewno chcesz usunąć ten element?</DialogTitle>
          <DialogDescription>Tego kroku nie można cofnąć.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex w-full gap-2 p-4">
          <Button
            variant="destructive"
            className="h-12 w-1/2"
            onClick={handleDelete}
          >
            Usuń
          </Button>
          <DialogTrigger asChild>
            <Button variant="secondary" className="h-12 w-1/2">
              Anuluj
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
}
