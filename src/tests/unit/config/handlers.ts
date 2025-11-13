import type { PathParams, RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { getVersionedApiBase } from "@/features/backend/node";
import type {
  ApiCalendarEvent,
  ErrorResponse,
  GetUserResponse,
  LogInResponse,
} from "@/features/backend/types";
import { Resource, getResourceMetadata } from "@/features/resources";
import type { ResourceFormValues } from "@/features/resources/types";
import {
  MOCK_AUTH_STATE,
  MOCK_FILES,
  MOCK_IMAGE_KEY,
  MOCK_PASSWORD,
  MOCK_USER,
} from "@/tests/shared";

import { MOCK_RESPONSE } from "../mocks/constants";
import { mockResourceResponse } from "../mocks/mock-resource-response";

const API_URL = getVersionedApiBase();
const EVENT_CALENDAR_URL = `${API_URL}/${getResourceMetadata(Resource.CalendarEvents).apiPath}`;

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

  // Mock handler for event calendar endpoint
  http.post(EVENT_CALENDAR_URL, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    // Simulate validation - require name field
    if (
      body.name == null ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return HttpResponse.json(
        {
          error: {
            message: "Validation failed",
            code: "E_VALIDATION_FAILURE",
            details: { name: "Tytuł wydarzenia jest wymagany" },
          },
        },
        { status: 400 },
      );
    }

    // Return successful response
    return HttpResponse.json(
      {
        id: 1,
        name: body.name,
        description:
          typeof body.description === "string" ? body.description : "",
        location: typeof body.location === "string" ? body.location : "",
        startTime: body.startTime,
        endTime: body.endTime,
        googleCallId:
          typeof body.googleCallId === "string" ? body.googleCallId : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  }),

  // Mock handler for getting calendar events
  http.get(EVENT_CALENDAR_URL, () => {
    return HttpResponse.json([
      {
        id: "1",
        name: "Existing Event",
        description: "This is an existing event",
        location: "Test Location",
        startTime: "2025-07-01T10:00:00.000Z",
        endTime: "2025-07-01T11:00:00.000Z",
        googleCallId: null,
      },
      {
        id: "2",
        name: "Event 1",
        description: "First event",
        location: "",
        startTime: "2025-07-01T09:00:00.000Z",
        endTime: "2025-07-01T10:00:00.000Z",
        googleCallId: null,
      },
      {
        id: "4",
        name: "Event 2",
        description: "Second event",
        location: "",
        startTime: "2025-07-01T11:00:00.000Z",
        endTime: "2025-07-01T12:00:00.000Z",
        googleCallId: null,
      },
      {
        id: "4",
        name: "Event 3",
        description: "Third event",
        location: "",
        startTime: "2025-07-01T13:00:00.000Z",
        endTime: "2025-07-01T14:00:00.000Z",
        googleCallId: null,
      },
      {
        id: "5",
        name: "Event 4",
        description: "Fourth event",
        location: "",
        startTime: "2025-07-01T15:00:00.000Z",
        endTime: "2025-07-01T16:00:00.000Z",
        googleCallId: null,
      },
    ] satisfies ApiCalendarEvent[]);
  }),

  // Mock handler for updating calendar events (PATCH)
  http.patch(`${EVENT_CALENDAR_URL}/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const { id } = params;

    // Simulate validation - require name field
    if (
      body.name == null ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return HttpResponse.json(
        {
          error: {
            message: "Validation failed",
            code: "E_VALIDATION_FAILURE",
            details: { name: "Tytuł wydarzenia jest wymagany" },
          },
        },
        { status: 400 },
      );
    }

    // Return successful update response
    return HttpResponse.json(
      {
        id: Number(id),
        name: body.name,
        description:
          typeof body.description === "string" ? body.description : "",
        location: typeof body.location === "string" ? body.location : "",
        startTime: body.startTime,
        endTime: body.endTime,
        googleCallId:
          typeof body.googleCallId === "string" ? body.googleCallId : null,
        createdAt: "2025-07-01T08:00:00.000Z",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }),

  // Mock handler for deleting calendar events (DELETE)
  http.delete(`${EVENT_CALENDAR_URL}/:id`, ({ params }) => {
    const { id } = params;

    // Return successful deletion response
    return HttpResponse.json(
      {
        message: "Event deleted successfully",
        id: Number(id),
      },
      { status: 200 },
    );
  }),
  http.post<PathParams, ResourceFormValues<Resource.GuideArticles>>(
    `${API_URL}/${getResourceMetadata(Resource.GuideArticles).apiPath}`,
    async ({ request }) => mockResourceResponse(request),
  ),
  http.post(`${API_URL}/files`, () => {
    return HttpResponse.json({
      key: MOCK_IMAGE_KEY,
    });
  }),
] satisfies RequestHandler[];
