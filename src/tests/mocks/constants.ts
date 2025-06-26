import { HttpResponse } from "msw";

import type { User } from "@/lib/types";

interface Mocked<T> {
  valid: T;
  invalid?: T;
}

export const MOCK_USER = {
  valid: {
    id: 1,
    email: "test@solvro.pl",
    fullName: "John Doe",
    createdAt: "1970-01-01T00:00:00.000Z",
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
} satisfies Mocked<User>;

export const MOCK_PASSWORD = {
  valid: "validPassword123",
  invalid: "anyOtherPassword",
} satisfies Mocked<string>;

export const MOCK_TOKEN = {
  valid: "exp.validJwtToken.1234567890",
} satisfies Mocked<string>;

export const MOCK_RESPONSE = {
  validationFailure: () =>
    HttpResponse.json(
      {
        error: { message: "Validation failure", code: "E_VALIDATION_ERROR" },
      },
      { status: 422 },
    ),
  unexpectedError: () =>
    HttpResponse.json(
      {
        error: { message: "Unexpected error", code: " E_UNEXPECTED_ERROR" },
      },
      { status: 400 },
    ),
};
