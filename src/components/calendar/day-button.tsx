import type { DateObject } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AddEventForm } from "./add-event-form";

interface Props {
  day: number;
  today: DateObject;
  clickable?: boolean;
}

export function DayButton({ day, today, clickable = false }: Props) {
  const isCurrentDay = day === new Date().getDate();

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={cn(
            "flex h-20 items-center justify-center border",
            isCurrentDay ? "bg-blue-500 text-white" : "bg-white text-black",
            clickable ? "cursor-pointer hover:bg-gray-100" : "cursor-default",
          )}
        >
          <button disabled={!clickable}>{day}</button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] w-max">
        <DialogHeader>
          <DialogTitle>
            {today.day} {today.month.name} {today.year}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mx-auto w-full">
          <AddEventForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
