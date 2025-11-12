import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SelectItem, SelectSeparator } from "@/components/ui/select";
import { isEmptyValue } from "@/lib/helpers";

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
