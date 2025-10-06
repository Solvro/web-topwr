import type { ReactNode } from "react";

import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
