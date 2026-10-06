import type { Route } from "next";
import type { StaticImageData } from "next/image";

export interface SocialLink {
  label: string;
  href: Route;
  logo: StaticImageData;
}

export interface MobileAppStoreLink {
  name: string;
  href: Route;
  logo: StaticImageData;
}
