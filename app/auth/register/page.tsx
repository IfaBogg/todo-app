"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateField = (name: string, value: string) => {
        if (name === "name") {
            return value.trim() ? "" : "Full name is required.";
        }

        if (name === "email") {
            if (!value) return "Email is required.";
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Enter a valid email address.";
        }

        if (name === "password") {
            if (!value) return "Password is required.";
            return value.length < 6 ? "Password must be at least 6 characters." : "";
        }

        if (name === "confirmPassword") {
            if (!value) return "Confirm your password.";
            return value !== formData.password ? "Passwords must match." : "";
        }

        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: validateField(name, value),
        });

        if (name === "password" && formData.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField("confirmPassword", formData.confirmPassword),
            }));
        }
    };

    const handleBlur = (name: keyof typeof touched) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, formData[name]) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors = {
            name: validateField("name", formData.name),
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
            confirmPassword: validateField("confirmPassword", formData.confirmPassword),
        };

        setErrors(nextErrors);
        setTouched({ name: true, email: true, password: true, confirmPassword: true });

        if (Object.values(nextErrors).some(Boolean)) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created successfully! Please sign in.");
                router.push("/auth/signin");
            } else {
                toast.error(data.error || "Registration failed");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT */}
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-500 to-blue-600 items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Join Us Today! 🚀</h1>
            </div>

            {/* RIGHT */}
            <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Create your account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={() => handleBlur("name")}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    touched.name && errors.name ? "border-red-300 bg-red-50" : touched.name ? "border-green-300 bg-emerald-50" : "border-gray-300"
                                }`}
                                placeholder="Enter your full name"
                            />
                            {touched.name && errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur("email")}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    touched.email && errors.email ? "border-red-300 bg-red-50" : touched.email ? "border-green-300 bg-emerald-50" : "border-gray-300"
                                }`}
                                placeholder="Enter your email"
                            />
                            {touched.email && errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={() => handleBlur("password")}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    touched.password && errors.password ? "border-red-300 bg-red-50" : touched.password ? "border-green-300 bg-emerald-50" : "border-gray-300"
                                }`}
                                placeholder="Enter your password"
                            />
                            {touched.password && errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={() => handleBlur("confirmPassword")}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    touched.confirmPassword && errors.confirmPassword
                                        ? "border-red-300 bg-red-50"
                                        : touched.confirmPassword
                                        ? "border-green-300 bg-emerald-50"
                                        : "border-gray-300"
                                }`}
                                placeholder="Confirm your password"
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/auth/signin" className="text-blue-500 hover:text-blue-600 font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}