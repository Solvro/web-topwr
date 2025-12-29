import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import type { Locator, Page, Response } from "@playwright/test";

import { LIST_RESULTS_PER_PAGE } from "@/features/abstract-resource-list/node";
import { FetchError, fetchMutation, uploadFile } from "@/features/backend/node";
import type {
  MessageResponse,
  ModifyResourceResponse,
} from "@/features/backend/types";
import { Resource, getResourceMetadata } from "@/features/resources/node";
import type {
  ResourceDataType,
  ResourceFormValues,
} from "@/features/resources/types";
import { MOCK_IMAGE_FILE, MOCK_IMAGE_KEY } from "@/tests/shared";
import type { NonNullableValues } from "@/types/helpers";
import { sanitizeId } from "@/utils";

import { deleteAccessToken } from "../api/delete-access-token";
import { generateAccessToken } from "../api/generate-access-token";
import { MOCK_IMAGE_PATH } from "../constants";
import { expectArfSuccess } from "../utils/expect-arf-success";
import { returnFromArf } from "../utils/return-from-arf";
import { setArlSortFilters } from "../utils/set-arl-filters";

const resource = Resource.GuideArticles;
type ResourceType = typeof resource;

type PartialNonNullableFormValues = Partial<
  NonNullableValues<ResourceFormValues<ResourceType>>
>;

let accessTokenOverride: string;
let refreshToken: string;
type MockGuideArticle = Awaited<ReturnType<typeof generateTestArticle>>;

type CreateArticleResponse = ModifyResourceResponse<
  ResourceType,
  MockGuideArticle
>;

/** Gets the 'delete article' button on the current page or within the given locator. */
const getDeleteButton = (page: Page | Locator) =>
  page.getByRole("button", { name: /usuń artykuł/i });

/** Gets the 'edit article' link on the current page or within the given locator. */
const getEditButton = (page: Page | Locator) =>
  page.getByRole("link", { name: /edytuj artykuł/i });

const generateTestArticle = (
  propertyOverrides: PartialNonNullableFormValues = {},
) =>
  ({
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraphs(2),
    shortDesc: faker.lorem.sentences(3),
    imageKey: MOCK_IMAGE_KEY,
    ...propertyOverrides,
  }) satisfies ResourceFormValues<ResourceType>;

async function uploadTestImage() {
  const createdImage = await uploadFile({
    file: MOCK_IMAGE_FILE,
    extension: "svg",
    accessTokenOverride,
  });
  return createdImage;
}

async function createTestArticle(
  propertyOverrides: PartialNonNullableFormValues = {},
) {
  const testImage = await uploadTestImage();

  const body = generateTestArticle({
    imageKey: testImage.uuid,
    ...propertyOverrides,
  });
  const response = await fetchMutation<ModifyResourceResponse<ResourceType>>(
    "/",
    {
      resource,
      body,
      accessTokenOverride,
    },
  );
  return response.data;
}

/** Deletes the guide article with the given id from the backend.
 * @param article The guide article to delete.
 * @param strict Causes an error to be raised if the request returns a non-200 response. Defaults to false.
 */
async function deleteTestArticle(
  article: CreateArticleResponse["data"],
  strict = false,
) {
  try {
    await fetchMutation<MessageResponse>(sanitizeId(article.id), {
      resource,
      method: "DELETE",
      accessTokenOverride,
    });
    // TODO: add this when the backend supports deleting files
    // await fetchMutation<MessageResponse>(`files/${article.imageKey}`, {
    //   method: "DELETE",
    //   accessTokenOverride,
    // });
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

async function navigateToArticles(page: Page) {
  await page.getByRole("link", { name: /artykuły/i }).click();
}

/** Sets the abstract resource list filters such that the only displayed article is the provided one. */
async function filterSpecificArticle(page: Page, article: MockGuideArticle) {
  await setArlSortFilters(page, resource, {
    filters: [
      {
        field: "shortDesc",
        value: article.shortDesc,
      },
    ],
  });
}

test.describe("Guide Articles CRUD", () => {
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

  test("should create an article", async ({ page }) => {
    const testArticle = generateTestArticle();

    const createImageResponsePromise = page.waitForResponse(
      (response: Response) =>
        response.request().method() === "POST" &&
        response.url().split("/").includes("files"),
    );

    await test.step("Fill create article form", async () => {
      await navigateToArticles(page);

      await page.getByRole("link", { name: /dodaj artykuł/i }).click();
      await page.waitForURL(`/${resource}/create`);

      await page.getByLabel("Tytuł").fill(testArticle.title);
      await page.getByLabel("Krótki opis").fill(testArticle.shortDesc);
      await page
        .getByRole("textbox", { name: "Opis", exact: true })
        .fill(testArticle.description);
      await page.getByLabel("Zdjęcie").setInputFiles(MOCK_IMAGE_PATH);
    });

    const imageResponse = await createImageResponsePromise;
    const imageData = (await imageResponse.json()) as { key: string };
    const imageKey = imageData.key.split(".")[0];

    const articlePromise = page.waitForResponse(
      (response: Response) =>
        response.request().method() === "POST" &&
        response
          .url()
          .split("/")
          .includes(getResourceMetadata(resource).apiPath),
    );
    try {
      await test.step("Submit create article form", async () => {
        const button = page.getByRole("button", { name: /utwórz/i });
        await expect(button).toBeEnabled();
        await button.click();
        await expectArfSuccess(page);
      });

      await test.step("Ensure creation is persisted", async () => {
        await returnFromArf(page, resource);
        await filterSpecificArticle(page, testArticle);
        await expect(page.getByText(testArticle.title)).toBeVisible();
        await expect(page.getByText(testArticle.shortDesc)).toBeVisible();
      });
    } finally {
      const articleResponse = await articlePromise;
      const articleData =
        (await articleResponse.json()) as CreateArticleResponse;
      await deleteTestArticle({ ...articleData.data, imageKey }, true);
    }
  });

  test("should read an article from the list", async ({ page }) => {
    const testArticle = await createTestArticle();
    try {
      await navigateToArticles(page);
      await expect(getEditButton(page)).toHaveCount(LIST_RESULTS_PER_PAGE);
      await filterSpecificArticle(page, testArticle);

      await expect(getEditButton(page)).toHaveCount(1);

      await expect(page.getByText(testArticle.title)).toBeVisible();
      await expect(page.getByText(testArticle.shortDesc)).toBeVisible();
    } finally {
      await deleteTestArticle(testArticle);
    }
  });

  test("should update an existing article", async ({ page }) => {
    const newTitle = `${faker.lorem.sentence()} UPDATED TEST TITLE`;
    const testArticle = await createTestArticle();

    try {
      await test.step("Change article name", async () => {
        await navigateToArticles(page);
        await filterSpecificArticle(page, testArticle);
        await getEditButton(page).click();
        await page.waitForURL(`/${resource}/edit/*`);
        const submitButton = page.getByRole("button", { name: /zapisz/i });
        // TODO: for some reason the button is sometimes initially enabled
        // when the rich text editor is rendered
        // await expect(submitButton).toBeDisabled();
        const titleInput = page.getByLabel("Tytuł");
        await expect(titleInput).toHaveValue(testArticle.title);
        await titleInput.clear();
        await titleInput.fill(newTitle);
        await expect(submitButton).toBeEnabled();
        await submitButton.click();
        await expectArfSuccess(page);
        await page.reload();
        await expect(titleInput).toHaveValue(newTitle);
      });

      const newArticle = {
        ...testArticle,
        title: newTitle,
      } satisfies ResourceDataType<ResourceType>;

      await test.step("Ensure update is persisted", async () => {
        await returnFromArf(page, resource);
        await filterSpecificArticle(page, newArticle);
        await expect(page.getByText(newArticle.title)).toBeVisible();
        await expect(page.getByText(newArticle.shortDesc)).toBeVisible();
      });
    } finally {
      await deleteTestArticle(testArticle);
    }
  });

  test("should delete an existing article", async ({ page }) => {
    const testArticle = await createTestArticle();
    try {
      await navigateToArticles(page);
      await filterSpecificArticle(page, testArticle);
      await getEditButton(page).click();

      const deleteButton = getDeleteButton(page);
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      await page.getByRole("button", { name: /^usuń$/i }).click();

      await expect(page.getByText(/pomyślnie usunięto artykuł/i)).toBeVisible();

      await filterSpecificArticle(page, testArticle);
      await expect(getEditButton(page)).toBeHidden();
      await expect(getDeleteButton(page)).toBeHidden();
    } finally {
      await deleteTestArticle(testArticle);
    }
  });
});
