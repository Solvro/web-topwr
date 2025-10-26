import { ContentWrapper } from "@/components/content-wrapper";
import { ErrorMessage } from "@/components/error-message";
import { Navbar } from "@/components/navbar";
import { ApplicationError } from "@/config/enums";
import { getAuthState, permit } from "@/lib/data-access";
import type { LayoutProps } from "@/types/components";

export default async function PrivateLayout({ children }: LayoutProps) {
  const authState = await getAuthState();
  const hasPermission = await permit("/");

  return (
    <>
      <Navbar authState={authState} />
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
