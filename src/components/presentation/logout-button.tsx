"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuthentication } from "@/features/authentication";
import { useMutationWrapper } from "@/features/backend";
import { logger, parseError } from "@/features/logging";
import { useRouter } from "@/hooks/use-router";
import { getToastMessages } from "@/lib/get-toast-messages";

export function LogoutButton() {
  const { logout, clearAuthState } = useAuthentication();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutationWrapper<
    undefined,
    null,
    unknown
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
          },
        });
      },
      onError: (error) => {
        logger.error(parseError(error), "Logout failed");
      },
    },
  );

  return (
    <DropdownMenuItem
      onClick={() => toast.promise(mutateAsync(null), getToastMessages.logout)}
      disabled={isPending}
      variant="destructive"
    >
      <LogOut className="size-4" />
      <span>Wyloguj się</span>
    </DropdownMenuItem>
  );
}
