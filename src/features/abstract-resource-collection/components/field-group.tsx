import { cn } from "@/lib/utils";
import type { LayoutProps } from "@/types/components";

export function FieldGroup({
  children,
  className,
}: LayoutProps & {
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
