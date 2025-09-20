import { faker } from "@faker-js/faker";
import { HttpResponse } from "msw";

import type { AuthState, FileEntry, User } from "@/types/api";

import "../helpers/dotenv";
import { generateFileEntry, mockDatedResource } from "../helpers/mocks";

interface Mocked<T> {
  valid: T;
  invalid?: T;
}

export const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
export const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

export const MOCK_PASSWORD = {
  valid: "validPassword123",
  invalid: "anyOtherPassword",
} satisfies Mocked<string>;

export const MOCK_USER = {
  valid: {
    id: faker.number.int(),
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    ...mockDatedResource(),
  },
} satisfies Mocked<User>;

export const MOCK_AUTH_STATE = {
  valid: {
    user: MOCK_USER.valid,
    accessToken: faker.internet.jwt(),
    refreshToken: faker.internet.jwt(),
    accessTokenExpiresAt: faker.number.int(),
    refreshTokenExpiresAt: faker.number.int(),
  },
} satisfies Mocked<AuthState>;

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
        error: { message: "Unexpected error", code: "E_UNEXPECTED_ERROR" },
      },
      { status: 400 },
    ),
};

const MOCK_FILE_COUNT = 3;

export const MOCK_FILES = Array.from({ length: MOCK_FILE_COUNT }, () =>
  generateFileEntry(),
) satisfies FileEntry[];

export const MOCK_IMAGE_FILE = new File(["test"], "test.png", {
  type: "image/png",
});
