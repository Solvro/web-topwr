import { describe, expect, it } from "vitest";

import {
  camelToSnakeCase,
  encodeQueryParameters,
  removeTrailingSlash,
  sanitizeId,
  toTitleCase,
  tryParseNumber,
} from "./transformations";

describe("sanitizeId function", () => {
  it("should sanitize IDs correctly", () => {
    expect(sanitizeId("123")).toBe("123");
    expect(sanitizeId("  456  ")).toBe("456");
    expect(sanitizeId("")).toBe("");
    expect(sanitizeId("  ")).toBe("");
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

describe("tryParseNumber function", () => {
  it("should parse numeric strings to numbers", () => {
    expect(tryParseNumber("123")).toBe(123);
    expect(tryParseNumber("45.67")).toBe(45.67);
  });

  it("should return non-numeric values as is", () => {
    expect(tryParseNumber("abc")).toBe("abc");
    expect(tryParseNumber("123abc")).toBe("123abc");
    expect(tryParseNumber(null)).toBe(null);
    expect(tryParseNumber("")).toBe("");
    expect(tryParseNumber(Number.NaN)).toBe(Number.NaN);
  });
});
