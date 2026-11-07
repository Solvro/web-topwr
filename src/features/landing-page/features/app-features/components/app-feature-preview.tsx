"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

import type { AppFeature } from "../types";

export function AppFeaturePreview({ feature }: { feature: AppFeature }) {
  const t = useTranslations("AppFeatures.features");

  return (
    <div className="relative isolate aspect-video w-full overflow-hidden rounded-3xl bg-neutral-950 md:aspect-10/9">
      <AnimatePresence initial={false}>
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={feature.preview}
            alt={t(`${feature.id}.title`)}
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset"
      />
    </div>
  );
}
