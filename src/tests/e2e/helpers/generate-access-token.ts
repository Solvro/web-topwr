import { fetchMutation } from "@/lib/fetch-utils";
import type { LogInResponse } from "@/types/api";
import type { LoginFormValues } from "@/types/forms";

import { getTestUserCredentials } from "./get-test-user-credentials";

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
