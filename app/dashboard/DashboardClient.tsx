"use client";

import { useSession } from "next-auth/react";
import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import toast from "react-hot-toast";


export default function DashboardClient() {
    // ✅ You can still use session here if needed

    const [todos, setTodos] = useState<Array<Todo & { dueDate?: Date }>>([]);
    const [input, setInput] = useState("");
    const [dueDate, setDueDate] = useState("");

    const { data: session, status } = useSession();

    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    // Fetch Todos
    const fetchTodos = async () => {
        const res = await fetch("/api/todos");
        const data = await res.json();

        console.log(" Todos:", data);
        if (!res.ok) {
            console.error("Failed to fetch todos:", data.error);
            setTodos([]);
            return;
        }
        setTodos(data);
    };

    useEffect(() => {
        if (session) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // ➕ Add Todo
    const addTodo = async () => {
        try {
            if (!input.trim()) return;

            const res = await fetch("/api/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ IMPORTANT
                body: JSON.stringify({
                    title: input,
                    dueDate: dueDate ? new Date(dueDate) : null,
                }),
            });

            const newTodo = await res.json(); //
            console.log("API Response:", newTodo);

            if (!res.ok) {
                throw new Error(newTodo.error || "Failed to add todo.");
                setTodos([]); //prevent crash
            }

            setTodos((prev) => [newTodo, ...prev]);
            setInput("");
            setDueDate("");

            toast.success("Todo added!");
        } catch (error) {
            console.error("Error adding todo:", error);
            toast.error("Failed to add todo.");
        }
    };

    // ❌ Delete
    const deleteTodo = async (id: number) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        await fetch("/api/todos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        toast.success("Todo deleted successfully!");
    };

    // ✏️ Update
    const updateTodo = async (id: number, newTitle: string) => {
        await fetch("/api/todos", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, title: newTitle }),
        });

        setTodos((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, title: newTitle } : t
            )
        );
        toast.success("Todo updated successfully!");
    };

    // ✔ Toggle
    const toggleTodo = async (id: number, completed: boolean) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed } : todo
            )
        );

        await fetch("/api/todos", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, completed }),
        });
        toast.success("Todo status updated!");
    };

    // Filter
    const filteredTodos = todos.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
    });

    //sorted todo - used inline in the render
    // const sortedTodos = [...todos].sort((a, b) => {
    //     if (!a.dueDate) return 1;
    //     if (!b.dueDate) return -1;
    //     return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    // });


    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6">

                <h1 className="text-3xl font-bold text-center mb-6">
                    📝 Todo App
                </h1>

                {/* Auth */}
                <div className="mb-4 text-center">
                    {session ? (
                        <>
                            <p className="mb-2 text-gray-600">
                                Welcome <span className="font-semibold">{session.user?.name}</span>
                            </p>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => signIn("google")}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                Google
                            </button>
                            <button
                                onClick={() => signIn("github")}
                                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                            >
                                GitHub
                            </button>
                        </div>
                    )}
                </div>
                {session ? (
                    <>
                        {/* Input + Date */}
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter a task..."
                                    disabled={!session}
                                    className="flex-1 border rounded-lg px-3 py-2"
                                />

                                <button
                                    onClick={addTodo}
                                    disabled={!session}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Add
                                </button>
                            </div>

                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="border p-2 rounded"
                            />

                        </div>

                        {/* Filters */}
                        <div className="flex justify-center gap-2 mb-4">
                            {["all", "active", "completed"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-lg border ${filter === f
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-600"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        {filteredTodos.length === 0 ? (
                            <p className="text-center text-gray-500 italic">
                                No tasks here 🚀
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {[...filteredTodos].sort((a, b) => {
                                    if (!a.dueDate) return 1;
                                    if (!b.dueDate) return -1;
                                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                                })
                                    .map((todo) => {
                                        const now = new Date();
                                        const due = todo.dueDate ? new Date(todo.dueDate) : null;

                                        let status = "";

                                        if (todo.completed) {
                                            status = "done";
                                        } else if (due && due < now) {
                                            status = "overdue";
                                        } else if (due && due.toDateString() === now.toDateString()) {
                                            status = "today";
                                        } else {
                                            status = "upcoming";
                                        }

                                        return (
                                            <li
                                                key={todo.id}
                                                className={`flex items-center justify-between border rounded-lg px-4 py-2 shadow-sm ${status === "overdue"
                                                    ? "bg-red-100"
                                                    : status === "today"
                                                        ? "bg-yellow-100"
                                                        : status === "upcoming"
                                                            ? "bg-green-100"
                                                            : "bg-gray-100"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={todo.completed}
                                                        onChange={() =>
                                                            toggleTodo(todo.id, !todo.completed)
                                                        }
                                                    />

                                                    {editingId === todo.id ? (
                                                        <input
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="border px-2 py-1 rounded"
                                                        />
                                                    ) : (
                                                        <div className={`${status === "done"
                                                            ? "line-through text-gray-400"
                                                            : status === "overdue"
                                                                ? "text-red-600 font-semibold"
                                                                : status === "today"
                                                                    ? "text-yellow-600 font-medium"
                                                                    : "text-gray-800"
                                                            }`}>
                                                            <span>{todo.title}</span> ✅
                                                            <p className="text-sm text-gray-500">
                                                                {todo.dueDate
                                                                    ? new Date(
                                                                        todo.dueDate
                                                                    ).toLocaleString()
                                                                    : "No due date"}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    {editingId === todo.id ? (
                                                        <button
                                                            onClick={() => {
                                                                updateTodo(todo.id, editText);
                                                                setEditingId(null);
                                                            }}
                                                            className="text-green-500"
                                                        >
                                                            ✔
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(todo.id);
                                                                setEditText(todo.title);
                                                            }}
                                                            className="text-blue-500"
                                                        >
                                                            ✏️
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => deleteTodo(todo.id)}
                                                        className="text-red-500"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ul>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500 italic">
                        Please sign in to manage your tasks 🚀
                    </p>
                )}
            </div>
        </main>
    );
}