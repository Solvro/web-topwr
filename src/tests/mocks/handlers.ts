import type { RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { API_URL } from "@/config/constants";
import type { ErrorResponse, LogInResponse } from "@/types/api";

import {
  MOCK_PASSWORD,
  MOCK_RESPONSE,
  MOCK_TOKEN,
  MOCK_USER,
} from "./constants";

export const handlers = [
  http.get(`${API_URL}/auth/me`, () =>
    HttpResponse.json({ user: MOCK_USER.valid }),
  ),
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password?: string };
    return body.email === MOCK_USER.valid.email &&
      body.password === MOCK_PASSWORD.valid
      ? HttpResponse.json({
          type: "bearer",
          accessToken: MOCK_TOKEN.access.valid,
          refreshToken: MOCK_TOKEN.refresh.valid,
          accessExpiresInMs: 3_600_000,
          refreshExpiresInMs: 604_800_000,
        } satisfies LogInResponse)
      : body.password == null || body.password === ""
        ? MOCK_RESPONSE.validationFailure()
        : HttpResponse.json(
            {
              error: {
                message: "Invalid user credentials",
                code: "E_INVALID_CREDENTIALS",
              },
            } satisfies ErrorResponse,
            { status: 400 },
          );
  }),
] satisfies RequestHandler[];
