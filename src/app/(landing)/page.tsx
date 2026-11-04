import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import {
  AppFeatures,
  Changelog,
  Contributors,
  FAQ,
  Hero,
  LandingFooter,
} from "@/features/landing-page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LandingPage() {
  const locale = await getLocale();

  return (
    <div lang={locale} className="flex min-h-dvh flex-col">
      <Hero />
      <AppFeatures />
      <Changelog />
      <Contributors />
      <FAQ />
      <LandingFooter />
    </div>
  );
}
