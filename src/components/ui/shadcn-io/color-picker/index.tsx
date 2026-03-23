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
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
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
  const [alpha, setAlpha] = useState(
    selectedColor.alpha() * 100 || defaultColor.alpha() * 100,
  );
  const [mode, setMode] = useState("hex");

  // Update color when controlled value changes
  useEffect(() => {
    if (value != null) {
      const color = Color.rgb(value).rgb().object();

      setHue(color.r);
      setSaturation(color.g);
      setLightness(color.b);
      setAlpha(color.a);
    }
  }, [value]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange != null) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      onChange(color);
    }
  }, [hue, saturation, lightness, alpha, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
      }}
    >
      <div
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
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
      setPositionX(newX);
      setPositionY(1 - lightness / getTopLightness(newX));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setPositionX, setPositionY]);

    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${String(hue)}, 100%, 50%)`;
    }, [hue]);

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!(isDragging && containerRef.current != null)) {
          return;
        }
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
        const newLightness = getTopLightness(x) * (1 - y);

        setLightness(newLightness);
      },
      [isDragging, setSaturation, setLightness],
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
          handlePointerMove(event_.nativeEvent);
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
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;

export function ColorPickerAlpha({
  className,
  ...props
}: ColorPickerAlphaProps) {
  const { alpha, setAlpha } = useColorPicker();

  return (
    <Slider.Root
      className={cn("relative flex h-4 w-full touch-none", className)}
      max={100}
      onValueChange={([newAlpha]) => {
        setAlpha(newAlpha);
      }}
      step={1}
      value={[alpha]}
      {...props}
    >
      <Slider.Track
        className="relative my-0.5 h-3 w-full grow rounded-full"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="border-primary/50 bg-background focus-visible:ring-ring block h-4 w-4 rounded-full border shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  );
}

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;

export function ColorPickerEyeDropper({
  className,
  ...props
}: ColorPickerEyeDropperProps) {
  const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();

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
      setAlpha(100);
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };

  return (
    <Button
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
      <SelectTrigger className="h-8 w-20 shrink-0 text-xs" {...props}>
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

type PercentageInputProps = ComponentProps<typeof Input>;

function PercentageInput({ className, ...props }: PercentageInputProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        {...props}
        className={cn(
          "bg-secondary h-8 w-[3.25rem] rounded-l-none px-2 text-xs shadow-none",
          className,
        )}
      />
      <span className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 text-xs">
        %
      </span>
    </div>
  );
}

function HexFormatInput({ className }: { className?: string }) {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();

  const currentHex = Color.hsl(hue, saturation, lightness).hex();

  const [hexInput, setHexInput] = useState(currentHex);
  const [alphaInput, setAlphaInput] = useState(String(Math.round(alpha)));
  const [isHexFocused, setIsHexFocused] = useState(false);
  const [isAlphaFocused, setIsAlphaFocused] = useState(false);

  useEffect(() => {
    if (!isHexFocused) setHexInput(currentHex);
  }, [hue, saturation, lightness, isHexFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAlphaFocused) setAlphaInput(String(Math.round(alpha)));
  }, [alpha, isAlphaFocused]);

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

  const commitAlpha = useCallback(() => {
    const val = parseInt(alphaInput, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setAlpha(val);
    } else {
      setAlphaInput(String(Math.round(alpha)));
    }
  }, [alphaInput, alpha, setAlpha]);

  return (
    <div
      className={cn(
        "relative flex w-full items-center -space-x-px rounded-md shadow-sm",
        className,
      )}
    >
      <Input
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
      <PercentageInput
        value={alphaInput}
        onChange={(event) => setAlphaInput(event.target.value)}
        onFocus={() => setIsAlphaFocused(true)}
        onBlur={() => {
          setIsAlphaFocused(false);
          commitAlpha();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitAlpha();
        }}
      />
    </div>
  );
}

function RgbFormatInput({ className }: { className?: string }) {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();

  const currentRgb = Color.hsl(hue, saturation, lightness)
    .rgb()
    .array()
    .map((value) => Math.round(value));

  const [rgbInputs, setRgbInputs] = useState(currentRgb.map(String));
  const [alphaInput, setAlphaInput] = useState(String(Math.round(alpha)));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isAlphaFocused, setIsAlphaFocused] = useState(false);

  useEffect(() => {
    if (focusedIndex === null) {
      setRgbInputs(
        Color.hsl(hue, saturation, lightness)
          .rgb()
          .array()
          .map((value) => String(Math.round(value))),
      );
    }
  }, [hue, saturation, lightness, focusedIndex]);

  useEffect(() => {
    if (!isAlphaFocused) setAlphaInput(String(Math.round(alpha)));
  }, [alpha, isAlphaFocused]);

  const commitRgb = useCallback(() => {
    const values = rgbInputs.map((value) => parseInt(value, 10));
    if (values.every((value) => !isNaN(value) && value >= 0 && value <= 255)) {
      const parsed = Color.rgb(values[0], values[1], values[2]);
      const [h, s, l] = parsed.hsl().array();
      setHue(h);
      setSaturation(s);
      setLightness(l);
    } else {
      setRgbInputs(currentRgb.map(String));
    }
  }, [rgbInputs, currentRgb, setHue, setSaturation, setLightness]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitAlpha = useCallback(() => {
    const value = parseInt(alphaInput, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setAlpha(value);
    } else {
      setAlphaInput(String(Math.round(alpha)));
    }
  }, [alphaInput, alpha, setAlpha]);

  return (
    <div
      className={cn(
        "flex items-center -space-x-px rounded-md shadow-sm",
        className,
      )}
    >
      {rgbInputs.map((value, index) => (
        <Input
          className={cn(
            "bg-secondary h-8 rounded-r-none px-2 text-xs shadow-none",
            index && "rounded-l-none",
          )}
          key={index}
          type="text"
          value={value}
          onChange={(event) => {
            const next = [...rgbInputs];
            next[index] = event.target.value;
            setRgbInputs(next);
          }}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => {
            setFocusedIndex(null);
            commitRgb();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitRgb();
          }}
        />
      ))}
      <PercentageInput
        value={alphaInput}
        onChange={(event) => setAlphaInput(event.target.value)}
        onFocus={() => setIsAlphaFocused(true)}
        onBlur={() => {
          setIsAlphaFocused(false);
          commitAlpha();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitAlpha();
        }}
      />
    </div>
  );
}

function CssFormatInput({ className }: { className?: string }) {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();

  const currentRgb = Color.hsl(hue, saturation, lightness)
    .rgb()
    .array()
    .map((value) => Math.round(value));
  const currentCss = `rgba(${currentRgb.join(", ")}, ${String(Math.round(alpha))}%)`;

  const [cssInput, setCssInput] = useState(currentCss);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) setCssInput(currentCss);
  }, [hue, saturation, lightness, alpha, isFocused]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitCss = useCallback(() => {
    const match = cssInput.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+)(%?))?\s*\)/,
    );
    if (match) {
      const [, r, g, b, a, pct] = match;
      const parsed = Color.rgb(Number(r), Number(g), Number(b));
      const [h, s, l] = parsed.hsl().array();
      setHue(h);
      setSaturation(s);
      setLightness(l);
      if (a !== undefined) {
        const alphaValue = pct === "%" ? parseFloat(a) : parseFloat(a) * 100;
        setAlpha(Math.min(100, Math.max(0, alphaValue)));
      }
    } else {
      setCssInput(currentCss);
    }
  }, [cssInput, currentCss, setHue, setSaturation, setLightness, setAlpha]);

  return (
    <div className={cn("w-full rounded-md shadow-sm", className)}>
      <Input
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

function HslFormatInput({ className }: { className?: string }) {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();

  const [hslInputs, setHslInputs] = useState([
    String(Math.round(hue)),
    String(Math.round(saturation)),
    String(Math.round(lightness)),
  ]);
  const [alphaInput, setAlphaInput] = useState(String(Math.round(alpha)));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isAlphaFocused, setIsAlphaFocused] = useState(false);

  useEffect(() => {
    if (focusedIndex === null) {
      setHslInputs([
        String(Math.round(hue)),
        String(Math.round(saturation)),
        String(Math.round(lightness)),
      ]);
    }
  }, [hue, saturation, lightness, focusedIndex]);

  useEffect(() => {
    if (!isAlphaFocused) setAlphaInput(String(Math.round(alpha)));
  }, [alpha, isAlphaFocused]);

  const commitHsl = useCallback(() => {
    const values = hslInputs.map((value) => parseInt(value, 10));
    if (
      !isNaN(values[0]) &&
      values[0] >= 0 &&
      values[0] <= 360 &&
      !isNaN(values[1]) &&
      values[1] >= 0 &&
      values[1] <= 100 &&
      !isNaN(values[2]) &&
      values[2] >= 0 &&
      values[2] <= 100
    ) {
      setHue(values[0]);
      setSaturation(values[1]);
      setLightness(values[2]);
    } else {
      setHslInputs([
        String(Math.round(hue)),
        String(Math.round(saturation)),
        String(Math.round(lightness)),
      ]);
    }
  }, [
    hslInputs,
    hue,
    saturation,
    lightness,
    setHue,
    setSaturation,
    setLightness,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const commitAlpha = useCallback(() => {
    const value = parseInt(alphaInput, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setAlpha(value);
    } else {
      setAlphaInput(String(Math.round(alpha)));
    }
  }, [alphaInput, alpha, setAlpha]);

  return (
    <div
      className={cn(
        "flex items-center -space-x-px rounded-md shadow-sm",
        className,
      )}
    >
      {hslInputs.map((value, index) => (
        <Input
          className={cn(
            "bg-secondary h-8 rounded-r-none px-2 text-xs shadow-none",
            index && "rounded-l-none",
          )}
          key={index}
          type="text"
          value={value}
          onChange={(event) => {
            const next = [...hslInputs];
            next[index] = event.target.value;
            setHslInputs(next);
          }}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => {
            setFocusedIndex(null);
            commitHsl();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") commitHsl();
          }}
        />
      ))}
      <PercentageInput
        value={alphaInput}
        onChange={(event) => setAlphaInput(event.target.value)}
        onFocus={() => setIsAlphaFocused(true)}
        onBlur={() => {
          setIsAlphaFocused(false);
          commitAlpha();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") commitAlpha();
        }}
      />
    </div>
  );
}

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export function ColorPickerFormat({ className }: ColorPickerFormatProps) {
  const { mode } = useColorPicker();

  if (mode === "hex") return <HexFormatInput className={className} />;
  if (mode === "rgb") return <RgbFormatInput className={className} />;
  if (mode === "css") return <CssFormatInput className={className} />;
  if (mode === "hsl") return <HslFormatInput className={className} />;

  return null;
}
