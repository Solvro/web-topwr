export function extractTime(dateString: string): string {
  if (dateString.includes("T")) {
    const timePart = dateString.split("T")[1];
    return timePart.split(".")[0];
  }
  return "00:00:00";
}
