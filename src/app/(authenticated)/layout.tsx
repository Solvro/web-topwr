import { ContentWrapper } from "@/components/content-wrapper";
import { ErrorMessage } from "@/components/error-message";
import { Navbar } from "@/components/navbar";
import { ApplicationError } from "@/config/enums";
import { permit } from "@/lib/data-access";
import type { LayoutProps } from "@/types/components";

export default async function AuthenticatedLayout({ children }: LayoutProps) {
  const hasPermission = await permit("/");

  return (
    <>
      <Navbar />
      <ContentWrapper>
        {hasPermission ? (
          children
        ) : (
          <ErrorMessage type={ApplicationError.Forbidden} />
        )}
      </ContentWrapper>
    </>
  );
}
