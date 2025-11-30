export const getMonthLink = (newYear: number, newMonth: number) => {
  const adjustedDate = new Date(newYear, newMonth - 1);
  const urlSearchParameters = new URLSearchParams({
    year: adjustedDate.getFullYear().toString(),
    month: (adjustedDate.getMonth() + 1).toString(),
  });
  return `?${urlSearchParameters}` as const;
};
