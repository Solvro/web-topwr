import type { LayoutProps } from "@/types/app";

/** Used to wrap the children in a layout component. */
export function ContentWrapper({ children }: LayoutProps) {
  return <div className="w-full grow">{children}</div>;
}
