import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Color from "color";
import { describe, expect, it } from "vitest";

import { InputComponentWrapper } from "@/tests/unit";

import { ColorInput } from "./color-input";

function renderColorInput(initialValue: string | null = null) {
  const screen = render(
    <InputComponentWrapper
      component={ColorInput}
      initialValue={initialValue}
    />,
  );
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", {
    name:
      initialValue == null ? /wybierz kolor/i : new RegExp(initialValue, "i"),
  });
  expect(trigger).toBeInTheDocument();
  return { screen, user, trigger };
}

describe("ColorInput Component", () => {
  it("should prompt color selection", () => {
    const { trigger } = renderColorInput();
    expect(trigger).toHaveTextContent("Wybierz kolor");
  });

  it("should display selected color", async () => {
    const color = "#ff1234";
    const colorParts = Color(color).rgb().array();
    const { screen, user, trigger } = renderColorInput(color);
    expect(trigger).toHaveTextContent(color);

    await user.click(trigger);
    const modeSelector = await screen.findByRole("combobox");
    await user.click(modeSelector);

    await user.click(screen.getByText("RGB"));

    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    for (const [index, part] of colorParts.entries()) {
      expect(inputs[index]).toHaveValue(part.toString());
    }
  });
});
