import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Tab, Transition } from "@headlessui/react";
import ToggleFollow from "~/app/(user)/_components/toggle-follow-button";
import { cn } from "~/lib/utils";

type CardProps = {
  user: Follow;
  username: string;
  currentUserId?: string;
};

function Card({ user, username, currentUserId }: CardProps) {
  return (
    <Link
      href={`/${user.username}`}
      className="flex cursor-pointer gap-2 rounded-3xl bg-white p-2 dark:bg-neutral-900"
    >
      <div className="relative aspect-square h-16 w-16 rounded-2xl bg-neutral-100 p-0.5 dark:bg-neutral-800">
        <Image
          alt={`${user.username}`}
          src={user.profileImage ?? "/images/not-found-square.png"}
          width={80}
          height={80}
          className="aspect-square h-full w-full rounded-[14px] object-cover"
        />
      </div>
      <div className="py-0.2 flex grow flex-col">
        <div className="text-lg font-bold text-yellow-500 dark:text-yellow-400">
          {user.username}
        </div>

        <div className="text-sm/tight text-neutral-600">{user.bio}</div>
      </div>

      <div className="flex pr-2 pt-2">
        {currentUserId && currentUserId !== user.id && (
          <ToggleFollow
            username={username}
            id={user.id}
            size="sm"
            variant={user.isFollowing ? "secondary" : "primary"}
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
              <div className="h-screen w-screen bg-neutral-50 dark:bg-neutral-950 md:h-fit md:max-w-lg md:rounded-3xl">
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
                          selected ? "bg-neutral-50 dark:bg-neutral-950" : "",
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
                          selected ? "bg-neutral-50 dark:bg-neutral-950" : "",
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
                  <Tab.Panels className="bg-neutral-50 pt-2 dark:bg-neutral-950 md:rounded-b-3xl">
                    <Tab.Panel
                      className={cn(
                        "flex flex-col gap-2 overflow-y-auto p-4 md:h-[480px] md:p-6",
                      )}
                    >
                      {following.map((follow) => (
                        <Card
                          key={follow.id}
                          user={follow}
                          username={username}
                          currentUserId={currentUserId}
                        />
                      ))}
                    </Tab.Panel>
                    <Tab.Panel
                      className={cn(
                        "flex flex-col gap-2 overflow-y-auto p-4 md:h-[480px] md:p-6",
                      )}
                    >
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
