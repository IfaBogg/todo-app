/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const { data: session } = useSession();

  // Removed invalid top-level JSX expression; authentication UI is handled in the return statement below.

  // Fetch Todos on mount
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    if (session) {
      fetchTodos();
    } else {
      setTodos([]); // clear when logged out
    }
  }, [session]);

  // ➕ Add Todo
  const addTodo = async () => {
    if (!input.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });

    const newTodo = await res.json();

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };


  // ❌ Delete Todo
  const deleteTodo = async (id: number) => {
    // instant remove from UI
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  // ✔ Toggle Complete
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
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>📝 Todo App</h1>

      {/* Auth */}
      {session ? (
        <div>
          <p>Welcome {session.user?.name}</p>
          <button type="button" onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => signIn("google")}>
            Sign in with Google
          </button>
          <button type="button" onClick={() => signIn("github")}>
            Sign in with GitHub
          </button>
        </div>
      )}

      {/* Input */}
      {session && (
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a task..."
          />
          <button onClick={addTodo}>Add</button>
        </div>
      )}

      {/* List */}
      {todos.length === 0 ? (
        <p>No tasks yet. Add one! 🚀</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, !todo.completed)}
              />

              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                  marginLeft: "8px",
                }}
              >
                {todo.title}
              </span>

              <button onClick={() => deleteTodo(todo.id)}>
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}