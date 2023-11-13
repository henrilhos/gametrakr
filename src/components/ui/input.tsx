import React from "react";
import clsx from "clsx";
import type { ControllerFieldState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type InputProps = {
  label?: string;
  state?: ControllerFieldState;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, state, ...props }, ref) => {
    return (
      <div ref={ref} className={clsx("relative w-full")}>
        <input
          {...props}
          type={type}
          className={twMerge(
            "peer h-full w-full rounded-2xl border-4 border-neutral-500 border-t-transparent bg-transparent px-4 py-2.5 text-lg text-black shadow-none outline outline-0 transition-all dark:border-slate-700 dark:border-t-transparent dark:text-white",
            "placeholder-shown:border-4 placeholder-shown:border-neutral-500 placeholder-shown:border-t-neutral-500 dark:placeholder-shown:border-slate-700 dark:placeholder-shown:border-t-slate-700",
            "focus:border-4 focus:border-yellow-500 focus:border-t-transparent focus:outline-0 dark:focus:border-yellow-400 dark:focus:border-t-transparent",
            !!state?.invalid &&
              "border-red-500 border-t-transparent placeholder-shown:border-red-500 dark:border-red-400 dark:border-t-transparent dark:placeholder-shown:border-red-400",
            className,
          )}
          placeholder=""
        />
        <label
          className={twMerge(
            "pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-neutral-800 transition-all dark:text-slate-300",

            "before:content[' '] before:pointer-events-none before:mr-1 before:mt-[6px] before:box-border before:block before:h-4 before:w-5 before:rounded-tl-2xl before:border-l-4 before:border-t-4 before:border-neutral-500 before:transition-all dark:before:border-slate-700",

            "after:content[' '] after:pointer-events-none after:ml-1 after:mt-[6px] after:box-border after:block after:h-4 after:w-5 after:flex-grow after:rounded-tr-2xl after:border-r-4 after:border-t-4 after:border-neutral-500 after:transition-all dark:after:border-slate-700",

            "peer-focus:text-sm peer-focus:leading-tight peer-focus:text-yellow-500 peer-focus:before:mr-1 peer-focus:before:border-l-4 peer-focus:before:border-t-4 peer-focus:before:!border-yellow-500 peer-focus:after:border-r-4 peer-focus:after:border-t-4 peer-focus:after:!border-yellow-500 dark:peer-focus:text-yellow-400 dark:peer-focus:before:!border-yellow-400 dark:peer-focus:after:!border-yellow-400",

            "peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[3.8125rem] peer-placeholder-shown:text-neutral-800 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent dark:peer-placeholder-shown:text-slate-300 dark:peer-placeholder-shown:before:border-transparent dark:peer-placeholder-shown:after:border-transparent",

            !!state?.invalid &&
              "text-red-500 before:border-red-500 after:border-red-500 peer-placeholder-shown:text-red-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent dark:text-red-400 dark:before:border-red-400 dark:after:border-red-400 dark:peer-placeholder-shown:text-red-400 dark:peer-placeholder-shown:before:border-transparent dark:peer-placeholder-shown:after:border-transparent",
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);
Input.displayName = "Input";
