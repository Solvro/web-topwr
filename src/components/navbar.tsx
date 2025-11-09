"use client";

import { useHydrateAtoms } from "jotai/utils";
import { UserRound } from "lucide-react";

import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { authStateAtom } from "@/stores/auth";
import type { AuthState } from "@/types/api";

import { Logo } from "./logo";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar({ authState }: { authState: AuthState | null }) {
  useHydrateAtoms([[authStateAtom, authState]]);
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    // this should only happen when the auth state is changed but the redirect target page is still loading
    // i.e. in practice only during dev when the page isn't compiled yet
    return null;
  }

  return (
    <nav>
      <div className="container mx-auto flex flex-row items-center justify-between">
        <Link href="/" passHref className="w-32 p-4">
          <Logo variant="dynamic" className="h-auto w-full" />
        </Link>
        <div className="space-x-4 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="aspect-square h-10 rounded-full">
                <UserRound />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 w-56">
              <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  {auth.user.fullName ?? auth.user.email}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
