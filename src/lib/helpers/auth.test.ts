import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { mockDatedResource } from "@/tests/helpers/mocks";
import type { User } from "@/types/api";

import { getUserDisplayName } from "./auth";

describe("getUserDisplayName function", () => {
  const user: User = {
    id: 0,
    ...mockDatedResource(),
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
