import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient"; // we will move your UI
import RoleBadge from "@/components/RoleBadge";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // 🔐 PROTECT ROUTE
    if (!session) {
        redirect("/auth/signin");
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">
                Welcome, {session?.user?.name}
                <RoleBadge role={session?.user?.role as "USER" | "ADMIN"} />
            </h1>
            <DashboardClient />
        </div>
    );
}

