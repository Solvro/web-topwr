import type { RequestHandler } from "msw";
import { HttpResponse, http } from "msw";

import { API_URL } from "@/config/constants";
import type {
  ErrorResponse,
  GetUserResponse,
  LogInResponse,
} from "@/types/api";

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

  // Mock handler for event calendar endpoint
  http.post(`${API_URL}/event_calendar`, async ({ request }) => {
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
  http.get(`${API_URL}/event_calendar`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: "Existing Event",
          description: "This is an existing event",
          location: "Test Location",
          startTime: "2025-07-01T10:00:00.000Z",
          endTime: "2025-07-01T11:00:00.000Z",
          googleCallId: null,
          createdAt: "2025-07-01T08:00:00.000Z",
          updatedAt: "2025-07-01T08:00:00.000Z",
        },
        {
          id: 2,
          name: "Event 1",
          description: "First event",
          location: "",
          startTime: "2025-07-01T09:00:00.000Z",
          endTime: "2025-07-01T10:00:00.000Z",
          googleCallId: null,
          createdAt: "2025-07-01T08:00:00.000Z",
          updatedAt: "2025-07-01T08:00:00.000Z",
        },
        {
          id: 3,
          name: "Event 2",
          description: "Second event",
          location: "",
          startTime: "2025-07-01T11:00:00.000Z",
          endTime: "2025-07-01T12:00:00.000Z",
          googleCallId: null,
          createdAt: "2025-07-01T08:00:00.000Z",
          updatedAt: "2025-07-01T08:00:00.000Z",
        },
        {
          id: 4,
          name: "Event 3",
          description: "Third event",
          location: "",
          startTime: "2025-07-01T13:00:00.000Z",
          endTime: "2025-07-01T14:00:00.000Z",
          googleCallId: null,
          createdAt: "2025-07-01T08:00:00.000Z",
          updatedAt: "2025-07-01T08:00:00.000Z",
        },
        {
          id: 5,
          name: "Event 4",
          description: "Fourth event",
          location: "",
          startTime: "2025-07-01T15:00:00.000Z",
          endTime: "2025-07-01T16:00:00.000Z",
          googleCallId: null,
          createdAt: "2025-07-01T08:00:00.000Z",
          updatedAt: "2025-07-01T08:00:00.000Z",
        },
      ],
    });
  }),

  // Mock handler for updating calendar events (PATCH)
  http.patch(`${API_URL}/event_calendar/:id`, async ({ request, params }) => {
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
  http.delete(`${API_URL}/event_calendar/:id`, ({ params }) => {
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
] satisfies RequestHandler[];
