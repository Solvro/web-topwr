import Image from "next/image";
import type { StaticImageData } from "next/image";

import PwrLogoWhite from "@/assets/logos/pwr-white.svg";

import { PWR_WEBPAGE_URL } from "../constants";
import { FooterLink } from "./footer-link";

export function FooterPartners() {
  return (
    <FooterLink
      href={PWR_WEBPAGE_URL}
      className="block h-fit w-fit transition-opacity hover:opacity-80"
    >
      <Image
        src={PwrLogoWhite as StaticImageData}
        alt="Politechnika Wrocławska"
        className="h-10 w-auto"
      />
    </FooterLink>
  );
}
