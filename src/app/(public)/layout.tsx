import { redirect } from "next/navigation";

import { ContentWrapper } from "@/components/content-wrapper";
import { getUser } from "@/lib/data-access";
import type { LayoutProps } from "@/types/components";

export default async function PublicLayout({ children }: LayoutProps) {
  const user = await getUser();

  if (user != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect("/");
  }

  return <ContentWrapper>{children}</ContentWrapper>;
}
