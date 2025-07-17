import { describe, expect, it } from "vitest";

import { enumToFormSelectOptions, sanitizeId } from "./helpers";

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

  it("should map nubmeric values with labels", () => {
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
