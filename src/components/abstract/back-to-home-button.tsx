import { ChevronsLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { ReturnButton } from "../return-button";

export function BackToHomeButton({
  className,
  chevronsIcon = false,
}: {
  className?: string;
  chevronsIcon?: boolean;
}) {
  return (
    <ReturnButton
      href="/"
      target="stronę główną"
      returnLabel="Wróć na"
      className={cn(className)}
      icon={chevronsIcon ? ChevronsLeft : undefined}
    />
  );
}
