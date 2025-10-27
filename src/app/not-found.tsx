import { ContentWrapper } from "@/components/content-wrapper";
import { ErrorMessage } from "@/components/error-message";
import { Navbar } from "@/components/navbar";
import { ApplicationError } from "@/config/enums";
import { getAuthState } from "@/lib/data-access";

export default async function NotFound() {
  const authState = await getAuthState();
  return (
    <>
      {authState == null ? null : <Navbar authState={authState} />}
      <ContentWrapper>
        <ErrorMessage type={ApplicationError.NotFound} />
      </ContentWrapper>
    </>
  );
}
