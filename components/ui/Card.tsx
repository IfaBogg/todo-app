import React from "react";

export default function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}
