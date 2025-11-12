import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ComponentProps } from "react";

import LogoToPWRColor from "@/assets/logo-topwr-color.svg";
import LogoToPWRWhite from "@/assets/logo-topwr-white.svg";
import { cn } from "@/lib/utils";

export function Logo({
  variant,
  style,
  ...props
}: Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
  variant: "color" | "white" | "dynamic";
}) {
  if (variant === "dynamic") {
    return (
      <>
        <Logo
          {...props}
          variant="color"
          className={cn("dark:hidden", props.className)}
        />
        <Logo
          {...props}
          variant="white"
          className={cn("not-dark:hidden", props.className)}
        />
      </>
    );
  }
  return (
    <Image
      src={
        (variant === "color"
          ? LogoToPWRColor
          : LogoToPWRWhite) as StaticImageData
      }
      alt="Logo ToPWR"
      style={{ viewTransitionName: "topwr-logo", ...style }}
      {...props}
    />
  );
}
