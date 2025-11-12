import type { Id } from "@/features/resources/types";

export const removeTrailingSlash = (path: string): string =>
  path.replace(/\/+$/, "");

export const removeLeadingSlash = (path: string): string =>
  path.replace(/^\/+/, "");

/** This needs to be used instead of encodeURIComponent for requests made to the backend because it cannot parse '%20' as space, only the plus symbol. */
export const encodeQueryComponent = (value: string) =>
  encodeURIComponent(value).replaceAll("%20", "+");

/** Encodes the given parameter values as a string using `encodeQueryComponent`, omitting any keys with null or undefined values. */
export const encodeQueryParameters = (
  parameters: Record<string, string | null | undefined>,
): string => {
  const pairArray = Object.entries(parameters).reduce<string[]>(
    (pairs, [key, value]) => {
      if (value != null) {
        const encodedPair = `${key}=${encodeQueryComponent(value)}`;
        pairs.push(encodedPair);
      }
      return pairs;
    },
    [],
  );
  return pairArray.join("&");
};

// TODO: narrow this down to just resource IDs (e.g. using a regex)
// keep in mind this cannot be just integers because resources like
// student_organization_tags use the tag (alphanumeric string) as the primary key
export const sanitizeId = (id: Id): string =>
  encodeURIComponent(String(id).trim());

export const toTitleCase = (text: string): string =>
  text === "" ? "" : text[0].toUpperCase() + text.slice(1).toLowerCase();

export const tryParseNumber = <T>(value: T): number | T =>
  String(Number(value)) === value ? Number(value) : value;

/** Converts text from camelCase to snake_case. */
export const camelToSnakeCase = (camelCase: string): string =>
  camelCase.replaceAll(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Quotes text using Polish quote marks.
 * @example quoteText("Hello") === „Hello”
 */
export const quoteText = (text: string): string => `„${text}”`;
