import { DEFAULT_IMAGE_HEIGHT } from "../constants";
import type { ImageTuple } from "../types/internal";

const invertImages = (images: ImageTuple, invert: boolean): ImageTuple =>
  invert ? (images.toReversed() as ImageTuple) : images;

const compactImages = (images: ImageTuple): ImageTuple =>
  images.map((logo) => ({
    ...logo,
    height: (logo.height ?? DEFAULT_IMAGE_HEIGHT) * 0.75,
  })) as ImageTuple;

export const constructImages = (
  images: ImageTuple,
  invert: boolean,
  compact: boolean,
) => {
  const baseImages = invertImages(images, invert);
  return compact ? compactImages(baseImages) : baseImages;
};
