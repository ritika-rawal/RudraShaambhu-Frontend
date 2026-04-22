"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "apple" | "guest" | null>(null);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasApple, setHasApple] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestError, setGuestError] = useState<string | null>(null);
  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/rudraksha";
  const forceLogin = searchParams.get("forceLogin") === "1";

  const authErrorMessage = useMemo(() => {
    if (!authError) return null;
    if (authError === "OAuthAccountNotLinked") return "This email is already linked to another provider.";
    if (authError === "AccessDenied") return "Sign-in was denied. Please try again.";
    if (authError === "Configuration") return "Google/Apple login is not configured correctly.";
    if (authError === "OAuthSignin") return "Google sign-in failed. Check your OAuth credentials.";
    return "Unable to sign in right now. Please try again.";
  }, [authError]);

  useEffect(() => {
    let active = true;
    async function loadProviders() {
      setProvidersLoading(true);
      try {
        const providers = await getProviders();
        if (!active) return;
        setHasGoogle(Boolean(providers?.google));
        setHasApple(Boolean(providers?.apple));
      } finally {
        if (active) setProvidersLoading(false);
      }
    }
    loadProviders();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (status === "authenticated" && !forceLogin) {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, forceLogin, router]);

  async function handleLogin(provider: "google" | "apple") {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl });
    setLoadingProvider(null);
  }

  async function handleGuestLogin() {
    setGuestError(null);
    const name = guestName.trim();
    const email = guestEmail.trim().toLowerCase();
    if (!name || !email) { setGuestError("Please enter your name and email."); return; }
    const isEmail = /^\S+@\S+\.\S+$/.test(email);
    if (!isEmail) { setGuestError("Please enter a valid email."); return; }
    setLoadingProvider("guest");
    const response = await signIn("credentials", { callbackUrl, name, email });
    if (response?.error) { setGuestError("Guest sign-in failed. Please try again."); setLoadingProvider(null); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Login" />
      <main className="mx-auto flex max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-md rounded-3xl border border-[#FFD8A8] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#2C1810]">Sign in to Continue</h1>
          <p className="mt-2 text-sm text-[#4A3728]">Login to place orders, track purchases, and sync your cart securely.</p>

          {authErrorMessage && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">{authErrorMessage}</div>
          )}

          <div className="mt-8 space-y-3">
            <button type="button" onClick={() => handleLogin("google")}
              disabled={loadingProvider !== null || providersLoading || !hasGoogle}
              className="w-full rounded-xl bg-white border-2 border-[#8B4513] py-3 text-sm font-semibold text-[#8B4513] transition hover:bg-[#fff7eb] disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2">
              {loadingProvider === "google" ? "Signing in..." : "Continue with Google"}
            </button>
            <button type="button" onClick={() => handleLogin("apple")}
              disabled={loadingProvider !== null || providersLoading || !hasApple}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2">
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
            <div className="mt-3 space-y-2">
              <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Your name"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none focus:border-[#8B4513]" />
              <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="Your email" type="email"
                className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 text-sm outline-none focus:border-[#8B4513]" />
            </div>
            {guestError && <p className="mt-2 text-xs text-red-700">{guestError}</p>}
            <button type="button" onClick={handleGuestLogin} disabled={loadingProvider !== null}
              className="mt-3 w-full rounded-xl bg-[#8B4513] py-2 text-sm font-semibold text-white transition hover:bg-[#6B3410] disabled:cursor-not-allowed disabled:opacity-70">
              {loadingProvider === "guest" ? "Signing in..." : "Login"}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-[#4A3728]">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}