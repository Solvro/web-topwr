"use client";

import { useInView } from "motion/react";
import { useRef } from "react";

import { Ballpit } from "@/components/fancy/ballpit";
import { VIEWPORT_OFFSET } from "@/features/landing-page/constants";

import { BALLPIT_COLORS, BALLPIT_DECALS } from "../constants";

export function DownloadBannerBallpit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: VIEWPORT_OFFSET,
  });

  return (
    <div ref={containerRef} className="absolute inset-0">
      {isInView ? (
        <Ballpit
          count={120}
          colors={BALLPIT_COLORS}
          decals={BALLPIT_DECALS}
          decalSize={0.6}
          material="satin"
          minSize={0.55}
          maxSize={1.05}
          gravity={0.7}
          wallBounce={0.8}
          cursorSize={1.3}
          lightIntensity={0.8}
        />
      ) : null}
    </div>
  );
}
