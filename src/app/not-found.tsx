import { ContentWrapper } from "@/components/content-wrapper";
import { ErrorMessage } from "@/components/error-message";
import { Navbar } from "@/components/navbar";
import { ApplicationError } from "@/config/enums";
import { getAuthStateServer } from "@/features/authentication/server";

export default async function NotFound() {
  const authState = await getAuthStateServer();
  return (
    <>
      <Navbar authState={authState} />
      <ContentWrapper>
        <ErrorMessage type={ApplicationError.NotFound} />
      </ContentWrapper>
    </>
  );
}
