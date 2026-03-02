import { SOLVRO_WEBPAGE_URL } from "../constants";
import { SOLVRO_LOGOS } from "../data/solvro-logos";
import type { FooterSectionProps } from "../types/internal";
import { FooterLink } from "./footer-link";

export function FooterAuthor(props: FooterSectionProps) {
  return (
    <FooterLink
      href={SOLVRO_WEBPAGE_URL}
      label="KN Solvro"
      images={SOLVRO_LOGOS}
      {...props}
    />
  );
}
