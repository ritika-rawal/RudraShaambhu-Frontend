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
  const callbackUrl = searchParams.get("callbackUrl") || "/rudraksha";

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
      return "Google/Apple login is not configured correctly. Please add OAuth values in .env.local and restart the frontend.";
    }

    if (authError === "OAuthSignin") {
      return "Google sign-in failed. Make sure you have the correct OAuth credentials.";
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
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {authErrorMessage}
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null || providersLoading || !hasGoogle}
              className="w-full rounded-xl bg-white border-2 border-[#8B4513] py-3 text-sm font-semibold text-[#8B4513] transition hover:bg-[#fff7eb] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loadingProvider === "google" ? "Signing in..." : "Continue with Google"}
            </button>

            <button
              type="button"
              onClick={() => handleLogin("apple")}
              disabled={loadingProvider !== null || providersLoading || !hasApple}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 2.18-2.14 4.07-3.81 5.35-1.31 1.01-2.44 1.54-3.5 1.54-1.79 0-3.23-.46-4.35-1.4-1.12-.93-1.68-2.16-1.68-3.7 0-1.8.64-3.43 1.92-4.87.99-1.08 2.09-1.63 3.3-1.63 1.15 0 2.14.42 2.89 1.25 1.39-1.73 2.25-2.6 3.58-3.75 1.17-1 2.03-1.51 3.58-2.05v.17c0 2.15-.85 3.92-2.55 5.26-.21.17-.31.42-.31.66 0 .26.11.51.35.7 2.08 1.83 3.14 3.78 3.14 5.87 0 2.11-.72 3.79-2.16 5.04-.62.53-1.43.8-2.45.8-1.26 0-2.43-.42-3.46-1.25-.83-.68-1.59-1.58-2.25-2.68-.34-.57-.69-1.19-1.02-1.82-.36.65-.68 1.27-1.02 1.84-.66 1.1-1.42 2-2.25 2.68-1.03.83-2.2 1.25-3.46 1.25-1.02 0-1.83-.27-2.45-.8-1.44-1.25-2.16-2.93-2.16-5.04 0-2.09 1.06-4.04 3.14-5.87.24-.19.35-.44.35-.7 0-.24-.1-.49-.31-.66-1.7-1.34-2.55-3.11-2.55-5.26v-.17c1.55.54 2.41 1.05 3.58 2.05 1.33 1.15 2.19 2.02 3.58 3.75.75-.83 1.74-1.25 2.89-1.25 1.21 0 2.31.55 3.3 1.63 1.28 1.44 1.92 3.07 1.92 4.87"/>
              </svg>
              {loadingProvider === "apple" ? "Signing in..." : "Continue with Apple"}
            </button>
          </div>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-[#FFD8A8]"></div>
            <span className="px-3 text-xs text-[#4A3728]">OR</span>
            <div className="flex-1 border-t border-[#FFD8A8]"></div>
          </div>

          <div className="mt-6 rounded-xl border border-[#FFD8A8] bg-[#fff7eb] p-4">
            <p className="text-base font-bold text-[#2C1810]">Login to Your Account</p>
            <p className="mt-1 text-xs text-[#4A3728]">
              Enter your name and email to access your account.
            </p>

            <div className="mt-3 space-y-2">
              <input
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none focus:border-[#8B4513] focus:ring-1 focus:ring-[#FFD8A8]"
              />
              <input
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="Your email"
                type="email"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none focus:border-[#8B4513] focus:ring-1 focus:ring-[#FFD8A8]"
              />
            </div>

            {guestError && (
              <p className="mt-2 text-xs text-red-700">{guestError}</p>
            )}

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loadingProvider !== null}
              className="mt-3 w-full rounded-xl bg-[#8B4513] py-2 text-sm font-semibold text-white transition hover:bg-[#6B3410] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingProvider === "guest" ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-[#4A3728]">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
