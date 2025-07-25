import userEvent from "@testing-library/user-event";
import assert from "node:assert";
import { describe, expect, it } from "vitest";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { renderWithProviders } from "@/tests/helpers/react";

import CreatePage from "./page";

const TEST_IMAGE_FILE = new File(["test"], "test.png", { type: "image/png" });

function renderCreationForm() {
  const user = userEvent.setup();
  const form = renderWithProviders(<CreatePage />);
  const input = {
    title: form.getByLabelText(/tytuł/i) as HTMLInputElement,
    shortDescription: form.getByLabelText(/krótki opis/i) as HTMLInputElement,
    description: form.getByLabelText(/^opis/i) as HTMLInputElement,
    image: form.getByLabelText(/zdjęcie/i) as HTMLInputElement,
  };
  const submitButton = form.getByRole("button", { name: /zapisz/i });
  return { screen: form, user, input, submitButton };
}

describe("Create Guide Articles Page", () => {
  it("should require all fields to be filled", async () => {
    const form = renderCreationForm();
    expect(form.submitButton).toBeDisabled();

    await form.user.click(form.submitButton);

    await form.user.type(form.input.title, "Test Title");
    expect(form.submitButton).not.toBeDisabled();

    await form.user.click(form.submitButton);
    const formMessages = form.screen.getAllByText(FORM_ERROR_MESSAGES.REQUIRED);

    expect(formMessages).toHaveLength(3);
  });

  it("should allow me to select an image", async () => {
    const form = renderCreationForm();
    expect(form.input.image.files).toHaveLength(0);

    await form.user.upload(form.input.image, TEST_IMAGE_FILE);

    expect(form.input.image.files).toHaveLength(1);
    assert.ok(form.input.image.files != null);
    expect(form.input.image.files[0]).toEqual(TEST_IMAGE_FILE);
  });
});
