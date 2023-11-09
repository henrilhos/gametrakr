import Image from "next/image";

type ProfileCardProps = {
  name: string;
  image: string;
  followersCount: number;
  followsCount: number;
};
export const ProfileCard = (props: ProfileCardProps) => {
  return (
    <div className="rounded-2xl border-2 border-neutral-100 bg-white p-3 dark:border-neutral-950 dark:bg-neutral-950">
      <div className="relative h-20 w-full">
        <Image
          alt={`${props.name}'s cover picture`}
          src="https://fakeimg.pl/80"
          objectFit="cover"
          className="z-0 rounded-lg"
          fill
        />
      </div>
      <div className="mx-2 flex flex-row gap-2">
        <div className="relative z-10 -mt-8 h-[104px] w-[104px]">
          <Image
            alt={`${props.name}'s profile picture`}
            src="https://fakeimg.pl/80"
            objectFit="cover"
            className="z-0 rounded-3xl border-4 border-white dark:border-neutral-950"
            fill
          />
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <div className="text-lg font-bold">henrilhos</div>
          <div className="flex gap-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div>
              <span className="font-bold">{props.followersCount}</span>{" "}
              <span>followers</span>
            </div>
            <div>
              <span className="font-bold">{props.followsCount}</span>{" "}
              <span>following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
