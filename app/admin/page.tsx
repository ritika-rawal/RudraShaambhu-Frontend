"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/admin-dashboard";

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleAdminLogin() {
		setError(null);

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPassword = password.trim();

		if (!normalizedEmail || !normalizedPassword) {
			setError("Please enter admin email and password.");
			return;
		}

		if (normalizedEmail !== ADMIN_EMAIL || normalizedPassword !== ADMIN_PASSWORD) {
			setError("Invalid admin credentials.");
			return;
		}

		setLoading(true);
		const response = await signIn("credentials", {
			redirect: false,
			name: "Admin",
			email: normalizedEmail
		});

		if (response?.error) {
			setError("Failed to sign in. Please try again.");
			setLoading(false);
			return;
		}

		router.push(callbackUrl);
		setLoading(false);
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#3a2418,#1b0f09_58%)]">
			<Header showBack title="Admin Login" backHref="/landing" />

			<main className="mx-auto flex max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
				<section className="mx-auto w-full max-w-md rounded-3xl border border-[#6B4F3A] bg-[#24150f] p-8 shadow-2xl">
					<p className="inline-flex rounded-full border border-[#6B4F3A] bg-[#2f1d15] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#D7B89A]">
						Admin Access Only
					</p>

					<h1 className="mt-4 text-3xl font-bold text-white">Administrator Login</h1>
					<p className="mt-2 text-sm text-[#C3AB98]">
						This page is separate from user login and only for admin access.
					</p>

					{error && (
						<div className="mt-4 rounded-lg border border-[#6B2E2E] bg-[#3A1F1F] px-4 py-3 text-sm text-[#F8B4B4]">
							{error}
						</div>
					)}

					<div className="mt-6 space-y-3">
						<input
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="Admin email"
							type="email"
							className="w-full rounded-lg border border-[#6B4F3A] bg-[#3A2418] px-3 py-2 text-sm text-white placeholder:text-[#A88A74] outline-none focus:border-[#D7B89A]"
						/>
						<input
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							placeholder="Admin password"
							type="password"
							className="w-full rounded-lg border border-[#6B4F3A] bg-[#3A2418] px-3 py-2 text-sm text-white placeholder:text-[#A88A74] outline-none focus:border-[#D7B89A]"
						/>
					</div>

					<button
						type="button"
						onClick={handleAdminLogin}
						disabled={loading}
						className="mt-4 w-full rounded-xl bg-[#D7B89A] py-2 text-sm font-semibold text-[#2C1810] transition hover:bg-[#E8CFB8] disabled:cursor-not-allowed disabled:opacity-70"
					>
						{loading ? "Signing in..." : "Login as Admin"}
					</button>

					<p className="mt-4 text-center text-xs text-[#A88A74]">Only admin users can access the dashboard.</p>
				</section>
			</main>

			<Footer variant="simple" />
		</div>
	);
}
