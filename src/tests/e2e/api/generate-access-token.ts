import type { LoginFormValues } from "@/features/authentication/types";
import { fetchMutation } from "@/features/backend";
import type { LogInResponse } from "@/features/backend/types";

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
