import { useTranslations } from "next-intl";
import Image from "next/image";
import type { StaticImageData } from "next/image";

import PwrLogoWhite from "@/assets/logos/pwr-white.svg";

import { PWR_WEBPAGE_URL } from "../constants";
import { FooterLink } from "./footer-link";

export function FooterPartners() {
  const t = useTranslations("Footer");

  return (
    <FooterLink
      href={PWR_WEBPAGE_URL}
      className="block h-fit w-fit transition-opacity hover:opacity-80"
    >
      <Image
        src={PwrLogoWhite as StaticImageData}
        alt={t("pwrLogoAlt")}
        className="h-10 w-auto"
      />
    </FooterLink>
  );
}
