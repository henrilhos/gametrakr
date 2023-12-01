import { and, db, eq, tokens } from "~/server/db";

const createToken = async ({
  userId,
  tokenType,
}: {
  userId: string;
  tokenType: "account" | "password";
}) => {
  return await db
    .insert(tokens)
    .values({
      type: tokenType,
      userId,
    })
    .returning();
};

const getTokenByIdAndUserId = async ({
  id,
  userId,
  tokenType,
}: {
  id: string;
  userId: string;
  tokenType: "account" | "password";
}) => {
  return await db.query.tokens.findFirst({
    where: (token, { eq, and }) =>
      and(
        eq(token.id, id),
        eq(token.userId, userId),
        eq(token.type, tokenType),
        eq(token.valid, true),
      ),
  });
};

export const setTokensAsInvalid = async ({
  userId,
  tokenType,
}: {
  userId: string;
  tokenType: "account" | "password";
}) => {
  return await db
    .update(tokens)
    .set({ valid: false })
    .where(and(eq(tokens.userId, userId), eq(tokens.type, tokenType)));
};

export const createAccountToken = async ({ userId }: { userId: string }) => {
  await setTokensAsInvalid({ userId, tokenType: "account" });
  return await createToken({ userId, tokenType: "account" });
};

export const createPasswordToken = async ({ userId }: { userId: string }) => {
  await setTokensAsInvalid({ userId, tokenType: "password" });
  return await createToken({ userId, tokenType: "password" });
};

export const getAccountTokenByIdAndUserId = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return await getTokenByIdAndUserId({ id, userId, tokenType: "account" });
};

export const getPasswordTokenByIdAndUserId = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) => {
  return await getTokenByIdAndUserId({ id, userId, tokenType: "password" });
};
