export function createLocalDateKey(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new RangeError("Invalid date");
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}
