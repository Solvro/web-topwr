import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REFRESH_THRESHOLD_PERCENT } from "../constants";
import type { AuthState } from "../types/internal";
import { getTokenStatus } from "./get-token-status";

function encodeJwtPayload(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(json);
  return base64.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function makeToken(payload: Record<string, unknown>): string {
  return `header.${encodeJwtPayload(payload)}.signature`;
}

const NOW = 1_000_000_000_000;

function makeAuthState(
  options: Partial<AuthState> & {
    accessTokenIat?: number | null;
  } = {},
): AuthState {
  const {
    accessTokenIat,
    accessToken,
    accessTokenExpiresAt = NOW + 10_000,
    refreshTokenExpiresAt = NOW + 100_000,
    ...rest
  } = options;

  const iat =
    accessTokenIat === undefined
      ? Math.floor((NOW - 50_000) / 1000) // issued 50 s ago by default
      : accessTokenIat;

  const token =
    accessToken ?? (iat === null ? makeToken({}) : makeToken({ iat }));

  return {
    user: null as unknown as AuthState["user"],
    refreshToken: "refresh.token.sig",
    accessToken: token,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    ...rest,
  };
}

describe("getTokenStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('"both-expired"', () => {
    it("returns both-expired when refresh token is expired", () => {
      const state = makeAuthState({ refreshTokenExpiresAt: NOW - 1 });
      expect(getTokenStatus(state)).toBe("both-expired");
    });

    it("returns both-expired when refresh token expires exactly now", () => {
      const state = makeAuthState({ refreshTokenExpiresAt: NOW });
      expect(getTokenStatus(state)).toBe("both-expired");
    });

    it("returns both-expired even when access token is still valid", () => {
      const state = makeAuthState({
        accessTokenExpiresAt: NOW + 10_000,
        refreshTokenExpiresAt: NOW - 1,
      });
      expect(getTokenStatus(state)).toBe("both-expired");
    });
  });

  describe('"expired"', () => {
    it("returns expired when access token is expired but refresh is still valid", () => {
      const state = makeAuthState({
        accessTokenExpiresAt: NOW - 1,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("expired");
    });

    it("returns expired when access token expires exactly now", () => {
      const state = makeAuthState({
        accessTokenExpiresAt: NOW,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("expired");
    });
  });

  describe('"expiring-soon"', () => {
    it("returns expiring-soon when remaining lifetime is just below the threshold", () => {
      // total lifetime = 100 s, threshold = 20 % → trigger at 20 s remaining
      const issuedAt = NOW - 80_000; // 80 s ago
      const expiresAt = NOW + 19_999; // 19.999 s left → < 20 %
      const state = makeAuthState({
        accessTokenIat: Math.floor(issuedAt / 1000),
        accessTokenExpiresAt: expiresAt,
        refreshTokenExpiresAt: NOW + 1_000_000,
      });
      expect(getTokenStatus(state)).toBe("expiring-soon");
    });

    it("returns expiring-soon exactly at the threshold boundary (< not <=)", () => {
      const totalMs = 100_000;
      const thresholdMs = (REFRESH_THRESHOLD_PERCENT / 100) * totalMs; // 20 000 ms
      const issuedAt = NOW - (totalMs - thresholdMs + 1); // remaining = thresholdMs - 1
      const expiresAt = NOW + thresholdMs - 1;
      const state = makeAuthState({
        accessTokenIat: Math.floor(issuedAt / 1000),
        accessTokenExpiresAt: expiresAt,
        refreshTokenExpiresAt: NOW + 1_000_000,
      });
      expect(getTokenStatus(state)).toBe("expiring-soon");
    });

    it("returns ok (not expiring-soon) when remaining lifetime equals the threshold exactly", () => {
      const totalMs = 100_000;
      const thresholdMs = (REFRESH_THRESHOLD_PERCENT / 100) * totalMs; // 20 000 ms
      const issuedAt = NOW - (totalMs - thresholdMs);
      const expiresAt = NOW + thresholdMs;
      const state = makeAuthState({
        accessTokenIat: Math.floor(issuedAt / 1000),
        accessTokenExpiresAt: expiresAt,
        refreshTokenExpiresAt: NOW + 1_000_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });
  });

  describe('"ok"', () => {
    it("returns ok when access token has plenty of lifetime left", () => {
      const state = makeAuthState({
        accessTokenIat: Math.floor((NOW - 1000) / 1000),
        accessTokenExpiresAt: NOW + 99_000,
        refreshTokenExpiresAt: NOW + 1_000_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });
  });

  describe("missing / invalid iat", () => {
    it("returns ok when iat is absent from the payload", () => {
      const token = makeToken({}); // no iat field
      const state = makeAuthState({
        accessToken: token,
        accessTokenExpiresAt: NOW + 10_000,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });

    it("returns ok when the token is not a valid JWT (no payload segment)", () => {
      const state = makeAuthState({
        accessToken: "not-a-jwt",
        accessTokenExpiresAt: NOW + 10_000,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });

    it("returns ok when the payload is not valid JSON", () => {
      const state = makeAuthState({
        accessToken: "header.!!!invalid_base64!!$.signature",
        accessTokenExpiresAt: NOW + 10_000,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });

    it("returns ok when totalLifetimeMs is zero (iat === expiresAt)", () => {
      const expiresAt = NOW + 10_000;
      const state = makeAuthState({
        accessTokenIat: Math.floor(expiresAt / 1000), // iat == expiry → totalLifetimeMs = 0
        accessTokenExpiresAt: expiresAt,
        refreshTokenExpiresAt: NOW + 100_000,
      });
      expect(getTokenStatus(state)).toBe("ok");
    });
  });
});
