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

export function DeleteButtonWithDialog({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resource,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
}: {
  resource: string;
  id: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="h-10 w-10 text-red-500">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Czy na pewno chcesz usunąć ten element?</DialogTitle>
          <DialogDescription>Tego kroku nie można cofnąć.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex w-full gap-2 p-4">
          <Button variant="destructive" className="h-12 w-1/2">
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
