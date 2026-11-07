import { useTranslations } from "next-intl";
import Image from "next/image";

import CampusPhoto from "@/assets/images/pwr-campus.png";
import { SplitText } from "@/components/fancy/split-text";
import {
  REVEAL_TRANSITION,
  VIEWPORT_OFFSET,
} from "@/features/landing-page/constants";

import { MOBILE_APP_STORE_LINKS } from "../constants";
import { MobileAppStoreButton } from "./mobile-app-store-button";

export function DownloadBannerCta() {
  const t = useTranslations("Footer");

  return (
    <section className="border-border bg-background relative overflow-hidden rounded-3xl border p-8 shadow-2xl md:p-14">
      <Image
        src={CampusPhoto}
        alt=""
        fill
        sizes="(min-width: 72rem) 72rem, 100vw"
        placeholder="blur"
        className="object-cover"
      />
      <div className="from-background via-background/90 to-background/25 absolute inset-0 bg-linear-to-br" />

      <div className="relative">
        <SplitText
          tag="h2"
          viewportMargin={VIEWPORT_OFFSET}
          {...REVEAL_TRANSITION}
          text={t("downloadTitle")}
          className="text-foreground mb-4 block max-w-md text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl"
        />
        <p className="text-muted-foreground mb-6 max-w-sm text-lg">
          {t("downloadDescription")}
        </p>
        <div className="flex flex-col flex-wrap gap-3 md:flex-row">
          {MOBILE_APP_STORE_LINKS.map((mobileAppStore) => (
            <MobileAppStoreButton
              key={mobileAppStore.name}
              mobileAppStore={mobileAppStore}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
