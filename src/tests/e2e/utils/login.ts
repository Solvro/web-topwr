import type { Page } from "@playwright/test";

import type { Credentials } from "../types";

export async function login(page: Page, { email, password }: Credentials) {
  await page.goto("/login");

  await page.getByRole("textbox", { name: /email/i }).fill(email);
  await page.getByRole("textbox", { name: /hasło/i }).fill(password);
  await page.getByRole("button", { name: /zaloguj się/i }).click();
}
