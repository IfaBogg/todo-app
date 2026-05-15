"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const stored = localStorage.getItem("theme");
    if (stored) {
      root.classList.toggle("dark", stored === "dark");
      setIsDark(stored === "dark");
    } else {
      const prefers = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefers);
      setIsDark(prefers);
    }
  }, []);

  const toggle = () => {
    const root = window.document.documentElement;
    root.classList.toggle("dark");
    const now = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", now);
    setIsDark(now === "dark");
  };

  return (
    <button aria-label="Toggle theme" onClick={toggle} className="p-2 rounded-md bg-slate-100 dark:bg-slate-800">
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
