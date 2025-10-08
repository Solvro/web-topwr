import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR } from "@/config/constants";
import { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { expectInputValue, renderWithProviders } from "@/tests/helpers/react";
import type { ResourceFormValues } from "@/types/app";

import CreateBannerPage from "./page";

const DEFAULT_BANNER: ResourceFormValues<Resource.Banners> = {
  ...RESOURCE_METADATA[Resource.Banners].form.defaultValues,
  textColor: DEFAULT_COLOR,
  titleColor: DEFAULT_COLOR,
  backgroundColor: DEFAULT_COLOR,
};

function renderCreatePage() {
  const screen = renderWithProviders(<CreateBannerPage />);
  return { screen };
}
describe("new banner creation form", () => {
  it("initializes empty form", () => {
    const { screen } = renderCreatePage();
    expect(screen.getByLabelText("Tytuł")).toHaveValue(DEFAULT_BANNER.title);
    expect(screen.getByLabelText("Opis")).toHaveValue(
      DEFAULT_BANNER.description,
    );
    expect(screen.getByLabelText("URL")).toHaveValue(DEFAULT_BANNER.url);
    expect(screen.getByLabelText("Wersja robocza")).toBeChecked();

    const inputSections = RESOURCE_METADATA[Resource.Banners].form.inputs;
    const allInputs = [];
    for (const inputs of Object.values(inputSections)) {
      allInputs.push(...(inputs as { name: string; label: string }[]));
    }
    for (const entry of allInputs) {
      const value = DEFAULT_BANNER[entry.name as keyof typeof DEFAULT_BANNER];
      const inputElement = screen.getByLabelText(entry.label);
      expectInputValue(inputElement, value);
    }
  });
});
