"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Heading } from "../heading"
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from "../ui"

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Nickname must be at least 2 characters" })
      .max(50, { message: "Nickname must be not exceed 50 characters" }),
    email: z
      .string()
      .email({ message: "Invalid email" })
      .min(5, { message: "Email must be at least 5 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

type SignUpForm = z.infer<typeof signUpSchema>

export interface SignUpDialogProps {
  open: boolean
  onClose: () => void
}

export const SignUpDialog = ({ open, onClose }: SignUpDialogProps) => {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (values: SignUpForm) => {
    console.log(values)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Card className="min-h-[100vh] min-w-[100vw] rounded-none px-7 pb-5 pt-20 md:my-8 md:min-h-fit md:min-w-[31rem] md:rounded-[2rem] md:px-14 md:pb-10">
        <CardHeader>
          <CardTitle className="text-left">Join the community</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Nickname" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Email" type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input label="Password" type="password" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          label="Confirm password"
                          type="password"
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
                <Button
                  type="submit"
                  className="mt-2 min-w-full"
                  align="center"
                >
                  Sign Up
                </Button>
              </div>

              <div className="text-lg leading-6 text-muted-foreground">
                Already have an account?{" "}
                <span className="font-bold text-card-foreground">Sign In</span>
              </div>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <Heading size="sm">gametrakr</Heading>
        </CardFooter>
      </Card>
    </Dialog>
  )
}
