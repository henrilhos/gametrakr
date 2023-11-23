import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CoverPictureUploader from "~/app/(user)/_components/upload/cover-picture";
import ProfilePictureUploader from "~/app/(user)/_components/upload/profile-picture";
import { Card, CardTitle } from "~/components/ui/card";

type Props = {
  open: boolean;
  onClose: () => void;
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

export default function EditProfileModal({ open, onClose, user }: Props) {
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
            <Card className="h-screen w-screen p-6 md:h-fit md:max-w-lg">
              <CardTitle className="mb-4 text-2xl">Edit profile</CardTitle>

              <CoverPictureUploader
                currentImage={user.coverImage ?? undefined}
              />

              <div className="-mt-12 px-8">
                <ProfilePictureUploader
                  currentImage={user.profileImage ?? undefined}
                />
              </div>
            </Card>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
