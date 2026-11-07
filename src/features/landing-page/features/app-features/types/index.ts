import type { LucideIcon } from "lucide-react";
import type { Messages } from "next-intl";
import type { StaticImageData } from "next/image";

export interface AppFeature {
  id: keyof Messages["AppFeatures"]["features"];
  icon: LucideIcon;
  hue: number;
  preview: StaticImageData;
}
