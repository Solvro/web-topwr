"use client";

import { useState } from "react";

import { APP_FEATURES } from "../constants";
import { AppFeatureListItem } from "./app-feature-list-item";
import { AppFeaturePreview } from "./app-feature-preview";

export function AppFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="flex w-full items-center justify-center py-20">
      <div className="container flex max-w-6xl flex-col px-4 md:px-6">
        <h2 className="mb-3 max-w-md text-3xl font-medium sm:text-4xl">
          Wszystko, czego potrzebujesz w ciągu dnia na uczelni.
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm text-sm md:mb-8 md:text-base">
          Zobacz, jak ToPWR prowadzi Cię przez każdy element studenckiego dnia.
        </p>

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
