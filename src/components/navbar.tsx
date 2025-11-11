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
import type { AuthState, User } from "@/types/api";

import { Logo } from "./logo";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "./theme-toggle";

function UserProfileMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full">
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            {user.fullName ?? user.email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar({ authState }: { authState: AuthState | null }) {
  const user = authState?.user;
  if (user == null) {
    return (
      <nav className="absolute right-0 m-2">
        <ThemeToggle variant="secondary" />
      </nav>
    );
  }

  return (
    <header className="container mx-auto flex flex-row items-center justify-between">
      <Link href="/" passHref className="w-32 p-4">
        <Logo variant="dynamic" className="h-auto w-full" />
      </Link>
      <nav className="flex items-center gap-2 p-4 sm:gap-4">
        <UserProfileMenu user={user} />
        <ThemeToggle className="rounded-full" />
        <LogoutButton />
      </nav>
    </header>
  );
}
