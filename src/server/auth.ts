import { type GetServerSidePropsContext } from "next";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verify } from "argon2";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { signInSchema } from "~/common/validation/auth";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

import type { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User extends DefaultUser {
    username?: string | null;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      // TODO: add user image
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
      }

      return token;
    },
    session: ({ session, token }) => {
      // TODO: Add user image
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.username = token.username as string;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {
          label: "Email or username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { credential, password } =
            await signInSchema.parseAsync(credentials);

          const result = await db.user.findFirst({
            where: {
              OR: [
                { email: { equals: credential, mode: "insensitive" } },
                { username: { equals: credential, mode: "insensitive" } },
              ],
            },
          });
          if (!result) return null;

          const isPasswordValid = await verify(result.password, password);
          if (!isPasswordValid) return null;

          return {
            id: result.id,
            email: result.email,
            name: result.name,
            username: result.username,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/sign-in",
    newUser: "/auth/sign-up",
  },
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  session: {
    strategy: "jwt",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
