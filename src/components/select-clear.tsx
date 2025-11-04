"use client";

import type { ReactNode } from "react";
import type { ControllerRenderProps } from "react-hook-form";

import { isEmptyValue } from "@/lib/helpers";

import { Button } from "./ui/button";
import { SelectSeparator } from "./ui/select";

export function SelectClear({
  resetValue = "",
  label = "wyczyść",
  value,
  onChange,
}: Pick<ControllerRenderProps, "value" | "onChange"> & {
  resetValue?: unknown;
  label?: ReactNode;
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
        disabled={isEmptyValue(value)}
      >
        {label}
      </Button>
      <SelectSeparator />
    </>
  );
}
