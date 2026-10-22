import Image from "next/image";
import type { StaticImageData } from "next/image";

import SolvroLogoWhite from "@/assets/logos/solvro-white.svg";
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";

import { FooterLink } from "./footer-link";

export function FooterCreators() {
  return (
    <FooterLink
      href={SOLVRO_WEBPAGE_URL}
      className="text-foreground flex h-fit w-fit items-center gap-2 text-xl transition-opacity hover:opacity-80"
    >
      <Image
        src={SolvroLogoWhite as StaticImageData}
        alt=""
        className="h-8 w-auto"
      />
      KN Solvro
    </FooterLink>
  );
}
