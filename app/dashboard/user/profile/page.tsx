import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Card from "@/components/ui/Card";

export default async function ProfilePage() {
  const session: any = await getServerSession(authOptions as any);
  if (!session) redirect("/auth/signin");

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-lg font-semibold">Profile</h3>
        <p className="text-sm text-slate-500 mt-2">Update your profile details and preferences.</p>
      </Card>
    </div>
  );
}
