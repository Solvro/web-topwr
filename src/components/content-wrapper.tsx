import type { LayoutProps } from "@/types/components";

/** Used to wrap the main content children in a layout component. */
export function ContentWrapper({ children }: LayoutProps) {
  return <main className="w-full grow">{children}</main>;
}
