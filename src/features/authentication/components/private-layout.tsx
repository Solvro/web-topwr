import "server-only";

import { Resource } from "@/features/resources";
import type { WrapperProps } from "@/types/components";

import { getAuthStateServer } from "../utils/get-auth-state.server";
import { Bouncer } from "./bouncer";
import { CurrentUserProvider } from "./current-user-provider";

export async function PrivateLayout({ children }: WrapperProps) {
  const authState = await getAuthStateServer();
  return (
    <Bouncer route={`/${Resource.Dashboard}`}>
      <CurrentUserProvider user={authState?.user ?? null}>
        {children}
      </CurrentUserProvider>
    </Bouncer>
  );
}
