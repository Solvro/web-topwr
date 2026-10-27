import { useTranslations } from "next-intl";

import { SectionHeader } from "@/features/landing-page/components";

import { Questions } from "./questions";

export function FAQ() {
  const t = useTranslations("Faq");

  return (
    <article className="flex w-full flex-col items-center justify-center py-20">
      <div className="container flex flex-col px-4 lg:flex-row lg:gap-16">
        <SectionHeader title={t("title")} hook={t("hook")} />
        <div className="flex-1">
          <Questions />
        </div>
      </div>
    </article>
  );
}
