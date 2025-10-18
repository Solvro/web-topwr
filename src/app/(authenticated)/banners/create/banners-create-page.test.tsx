import { describe, expect, it } from "vitest";

import { AbstractResourceForm } from "@/components/abstract/resource-form";
import { DEFAULT_COLOR } from "@/config/constants";
import { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { expectInputValue, renderWithProviders } from "@/tests/helpers/react";
import type { ResourceFormValues } from "@/types/app";

const DEFAULT_BANNER: ResourceFormValues<Resource.Banners> = {
  ...RESOURCE_METADATA[Resource.Banners].form.defaultValues,
  textColor: DEFAULT_COLOR,
  titleColor: DEFAULT_COLOR,
  backgroundColor: DEFAULT_COLOR,
};

async function renderCreatePage() {
  const screen = renderWithProviders(
    await AbstractResourceForm({ resource: Resource.Banners }),
  );
  return { screen };
}
describe("new banner creation form", () => {
  it("initializes empty form", async () => {
    const { screen } = await renderCreatePage();
    expect(screen.getByLabelText("Tytuł")).toHaveValue(DEFAULT_BANNER.title);
    expect(screen.getByLabelText("Opis")).toHaveValue(
      DEFAULT_BANNER.description,
    );
    expect(screen.getByLabelText("URL")).toHaveValue(DEFAULT_BANNER.url);
    expect(screen.getByLabelText("Wersja robocza")).toBeChecked();
    const inputSections = RESOURCE_METADATA[Resource.Banners].form.inputs;
    const allInputs = Object.values(inputSections).flatMap((section) =>
      Object.entries(section),
    );
    for (const [name, input] of allInputs) {
      const value = DEFAULT_BANNER[name as keyof typeof DEFAULT_BANNER];
      const inputElement = screen.getByLabelText(input.label);
      expectInputValue(inputElement, value);
    }
  });
});
