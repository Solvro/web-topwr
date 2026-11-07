import {
  CircleParking,
  GraduationCap,
  Map,
  Radio,
  Utensils,
} from "lucide-react";

import CampusMapPreview from "@/assets/images/app-features/campus-map.jpg";
import ParkingsPreview from "@/assets/images/app-features/parkings.jpg";

import type { AppFeature } from "./types";

export const AUTO_SWITCH_INTERVAL_MS = 5000;

export const APP_FEATURES = [
  {
    id: "campusMap",
    icon: Map,
    hue: 125,
    preview: CampusMapPreview,
  },
  {
    id: "parkings",
    icon: CircleParking,
    hue: 255,
    preview: ParkingsPreview,
  },
  {
    id: "sksMenu",
    icon: Utensils,
    hue: 55,
    preview: CampusMapPreview,
  },
  {
    id: "studentOrganizations",
    icon: GraduationCap,
    hue: 150,
    preview: CampusMapPreview,
  },
  {
    id: "radioLuz",
    icon: Radio,
    hue: 25,
    preview: CampusMapPreview,
  },
] as const satisfies AppFeature[];
