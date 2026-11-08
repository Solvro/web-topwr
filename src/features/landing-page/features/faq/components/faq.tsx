import { useTranslations } from "next-intl";

import {
  LandingCard,
  LandingSection,
  LandingSectionHeader,
  LandingSectionTitle,
} from "@/features/landing-page/components";

import { Questions } from "./questions";

export function FAQ() {
  const t = useTranslations("Faq");

  return (
    <LandingSection className="pb-12 md:pb-16">
      <LandingCard className="bg-accent dark:bg-accent/25 flex flex-col p-6 md:p-12 lg:flex-row lg:gap-16">
        <LandingSectionHeader>
          <LandingSectionTitle text={t("title")} hook={t("hook")} />
        </LandingSectionHeader>
        <div className="min-h-128 flex-1">
          <Questions />
        </div>
      </LandingCard>
    </LandingSection>
  );
}
