"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClientSafeProvider } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loadingCredentials, setLoadingCredentials] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });

    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    useEffect(() => {
        if (error) {
            const errorMessages: Record<string, string> = {
                OAuthAccountNotLinked: "Account exists. Try another login method.",
                CredentialsSignin: "Invalid email or password.",
            };
            toast.error(errorMessages[error] || "Authentication error");
        }
    }, [error]);

    const validateEmail = (value: string) => {
        if (!value) return "Email is required.";
        if (!emailRegex.test(value)) return "Enter a valid email address.";
        return "";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Password is required.";
        if (value.length < 6) return "Password must be at least 6 characters.";
        return "";
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    };

    const handleBlur = (field: "email" | "password") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleLogin = async (providerId: string, name: string) => {
        try {
            setLoadingProvider(providerId);
            toast.loading(`Signing in with ${name}...`, { id: "oauth-login" });

            await signIn(providerId, {
                callbackUrl: "/dashboard",
            });
        } catch {
            toast.error("Login failed ❌", { id: "oauth-login" });
            setLoadingProvider(null);
        }
    };

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setErrors({ email: emailError, password: passwordError });
        setTouched({ email: true, password: true });

        if (emailError || passwordError) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        try {
            setLoadingCredentials(true);

            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error("Invalid email or password");
                setLoadingCredentials(false);
                return;
            }

            toast.success("Welcome back 🎉");
            window.location.href = "/dashboard";
        } catch {
            toast.error("Something went wrong");
            setLoadingCredentials(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white">
                <div className="space-y-4 p-10">
                    <h1 className="text-5xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="max-w-md text-lg text-blue-100">
                        Secure login with polished animation, inline validation, and a fast recovery flow.
                    </p>
                </div>
            </div>

            <div className="flex w-full md:w-1/2 items-center justify-center py-12 px-6">
                <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_50px_-20px_rgba(59,130,246,0.35)]">

                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Sign in to your account
                    </h2>

                    {/* ✅ Email Login */}
                    <form onSubmit={handleCredentialsLogin} className="space-y-5">
                        <div>
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className={`mt-2 w-full rounded-2xl border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                    touched.email && errors.email
                                        ? "border-red-300 bg-red-50"
                                        : touched.email
                                        ? "border-green-300 bg-emerald-50"
                                        : "border-slate-200 bg-white"
                                }`}
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                onBlur={() => handleBlur("email")}
                            />
                            {touched.email && (
                                <p className={`mt-2 text-sm ${errors.email ? "text-red-600" : "text-emerald-600"}`}>
                                    {errors.email || "Looks good!"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`w-full rounded-2xl border px-4 py-3 pr-12 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                        touched.password && errors.password
                                            ? "border-red-300 bg-red-50"
                                            : touched.password
                                            ? "border-green-300 bg-emerald-50"
                                            : "border-slate-200 bg-white"
                                    }`}
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                    onBlur={() => handleBlur("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:text-slate-900"
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                            {touched.password && (
                                <p className={`mt-2 text-sm ${errors.password ? "text-red-600" : "text-emerald-600"}`}>
                                    {errors.password || "Ready to go!"}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-slate-500">
                            <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </Link>
                            <Link href="/auth/register" className="text-slate-500 hover:text-slate-700">
                                Create account
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingCredentials}
                            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingCredentials ? "Signing in..." : "Sign in with Email"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-5">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="mx-3 text-sm text-gray-500">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        {providers &&
                            Object.values(providers)
                                .filter((p) => p.id !== "credentials") // ✅ hide credentials here
                                .map((provider) => {
                                    const isGoogle = provider.id === "google";
                                    const isGithub = provider.id === "github";

                                    return (
                                        <button
                                            key={provider.id}
                                            onClick={() => handleLogin(provider.id, provider.name)}
                                            className={`w-full flex items-center justify-center gap-3 py-2 rounded-lg transition font-medium shadow-sm
                                            ${isGoogle
                                                    ? "bg-white border border-gray-300 hover:bg-gray-100"
                                                    : "bg-black text-white hover:bg-gray-800"
                                                }`}
                                        >
                                            {loadingProvider === provider.id ? (
                                                <span
                                                    className={`animate-spin h-5 w-5 border-2 ${isGoogle
                                                        ? "border-gray-400 border-t-transparent"
                                                        : "border-white border-t-transparent"
                                                        } rounded-full`}
                                                ></span>
                                            ) : (
                                                <>
                                                    {isGoogle && <FcGoogle size={20} />}
                                                    {isGithub && <FaGithub size={20} />}
                                                    Continue with {provider.name}
                                                </>
                                            )}
                                        </button>
                                    );
                                })}
                    </div>

                    {/* Register Link */}
                    <p className="text-sm text-center mt-5">
                        Don’t have an account?{" "}
                        <a href="/auth/register" className="text-blue-500 hover:underline">
                            Register
                        </a>
                    </p>

                </div>
            </div>
        </div>
    );
}