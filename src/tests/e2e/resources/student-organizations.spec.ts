import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import { Resource } from "@/config/enums";
import { encodeQueryComponent } from "@/lib/helpers";
import { MOCK_STUDENT_ORGANIZATION } from "@/tests/mocks/constants";

import { login, selectOptionByLabel } from "../helpers";

const getOrganizationContainer = (page: Page) =>
  page
    .getByTestId("abstract-resource-list")
    .locator("div", {
      has: page.getByText(MOCK_STUDENT_ORGANIZATION.name),
    })
    .filter({
      has: page.getByText(MOCK_STUDENT_ORGANIZATION.shortDescription),
    });

async function returnFromAbstractResourceForm(page: Page) {
  await page.getByRole("link", { name: /wróć do organizacji/i }).click();
  await page.waitForURL(`/${Resource.StudentOrganizations}`);
}

test.describe("Student Organizations CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page
      .getByRole("link", { name: /zarządzanie organizacjami/i })
      .click();
  });

  test("should create, read, update and delete an organization", async ({
    page,
  }) => {
    await test.step("Create", async () => {
      await page.getByRole("link", { name: /dodaj organizację/i }).click();
      await page.waitForURL(`/${Resource.StudentOrganizations}/create`);

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
        [MOCK_STUDENT_ORGANIZATION.isStrategic ? "check" : "uncheck"]();

      await page.getByRole("button", { name: /zapisz/i }).click();
      await expect(page.getByText(/pomyślnie zapisano/i)).toBeVisible();
    });

    await test.step("Read", async () => {
      await returnFromAbstractResourceForm(page);
      await expect(
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(LIST_RESULTS_PER_PAGE); // assuming the database isn't empty (change this if using mocks)

      await selectOptionByLabel(page, /szukaj w/i, "opisie");
      await page
        .getByLabel(/wyrażenia/i)
        .fill(MOCK_STUDENT_ORGANIZATION.description);
      await page.getByRole("button", { name: /zatwierdź/i }).click();

      await page.waitForURL(
        `/${Resource.StudentOrganizations}?sortBy=id&sortDirection=asc&searchTerm=${encodeQueryComponent(MOCK_STUDENT_ORGANIZATION.description)}&searchField=description`,
      );
      await expect(
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(1);

      await expect(getOrganizationContainer(page)).toBeVisible();
    });

    await test.step("Update", async () => {
      await getOrganizationContainer(page).locator("a").click();
      await page.waitForURL(`/${Resource.StudentOrganizations}/edit/*`);
      const newName = `${faker.company.name()} UPDATED TEST NAME`;
      await page.getByLabel("Nazwa").fill(newName);
      await page.getByRole("button", { name: /zapisz/i }).click();
      MOCK_STUDENT_ORGANIZATION.name = newName;
    });

    await test.step("Read (again)", async () => {
      await returnFromAbstractResourceForm(page);

      await selectOptionByLabel(page, /sortuj według/i, "daty utworzenia");
      await selectOptionByLabel(page, /w kolejności/i, "malejącej");
      await page.getByRole("button", { name: /zatwierdź/i }).click();
      await page.waitForURL(
        `/${Resource.StudentOrganizations}?sortBy=createdAt&sortDirection=desc`,
      );
    });

    await test.step("Delete", async () => {
      await getOrganizationContainer(page).locator("button").click();
      await page.getByRole("button", { name: /usuń/i }).click();

      await expect(
        page.getByText(/pomyślnie usunięto organizację/i),
      ).toBeVisible();
      await expect(getOrganizationContainer(page)).not.toBeVisible();
    });
  });
});
