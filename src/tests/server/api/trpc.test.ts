import { NextRequest } from "next/server";
import * as nextAuth from "next-auth";
import { describe, expect, it, vi } from "vitest";
import * as apiTRPC from "~/server/api/trpc";

vi.mock("next-auth");

describe("trpc api", () => {
  describe("create TRPC context", () => {
    it("should call getServerAuthSession and createInnerTRPCContext with the correct arguments", async () => {
      const req = new NextRequest("https://gametra.kr");
      const session = { user: { id: "42", username: "crash" } };

      vi.mocked(nextAuth.getServerSession).mockResolvedValue({ ...session });

      const context = await apiTRPC.createTRPCContext({ req });

      expect(nextAuth.getServerSession).toHaveBeenCalled();
      expect(context.session?.user.id).toBe("42");
      expect(context.session?.user.username).toBe("crash");
    });
  });
});
