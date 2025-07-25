import { faker } from "@faker-js/faker";
import { HttpResponse } from "msw";

import {
  OrganizationSource,
  OrganizationStatus,
  OrganizationType,
} from "@/config/enums";
import type { Resource } from "@/config/enums";
import type { User } from "@/types/api";
import type { ResourceFormValues } from "@/types/app";

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

export const MOCK_IMAGE_FILE = new File(["test"], "test.png", {
  type: "image/png",
});

export const MOCK_IMAGE_KEY = faker.string.uuid();

export const MOCK_GUIDE_ARTICLE = {
  title: faker.lorem.sentence(5),
  shortDesc: faker.lorem.sentence(10),
  description: faker.lorem.paragraph(3),
  imageKey: MOCK_IMAGE_KEY,
} satisfies ResourceFormValues<Resource.GuideArticles>;

export const MOCK_STUDENT_ORGANIZATION = {
  name: faker.company.name(),
  description: faker.lorem.paragraph(3),
  coverPreview: false,
  source: OrganizationSource.Manual,
  organizationType: OrganizationType.ScientificClub,
  organizationStatus: OrganizationStatus.Active,
  isStrategic: false as boolean, // so that TS doesn't complain that the type is always `false`
} satisfies ResourceFormValues<Resource.StudentOrganizations>;
