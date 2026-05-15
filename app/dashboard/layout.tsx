"use client";

import Sidebar from "@/components/ui/Sidebar";
import Navbar from "@/components/ui/Navbar";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}