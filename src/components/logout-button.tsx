"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/authentication";
import { useRouter } from "@/hooks/use-router";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => {
        router.push("/login", { onSnapshotTaken: logout });
      }}
      tooltip="Wyloguj się"
    >
      <LogOut />
    </Button>
  );
}
