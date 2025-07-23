import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { FORM_ERROR_MESSAGES } from "@/config/constants";
import { enumToFormSelectOptions } from "@/lib/helpers";
import type { AbstractResourceFormInputs } from "@/types/forms";

import { AbstractResourceForm } from "./abstract-resource-form";

enum Type {
  A = "A",
  B = "B",
}

const testSchema = z.object({
  name: z.string().min(1, FORM_ERROR_MESSAGES.REQUIRED),
  description: z.string().nullable().optional(),
  type: z.nativeEnum(Type).nullable().optional(),
  isActive: z.boolean(),
});

type TestSchema = z.infer<typeof testSchema>;

const formInputs: AbstractResourceFormInputs<TestSchema> = {
  textInputs: [
    { name: "name", label: "Nazwa" },
    { name: "description", label: "Opis" },
  ],
  selectInputs: [
    {
      name: "type",
      label: "Typ",
      placeholder: "Wybierz typ",
      options: enumToFormSelectOptions(Type, {
        [Type.A]: "Typ A",
        [Type.B]: "Typ B",
      }),
      isOptional: true,
    },
  ],
  checkboxInputs: [{ name: "isActive", label: "Czy jest aktywny" }],
};

function renderForm(defaultValues?: TestSchema & { id?: number }) {
  const user = userEvent.setup();

  const createOnSubmit = vi.fn();
  const editOnSubmit = vi.fn();

  const initialValues: TestSchema & { id?: number } = defaultValues ?? {
    name: "",
    description: "",
    type: null,
    isActive: false,
  };

  render(
    <AbstractResourceForm
      schema={testSchema}
      defaultValues={initialValues}
      createOnSubmit={createOnSubmit}
      editOnSubmit={editOnSubmit}
      formInputs={formInputs}
      returnButtonPath={"/"}
      returnButtonLabel={"Powrót"}
    />,
  );

  const nameInput = screen.getByLabelText("Nazwa");
  const descriptionInput = screen.getByLabelText("Opis");
  const selectInput = screen.getByRole("combobox");
  const checkboxInput = screen.getByLabelText("Czy jest aktywny");
  const submitButton = screen.getByText("Zapisz");

  return {
    user,
    createOnSubmit,
    editOnSubmit,
    nameInput,
    descriptionInput,
    selectInput,
    checkboxInput,
    submitButton,
  };
}

describe("Abstract Resource Form", () => {
  it("renders form and submits new data", async () => {
    const form = renderForm();

    await form.user.type(form.nameInput, "Test Name");
    await form.user.type(form.descriptionInput, "Test Description");
    await form.user.click(form.selectInput);
    await form.user.click(screen.getByRole("option", { name: "Typ B" }));
    await form.user.click(form.checkboxInput);
    await form.user.click(form.submitButton);

    expect(form.createOnSubmit).toHaveBeenCalledWith({
      name: "Test Name",
      description: "Test Description",
      type: "B",
      isActive: true,
    });
    expect(form.editOnSubmit).not.toHaveBeenCalled();
  });

  it("renders form and submits edited data", async () => {
    const form = renderForm({
      id: 1,
      name: "Initial Name",
      description: "Initial Description",
      type: Type.A,
      isActive: false,
    });

    await form.user.clear(form.nameInput);
    await form.user.type(form.nameInput, "Updated Name");
    await form.user.click(screen.getByText("Zapisz"));

    expect(form.editOnSubmit).toHaveBeenCalledWith(1, {
      name: "Updated Name",
      description: "Initial Description",
      type: Type.A,
      isActive: false,
    });
    expect(form.createOnSubmit).not.toHaveBeenCalled();
  });

  it("requires user to fill required field", async () => {
    const form = renderForm();

    expect(
      screen.queryByText(FORM_ERROR_MESSAGES.REQUIRED),
    ).not.toBeInTheDocument();
    await form.user.click(screen.getByText("Zapisz"));
    expect(
      screen.queryByText(FORM_ERROR_MESSAGES.REQUIRED),
    ).toBeInTheDocument();
  });

  it("allows the user to clear the optional select input", async () => {
    const form = renderForm({
      name: "Initial Name",
      description: "Initial Description",
      type: Type.A,
      isActive: false,
    });

    await form.user.click(form.selectInput);
    await form.user.click(screen.getByRole("option", { name: "Wybierz typ" }));
    await form.user.click(form.submitButton);

    expect(form.createOnSubmit).toHaveBeenCalledWith({
      name: "Initial Name",
      description: "Initial Description",
      type: null,
      isActive: false,
    });
    expect(form.editOnSubmit).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation through form elements", async () => {
    const form = renderForm({
      name: "Initial Name",
      description: "Initial Description",
      type: null,
      isActive: false,
    });

    await form.user.click(form.nameInput);
    expect(form.nameInput).toHaveFocus();

    await form.user.tab();
    expect(form.descriptionInput).toHaveFocus();

    await form.user.tab();
    expect(form.selectInput).toHaveFocus();

    await form.user.keyboard("{Enter}");
    await form.user.keyboard("{ArrowDown}");
    await form.user.keyboard("{Enter}"); // Select first option (Typ A)

    await form.user.tab();
    expect(form.checkboxInput).toHaveFocus();
    await form.user.keyboard(" "); // Toggle checkbox with Space

    await form.user.tab();
    expect(form.submitButton).toHaveFocus();
    await form.user.keyboard("{Enter}");

    expect(form.createOnSubmit).toHaveBeenCalledWith({
      name: "Initial Name",
      description: "Initial Description",
      type: "A",
      isActive: true,
    });
  });
});
