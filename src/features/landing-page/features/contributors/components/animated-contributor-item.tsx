"use client";

import { motion } from "motion/react";
import React from "react";

import { ImageType } from "@/config/enums";
import { ApiImage } from "@/features/backend";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";

import { ITEM_BASE_WIDTH, ITEM_OVERLAP } from "../constants";
import type { AnimationTransforms, Contributor } from "../types";

export function AnimatedContributorItem({
  contributor,
  index,
  transforms,
  isInView,
  innerRef,
  onMouseEnter,
  onMouseLeave,
}: {
  contributor: Contributor;
  index: number;
  transforms: AnimationTransforms;
  isInView: boolean;
  innerRef: React.Ref<HTMLDivElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { zIndex, scale, translateY, translateX } = transforms;

  const isOrange = index % 2 === 0;
  const hasPhoto = contributor.photoKey != null && contributor.photoKey !== "";
  const colorClasses = hasPhoto
    ? "bg-muted text-muted-foreground"
    : isOrange
      ? "bg-primary text-primary-foreground"
      : "bg-secondary text-secondary-foreground";

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, filter: "blur(1px)" },
        visible: { opacity: 1, filter: "blur(0px)" },
      }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.05,
      }}
      className="relative mb-4"
      style={{ zIndex, marginLeft: -ITEM_OVERLAP }}
    >
      <div
        className="group relative cursor-pointer"
        ref={innerRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          className={cn(
            "border-background relative flex items-center justify-center overflow-hidden rounded-full border-3 dark:border-4",
            colorClasses,
          )}
          style={{ width: ITEM_BASE_WIDTH, height: ITEM_BASE_WIDTH }}
          animate={{
            scale,
            y: translateY,
            x: translateX,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        >
          <span className="text-md font-bold">
            {getInitials(contributor.name)}
          </span>
          {hasPhoto ? (
            <ApiImage
              imageKey={contributor.photoKey ?? ""}
              alt={contributor.name}
              className="absolute inset-0 z-10 h-full w-full object-cover"
              type={ImageType.Avatar}
            />
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}
