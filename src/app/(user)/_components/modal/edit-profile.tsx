import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type FileWithPath } from "@uploadthing/react";
import CoverPictureUploader from "~/app/(user)/_components/upload/cover-picture";
import ProfilePictureUploader from "~/app/(user)/_components/upload/profile-picture";
import { Icons } from "~/components/icons";
import BackButton from "~/components/ui/back-button";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import toast from "~/components/ui/toast";
import { useUploadThing } from "~/lib/uploadthing";
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
                    <CardTitle className="text-2xl">Edit profile</CardTitle>
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

                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleOnClick}
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Icons.spinner
                        aria-label="Loading"
                        className="animate-spin"
                      />
                    )}
                    {!isLoading && "Save changes"}
                  </Button>
                </div>
              </Card>
            </Transition.Child>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
