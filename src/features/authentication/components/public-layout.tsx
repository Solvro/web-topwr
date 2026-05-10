import { redirect } from "next/navigation";
import "server-only";

import { ADMIN_PATH } from "@/config/constants";
import type { WrapperProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";

export async function PublicLayout({ children }: WrapperProps) {
  const authState = await getAuthStateServer();

  if (authState != null) {
    // TODO?: potential to add a redirect to chosen path via query params
    return redirect(ADMIN_PATH);
  }

  return children;
}
