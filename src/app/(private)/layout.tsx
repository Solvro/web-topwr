import { Bouncer } from "@/components/bouncer";
import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";
import { getAuthState } from "@/lib/data-access";
import type { LayoutProps } from "@/types/components";

export default async function PrivateLayout({ children }: LayoutProps) {
  const authState = await getAuthState();

  return (
    <>
      <Navbar authState={authState} />
      <ContentWrapper>
        <Bouncer route="/">{children}</Bouncer>
      </ContentWrapper>
    </>
  );
}
