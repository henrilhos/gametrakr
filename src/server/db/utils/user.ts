import { hash } from "argon2";
import { type z } from "zod";
import { type UserPersonalInfoSchema } from "~/server/api/schemas/user";
import { db, eq, users } from "~/server/db";

type NewUser = typeof users.$inferInsert;

export const getUserIdByEmailOrUsername = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  return await db.query.users.findFirst({
    where: (user, { ilike, or }) =>
      or(ilike(user.email, email), ilike(user.username, username)),
    columns: { id: true },
  });
};

export const createUser = async (data: NewUser) => {
  const hashPassword = await hash(data.password);

  return await db
    .insert(users)
    .values({
      ...data,
      password: hashPassword,
    })
    .returning({ id: users.id });
};

export const verifyUser = async ({ id }: { id: string }) => {
  return await db.update(users).set({ verified: true }).where(eq(users.id, id));
};

export const getUserIdByEmail = async ({ email }: { email: string }) => {
  const user = await getUserByEmail({ email });
  return user?.id;
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  return await db.query.users.findFirst({
    where: (user, { ilike, and, eq }) =>
      and(ilike(user.email, email), eq(user.active, true)),
  });
};

export const getUserByCredential = async ({
  credential,
}: {
  credential: string;
}) => {
  return await db.query.users.findFirst({
    where: (user, { ilike, or, and, eq }) =>
      and(
        or(ilike(user.email, credential), ilike(user.username, credential)),
        eq(user.active, true),
      ),
  });
};

export const updateUserPassword = async ({
  userId,
  password,
}: {
  userId: string;
  password: string;
}) => {
  const hashPassword = await hash(password);

  await db
    .update(users)
    .set({ password: hashPassword })
    .where(eq(users.id, userId));
};

export const findManyUsersByQuery = async ({
  query,
  limit = 10,
  offset = 0,
}: {
  query: string;
  limit?: number;
  offset?: number;
}) => {
  return await db.query.users.findMany({
    where: (user, { ilike, and, eq }) =>
      and(ilike(user.username, `%${query}%`), eq(user.active, true)),
    with: {
      followers: true,
      following: true,
    },
    limit,
    offset,
  });
};

export const findFirstUserByUsername = (username: string) =>
  db.query.users.findFirst({
    where: (user, { and, ilike, eq }) =>
      and(ilike(user.username, username), eq(user.active, true)),
    columns: {
      active: false,
      email: false,
      password: false,
      updatedAt: false,
      verified: false,
    },
  });

export const updateUserPersonalInformation = async (
  id: string,
  input: z.infer<typeof UserPersonalInfoSchema>,
) => {
  const [response] = await db
    .update(users)
    .set({ ...input })
    .where(eq(users.id, id))
    .returning({ bio: users.bio, location: users.location });

  return response;
};
