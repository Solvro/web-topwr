import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { SOCIAL_LINKS } from "../constants";
import { FooterLink } from "./footer-link";

export function FooterSocialLinks({ className }: { className?: string }) {
  const t = useTranslations("Footer");

  return (
    <nav aria-label={t("socialMedia")} className={className}>
      <ul className="flex items-center gap-2">
        {SOCIAL_LINKS.map(({ label, href, logo }) => (
          <li key={href}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              asChild
            >
              <FooterLink href={href} aria-label={label ?? t("website")}>
                <Image src={logo} alt="" className="size-4" />
              </FooterLink>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
