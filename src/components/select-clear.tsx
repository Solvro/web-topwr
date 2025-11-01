"use client";

import type { ControllerRenderProps } from "react-hook-form";

import { Button } from "./ui/button";
import { SelectSeparator } from "./ui/select";

export function SelectClear({
  resetValue = "",
  value,
  onChange,
}: Pick<ControllerRenderProps, "value" | "onChange"> & {
  resetValue?: unknown;
}) {
  return (
    <>
      <Button
        className="w-full"
        variant="ghost"
        size="sm"
        onClick={() => {
          onChange(resetValue);
        }}
        disabled={value === ""}
      >
        wyczyść
      </Button>
      <SelectSeparator />
    </>
  );
}
