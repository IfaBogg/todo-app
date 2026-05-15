import { NextResponse } from "next/server";

export async function GET() {
  // Example notifications — replace with real data source as needed
  const notifs = [
    { id: 1, title: "Welcome to Todo App", body: "Thanks for signing up!", time: "2 days ago" },
    { id: 2, title: "Task overdue", body: "Your task 'Pay bills' is overdue.", time: "3 hours ago" },
  ];

  return NextResponse.json({ notifications: notifs });
}
