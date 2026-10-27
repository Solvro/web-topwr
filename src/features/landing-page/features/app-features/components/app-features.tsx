"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { SectionHeader } from "@/features/landing-page/components";

import { APP_FEATURES } from "../constants";
import { AppFeatureListItem } from "./app-feature-list-item";
import { AppFeaturePreview } from "./app-feature-preview";

export function AppFeatures() {
  const t = useTranslations("AppFeatures");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="flex w-full items-center justify-center py-20">
      <div className="container flex flex-col px-4">
        <SectionHeader title={t("title")} description={t("description")} />

        <div className="grid items-center gap-6 md:grid-cols-[3fr_2fr] md:gap-12 lg:gap-16">
          <AppFeaturePreview feature={APP_FEATURES[activeIndex]} />

          <ul className="border-border flex flex-col border-l">
            {APP_FEATURES.map((feature, index) => (
              <AppFeatureListItem
                key={feature.id}
                feature={feature}
                isActive={index === activeIndex}
                onSelect={() => {
                  setActiveIndex(index);
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
