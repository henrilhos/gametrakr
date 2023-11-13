import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
import { verify } from "argon2";
import {
  getServerSession,
  type DefaultSession,
  type DefaultUser,
  type NextAuthOptions,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { SignInSchema } from "~/server/api/schemas/auth";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    username: string;
    image: string | null;
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
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        token.picture = user.image;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.username = token.username as string;
        session.user.image = token.picture;
      }

      return session;
    },
  },
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
            await SignInSchema.parseAsync(credentials);

          const user = await db.query.users.findFirst({
            where: (user, { eq, ilike, or, and }) =>
              and(
                or(
                  ilike(user.email, credential),
                  ilike(user.username, credential),
                ),
                eq(user.active, true),
              ),
            columns: {
              id: true,
              email: true,
              username: true,
              password: true,
              profileImage: true,
            },
          });
          if (!user) return null;

          const isPasswordValid = await verify(user.password, password);
          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            username: user.username,
            image: user.profileImage,
          };
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
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
export const getServerAuthSession = (
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) => getServerSession(...args, authOptions);
