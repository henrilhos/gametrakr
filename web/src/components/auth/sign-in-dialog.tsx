"use client"

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

const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInSchema>

export interface SignInDialogProps {
  open: boolean
  onClose: () => void
}

export const SignInDialog = ({ open, onClose }: SignInDialogProps) => {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = (values: SignInForm) => {
    console.log(values)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Card className="min-w-[31rem] rounded-[2rem] px-14 pb-10 pt-20 md:my-8">
        <CardHeader>
          <CardTitle className="text-left">Welcome back</CardTitle>
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
                        <Input label="Email or Nickname" {...field} />
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
                {/* TODO: add Forgot your password link */}
              </div>

              <Button type="submit" className="min-w-full" align="center">
                Sign in
              </Button>

              <div>
                <div className="text-lg leading-6 text-muted-foreground">
                  New on gametrakr?
                </div>
                <Button
                  align="center"
                  className="mt-2 min-w-full"
                  type="button"
                  variant="secondary"
                >
                  Create an Account
                </Button>
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
