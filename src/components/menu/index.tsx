"use client";

import { useState } from "react";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type User } from "next-auth";
import Dropdown from "~/components/menu/dropdown";
import { Button } from "~/components/ui/button";

type Props = {
  user?: User;
};

export default function Menu({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <Button size="icon" variant="icon" justify="center" onClick={handleOpen}>
        <FontAwesomeIcon className="h-5" icon={faEllipsisVertical} />
      </Button>

      <Dropdown user={user} open={isOpen} onClose={handleClose} />
    </>
  );
}
