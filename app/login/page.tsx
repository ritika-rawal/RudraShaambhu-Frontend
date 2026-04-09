"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | "guest" | null>(null);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasApple, setHasApple] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestError, setGuestError] = useState<string | null>(null);
 const authError = searchParams.get("error");

  const authErrorMessage = useMemo(() => {
    if (!authError) {
      return null;
    }

    if (authError === "OAuthAccountNotLinked") {
      return "This email is already linked to another provider. Please sign in with the original provider.";
    }

    if (authError === "AccessDenied") {
      return "Sign-in was denied. Please try again.";
    }

    if (authError === "Configuration") {
      return "Google/Apple login is not configured correctly. Please check OAuth environment variables.";
    }

    if (authError === "OAuthSignin") {
      return "Google sign-in failed because OAuth client is invalid or missing. Please check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.";
    }

    return "Unable to sign in right now. Please try again.";
  }, [authError]);

  useEffect(() => {
    let active = true;

    async function loadProviders() {
      setProvidersLoading(true);
      try {
        const providers = await getProviders();
        if (!active) {
          return;
        }

        setHasGoogle(Boolean(providers?.google));
        setHasApple(Boolean(providers?.apple));
      } finally {
        if (active) {
          setProvidersLoading(false);
        }
      }
    }

    loadProviders();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(provider: "google" | "apple") {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl });
    setLoadingProvider(null);
  }

  async function handleGuestLogin() {
    setGuestError(null);

    const name = guestName.trim();
    const email = guestEmail.trim().toLowerCase();

    if (!name || !email) {
      setGuestError("Please enter your name and email.");
      return;
    }

    const isEmail = /^\S+@\S+\.\S+$/.test(email);
    if (!isEmail) {
      setGuestError("Please enter a valid email.");
      return;
    }

    setLoadingProvider("guest");
    const response = await signIn("credentials", {
      redirect: false,
      name,
      email
    });

    if (response?.error) {
      setGuestError("Guest sign-in failed. Please try again.");
      setLoadingProvider(null);
      return;
    }

    router.push(callbackUrl);
    setLoadingProvider(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Login" />
      <main className="mx-auto flex max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-3xl border border-[#FFD8A8] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#2C1810]">Sign in to Continue</h1>
          <p className="mt-2 text-sm text-[#4A3728]">
            Login to place orders, track purchases, and sync your cart securely.
          </p>

          {authErrorMessage && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{authErrorMessage}</p>
          )}
          {!providersLoading && !hasGoogle && !hasApple && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Google/Apple login is not configured yet. Add OAuth values in .env.local and restart the frontend.
            </p>
          )}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null || providersLoading || !hasGoogle}
              className="w-full rounded-xl bg-[#8B4513] py-3 text-sm font-semibold text-white"
            >
              {providersLoading
                ? "Loading Google..."
                : !hasGoogle
                  ? "Google not configured"
                  : loadingProvider === "google"
                    ? "Connecting Google..."
                    : "Continue with Google"}
            </button>
            <button
              type="button"
              onClick={() => handleLogin("apple")}
              disabled={loadingProvider !== null || providersLoading || !hasApple}
              className="w-full rounded-xl border border-[#8B4513] py-3 text-sm font-semibold text-[#8B4513]"
            >
              {providersLoading
                ? "Loading Apple..."
                : !hasApple
                  ? "Apple not configured"
                  : loadingProvider === "apple"
                    ? "Connecting Apple..."
                    : "Continue with Apple"}
            </button>
          </div>

          <div className="mt-6 rounded-xl border border-[#FFD8A8] bg-[#fff7eb] p-4">
            <p className="text-sm font-semibold text-[#2C1810]">Continue as Guest</p>
            <p className="mt-1 text-xs text-[#4A3728]">
              Use this if Google/Apple OAuth is not configured yet.
            </p>

            <div className="mt-3 space-y-2">
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Full name"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none"
              />
              <input
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none"
              />
            </div>

            {guestError && (
              <p className="mt-2 text-xs text-red-700">{guestError}</p>
            )}

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loadingProvider !== null}
              className="mt-3 w-full rounded-xl bg-[#8B4513] py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingProvider !== null ? "Signing in..." : "Continue as Guest"}
            </button>
          </div>
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
