import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { MOCK_USER } from "@/tests/shared";

import type { User } from "../types/internal";
import { getUserDisplayName } from "./get-user-display-name";

describe("getUserDisplayName function", () => {
  const user: User = {
    ...MOCK_USER.valid,
    fullName: faker.person.fullName(),
    email: "john.doe@example.com",
  };

  it("should return full name if available", () => {
    expect(getUserDisplayName(user)).toBe(user.fullName);
  });

  it("should return email if full name is not available", () => {
    const userWithoutFullName = { ...user, fullName: null };
    expect(getUserDisplayName(userWithoutFullName)).toBe(user.email);
  });
});
