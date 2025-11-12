"use client";

import { getUserDisplayName, useAuth } from "@/features/authentication";

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
