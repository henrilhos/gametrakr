import { notFound } from "next/navigation";
import Upload from "~/app/profile-picture/_components/upload";
import { getCurrentUser } from "~/lib/session";

// TODO: delete after creating profile page
export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <div>
      <Upload image={user.image} />
    </div>
  );
}
