import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RoleBadge from "@/components/RoleBadge";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    // 🔥 ROLE CHECK (case-insensitive)
    if (session.user.role?.toUpperCase() !== "ADMIN") {
        redirect("/dashboard"); // or show 403
    }


    return (
        <div>
            <h1>Admin Panel 🔐</h1>
            <td>
                <RoleBadge role={session.user.role} />
            </td>
        </div>
    );
}