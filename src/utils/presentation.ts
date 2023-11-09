export const pluralize =
  (plural: string, singular: string) => (count: number) =>
    count === 1 ? singular : plural;
