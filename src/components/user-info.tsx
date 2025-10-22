"use client";

import { useAuth } from "@/hooks/use-auth";
import { getUserDisplayName } from "@/lib/helpers";

import { Badge } from "./ui/badge";

export function UserInfo() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <>
      Zalogowano jako <Badge>{getUserDisplayName(auth.user)}</Badge>
    </>
  );
}
