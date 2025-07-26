import { chromium } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const EMAIL = process.env.CORRECT_EMAIL ?? "";
const PASSWORD = process.env.CORRECT_PASSWORD ?? "";

if (EMAIL === "" || PASSWORD === "") {
  throw new Error("Couldn't load test data from env.");
}
//playwright needs a default export
/* eslint-disable import/no-default-export */
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/");

  await page.locator('input[name="email"]').click();
  await page.keyboard.type(EMAIL, { delay: 30 });

  await page.locator('input[name="password"]').click();
  await page.keyboard.type(PASSWORD, { delay: 30 });

  await page.click('button[type="submit"]');

  const greeting = page.getByText(new RegExp(`cześć, ${EMAIL}`, "i"));
  await greeting.waitFor({ state: "visible", timeout: 5000 });

  await page.context().storageState({ path: "e2e/.auth/state.json" });
  await browser.close();
}
