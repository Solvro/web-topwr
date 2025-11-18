import type { ReactNode } from "react";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isUnsetEnumField, tryParseNumber } from "@/utils";

export function SelectInput({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReactNode;
  value: unknown;
  onChange: (value: number | string) => void;
}) {
  const placeholder = `Wybierz ${label.toLowerCase()}`;
  return (
    <Select
      value={
        // TODO: infer the field value type from the form schema limiting it to schema keys that correspond to enums
        isUnsetEnumField(value) ? "" : String(value as number)
      }
      onValueChange={(newValue) => {
        onChange(tryParseNumber(newValue));
      }}
    >
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>{options}</SelectContent>
    </Select>
  );
}
