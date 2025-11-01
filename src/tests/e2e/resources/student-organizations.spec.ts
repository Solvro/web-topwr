import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import type { Locator, Page, Response } from "@playwright/test";

import { LIST_RESULTS_PER_PAGE } from "@/config/constants";
import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
  Resource,
  UniversityBranch,
} from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import { FetchError, fetchMutation } from "@/lib/fetch-utils";
import { deleteAccessToken, generateAccessToken } from "@/tests/helpers/auth";
import type { MessageResponse, ModifyResourceResponse } from "@/types/api";
import type { Id, ResourceDataType, ResourceFormValues } from "@/types/app";
import type { NonNullableValues } from "@/types/helpers";

import {
  expectAbstractResourceFormSuccess,
  returnFromAbstractResourceForm,
  selectOptionByLabel,
  setAbstractResourceListFilters,
} from "../helpers";

const resource = Resource.StudentOrganizations;
type ResourceType = typeof resource;

type PartialNonNullableFormValues = Partial<
  NonNullableValues<ResourceFormValues<ResourceType>>
>;

let accessTokenOverride: string;
let refreshToken: string;
type MockStudentOrganization = ReturnType<typeof generateTestOrganization>;

type CreateOrganizationResponse = ModifyResourceResponse<
  ResourceType,
  MockStudentOrganization
>;

/** Gets the 'delete organization' button on the current page or within the given locator. */
const getDeleteButton = (page: Page | Locator) =>
  page.getByRole("button", { name: /usuń organizację studencką/i });

/** Gets the 'edit organization' link on the current page or within the given locator. */
const getEditButton = (page: Page | Locator) =>
  page.getByRole("link", { name: /edytuj organizację studencką/i });

/** Gets the 'archive organization' link on the current page or within the given locator. */
const getArchiveButton = (page: Page | Locator) =>
  page.getByRole("button", { name: /archiwizuj organizację studencką/i });

/** Gets the 'restore organization' link on the current page or within the given locator. */
const getRestoreButton = (page: Page | Locator) =>
  page.getByRole("button", { name: /przywróć organizację studencką/i });

const generateTestOrganization = (
  propertyOverrides: PartialNonNullableFormValues = {},
) =>
  ({
    name: faker.company.name(),
    shortDescription: faker.lorem.sentence(10),
    description: faker.lorem.paragraph(3),
    coverPreview: false,
    source: OrganizationSource.Manual,
    departmentId: 5,
    organizationType: OrganizationType.ScientificClub,
    organizationStatus: OrganizationStatus.Active,
    isStrategic: false,
    branch: UniversityBranch.MainCampus,
    ...propertyOverrides,
  }) satisfies ResourceFormValues<ResourceType>;

async function createTestOrganization(
  propertyOverrides: PartialNonNullableFormValues = {},
) {
  const body = generateTestOrganization(propertyOverrides);
  const response = await fetchMutation<CreateOrganizationResponse>("/", {
    resource,
    body,
    accessTokenOverride,
  });
  return response.data;
}

/** Deletes the student organization with the given id from the backend.
 * @param id The id of the organization to delete.
 * @param strict Causes an error to be raised if the request returns a non-200 response. Defaults to false.
 */
async function deleteTestOrganization(id?: Id, strict = false) {
  try {
    await fetchMutation<MessageResponse>(String(id), {
      resource,
      method: "DELETE",
      accessTokenOverride,
    });
  } catch (error) {
    if (!(error instanceof FetchError)) {
      throw error;
    }
    if (error.responseStatus !== 404) {
      throw error;
    }
    if (error.errorReport?.error.code !== "E_NOT_FOUND") {
      throw error;
    }
    if (strict) {
      throw error;
    }
  }
}

async function navigateToOrganizations(page: Page) {
  await page.getByRole("link", { name: /organizacje studenckie/i }).click();
}

/** Sets the abstract resource list filters such that the only displayed organization is the provided one. */
async function filterSpecificOrganization(
  page: Page,
  organization: MockStudentOrganization,
) {
  await setAbstractResourceListFilters(page, {
    searchField: "description",
    searchFieldLabel: "opisie",
    // Hopefully fakerjs's lorem descriptions are random enough to guarantee uniqueness
    // This might need to be adjusted if there are collisions
    searchTerm: organization.description,
  });
}

test.describe("Student Organizations CRUD", () => {
  test.beforeAll(async () => {
    ({ accessToken: accessTokenOverride, refreshToken } =
      await generateAccessToken());
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.afterAll(async () => {
    await deleteAccessToken(accessTokenOverride, refreshToken);
    accessTokenOverride = "";
    refreshToken = "";
  });

  test("should create an organization", async ({ page }) => {
    const testOrganization = generateTestOrganization();

    await test.step("Fill create organization form", async () => {
      await navigateToOrganizations(page);

      await page.getByRole("link", { name: /dodaj organizację/i }).click();
      await page.waitForURL(`/${resource}/create`);

      await page
        .getByLabel("Nazwa", { exact: true })
        .fill(testOrganization.name);
      await page
        .getByLabel("Krótki opis", { exact: true })
        .fill(testOrganization.shortDescription);
      await page
        .getByRole("textbox", { name: "Opis", exact: true })
        .fill(testOrganization.description);

      await selectOptionByLabel(
        page,
        "Wydział",
        // TODO: extract the labels from the `testOrganization` properties
        "Wydział Informatyki i Telekomunikacji",
      );
      await selectOptionByLabel(page, "Źródło", "Ręcznie");
      await selectOptionByLabel(page, "Typ", "Organizacja studencka");
      await selectOptionByLabel(page, "Status", "Aktywna");

      await page
        .getByRole("checkbox", { name: /czy jest kołem strategicznym/i })
        .setChecked(testOrganization.isStrategic);
    });

    const responsePromise = page.waitForResponse(
      (response: Response) =>
        response.request().method() === "POST" &&
        response.url().split("/").includes(RESOURCE_METADATA[resource].apiPath),
    );
    try {
      await test.step("Submit create organization form", async () => {
        const button = page.getByRole("button", { name: /utwórz/i });
        await expect(button).toBeEnabled();
        await button.click();
        await expectAbstractResourceFormSuccess(page);
      });

      await test.step("Ensure creation is persisted", async () => {
        await returnFromAbstractResourceForm(page, resource);
        await filterSpecificOrganization(page, testOrganization);
        await expect(page.getByText(testOrganization.name)).toBeVisible();
        await expect(
          page.getByText(testOrganization.shortDescription),
        ).toBeVisible();
      });
    } finally {
      const response = await responsePromise;
      const json = (await response.json()) as CreateOrganizationResponse;
      await deleteTestOrganization(json.data.id, true);
    }
  });

  test("should read an organization from the list", async ({ page }) => {
    const testOrganization = await createTestOrganization();
    try {
      await navigateToOrganizations(page);
      await expect(getEditButton(page)).toHaveCount(LIST_RESULTS_PER_PAGE); // assuming the database isn't empty (change this if using mocks)
      await filterSpecificOrganization(page, testOrganization);

      await expect(getEditButton(page)).toHaveCount(1);

      await expect(page.getByText(testOrganization.name)).toBeVisible();
      await expect(
        page.getByText(testOrganization.shortDescription),
      ).toBeVisible();
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });

  test("should update an existing organization", async ({ page }) => {
    const newName = `${faker.company.name()} UPDATED TEST NAME`;
    const testOrganization = await createTestOrganization();

    try {
      await test.step("Change organization name", async () => {
        await navigateToOrganizations(page);
        await filterSpecificOrganization(page, testOrganization);
        await getEditButton(page).click();
        await page.waitForURL(`/${resource}/edit/*`);
        const submitButton = page.getByRole("button", { name: /zapisz/i });
        // TODO: for some reason the button is sometimes iniitally enabled
        // when the rich text editor is rendered
        // await expect(submitButton).toBeDisabled();
        const nameInput = page.getByLabel("Nazwa", { exact: true });
        await expect(nameInput).toHaveValue(testOrganization.name);
        await nameInput.clear();
        await nameInput.fill(newName);
        await expect(submitButton).toBeEnabled();
        await submitButton.click();
        await expectAbstractResourceFormSuccess(page);
        await page.reload();
        await expect(nameInput).toHaveValue(newName);
      });

      const newOrganization = {
        ...testOrganization,
        name: newName,
      } satisfies ResourceDataType<ResourceType>;

      await test.step("Ensure update is persisted", async () => {
        await returnFromAbstractResourceForm(page, resource);
        await filterSpecificOrganization(page, newOrganization);
        await expect(page.getByText(newOrganization.name)).toBeVisible();
        await expect(
          page.getByText(newOrganization.shortDescription),
        ).toBeVisible();
      });
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });

  test("should archive and restore an active organization", async ({
    page,
  }) => {
    const testOrganization = await createTestOrganization();
    try {
      await navigateToOrganizations(page);
      await filterSpecificOrganization(page, testOrganization);
      await getArchiveButton(page).click();

      await expect(
        page.getByText(/Organizacja studencka została zarchiwizowana/i),
      ).toBeVisible();
      await expect(getArchiveButton(page)).toBeHidden();
      await expect(getRestoreButton(page)).toBeVisible();

      await getRestoreButton(page).click();
      await expect(
        page.getByText(/Organizacja studencka została przywrócona/i),
      ).toBeVisible();
      await expect(getRestoreButton(page)).toBeHidden();
      await expect(getArchiveButton(page)).toBeVisible();
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });

  test("should delete an existing organization", async ({ page }) => {
    const testOrganization = await createTestOrganization();
    try {
      await navigateToOrganizations(page);
      await filterSpecificOrganization(page, testOrganization);
      await getEditButton(page).click();

      const deleteButton = getDeleteButton(page);
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      await page.getByRole("button", { name: /^usuń$/i }).click();

      await expect(
        page.getByText(/pomyślnie usunięto organizację/i),
      ).toBeVisible();

      await filterSpecificOrganization(page, testOrganization);
      await expect(getEditButton(page)).toBeHidden();
      await expect(getDeleteButton(page)).toBeHidden();
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });
});
