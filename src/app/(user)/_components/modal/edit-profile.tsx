import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type FileWithPath } from "@uploadthing/react";
import CoverPictureUploader from "~/app/(user)/_components/upload/cover-picture";
import ProfilePictureUploader from "~/app/(user)/_components/upload/profile-picture";
import BackButton from "~/components/ui/back-button";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import toast from "~/components/ui/toast";
import { useZodForm } from "~/hooks/use-zod-form";
import { useUploadThing } from "~/lib/uploadthing";
import { cn } from "~/lib/utils";
import { UserPersonalInfoSchema } from "~/server/api/schemas/user";
import { api } from "~/trpc/react";

type User = {
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

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export default function EditProfileModal({ open, onClose, user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<FileWithPath>();
  const [coverFile, setCoverFile] = useState<FileWithPath>();

  const form = useZodForm({
    schema: UserPersonalInfoSchema,
    defaultValues: {
      bio: user.bio ?? "",
      location: user.location ?? "",
    },
  });

  const utils = api.useUtils();
  const { mutateAsync: updatePersonalInformation } =
    api.user.updatePersonalInformation.useMutation({
      onSuccess: async () => {
        await utils.user.findFirstByUsername.invalidate({
          username: user.username,
        });
      },
    });

  const handleProfileFileChange = (file: FileWithPath) => {
    setProfileFile(file);
  };

  const handleCoverFileChange = (file: FileWithPath) => {
    setCoverFile(file);
  };

  const handleOnClick = async () => {
    const input = form.getValues();
    setIsLoading(true);

    if (profileFile) {
      await startUploadProfile([profileFile]);
    }

    if (coverFile) {
      await startUploadCover([coverFile]);
    }

    await updatePersonalInformation({ ...input });

    setIsLoading(false);
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

                  <Form {...form}>
                    <div className="mt-4 flex flex-col gap-4">
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                label="Bio"
                                state={fieldState}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                label="Location"
                                state={fieldState}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </div>
              </Card>
            </Transition.Child>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
