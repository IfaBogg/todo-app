"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to send reset link.");
      } else {
        toast.success(data.message || "Reset instructions sent.");
        setSent(true);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-sky-600 items-center justify-center text-white">
        <div className="space-y-4 p-10">
          <h1 className="text-5xl font-bold tracking-tight">Forgot password?</h1>
          <p className="max-w-md text-lg text-sky-100">
            Enter your email and we’ll send a secure reset link with easy next steps.
          </p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center py-12 px-6">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_50px_-20px_rgba(14,165,233,0.25)]">
          <h2 className="text-3xl font-semibold mb-4 text-slate-900 text-center">Reset your password</h2>
          <p className="text-center text-sm text-slate-500 mb-8">
            We’ll send a password reset link if that account exists.
          </p>

          {sent ? (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-700">
              Check your inbox. If you do not receive an email, try again in a few minutes.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
                  }`}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/auth/signin" className="font-medium text-sky-600 hover:text-sky-700">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
