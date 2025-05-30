"use client";

import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import TOPWRLogo from "@/../public/logo-topwr-color.png";
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

  if (pathname === "/login") {
    return null;
  }

  return (
    <nav className="">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <Link href="/" passHref className="w-32 p-4">
          <Image src={TOPWRLogo} alt={""} className="h-auto w-full" />
        </Link>
        <div className="space-x-4 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="aspect-square h-10 rounded-full">
                <UserRound />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* //TODO */}
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Logged as: </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant={"ghost"}
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
