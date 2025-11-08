import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ComponentProps } from "react";

import LogoToPWRColor from "@/assets/logo-topwr-color.svg";
import LogoToPWRWhite from "@/assets/logo-topwr-white.svg";

export function Logo({
  variant,
  style,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  variant: "color" | "white";
}) {
  return (
    <Image
      src={
        (variant === "color"
          ? LogoToPWRColor
          : LogoToPWRWhite) as StaticImageData
      }
      alt="Logo ToPWR"
      style={{ ...style, viewTransitionName: "topwr-logo" }}
      {...props}
    />
  );
}
