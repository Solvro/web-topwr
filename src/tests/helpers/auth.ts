import { http, passthrough } from "msw";

import { fetchMutation } from "@/lib/fetch-utils";
import { getVersionedApiBase } from "@/lib/helpers";
import type {
  LogInResponse,
  MessageResponse,
  SuccessResponse,
} from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { getTestUserCredentials } from "../e2e/helpers/get-test-user-credentials";
import { server } from "../mocks/server";

function bypassMockServer(endpoint: string) {
  server.use(
    http.post(`${getVersionedApiBase()}/${endpoint}`, () => passthrough()),
  );
}

export async function generateAccessToken(): Promise<LogInResponse> {
  const body: LoginFormValues = {
    ...getTestUserCredentials(),
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
