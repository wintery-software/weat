import type { CognitoUserGroup } from "@/types";
import axios, { isAxiosError } from "axios";
import jwt from "jsonwebtoken";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

export const config = {
  providers: [
    Cognito({
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Initial login
      if (account) {
        console.log("Initial login:", token.email);
        const { id_token, access_token, refresh_token, expires_at } = account;
        const payload = jwt.decode(id_token!) as Record<string, never>;

        return {
          ...token,
          idToken: id_token,
          accessToken: access_token,
          refreshToken: refresh_token,
          accessTokenExpiresAt: expires_at! * 1000,
          groups: payload["cognito:groups"],
        };
      }

      // Access token still valid
      if (Date.now() < (token.accessTokenExpiresAt as number)) {
        return token;
      }

      console.log(`Access token expired at ${token.accessTokenExpiresAt}. Refreshing:`, token.email);

      // Refresh token
      try {
        const params = new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: token.refreshToken as string,
          client_id: process.env.AUTH_COGNITO_ID!,
          client_secret: process.env.AUTH_COGNITO_SECRET!,
        });

        const res = await axios.post("https://auth.wintery.io/oauth2/token", params, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        // It only returns `expires_at`
        const { access_token, id_token, expires_in } = res.data;
        const payload = jwt.decode(id_token) as Record<string, never>;

        return {
          ...token,
          accessToken: access_token,
          idToken: id_token,
          accessTokenExpiresAt: Date.now() + expires_in * 1000,
          groups: payload["cognito:groups"],
        };
      } catch (err) {
        console.error("Failed to refresh access token:", isAxiosError(err) ? err.response?.data?.error : err);

        return token;
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.expires = new Date(token.accessTokenExpiresAt as number);

      if (token.groups) {
        session.user.groups = token.groups as CognitoUserGroup[];
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
