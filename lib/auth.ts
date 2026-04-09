import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:4000/api";

function sanitizeEnv(value: string | undefined) {
  return String(value || "").trim().replace(/^['\"]|['\"]$/g, "");
}

function isConfigured(value: string) {
  if (!value) {
    return false;
  }

  const lowered = value.toLowerCase();
  return !(
    lowered.includes("replace-") ||
    lowered.includes("your-") ||
    lowered.includes("example") ||
    lowered.includes("changeme") ||
    lowered.includes("placeholder")
  );
}

const googleClientId = sanitizeEnv(process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = sanitizeEnv(process.env.GOOGLE_CLIENT_SECRET);
const appleClientId = sanitizeEnv(process.env.APPLE_CLIENT_ID);
const appleClientSecret = sanitizeEnv(process.env.APPLE_CLIENT_SECRET);

const hasGoogleProvider =
  isConfigured(googleClientId) &&
  isConfigured(googleClientSecret) &&
  googleClientId.endsWith(".apps.googleusercontent.com");
const hasAppleProvider = isConfigured(appleClientId) && isConfigured(appleClientSecret);

async function syncSocialUser(params: {
  provider: "google" | "apple";
  providerAccountId?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  const fallbackEmail = params.providerAccountId
    ? `${params.providerAccountId}@${params.provider}.oauth.local`
    : `unknown-${Date.now()}@${params.provider}.oauth.local`;

  const body = {
    name: params.name || "Guest User",
    email: params.email || fallbackEmail,
    image: params.image || ""
  };

  const response = await fetch(`${API_BASE_URL}/auth/${params.provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Auth sync failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.user as { id: string; name: string; email: string; image?: string; provider: string };
}

async function syncGuestUser(params: { name: string; email: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      image: ""
    })
  });

  if (!response.ok) {
    throw new Error(`Guest auth failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.user as { id: string; name: string; email: string; image?: string; provider: string };
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGoogleProvider
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret
          })
        ]
      : []),
    ...(hasAppleProvider
      ? [
          AppleProvider({
            clientId: appleClientId,
            clientSecret: appleClientSecret
          })
        ]
      : []),
    CredentialsProvider({
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        const name = String(credentials?.name || "").trim();
        const email = String(credentials?.email || "").trim().toLowerCase();

        if (!name || !email) {
          return null;
        }

        const backendUser = await syncGuestUser({ name, email });

        return {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          image: backendUser.image,
          backendUserId: backendUser.id
        } as unknown as {
          id: string;
          name: string;
          email: string;
          image?: string;
          backendUserId: string;
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login"
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account }) {
      const provider = account?.provider;
      if (provider === "credentials") {
        return true;
      }

      if (provider !== "google" && provider !== "apple") {
        return false;
      }

      try {
        const backendUser = await syncSocialUser({
          provider,
          providerAccountId: account?.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image
        });

        (user as { backendUserId?: string }).backendUserId = backendUser.id;
        return true;
      } catch (error) {
        console.error("Failed to sync social user with backend", {
          provider,
          message: error instanceof Error ? error.message : "unknown error"
        });
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendUserId = (user as { backendUserId?: string }).backendUserId;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.backendUserId) {
        session.user.id = String(token.backendUserId);
      }

      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
