"use client";

import { Circle, PaintBucketIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import { DEFAULT_INPUT_COLOR } from "@/config/constants";
import { cn } from "@/lib/utils";

import { InputSlot } from "./input-slot";

export function ColorInput({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (color: string) => void;
}) {
  const [lightness, setLightness] = useState<number>(100);

  const showCircleBorder = lightness > 65;

  return (
    <>
      <FormControl>
        <Input
          type="color"
          className="hidden"
          value={value ?? DEFAULT_INPUT_COLOR}
          readOnly
        />
      </FormControl>
      <Popover>
        <PopoverTrigger asChild>
          <InputSlot
            renderAs={Button}
            variant="outline"
            data-empty={value == null}
            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
          >
            <PaintBucketIcon />
            {value == null ? (
              <span>Wybierz kolor</span>
            ) : (
              <div className="flex items-center gap-2 uppercase">
                <Circle
                  style={{ color: showCircleBorder ? undefined : value }}
                  className={cn({
                    "text-muted-foreground": showCircleBorder,
                  })}
                  fill={value}
                />{" "}
                {value}
              </div>
            )}
          </InputSlot>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <ColorPicker
            className="bg-background h-full w-full max-w-sm rounded-md p-4 shadow-sm"
            onChange={(newColor) => {
              setLightness(newColor.lightness());
              onChange(newColor.hex().toLowerCase());
            }}
            defaultValue={value ?? undefined}
          >
            <ColorPickerSelection className="min-h-[300px]" />
            <div className="flex items-center gap-4">
              <ColorPickerEyeDropper />
              <div className="grid h-full w-full gap-1">
                <ColorPickerHue />
                <ColorPickerAlpha />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerFormat />
            </div>
          </ColorPicker>
        </PopoverContent>
      </Popover>
    </>
  );
}
