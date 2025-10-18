import type { Id } from "@/types/app";

export const sanitizeId = (id: Id): string =>
  String(id).trim().replaceAll(/[^\d]/g, "");

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
