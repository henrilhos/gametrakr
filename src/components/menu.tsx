import { Fragment } from "react";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";

import { ThemeSwitch } from "~/components/theme-switch";
import { Button } from "~/components/ui/button";

type MenuProps = {
  open: boolean;
  onClose: () => void;
};
const Menu = ({ open, onClose }: MenuProps) => {
  const { data: sessionData } = useSession();

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={onClose} as="div" className="relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate/20 backdrop-blur-sm dark:bg-white/20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div>
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
                <div className="bg-white px-3 py-4 dark:bg-slate">
                  <div className="flex w-full flex-row-reverse items-center">
                    <Button
                      size="icon"
                      className="bg-transparent text-neutral-600 dark:bg-transparent dark:text-white"
                      onClick={onClose}
                    >
                      <FontAwesomeIcon
                        className="h-10 w-10"
                        icon={faEllipsis}
                      />
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
                <div className="-mt-4 rounded-b-[18px] bg-white px-3 py-4 dark:bg-slate">
                  <div>
                    <div className="px-2">
                      <div className="flex flex-col gap-2">
                        {!sessionData && (
                          <Button as="a" href="/auth/sign-up" full>
                            Sign Up
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          full
                          onClick={
                            sessionData
                              ? () => void signOut()
                              : () => void signIn()
                          }
                        >
                          {sessionData ? "Sign out" : "Sign in"}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 flex w-full flex-row-reverse">
                      <ThemeSwitch />
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default Menu;
