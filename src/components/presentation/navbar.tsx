"use client";

import { UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

import { Link } from "@/components/core/link";
import { ThemeToggle } from "@/components/core/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthentication } from "@/features/authentication";
import type { User } from "@/features/authentication/types";
import { FooterAuthor, FooterSource } from "@/features/footer";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { LogoutButton } from "./logout-button";

function UserProfileMenu({ user }: { user: User | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="rounded-full"
          aria-label="Menu użytkownika"
        >
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
          {user == null ? (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/login">Zaloguj się</Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="font-normal">
              {user.fullName ?? user.email}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>O aplikacji</DropdownMenuLabel>
          <DropdownMenuItem asChild className="cursor-pointer">
            <FooterAuthor compact />
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <FooterSource compact />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {user != null && (
          <>
            <DropdownMenuSeparator />
            <LogoutButton />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { user } = useAuthentication();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isOverlayPage = pathname === "/" || isLoginPage;

  return (
    <header
      className={cn(
        "top-0 z-50 container mx-auto flex flex-row items-center justify-between",
        isOverlayPage ? "absolute inset-x-0" : "",
      )}
    >
      <Link href="/" passHref className="w-32 p-4">
        <Logo
          variant={isLoginPage ? "white" : "dynamic"}
          className="h-auto w-full"
        />
      </Link>
      <nav className="flex items-center gap-2 p-4 sm:gap-4">
        <UserProfileMenu user={user} />
        <ThemeToggle
          className="rounded-full"
          variant={isLoginPage ? "outline" : "ghost"}
        />
      </nav>
    </header>
  );
}
