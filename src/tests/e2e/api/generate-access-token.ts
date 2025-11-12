import type { LoginFormValues } from "@/features/authentication/types";
import { fetchMutation } from "@/lib/fetch-utils";
import type { LogInResponse } from "@/types/api";

import { getTestUserCredentials } from "../utils/get-test-user-credentials";

export async function generateAccessToken(): Promise<LogInResponse> {
  const body: LoginFormValues = {
    ...getTestUserCredentials(),
    rememberMe: false,
  };

  const response = await fetchMutation<LogInResponse>("auth/login", {
    body,
  });
  return response;
}
