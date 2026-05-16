"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { useSession } from "next-auth/react";

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session || session.user?.role !== "ADMIN") return;
        setLoading(true);
        fetch("/api/admin/users")
            .then((r) => r.json())
            .then((d) => {
                setUsers(d.users || []);
            })
            .finally(() => setLoading(false));
    }, [session?.user?.role]);

    if (!session || session.user?.role !== "ADMIN") {
        return <p className="text-sm text-slate-500">Access denied.</p>;
    }

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Users Management</h3>
                    <Button>Add User</Button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p className="text-sm text-slate-500">No users found.</p>
                ) : (
                    <Table
                        columns={["Name", "Email", "Role", "Status"]}
                        data={users.map((u) => ({
                            name: u.name || "N/A",
                            email: u.email,
                            role: u.role,
                            status: u.emailVerified ? "Verified" : "Pending",
                        }))}
                    />
                )}
            </Card>
        </div>
    );
}
