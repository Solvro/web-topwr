import { fetchMutation } from "@/lib/fetch-utils";
import type {
  LogInResponse,
  MessageResponse,
  SuccessResponse,
} from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../mocks/constants";

export async function generateAccessToken(): Promise<string> {
  if (TEST_USER_EMAIL == null || TEST_USER_PASSWORD == null) {
    throw new Error(
      "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in the environment variables to run these tests.",
    );
  }
  const body: LoginFormValues = {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
    rememberMe: false,
  };
  const response = await fetchMutation<LogInResponse>("auth/login", {
    body,
  });
  return response.accessToken;
}

export async function deleteAccessToken(accessToken: string) {
  await fetchMutation<SuccessResponse<MessageResponse>>("auth/logout", {
    accessTokenOverride: accessToken,
  });
}
