import { redirect } from "next/navigation";
import "server-only";

import { ContentWrapper } from "@/components/content-wrapper";
import { Navbar } from "@/components/navbar";
import type { LayoutProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";

export async function PublicLayout({ children }: LayoutProps) {
  const authState = await getAuthStateServer();

  if (authState != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect("/");
  }

  return (
    <>
      <Navbar authState={null} />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  );
}
