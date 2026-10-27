import type { LucideIcon } from "lucide-react";
import type { Messages } from "next-intl";

export interface AppFeature {
  id: keyof Messages["AppFeatures"]["features"];
  icon: LucideIcon;
  hue: number;
}
