"use client";

import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

function handleLogout() {
  // TODO
  //eslint-disable-next-line no-console
  console.log("logout");
}

export function Navbar() {
  const pathname = usePathname();

  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState<string | null>("user");

  if (pathname === "/login") {
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
                  Zalogowano jako: {username}
                </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            className="aspect-square h-10 rounded-full"
            onClick={handleLogout}
          >
            <LogOut />
          </Button>
        </div>
      </div>
    </nav>
  );
}
