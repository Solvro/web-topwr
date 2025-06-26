"use client";

import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LogoToPWR from "@/../public/logo-topwr-color.png";
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

export function Navbar() {
  const router = useRouter();
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <nav className="">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <Link href="/" passHref className="w-32 p-4">
          <Image src={LogoToPWR} alt={"logo ToPWR"} className="h-auto w-full" />
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
        </div>
      </div>
    </nav>
  );
}
