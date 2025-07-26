"use client";

import type { ControllerRenderProps } from "react-hook-form";

import { Button } from "./ui/button";
import { SelectSeparator } from "./ui/select";

export function SelectClear({ field }: { field: ControllerRenderProps }) {
  return (
    <>
      <Button
        className="w-full"
        variant="ghost"
        size="sm"
        onClick={() => {
          field.onChange("");
        }}
        disabled={field.value === ""}
      >
        wyczyść
      </Button>
      <SelectSeparator />
    </>
  );
}
