import { expect, test } from "@playwright/test";

import { getTestUserCredentials } from "./helpers";

const TIMEOUT_MS = 7000;
const DELAY_MS = 30;

const { email, password } = getTestUserCredentials();

test.use({ storageState: undefined });

test("user can log in with valid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.locator('input[name="email"]').waitFor({ state: "visible" });
  await page.locator('input[name="password"]').waitFor({ state: "visible" });

  //THIS FAILS IN WEBKIT - why?
  //   await page.fill('input[name="email"]', email);
  //   await page.fill('input[name="password"]', password);

  //THIS WORKS
  await page.locator('input[name="email"]').click();
  await page.keyboard.type(email, { delay: DELAY_MS });

  await page.locator('input[name="password"]').click();
  await page.keyboard.type(password, { delay: DELAY_MS });

  await page.click('button[type="submit"]');

  await expect(page.getByText(new RegExp(`cześć, ${email}`, "i"))).toBeVisible({
    timeout: TIMEOUT_MS,
  });
});

test("user cannot log in with incorrect email", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();

  await page.locator('input[name="email"]').click();
  await page.keyboard.type("sss", { delay: DELAY_MS });

  await page.locator('input[name="password"]').click();
  await page.keyboard.type("toniezadziala", { delay: DELAY_MS });

  await page.click('button[type="submit"]');

  await expect(page.getByText(/niepoprawny adres email/i)).toBeVisible({
    timeout: TIMEOUT_MS,
  });
});

test("user cannot log in with invalid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();

  await page.locator('input[name="email"]').click();
  await page.keyboard.type(email, { delay: DELAY_MS });

  await page.locator('input[name="password"]').click();
  await page.keyboard.type("toniezadziala", { delay: DELAY_MS });

  await page.click('button[type="submit"]');

  const toast = page.locator(
    'li[data-sonner-toast][data-type="error"]:has-text("Wpisano niepoprawny email lub hasło")',
  );
  await toast.waitFor({ state: "visible", timeout: TIMEOUT_MS });
});

test("user can log out of the app", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();

  await page.locator('input[name="email"]').click();
  await page.keyboard.type(email, { delay: DELAY_MS });

  await page.locator('input[name="password"]').click();
  await page.keyboard.type(password, { delay: DELAY_MS });

  await page.click('button[type="submit"]');

  await expect(page.getByText(new RegExp(`cześć, ${email}`, "i"))).toBeVisible({
    timeout: TIMEOUT_MS,
  });

  const logoutButton = page.locator('button[tooltip="Wyloguj się"]');
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();

  const toast = page.locator(
    'li[data-sonner-toast]:has-text("Wylogowano pomyślnie.")',
  );
  await toast.waitFor({ state: "visible", timeout: TIMEOUT_MS });
});

test("konrad", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");
});
