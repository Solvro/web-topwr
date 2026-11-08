import { useTranslations } from "next-intl";
import Image from "next/image";
import type { StaticImageData } from "next/image";

import DownloadQr from "@/assets/images/download-qr.svg";
import { SplitText } from "@/components/fancy/split-text";
import { LandingCard } from "@/features/landing-page/components";
import {
  REVEAL_TRANSITION,
  VIEWPORT_OFFSET,
} from "@/features/landing-page/constants";

import { MOBILE_APP_STORE_LINKS } from "../constants";
import { BallpitHint } from "./ballpit-hint";
import { DownloadBannerBallpit } from "./download-banner-ballpit";
import { MobileAppStoreButton } from "./mobile-app-store-button";

export function DownloadBannerCta() {
  const t = useTranslations("Footer");

  return (
    <LandingCard asChild className="bg-background h-120 select-none md:h-160">
      <section>
        <DownloadBannerBallpit />
        <div className="from-background via-background/80 pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-linear-to-b to-transparent" />

        <div className="pointer-events-none relative flex flex-col items-center px-6 pt-12 text-center md:pt-16">
          <SplitText
            tag="h2"
            viewportMargin={VIEWPORT_OFFSET}
            {...REVEAL_TRANSITION}
            text={t("downloadTitle")}
            className="text-foreground mb-4 block max-w-xl text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
          />
          <p className="text-muted-foreground mb-8 max-w-md text-lg text-pretty">
            {t("downloadDescription")}
          </p>
          <div className="md:border-border md:bg-background/80 pointer-events-auto flex items-center gap-3 md:rounded-2xl md:border md:p-3 md:backdrop-blur-md">
            <Image
              src={DownloadQr as StaticImageData}
              alt={t("scanToDownload")}
              className="hidden size-30 shrink-0 rounded-xl md:block"
            />
            <div className="grid grid-cols-2 gap-3 md:flex md:flex-col">
              {MOBILE_APP_STORE_LINKS.map((mobileAppStore) => (
                <MobileAppStoreButton
                  key={mobileAppStore.name}
                  mobileAppStore={mobileAppStore}
                />
              ))}
            </div>
          </div>
        </div>

        <BallpitHint />
      </section>
    </LandingCard>
  );
}
