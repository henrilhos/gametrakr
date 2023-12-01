import { format } from "date-fns";

type Props = {
  releaseDate?: Date | null;
  developers: string[];
};

export default function Metadata({ releaseDate, developers }: Props) {
  return (
    <div className="w-full gap-20 dark:text-neutral-200 md:inline-flex">
      {releaseDate && <div>{format(releaseDate, "MMMM d, yyyy")}</div>}
      <div>{developers.join(", ")}</div>
    </div>
  );
}
