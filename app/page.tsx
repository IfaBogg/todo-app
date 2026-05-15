"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ClientSafeProvider } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleLogin = async (providerId: string, name: string) => {
    try {
      setLoadingProvider(providerId);
      toast.loading(`Signing in with ${name}...`);

      await signIn(providerId);

      toast.success("Redirecting...");
    } catch {
      toast.error("Login failed ❌");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center text-white">
        <h1 className="text-4xl font-bold">Welcome Back 👋</h1>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-[350px]">
          <>

            <h2 className="text-2xl font-semibold mb-6 text-center">
              Sign in to your account
            </h2>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-3 text-sm text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="space-y-3">
              {providers &&
                Object.values(providers).map((provider) => {
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

          </>
        </div>
      </div>
    </div >
  );
}