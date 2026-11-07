"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Easing, Variants } from "motion/react";
import { Fragment } from "react";
import type { ElementType } from "react";

interface SplitCharacter {
  character: string;
  index: number;
}

type SplitWord = SplitCharacter[];
type SplitLine = SplitWord[];

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

function getSplitLines(text: string): SplitLine[] {
  let characterIndex = 0;
  return text.split("\n").map((line) =>
    line
      .split(" ")
      .filter((word) => word !== "")
      .map((word) =>
        Array.from(word, (character) => ({
          character,
          index: characterIndex++,
        })),
      ),
  );
}

function getCharacterVariants({
  duration,
  ease,
  staggerDelay,
  offsetY,
  isReducedMotion,
}: {
  duration: number;
  ease: Easing;
  staggerDelay: number;
  offsetY: number;
  isReducedMotion: boolean;
}): Variants {
  return {
    hidden: isReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: offsetY, filter: "blur(4px)" },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease,
        delay: isReducedMotion ? 0 : index * staggerDelay,
      },
    }),
  };
}

export function SplitText({
  text,
  tag = "p",
  className,
  duration = 0.5,
  ease = EASE_OUT_QUINT,
  staggerDelay = 0.03,
  offsetY = 8,
  viewportMargin = "0px 0px -20% 0px",
}: {
  text: string;
  tag?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  duration?: number;
  ease?: Easing;
  staggerDelay?: number;
  offsetY?: number;
  viewportMargin?: string;
}) {
  const isReducedMotion = useReducedMotion() ?? false;
  const Tag: ElementType = tag;
  const characterVariants = getCharacterVariants({
    duration,
    ease,
    staggerDelay,
    offsetY,
    isReducedMotion,
  });

  return (
    <Tag aria-label={text} className={className}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: "all", margin: viewportMargin }}
      >
        {getSplitLines(text).map((line, lineIndex) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {line.map((word, wordIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {word.map(({ character, index }) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={characterVariants}
                      className="inline-block will-change-transform"
                    >
                      {character}
                    </motion.span>
                  ))}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
