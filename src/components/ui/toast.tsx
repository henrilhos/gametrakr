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

const toastComponentVariants = cva("pointer-events-auto rounded-2xl", {
  variants: {
    variant: {
      neutral: "bg-neutral text-neutral-foreground",
      success: "bg-success text-success-foreground",
      error: "bg-error text-error-foreground",
      info: "bg-info text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

type ToastComponentProps = PropsWithChildren<
  {
    visible?: boolean;
  } & VariantProps<typeof toastComponentVariants>
>;
const ToastComponent = ({
  children,
  variant,
  visible,
}: ToastComponentProps) => {
  const icons = {
    neutral: faTriangleExclamation,
    success: faCircleCheck,
    error: faCircleExclamation,
    info: faCircleInfo,
  };

  return (
    <div
      className={cn(
        toastComponentVariants({ variant }),
        visible && "animate-enter",
        !visible && "animate-leave",
      )}
    >
      <div className="px-6 py-3 text-lg leading-5">
        <FontAwesomeIcon icon={icons[variant ?? "neutral"]} className="mr-4" />
        {children}
      </div>
    </div>
  );
};

const createToastHandler =
  (variant: "error" | "success" | "neutral" | "info") => (message: string) =>
    baseToast.custom((t) => (
      <ToastComponent variant={variant} visible={t.visible}>
        {message}
      </ToastComponent>
    ));

const toast = {
  error: createToastHandler("error"),
  success: createToastHandler("success"),
  neutral: createToastHandler("neutral"),
  info: createToastHandler("info"),
};

export { toast as default, toast };
