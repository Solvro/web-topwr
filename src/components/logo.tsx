import Image from "next/image";
import type { ComponentProps } from "react";

import LogoToPWRColor from "@/assets/logo-topwr-color.png";
import LogoToPWRWhite from "@/assets/logo-topwr-white.png";

export function Logo({
  variant,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  variant: "color" | "white";
}) {
  return (
    <Image
      src={variant === "color" ? LogoToPWRColor : LogoToPWRWhite}
      alt="logo ToPWR"
      style={{ viewTransitionName: "topwr-logo" }}
      {...props}
    />
  );
}
