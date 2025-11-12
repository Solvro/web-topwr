"use client";

import {
  getUserDisplayName,
  useAuthentication,
} from "@/features/authentication";

import { Badge } from "./ui/badge";

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
