"use client";

import { useParams } from "next/navigation";
import UserCard from "~/app/search/_components/cards/user";
import Heading from "~/app/search/_components/heading";
import { api } from "~/trpc/react";

export default function Users() {
  const { query } = useParams<{ query: string }>();

  const [response] = api.user.getByQuery.useSuspenseQuery({ query, limit: 4 });

  if (!response.users || response.users.length <= 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <Heading href={`/search/${query}/users`}>Users</Heading>

      <div className="grid gap-4 md:grid-cols-4">
        {response.users.map((user) => (
          <UserCard key={user.username} user={{ ...user }} />
        ))}
      </div>
    </div>
  );
}
