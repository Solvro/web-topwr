"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import type { AppFeature } from "../types";

export function AppFeaturePreview({ feature }: { feature: AppFeature }) {
  const t = useTranslations("AppFeatures.features");
  const Icon = feature.icon;

  return (
    <div className="bg-muted text-foreground relative aspect-video w-full overflow-hidden rounded-3xl md:aspect-10/9">
      <AnimatePresence mode="wait">
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
        >
          <Icon className="size-12 md:size-20" strokeWidth={1.5} />
          <p className="text-xl font-medium md:text-3xl">
            {t(`${feature.id}.title`)}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
