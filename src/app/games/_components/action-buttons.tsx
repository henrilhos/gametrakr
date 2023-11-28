"use client";

import { forwardRef, useState, type ButtonHTMLAttributes } from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, type VariantProps } from "class-variance-authority";
import { type User } from "next-auth";
import { type Game } from "~/app/games/_components/game";
import { ReviewModal } from "~/app/games/_components/modals/review";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center bg-yellow-500 px-4 py-3 text-lg font-bold first:rounded-t-2xl last:rounded-b-2xl focus:ring-2",
  {
    variants: {
      variant: {
        primary:
          "bg-yellow-400 text-black hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:ring-gray-500",
        secondary:
          "bg-yellow-800 text-white hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:ring-gray-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

type Props = {
  user?: User;
  game: Game;
};

export default function ActionButtons({ user, game }: Props) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <div className="flex w-full flex-col gap-0.5 rounded-2xl" role="group">
        <Button onClick={() => setIsReviewModalOpen(true)}>
          <FontAwesomeIcon className="me-4" icon={faStar} />
          Review
        </Button>
        {/* <Button variant="secondary">
        <FontAwesomeIcon className="me-4" icon={faHeart} />
        Playlist
      </Button>
      <Button variant="secondary">
        <FontAwesomeIcon className="me-4 text-yellow-600" icon={faPlay} />
        Status
      </Button>
      <Button variant="secondary">
        <FontAwesomeIcon className="me-4 text-yellow-600" icon={faPlus} />
        List
      </Button> */}
      </div>
      <ReviewModal
        game={game}
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
}
