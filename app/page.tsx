/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // Fetch Todos on mount
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ➕ Add Todo
  const addTodo = async() => {
    if (!input.trim()) return;

    const tempTodo = {
      id: Date.now(),
      title: input,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setTodos((prev) => [tempTodo, ...prev]);
    setInput("");

    try {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input }),
      });
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
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
    const todo = todos.find((t) => t.id === id);

    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !todo?.completed}),
    });
  };

  return (
    <main style={{ padding: "20px" }}>
      <h1>📝 Todo App</h1>

      {/* Input */}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

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