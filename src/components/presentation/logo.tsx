import Image from "next/image";
import type { StaticImageData } from "next/image";
import type { ComponentProps } from "react";

import LogoToPWRColor from "@/assets/logos/topwr-color.svg";
import LogoToPWRWhite from "@/assets/logos/topwr-white.svg";
import { cn } from "@/lib/utils";

export function Logo({
  variant,
  className,
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
          className={cn("dark:hidden", className)}
        />
        <Logo
          {...props}
          variant="white"
          className={cn("not-dark:hidden", className)}
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
      className={cn("h-auto w-auto", className)}
      {...props}
    />
  );
}
