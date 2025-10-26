import { redirect } from "next/navigation";

import { ContentWrapper } from "@/components/content-wrapper";
import { getAuthState } from "@/lib/data-access";
import type { LayoutProps } from "@/types/components";

export default async function PublicLayout({ children }: LayoutProps) {
  const authState = await getAuthState();

  if (authState != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect("/");
  }

  return <ContentWrapper>{children}</ContentWrapper>;
}
