import type { ReactNode } from "react";

/** Used to wrap the children in a layout component. */
export function ContentWrapper({ children }: { children: ReactNode }) {
  return <div className="w-full grow">{children}</div>;
}
