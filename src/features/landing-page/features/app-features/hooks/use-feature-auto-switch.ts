import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { AUTO_SWITCH_INTERVAL_MS } from "../constants";

/**
 * Cycles through features on a timer while the section is visible,
 * until the user picks one manually.
 */
export function useFeatureAutoSwitch(featureCount: number) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  useEffect(() => {
    if (hasUserSelected || !isInView) {
      return;
    }
    const intervalId = setInterval(() => {
      setActiveIndex((index) => (index + 1) % featureCount);
    }, AUTO_SWITCH_INTERVAL_MS);
    return () => {
      clearInterval(intervalId);
    };
  }, [featureCount, hasUserSelected, isInView]);

  const selectFeature = (index: number) => {
    setHasUserSelected(true);
    setActiveIndex(index);
  };

  return { containerRef, activeIndex, selectFeature };
}
