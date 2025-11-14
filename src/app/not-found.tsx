import { MainContent } from "@/components/main-content";
import { ErrorMessage } from "@/components/presentation/error-message";
import { Navbar } from "@/components/presentation/navbar";
import { ApplicationError } from "@/config/enums";
import { getAuthStateServer } from "@/features/authentication/server";

export default async function NotFound() {
  const authState = await getAuthStateServer();
  return (
    <>
      <Navbar authState={authState} />
      <MainContent>
        <ErrorMessage type={ApplicationError.NotFound} />
      </MainContent>
    </>
  );
}
