import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { users } from "~/server/db/schema";
import { getTestDatabase } from "./database";
import { createGameFixture, createUserFixture } from "./fixtures";

describe("disposable PostgreSQL database", () => {
  it("writes and reads through the production Drizzle schema", async () => {
    const created = await createUserFixture({
      email: "ada@example.com",
      username: "ada",
    });

    const [found] = await getTestDatabase()
      .select()
      .from(users)
      .where(eq(users.id, created.id));

    expect(found).toMatchObject({
      id: created.id,
      email: "ada@example.com",
      username: "ada",
      active: true,
    });
  });

  it("starts each test with deterministic empty state", async () => {
    const existing = await getTestDatabase()
      .select({ id: users.id })
      .from(users);

    expect(existing).toHaveLength(0);

    const user = await createUserFixture();
    const game = await createGameFixture();

    expect(user.username).toBe("integration-user");
    expect(game.slug).toBe("integration-game");
  });
});
