import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { Resource } from "@/config/enums";

import { setArlSortFilters } from "../utils/set-arl-filters";

const ROLES = [
  "Flutter Techlead",
  "Flutter Developer",
  "Project Manager",
  "UI/UX Designer",
  "DevOps",
  "Pomysłodawca",
  "Media Administrator",
  "Quality Assurance",
  "Marketing Manager",
  "Head of Mobile",
  "Senior Project Manager",
  "Backend Techlead",
  "Junior Flutter Techlead",
  "Backend Developer",
  "Koordynator zarządu",
  "Pierwotny Pomysłodawca",
];

const resource = Resource.Milestones;

async function navigateToMilestones(page: Page) {
  await page.getByRole("link", { name: /sekcja o nas/i }).click();
  await page.getByRole("link", { name: /zarządzanie wersjami/i }).click();
}

/** Gets the 'edit milestone' link on the current page or within the given locator. */
const getEditButton = (page: Page | Locator) =>
  page.getByRole("link", { name: /edytuj wersję/i });

const getContributorsInput = (page: Page | Locator) =>
  page.getByText("Kontrybutorzy");

const filterFirstVersion = async (page: Page) =>
  setArlSortFilters(page, resource, {
    filters: [
      {
        field: "name",
        value: "1.0.0",
      },
    ],
  });

test.describe("About Us Versions CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await navigateToMilestones(page);
  });

  test("should allow users to select relation pivot data", async ({ page }) => {
    await filterFirstVersion(page);
    await getEditButton(page).click();
    const input = getContributorsInput(page);
    await expect(input).toBeVisible();
    await input.click();
    const konrad = page.getByRole("option", { name: "Konrad Guzek" });
    await expect(konrad).toBeVisible();
    const konradPivotData = konrad.getByRole("combobox", {
      name: "Ustaw relację między wersją a kontrybutorem Konrad Guzek",
    });
    await konradPivotData.scrollIntoViewIfNeeded();
    await expect(konradPivotData).toBeVisible();
    await expect(konradPivotData).toHaveText("Dodaj");
    await konradPivotData.click();
    for (const role of ROLES) {
      const option = page.getByRole("option", { name: role, exact: true });
      await expect(option).toBeVisible();
    }
    const role = "Flutter Techlead";
    await page.getByRole("option", { name: role, exact: true }).click();
    await expect(page.getByText(/pomyślnie zapisano/i)).toBeVisible();
    await expect(konradPivotData).toHaveText(role);
    await konradPivotData.click();
    const deleteButton = page.getByRole("option", {
      name: "Usuń kontrybutora",
    });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    await konrad.click();
    await expect(konradPivotData).toHaveText("Dodaj");
  });

  test("should show a dialog when navigating away with unsaved changes", async ({
    page,
  }) => {
    await filterFirstVersion(page);
    await getEditButton(page).click();
    const input = page.getByLabel(/nazwa/i);
    await expect(input).toBeVisible();
    await input.fill("TEST");
    const backButton = page.getByRole("link", { name: /wróć/i });

    await backButton.click();
    await expect(page.getByText(/masz niezapisane zmiany/i)).toBeVisible();
    await page.getByRole("button", { name: /anuluj/i }).click();
    await expect(input).toBeVisible();

    await backButton.click();
    await page.getByRole("link", { name: /kontynuuj/i }).click();
    await filterFirstVersion(page);
    await expect(getEditButton(page)).toBeVisible();
  });
});
