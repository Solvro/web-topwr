import { describe, expect, it } from "vitest";

import { isPhoneNumber } from "./is-phone-number";

describe("isPhoneNumber utility", () => {
  it("should return true for valid phone numbers", () => {
    expect(isPhoneNumber("+48123456789")).toBe(true);
    expect(isPhoneNumber("+48 123 456 789")).toBe(true);
    expect(isPhoneNumber("123456789")).toBe(true);
    expect(isPhoneNumber("123-456-789")).toBe(true);
    expect(isPhoneNumber("+48 (71) 320-00-00")).toBe(true);
    expect(isPhoneNumber("(071) 320 00 00")).toBe(true);
    expect(isPhoneNumber("123 456")).toBe(true);
  });

  it("should return false for invalid phone numbers", () => {
    expect(isPhoneNumber("")).toBe(false);
    expect(isPhoneNumber("12345")).toBe(false);
    expect(isPhoneNumber("+48 123 456 789 000 111 222")).toBe(false);
    expect(isPhoneNumber("abc123456")).toBe(false);
    expect(isPhoneNumber("phone: 123456789")).toBe(false);
    expect(isPhoneNumber("invalid-phone")).toBe(false);
    expect(isPhoneNumber("++48123456789")).toBe(false);
  });
});
