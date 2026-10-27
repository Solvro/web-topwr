import type { ReactNode } from "react";

import type { WrapperProps } from "@/types/components";

import { Navbar } from "./navbar";

export function AppLayout({
  navbarActions,
  children,
}: WrapperProps & { navbarActions?: ReactNode }) {
  return (
    <>
      <Navbar actions={navbarActions} />
      <main className="w-full grow">{children}</main>
    </>
  );
}
