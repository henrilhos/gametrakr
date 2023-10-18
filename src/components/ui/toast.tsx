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
        neutral:
          "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300",
        success:
          "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300",
        error: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-300",
        info: "bg-blue-50 text-blue-500 dark:bg-blue-950 dark:text-blue-300",
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
      <div className="flex items-center px-6 py-3 text-lg/5">
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
