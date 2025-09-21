import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { mockDatedResource } from "@/tests/helpers/mocks";
import type { User } from "@/types/api";

import {
  encodeQueryParameters,
  getUserDisplayName,
  removeTrailingSlash,
  sanitizeId,
} from ".";

describe("sanitizeId function", () => {
  it("should sanitize IDs correctly", () => {
    expect(sanitizeId("123")).toBe("123");
    expect(sanitizeId("  456  ")).toBe("456");
    expect(sanitizeId("abc 789")).toBe("789");
    expect(sanitizeId("!@#$%^&*() 321")).toBe("321");
    expect(sanitizeId("")).toBe("");
    expect(sanitizeId("  ")).toBe("");
  });
});

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

describe("removeTrailingSlash function", () => {
  const exampleUrl = "http://example.com";

  it("should remove trailing slashes from URLs", () => {
    expect(removeTrailingSlash(`${exampleUrl}/`)).toBe(exampleUrl);
    expect(removeTrailingSlash("")).toBe("");
  });

  it("should not modify URLs without trailing slashes", () => {
    expect(removeTrailingSlash(exampleUrl)).toBe(exampleUrl);
    expect(removeTrailingSlash(`${exampleUrl}/path`)).toBe(
      `${exampleUrl}/path`,
    );
  });
});

describe("encodeQueryParameters function", () => {
  it("should encode parameters correctly", () => {
    const decoded = {
      key1: "value 1",
      key2: "value&2",
      key3: null,
      key4: undefined,
    };
    const encoded = "key1=value+1&key2=value%262";
    expect(encodeQueryParameters(decoded)).toBe(encoded);
  });
});
