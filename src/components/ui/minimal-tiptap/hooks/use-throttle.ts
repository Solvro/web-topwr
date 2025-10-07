// @ts-nocheck
import { useCallback, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...arguments_: any[]) => void>(
  callback: T,
  delay: number,
): (...arguments_: Parameters<T>) => void {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...arguments_: Parameters<T>) => {
      const handler = () => {
        if (Date.now() - lastRan.current >= delay) {
          callback(...arguments_);
          lastRan.current = Date.now();
        } else {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(
            () => {
              callback(...arguments_);
              lastRan.current = Date.now();
            },
            delay - (Date.now() - lastRan.current),
          );
        }
      };

      handler();
    },
    [callback, delay],
  );
}
