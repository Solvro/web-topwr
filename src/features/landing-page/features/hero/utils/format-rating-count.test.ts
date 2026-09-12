import { describe, expect, it } from "vitest";

import { formatRatingCount } from "./format-rating-count";

describe("formatRatingCount", () => {
  it("formats numbers less than 1000 without separators", () => {
    expect(formatRatingCount(58)).toBe("58");
    expect(formatRatingCount(500)).toBe("500");
  });

  it("formats 4-digit numbers with non-breaking space", () => {
    expect(formatRatingCount(2500)).toBe("2\u00A0500");
  });
});
