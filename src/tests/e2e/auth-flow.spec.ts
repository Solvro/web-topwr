import test, { expect } from "@playwright/test";

import { login, logout } from "./helpers";

test.describe("authentication flow", () => {
  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should allow test user to log in and out", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL("/");
    await logout(page);
  });
});
