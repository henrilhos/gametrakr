import { Fragment } from "react";
import Link from "next/link";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { type User } from "next-auth";
import SignInButton from "~/components/auth/sign-in-button";
import SignOutButton from "~/components/auth/sign-out-button";
import SignUpButton from "~/components/auth/sign-up-button";
import SearchInput from "~/components/search/input";
import ThemeSwitch from "~/components/theme/switch";
import { Button } from "~/components/ui/button";

type Props = {
  user?: User;
  open: boolean;
  onClose: () => void;
};

export default function Dropdown({ user, open, onClose }: Props) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={onClose} as="div" className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-white/20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <Dialog.Panel>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-100"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-100"
            >
              <div className="bg-white px-3 py-4 dark:bg-black">
                <div className="flex w-full items-center gap-2">
                  <div className="h-[40px] w-full">
                    <SearchInput placeholder="Search" />
                  </div>

                  <Button
                    aria-label="Close menu"
                    size="icon"
                    justify="center"
                    className="bg-transparent text-neutral-600 dark:bg-transparent dark:text-neutral-300"
                    onClick={onClose}
                  >
                    <FontAwesomeIcon className="h-5" icon={faEllipsis} />
                  </Button>
                </div>
              </div>
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 scale-100 translate-y-[-192px]"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="scale-100"
              leaveTo="scale-100 translate-y-[-192px]"
            >
              <div className="-mt-4 flex flex-col gap-4 rounded-b-[18px] bg-white px-3 py-4 dark:bg-black">
                <div className="flex flex-col gap-2">
                  {!user && (
                    <>
                      <SignInButton full />
                      <SignUpButton full />
                    </>
                  )}
                  {user && (
                    <>
                      <Link href={`/${user.username}`} passHref>
                        <Button justify="center" full variant="secondary">
                          My profile
                        </Button>
                      </Link>
                      <SignOutButton
                        full
                        className="before:content-['Sign_out']"
                      />
                    </>
                  )}
                </div>

                <div className="flex w-full flex-row-reverse">
                  <ThemeSwitch />
                </div>
              </div>
            </Transition.Child>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
