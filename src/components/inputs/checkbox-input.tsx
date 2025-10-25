import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export function CheckboxInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <FormItem
      className={cn(
        "border-input flex w-fit flex-row gap-2 rounded-md border-2 p-2 transition-colors",
        { "border-primary": value },
      )}
    >
      <FormControl>
        <Checkbox
          className="mb-0"
          checked={value}
          onCheckedChange={(checked) => {
            onChange(checked === true);
          }}
        />
      </FormControl>
      <FormLabel>{label}</FormLabel>
      <FormMessage />
    </FormItem>
  );
}
