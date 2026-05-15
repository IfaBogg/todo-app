"use client";

import ThemeToggle from "./ThemeToggle";
import React from "react";

export default function Navbar({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <header className="flex items-center justify-between p-4 bg-transparent border-b dark:border-slate-800">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title || "Dashboard"}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </header>
  );
}
