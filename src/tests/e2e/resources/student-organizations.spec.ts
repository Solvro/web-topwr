import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import { Resource } from "@/config/enums";
import { MOCK_STUDENT_ORGANIZATION } from "@/tests/mocks/constants";

import {
  expectAbstractResourceFormSuccess,
  login,
  logout,
  returnFromAbstractResourceForm,
  selectOptionByLabel,
  setAbstractResourceListFilters,
} from "../helpers";

const resource = Resource.StudentOrganizations;

const getOrganizationContainer = (
  page: Page,
  organizationName: string = MOCK_STUDENT_ORGANIZATION.name,
  organizationShortDescription = MOCK_STUDENT_ORGANIZATION.shortDescription,
) =>
  page
    .getByTestId("abstract-resource-list")
    .locator("div", {
      has: page.getByText(organizationName),
    })
    .filter({
      has: page.getByText(organizationShortDescription),
    });

test.describe("Student Organizations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page
      .getByRole("link", { name: /zarządzanie organizacjami/i })
      .click();
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test("should create, read, update and delete an organization", async ({
    page,
  }) => {
    await test.step("Create", async () => {
      await page.getByRole("link", { name: /dodaj organizację/i }).click();
      await page.waitForURL(`/${resource}/create`);

      await page.getByLabel("Nazwa").fill(MOCK_STUDENT_ORGANIZATION.name);
      await page
        .getByLabel("Krótki opis")
        .fill(MOCK_STUDENT_ORGANIZATION.shortDescription);
      await page
        .getByLabel("Opis", { exact: true })
        .fill(MOCK_STUDENT_ORGANIZATION.description);

      await selectOptionByLabel(
        page,
        "Wydział",
        // TODO: extract the labels from the MOCK_STUDENT_ORGANIZATION properties
        "Wydział Informatyki i Telekomunikacji",
      );
      await selectOptionByLabel(page, "Źródło", "Ręcznie");
      await selectOptionByLabel(page, "Typ", "Organizacja studencka");
      await selectOptionByLabel(page, "Status", "Aktywna");

      await page
        .getByRole("checkbox", { name: /czy jest kołem strategicznym/i })
        .setChecked(MOCK_STUDENT_ORGANIZATION.isStrategic);

      await page.getByRole("button", { name: /zapisz/i }).click();
      await expectAbstractResourceFormSuccess(page);
    });

    await test.step("Read", async () => {
      await returnFromAbstractResourceForm(page, resource);
      await expect(
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(LIST_RESULTS_PER_PAGE); // assuming the database isn't empty (change this if using mocks)

      await setAbstractResourceListFilters(page, resource, {
        searchField: "description",
        searchFieldLabel: "opisie",
        searchTerm: MOCK_STUDENT_ORGANIZATION.description,
      });

      await expect(
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(1);

      await expect(getOrganizationContainer(page)).toBeVisible();
    });

    const newName = `${faker.company.name()} UPDATED TEST NAME`;

    await test.step("Update", async () => {
      await getOrganizationContainer(page)
        .getByLabel(/edytuj organizację studencką/i)
        .click();
      await page.waitForURL(`/${resource}/edit/*`);
      const submitButton = page.getByRole("button", { name: /zapisz/i });
      await expect(submitButton).toBeDisabled();
      const nameInput = page.getByLabel("Nazwa");
      await expect(nameInput).toHaveValue(MOCK_STUDENT_ORGANIZATION.name);
      await nameInput.clear();
      await nameInput.fill(newName);
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
      await expectAbstractResourceFormSuccess(page, 2);
      await page.reload();
      await expect(nameInput).toHaveValue(newName);
    });

    await test.step("Read (again)", async () => {
      await returnFromAbstractResourceForm(page, resource);
      await setAbstractResourceListFilters(page, resource, {
        sortBy: "createdAt",
        sortDirection: "desc",
      });
    });

    await test.step("Delete", async () => {
      await getOrganizationContainer(page, newName)
        .getByLabel(/usuń organizację studencką/i)
        .click();
      await page.getByRole("button", { name: /usuń/i }).click();

      await expect(
        page.getByText(/pomyślnie usunięto organizację/i),
      ).toBeVisible();
      await expect(getOrganizationContainer(page, newName)).not.toBeVisible();
    });
  });
});
