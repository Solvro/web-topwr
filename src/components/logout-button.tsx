"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "@/hooks/use-router";

export function LogoutButton() {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="aspect-square h-10 rounded-full"
      onClick={async () => {
        await auth.logout();
        router.push("/login");
      }}
      tooltip="Wyloguj się"
    >
      <LogOut />
    </Button>
  );
}
