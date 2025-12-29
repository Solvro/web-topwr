import "react";

declare module "react" {
  // interface instead of record to allow declaration merging with React's CSSProperties (not possible with type alias)
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface CSSProperties {
    [name: `--${string}`]: string | number;
  }
}
