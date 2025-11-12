import "server-only";

import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";
import type { LayoutProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";
import { Bouncer } from "./bouncer";

export async function PrivateLayout({ children }: LayoutProps) {
  const authState = await getAuthStateServer();

  return (
    <>
      <Navbar authState={authState} />
      <ContentWrapper>
        <Bouncer route="/">{children}</Bouncer>
      </ContentWrapper>
    </>
  );
}
