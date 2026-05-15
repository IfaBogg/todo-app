"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function NotificationsPageClient() {
    const { data: session } = useSession();
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;
        setLoading(true);
        fetch("/api/notifications").then((r) => r.json()).then((d) => { setNotifs(d.notifications || []); setLoading(false); });
    }, [session]);

    if (!session) return <p className="text-sm text-slate-500">Please sign in to view notifications.</p>;

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button onClick={() => { setNotifs([]); }}>Mark all read</Button>
                </div>

                <div className="mt-4 space-y-3">
                    {loading ? <p>Loading...</p> : (
                        notifs.length === 0 ? <p className="text-sm text-slate-500">No notifications</p> : (
                            <ul className="space-y-2">
                                {notifs.map((n) => (
                                    <li key={n.id} className="border rounded p-3">
                                        <div className="font-medium">{n.title}</div>
                                        <div className="text-sm text-slate-500">{n.body}</div>
                                        <div className="text-xs text-slate-400">{n.time}</div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>
            </Card>
        </div>
    );
}

