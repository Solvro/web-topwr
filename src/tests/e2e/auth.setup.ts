import { expect, test as setup } from "@playwright/test";
import path from "node:path";

import { Resource } from "@/features/resources";

import { AUTH_STORAGE_STATE_PATH } from "./constants";
import { getTestUserCredentials } from "./utils/get-test-user-credentials";
import { login } from "./utils/login";

const credentials = getTestUserCredentials();
const authFilePath = path.join(
  import.meta.dirname,
  "../../..",
  AUTH_STORAGE_STATE_PATH,
);

setup("authenticate", async ({ page }) => {
  await login(page, credentials);
  await expect(page).toHaveURL(`/${Resource.Dashboard}`);
  await page.context().storageState({ path: authFilePath });
});
