"use client";

import React from "react";

export default function Button({ children, variant = "primary", onClick, className = "", ...props }: any) {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-1";
  const styles: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-50 dark:text-slate-300",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[variant] || styles.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
