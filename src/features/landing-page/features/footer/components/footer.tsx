import { Heart } from "lucide-react";

import { DownloadBannerCta } from "./download-banner-cta";
import { FooterAffiliation } from "./footer-affiliation";
import { FooterBrand } from "./footer-brand";
import { FooterCreators } from "./footer-creators";
import { FooterPartners } from "./footer-partners";
import { FooterSocialLinks } from "./footer-social-links";

export function LandingFooter() {
  return (
    <footer className="dark w-full pt-20">
      <div className="relative z-10 container mx-auto -mb-28 max-w-6xl px-2 md:px-6">
        <DownloadBannerCta />
      </div>

      <div className="bg-background text-muted-foreground pt-44 pb-8">
        <div className="container mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-end md:justify-between md:px-6">
          <FooterBrand />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FooterAffiliation label="Tworzone przez">
              <FooterCreators />
            </FooterAffiliation>
            <FooterAffiliation label="Partner">
              <FooterPartners />
            </FooterAffiliation>
          </div>
        </div>

        <FooterSocialLinks className="mt-8 mb-4 px-2 md:hidden" />

        <div className="border-border border-t pt-6 md:mt-12 md:pt-8">
          <div className="container mx-auto flex max-w-6xl flex-col-reverse gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p className="flex items-center gap-1 text-xs">
              Made with
              <Heart
                aria-label="love"
                className="fill-primary text-primary size-3"
              />
              by Solvro © {new Date().getFullYear()}
            </p>
            <FooterSocialLinks className="hidden md:block" />
          </div>
        </div>
      </div>
    </footer>
  );
}
