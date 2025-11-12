import { strict as assert } from "node:assert";

import { env } from "@/config/env";

import type { Credentials } from "../types";

export function getTestUserCredentials(): Credentials {
  const email = env.TEST_USER_EMAIL;
  const password = env.TEST_USER_PASSWORD;
  assert.ok(email != null, "TEST_USER_EMAIL must be set in env variables");
  assert.ok(
    password != null,
    "TEST_USER_PASSWORD must be set in env variables",
  );
  return { email, password };
}
