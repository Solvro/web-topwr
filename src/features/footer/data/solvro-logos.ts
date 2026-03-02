import type { StaticImageData } from "next/image";

import SolvroLogoColor from "@/assets/logos/solvro-color.svg";
import SolvroLogoWhite from "@/assets/logos/solvro-white.svg";

import type { ImageTuple } from "../types/internal";

const width = 31;

export const SOLVRO_LOGOS = [
  {
    src: SolvroLogoColor as StaticImageData,
    alt: "Logo KN Solvro kolorowe",
    width,
  },
  {
    src: SolvroLogoWhite as StaticImageData,
    alt: "Logo KN Solvro białe",
    width,
  },
] as const satisfies ImageTuple;
