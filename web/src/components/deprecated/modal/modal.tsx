"use client"

import { Fragment } from "react"
// import { Dialog, Transition } from "@headlessui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../form"
import { Input } from "../input"
import { Title } from "../title"

type Props = {
  open: boolean
  onClose: () => void
}

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Nickname must be at least 2 characters",
      })
      .max(50, {
        message: "Nickname must be not exceed 50 characters",
      }),
    email: z.string().email({ message: "Invalid email" }).min(5, {
      message: "Email must be at least 2 characters",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  })

export const Modal = ({ open, onClose }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="z-10" onClose={onClose}>
        {/* Background w/ transition */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-400 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          {/* Modal container */}
          <div className="flex min-h-full items-end justify-center text-center sm:my-8 sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {/* Modal component */}
              <Dialog.Panel
                className={
                  "relative h-screen transform overflow-hidden bg-white px-16 pb-8 pt-24 text-left transition-all sm:w-full sm:max-w-lg md:h-full md:rounded-[32px]"
                }
              >
                <div className="flex h-full flex-col justify-between">
                  <h1 className="mb-8 font-apfel text-4xl font-bold">
                    Join the community
                  </h1>

                  {/* FORM */}
                  <div className="flex flex-col items-center gap-6">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col gap-2"
                      >
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Nickname</FormLabel> */}
                              <FormControl>
                                <Input
                                  type="text"
                                  label="Nickname"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Email</FormLabel> */}
                              <FormControl>
                                <Input type="email" label="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Password</FormLabel> */}
                              <FormControl>
                                <Input
                                  type="password"
                                  label="Password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirm"
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>Confirm password</FormLabel> */}
                              <FormControl>
                                <Input
                                  type="password"
                                  label="Confirm password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <button type='submit'>Send</button> */}
                      </form>
                    </Form>

                    <div className="w-full text-center">
                      <div className="text-sm font-normal tracking-tight text-gray-500">
                        By creating you agree to the{" "}
                        <span className="text-sm font-normal tracking-tight text-neutral-900 underline">
                          Terms and Conditions
                        </span>
                        .
                      </div>
                      <Button full className="mt-2" align="center">
                        Sign up
                      </Button>
                    </div>

                    <div className="w-full text-center">
                      <div className="text-sm font-normal tracking-tight text-gray-500">
                        Already have an account?
                      </div>
                      <Button
                        variant="secondary"
                        full
                        className="mt-2"
                        align="center"
                      >
                        Sign in
                      </Button>
                    </div>
                  </div>

                  <div className="mt-12">
                    <Title classes="text-3xl">gametrakr</Title>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
