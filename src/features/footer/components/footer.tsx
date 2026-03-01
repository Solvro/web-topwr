import { Dot } from "lucide-react";

import { cn } from "@/lib/utils";

import type { FooterSectionProps } from "../types/internal";
import { FooterAuthor } from "./footer-author";
import { FooterSource } from "./footer-source";

export function Footer({
  className,
  ...props
}: FooterSectionProps & {
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "flex items-center justify-center gap-2 transition-colors duration-300",
        { "text-background": props.invertColors },
        className,
      )}
    >
      Copyright © 2025-2026 <FooterAuthor {...props} />
      <Dot />
      <FooterSource {...props} />
    </footer>
  );
}
