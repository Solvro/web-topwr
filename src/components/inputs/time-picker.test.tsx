import { render } from "@testing-library/react";
import { formatDate, parseISO } from "date-fns";
import { describe, expect, it } from "vitest";

import { InputComponentWrapper } from "@/tests/unit";

import { TimePicker } from "./time-picker";

function renderTimePicker(initialValue: string | null) {
  const screen = render(
    <InputComponentWrapper
      component={TimePicker}
      initialValue={initialValue}
    />,
  );
  const input = screen.container.querySelector('input[type="time"]');
  return { screen, input };
}

describe("TimePicker Component", () => {
  it("should render default time for null value", () => {
    const { input } = renderTimePicker(null);
    expect(input).toHaveValue("00:00:00");
  });

  it("should render with provided time value", () => {
    const { input } = renderTimePicker("12:30:45");
    expect(input).toHaveValue("12:30:45");
  });

  it("should render ISO datetime value correctly", () => {
    const value = "2026-03-25T12:30:45Z";
    const { input } = renderTimePicker(value);
    expect(input).toHaveValue(formatDate(parseISO(value), "HH:mm:ss"));
  });

  it("should not throw for invalid string value", () => {
    const { input } = renderTimePicker("not-a-time");
    expect(input).not.toHaveValue("not-a-time");
  });
});
