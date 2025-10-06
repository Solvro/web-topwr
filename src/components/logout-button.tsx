"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

import { Button } from "./ui/button";

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
