import type { Route } from "next";
import Image from "next/image";
import type { LinkProps } from "next/link";

import { Link } from "@/components/core/link";

import { DEFAULT_IMAGE_HEIGHT } from "../constants";
import { constructImages } from "../lib/construct-images";
import type { FooterSectionProps, ImageTuple } from "../types/internal";

export function FooterLink<T extends string>({
  images,
  label,
  compact = false,
  invertColors = false,
  ...props
}: Omit<LinkProps<T>, "children" | "href"> &
  FooterSectionProps & {
    href: Route<T>;
    images: ImageTuple;
    label: string;
  }) {
  const [imageLight, imageDark] = constructImages(
    images,
    invertColors,
    compact,
  );

  return (
    <Link<T> className="group relative flex items-center gap-1" {...props}>
      <div
        className="shrink-0"
        style={{ width: DEFAULT_IMAGE_HEIGHT, height: DEFAULT_IMAGE_HEIGHT }}
      >
        <Image
          src={imageLight.src}
          alt={imageLight.alt}
          className="object-contain dark:hidden"
        />
        <Image
          src={imageDark.src}
          alt={imageDark.alt}
          className="object-contain not-dark:hidden"
        />
      </div>
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
