export function decodeBase64UrlSegment(segment: string): string {
  const base64 = segment.replaceAll("-", "+").replaceAll("_", "/");
  const paddingLength = base64.length % 4;
  if (paddingLength === 1) {
    throw new Error("Invalid base64url segment");
  }
  const padded =
    paddingLength === 0 ? base64 : base64 + "=".repeat(4 - paddingLength);
  return atob(padded);
}
