import { http, passthrough } from "msw";

import { API_URL } from "@/config/constants";
import { fetchMutation } from "@/lib/fetch-utils";
import type {
  LogInResponse,
  MessageResponse,
  SuccessResponse,
} from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from "../mocks/constants";
import { server } from "../mocks/server";

function bypassMockServer(endpoint: string) {
  server.use(http.post(`${API_URL}/${endpoint}`, () => passthrough()));
}

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

  bypassMockServer("auth/login");
  const response = await fetchMutation<LogInResponse>("auth/login", {
    body,
  });
  return response.accessToken;
}

export async function deleteAccessToken(accessToken: string) {
  bypassMockServer("auth/logout");
  await fetchMutation<SuccessResponse<MessageResponse>>("auth/logout", {
    accessTokenOverride: accessToken,
  });
}
