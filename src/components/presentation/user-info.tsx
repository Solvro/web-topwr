"use client";

import { Badge } from "@/components/ui/badge";
import {
  getUserDisplayName,
  useAuthentication,
} from "@/features/authentication";

export function UserInfo() {
  const auth = useAuthentication();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <>
      Zalogowano jako <Badge>{getUserDisplayName(auth.user)}</Badge>
    </>
  );
}
