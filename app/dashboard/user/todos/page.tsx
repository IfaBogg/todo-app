import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardClient = dynamic(() => import("@/app/dashboard/DashboardClient"), { ssr: false });

export default async function TodosPage() {
    const session: any = await getServerSession(authOptions as any);
    if (!session) redirect("/auth/signin");

    return (
        <div className="space-y-4">
            <DashboardClient />
        </div>
    );
}
