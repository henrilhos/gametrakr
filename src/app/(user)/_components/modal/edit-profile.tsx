import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type FileWithPath } from "@uploadthing/react";
import CoverPictureUploader from "~/app/(user)/_components/upload/cover-picture";
import ProfilePictureUploader from "~/app/(user)/_components/upload/profile-picture";
import BackButton from "~/components/ui/back-button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import toast from "~/components/ui/toast";
import { useUploadThing } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

type User = {
  followers: number;
  following: number;
  isFollowed: boolean;
  username: string;
  id: string;
  profileImage: string | null;
  coverImage: string | null;
  createdAt: Date | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export default function EditProfileModal({ open, onClose, user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<FileWithPath>();
  const [coverFile, setCoverFile] = useState<FileWithPath>();

  const utils = api.useUtils();

  const handleProfileFileChange = (file: FileWithPath) => {
    setProfileFile(file);
  };

  const handleCoverFileChange = (file: FileWithPath) => {
    setCoverFile(file);
  };

  const handleOnClick = async () => {
    setIsLoading(true);

    const newUser = { ...user };

    if (profileFile) {
      const res = await startUploadProfile([profileFile]);

      if (res?.[0]?.url) {
        newUser.profileImage = res[0].url;
      }
    }

    if (coverFile) {
      const res = await startUploadCover([coverFile]);
      if (res?.[0]?.url) {
        newUser.coverImage = res[0].url;
      }
    }

    await utils.user.findFirstByUsername.invalidate({
      username: user.username,
    });

    onClose();
  };

  const handleOnClose = () => {
    if (!isLoading) onClose();
  };

  const { startUpload: startUploadProfile } = useUploadThing(
    "profileImageUploader",
    {
      onUploadError: (err) => {
        toast.error(err.message);
        setIsLoading(false);
      },
    },
  );

  const { startUpload: startUploadCover } = useUploadThing(
    "coverImageUploader",
    {
      onUploadError: (err) => {
        toast.error(err.message);
        setIsLoading(false);
      },
    },
  );

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={handleOnClose} as="div" className="z-50">
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
              <Card className="h-screen w-screen rounded-none p-6 md:h-fit md:max-w-lg md:rounded-2xl">
                <div>
                  <CardHeader className="mb-5 gap-3">
                    <BackButton className="md:hidden" onClick={handleOnClose} />
                    <CardTitle className="flex justify-between text-2xl">
                      Edit profile
                      <button
                        type="button"
                        onClick={handleOnClick}
                        className={cn(
                          "inline-flex h-fit items-center justify-center rounded-xl bg-transparent px-3 py-1 text-lg font-bold text-yellow-500 transition-all inner-border-2 inner-border-yellow-500 hover:scale-105 hover:text-black hover:inner-border-black active:scale-95 active:bg-yellow-200 active:text-yellow-500 active:inner-border-0 dark:text-yellow-400 dark:inner-border-yellow-400 dark:hover:text-white dark:hover:inner-border-white dark:active:bg-yellow-800 dark:active:text-yellow-400",
                        )}
                      >
                        Save changes
                      </button>
                    </CardTitle>
                  </CardHeader>

                  <CoverPictureUploader
                    currentImage={user.coverImage ?? undefined}
                    handleFileChange={handleCoverFileChange}
                  />

                  <div className="-mt-14 px-3 md:-mt-16">
                    <ProfilePictureUploader
                      currentImage={user.profileImage ?? undefined}
                      handleFileChange={handleProfileFileChange}
                    />
                  </div>
                </div>
              </Card>
            </Transition.Child>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
