import { SelectItem } from "@/components/ui/select";
import type { SelectInputOptions } from "@/features/abstract-resource-form/types";

export function SelectOptions({ input }: { input: SelectInputOptions }) {
  return Object.values(input.optionEnum).map((option) => (
    <SelectItem key={option} value={String(option)}>
      {input.optionLabels[option]}
    </SelectItem>
  ));
}
