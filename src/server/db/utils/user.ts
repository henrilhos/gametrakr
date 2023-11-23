import { hash } from "argon2";
import { db, eq, users } from "~/server/db";

export const canCreateUser = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  const result = await db.query.users.findFirst({
    where: (user, { ilike, or }) =>
      or(ilike(user.email, email), ilike(user.username, username)),
  });

  return !result;
};

export const createUser = async ({
  email,
  username,
  password,
}: typeof users.$inferInsert) => {
  const hashPassword = await hash(password);

  return await db
    .insert(users)
    .values({
      email,
      username,
      password: hashPassword,
    })
    .returning({ id: users.id });
};

export const verifyUser = async ({ id }: { id: string }) => {
  await db.update(users).set({ verified: true }).where(eq(users.id, id));
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
