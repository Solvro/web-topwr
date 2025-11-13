import "server-only";

import { MainContent } from "@/components/main-content";
import { Navbar } from "@/components/presentation/navbar";
import type { WrapperProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";
import { Bouncer } from "./bouncer";

export async function PrivateLayout({ children }: WrapperProps) {
  const authState = await getAuthStateServer();

  return (
    <>
      <Navbar authState={authState} />
      <MainContent>
        <Bouncer route="/">{children}</Bouncer>
      </MainContent>
    </>
  );
}
