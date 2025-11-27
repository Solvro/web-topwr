import type { LucideProps } from "lucide-react";
import { forwardRef } from "react";

/**
 * Text color icon (letter "A" with underline) matching Lucide icon style.
 */
export const TextColorIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ size, absoluteStrokeWidth, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={
        absoluteStrokeWidth === true ? (24 / Number(size ?? 24)) * 2 : 2
      }
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 20h16" />
      <path d="m6 16 6-12 6 12" />
      <path d="M8 12h8" />
    </svg>
  ),
);

TextColorIcon.displayName = "TextColorIcon";
