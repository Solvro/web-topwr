//source: https://reactbits.dev/text-animations/gradient-text
"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type GradientTextVariant = "linear" | "flow" | "conic";
type GradientTextDirection = "horizontal" | "vertical" | "diagonal";

interface GradientSettings {
  colors: string[];
  speed: number;
  variant: GradientTextVariant;
  angle: number;
  scale: number;
  yoyo: boolean;
  pauseOnHover: boolean;
  followPointer: boolean;
}

interface GradientState {
  time: number;
  isInside: boolean;
  isVisible: boolean;
  targetX: number;
  targetY: number;
  pointerX: number;
  pointerY: number;
  velocityX: number;
  velocityY: number;
  pull: number;
}

type GradientTextStyle = CSSProperties &
  Record<`--gt-${string}`, string | number>;

const DIRECTION_ANGLES: Record<GradientTextDirection, number> = {
  horizontal: 90,
  vertical: 180,
  diagonal: 135,
};
const TAU = Math.PI * 2;
const POINTER_STIFFNESS = 160;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const GRADIENT_VARIABLE = "--gt-gradient";
const GRADIENT_CLIP_CLASS_NAME =
  "bg-(image:--gt-gradient) bg-clip-text text-transparent";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function getPalette(colors: string[]) {
  if (colors.length > 1) {
    return colors;
  }
  const onlyColor = colors.at(0) ?? "#ffffff";
  return [onlyColor, onlyColor];
}

function getLoopedPalette(palette: string[]) {
  return [...palette, palette[0]];
}

function getFlowGradient(
  settings: GradientSettings,
  state: GradientState,
  cycle: number,
) {
  const { colors, scale, angle } = settings;
  const blobs = colors.map((color, index) => {
    const spin = cycle * TAU;
    const rate = 0.55 + ((index * 0.618) % 1) * 0.5;
    let blobX = 50 + 44 * Math.sin(spin * rate + index * 2.1);
    let blobY = 50 + 40 * Math.sin(spin * (rate * 0.83 + 0.21) + index * 1.3);
    if (index === 0) {
      blobX += (state.pointerX * 100 - blobX) * state.pull;
      blobY += (state.pointerY * 100 - blobY) * state.pull;
    }
    const width = (22 + 12 * scale).toFixed(1);
    const height = (60 + 30 * scale).toFixed(1);
    return `radial-gradient(ellipse ${width}% ${height}% at ${blobX.toFixed(2)}% ${blobY.toFixed(2)}%, ${color} 0%, transparent 100%)`;
  });
  return `${blobs.join(", ")}, linear-gradient(${angle.toString()}deg, ${colors.join(", ")})`;
}

function getConicGradient(
  settings: GradientSettings,
  state: GradientState,
  cycle: number,
) {
  const { colors, scale, yoyo } = settings;
  const sway = yoyo ? Math.sin(cycle * Math.PI) * 50 : cycle * 360;
  const centerX = 50 + (state.pointerX * 100 - 50) * state.pull;
  const centerY = 260 + (state.pointerY * 100 - 260) * state.pull;
  const stops = getLoopedPalette(colors).map(
    (color, index) =>
      `${color} ${((index / colors.length) * 60 * (3 / scale)).toFixed(2)}deg`,
  );
  return `repeating-conic-gradient(from ${(sway - 30).toFixed(2)}deg at ${centerX.toFixed(2)}% ${centerY.toFixed(2)}%, ${stops.join(", ")})`;
}

function getLinearGradient(
  settings: GradientSettings,
  state: GradientState,
  cycle: number,
) {
  const { colors, scale, yoyo, angle } = settings;
  const loopedPalette = getLoopedPalette(colors);
  const period = 100 * scale;
  let offset: number;
  if (yoyo) {
    const swing = cycle % 2;
    const progress = swing < 1 ? swing : 2 - swing;
    offset = (0.5 - Math.cos(Math.PI * progress) / 2) * (period - 100);
  } else {
    offset = (cycle % 1) * period;
  }
  offset += (state.pointerX - 0.5) * period * 0.5 * state.pull;
  const stops = loopedPalette.map(
    (color, index) =>
      `${color} ${((index / (loopedPalette.length - 1)) * period - offset).toFixed(2)}%`,
  );
  return `repeating-linear-gradient(${angle.toString()}deg, ${stops.join(", ")})`;
}

function getGradient(settings: GradientSettings, state: GradientState) {
  const cycle = state.time / settings.speed;
  switch (settings.variant) {
    case "flow": {
      return getFlowGradient(settings, state, cycle);
    }
    case "conic": {
      return getConicGradient(settings, state, cycle);
    }
    case "linear": {
      return getLinearGradient(settings, state, cycle);
    }
  }
}

export function GradientText({
  children,
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  animationSpeed = 8,
  variant = "linear",
  angle = 90,
  direction,
  scale = 3,
  yoyo = true,
  glow = 0,
  showBorder = false,
  borderWidth = 1.5,
  pauseOnHover = false,
  followPointer = false,
  className,
  style,
}: {
  children: ReactNode;
  colors?: string[];
  /** Seconds per gradient cycle */
  animationSpeed?: number;
  variant?: GradientTextVariant;
  angle?: number;
  /** Overrides `angle` when set */
  direction?: GradientTextDirection;
  scale?: number;
  yoyo?: boolean;
  /** Glow opacity, from 0 to 1 */
  glow?: number;
  showBorder?: boolean;
  borderWidth?: number;
  pauseOnHover?: boolean;
  followPointer?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const palette = getPalette(colors);
  const resolvedAngle = direction == null ? angle : DIRECTION_ANGLES[direction];
  const settings: GradientSettings = {
    colors: palette,
    speed: Math.max(0.2, animationSpeed),
    variant,
    angle: resolvedAngle,
    scale: clamp(scale, 1, 6),
    yoyo,
    pauseOnHover,
    followPointer,
  };

  const rootRef = useRef<HTMLSpanElement>(null);
  const settingsRef = useRef(settings);
  const wakeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (root == null) {
      return;
    }

    const isReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const state: GradientState = {
      time: 0,
      isInside: false,
      isVisible: true,
      targetX: 0.5,
      targetY: 0.5,
      pointerX: 0.5,
      pointerY: 0.5,
      velocityX: 0,
      velocityY: 0,
      pull: 0,
    };
    let animationFrame = 0;
    let lastFrameTime = 0;
    let isAlive = true;

    const paint = () => {
      root.style.setProperty(
        GRADIENT_VARIABLE,
        getGradient(settingsRef.current, state),
      );
    };

    const stepPointerSpring = (deltaSeconds: number) => {
      const damping = 2 * Math.sqrt(POINTER_STIFFNESS);
      state.velocityX +=
        ((state.targetX - state.pointerX) * POINTER_STIFFNESS -
          state.velocityX * damping) *
        deltaSeconds;
      state.velocityY +=
        ((state.targetY - state.pointerY) * POINTER_STIFFNESS -
          state.velocityY * damping) *
        deltaSeconds;
      state.pointerX += state.velocityX * deltaSeconds;
      state.pointerY += state.velocityY * deltaSeconds;
    };

    const tick = (now: number) => {
      animationFrame = 0;
      if (!isAlive) {
        return;
      }
      const currentSettings = settingsRef.current;
      const deltaSeconds = Math.min(
        0.05,
        Math.max(0, (now - lastFrameTime) / 1000),
      );
      lastFrameTime = now;
      const isPaused =
        isReducedMotion || (currentSettings.pauseOnHover && state.isInside);
      if (!isPaused) {
        state.time += deltaSeconds;
      }
      const pullTarget =
        currentSettings.followPointer && state.isInside ? 1 : 0;
      state.pull +=
        (pullTarget - state.pull) * (1 - Math.exp(-deltaSeconds * 6));
      stepPointerSpring(deltaSeconds);
      paint();
      const isSettling =
        Math.abs(state.pull - pullTarget) > 0.001 ||
        Math.abs(state.velocityX) + Math.abs(state.velocityY) > 0.001;
      if (!state.isVisible || (isPaused && !isSettling)) {
        return;
      }
      animationFrame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (animationFrame !== 0 || !isAlive) {
        return;
      }
      lastFrameTime = performance.now();
      animationFrame = requestAnimationFrame(tick);
    };
    wakeRef.current = () => {
      paint();
      wake();
    };

    const locatePointer = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      state.targetX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      state.targetY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    };
    const handlePointerEnter = (event: PointerEvent) => {
      locatePointer(event);
      if (!state.isInside) {
        state.pointerX = state.targetX;
        state.pointerY = state.targetY;
      }
      state.isInside = true;
      wake();
    };
    const handlePointerMove = (event: PointerEvent) => {
      locatePointer(event);
      wake();
    };
    const handlePointerLeave = () => {
      state.isInside = false;
      wake();
    };

    const observer = new IntersectionObserver((entries) => {
      state.isVisible = entries.some((entry) => entry.isIntersecting);
      if (state.isVisible) {
        wake();
      }
    });
    observer.observe(root);
    root.addEventListener("pointerenter", handlePointerEnter);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);
    paint();
    wake();

    return () => {
      isAlive = false;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      root.removeEventListener("pointerenter", handlePointerEnter);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
      wakeRef.current = null;
    };
  }, []);

  const rootStyle: GradientTextStyle = {
    [GRADIENT_VARIABLE]: `linear-gradient(${resolvedAngle.toString()}deg, ${getLoopedPalette(palette).join(", ")})`,
    "--gt-border": `${borderWidth.toString()}px`,
    "--gt-glow": clamp(glow, 0, 1),
    ...style,
  };

  return (
    <span
      ref={rootRef}
      className={cn(
        "relative isolate inline-flex max-w-full items-center justify-center",
        showBorder &&
          "rounded-full px-[0.75em] py-[0.35em] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(image:--gt-gradient) before:p-(--gt-border) before:content-[''] before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]",
        className,
      )}
      style={rootStyle}
    >
      <span className="relative inline-block">
        <span className={cn("inline-block", GRADIENT_CLIP_CLASS_NAME)}>
          {children}
        </span>
        {glow > 0 ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 opacity-(--gt-glow) blur-[0.3em] saturate-140 select-none",
              GRADIENT_CLIP_CLASS_NAME,
            )}
            aria-hidden="true"
          >
            {children}
          </span>
        ) : null}
      </span>
    </span>
  );
}
