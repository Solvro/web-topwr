import { AnimatePresence, motion } from "motion/react";

import type { Contributor, HoveredItemInfo } from "../types";
import { SocialIcon } from "./social-icon";

export function TooltipOverlay({
  hoveredItemInfo,
  contributors,
  onMouseEnter,
  onMouseLeave,
}: {
  hoveredItemInfo: HoveredItemInfo | null;
  contributors: Contributor[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  return (
    <AnimatePresence>
      {hoveredItemInfo != null && (
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-50"
          initial={{
            opacity: 0,
            scale: 0.9,
            x: hoveredItemInfo.x,
            y: hoveredItemInfo.y,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: hoveredItemInfo.x,
            y: hoveredItemInfo.y,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-6">
            <div
              className="border-foreground bg-foreground pointer-events-auto relative flex min-h-16 min-w-48 flex-col items-center justify-center rounded-lg border px-5 py-3 shadow-xl"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <p className="text-background text-center text-base leading-none font-bold whitespace-nowrap">
                {contributors[hoveredItemInfo.index].name}
              </p>
              {(() => {
                const links = contributors[hoveredItemInfo.index].socialLinks;
                if (links.length === 0) {
                  return null;
                }

                return (
                  <div className="mt-2 flex h-4 items-center justify-center gap-2">
                    {links.map((social) => (
                      <a
                        key={social.link}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-background/70 hover:text-background transition-colors"
                      >
                        <SocialIcon
                          type={social.linkType}
                          className="h-4 w-4"
                        />
                      </a>
                    ))}
                  </div>
                );
              })()}
              <div className="border-foreground bg-foreground absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm border-r border-b" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
