import { describe, expect, it } from "vitest";

import { Weekday } from "@/config/enums";

import { formatDaySwapDescription } from "./format-day-swap-description";

describe("formatDaySwapDescription", () => {
  it("should format Monday with even day correctly", () => {
    const result = formatDaySwapDescription(Weekday.Monday, true);
    expect(result).toBe("Parzysty poniedziałek");
  });

  it("should format Wednesday (feminine) with odd day correctly", () => {
    const result = formatDaySwapDescription(Weekday.Wednesday, false);
    expect(result).toBe("Nieparzysta środa");
  });
});
