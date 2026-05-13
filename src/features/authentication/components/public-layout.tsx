import { redirect } from "next/navigation";
import "server-only";

import { Resource } from "@/features/resources";
import type { WrapperProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";

export async function PublicLayout({ children }: WrapperProps) {
  const authState = await getAuthStateServer();

  if (authState != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect(`/${Resource.Dashboard}`);
  }

  return children;
}
