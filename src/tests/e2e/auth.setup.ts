import { expect, test as setup } from "@playwright/test";
import path from "node:path";

import { AUTH_STORAGE_STATE_PATH } from "./constants";
import { getTestUserCredentials } from "./helpers/get-test-user-credentials";
import { login } from "./helpers/login";

const credentials = getTestUserCredentials();
const authFilePath = path.join(
  import.meta.dirname,
  "../../..",
  AUTH_STORAGE_STATE_PATH,
);

setup("authenticate", async ({ page }) => {
  await login(page, credentials);
  await expect(page).toHaveURL("/");
  await page.context().storageState({ path: authFilePath });
});
