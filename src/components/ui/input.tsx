import React, { useEffect } from "react";

import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import type { ControllerFieldState } from "react-hook-form";

type InputProps = {
  label?: string;
  state?: ControllerFieldState;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, state, ...props }, ref) => {
    useEffect(() => {
      if (state?.error?.message) {
        console.log(state?.error?.message);
      }
    }, [state?.error?.message]);

    return (
      <div ref={ref} className={clsx("relative w-full")}>
        <input
          {...props}
          type={type}
          className={twMerge(
            "peer h-full w-full rounded-2xl border-4 border-border border-t-transparent bg-transparent px-4 py-2.5 font-sans text-lg font-normal text-input shadow-none outline outline-0 transition-all",
            "placeholder-shown:border-4 placeholder-shown:border-border placeholder-shown:border-t-border",
            "focus:border-4 focus:border-primary focus:border-t-transparent focus:outline-0",
            !!state?.invalid &&
              "border-destructive border-t-transparent placeholder-shown:border-destructive",
            className,
          )}
          placeholder=""
        />
        <label
          className={twMerge(
            "pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-label transition-all",

            "before:content[' '] before:pointer-events-none before:mt-[6px] before:box-border before:block before:h-4 before:w-5 before:rounded-tl-2xl before:border-l-4 before:border-t-4 before:border-border before:transition-all",

            "after:content[' '] after:pointer-events-none after:ml-1 after:mt-[6px] after:box-border after:block after:h-4 after:w-5 after:flex-grow after:rounded-tr-2xl after:border-r-4 after:border-t-4 after:border-border after:transition-all",

            "peer-focus:text-sm peer-focus:leading-tight peer-focus:text-primary peer-focus:before:mr-1 peer-focus:before:border-l-4 peer-focus:before:border-t-4 peer-focus:before:!border-primary peer-focus:after:border-r-4 peer-focus:after:border-t-4 peer-focus:after:!border-primary",

            "peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[3.8125rem] peer-placeholder-shown:text-label peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent",

            !!state?.invalid &&
              "text-destructive before:border-destructive after:border-destructive peer-placeholder-shown:text-destructive peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent",
            !!props.value && "before:mr-1",
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);
Input.displayName = "Input";
