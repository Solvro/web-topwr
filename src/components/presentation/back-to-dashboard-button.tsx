"use client";

import { ChevronsLeft } from "lucide-react";

import { ADMIN_PATH } from "@/config/constants";
import { cn } from "@/lib/utils";

import { ReturnButton } from "./return-button";

export function BackToDashboardButton({
  className,
  chevronsIcon = false,
}: {
  className?: string;
  chevronsIcon?: boolean;
}) {
  return (
    <ReturnButton
      href={ADMIN_PATH}
      target="panelu administratora"
      returnLabel="Wróć do"
      className={cn(className)}
      icon={chevronsIcon ? ChevronsLeft : undefined}
    />
  );
}
