import type { ImageProps } from "next/image";

type StrictImageProps = Omit<ImageProps, "height"> & { height?: number };
export type ImageTuple = [light: StrictImageProps, dark: StrictImageProps];

export interface FooterSectionProps {
  invertColors?: boolean;
  compact?: boolean;
}
