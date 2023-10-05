"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button, Form, FormControl, FormField, FormItem, Input } from "../ui"

const lowercaseRegex = /[a-z]/
const uppercaseRegex = /[A-Z]/
const numberRegex = /[0-9]/
const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/

const signUpSchema = z
  .object({
    username: z
      .string({ required_error: "Nickname is required" })
      .min(2, { message: "Nickname must be at least 2 characters" })
      .max(50, { message: "Nickname must be not exceed 50 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email" })
      .min(5, { message: "Email must be at least 5 characters" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
      .refine(
        (value) => lowercaseRegex.test(value),
        "Password must contain a lower case letter"
      )
      .refine(
        (value) => uppercaseRegex.test(value),
        "Password must contain an upper case letter"
      )
      .refine(
        (value) => numberRegex.test(value),
        "Password must contain a number"
      )
      .refine(
        (value) => symbolRegex.test(value),
        "Password must contain a symbol"
      ),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

type SignUpSchema = z.infer<typeof signUpSchema>

export const SignUpForm = () => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: SignUpSchema) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Nickname"
                    invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Email"
                    type="email"
                    invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Password"
                    type="password"
                    invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Input
                    label="Confirm password"
                    type="password"
                    invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <div className="text-sm leading-4 text-muted-foreground">
            By creating you agree to the{" "}
            <span className="font-bold text-card-foreground">
              Terms and Conditions
            </span>
            .
          </div>
          <Button type="submit" className="mt-2 min-w-full" align="center">
            Sign Up
          </Button>
        </div>

        <div className="text-lg leading-6 text-muted-foreground">
          Already have an account?{" "}
          <span className="font-bold text-card-foreground">Sign In</span>
        </div>
      </form>
    </Form>
  )
}
