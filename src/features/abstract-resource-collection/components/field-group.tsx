import { cn } from "@/lib/utils";
import type { WrapperProps } from "@/types/components";

export function FieldGroup({
  children,
  className,
}: WrapperProps & {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "col-span-full grid grid-cols-subgrid gap-[inherit]",
        className,
      )}
    >
      {children}
    </div>
  );
}
