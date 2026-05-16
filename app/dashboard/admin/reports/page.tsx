"use client";

import Card from "@/components/ui/Card";
import { useSession } from "next-auth/react";

export default function ReportsPage() {
    const { data: session } = useSession();

    if (!session || session.user?.role !== "ADMIN") {
        return <p className="text-sm text-slate-500">Access denied.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-sm text-slate-500">Total Signups (30d)</p>
                    <h3 className="text-2xl font-bold">248</h3>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500">Active Users (30d)</p>
                    <h3 className="text-2xl font-bold">187</h3>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500">Tasks Completed (30d)</p>
                    <h3 className="text-2xl font-bold">1,245</h3>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold">Activity Summary</h3>
                <p className="text-sm text-slate-500 mt-2">Detailed analytics and reporting coming soon.</p>
            </Card>
        </div>
    );
}
