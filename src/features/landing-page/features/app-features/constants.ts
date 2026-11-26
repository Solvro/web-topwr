import {
  CircleParking,
  GraduationCap,
  Map,
  Radio,
  Utensils,
} from "lucide-react";

import type { AppFeature } from "./types";

export const APP_FEATURES = [
  {
    id: "campusMap",
    icon: Map,
    hue: 125,
  },
  {
    id: "parkings",
    icon: CircleParking,
    hue: 255,
  },
  {
    id: "sksMenu",
    icon: Utensils,
    hue: 55,
  },
  {
    id: "studentOrganizations",
    icon: GraduationCap,
    hue: 150,
  },
  {
    id: "radioLuz",
    icon: Radio,
    hue: 25,
  },
] as const satisfies AppFeature[];
