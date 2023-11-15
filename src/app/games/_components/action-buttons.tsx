"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import {
  faHeart,
  faPlay,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva, type VariantProps } from "class-variance-authority";
import { type User } from "next-auth";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center bg-yellow-500 px-4 py-3 text-lg font-bold first:rounded-t-2xl last:rounded-b-2xl focus:z-10 focus:ring-2",
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
};

export default function ActionButtons({ user }: Props) {
  if (!user) return null;

  return (
    <div className="flex w-full flex-col gap-0.5 rounded-2xl" role="group">
      <Button>
        <FontAwesomeIcon className="me-4" icon={faStar} />
        Review
      </Button>
      <Button variant="secondary">
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
      </Button>
    </div>
  );
}
