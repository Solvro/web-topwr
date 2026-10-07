import Image from "next/image";

import { Button } from "@/components/ui/button";

import type { MobileAppStoreLink } from "../types";
import { FooterLink } from "./footer-link";

export function MobileAppStoreButton({
  mobileAppStore,
}: {
  mobileAppStore: MobileAppStoreLink;
}) {
  return (
    <Button
      className="bg-foreground text-background hover:bg-foreground/90 h-auto gap-3 rounded-lg"
      asChild
    >
      <FooterLink href={mobileAppStore.href}>
        <Image
          src={mobileAppStore.logo}
          alt=""
          className="size-5 shrink-0 dark:invert"
        />
        <span className="flex flex-col text-left leading-tight">
          <span className="text-background/70 text-xs">Pobierz z</span>
          <span className="font-semibold">{mobileAppStore.name}</span>
        </span>
      </FooterLink>
    </Button>
  );
}
