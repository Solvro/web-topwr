import { describe, expect, it } from "vitest";

import { parseAuthCookie } from "./cookies";

const MOCK_AUTH_STATE = {
  user: { id: "123", name: "Test User" },
  token: "test-token",
};

describe("Cookies module", () => {
  it("should parse auth cookie correctly", () => {
    const cookie = JSON.stringify(MOCK_AUTH_STATE);
    const result = parseAuthCookie(cookie);
    expect(result).toEqual(MOCK_AUTH_STATE);
  });

  it("should return null for null cookie", () => {
    const result = parseAuthCookie(null);
    expect(result).toBeNull();
  });

  it("should return null for invalid cookie", () => {
    const result = parseAuthCookie("invalid-cookie");
    expect(result).toBeNull();
  });
});
