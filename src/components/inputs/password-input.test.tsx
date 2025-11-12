import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MOCK_PASSWORD } from "@/tests/shared";
import { InputComponentWrapper } from "@/tests/unit";

import { PasswordInput } from "./password-input";

function renderColorInput() {
  const screen = render(
    <InputComponentWrapper component={PasswordInput} initialValue="" />,
  );
  const user = userEvent.setup();
  const input = {
    password: screen.getByLabelText("Hasło"),
    toggleVisibility: screen.getByRole("button", { name: /pokaż hasło/i }),
  };
  expect(input.password).toBeInTheDocument();
  expect(input.toggleVisibility).toBeInTheDocument();
  return { screen, user, input };
}

describe("PasswordInput Component", () => {
  it("should hide content by default", async () => {
    const { user, screen, input } = renderColorInput();
    await user.type(input.password, MOCK_PASSWORD.invalid);
    expect(screen.queryByText(MOCK_PASSWORD.invalid)).not.toBeInTheDocument();
    expect(input.password).toHaveAttribute("type", "password");
  });

  it("should show content when toggled", async () => {
    const { user, input } = renderColorInput();
    await user.type(input.password, MOCK_PASSWORD.invalid);
    await user.click(input.toggleVisibility);
    expect(input.password).toHaveAttribute("type", "text");
  });
});
