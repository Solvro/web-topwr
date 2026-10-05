import type { RefObject } from "react";
import { useEffect, useRef } from "react";

export interface CursorOffset {
  x: number;
  y: number;
}

const SCREEN_CENTER: CursorOffset = { x: 0, y: 0 };

/** Where the cursor is relative to the screen center: -1 is the left/top edge, 1 the right/bottom edge */
export function useCursorOffset(): RefObject<CursorOffset> {
  const cursorOffsetRef = useRef(SCREEN_CENTER);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") {
        return;
      }
      cursorOffsetRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    }

    function handlePointerLeave() {
      cursorOffsetRef.current = SCREEN_CENTER;
    }

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
    };
  }, []);

  return cursorOffsetRef;
}
