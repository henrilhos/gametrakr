import { useState } from "react";
import EditProfileModal from "~/app/(user)/_components/modal/edit-profile";
import { cn } from "~/lib/utils";

type Props = {
  user: {
    followers: number;
    following: number;
    isFollowed: boolean;
    username: string;
    id: string;
    profileImage: string | null;
    coverImage: string | null;
    location: string | null;
    bio: string | null;
    createdAt: Date | null;
  };
};

export default function EditProfile({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "inline-flex h-fit items-center justify-center rounded-xl bg-transparent px-3 py-1 text-lg font-bold text-yellow-500 transition-all inner-border-2 inner-border-yellow-500 hover:scale-105 hover:text-black hover:inner-border-black active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 dark:text-yellow-400 dark:inner-border-yellow-400 dark:hover:text-white dark:hover:inner-border-white dark:active:bg-yellow-800 dark:active:text-yellow-400",
        )}
      >
        Edit profile
      </button>

      <EditProfileModal open={isOpen} user={user} onClose={handleClose} />
    </>
  );
}
