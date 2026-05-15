/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions as any);
    if (!session) redirect("/auth/signin");

    // Example analytics
    const stats = { users: 124, active: 87, posts: 412 };
    const recentUsers = [
        { name: "Alice", email: "alice@example.com", role: "USER" },
        { name: "Bob", email: "bob@example.com", role: "ADMIN" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-sm text-slate-500">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats.users}</h3>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500">Active Users</p>
                    <h3 className="text-2xl font-bold">{stats.active}</h3>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500">Posts</p>
                    <h3 className="text-2xl font-bold">{stats.posts}</h3>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                    <h4 className="font-semibold mb-3">Recent Users</h4>
                    <Table columns={["Name", "Email", "Role"]} data={recentUsers.map((u) => ({ name: u.name, email: u.email, role: u.role }))} />
                </Card>

                <Card>
                    <h4 className="font-semibold mb-3">System Status</h4>
                    <ul className="text-sm text-slate-700 dark:text-slate-200 space-y-2">
                        <li>Database: <span className="font-medium">Connected</span></li>
                        <li>Background jobs: <span className="font-medium">Healthy</span></li>
                        <li>Queue length: <span className="font-medium">0</span></li>
                    </ul>
                </Card>
            </div>
        </div>
    );
}
