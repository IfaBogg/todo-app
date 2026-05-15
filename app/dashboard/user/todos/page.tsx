import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/app/dashboard/DashboardClient";

export default async function TodosPage() {
    const session: any = await getServerSession(authOptions as any);
    if (!session) redirect("/auth/signin");

    return (
        <div className="space-y-4">
            <DashboardClient />
        </div>
    );
}
