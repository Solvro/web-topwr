"use client";

import { LogOut } from "lucide-react";
import { useTransitionRouter } from "next-view-transitions";
import { useTopLoader } from "nextjs-toploader";

import { useAuth } from "@/hooks/use-auth";

import { Button } from "./ui/button";

export function LogoutButton() {
  const auth = useAuth();
  const router = useTransitionRouter();
  const topLoader = useTopLoader();

  return (
    <Button
      variant="ghost"
      className="aspect-square h-10 rounded-full"
      onClick={async () => {
        await auth.logout();
        topLoader.start();
        router.push("/login");
      }}
      tooltip="Wyloguj się"
    >
      <LogOut />
    </Button>
  );
}
