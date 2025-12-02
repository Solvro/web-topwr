"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/features/authentication";
import { useRouter } from "@/hooks/use-router";

export function LogoutButton() {
  const { logoutRequest, clearAuthState } = useAuthentication();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      await logoutRequest();

      router.push("/login", {
        onSnapshotTaken: () => {
          clearAuthState();
          toast.success("Wylogowano pomyślnie.");
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(
        error instanceof Error
          ? `Błąd podczas wylogowania: ${error.message}`
          : "Nie udało się wylogować. Spróbuj ponownie.",
      );
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleLogout}
      disabled={isPending}
      tooltip={isPending ? "Wylogowywanie..." : "Wyloguj się"}
    >
      <LogOut />
    </Button>
  );
}
