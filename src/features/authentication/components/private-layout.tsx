import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";
import { Bouncer } from "@/features/authentication";
import type { LayoutProps } from "@/types/components";

import { getAuthStateServer } from "../lib/get-auth-state.server";

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
