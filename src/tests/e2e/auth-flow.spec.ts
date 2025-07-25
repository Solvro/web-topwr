import test, { expect } from "@playwright/test";

import { login } from "./helpers";

test.describe("Authentication flow", () => {
  test("should redirect to login page when not authenticated", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should allow test user to log in", async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL("/");
  });
});
