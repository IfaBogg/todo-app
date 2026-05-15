"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession, signOut } from "next-auth/react";

export default function SettingsPageClient() {
    const { data: session } = useSession();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        setLoading(true);
        const res = await fetch("/api/user/password", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
        setLoading(false);
        if (res.ok) {
            alert("Password updated. Please sign in again.");
            signOut();
        } else {
            const data = await res.json();
            alert(data?.error || "Failed to update password");
        }
    };

    if (!session) return <p className="text-sm text-slate-500">Please sign in to access settings.</p>;

    return (
        <div className="space-y-4 max-w-xl">
            <Card>
                <h3 className="text-lg font-semibold">Settings</h3>
                <div className="mt-4 space-y-3">
                    <div>
                        <div className="text-sm text-slate-600">Theme</div>
                        <div className="mt-2 flex gap-2">
                            <Button onClick={() => { document.documentElement.classList.remove("dark"); localStorage.setItem("theme","light"); }}>Light</Button>
                            <Button onClick={() => { document.documentElement.classList.add("dark"); localStorage.setItem("theme","dark"); }}>Dark</Button>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="text-sm text-slate-600">Change Password</div>
                        <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" />
                        <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-2 w-full border rounded px-3 py-2" />
                        <div className="mt-2">
                            <Button onClick={changePassword} variant="primary">{loading ? "Updating..." : "Update Password"}</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

