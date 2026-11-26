import { decodeBase64UrlSegment } from "./decode-base64-url-segment";

export function decodeJwtPayload(token: string): { iat?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const decoded = decodeBase64UrlSegment(parts[1]);
    return JSON.parse(decoded) as { iat?: number };
  } catch {
    return null;
  }
}
