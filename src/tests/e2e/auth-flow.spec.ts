import test, { expect } from "@playwright/test";

import { getTestUserCredentials, login, logout } from "./helpers";

test.describe("Authentication flow", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should allow test user to log in and out", async ({ page }) => {
    const credentials = getTestUserCredentials();
    await login(page, credentials);
    await expect(page).toHaveURL("/");
    const greeting = page.getByText(
      new RegExp(`cześć, ${credentials.email}`, "i"),
    );
    await greeting.waitFor({ state: "visible" });
    await logout(page);
  });
});
