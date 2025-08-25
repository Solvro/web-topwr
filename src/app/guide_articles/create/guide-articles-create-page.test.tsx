import { waitFor } from "@testing-library/dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import assert from "node:assert";
import { describe, expect, it } from "vitest";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { getToaster, renderWithProviders } from "@/tests/helpers/react";
import { MOCK_GUIDE_ARTICLE, MOCK_IMAGE_FILE } from "@/tests/mocks/constants";

import CreatePage from "./page";

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

    await form.user.upload(form.input.image, MOCK_IMAGE_FILE);

    expect(form.input.image.files).toHaveLength(1);
    assert.ok(form.input.image.files != null);
    expect(form.input.image.files[0]).toEqual(MOCK_IMAGE_FILE);
  });

  it("should allow me to submit the form with valid data", async () => {
    const form = renderCreationForm();
    expect(form.submitButton).toBeDisabled();

    await form.user.type(form.input.title, MOCK_GUIDE_ARTICLE.title);
    await form.user.type(
      form.input.shortDescription,
      MOCK_GUIDE_ARTICLE.shortDesc,
    );
    await form.user.type(
      form.input.description,
      MOCK_GUIDE_ARTICLE.description,
    );
    await form.user.upload(form.input.image, MOCK_IMAGE_FILE);

    await waitFor(() => {
      expect(getToaster()).not.toHaveTextContent(/trwa przesyłanie zdjęcia/i);
      expect(
        screen.queryByText(FORM_ERROR_MESSAGES.REQUIRED),
      ).not.toBeInTheDocument();
    });

    await form.user.click(form.submitButton);

    await waitFor(() => {
      expect(getToaster()).toHaveTextContent(/pomyślnie zapisano/i);
    });
  });
});
