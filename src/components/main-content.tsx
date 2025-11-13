import type { WrapperProps } from "@/types/components";

/** Used to wrap the main content children in a layout component. */
export function MainContent({ children }: WrapperProps) {
  return <main className="w-full grow">{children}</main>;
}
