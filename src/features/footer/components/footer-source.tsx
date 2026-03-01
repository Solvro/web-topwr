import { REPOSITORY_URL } from "../constants";
import { GITHUB_LOGOS } from "../data/github-logos";
import type { FooterSectionProps } from "../types/internal";
import { FooterLink } from "./footer-link";

export function FooterSource(props: FooterSectionProps) {
  return (
    <FooterLink
      href={REPOSITORY_URL}
      label="Kod źródłowy"
      images={GITHUB_LOGOS}
      {...props}
    />
  );
}
