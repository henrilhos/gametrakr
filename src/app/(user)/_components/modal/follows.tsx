import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type ToggleFollowButtonProps = {
  userId: string;
  username: string;
  following: boolean;
};

function ToggleFollowButton({
  userId,
  following,
  username,
}: ToggleFollowButtonProps) {
  const { mutateAsync: toggleFollow } = api.user.toggleFollow.useMutation();
  const utils = api.useUtils();

  const onClick = async () => {
    await toggleFollow({ userId });
    await utils.user.findFirstByUsername.invalidate({ username });
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        void onClick();
      }}
      className={cn(
        "inline-flex h-8 w-24 items-center justify-center rounded-xl px-3 py-1 text-base/none font-bold transition-all hover:scale-105 hover:inner-border-2 active:scale-95",
        following
          ? "inner-border-2 before:content-['Following'] hover:bg-transparent hover:text-red-500 hover:inner-border-red-500 hover:before:content-['Unfollow'] dark:text-neutral-600 dark:inner-border-neutral-600 dark:hover:bg-transparent dark:hover:text-red-400 dark:hover:inner-border-red-400"
          : "bg-yellow-500 text-white before:content-['Follow'] hover:bg-transparent hover:text-black hover:inner-border-black active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 dark:bg-yellow-400 dark:text-black dark:hover:bg-transparent dark:hover:text-white dark:hover:inner-border-white dark:active:bg-yellow-800 dark:active:text-yellow-400",
      )}
    />
  );
}

type CardProps = {
  user: Follow;
  username: string;
  currentUserId?: string;
};

function Card({ user, username, currentUserId }: CardProps) {
  return (
    <Link
      href={`/${user.username}`}
      className="flex cursor-pointer gap-2 rounded-3xl p-2 dark:bg-neutral-900"
    >
      <div className="relative aspect-square h-16 w-16 rounded-2xl p-0.5 dark:bg-neutral-800">
        <Image
          alt={`${user.username}`}
          src={user.profileImage ?? "/images/not-found.png"}
          width={80}
          height={80}
          className="aspect-square h-full w-full rounded-[14px] object-cover"
        />
      </div>
      <div className="py-0.2 flex grow flex-col">
        <div className="text-lg font-bold text-yellow-500 dark:text-yellow-400">
          {user.username}
        </div>

        <div className="text-sm/tight dark:text-neutral-600">{user.bio}</div>
      </div>

      <div className="flex pr-2 pt-2">
        {currentUserId && currentUserId !== user.id && (
          <ToggleFollowButton
            userId={user.id}
            username={username}
            following={user.isFollowing!}
          />
        )}
      </div>
    </Link>
  );
}

export type Follow = {
  isFollowing?: boolean;
  id: string;
  username: string;
  profileImage: string | null;
  bio: string | null;
};

type Props = {
  tab: "following" | "followers";
  following: Follow[];
  followers: Follow[];
  username: string;
  currentUserId?: string;

  open: boolean;
  onClose: () => void;
};

export default function FollowsModal({
  tab,
  following,
  followers,
  currentUserId,
  username,
  open,
  onClose,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(tab === "following" ? 0 : 1);
  }, [tab]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={onClose} as="div" className="z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm dark:bg-white/20" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          <Dialog.Panel>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="h-screen w-screen bg-white dark:bg-neutral-950 md:h-fit md:max-w-lg md:rounded-3xl">
                <Tab.Group
                  selectedIndex={selectedIndex}
                  onChange={setSelectedIndex}
                >
                  <Tab.List className="flex items-center justify-center bg-neutral-200 dark:bg-black md:rounded-t-3xl">
                    <Tab
                      className={({ selected }) =>
                        cn(
                          "w-full rounded-t-3xl px-6 py-3 text-left text-lg font-bold text-neutral-700",
                          "focus:outline-none",
                          selected ? "bg-white dark:bg-neutral-950" : "",
                        )
                      }
                    >
                      Following
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        cn(
                          "w-full rounded-t-3xl px-6 py-3 text-left text-lg font-bold text-neutral-700",
                          "focus:outline-none",
                          selected ? "bg-white dark:bg-neutral-950" : "",
                        )
                      }
                    >
                      Followers
                    </Tab>
                    <button
                      onClick={onClose}
                      className="m-2 inline-flex items-center justify-center rounded-full bg-neutral-50 px-2.5 py-2 dark:bg-neutral-900"
                    >
                      <FontAwesomeIcon
                        className="text-neutral-500 dark:text-neutral-600"
                        icon={faXmark}
                      />
                    </button>
                  </Tab.List>
                  <Tab.Panels className="bg-white pt-2 dark:bg-neutral-950 md:rounded-b-3xl">
                    <Tab.Panel className={cn("flex flex-col gap-2 p-4 md:p-6")}>
                      {following.map((follow) => (
                        <Card
                          key={follow.id}
                          user={follow}
                          username={username}
                          currentUserId={currentUserId}
                        />
                      ))}
                    </Tab.Panel>
                    <Tab.Panel className={cn("flex flex-col gap-2 p-6")}>
                      {followers.map((follow) => (
                        <Card
                          key={follow.id}
                          user={follow}
                          username={username}
                          currentUserId={currentUserId}
                        />
                      ))}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </Transition.Child>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
