import test, { expect } from "@playwright/test";

import { ADMIN_PATH } from "@/config/constants";

import { getTestUserCredentials } from "../utils/get-test-user-credentials";
import { login } from "../utils/login";

test.use({ storageState: { cookies: [], origins: [] } });
const credentials = getTestUserCredentials();

test.describe("Authentication", () => {
  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    await page.goto(ADMIN_PATH);
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to admin page when already authenticated", async ({
    page,
  }) => {
    await login(page, credentials);
    await expect(page).toHaveURL(ADMIN_PATH);
    await page.goto("/login");
    await expect(page).toHaveURL(ADMIN_PATH);
  });

  test("should allow test user to log in", async ({ page }) => {
    await login(page, credentials);
    await expect(page).not.toHaveURL("/login");
    await expect(page).toHaveURL(ADMIN_PATH);
    const greeting = page.getByText(
      new RegExp(`cześć, ${credentials.email}`, "i"),
    );
    await greeting.waitFor({ state: "visible" });
  });

  test("should allow test user to log out", async ({ page }) => {
    await login(page, credentials);
    await expect(page).toHaveURL(ADMIN_PATH);
    await page.getByRole("button", { name: /menu użytkownika/i }).click();
    await page.getByRole("menuitem", { name: /wyloguj się/i }).click();
    await expect(page).toHaveURL("/login");
  });

  test("should not allow login with malformed email", async ({ page }) => {
    await login(page, { ...credentials, email: "invalid-email" });
    await expect(page.getByText(/niepoprawny adres email/i)).toBeVisible();
  });

  test("should not allow login with incorrect password", async ({ page }) => {
    await login(page, { ...credentials, password: "bad-password" });
    await expect(page.getByText(/niepoprawny email lub hasło/i)).toBeVisible();
  });
});
