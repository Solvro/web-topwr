import type { RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { API_URL } from "@/config/constants";

import {
  MOCK_PASSWORD,
  MOCK_RESPONSE,
  MOCK_TOKEN,
  MOCK_USER,
} from "./constants";

export const handlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password?: string };
    return body.email === MOCK_USER.valid.email &&
      body.password === MOCK_PASSWORD.valid
      ? HttpResponse.json({
          user: MOCK_USER.valid,
          token: MOCK_TOKEN.valid,
        })
      : body.password == null || body.password === ""
        ? MOCK_RESPONSE.validationFailure()
        : HttpResponse.json(
            {
              error: {
                message: "Invalid user credentials",
                code: "E_INVALID_CREDENTIALS",
              },
            },
            { status: 400 },
          );
  }),
] satisfies RequestHandler[];
