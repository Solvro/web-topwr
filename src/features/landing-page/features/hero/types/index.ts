export type Point = [x: number, y: number];

export interface BlobShape {
  /** SVG path data */
  path: string;
  viewBox: { x: number; y: number; width: number; height: number };
}

export interface BlobConfig {
  shape: BlobShape;
  color: string;
  /** End color of the linear gradient; the blob is solid when omitted */
  gradientColor?: string;
  /** Gradient points as fractions of the shape size, like in an SVG linearGradient */
  gradientStart?: Point;
  gradientEnd?: Point;
  /**
   * How far the canvas extends past each side of the box, as a fraction of the box size.
   * Gives the outline room to move when the shape touches the box edges.
   */
  bleed?: number;
}
