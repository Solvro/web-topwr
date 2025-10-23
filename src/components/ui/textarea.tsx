import * as React from "react";

import { InputSlot } from "@/components/inputs/input-slot";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <InputSlot asChild>
      <textarea
        data-slot="textarea"
        className={cn(
          "placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        {...props}
      />
    </InputSlot>
  );
}

export { Textarea };
