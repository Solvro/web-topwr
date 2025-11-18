/** Returns a rounded date string in ISO format.
 * @param hoursAhead Number of hours to add to midnight of the base date (default is the current day).
 * @return ISO string of the rounded date.
 * @example getRoundedDate(8, new Date('2025-01-01')) // Returns 2025-01-01T08:00:00.000Z
 * @example getRoundedDate(24) // Returns tomorrow's date at 00:00:00 (midnight)
 */
export function getRoundedDate(hoursAhead = 0, baseDate?: Date | string): string {
  const date = new Date(baseDate ?? new Date());
  date.setHours(hoursAhead);
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}
