import { describe, expect, it } from "vitest";

import { parseAuthCookie } from "@/features/authentication";
import { MOCK_AUTH_STATE, MOCK_USER } from "@/tests/mocks/constants";

const INVALID_AUTH_STATES = [
  123,
  "invalid",
  Number.NaN,
  Infinity,
  {},
  { token: MOCK_AUTH_STATE.valid.accessToken },
  { user: MOCK_USER.valid, token: MOCK_AUTH_STATE.valid.accessToken },
  { ...MOCK_AUTH_STATE.valid, token: "wrong field name" },
  { ...MOCK_AUTH_STATE.valid, accessToken: 123 },
  { ...MOCK_AUTH_STATE.valid, accessToken: "fake.jwt.123" },
  { ...MOCK_AUTH_STATE.valid, user: null },
  { ...MOCK_AUTH_STATE.valid, accessTokenExpiresAt: 0 },
  {
    ...MOCK_AUTH_STATE.valid,
    user: { ...MOCK_USER.valid, newField: "shouldn't be here" },
  },
];

describe("Cookies module", () => {
  it("should return auth state for valid cookie", () => {
    const cookie = JSON.stringify(MOCK_AUTH_STATE.valid);
    const result = parseAuthCookie(cookie);
    expect(result).toEqual(MOCK_AUTH_STATE.valid);
  });

  it("should return null for null cookie", () => {
    const result = parseAuthCookie(null);
    expect(result).toBeNull();
  });

  it("should return null for non-json input", () => {
    const result = parseAuthCookie("invalid-cookie");
    expect(result).toBeNull();
  });

  it.each(INVALID_AUTH_STATES)(
    "should return null for invalid auth state %#",
    (invalidState) => {
      const cookie = JSON.stringify(invalidState);
      const result = parseAuthCookie(cookie);
      expect(result).toBeNull();
    },
  );
});
