import { expect, test } from "@playwright/test";

const TIMEOUT_MS = 9000;
const IMG_PATH = "./src/tests/e2e/assets/test-image.jpg";

test.describe.serial(() => {
  const timestamp = Date.now().toString();
  const testName = `test ${timestamp}`;

  test("should add a correct article", async ({ page }) => {
    await test.step("should go to article management", async () => {
      await page.goto("http://localhost:3000/");
      await expect(page.getByText("Zarządzanie artykułami")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
      await page.getByText("Zarządzanie artykułami").click();
      await expect(page.getByText("Dodaj artykuł")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
      await page.getByText("Dodaj artykuł").click();
      await expect(page.getByText("Dodawanie artykułu")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
    });

    await test.step("should input data for a new article", async () => {
      const tiptapEditor = page.locator("p.text-node");
      await expect(tiptapEditor).toBeVisible();

      await page.locator('input[name="title"]').fill(testName);
      await page.locator('input[name="shortDesc"]').fill("krotki opis testowy");
      await tiptapEditor.fill("dlugi opis testowy");

      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles(IMG_PATH);
      const uploadedImage = page.locator('img[alt="Zdjęcie"]');
      await expect(uploadedImage).toBeVisible({ timeout: TIMEOUT_MS });
    });

    await test.step("should save a new article", async () => {
      await page.getByRole("button", { name: "Zapisz" }).click();
      const toast = page.locator(
        'li[data-sonner-toast]:has-text("Pomyślnie zapisano!")',
      );
      await expect(toast).toBeVisible({ timeout: TIMEOUT_MS });
    });

    await test.step("should go back to article management", async () => {
      await page.click(
        'a[href="/guide_articles"]:has-text("Wróć do artykułów")',
      );
      await expect(page.locator("text=Zarządzanie artykułami")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
    });

    await test.step("should search for the newly created article", async () => {
      const combobox = page
        .locator('label[data-slot="form-label"]', { hasText: "Szukaj w" })
        .locator("xpath=..")
        .locator('button[role="combobox"]');
      await combobox.click();

      await page.click('div[role="listbox"] >> text=tytule');
      await page.fill('input[placeholder="wpisz szukaną frazę"]', timestamp);
      await page.click('button:has-text("Zatwierdź")');

      const article = page
        .locator("div.bg-background-secondary")
        .filter({ hasText: testName })
        .first();
      await expect(article).toBeVisible({ timeout: TIMEOUT_MS });
    });
  });

  test("should edit the article", async ({ page }) => {
    await test.step("should go to article management", async () => {
      await page.goto("http://localhost:3000/");
      await expect(page.getByText("Zarządzanie artykułami")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
      await page.getByText("Zarządzanie artykułami").click();
      await expect(page.getByText("Dodaj artykuł")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
    });

    await test.step("should search for the earlier created article", async () => {
      const combobox = page
        .locator('label[data-slot="form-label"]', { hasText: "Szukaj w" })
        .locator("xpath=..")
        .locator('button[role="combobox"]');
      await combobox.click();

      await page.click('div[role="listbox"] >> text=tytule');
      await page.fill('input[placeholder="wpisz szukaną frazę"]', timestamp);
      await page.click('button:has-text("Zatwierdź")');

      const article = page
        .locator("div.bg-background-secondary")
        .filter({ hasText: timestamp })
        .first();
      await expect(article).toBeVisible({ timeout: TIMEOUT_MS });
    });

    await test.step("should have the previously created values", async () => {
      await page.locator('a[href^="/guide_articles/edit/"]').first().click();
      const titleInput = page.locator('input[name="title"]');
      await expect(titleInput).toHaveValue(testName);

      const shortDescInput = page.locator('input[name="shortDesc"]');
      await expect(shortDescInput).toHaveValue("krotki opis testowy");

      const tiptapEditor = page.locator("p.text-node");
      await expect(tiptapEditor).toContainText("dlugi opis testowy");

      const uploadedImage = page.locator('img[alt="Zdjęcie"]');
      await expect(uploadedImage).toBeVisible();
    });

    await test.step("should edit short description", async () => {
      const shortDescInput = page.locator('input[name="shortDesc"]');
      await shortDescInput.fill("krotki opis edytowany");
    });

    await test.step("should save the article and return to article management", async () => {
      await page.getByRole("button", { name: "Zapisz" }).click();
      const toast = page.locator(
        'li[data-sonner-toast]:has-text("Pomyślnie zapisano!")',
      );
      await expect(toast).toBeVisible({ timeout: TIMEOUT_MS });

      await page.click(
        'a[href="/guide_articles"]:has-text("Wróć do artykułów")',
      );
      await expect(page.locator("text=Zarządzanie artykułami")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
    });

    await test.step("should search for the edited article and verify its content", async () => {
      const combobox = page
        .locator('label[data-slot="form-label"]', { hasText: "Szukaj w" })
        .locator("xpath=..")
        .locator('button[role="combobox"]');
      await combobox.click();

      await page.click('div[role="listbox"] >> text=tytule');
      await page.fill('input[placeholder="wpisz szukaną frazę"]', timestamp);
      await page.click('button:has-text("Zatwierdź")');

      const article = page
        .locator("div.bg-background-secondary")
        .filter({ hasText: testName })
        .filter({ hasText: "krotki opis edytowany" })
        .first();
      await expect(article).toBeVisible({ timeout: TIMEOUT_MS });
    });
  });

  test("should remove the article", async ({ page }) => {
    await test.step("should go to article management", async () => {
      await page.goto("http://localhost:3000/");
      await expect(page.getByText("Zarządzanie artykułami")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
      await page.getByText("Zarządzanie artykułami").click();
      await expect(page.getByText("Dodaj artykuł")).toBeVisible({
        timeout: TIMEOUT_MS,
      });
    });

    await test.step("should search for the earlier created article", async () => {
      const combobox = page
        .locator('label[data-slot="form-label"]', { hasText: "Szukaj w" })
        .locator("xpath=..")
        .locator('button[role="combobox"]');
      await combobox.click();

      await page.click('div[role="listbox"] >> text=tytule');
      await page.fill('input[placeholder="wpisz szukaną frazę"]', timestamp);
      await page.click('button:has-text("Zatwierdź")');

      const article = page
        .locator("div.bg-background-secondary")
        .filter({ hasText: timestamp })
        .first();
      await expect(article).toBeVisible({ timeout: TIMEOUT_MS });
    });

    await test.step("should remove the earlier created article", async () => {
      await page.click(
        'button[aria-haspopup="dialog"][aria-expanded="false"][data-slot="dialog-trigger"]',
      );
      await expect(
        page.getByText(/czy na pewno chcesz usunąć artykuł/i),
      ).toBeVisible({
        timeout: TIMEOUT_MS,
      });
      await page.click('button[data-slot="button"]:has-text("Usuń")');
      const toast = page.locator(
        'li[data-sonner-toast]:has-text("Pomyślnie usunięto artykuł")',
      );
      await expect(toast).toBeVisible();

      const article = page
        .locator("div.bg-background-secondary")
        .filter({ hasText: timestamp })
        .first();
      await expect(article).not.toBeVisible({ timeout: TIMEOUT_MS });
    });
  });
});
