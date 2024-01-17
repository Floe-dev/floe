/**
  Returns a Date object representing the first day of the current month and year.

  For example, if today is November 21, 2021, this function will return a Date object
  with the value of November 1, 2021 at 00:00:00.000 UTC.
*/
export function getMonthYearTimestamp(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
}
