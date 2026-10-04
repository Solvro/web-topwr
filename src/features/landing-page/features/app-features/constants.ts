import {
  CircleParking,
  GraduationCap,
  Map,
  Radio,
  Utensils,
} from "lucide-react";

import type { AppFeature } from "./types";

const DESCRIPTION_PLACEHOLDER = "[PLACEHOLDER]";

export const APP_FEATURES = [
  {
    title: "SKS menu",
    description: DESCRIPTION_PLACEHOLDER,
    icon: Utensils,
    hue: 55,
  },
  {
    title: "Parkingi",
    description: DESCRIPTION_PLACEHOLDER,
    icon: CircleParking,
    hue: 255,
  },
  {
    title: "Organizacje studenckie",
    description: DESCRIPTION_PLACEHOLDER,
    icon: GraduationCap,
    hue: 150,
  },
  {
    title: "Mapa kampusu",
    description: DESCRIPTION_PLACEHOLDER,
    icon: Map,
    hue: 125,
  },
  {
    title: "Radio LUZ",
    description: DESCRIPTION_PLACEHOLDER,
    icon: Radio,
    hue: 25,
  },
] as const satisfies AppFeature[];
