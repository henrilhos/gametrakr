import { Fragment, useEffect, useState, type PropsWithChildren } from "react";
import Image from "next/image";
import {
  faBold,
  faItalic,
  faListOl,
  faListUl,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog as PrimitiveDialog, Transition } from "@headlessui/react";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { type TRPCError } from "@trpc/server";
import { z } from "zod";
import { type Game } from "~/app/games/_components/game";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Slider } from "~/components/ui/slider";
import toast from "~/components/ui/toast";
import { Toggle } from "~/components/ui/toggle";
import { useZodForm } from "~/hooks/use-zod-form";
import { cn, getKeys } from "~/lib/utils";
import { api } from "~/trpc/react";

const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .gte(0, { message: "Rating is too low" })
    .lte(10, { message: "Rating is to high" })
    .optional(),
  isSpoiler: z.boolean().default(false),
  content: z.string().optional(),
});

function Dialog(
  props: PropsWithChildren<{ open: boolean; onClose: () => void }>,
) {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <PrimitiveDialog onClose={props.onClose} as="div" className="z-50">
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
          <PrimitiveDialog.Panel>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {props.children}
            </Transition.Child>
          </PrimitiveDialog.Panel>
        </div>
      </PrimitiveDialog>
    </Transition>
  );
}

function Toolbar({ editor }: { editor: Editor | null; className?: string }) {
  if (!editor) return;

  return (
    <div className={cn("flex gap-2")}>
      <Toggle
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <FontAwesomeIcon icon={faBold} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <FontAwesomeIcon icon={faItalic} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <FontAwesomeIcon icon={faQuoteRight} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <FontAwesomeIcon icon={faListUl} />
      </Toggle>

      <Toggle
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <FontAwesomeIcon icon={faListOl} />
      </Toggle>
    </div>
  );
}

function Tiptap({
  description,
  onChange,
}: {
  description?: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Placeholder.configure({
        placeholder: "Write your review...",
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: cn(
          "bord-0 prose h-56 overflow-y-auto px-2 pt-6 outline-none dark:prose-invert",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="group flex flex-col justify-stretch rounded-lg bg-neutral-100 p-2 transition-all focus-within:bg-white dark:bg-neutral-900 focus-within:dark:bg-black">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="peer" />
    </div>
  );
}

function RatingCard({ value }: { value?: number }) {
  const getRatingColor = (rating?: number): string => {
    if (!rating) return "text-neutral-900 dark:text-neutral-100";

    switch (true) {
      case rating < 3:
        return "text-red-500";
      case rating < 5:
        return "text-orange-500";
      case rating < 7:
        return "text-yellow-500";
      case rating < 9:
        return "text-green-500";
      case rating <= 10:
        return "text-teal-500";
      default:
        return "white";
    }
  };

  const [className, setClassName] = useState(getRatingColor(value));

  useEffect(() => setClassName(getRatingColor(value)), [value]);

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold dark:bg-black",
        className,
      )}
    >
      {value ?? "-"}
    </div>
  );
}

type Props = {
  game: Game;
  open: boolean;
  onClose: () => void;
};

export function ReviewModal({ game, open, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useZodForm({
    schema: reviewSchema,
    mode: "onChange",
    defaultValues: {
      content: "",
      isSpoiler: false,
      rating: undefined,
    },
  });

  const { mutateAsync: createReview } = api.review.createOrUpdate.useMutation();
  const utils = api.useUtils();

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  const onSubmit = form.handleSubmit(
    async (data) => {
      console.log(data);
      setIsLoading(true);

      try {
        await createReview({ gameId: game.id, review: { ...data } });
        await utils.game.findFirstBySlug.invalidate({ slug: game.slug });
        toast.success("Game successfully reviewd");
        setIsLoading(false);
        handleClose();
      } catch (err) {
        const { message } = err as TRPCError;
        toast.error(message);
        setIsLoading(false);
      }
    },
    (data) => {
      const keys = getKeys(data);

      for (const key of keys) {
        const err = data[key];
        if (err && err.message) {
          toast.error(err.message);
          return;
        }
      }
    },
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="grid h-screen w-screen bg-neutral-50 dark:bg-neutral-950 md:h-fit md:max-w-3xl md:grid-cols-5 md:gap-6 md:rounded-3xl md:p-6">
        <div className="md:col-span-1">
          <div className="relative flex w-full min-w-fit justify-center ">
            <Image
              src={game.cover ?? "/images/not-found.png"}
              alt={game.name ?? "Name not found"}
              sizes="100vw"
              width={200}
              height={150}
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>

        <div className="md:col-span-4">
          <div className="py-4">
            <div className="space-y-1">
              <div className="font-apfel-grotezk text-2xl font-bold">
                {game?.name ?? "Name not found"}
              </div>
              <div className="text-lg text-neutral-600 dark:text-neutral-400">
                {game?.releaseDate?.getFullYear() ?? "XXXX"}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-6 pt-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-600 dark:text-neutral-400">
                      Rating
                    </label>

                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <>
                            <RatingCard value={field.value} />
                            <FormItem className="flex grow items-center rounded-2xl bg-white p-2 dark:bg-black">
                              <FormControl>
                                <Slider
                                  min={0}
                                  max={10}
                                  step={1}
                                  value={
                                    field.value ? [field.value] : undefined
                                  }
                                  onValueChange={(vals) => {
                                    field.onChange(vals[0]);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="py-6">
                      <FormControl>
                        <Tiptap
                          description={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="isSpoiler"
                    render={({ field }) => (
                      <FormItem className="grow">
                        <FormControl>
                          <div className="flex cursor-pointer items-center">
                            <Checkbox
                              id="contains-spoiler"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <label
                              htmlFor="contains-spoiler"
                              className="ml-2 cursor-pointer text-lg text-neutral-800 dark:text-neutral-200"
                            >
                              Contains spoilers
                            </label>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button justify="center" type="submit" disabled={isLoading}>
                    Done!
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
