"use client";

import Color from "color";
import type { ColorInstance } from "color";
import { PipetteIcon } from "lucide-react";
import { Slider } from "radix-ui";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ComponentProps, HTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_INPUT_COLOR } from "@/config/constants";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react-you-might-not-need-an-effect/no-event-handler */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react-you-might-not-need-an-effect/no-pass-data-to-parent */

interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined,
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (context == null) {
    throw new Error("useColorPicker must be used within a ColorPicker");
  }

  return context;
};

type ColorChannelsType<T> = [T, T, T];

type ChannelConfig = {
  labels: ColorChannelsType<string>;
  getChannelValues: (
    h: number,
    s: number,
    l: number,
  ) => ColorChannelsType<number>;
  applyChannelValues: (
    values: ColorChannelsType<number>,
    setters: {
      setHue: (h: number) => void;
      setSaturation: (s: number) => void;
      setLightness: (l: number) => void;
    },
  ) => void;
  isValid: (values: number[]) => boolean;
};

const RGB_CONFIG: ChannelConfig = {
  labels: ["Red", "Green", "Blue"],
  getChannelValues: (h, s, l) =>
    Color.hsl(h, s, l)
      .rgb()
      .array()
      .map(Math.round) as ColorChannelsType<number>,
  applyChannelValues: ([r, g, b], { setHue, setSaturation, setLightness }) => {
    const [h, s, l] = Color.rgb(r, g, b).hsl().array();
    setHue(h);
    setSaturation(s);
    setLightness(l);
  },
  isValid: (values) => values.every((v) => v >= 0 && v <= 255),
};

const HSL_CONFIG: ChannelConfig = {
  labels: ["Hue", "Saturation", "Lightness"],
  getChannelValues: (h, s, l) => [Math.round(h), Math.round(s), Math.round(l)],
  applyChannelValues: ([h, s, l], { setHue, setSaturation, setLightness }) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
  },
  isValid: ([h, s, l]) =>
    h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100,
};

type ColorValue = string;

export type ColorPickerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  value?: ColorValue;
  defaultValue?: ColorValue;
  onChange?: (value: ColorInstance) => void;
};

export function ColorPicker({
  value,
  defaultValue = DEFAULT_INPUT_COLOR,
  onChange,
  className,
  ...props
}: ColorPickerProps) {
  const selectedColor = Color(value);
  const defaultColor = Color(defaultValue);

  const [hue, setHue] = useState(
    selectedColor.hue() || defaultColor.hue() || 0,
  );
  const [saturation, setSaturation] = useState(
    selectedColor.saturationl() || defaultColor.saturationl() || 0,
  );
  const [lightness, setLightness] = useState(
    selectedColor.lightness() || defaultColor.lightness() || 100,
  );
  const [mode, setMode] = useState("hex");

  // Update color when controlled value changes
  useEffect(() => {
    if (value != null) {
      const color = Color.rgb(value).rgb().object();

      setHue(color.r);
      setSaturation(color.g);
      setLightness(color.b);
    }
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange != null) {
      const color = Color.hsl(hue, saturation, lightness);
      onChange(color);
    }
  }, [hue, saturation, lightness, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setMode,
      }}
    >
      <div
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
        onPointerDown={(event) => {
          if (!(event.target instanceof HTMLInputElement)) {
            (document.activeElement as HTMLElement | null)?.blur();
          }
          props.onPointerDown?.(event);
        }}
      />
    </ColorPickerContext.Provider>
  );
}

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

const getTopLightness = (x: number) => (x < 0.01 ? 100 : 50 + 50 * (1 - x));

export const ColorPickerSelection = memo(
  ({ className, ...props }: ColorPickerSelectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { hue, saturation, lightness, setSaturation, setLightness } =
      useColorPicker();
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);

    useEffect(() => {
      const newX = saturation / 100;
      const newY = 1 - lightness / getTopLightness(newX);
      setPositionX(Math.max(0, Math.min(1, newX)));
      setPositionY(Math.max(0, Math.min(1, newY)));
    }, [setPositionX, setPositionY, saturation, lightness]);

    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${String(hue)}, 100%, 50%)`;
    }, [hue]);

    const applyPointerPosition = useCallback(
      (event: PointerEvent) => {
        if (containerRef.current == null) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(
          0,
          Math.min(1, (event.clientX - rect.left) / rect.width),
        );
        const y = Math.max(
          0,
          Math.min(1, (event.clientY - rect.top) / rect.height),
        );
        setPositionX(x);
        setPositionY(y);
        setSaturation(x * 100);
        setLightness(getTopLightness(x) * (1 - y));
      },
      [setSaturation, setLightness],
    );

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!isDragging) return;
        applyPointerPosition(event);
      },
      [isDragging, applyPointerPosition],
    );

    useEffect(() => {
      const handlePointerUp = () => {
        setIsDragging(false);
      };

      if (isDragging) {
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
      }

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }, [isDragging, handlePointerMove]);

    return (
      <div
        className={cn("relative size-full cursor-crosshair rounded", className)}
        onPointerDown={(event_) => {
          event_.preventDefault();
          setIsDragging(true);
          applyPointerPosition(event_.nativeEvent);
        }}
        ref={containerRef}
        style={{
          background: backgroundGradient,
        }}
        {...props}
      >
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${String(positionX * 100)}%`,
            top: `${String(positionY * 100)}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    );
  },
);

ColorPickerSelection.displayName = "ColorPickerSelection";

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;

export function ColorPickerHue({ className, ...props }: ColorPickerHueProps) {
  const { hue, setHue } = useColorPicker();

  return (
    <Slider.Root
      className={cn("relative flex h-4 w-full touch-none", className)}
      max={360}
      onValueChange={([newHue]) => {
        setHue(newHue);
      }}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb
        aria-label="Hue"
        className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      />
    </Slider.Root>
  );
}

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export function ColorPickerEyeDropper({
  className,
  ...props
}: ColorPickerEyeDropperProps) {
  const { setHue, setSaturation, setLightness } = useColorPicker();

  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const color = Color(result.sRGBHex);
      const [h, s, l] = color.hsl().array();

      setHue(h);
      setSaturation(s);
      setLightness(l);
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };

  return (
    <Button
      aria-label="Pick color from screen"
      className={cn("text-muted-foreground shrink-0", className)}
      onClick={handleEyeDropper}
      size="icon"
      variant="outline"
      type="button"
      {...props}
    >
      <PipetteIcon size={16} />
    </Button>
  );
}

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;

const formats = ["hex", "rgb", "css", "hsl"];

export function ColorPickerOutput({
  className,
  ...props
}: ColorPickerOutputProps) {
  const { mode, setMode } = useColorPicker();

  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger
        aria-label="Color format"
        className="h-8 w-20 shrink-0 text-xs"
        {...props}
      >
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-xs" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MultiChannelFormatInput({
  config,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  config: ChannelConfig;
}) {
  const { hue, saturation, lightness, setHue, setSaturation, setLightness } =
    useColorPicker();
  const currentChannelValues = config.getChannelValues(
    hue,
    saturation,
    lightness,
  );
  const [channelInputs, setChannelInputs] = useState(
    currentChannelValues.map(String),
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusedIndex === null) {
      setChannelInputs(
        config.getChannelValues(hue, saturation, lightness).map(String),
      );
    }
  }, [hue, saturation, lightness, focusedIndex, config]);

  const commitChannels = useCallback(() => {
    const values = channelInputs.map((v) => parseInt(v, 10));
    if (values.every((v) => !isNaN(v)) && config.isValid(values)) {
      config.applyChannelValues(values as ColorChannelsType<number>, {
        setHue,
        setSaturation,
        setLightness,
      });
    } else {
      setChannelInputs(currentChannelValues.map(String));
    }
  }, [
    channelInputs,
    currentChannelValues,
    config,
    setHue,
    setSaturation,
    setLightness,
  ]);

  return (
    <div
      className={cn(
        "flex items-center -space-x-px rounded-md shadow-sm",
        className,
      )}
      {...props}
    >
      {channelInputs.map((value, index) => (
        <Input
          aria-label={config.labels[index]}
          className={cn(
            "bg-secondary h-8 rounded-r-none px-2 text-xs shadow-none",
            index > 0 && "rounded-l-none",
          )}
          inputMode="numeric"
          key={index}
          type="text"
          value={value}
          onChange={(event) => {
            const next = [...channelInputs];
            next[index] = event.target.value;
            setChannelInputs(next);
          }}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => {
            setFocusedIndex(null);
            commitChannels();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitChannels();
          }}
        />
      ))}
    </div>
  );
}

function HexFormatInput({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { hue, saturation, lightness, setHue, setSaturation, setLightness } =
    useColorPicker();
  const currentHex = Color.hsl(hue, saturation, lightness).hex();
  const [hexInput, setHexInput] = useState(currentHex);
  const [isHexFocused, setIsHexFocused] = useState(false);

  useEffect(() => {
    if (!isHexFocused) setHexInput(currentHex);
  }, [hue, saturation, lightness, isHexFocused]);

  const commitHex = useCallback(() => {
    try {
      const parsed = Color(
        hexInput.startsWith("#") ? hexInput : `#${hexInput}`,
      );
      const [h, s, l] = parsed.hsl().array();
      setHue(h);
      setSaturation(s);
      setLightness(l);
    } catch {
      setHexInput(currentHex);
    }
  }, [hexInput, currentHex, setHue, setSaturation, setLightness]);

  return (
    <div
      className={cn(
        "relative flex w-full items-center -space-x-px rounded-md shadow-sm",
        className,
      )}
      {...props}
    >
      <Input
        aria-label="Hex color"
        className="bg-secondary h-8 rounded-r-none px-2 text-xs shadow-none"
        type="text"
        value={hexInput}
        onChange={(event) => setHexInput(event.target.value)}
        onFocus={() => setIsHexFocused(true)}
        onBlur={() => {
          setIsHexFocused(false);
          commitHex();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitHex();
        }}
      />
    </div>
  );
}

function CssFormatInput({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { hue, saturation, lightness, setHue, setSaturation, setLightness } =
    useColorPicker();

  const currentRgb = Color.hsl(hue, saturation, lightness)
    .rgb()
    .array()
    .map((value) => Math.round(value));
  const currentCss = `rgb(${currentRgb.join(", ")})`;

  const [cssInput, setCssInput] = useState(currentCss);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) setCssInput(currentCss);
  }, [hue, saturation, lightness, isFocused]);

  const commitCss = useCallback(() => {
    const match = cssInput.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+%?)?\s*\)/,
    );
    if (match) {
      const [, r, g, b] = match;
      const parsed = Color.rgb(Number(r), Number(g), Number(b));
      const [h, s, l] = parsed.hsl().array();
      setHue(h);
      setSaturation(s);
      setLightness(l);
    } else {
      setCssInput(currentCss);
    }
  }, [cssInput, currentCss, setHue, setSaturation, setLightness]);

  return (
    <div className={cn("w-full rounded-md shadow-sm", className)} {...props}>
      <Input
        aria-label="CSS color"
        className="bg-secondary h-8 w-full px-2 text-xs shadow-none"
        type="text"
        value={cssInput}
        onChange={(event) => setCssInput(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          commitCss();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitCss();
        }}
      />
    </div>
  );
}

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export function ColorPickerFormat({
  className,
  ...props
}: ColorPickerFormatProps) {
  const { mode } = useColorPicker();

  if (mode === "hex")
    return <HexFormatInput className={className} {...props} />;
  if (mode === "rgb")
    return (
      <MultiChannelFormatInput
        config={RGB_CONFIG}
        className={className}
        {...props}
      />
    );
  if (mode === "css")
    return <CssFormatInput className={className} {...props} />;
  if (mode === "hsl")
    return (
      <MultiChannelFormatInput
        config={HSL_CONFIG}
        className={className}
        {...props}
      />
    );

  return null;
}
