import UserContainer from "~/app/(user)/_components/user-container";
import { getCurrentUser } from "~/lib/session";

export default async function Page() {
  const currentUser = await getCurrentUser();

  return <UserContainer user={currentUser} />;
}
