import { and, db, eq, tokens } from "~/server/db";

export const invalidateTokens = async ({
  userId,
  tokenType,
}: {
  userId: string;
  tokenType: "account" | "password";
}) => {
  await db
    .update(tokens)
    .set({ valid: false })
    .where(and(eq(tokens.userId, userId), eq(tokens.type, tokenType)));
};

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
  tokenId,
  userId,
  tokenType,
}: {
  tokenId: string;
  userId: string;
  tokenType: "account" | "password";
}) => {
  return await db.query.tokens.findFirst({
    where: (token, { eq, and }) =>
      and(
        eq(token.id, tokenId),
        eq(token.userId, userId),
        eq(token.type, tokenType),
        eq(token.valid, true),
      ),
  });
};

export const createAccountToken = async ({ userId }: { userId: string }) => {
  await invalidateTokens({ userId, tokenType: "account" });
  return await createToken({ userId, tokenType: "account" });
};

export const createPasswordToken = async ({ userId }: { userId: string }) => {
  await invalidateTokens({ userId, tokenType: "password" });
  return await createToken({ userId, tokenType: "password" });
};

export const getAccountTokenByIdAndUserId = async ({
  tokenId,
  userId,
}: {
  tokenId: string;
  userId: string;
}) => {
  return await getTokenByIdAndUserId({ tokenId, userId, tokenType: "account" });
};

export const getPasswordTokenByIdAndUserId = async ({
  tokenId,
  userId,
}: {
  tokenId: string;
  userId: string;
}) => {
  return await getTokenByIdAndUserId({
    tokenId,
    userId,
    tokenType: "password",
  });
};
