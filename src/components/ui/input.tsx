import * as React from "react";

import { cn } from "@/lib/utils";

import { InputSlot } from "../inputs/input-slot";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputSlot
      as="input"
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
