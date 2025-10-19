import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";
import type { LayoutProps } from "@/types/app";

export default function AuthenticatedLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
