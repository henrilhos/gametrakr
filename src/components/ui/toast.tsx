import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva } from "class-variance-authority";
import { toast as baseToast } from "react-hot-toast";

import { cn } from "~/utils/cn";

import type { VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";

const toastVariants = cva(
  "pointer-events-none max-w-md select-none rounded-2xl text-center",
  {
    variants: {
      variant: {
        neutral: "bg-oldneutral text-oldneutral-foreground",
        success: "bg-success text-success-foreground",
        error: "bg-error text-error-foreground",
        info: "bg-info text-info-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type ToastProps = PropsWithChildren<
  {
    visible?: boolean;
  } & VariantProps<typeof toastVariants>
>;
export const Toast = ({ children, variant, visible }: ToastProps) => {
  const icons = {
    neutral: faTriangleExclamation,
    success: faCircleCheck,
    error: faCircleExclamation,
    info: faCircleInfo,
  };

  return (
    <div
      className={cn(
        toastVariants({ variant }),
        visible && "animate-enter",
        !visible && "animate-leave",
      )}
    >
      <div className="flex items-center px-6 py-3 text-lg leading-5">
        <div>
          <FontAwesomeIcon
            icon={icons[variant ?? "neutral"]}
            className="mr-4"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

const createToastHandler =
  (variant: "error" | "success" | "neutral" | "info") => (message: string) =>
    baseToast.custom((t) => (
      <Toast variant={variant} visible={t.visible}>
        {message}
      </Toast>
    ));

const toast = {
  error: createToastHandler("error"),
  success: createToastHandler("success"),
  neutral: createToastHandler("neutral"),
  info: createToastHandler("info"),
};

export { toast as default, toast };
