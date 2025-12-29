export function getMonthByDate(
  date: Date,
  locale = "pl",
): { value: number; name: string; daysInMonth: number } {
  const monthNumber = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthName = date.toLocaleString(locale, { month: "long" });
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  return {
    value: monthNumber,
    name: monthName,
    daysInMonth,
  };
}
