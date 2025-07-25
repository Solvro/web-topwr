import { test } from "@playwright/test";

import { login } from "../helpers";

// const getOrganizationContainer = (page: Page) =>
//   page
//     .locator("div", {
//       has: page.getByText(MOCK_STUDENT_ORGANIZATION.name),
//     })
//     .filter({
//       has: page.getByText(MOCK_STUDENT_ORGANIZATION.description),
//     });

// async function returnFromAbstractResourceForm(page: Page) {
//   await page.getByRole("link", { name: /wróć do organizacji/i }).click();
//   await page.waitForURL(`/${Resource.StudentOrganizations}`);
// }

// test.describe("Student Organizations", () => {
//   test.beforeEach(async ({ page }) => {
//     await login(page);
//     await page
//       .getByRole("link", { name: /zarządzanie organizacjami/i })
//       .click();
//   });

//   test("should create, read, update and delete an organization", async ({
//     page,
//   }) => {
//     await test.step("Create", async () => {
//       await page.getByRole("link", { name: /dodaj organizację/i }).click();
//       await page.waitForURL(`/${Resource.StudentOrganizations}/create`);

//       await page.getByLabel("Nazwa").fill(MOCK_STUDENT_ORGANIZATION.name);
//       await page.getByLabel("Opis").fill(MOCK_STUDENT_ORGANIZATION.description);
//       await page
//         .getByLabel("Typ")
//         .selectOption(MOCK_STUDENT_ORGANIZATION.organizationType);
//       await page
//         .getByLabel("Status")
//         .selectOption(MOCK_STUDENT_ORGANIZATION.organizationStatus);
//       await page
//         .getByLabel("Czy strategiczna?")
//         [MOCK_STUDENT_ORGANIZATION.isStrategic ? "check" : "uncheck"]();

//       await page.getByRole("button", { name: /zapisz/i }).click();
//       await expect(page.getByText(/pomyślnie zapisano/i)).toBeVisible();
//     });

//     await test.step("Read", async () => {
//       await returnFromAbstractResourceForm(page);

//       await selectOptionByLabel(page, /sortuj według/i, "createdAt");
//       await selectOptionByLabel(page, /w kolejności/i, "desc");
//       await page.getByRole("button", { name: /zatwierdź/i }).click();
//       await page.waitForURL(
//         `/${Resource.StudentOrganizations}?sortBy=createdAt&sortOrder=desc`,
//       );

//       await expect(getOrganizationContainer(page)).toBeVisible();
//     });

//     await test.step("Update", async () => {
//       await getOrganizationContainer(page).locator("a").click();
//       await page.waitForURL(`/${Resource.StudentOrganizations}/edit/*`);
//     });

//     await test.step("Delete", async () => {
//       await returnFromAbstractResourceForm(page);

//       await getOrganizationContainer(page).locator("button").click();
//       await page.getByRole("button", { name: /usuń/i }).click();

//       await expect(
//         page.getByText(/pomyślnie usunięto organizację/i),
//       ).toBeVisible();
//       await expect(getOrganizationContainer(page)).not.toBeVisible();
//     });
//   });
// });

test("codegened CRUD test", async ({ page }) => {
  // await page.goto("http://localhost:3000/login");
  // await page.getByRole("textbox", { name: "Email" }).click();
  // await page
  //   .getByRole("textbox", { name: "Email" })
  //   .fill(process.env.TEST_USER_EMAIL ?? "");
  // await page.getByRole("textbox", { name: "Email" }).press("Tab");
  // await page
  //   .getByRole("textbox", { name: "Hasło" })
  //   .fill(process.env.TEST_USER_PASSWORD ?? "");
  // await page.getByRole("textbox", { name: "Hasło" }).press("Enter");
  // await page.getByRole("button", { name: "Login" }).click();
  await login(page);

  await page.getByRole("link", { name: "Zarządzanie organizacjami" }).click();
  await page.getByRole("link", { name: "Dodaj organizację studencką" }).click();
  await page.getByRole("textbox", { name: "Nazwa" }).click();
  await page.getByRole("textbox", { name: "Nazwa" }).fill("12345");
  await page.getByRole("textbox", { name: "Krótki opis" }).click();
  await page.getByRole("textbox", { name: "Krótki opis" }).fill("opis");
  await page.getByRole("textbox", { name: "Krótki opis" }).press("Tab");
  await page
    .getByRole("textbox", { name: "Opis", exact: true })
    .fill("długi opis");
  await page.getByRole("combobox", { name: "Wydział" }).click();
  await page.getByRole("option", { name: "Wydział Zarządzania" }).click();
  await page.getByRole("combobox", { name: "Źródło" }).click();
  await page.getByRole("option", { name: "Ręcznie" }).click();
  await page.getByRole("combobox", { name: "Typ" }).click();
  await page.getByRole("option", { name: "Organizacja studencka" }).click();
  await page.getByRole("combobox", { name: "Status" }).click();
  await page.getByRole("option", { name: "Aktywna", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Czy jest kołem strategicznym?" })
    .click();
  await page.getByRole("button", { name: "Zapisz" }).click();
  await page.getByRole("link", { name: "Wróć do organizacji" }).click();
  await page.getByRole("combobox", { name: "Sortuj według" }).click();
  await page.getByRole("option", { name: "daty utworzenia" }).click();
  await page.getByRole("combobox", { name: "w kolejności" }).click();
  await page.getByRole("option", { name: "malejącej" }).click();
  await page.getByRole("button", { name: "Zatwierdź" }).click();
  await page
    .getByTestId("abstract-resource-list")
    .locator("div")
    .filter({ hasText: "12345opis" })
    .getByRole("link")
    .click();
  await page.getByRole("textbox", { name: "Nazwa" }).click();
  await page.getByRole("textbox", { name: "Nazwa" }).press("ControlOrMeta+a");
  await page.getByRole("textbox", { name: "Nazwa" }).fill("nowy tytuł");
  await page.getByRole("button", { name: "Zapisz" }).click();
  await page.getByRole("link", { name: "Wróć do organizacji" }).click();
  await page.getByRole("combobox", { name: "Sortuj według" }).click();
  await page.locator("html").click();
  await page.getByRole("combobox", { name: "Szukaj w" }).click();
  await page.getByRole("option", { name: "nazwie" }).click();
  await page.getByRole("textbox", { name: "wyrażenia" }).click();
  await page.getByRole("textbox", { name: "wyrażenia" }).fill("nowy tytuł");
  await page.getByRole("button", { name: "Zatwierdź" }).click();
  await page.getByRole("textbox", { name: "wyrażenia" }).click();
  await page
    .getByRole("textbox", { name: "wyrażenia" })
    .press("ControlOrMeta+a");
  await page.getByRole("textbox", { name: "wyrażenia" }).fill("nowy");
  await page.locator("form").click();
  await page.getByRole("button", { name: "Zatwierdź" }).click();
  await page.getByTestId("abstract-resource-list").getByRole("button").click();
  await page.getByRole("button", { name: "Usuń" }).click();
});
