export function pluralize(plural: string, singular: string) {
  return function (count: number) {
    return count === 1 ? singular : plural;
  };
}
