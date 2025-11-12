import "../helpers/env";

import test, { expect } from "@playwright/test";

import { getTestUserCredentials } from "./helpers/get-test-user-credentials";
import { login } from "./helpers/login";

test.use({ storageState: { cookies: [], origins: [] } });
const credentials = getTestUserCredentials();

test.describe("Authentication", () => {
  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should redirect to home page when already authenticated", async ({
    page,
  }) => {
    await login(page, credentials);
    await expect(page).toHaveURL("/");
    await page.goto("/login");
    await expect(page).toHaveURL("/");
  });

  test("should allow test user to log in", async ({ page }) => {
    await login(page, credentials);
    await expect(page).not.toHaveURL("/login");
    await expect(page).toHaveURL("/");
    const greeting = page.getByText(
      new RegExp(`cześć, ${credentials.email}`, "i"),
    );
    await greeting.waitFor({ state: "visible" });
  });

  test("should allow test user to log out", async ({ page }) => {
    await login(page, credentials);
    await page.getByRole("button", { name: /wyloguj się/i }).click();
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
