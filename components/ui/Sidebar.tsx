"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

type Item = { href: string; label: string; icon?: React.ReactNode };

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [collapsed, setCollapsed] = useState(false);

    const userItems: Item[] = [
        { href: "/dashboard/user", label: "Dashboard" },
        { href: "/dashboard/user/todos", label: "My Tasks" },
        { href: "/dashboard/user/profile", label: "Profile" },
        { href: "/dashboard/user/notifications", label: "Notifications" },
        { href: "/dashboard/user/settings", label: "Settings" },
    ];

    const adminItems: Item[] = [
        { href: "/dashboard/admin", label: "Dashboard" },
        { href: "/dashboard/admin/users", label: "Users" },
        { href: "/dashboard/admin/posts", label: "Content" },
        { href: "/dashboard/admin/reports", label: "Reports" },
        { href: "/dashboard/admin/settings", label: "Settings" },
    ];

    const role = (session?.user as any)?.role || "USER";
    const items = role === "ADMIN" ? adminItems : userItems;

    return (
        <aside
            className={`bg-white dark:bg-slate-900 border-r dark:border-slate-800 ${collapsed ? "w-20" : "w-64"
                } flex flex-col transition-all`}
        >
            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
                <Link href="/">
                    <span className="font-semibold text-lg text-slate-900 dark:text-white">
                        MyApp
                    </span>
                </Link>
                <button
                    onClick={() => setCollapsed((s) => !s)}
                    className="text-slate-500 dark:text-slate-300"
                >
                    {collapsed ? "→" : "←"}
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-auto">
                {items.map((it) => {
                    const active = pathname?.startsWith(it.href);
                    return (
                        <Link
                            key={it.href}
                            href={it.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${active
                                    ? "bg-slate-100 dark:bg-slate-800 font-medium"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                        >
                            <span className="w-6 h-6 flex items-center justify-center text-slate-500">
                                ■
                            </span>
                            {!collapsed && <span>{it.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t dark:border-slate-800 space-y-2">
                {!collapsed && session && (
                    <>
                        <p className="text-xs text-slate-500 truncate">
                            {session.user?.email}
                        </p>
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
