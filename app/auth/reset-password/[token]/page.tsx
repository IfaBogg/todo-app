"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPasswordPage() {
  const params = useParams();
  const token = String(params.token || "");
  const router = useRouter();

  const [status, setStatus] = useState<{ valid: boolean; message: string }>({ valid: false, message: "Verifying reset link..." });
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus({ valid: false, message: "Missing reset token." });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/reset-password?token=${token}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setStatus({ valid: false, message: data.error || "Invalid or expired link." });
        } else {
          setStatus({ valid: true, message: "Enter a new password to continue." });
        }
      } catch {
        setStatus({ valid: false, message: "Unable to verify token." });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to reset password.");
      } else {
        toast.success(data.message || "Password updated successfully.");
        router.push("/auth/signin");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-cyan-600 to-slate-700 items-center justify-center text-white">
        <div className="space-y-4 p-10">
          <h1 className="text-5xl font-bold tracking-tight">Reset Password</h1>
          <p className="max-w-md text-lg text-cyan-100">Securely update your password and get back into your account.</p>
        </div>
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center py-12 px-6">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_50px_-20px_rgba(6,182,212,0.2)]">
          <h2 className="text-3xl font-semibold mb-4 text-slate-900 text-center">Reset password</h2>
          <p className="text-center text-sm text-slate-500 mb-8">{status.message}</p>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-600">Verifying your reset link…</div>
          ) : status.valid ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">New password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:text-slate-900"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm password</label>
                <div className="relative mt-2">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:text-slate-900"
                  >
                    {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {formError && <p className="rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Saving new password..." : "Save new password"}
              </button>
            </form>
          ) : (
            <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 text-center">
              {status.message}
              <div className="mt-4">
                <Link href="/auth/forgot-password" className="font-semibold text-cyan-600 hover:text-cyan-700">
                  Request a new reset link
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/auth/signin" className="font-medium text-cyan-600 hover:text-cyan-700">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
