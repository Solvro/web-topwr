import Image from "next/image";
import type { ImageProps, StaticImageData } from "next/image";

import textColorIcon from "@/assets/text-color-icon.svg";

export function TextColorIcon(props: Omit<ImageProps, "src" | "alt">) {
  return (
    <Image src={textColorIcon as StaticImageData} alt="Text color" {...props} />
  );
}
