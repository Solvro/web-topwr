"use client";

import { useState } from "react";

import { SectionHeader } from "@/features/landing-page/components";

import { APP_FEATURES } from "../constants";
import { AppFeatureListItem } from "./app-feature-list-item";
import { AppFeaturePreview } from "./app-feature-preview";

export function AppFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="flex w-full items-center justify-center py-20">
      <div className="container flex max-w-6xl flex-col px-4 md:px-6">
        <SectionHeader
          title="Wszystko, czego potrzebujesz w ciągu dnia na uczelni."
          description="Zobacz, jak ToPWR prowadzi Cię przez każdy element studenckiego dnia."
        />

        <div className="grid items-center gap-6 md:grid-cols-2 md:gap-16">
          <AppFeaturePreview feature={APP_FEATURES[activeIndex]} />

          <ul className="border-border flex flex-col border-l">
            {APP_FEATURES.map((feature, index) => (
              <AppFeatureListItem
                key={feature.title}
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
