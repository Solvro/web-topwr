import { useTranslations } from "next-intl";

import {
  LandingSection,
  LandingSectionHeader,
  LandingSectionTitle,
} from "@/features/landing-page/components";

import { Questions } from "./questions";

export function FAQ() {
  const t = useTranslations("Faq");

  return (
    <LandingSection containerClassName="lg:flex-row lg:gap-16">
      <LandingSectionHeader>
        <LandingSectionTitle text={t("title")} hook={t("hook")} />
      </LandingSectionHeader>
      <div className="flex-1">
        <Questions />
      </div>
    </LandingSection>
  );
}
