import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { describe, expect, it } from "vitest";

import { InputComponentWrapper } from "@/tests/helpers/react";

import { DatePicker } from "./date-picker";

const formatDate = (date: Date) => format(date, "PPP", { locale: pl });

function renderDatePicker(initialValue?: Date) {
  const screen = render(
    <InputComponentWrapper
      component={DatePicker}
      initialValue={initialValue?.toISOString()}
    />,
  );
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", {
    name: initialValue == null ? /wybierz datę/i : formatDate(initialValue),
  });
  expect(trigger).toBeInTheDocument();
  return { screen, user, trigger };
}

const now = new Date();
now.setHours(0, 0, 0, 0);
const today = now.getDate().toString();

describe("date picker component", () => {
  it("should allow date selection", async () => {
    const { screen, user, trigger } = renderDatePicker();
    await user.click(trigger);

    const todayTile = screen.getByText(today);
    expect(todayTile).toBeInTheDocument();
    await user.click(todayTile);
    await user.click(trigger);
    expect(trigger).toHaveTextContent(formatDate(now));
  });

  it("should allow date deselection", async () => {
    const { screen, user, trigger } = renderDatePicker(now);
    await user.click(trigger);
    const tile = screen.getByText(today);
    expect(tile).toBeInTheDocument();
    await user.click(tile);
    await user.click(trigger);
    expect(trigger).toHaveTextContent("Wybierz datę");
  });
});
