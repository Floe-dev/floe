import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@floe/db";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
        profile: token.profile,
        accessToken: token.accessToken,
        error: token?.error,
      };
    },
    jwt: ({ token, user, account, profile }) => {
      if (user) {
        token.id = user.id;
      }

      if (profile) {
        token.profile = profile;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.expiresAt = account.expires_at! * 1000;
      }

      if (Date.now() > (token.expiresAt as number)) {
        return {
          ...token,
          error: "TokenExpired",
        };
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);
