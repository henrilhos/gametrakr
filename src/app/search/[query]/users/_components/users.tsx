"use client";

import { useParams } from "next/navigation";
import UserCard from "~/app/search/_components/cards/user";
import Heading from "~/app/search/_components/heading";
import { Icons } from "~/components/icons";
import { InfiniteScroller } from "~/components/infinite-scroller";
import { api } from "~/trpc/react";

type User = {
  username: string;
  profileImage: string | null;
  coverImage: string | null;
  followersCount: number;
  followsCount: number;
};

function Loading() {
  return (
    <div className="mt-4 flex w-full justify-center">
      <Icons.loading
        aria-label="Loading"
        className="h-5 w-5 animate-spin fill-yellow-200 text-yellow-500 dark:fill-yellow-800 dark:text-yellow-400"
      />
    </div>
  );
}

export default function Users() {
  const { query } = useParams<{ query: string }>();

  const [data, allUsersQuery] = api.user.getByQuery.useSuspenseInfiniteQuery(
    {
      query,
      limit: 40,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.users.length >= 39) {
          return lastPage.nextCursor;
        }
        return undefined;
      },
      initialCursor: 0,
    },
  );

  const { hasNextPage, fetchNextPage } = allUsersQuery;

  const aggregateUsers = () => {
    const pages = data.pages ?? [];
    const { users } = pages.reduce(
      (prev, current) => {
        const combinedUsers = prev.users.concat(current.users);
        const shallowCopy = { ...prev };

        shallowCopy.users = combinedUsers;

        return shallowCopy;
      },
      {
        users: [] as User[],
      },
    );

    return users;
  };

  return (
    <div className="flex flex-col gap-2">
      <Heading>Users</Heading>

      <InfiniteScroller
        fetchNextPage={() => void fetchNextPage()}
        hasNextPage={Boolean(hasNextPage)}
        loadingMessage={<Loading />}
        endingMessage=""
      >
        {aggregateUsers().map((user) => (
          <UserCard key={user.username} user={{ ...user }} />
        ))}
      </InfiniteScroller>
    </div>
  );
}
