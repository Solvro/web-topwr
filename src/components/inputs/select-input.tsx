import type { ReactNode } from "react";
import type { ControllerProps, FieldPath } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Resource } from "@/config/enums";
import { isUnsetEnumField, tryParseNumber } from "@/lib/helpers";
import type { ResourceFormValues } from "@/types/app";

export function SelectInput<T extends Resource>({
  label,
  options,
  name,
  control,
}: Pick<
  ControllerProps<ResourceFormValues<T>, FieldPath<ResourceFormValues<T>>>,
  "control" | "name"
> & {
  label: string;
  options: ReactNode;
}) {
  const placeholder = `Wybierz ${label.toLowerCase()}`;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={
              // TODO: infer the field value type from the form schema limiting it to schema keys that correspond to enums
              isUnsetEnumField(field.value) ? "" : String(field.value as number)
            }
            onValueChange={(value) => {
              field.onChange(tryParseNumber(value));
            }}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{options}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
