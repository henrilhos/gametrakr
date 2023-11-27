export function unixTimestampToYear(unixTimestamp?: number | null) {
  if (!unixTimestamp) return;

  const date = new Date(unixTimestamp * 1000);
  return date.getFullYear();
}
