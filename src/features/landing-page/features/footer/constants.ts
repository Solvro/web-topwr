import type { StaticImageData } from "next/image";

import AppleLogoWhite from "@/assets/logos/apple-white.svg";
import FacebookLogoWhite from "@/assets/logos/facebook-white.svg";
import GithubLogoWhite from "@/assets/logos/github-white.svg";
import GooglePlayLogoWhite from "@/assets/logos/google-play-white.svg";
import InstagramLogoWhite from "@/assets/logos/instagram-white.svg";
import LinkedinLogoWhite from "@/assets/logos/linkedin-white.svg";
import WebsiteLogoWhite from "@/assets/logos/website-white.svg";
import { SOLVRO_WEBPAGE_URL } from "@/config/constants";

import type { MobileAppStoreLink, SocialLink } from "./types";

export const PWR_WEBPAGE_URL = "https://pwr.edu.pl/";

export const MOBILE_APP_STORE_LINKS = [
  {
    name: "Google Play",
    href: "https://play.google.com/store/apps/details?id=com.solvro.topwr",
    logo: GooglePlayLogoWhite as StaticImageData,
  },
  {
    name: "App Store",
    href: "https://apps.apple.com/pl/app/topwr/id1644647395",
    logo: AppleLogoWhite as StaticImageData,
  },
] as const satisfies MobileAppStoreLink[];

export const SOCIAL_LINKS = [
  {
    label: "Strona internetowa",
    href: SOLVRO_WEBPAGE_URL,
    logo: WebsiteLogoWhite as StaticImageData,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/knsolvro/",
    logo: InstagramLogoWhite as StaticImageData,
  },
  {
    label: "GitHub",
    href: "https://github.com/Solvro",
    logo: GithubLogoWhite as StaticImageData,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/knsolvro/",
    logo: LinkedinLogoWhite as StaticImageData,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/knsolvro",
    logo: FacebookLogoWhite as StaticImageData,
  },
] as const satisfies SocialLink[];
