import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR } from "@/config/constants";
import { AbstractResourceForm } from "@/features/abstract-resource-form";
import { Resource, getResourceMetadata } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import { typedEntries } from "@/lib/helpers";
import { expectInputValue, renderWithProviders } from "@/tests/unit";
import type { FormInputBase } from "@/types/forms";

const DEFAULT_BANNER: ResourceFormValues<Resource.Banners> = {
  ...getResourceMetadata(Resource.Banners).form.defaultValues,
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
    const inputSections = getResourceMetadata(Resource.Banners).form.inputs;
    const allInputs = Object.values(inputSections).flatMap(
      (section) =>
        typedEntries(section) as [keyof typeof DEFAULT_BANNER, FormInputBase][],
    );
    for (const [name, input] of allInputs) {
      const value = DEFAULT_BANNER[name];
      const inputElement = screen.getByLabelText(input.label);
      expectInputValue(inputElement, value);
    }
  });
});
