import { render, screen } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import { createStore } from "jotai";
import type { ComponentType, ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { expect } from "vitest";

import { TestProviders } from "@/components/providers/test-providers";
import { Form, FormField, FormItem } from "@/components/ui/form";

interface RenderResultWithStore extends RenderResult {
  store: ReturnType<typeof createStore>;
}

export function renderWithProviders(
  component: ReactNode,
  renderToaster = true,
): RenderResultWithStore {
  const store = createStore();
  return {
    store,
    ...render(
      <TestProviders store={store} renderToaster={renderToaster}>
        {component}
      </TestProviders>,
    ),
  };
}

export function getToaster() {
  const toaster = screen.getByRole("region", { name: "Notifications alt+T" });
  expect(toaster).toBeInTheDocument();
  return toaster;
}

export const getLoadingIndicator = () =>
  screen.queryByLabelText(/trwa ładowanie zasobu/i);

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

export function expectInputValue(
  inputElement: HTMLElement,
  value?: string | boolean | null,
) {
  if (typeof value === "boolean") {
    if (value) {
      expect(inputElement).toBeChecked();
    } else {
      expect(inputElement).not.toBeChecked();
    }
  } else {
    expect(inputElement).toHaveValue(value ?? "");
  }
}
