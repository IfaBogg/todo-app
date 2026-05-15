"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function ProfilePageClient() {
    const { data: session } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(session?.user?.name || "");
        setEmail(session?.user?.email || "");
    }, [session]);

    const save = async () => {
        setLoading(true);
        const res = await fetch("/api/user/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });
        setLoading(false);
        if (res.ok) {
            router.refresh();
            alert("Profile updated");
        } else {
            const data = await res.json();
            alert(data?.error || "Failed to update profile");
        }
    };

    return (
        <div className="space-y-4 max-w-xl">
            <Card>
                <h3 className="text-lg font-semibold">Profile</h3>
                <div className="mt-4 space-y-3">
                    <label className="block">
                        <div className="text-sm text-slate-600">Name</div>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </label>

                    <label className="block">
                        <div className="text-sm text-slate-600">Email</div>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
                    </label>

                    <div className="flex gap-2">
                        <Button onClick={save} variant="primary">{loading ? "Saving..." : "Save"}</Button>
                        <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

