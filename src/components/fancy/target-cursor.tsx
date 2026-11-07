//source: https://reactbits.dev/animations/target-cursor
"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import type { CSSProperties, RefObject } from "react";
import { createPortal } from "react-dom";

const CORNER_ANGLES = [0, 90, 180, 270] as const;
const QUARTER_TURN = Math.PI / 2;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SCOPE_ATTRIBUTE = "data-target-cursor-scope";
const LABEL_ATTRIBUTE = "data-cursor-label";
const COLOR_VARIABLE = "--target-cursor-color";
const SPRING_SUBSTEPS = 2;
const MAX_FRAME_DELTA_SECONDS = 0.05;
const DEFAULT_FRAME_DELTA_SECONDS = 1 / 60;
/** Multiplier turning hover duration into the snap spring's angular frequency */
const SNAP_SETTLE_FACTOR = 4.6;
const SNAP_DAMPING_RATIO = 0.62;
const FREE_FOLLOW_STIFFNESS = 2200;
const PRESENCE_SPRING = { stiffness: 260, damping: 32 };
const PRESS_SPRING = { stiffness: 900, damping: 40 };
const SPIN_EASE_RATE = 3;
const PARALLAX_STRENGTH = 0.08;
const PRESS_SQUEEZE = 0.14;
const PRESS_DOT_SHRINK = 0.35;
const LABEL_GAP_PX = 8;
const LABEL_RISE_PX = 4;
const REST_THRESHOLD = 0.002;

interface SpringState {
  position: number;
  velocity: number;
}

type ContainerReference = RefObject<HTMLElement | null> | HTMLElement | null;

function createSpring(): SpringState {
  return { position: 0, velocity: 0 };
}

function stepSpring(
  state: SpringState,
  goal: number,
  stiffness: number,
  damping: number,
  deltaSeconds: number,
) {
  const substepSeconds = deltaSeconds / SPRING_SUBSTEPS;
  for (let index = 0; index < SPRING_SUBSTEPS; index++) {
    state.velocity +=
      (stiffness * (goal - state.position) - damping * state.velocity) *
      substepSeconds;
    state.position += state.velocity * substepSeconds;
  }
}

function clampToUnit(value: number) {
  return Math.max(0, Math.min(1, value));
}

function toPixels(value: number) {
  return `${value.toFixed(2)}px`;
}

function getCursorColor(
  baseColor: string,
  targetColor: string | undefined,
  lockProgress: number,
) {
  const targetColorPercentage = Math.round(clampToUnit(lockProgress) * 100);
  if (targetColor === undefined || targetColorPercentage === 0) {
    return baseColor;
  }
  return `color-mix(in oklab, ${targetColor} ${targetColorPercentage.toString()}%, ${baseColor})`;
}

function getContainerElement(container: ContainerReference | undefined) {
  if (container == null) {
    return null;
  }
  return container instanceof HTMLElement ? container : container.current;
}

function subscribeToFinePointer(onChange: () => void) {
  const finePointerQuery = window.matchMedia(FINE_POINTER_QUERY);
  finePointerQuery.addEventListener("change", onChange);
  return () => {
    finePointerQuery.removeEventListener("change", onChange);
  };
}

function getHasFinePointer() {
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}

function getHasFinePointerOnServer() {
  return false;
}

/**
 * Replaces the mouse cursor with animated corner brackets that snap around
 * elements matching `targetSelector`. Optionally scoped to a `container`.
 */
export function TargetCursor({
  targetSelector = ".cursor-target",
  cursorColor = "#ffffff",
  cursorColorOnTarget,
  spinDuration = 2,
  hoverDuration = 0.2,
  parallaxOn = true,
  hideDefaultCursor = true,
  size = 36,
  cornerSize = 12,
  idleRadius,
  thickness = 3,
  padding = 6,
  matchRadius = true,
  dotSize = 4,
  blendMode = "difference",
  showLabel = true,
  clickEffect = true,
  container,
}: {
  targetSelector?: string;
  cursorColor?: string;
  cursorColorOnTarget?: string;
  /** Seconds per idle rotation; `0` disables spinning */
  spinDuration?: number;
  hoverDuration?: number;
  parallaxOn?: boolean;
  hideDefaultCursor?: boolean;
  size?: number;
  cornerSize?: number;
  /** Corner radius while not locked onto a target */
  idleRadius?: number;
  thickness?: number;
  padding?: number;
  matchRadius?: boolean;
  dotSize?: number;
  blendMode?: CSSProperties["mixBlendMode"];
  showLabel?: boolean;
  clickEffect?: boolean;
  container?: ContainerReference;
}) {
  const hasFinePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getHasFinePointer,
    getHasFinePointerOnServer,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const cornerReferences = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<() => void>(null);
  const settings = {
    targetSelector,
    cursorColor,
    cursorColorOnTarget,
    spinDuration,
    hoverDuration: Math.max(0.05, hoverDuration),
    parallaxOn,
    hideDefaultCursor,
    size: Math.max(4, size),
    cornerSize: Math.max(2, cornerSize),
    idleRadius,
    thickness: Math.max(0.5, thickness),
    padding,
    matchRadius,
    dotSize: Math.max(0, dotSize),
    showLabel,
    clickEffect,
    container,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!hasFinePointer || root === null) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const cursorStyleElement = document.createElement("style");
    document.head.append(cursorStyleElement);

    const pointer = {
      x: 0,
      y: 0,
      isInside: false,
      hasPosition: false,
      isPressed: false,
    };
    const centerX = createSpring();
    const centerY = createSpring();
    const halfWidth = createSpring();
    const halfHeight = createSpring();
    const cornerRadius = createSpring();
    const rotation = createSpring();
    const lockProgress = createSpring();
    const pressProgress = createSpring();
    const presence = createSpring();
    let target: Element | null = null;
    let targetBorderRadius = 0;
    let lockedQuarterTurns = 0;
    let spinSpeed = 0;
    let animationFrameId = 0;
    let lastFrameTime = 0;
    let lastLabelText = "";
    let lastColor = "";
    let lastScope: HTMLElement | null = null;

    const getScope = () => getContainerElement(settingsRef.current.container);

    const setDefaultCursorHidden = () => {
      const scope = getScope();
      if (scope !== lastScope) {
        lastScope?.removeAttribute(SCOPE_ATTRIBUTE);
        scope?.setAttribute(SCOPE_ATTRIBUTE, "");
        lastScope = scope;
      }
      const selector = scope === null ? "html" : `[${SCOPE_ATTRIBUTE}]`;
      const rule =
        settingsRef.current.hideDefaultCursor && pointer.isInside
          ? `${selector}, ${selector} * { cursor: none !important; }`
          : "";
      if (cursorStyleElement.textContent !== rule) {
        cursorStyleElement.textContent = rule;
      }
    };

    const findTarget = (x: number, y: number, eventTarget?: EventTarget) => {
      const element =
        eventTarget instanceof Element
          ? eventTarget
          : document.elementFromPoint(x, y);
      const foundTarget =
        element?.closest(settingsRef.current.targetSelector) ?? null;
      const scope = getScope();
      if (
        foundTarget !== null &&
        scope !== null &&
        !scope.contains(foundTarget)
      ) {
        return null;
      }
      return foundTarget;
    };

    const setTarget = (nextTarget: Element | null) => {
      if (nextTarget === target) {
        return;
      }
      target = nextTarget;
      if (target !== null) {
        lockedQuarterTurns = Math.round(rotation.position / QUARTER_TURN);
        targetBorderRadius =
          Number.parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
        spinSpeed = 0;
      }
    };

    const renderFrame = (now: number) => {
      animationFrameId = 0;
      const currentSettings = settingsRef.current;
      const deltaSeconds =
        lastFrameTime === 0
          ? DEFAULT_FRAME_DELTA_SECONDS
          : Math.min(MAX_FRAME_DELTA_SECONDS, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      if (target !== null && !target.isConnected) {
        setTarget(null);
      }
      const targetRect = target?.getBoundingClientRect() ?? null;
      const isLocked = targetRect !== null && pointer.isInside;
      const snapFrequency = SNAP_SETTLE_FACTOR / currentSettings.hoverDuration;
      const snapStiffness = snapFrequency ** 2;
      const snapDamping = 2 * SNAP_DAMPING_RATIO * snapFrequency;
      const snapCriticalDamping = 2 * snapFrequency;

      stepSpring(
        presence,
        pointer.isInside ? 1 : 0,
        PRESENCE_SPRING.stiffness,
        PRESENCE_SPRING.damping,
        deltaSeconds,
      );
      stepSpring(
        lockProgress,
        isLocked ? 1 : 0,
        snapStiffness,
        snapCriticalDamping,
        deltaSeconds,
      );
      stepSpring(
        pressProgress,
        pointer.isPressed && currentSettings.clickEffect ? 1 : 0,
        PRESS_SPRING.stiffness,
        PRESS_SPRING.damping,
        deltaSeconds,
      );

      let goalX = pointer.x;
      let goalY = pointer.y;
      let goalHalfWidth = currentSettings.size / 2;
      let goalHalfHeight = currentSettings.size / 2;
      let goalRadius =
        currentSettings.idleRadius ??
        Math.min(2, currentSettings.cornerSize / 4);
      if (isLocked) {
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const parallax = currentSettings.parallaxOn ? PARALLAX_STRENGTH : 0;
        goalX = targetCenterX + (pointer.x - targetCenterX) * parallax;
        goalY = targetCenterY + (pointer.y - targetCenterY) * parallax;
        const isSideways = Math.abs(lockedQuarterTurns) % 2 === 1;
        const paddedHalfWidth = targetRect.width / 2 + currentSettings.padding;
        const paddedHalfHeight =
          targetRect.height / 2 + currentSettings.padding;
        goalHalfWidth = isSideways ? paddedHalfHeight : paddedHalfWidth;
        goalHalfHeight = isSideways ? paddedHalfWidth : paddedHalfHeight;
        goalRadius = currentSettings.matchRadius
          ? Math.min(
              targetBorderRadius + Math.max(0, currentSettings.padding),
              currentSettings.cornerSize,
            )
          : 0;
      }

      if (!pointer.isInside && presence.position < 0.01) {
        pointer.hasPosition = false;
      }
      if (!pointer.hasPosition) {
        centerX.position = goalX;
        centerY.position = goalY;
        halfWidth.position = goalHalfWidth;
        halfHeight.position = goalHalfHeight;
        pointer.hasPosition = pointer.isInside;
      }

      const followStiffness = isLocked ? snapStiffness : FREE_FOLLOW_STIFFNESS;
      const followDamping = isLocked
        ? snapDamping
        : 2 * Math.sqrt(FREE_FOLLOW_STIFFNESS);
      stepSpring(centerX, goalX, followStiffness, followDamping, deltaSeconds);
      stepSpring(centerY, goalY, followStiffness, followDamping, deltaSeconds);
      stepSpring(
        halfWidth,
        goalHalfWidth,
        snapStiffness,
        snapDamping,
        deltaSeconds,
      );
      stepSpring(
        halfHeight,
        goalHalfHeight,
        snapStiffness,
        snapDamping,
        deltaSeconds,
      );
      stepSpring(
        cornerRadius,
        goalRadius,
        snapStiffness,
        snapCriticalDamping,
        deltaSeconds,
      );

      const idleSpinSpeed =
        currentSettings.spinDuration > 0 && !prefersReducedMotion
          ? (Math.PI * 2) / currentSettings.spinDuration
          : 0;
      if (isLocked || idleSpinSpeed === 0) {
        spinSpeed = 0;
        const goalQuarterTurns = isLocked
          ? lockedQuarterTurns
          : Math.round(rotation.position / QUARTER_TURN);
        stepSpring(
          rotation,
          goalQuarterTurns * QUARTER_TURN,
          snapStiffness,
          snapDamping,
          deltaSeconds,
        );
      } else {
        spinSpeed +=
          (idleSpinSpeed - spinSpeed) *
          (1 - Math.exp(-deltaSeconds * SPIN_EASE_RATE));
        rotation.velocity = spinSpeed;
        rotation.position += spinSpeed * deltaSeconds;
      }

      const squeeze = 1 - pressProgress.position * PRESS_SQUEEZE;
      const cosine = Math.cos(rotation.position);
      const sine = Math.sin(rotation.position);
      const scaledHalfWidth = Math.max(0, halfWidth.position) * squeeze;
      const scaledHalfHeight = Math.max(0, halfHeight.position) * squeeze;
      const cornerOffsets = [
        [-scaledHalfWidth, -scaledHalfHeight],
        [scaledHalfWidth, -scaledHalfHeight],
        [scaledHalfWidth, scaledHalfHeight],
        [-scaledHalfWidth, scaledHalfHeight],
      ] as const;
      const clampedRadius = Math.max(
        0,
        Math.min(cornerRadius.position, currentSettings.cornerSize),
      );
      const rotationDegrees = (rotation.position * 180) / Math.PI;
      let boundsLeft = Infinity;
      let boundsTop = Infinity;
      for (const [cornerIndex, corner] of cornerReferences.current.entries()) {
        if (corner === null) {
          continue;
        }
        const [offsetX, offsetY] = cornerOffsets[cornerIndex];
        const cornerX = centerX.position + offsetX * cosine - offsetY * sine;
        const cornerY = centerY.position + offsetX * sine + offsetY * cosine;
        boundsLeft = Math.min(boundsLeft, cornerX);
        boundsTop = Math.min(boundsTop, cornerY);
        corner.style.transform = `translate3d(${toPixels(cornerX)}, ${toPixels(cornerY)}, 0) rotate(${(CORNER_ANGLES[cornerIndex] + rotationDegrees).toFixed(2)}deg)`;
        corner.style.width = toPixels(currentSettings.cornerSize);
        corner.style.height = toPixels(currentSettings.cornerSize);
        corner.style.borderWidth = `${toPixels(currentSettings.thickness)} 0 0 ${toPixels(currentSettings.thickness)}`;
        corner.style.borderTopLeftRadius = toPixels(clampedRadius);
      }

      const dot = dotRef.current;
      if (dot !== null) {
        const dotScale = 1 - pressProgress.position * PRESS_DOT_SHRINK;
        dot.style.transform = `translate3d(${toPixels(pointer.x)}, ${toPixels(pointer.y)}, 0) translate(-50%, -50%) scale(${dotScale.toFixed(3)})`;
        dot.style.width = toPixels(currentSettings.dotSize);
        dot.style.height = toPixels(currentSettings.dotSize);
      }

      const label = labelRef.current;
      if (label !== null) {
        const labelText =
          currentSettings.showLabel && target !== null
            ? (target.getAttribute(LABEL_ATTRIBUTE) ?? "")
            : "";
        if (labelText !== "" && labelText !== lastLabelText) {
          label.textContent = labelText;
          lastLabelText = labelText;
        }
        const labelVisibility =
          labelText === "" ? 0 : clampToUnit(lockProgress.position);
        label.style.transform = `translate3d(${toPixels(boundsLeft)}, ${toPixels(boundsTop - LABEL_GAP_PX)}, 0) translateY(-100%) translateY(${toPixels((1 - labelVisibility) * LABEL_RISE_PX)})`;
        label.style.opacity = labelVisibility.toFixed(3);
      }

      const color = getCursorColor(
        currentSettings.cursorColor,
        currentSettings.cursorColorOnTarget,
        lockProgress.position,
      );
      if (color !== lastColor) {
        root.style.setProperty(COLOR_VARIABLE, color);
        lastColor = color;
      }
      root.style.opacity = clampToUnit(presence.position).toFixed(3);

      const isResting =
        !pointer.isInside &&
        presence.position < REST_THRESHOLD &&
        Math.abs(presence.velocity) < REST_THRESHOLD &&
        Math.abs(lockProgress.position) < REST_THRESHOLD &&
        Math.abs(pressProgress.position) < REST_THRESHOLD;
      const isSpinning = pointer.isInside && !isLocked && spinSpeed > 0.0001;
      const isMoving =
        Math.abs(centerX.velocity) +
          Math.abs(centerY.velocity) +
          Math.abs(halfWidth.velocity) +
          Math.abs(halfHeight.velocity) +
          Math.abs(rotation.velocity) >
          0.01 ||
        Math.abs(goalX - centerX.position) +
          Math.abs(goalY - centerY.position) >
          0.05 ||
        Math.abs(lockProgress.velocity) +
          Math.abs(pressProgress.velocity) +
          Math.abs(presence.velocity) >
          0.001;
      if (!isResting && (isSpinning || isMoving || isLocked)) {
        animationFrameId = requestAnimationFrame(renderFrame);
      } else {
        lastFrameTime = 0;
      }
    };

    const requestFrame = () => {
      if (animationFrameId === 0) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };
    wakeRef.current = () => {
      setDefaultCursorHidden();
      requestFrame();
    };

    const getIsInsideScope = (eventTarget: EventTarget | null) => {
      const scope = getScope();
      return (
        scope === null ||
        (eventTarget instanceof Node && scope.contains(eventTarget))
      );
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      const isInside = getIsInsideScope(event.target);
      if (isInside !== pointer.isInside) {
        pointer.isInside = isInside;
        setDefaultCursorHidden();
      }
      setTarget(
        isInside
          ? findTarget(pointer.x, pointer.y, event.target ?? undefined)
          : null,
      );
      requestFrame();
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }
      pointer.isPressed = true;
      requestFrame();
    };

    const handlePointerUp = () => {
      pointer.isPressed = false;
      requestFrame();
    };

    const handleLeave = () => {
      pointer.isInside = false;
      pointer.isPressed = false;
      setTarget(null);
      setDefaultCursorHidden();
      requestFrame();
    };

    const handleScroll = () => {
      if (!pointer.isInside) {
        return;
      }
      setTarget(findTarget(pointer.x, pointer.y));
      requestFrame();
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      wakeRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      lastScope?.removeAttribute(SCOPE_ATTRIBUTE);
      cursorStyleElement.remove();
    };
  }, [hasFinePointer]);

  if (!hasFinePointer) {
    return null;
  }

  return createPortal(
    <div
      ref={rootRef}
      aria-hidden
      style={{ mixBlendMode: blendMode, opacity: 0 }}
      className="pointer-events-none fixed inset-0 z-2147483647"
    >
      {CORNER_ANGLES.map((angle, cornerIndex) => (
        <span
          key={angle}
          ref={(corner) => {
            cornerReferences.current[cornerIndex] = corner;
          }}
          className="absolute top-0 left-0 origin-top-left border-(--target-cursor-color) will-change-transform"
        />
      ))}
      <span
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full bg-(--target-cursor-color) will-change-transform"
      />
      <span
        ref={labelRef}
        className="absolute top-0 left-0 text-xs leading-none font-medium whitespace-nowrap text-(--target-cursor-color) opacity-0 will-change-[transform,opacity]"
      />
    </div>,
    document.body,
  );
}
