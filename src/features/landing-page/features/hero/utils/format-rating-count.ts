/**
 * Formats a rating count with non-breaking spaces as thousands separators.
 * @param count - Total number of ratings.
 * @returns Formatted count string (e.g. 2500 -> "2\u00A0500").
 */
export function formatRatingCount(count: number): string {
  return count.toString().replace(/(\d+)(\d{3})/, "$1\u00A0$2");
}
