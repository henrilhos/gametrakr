import { useCallback } from "react";
import { useRouter } from "next/router";

import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

import { signInSchema } from "~/common/validation/auth";
import { Heading } from "~/components/heading";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import type { SignIn } from "~/common/validation/auth";
import type { NextPage } from "next";

const SignInPage: NextPage = () => {
  const router = useRouter();

  const form = useForm<SignIn>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = useCallback(async (data: SignIn) => {
    await signIn("credentials", { ...data, callbackUrl: "/" });
  }, []);

  return (
    <main className="flex min-h-screen min-w-full items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <Card className="min-h-[100vh] min-w-[100vw] rounded-none px-7 pb-5 pt-10 text-center md:my-8 md:min-h-fit md:min-w-[31rem] md:rounded-[2rem] md:px-14 md:pb-10">
        <CardHeader>
          <div className="text-left">
            <button
              type="button"
              className="inline-flex text-lg font-bold leading-5"
              onClick={() => void router.back()}
            >
              <FontAwesomeIcon icon={faCaretLeft} className="mr-1.5" />
              <div>BACK</div>
            </button>
          </div>
          <CardTitle className="mt-6 text-left">Join the community</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
              className="space-y-8"
            >
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
    </main>
  );
};
export default SignInPage;
