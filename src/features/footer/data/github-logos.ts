import type { StaticImageData } from "next/image";

import GitHubLogoColor from "@/assets/logos/github-color.svg";
import GitHubLogoWhite from "@/assets/logos/github-white.svg";

import type { ImageTuple } from "../types/internal";

const width = 20;
const height = 20;

export const GITHUB_LOGOS = [
  {
    src: GitHubLogoColor as StaticImageData,
    alt: "Logo GitHuba kolorowe",
    width,
    height,
  },
  {
    src: GitHubLogoWhite as StaticImageData,
    alt: "Logo GitHuba białe",
    width,
    height,
  },
] as const satisfies ImageTuple;
