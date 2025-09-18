import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { mockDatedResource } from "@/tests/helpers/mocks";
import type { User } from "@/types/api";

import {
  enumToFormSelectOptions,
  getUserDisplayName,
  removeTrailingSlash,
  sanitizeId,
} from "./helpers";

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

describe("enumToFormSelectOptions function", () => {
  it("should map string values with labels", () => {
    enum Status {
      Active = "active",
      Inactive = "inactive",
      Pending = "pending",
    }
    const labels = {
      [Status.Active]: "Aktywna",
      [Status.Inactive]: "Nieaktywna",
      [Status.Pending]: "W trakcie",
    };

    const result = enumToFormSelectOptions(Status, labels);

    expect(result).toEqual([
      { value: "active", label: "Aktywna" },
      { value: "inactive", label: "Nieaktywna" },
      { value: "pending", label: "W trakcie" },
    ]);
  });

  it("should map numeric values with labels", () => {
    enum Status {
      Active = 1,
      Inactive = 2,
      Pending = 3,
    }
    const labels = {
      [Status.Active]: "Aktywna",
      [Status.Inactive]: "Nieaktywna",
      [Status.Pending]: "W trakcie",
    };

    const result = enumToFormSelectOptions(Status, labels);

    expect(result).toEqual([
      { value: 1, label: "Aktywna" },
      { value: 2, label: "Nieaktywna" },
      { value: 3, label: "W trakcie" },
    ]);
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
