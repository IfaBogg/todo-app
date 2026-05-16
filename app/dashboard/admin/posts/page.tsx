"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { useSession } from "next-auth/react";

export default function PostsPage() {
    const { data: session } = useSession();
    const [posts] = useState([
        { id: 1, title: "Welcome to the app", author: "Admin", status: "Published", date: "2 days ago" },
        { id: 2, title: "Feature announcement", author: "Admin", status: "Draft", date: "1 day ago" },
    ]);

    if (!session || session.user?.role !== "ADMIN") {
        return <p className="text-sm text-slate-500">Access denied.</p>;
    }

    return (
        <div className="space-y-4">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Content Management</h3>
                    <Button>New Post</Button>
                </div>

                {posts.length === 0 ? (
                    <p className="text-sm text-slate-500">No posts found.</p>
                ) : (
                    <Table
                        columns={["Title", "Author", "Status", "Date"]}
                        data={posts.map((p) => ({
                            title: p.title,
                            author: p.author,
                            status: p.status,
                            date: p.date,
                        }))}
                    />
                )}
            </Card>
        </div>
    );
}
