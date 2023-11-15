import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import colors from "~/styles/colors";

const getRatingColor = (rating?: number): RatingCardCariantsProps["color"] => {
  if (!rating) return "white";

  switch (true) {
    case rating < 30:
      return "red";
    case rating < 50:
      return "orange";
    case rating < 70:
      return "yellow";
    case rating < 90:
      return "green";
    case rating <= 100:
      return "teal";
    default:
      return "white";
  }
};

const getRatingLabel = (rating?: number) => {
  if (!rating) return "Not rated";

  switch (true) {
    case rating < 20:
      return "Awful";
    case rating < 30:
      return "Very bad";
    case rating < 40:
      return "Bad";
    case rating < 50:
      return "Irrelevant";
    case rating < 60:
      return "Average";
    case rating < 70:
      return "Fair";
    case rating < 80:
      return "Alright";
    case rating < 90:
      return "Good";
    case rating < 95:
      return "Great";
    case rating <= 100:
      return "Superb";
    default:
      return "Not rated";
  }
};

const ratingCardVariants = cva(
  "flex h-full flex-col items-center justify-center rounded-3xl bg-neutral-200 p-4 text-center dark:bg-neutral-900",
  {
    variants: {
      color: {
        white: "text-black dark:text-white",
        red: "text-red-500 dark:text-red-500",
        orange: "text-orange-500 dark:text-orange-500",
        yellow: "text-yellow-500 dark:text-yellow-500",
        green: "text-green-500 dark:text-green-500",
        teal: "text-teal-500 dark:text-teal-500",
      },
    },
    defaultVariants: {
      color: "white",
    },
  },
);

type RatingCardCariantsProps = VariantProps<typeof ratingCardVariants>;

function RatingCard({ rating }: { rating?: number }) {
  const color: RatingCardCariantsProps["color"] = getRatingColor(rating);
  const label = getRatingLabel(rating);
  const style =
    rating && rating >= 95
      ? {
          textShadow: `0px 0px 16px ${colors.teal[500]}`,
        }
      : undefined;

  return (
    <div className={cn(ratingCardVariants({ color }))}>
      <div className="text-2xl font-bold" style={style}>
        {rating ?? "-"}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
}

function RatingBar({ rating }: { rating?: number }) {
  if (!rating) return;

  const ratings = [
    { maxRating: 10, className: "bg-red-500" },
    { maxRating: 20, className: "bg-red-500" },
    { maxRating: 30, className: "bg-orange-500" },
    { maxRating: 40, className: "bg-orange-500" },
    { maxRating: 50, className: "bg-yellow-500" },
    { maxRating: 60, className: "bg-yellow-500" },
    { maxRating: 70, className: "bg-green-500" },
    { maxRating: 80, className: "bg-green-500" },
    { maxRating: 90, className: "bg-teal-500" },
    { maxRating: 95, className: "bg-teal-500" },
  ];

  return (
    <div className="grid grid-cols-10 gap-0.5 rounded-lg p-1.5 text-xs dark:bg-black">
      {ratings.map((r, i) => (
        <div
          key={i}
          className={cn(
            "first:rounded-s last:rounded-e",
            rating >= r.maxRating && r.className,
          )}
        >
          &nbsp;
        </div>
      ))}
    </div>
  );
}

type Props = {
  userRating?: number;
  criticRating?: number;
};

export default function Rating({ userRating, criticRating }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="px-1 dark:text-white">Ratings</div>
      <RatingBar rating={userRating ?? criticRating} />

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col gap-1">
          <RatingCard rating={userRating} />
          <div>Users</div>
        </div>
        <div className="flex flex-col gap-1">
          <RatingCard rating={criticRating} />
          <div>Critics</div>
        </div>
      </div>
    </div>
  );
}
