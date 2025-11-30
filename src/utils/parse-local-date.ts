export function parseLocalDate(dateString: string): Date {
  if (dateString.includes("T")) {
    if (
      dateString.includes("+") ||
      dateString.includes("Z") ||
      /T\d{2}:\d{2}:\d{2}/.test(dateString)
    ) {
      const utcDate = new Date(dateString);
      return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds(),
      );
    } else {
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-").map(Number);
      return new Date(year, month - 1, day, 12, 0, 0, 0);
    }
  } else {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
}
