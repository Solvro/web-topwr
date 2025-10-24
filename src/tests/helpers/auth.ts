import { http, passthrough } from "msw";

import { env } from "@/config/env";
import { fetchMutation } from "@/lib/fetch-utils";
import type {
  LogInResponse,
  MessageResponse,
  SuccessResponse,
} from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { server } from "../mocks/server";

function bypassMockServer(endpoint: string) {
  server.use(
    http.post(`${env.NEXT_PUBLIC_API_FILES_URL}/${endpoint}`, () =>
      passthrough(),
    ),
  );
}

export async function generateAccessToken(): Promise<LogInResponse> {
  if (env.TEST_USER_EMAIL == null || env.TEST_USER_PASSWORD == null) {
    throw new Error(
      "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in the environment variables to run these tests.",
    );
  }
  const body: LoginFormValues = {
    email: env.TEST_USER_EMAIL,
    password: env.TEST_USER_PASSWORD,
    rememberMe: false,
  };

  bypassMockServer("auth/login");
  const response = await fetchMutation<LogInResponse>("auth/login", {
    body,
  });
  return response;
}

export async function deleteAccessToken(
  accessToken: string,
  refreshToken: string,
) {
  bypassMockServer("auth/logout");
  await fetchMutation<SuccessResponse<MessageResponse>>("auth/logout", {
    accessTokenOverride: accessToken,
    body: { refreshToken },
  });
}
