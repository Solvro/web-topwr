import { cn } from "@/lib/utils";
import type { WrapperProps } from "@/types/components";

export function InputRow({
  children,
  className,
}: WrapperProps & {
  className?: string;
}) {
  return (
    <div className={cn("flex flex-row flex-wrap gap-4", className)}>
      {children}
    </div>
  );
}
