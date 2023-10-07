import { signIn, signOut, useSession } from "next-auth/react";

import { Heading } from "~/components/heading";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Container } from "~/components/ui/container";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const getTitleAndYear = () => {
    return `Starfield (2023)`.toUpperCase();
  };

  return (
    <>
      <main>
        <Container>
          <Card
            className="full-height flex h-fit max-w-full flex-col justify-between rounded-2xl bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(https://i.imgur.com/bNNed9d.png)" }}
          >
            {/* TODO: add link to game page */}
            <div className="ml-4 mt-4 text-background">{getTitleAndYear()}</div>

            <div className="flex flex-col items-center">
              <Card className="mx-8 my-12 max-w-screen-md p-8 md:mx-0 md:px-20 md:py-12">
                <Heading size="lg">Track your gaming journey</Heading>

                <div className="mt-8 text-center text-xl text-muted">
                  Show what games you love, share your thoughts and experiences
                  and connect with a thriving gaming community.
                </div>

                <div className="mt-16 text-center">
                  <Button size="lg" align="center">
                    Get started
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </Container>

        {/* <div className="flex flex-col items-center gap-2">
          <p className="text-2xl">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <AuthShowcase />
        </div> */}
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {(sessionData ?? secretMessage) && (
        <p className="text-center text-2xl">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
      )}
      <button
        className="rounded-full bg-foreground/10 px-10 py-3 font-semibold no-underline transition hover:bg-foreground/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
