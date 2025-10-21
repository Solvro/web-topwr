import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { mockDatedResource } from "@/tests/helpers/mocks";
import type { User } from "@/types/api";

import {
  camelToSnakeCase,
  encodeQueryParameters,
  getUserDisplayName,
  removeTrailingSlash,
  sanitizeId,
  toTitleCase,
} from ".";

describe("sanitizeId function", () => {
  it("should sanitize IDs correctly", () => {
    expect(sanitizeId("123")).toBe("123");
    expect(sanitizeId("  456  ")).toBe("456");
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

describe("toTitleCase function", () => {
  it("should convert text to title case", () => {
    expect(toTitleCase("hello world")).toBe("Hello world");
    expect(toTitleCase("JAVA SCRIPT")).toBe("Java script");
    expect(toTitleCase("tYpEsCrIpT")).toBe("Typescript");
  });
});

describe("camelToSnakeCase function", () => {
  it("should convert camelCase to snake_case", () => {
    expect(camelToSnakeCase("camelCaseString")).toBe("camel_case_string");
    expect(camelToSnakeCase("anotherExampleHere")).toBe("another_example_here");
    expect(camelToSnakeCase("simpleTest")).toBe("simple_test");
  });

  it("should return the same string if there are no uppercase letters", () => {
    expect(camelToSnakeCase("nouppercase")).toBe("nouppercase");
    expect(camelToSnakeCase("already_snake_case")).toBe("already_snake_case");
  });
});
