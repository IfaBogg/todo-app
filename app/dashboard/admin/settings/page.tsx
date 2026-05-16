"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { data: session } = useSession();

    if (!session || session.user?.role !== "ADMIN") {
        return <p className="text-sm text-slate-500">Access denied.</p>;
    }

    return (
        <div className="space-y-4 max-w-2xl">
            <Card>
                <h3 className="text-lg font-semibold">Admin Settings</h3>

                <div className="mt-4 space-y-4">
                    <div className="border-b pb-4">
                        <h4 className="font-medium">System Settings</h4>
                        <p className="text-sm text-slate-500 mt-1">Configure application-wide settings.</p>
                        <Button className="mt-2">Edit System Settings</Button>
                    </div>

                    <div className="border-b pb-4">
                        <h4 className="font-medium">Email Templates</h4>
                        <p className="text-sm text-slate-500 mt-1">Manage email notifications and templates.</p>
                        <Button className="mt-2">Manage Templates</Button>
                    </div>

                    <div className="pb-4">
                        <h4 className="font-medium">Audit Logs</h4>
                        <p className="text-sm text-slate-500 mt-1">View system and user activity logs.</p>
                        <Button className="mt-2">View Audit Logs</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
