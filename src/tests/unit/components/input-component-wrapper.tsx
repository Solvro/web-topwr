import type { ComponentType } from "react";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";

import { Form, FormField, FormItem } from "@/components/ui/form";

export function InputComponentWrapper<T>({
  component: Comp,
  initialValue,
  ...props
}: Omit<T, keyof ControllerRenderProps> & {
  component: ComponentType<T | ControllerRenderProps>;
  initialValue?: string | null;
}) {
  const form = useForm<{ data: string | null }>({
    defaultValues: { data: initialValue },
  });
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <Comp {...field} {...props} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
