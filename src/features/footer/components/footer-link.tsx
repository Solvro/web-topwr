import type { Route } from "next";
import Image from "next/image";

import { Link } from "@/components/core/link";

import { DEFAULT_IMAGE_HEIGHT } from "../constants";
import { constructImages } from "../lib/construct-images";
import type { FooterSectionProps, ImageTuple } from "../types/internal";

export function FooterLink({
  images,
  href,
  label,
  compact = false,
  invertColors = false,
}: FooterSectionProps & {
  images: ImageTuple;
  href: Route;
  label: string;
}) {
  const [imageLight, imageDark] = constructImages(
    images,
    invertColors,
    compact,
  );
  return (
    <Link className="group relative flex items-center gap-1" href={href}>
      <Image
        height={DEFAULT_IMAGE_HEIGHT}
        {...imageLight}
        className="dark:hidden"
      />
      <Image
        height={DEFAULT_IMAGE_HEIGHT}
        {...imageDark}
        className="not-dark:hidden"
      />
      {compact ? (
        label
      ) : (
        <div className="underline decoration-transparent transition-colors duration-300 group-hover:decoration-current">
          {label}
        </div>
      )}
    </Link>
  );
}
