import type { ImageProps } from "next/image";

export function MockImage({ alt, src, ...props }: ImageProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} src={src as string} />;
}
