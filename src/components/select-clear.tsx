"use client";

import type { ReactNode } from "react";

import { isEmptyValue } from "@/lib/helpers";

import { Button } from "./ui/button";
import { SelectItem, SelectSeparator } from "./ui/select";

export function SelectClear({
  value,
  resetValue = null,
  label = "wyczyść",
}: {
  value: unknown;
  resetValue?: unknown;
  label?: ReactNode;
}) {
  return (
    <>
      <Button
        className="w-full"
        variant="ghost"
        size="sm"
        disabled={isEmptyValue(value)}
        asChild
      >
        <SelectItem value={resetValue as string}>{label}</SelectItem>
      </Button>
      <SelectSeparator />
    </>
  );
}
