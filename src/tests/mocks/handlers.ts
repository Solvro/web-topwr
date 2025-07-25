import type { PathParams, RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { API_URL } from "@/config/constants";
import { Resource } from "@/config/enums";
import { RESOURCE_METADATA } from "@/config/resources";
import type {
  ErrorResponse,
  GetUserResponse,
  LogInResponse,
} from "@/types/api";
import type { ResourceFormValues } from "@/types/app";

import { mockResourceResponse } from "../helpers/mocks";
import {
  MOCK_AUTH_STATE,
  MOCK_FILES,
  MOCK_PASSWORD,
  MOCK_RESPONSE,
  MOCK_USER,
} from "./constants";

export const handlers = [
  http.get(`${API_URL}/auth/me`, () =>
    HttpResponse.json<GetUserResponse>(MOCK_USER.valid),
  ),
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password?: string };
    return body.email === MOCK_USER.valid.email &&
      body.password === MOCK_PASSWORD.valid
      ? HttpResponse.json({
          type: "bearer",
          accessToken: MOCK_AUTH_STATE.valid.accessToken,
          refreshToken: MOCK_AUTH_STATE.valid.refreshToken,
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
  ...MOCK_FILES.map((file) =>
    http.get(`${API_URL}/files/${file.id}`, () => HttpResponse.json(file)),
  ),
  http.post<PathParams, ResourceFormValues<Resource.GuideArticles>>(
    `${API_URL}/${RESOURCE_METADATA[Resource.GuideArticles].apiPath}`,
    async ({ request }) =>
      mockResourceResponse<Resource.GuideArticles>(request),
  ),
] satisfies RequestHandler[];
