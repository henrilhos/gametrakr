"use client"

import React from "react"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cn } from "~/lib/utils"

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  inputRef?: React.Ref<HTMLInputElement>
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputRef, type, label, ...props }, ref) => {
    const [passwordType, setPasswordType] = React.useState<"password" | "text">(
      "password"
    )

    const handlePasswordTypeChange = () => {
      setPasswordType(passwordType === "password" ? "text" : "password")
    }

    const isPassword = type === "password"

    return (
      <div ref={ref} className="relative h-10 w-full min-w-[200px]">
        <input
          {...props}
          ref={inputRef}
          className={cn(
            "peer h-full w-full bg-transparent text-black outline outline-0 transition-all focus:outline-0",
            "border border-t-transparent placeholder-shown:border-blue-200 placeholder-shown:border-t-blue-200 focus:border-2 focus:border-t-transparent",
            "rounded-[7px] px-3 py-2.5 text-sm",
            "border-black text-black focus:border-black",
            className
          )}
          placeholder=""
        />
        <label
          className={cn(
            "pointer-events-none absolute left-0 flex h-full w-full select-none !overflow-visible truncate font-normal leading-tight transition-all peer-placeholder-shown:text-blue-500 peer-focus:leading-tight",
            "before:content[' '] -top-1.5 text-[11px] before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:before:border-transparent peer-focus:text-[11px] peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-disabled:before:border-transparent",
            "after:content[' '] after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:transition-all peer-placeholder-shown:after:border-transparent peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-disabled:after:border-transparent",
            "!text-black before:border-black after:border-black peer-focus:text-black peer-focus:before:!border-black peer-focus:after:!border-black"
          )}
        >
          {label}
        </label>
      </div>
      // <div className={cn('relative w-full')}>
      //   <input
      //     type={isPassword ? passwordType : type}
      //     className={cn(
      //       'block w-full rounded-2xl border-4 border-gray-300 p-0 py-2 pl-4 pr-14 placeholder:text-gray-300 focus:border-yellow focus:ring-0',
      //       className
      //     )}
      //     ref={ref}
      //     {...props}
      //   />
      //   {isPassword && (
      //     <div
      //       className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-5 text-gray-300 hover:text-yellow'
      //       onClick={handlePasswordTypeChange}
      //     >
      //       <FontAwesomeIcon
      //         icon={passwordType === 'password' ? faEye : faEyeSlash}
      //       />
      //     </div>
      //   )}
      // </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
