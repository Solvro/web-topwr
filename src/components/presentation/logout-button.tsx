"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/features/authentication";
import { useMutationWrapper } from "@/features/backend";
import { useRouter } from "@/hooks/use-router";

export function LogoutButton() {
  const { logout, clearAuthState } = useAuthentication();
  const router = useRouter();

  const { mutate: handleLogout, isPending } = useMutationWrapper<
    unknown,
    unknown,
    Error
  >(
    "logout",
    async () => {
      await logout();
    },
    {
      onSuccess: () => {
        router.push("/login", {
          onSnapshotTaken: () => {
            clearAuthState();
            toast.success("Wylogowano pomyślnie.");
          },
        });
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        toast.error(
          error instanceof Error
            ? `Błąd podczas wylogowania: ${error.message}`
            : "Nie udało się wylogować. Spróbuj ponownie.",
        );
      },
    },
  );

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
