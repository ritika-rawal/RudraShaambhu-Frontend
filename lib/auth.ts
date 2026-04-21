import type { NextAuthOptions } from "next-auth";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL =
  process.env.BACKEND_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://rudrashaambhu-backend-1.onrender.com/api";

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

/**
 * Sync social login user with backend
 * Creates or updates user in MongoDB and returns JWT tokens
 */
async function syncSocialUser(params: {
  provider: "google" | "apple";
  name?: string | null;
  email?: string | null;
  image?: string | null;
  idToken?: string;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/${params.provider}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: params.name || "User",
        email: params.email,
        image: params.image || "",
        idToken: params.idToken
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Auth sync failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Store JWT tokens in session/local storage for API requests
    if (data.accessToken) {
      // Store in session (cleared on browser close)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken || "");
      }
    }

    return {
      id: data.user?.id || data.user?.email,
      name: data.user?.name || "User",
      email: data.user?.email,
      image: data.user?.image,
      provider: params.provider,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error(`${params.provider} sync error:`, error);
    throw error;
  }
}

/**
 * Sync guest user with backend
 */
async function syncGuestUser(params: { name: string; email: string }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/guest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: params.name,
        email: params.email
      })
    });

    if (!response.ok) {
      throw new Error(`Guest auth failed with status ${response.status}`);
    }

    const data = await response.json();

    // Store tokens
    if (data.accessToken && typeof window !== "undefined") {
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken || "");
    }

    return {
      id: data.user?.id || data.user?.email,
      name: data.user?.name,
      email: data.user?.email,
      image: data.user?.image || "",
      provider: "credentials",
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    };
  } catch (error) {
    console.error("Guest auth error:", error);
    throw error;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGoogleProvider
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true
          })
        ]
      : []),
    ...(hasAppleProvider
      ? [
          AppleProvider({
            clientId: appleClientId,
            clientSecret: appleClientSecret,
            allowDangerousEmailAccountLinking: true
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
          accessToken: backendUser.accessToken,
          refreshToken: backendUser.refreshToken
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
    async signIn({ user, account, profile }) {
      try {
        const provider = account?.provider;
        
        // Credentials provider (guest login)
        if (provider === "credentials") {
          return true;
        }

        // OAuth providers
        if (provider !== "google" && provider !== "apple") {
          return false;
        }

        // Sync user with backend
        const backendUser = await syncSocialUser({
          provider: provider as "google" | "apple",
          name: user.name,
          email: user.email,
          image: user.image,
          idToken: account?.id_token
        });

        // Store tokens in user object for jwt callback
        (user as any).accessToken = backendUser.accessToken;
        (user as any).refreshToken = backendUser.refreshToken;

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.provider = account?.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).refreshToken = token.refreshToken;
        (session.user as any).provider = token.provider;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET
};
