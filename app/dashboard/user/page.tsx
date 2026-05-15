import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions as any);
  if (!session) redirect("/auth/signin");

  // Example data (replace with real queries)
  const stats = { completed: 12, pending: 3, upcoming: 5 };
  const recent = [
    { title: "Created task: Buy groceries", time: "2h ago" },
    { title: "Completed: Finish report", time: "1d ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h3 className="text-2xl font-semibold">{session.user?.name}</h3>
            </div>
            <div>
              <Button>New Task</Button>
            </div>
          </div>
        </Card>

        <div className="flex-1 grid grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-slate-500">Completed</p>
            <h4 className="text-xl font-bold">{stats.completed}</h4>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Pending</p>
            <h4 className="text-xl font-bold">{stats.pending}</h4>
          </Card>
          <Card>
            <p className="text-sm text-slate-500">Upcoming</p>
            <h4 className="text-xl font-bold">{stats.upcoming}</h4>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h4 className="font-semibold mb-3">Recent Activity</h4>
          <ul className="space-y-2">
            {recent.map((r, i) => (
              <li key={i} className="text-sm text-slate-700 dark:text-slate-200">{r.title} <span className="text-xs text-slate-400">— {r.time}</span></li>
            ))}
          </ul>
        </Card>

        <Card>
          <h4 className="font-semibold mb-3">Tasks Overview</h4>
          <p className="text-sm text-slate-500">A progress chart would live here.</p>
        </Card>
      </div>

      <Card>
        <h4 className="font-semibold mb-3">All Tasks</h4>
        <Table columns={["Name", "Status", "Due"]} data={[{ name: "Buy groceries", status: "Pending", due: "Tomorrow" }]} />
      </Card>
    </div>
  );
}
