"use client";

import { useState } from "react";
import EditProfileModal from "~/app/(user)/_components/modal/edit-profile";
import { Button } from "~/components/ui/button";

type Props = {
  user: {
    followers: number;
    following: number;
    isFollowed: boolean;
    username: string;
    id: string;
    profileImage: string | null;
    coverImage: string | null;
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
      <Button size="sm" justify="center" onClick={handleOpen}>
        Edit profile
      </Button>

      <EditProfileModal open={isOpen} onClose={handleClose} user={user} />
    </>
  );
}
