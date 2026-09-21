import { games, users } from "~/server/db/schema";
import { getTestDatabase } from "./database";

export async function createUserFixture(
  overrides: Partial<typeof users.$inferInsert> = {},
) {
  const [user] = await getTestDatabase()
    .insert(users)
    .values({
      email: "integration@example.com",
      username: "integration-user",
      password: "not-a-real-password",
      ...overrides,
    })
    .returning();

  if (!user) throw new Error("User fixture was not created");
  return user;
}

export async function createGameFixture(
  overrides: Partial<typeof games.$inferInsert> = {},
) {
  const [game] = await getTestDatabase()
    .insert(games)
    .values({
      slug: "integration-game",
      name: "Integration Game",
      ...overrides,
    })
    .returning();

  if (!game) throw new Error("Game fixture was not created");
  return game;
}
