import type { LayoutProps } from "@/types/components";

/** Used to wrap the children in a layout component. */
export function ContentWrapper({ children }: LayoutProps) {
  return <div className="w-full grow">{children}</div>;
}
