import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import type { Page, Response } from "@playwright/test";

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
import type { MessageResponse } from "@/types/api";
import type { Id, ResourceDataType, ResourceFormValues } from "@/types/app";

import {
  expectAbstractResourceFormSuccess,
  login,
  logout,
  returnFromAbstractResourceForm,
  selectOptionByLabel,
  setAbstractResourceListFilters,
} from "../helpers";

const resource = Resource.StudentOrganizations;
type ResourceType = typeof resource;

type NonNullablePartialStudentOrganization = {
  [K in keyof ResourceFormValues<ResourceType>]?: NonNullable<
    ResourceFormValues<ResourceType>[K]
  >;
};

let accessTokenOverride: string;
let refreshToken: string;
type MockStudentOrganization = ReturnType<typeof generateTestOrganization>;

interface CreateOrganizationResponse extends MessageResponse {
  data: ResourceDataType<ResourceType> & MockStudentOrganization;
}

const generateTestOrganization = (
  propertyOverrides: NonNullablePartialStudentOrganization = {},
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
  propertyOverrides: NonNullablePartialStudentOrganization = {},
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
    if (error.responseStatus !== 422) {
      throw error;
    }
    if (error.errorReport?.error.validationIssues?.[0].field !== "params.id") {
      throw error;
    }
    if (strict) {
      console.error("deleting organization with id", id, "failed:", error);
      throw error;
    }
  }
}

async function navigateToOrganizations(page: Page) {
  await page.getByRole("link", { name: /zarządzanie organizacjami/i }).click();
}

/** Sets the abstract resource list filters such that the only displayed organization is the provided one. */
async function filterSpecificOrganization(
  page: Page,
  organization: MockStudentOrganization,
) {
  await setAbstractResourceListFilters(page, resource, {
    searchField: "description",
    searchFieldLabel: "opisie",
    // Hopefully fakerjs's lorem descriptions are random enough to guarantee uniqueness
    // This might need to be adjusted if there are collisions
    searchTerm: organization.description,
  });
}

const getOrganizationContainer = (
  page: Page,
  organization: Pick<
    ResourceFormValues<ResourceType>,
    "name" | "shortDescription"
  >,
) =>
  // TODO: cleaner locator
  page
    .getByTestId("abstract-resource-list")
    .locator("div")
    .filter({ hasText: organization.name })
    .filter({ hasText: organization.shortDescription ?? "" });

test.describe("Student Organizations CRUD", () => {
  test.beforeAll(async () => {
    ({ accessToken: accessTokenOverride, refreshToken } =
      await generateAccessToken());
  });

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test.afterEach(async ({ page }) => {
    await logout(page);
  });

  test.afterAll(async () => {
    await deleteAccessToken(accessTokenOverride, refreshToken);
  });

  test("should create an organization", async ({ page }) => {
    await navigateToOrganizations(page);
    const testOrganization = generateTestOrganization();

    await page.getByRole("link", { name: /dodaj organizację/i }).click();
    await page.waitForURL(`/${resource}/create`);

    await page.getByLabel("Nazwa").fill(testOrganization.name);
    await page
      .getByLabel("Krótki opis")
      .fill(testOrganization.shortDescription);
    await page
      .getByLabel("Opis", { exact: true })
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

    const responsePromise = page.waitForResponse(
      (response: Response) =>
        response.url().split("/").at(-2) ===
          RESOURCE_METADATA[resource].apiPath &&
        response.request().method() === "POST",
    );

    try {
      await page.getByRole("button", { name: /zapisz/i }).click();
      await expectAbstractResourceFormSuccess(page);
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
      await expect(
        // TODO: cleaner locator
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(LIST_RESULTS_PER_PAGE); // assuming the database isn't empty (change this if using mocks)
      await filterSpecificOrganization(page, testOrganization);

      await expect(
        // TODO: cleaner locator
        page.getByTestId("abstract-resource-list").locator(":scope > *"),
      ).toHaveCount(1);

      await expect(
        getOrganizationContainer(page, testOrganization),
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
        await getOrganizationContainer(page, testOrganization)
          .getByLabel(/edytuj organizację studencką/i)
          .click();
        await page.waitForURL(`/${resource}/edit/*`);
        const submitButton = page.getByRole("button", { name: /zapisz/i });
        await expect(submitButton).toBeDisabled();
        const nameInput = page.getByLabel("Nazwa");
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
        await expect(
          getOrganizationContainer(page, newOrganization),
        ).toBeVisible();
      });
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });

  test("should delete an existing organization", async ({ page }) => {
    const testOrganization = await createTestOrganization();
    try {
      await navigateToOrganizations(page);
      await filterSpecificOrganization(page, testOrganization);
      await getOrganizationContainer(page, testOrganization)
        .getByLabel(/usuń organizację studencką/i)
        .click();
      await page.getByRole("button", { name: /usuń/i }).click();

      await expect(
        page.getByText(/pomyślnie usunięto organizację/i),
      ).toBeVisible();
      await expect(
        getOrganizationContainer(page, testOrganization),
      ).not.toBeVisible();
    } finally {
      await deleteTestOrganization(testOrganization.id);
    }
  });
});
