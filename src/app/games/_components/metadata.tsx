type Props = {
  releaseDate?: Date;
  developers: string[];
};

export default function Metadata({ releaseDate, developers }: Props) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(releaseDate);

  return (
    <div className="w-full gap-20 dark:text-neutral-200 md:inline-flex">
      <div>{formattedDate}</div>
      <div>{developers.join(", ")}</div>
    </div>
  );
}
